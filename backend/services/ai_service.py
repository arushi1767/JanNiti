import os
import logging
import json
import requests

from dotenv import load_dotenv
load_dotenv()

from typing import List, Optional
from services.rag_service import rag_service
from models.schemas import ExplainerResponse, ELI5Response

logger = logging.getLogger("janniti.ai")

#GROQ_API_KEY = os.getenv("GROQ_API_KEY", "")
#GROQ_MODEL = os.getenv("GROQ_MODEL", "llama3-8b-8192")
GROQ_API_URL = "https://api.groq.com/openai/v1/chat/completions"
GROQ_TIMEOUT = int(os.getenv("GROQ_TIMEOUT", "30"))

SYSTEM_PROMPT = """You are JanNiti, India's first Policy Literacy AI. Your mission is to help Indian citizens understand government schemes and policies in simple language.

Key rules:
1. Always explain at Grade 6-8 reading level.
2. Use simple examples and analogies from everyday Indian life.
3. Always cite official sources (ministry, scheme name, last updated date).
4. Include a disclaimer that this is AI-generated guidance and does not replace official notifications.
5. Be honest about confidence levels.
6. When unsure, say so clearly.
7. Support queries in Hindi and other Indian languages.
8. Never provide legal advice - always recommend consulting official sources for final decisions."""

LANGUAGE_NAMES = {
    "en": "English", "hi": "Hindi", "bn": "Bengali", "te": "Telugu",
    "ta": "Tamil", "mr": "Marathi", "gu": "Gujarati", "kn": "Kannada",
    "ml": "Malayalam", "pa": "Punjabi",
}

def _lang_instruction(language: str) -> str:
    name = LANGUAGE_NAMES.get(language, language)
    return f"Respond in {name}."

def llm_chat(messages: list, json_mode: bool = False) -> str:
    if not GROQ_API_KEY:
        logger.error("GROQ_API_KEY not set")
        if json_mode:
            return json.dumps({"error": "AI service not configured"})
        return "AI service is not configured. Please set the GROQ_API_KEY environment variable."

    payload = {
        "model": GROQ_MODEL,
        "messages": messages,
        "max_tokens": 1500,
        "temperature": 0.3,
    }
    if json_mode:
        payload["response_format"] = {"type": "json_object"}

    try:
        resp = requests.post(
            GROQ_API_URL,
            headers={"Authorization": f"Bearer {GROQ_API_KEY}", "Content-Type": "application/json"},
            json=payload,
            timeout=GROQ_TIMEOUT,
        )
        resp.raise_for_status()
        data = resp.json()
        return data["choices"][0]["message"]["content"]
    except requests.exceptions.Timeout:
        logger.error("Groq API timed out")
        if json_mode:
            return json.dumps({"error": "Request timed out"})
        return "The request timed out. Please try again."
    except requests.exceptions.HTTPError as e:
        logger.error(f"Groq API HTTP error: {e} — {resp.text}")
        if json_mode:
            return json.dumps({"error": "AI service error"})
        return "AI service encountered an error. Please try again."
    except Exception as e:
        logger.error(f"Groq API failed: {e}")
        if json_mode:
            return json.dumps({"error": "AI service unavailable"})
        return "AI service is currently unavailable. Please try again later."


def _get_confidence(has_source: bool, has_recent_data: bool, rag_results_count: int) -> str:
    if has_source and has_recent_data and rag_results_count >= 3:
        return "High"
    elif has_source and rag_results_count >= 1:
        return "Medium"
    return "Low"


def _safe_json(content: str) -> dict:
    """Parse JSON, stripping markdown fences if present."""
    text = content.strip()
    if text.startswith("```"):
        text = text.split("```", 2)[1]
        if text.startswith("json"):
            text = text[4:]
        text = text.rsplit("```", 1)[0]
    try:
        return json.loads(text.strip())
    except json.JSONDecodeError:
        return {}


