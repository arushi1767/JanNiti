import os
import logging
import ollama
from typing import List, Optional
from services.rag_service import rag_service
from models.schemas import ExplainerResponse, ELI5Response
import json

logger = logging.getLogger("janniti.ai")

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

_ollama_client = ollama.Client(timeout=5.0)

def llama_chat(messages, json_mode=False):
    try:
        response = _ollama_client.chat(
            model="phi3:mini",
            messages=messages,
            format="json" if json_mode else None,
        )
        return response["message"]["content"]
    except Exception as e:
        logger.warning(f"Ollama call failed: {e}")
        if json_mode:
            return json.dumps({"error": "AI service temporarily unavailable"})
        return "I'm sorry, the AI service is currently unavailable. Please try again later."

def _get_confidence(has_source: bool, has_recent_data: bool, rag_results_count: int) -> str:
    if has_source and has_recent_data and rag_results_count >= 3:
        return "High"
    elif has_source and rag_results_count >= 1:
        return "Medium"
    return "Low"

def generate_explainer(query: str, language: str = "en", state: Optional[str] = None) -> ExplainerResponse:
    rag_results = rag_service.search(query, top_k=5, language=language)
    context = "\n\n".join([r['text'] for r in rag_results])

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
            disclaimer="This is AI-generated guidance based on publicly available information. Please verify with official government sources before applying."
        )

    lang_instruction = f"Respond in {'Hindi' if language == 'hi' else language if language != 'en' else 'English'}."

    prompt = f"""{lang_instruction}

Based on the following official information, explain this government scheme in simple language (Grade 6-8 level).

Context from official sources:
{context}

User query: {query}
{f"State: {state}" if state else ""}

Please provide a structured response as JSON with these exact keys:
- title: Name of the scheme
- what_is: Simple explanation of what this scheme is
- why_introduced: Why the government introduced it
- benefits: Array of benefits (list each benefit)
- eligibility: Array of eligibility criteria
- documents: Array of required documents
- how_to_apply: A single paragraph describing steps to apply in simple language (a string, NOT an array)
- deadlines: Any deadlines or application windows as a single string, or "No strict deadline" if not applicable (a string, NOT an array)
- misunderstood_clauses: Array of commonly misunderstood points
- source: Official source name
- ministry: Ministry name
- last_updated: Date of last update
- confidence: One of: High, Medium, Low
- disclaimer: "This is AI-generated guidance based on publicly available information. Please verify with official government sources before applying."

Use analogies from daily Indian life. For example, compare schemes to things like:
- A family savings plan (chit fund)
- A school scholarship
- A community well
- A ration shop
- A cooperative society"""

    content = llama_chat(
        messages=[
            {"role": "system", "content": SYSTEM_PROMPT},
            {"role": "user", "content": prompt}
        ],
        json_mode=True
    )

    try:
        data = json.loads(content)
        # Coerce LLM output types to match schema
        if isinstance(data.get("how_to_apply"), list):
            data["how_to_apply"] = "\n".join(data["how_to_apply"])
        if isinstance(data.get("deadlines"), list):
            data["deadlines"] = "\n".join(data["deadlines"]) if data["deadlines"] else None
        if isinstance(data.get("why_introduced"), list):
            data["why_introduced"] = "\n".join(data["why_introduced"])
        has_recent = "2024" in data.get("last_updated", "") or "2025" in data.get("last_updated", "")
        data["confidence"] = _get_confidence(
            bool(data.get("source") and data["source"] != "General knowledge"),
            has_recent,
            len(rag_results)
        )
        return ExplainerResponse(**data)
    except (json.JSONDecodeError, Exception) as e:
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
            disclaimer="This is AI-generated guidance based on publicly available information. Please verify with official government sources before applying."
        )


def detect_conditions(query: str, language: str = "en") -> dict:
    rag_results = rag_service.search(query, top_k=10, language=language)
    context = "\n\n".join([r['text'] for r in rag_results])

    lang_instruction = f"Respond in {'Hindi' if language == 'hi' else language if language != 'en' else 'English'}."

    prompt = f"""{lang_instruction}

Analyze this government scheme's text and identify ALL hidden conditions, exclusions, obligations, penalties, and tricky clauses.

Scheme text:
{context if context else query}

Return JSON with:
- conditions: Array of objects each with:
  - text: The condition text
  - severity: "green" (general info), "yellow" (read carefully), "red" (important alert)
  - explanation: Why this matters in simple language
- summary: A short summary of the key risks

For severity:
- GREEN: Standard information, eligibility criteria, general requirements
- YELLOW: Conditions that need careful reading, ongoing obligations, documentation requirements, income limits
- RED: Penalties for wrong information, exclusion clauses, disqualification conditions, legal consequences, ambiguous terms"""

    content = llama_chat(
        messages=[
            {"role": "system", "content": SYSTEM_PROMPT},
            {"role": "user", "content": prompt}
        ],
        json_mode=True
    )

    try:
        return json.loads(content)
    except json.JSONDecodeError:
        return {"conditions": [], "summary": "Unable to analyze conditions at this time."}