def generate_explainer(query: str, language: str = "en", state: Optional[str] = None) -> ExplainerResponse:
    rag_results = rag_service.search(query, top_k=5, language=language)
    context = "\n\n".join([r["text"] for r in rag_results])

    if not rag_results:
        return ExplainerResponse(
            title=query,
            what_is="This information is not available in the official records currently loaded into JanNiti.",
            why_introduced="Information unavailable.",
            benefits=[],
            eligibility=[],
            documents=[],
            how_to_apply="Not available.",
            deadlines="Not available.",
            misunderstood_clauses=[],
            source="Official records not found",
            ministry="Unknown",
            last_updated="N/A",
            confidence="Low",
            disclaimer="This is AI-generated guidance based on publicly available information. Please verify with official government sources before applying.",
        )

    prompt = f"""{_lang_instruction(language)}

Based on the following official information, explain this government scheme in simple language (Grade 6-8 level).

Context from official sources:
{context}

User query: {query}
{f"State: {state}" if state else ""}

Respond ONLY with a JSON object with these exact keys:
- title: Name of the scheme
- what_is: Simple explanation of what this scheme is
- why_introduced: Why the government introduced it (string)
- benefits: Array of benefit strings
- eligibility: Array of eligibility criteria strings
- documents: Array of required document strings
- how_to_apply: Steps to apply as a single paragraph string
- deadlines: Deadlines as a single string, or "No strict deadline"
- misunderstood_clauses: Array of commonly misunderstood points
- source: Official source name
- ministry: Ministry name
- last_updated: Date of last update
- confidence: One of: High, Medium, Low
- disclaimer: "This is AI-generated guidance based on publicly available information. Please verify with official government sources before applying."

Use analogies from daily Indian life (chit fund, ration shop, cooperative society, etc.)."""

    content = llm_chat(
        messages=[
            {"role": "system", "content": SYSTEM_PROMPT},
            {"role": "user", "content": prompt},
        ],
        json_mode=True,
    )

    data = _safe_json(content)
    if not data or "error" in data:
        return ExplainerResponse(
            title=query,
            what_is="Unable to generate explanation at this time.",
            why_introduced="Information temporarily unavailable.",
            benefits=["Please try again later."],
            eligibility=["Please try again later."],
            documents=["Please try again later."],
            how_to_apply="Please try again later or contact the ministry directly.",
            deadlines=None,
            misunderstood_clauses=[],
            source="JanNiti AI",
            ministry="Various",
            last_updated="N/A",
            confidence="Low",
            disclaimer="This is AI-generated guidance based on publicly available information. Please verify with official government sources before applying.",
        )

    # Coerce LLM output types to match schema
    for field in ("how_to_apply", "why_introduced", "deadlines"):
        if isinstance(data.get(field), list):
            data[field] = "\n".join(data[field]) if data[field] else None

    has_recent = any(yr in str(data.get("last_updated", "")) for yr in ("2024", "2025", "2026"))
    data["confidence"] = _get_confidence(
        bool(data.get("source") and data["source"] not in ("General knowledge", "")),
        has_recent,
        len(rag_results),
    )

    try:
        return ExplainerResponse(**data)
    except Exception as e:
        logger.error(f"ExplainerResponse validation error: {e} — data keys: {list(data.keys())}")
        return ExplainerResponse(
            title=data.get("title", query),
            what_is=data.get("what_is", "Unable to generate explanation."),
            why_introduced=data.get("why_introduced", "N/A"),
            benefits=data.get("benefits", []),
            eligibility=data.get("eligibility", []),
            documents=data.get("documents", []),
            how_to_apply=data.get("how_to_apply", "Please contact the ministry directly."),
            deadlines=data.get("deadlines"),
            misunderstood_clauses=data.get("misunderstood_clauses", []),
            source=data.get("source", "JanNiti AI"),
            ministry=data.get("ministry", "Various"),
            last_updated=data.get("last_updated", "N/A"),
            confidence="Low",
            disclaimer="This is AI-generated guidance based on publicly available information. Please verify with official government sources before applying.",
        )


def detect_conditions(query: str, language: str = "en") -> dict:
    rag_results = rag_service.search(query, top_k=10, language=language)
    context = "\n\n".join([r["text"] for r in rag_results])

    prompt = f"""{_lang_instruction(language)}

Analyze this government scheme's text and identify ALL hidden conditions, exclusions, obligations, penalties, and tricky clauses.

Scheme text:
{context if context else query}

Respond ONLY with a JSON object with:
- conditions: Array of objects each with:
  - text: The condition text
  - severity: "green" (general info), "yellow" (read carefully), "red" (important alert)
  - explanation: Why this matters in simple language
- summary: A short summary of the key risks

Severity guide:
- GREEN: Standard information, general requirements
- YELLOW: Ongoing obligations, documentation requirements, income limits
- RED: Penalties, exclusion clauses, legal consequences, disqualification conditions"""

    content = llm_chat(
        messages=[
            {"role": "system", "content": SYSTEM_PROMPT},
            {"role": "user", "content": prompt},
        ],
        json_mode=True,
    )

    result = _safe_json(content)
    return result if result and "conditions" in result else {"conditions": [], "summary": "Unable to analyze conditions at this time."}


def generate_eli5(query: str, language: str = "en") -> ELI5Response:
    rag_results = rag_service.search(query, top_k=3, language=language)
    context = "\n\n".join([r["text"] for r in rag_results])

    prompt = f"""{_lang_instruction(language)}

Explain this government scheme as if talking to a 12-year-old. Use a simple story with everyday Indian examples.

Context: {context if context else query}

Respond ONLY with a JSON object with:
- story: A short story (2-3 sentences) using characters like Ravi, Priya, or a village family
- simple_explanation: One paragraph ultra-simple explanation
- everyday_example: Compare it to something from daily life (vegetables, savings, family decision)
- key_takeaway: One sentence bottom line

Make it warm, friendly, and easy to remember. Use Indian names and settings."""

    content = llm_chat(
        messages=[
            {"role": "system", "content": SYSTEM_PROMPT},
            {"role": "user", "content": prompt},
        ],
        json_mode=True,
    )

    data = _safe_json(content)
    if not data:
        return ELI5Response(
            story="Once upon a time, there was a government scheme that helped families...",
            simple_explanation="This scheme helps people in need.",
            everyday_example="Like saving money in a piggy bank for a rainy day.",
            key_takeaway="This scheme is designed to help you.",
        )
    try:
        return ELI5Response(**data)
    except Exception:
        return ELI5Response(
            story=data.get("story", ""),
            simple_explanation=data.get("simple_explanation", ""),
            everyday_example=data.get("everyday_example", ""),
            key_takeaway=data.get("key_takeaway", ""),
        )


def compare_schemes(scheme1: str, scheme2: str, language: str = "en") -> dict:
    rag1 = rag_service.search(scheme1, top_k=5, language=language)
    rag2 = rag_service.search(scheme2, top_k=5, language=language)

    ctx1 = "\n\n".join([r["text"] for r in rag1])
    ctx2 = "\n\n".join([r["text"] for r in rag2])

    prompt = f"""{_lang_instruction(language)}

Compare these two Indian government schemes side by side.

SCHEME 1: {scheme1}
Context: {ctx1 if ctx1 else "No official records found."}

SCHEME 2: {scheme2}
Context: {ctx2 if ctx2 else "No official records found."}

Respond ONLY with a JSON object with:
- scheme1_name: Name of first scheme
- scheme2_name: Name of second scheme
- comparisons: Array of objects, each with:
  - aspect: What is being compared (Benefits, Eligibility, Documents Needed, Application Process, Target Audience, Coverage, Deadlines, Hidden Conditions)
  - scheme1_value: Value for scheme 1 in simple language
  - scheme2_value: Value for scheme 2 in simple language
- recommendation: Which scheme might be better for a typical citizen and why

Make comparisons fair, factual, and easy to understand."""

    content = llm_chat(
        messages=[
            {"role": "system", "content": SYSTEM_PROMPT},
            {"role": "user", "content": prompt},
        ],
        json_mode=True,
    )

    result = _safe_json(content)
    if not result:
        return {
            "scheme1_name": scheme1,
            "scheme2_name": scheme2,
            "comparisons": [],
            "recommendation": "Unable to generate comparison at this time.",
        }
    return result


def chat_with_ai(message: str, conversation_history: Optional[List[dict]] = None, language: str = "en") -> dict:
    rag_results = rag_service.search(message, top_k=5, language=language)
    context = "\n\n".join([r["text"] for r in rag_results])

    system_msg = f"""{SYSTEM_PROMPT}
{_lang_instruction(language)}

Current conversation context from official sources:
{context if context else "No relevant context found in the database."}

IMPORTANT:
- Use ONLY the official context above.
- If the answer is not present, clearly state that the information is not available.
- Do not use outside knowledge.
- Answer naturally and simply. Cite sources."""

    messages = [{"role": "system", "content": system_msg}]
    if conversation_history:
        messages.extend(conversation_history[-10:])
    messages.append({"role": "user", "content": message})

    reply = llm_chat(messages=messages, json_mode=False)

    sources = list({r["metadata"].get("source", "Official source") for r in rag_results if r.get("metadata")})[:3]
    if not sources:
        sources = ["General knowledge"]

    has_recent = any(yr in s for s in sources for yr in ("2024", "2025", "2026"))
    confidence = "High" if (sources[0] != "General knowledge" and has_recent) else "Medium" if sources[0] != "General knowledge" else "Low"

    return {"reply": reply, "sources": sources, "confidence": confidence}