def generate_eli5(query: str, language: str = "en") -> ELI5Response:
    rag_results = rag_service.search(query, top_k=3, language=language)
    context = "\n\n".join([r['text'] for r in rag_results])

    lang_instruction = f"Respond in {'Hindi' if language == 'hi' else language if language != 'en' else 'English'}."

    prompt = f"""{lang_instruction}

Explain this government scheme as if you're talking to a 12-year-old. Use a simple story and everyday examples.

Context: {context if context else query}

Return JSON with:
- story: A short story (2-3 sentences) using characters like Ravi, Priya, or a family from a village
- simple_explanation: One paragraph ultra-simple explanation
- everyday_example: Compare it to something from daily life (like buying vegetables, saving pocket money, or a family decision)
- key_takeaway: One sentence bottom line

Make it warm, friendly, and easy to remember. Use Indian names and settings."""

    content = llama_chat(
        messages=[
            {"role": "system", "content": SYSTEM_PROMPT},
            {"role": "user", "content": prompt}
        ],
        json_mode=True
    )

    try:
        data = json.loads(content)
        return ELI5Response(**data)
    except json.JSONDecodeError:
        return ELI5Response(
            story="Once upon a time, there was a scheme...",
            simple_explanation="This scheme helps people.",
            everyday_example="Like saving money in a piggy bank.",
            key_takeaway="This scheme is designed to help you."
        )


def compare_schemes(scheme1: str, scheme2: str, language: str = "en") -> dict:
    rag_results1 = rag_service.search(scheme1, top_k=5, language=language)
    rag_results2 = rag_service.search(scheme2, top_k=5, language=language)

    context1 = "\n\n".join([r['text'] for r in rag_results1])
    context2 = "\n\n".join([r['text'] for r in rag_results2])

    lang_instruction = f"Respond in {'Hindi' if language == 'hi' else language if language != 'en' else 'English'}."

    prompt = f"""{lang_instruction}

Compare these two Indian government schemes side by side.

SCHEME 1: {scheme1}
Context: {context1 if context1 else "No official records found."}

SCHEME 2: {scheme2}
Context: {context2 if context2 else "No official records found."}

Return JSON with:
- scheme1_name: Name of first scheme
- scheme2_name: Name of second scheme
- comparisons: Array of objects, each with:
  - aspect: What is being compared (e.g., "Benefits", "Eligibility", "Documents Needed", "Application Process", "Target Audience", "Coverage", "Deadlines", "Hidden Conditions")
  - scheme1_value: Value for scheme 1 in simple language
  - scheme2_value: Value for scheme 2 in simple language
- recommendation: Which scheme might be better for a typical citizen and why (or "Depends on individual circumstances")

Make comparisons fair, factual, and easy to understand."""

    content = llama_chat(
        messages=[
            {"role": "system", "content": SYSTEM_PROMPT},
            {"role": "user", "content": prompt}
        ],
        json_mode=True
    )

    try:
        return json.loads(content)
    except json.JSONDecodeError:
        return {
            "scheme1_name": scheme1,
            "scheme2_name": scheme2,
            "comparisons": [],
            "recommendation": "Unable to generate comparison at this time."
        }


def chat_with_ai(message: str, conversation_history: Optional[List[dict]] = None, language: str = "en") -> dict:
    rag_results = rag_service.search(message, top_k=5, language=language)
    context = "\n\n".join([r['text'] for r in rag_results])

    lang_instruction = f"Respond in {'Hindi' if language == 'hi' else language if language != 'en' else 'English'}."

    system_msg = f"""{SYSTEM_PROMPT}
{lang_instruction}

Current conversation context from official sources:
{context}

IMPORTANT:
- Use ONLY the official context above.
- If the answer is not present, clearly state that the information is not available in the currently loaded records.
- Do not use outside knowledge.

Answer the user's question naturally. If they ask:
- "Do I qualify?" -> Check eligibility, ask clarifying questions about their situation
- "Is there any catch?" -> Point to hidden conditions
- "What happens if I provide wrong information?" -> Explain penalties clearly
- "Compare this with another scheme" -> Explain key differences
- General questions -> Answer simply and clearly

Always cite sources in your response. Use simple language."""

    messages = [{"role": "system", "content": system_msg}]
    if conversation_history:
        messages.extend(conversation_history[-10:])
    messages.append({"role": "user", "content": message})

    reply = llama_chat(messages=messages, json_mode=False)

    sources = [r['metadata'].get('source', 'Official source') for r in rag_results if r.get('metadata')]
    sources = list(set(sources))[:3] if sources else ["General knowledge"]

    has_recent = any("2024" in s or "2025" in s for s in sources)
    confidence = "High" if (sources[0] != "General knowledge" and has_recent) else "Medium" if sources[0] != "General knowledge" else "Low"

    return {
        "reply": reply,
        "sources": sources,
        "confidence": confidence
    }



