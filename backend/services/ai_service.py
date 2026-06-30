"""
AI feature layer: explainer, hidden-conditions, ELI5, compare, chat.

Now uses the hosted LLM (services.llm) instead of local Ollama, so it works
when deployed. Other fixes:
  * dynamic recency check (no more hardcoded 2024/2025).
  * faithfulness scoring added to chat + explainer (RAGAS/POLIS-Bench).
  * internal "LLM unavailable" sentinel no longer leaks to the frontend.
"""
import logging
from datetime import datetime
from typing import List, Optional

import config
from services.rag_service import rag_service
from services.llm import llm_chat, parse_json_or_none, LLM_UNAVAILABLE
from services import faithfulness
from services import extractive
from models.schemas import ExplainerResponse, ELI5Response

logger = logging.getLogger("janniti.ai")

SYSTEM_PROMPT = """You are JanNiti, India's Policy Literacy AI. You help Indian citizens understand government schemes in simple language.
Rules:
1. Explain at a Grade 6-8 reading level with everyday Indian analogies.
2. Use ONLY the official context provided. If the answer isn't there, say it isn't available in the loaded records.
3. Always cite the scheme/source. Be honest about confidence.
4. Add a disclaimer that this is AI guidance, not an official notification.
5. Never give legal advice; recommend official sources for final decisions.
6. Answer in the language requested."""

_RECENT_YEARS = {str(datetime.now().year), str(datetime.now().year - 1)}


def _lang(language: str) -> str:
    name = {"hi": "Hindi", "bn": "Bengali", "ta": "Tamil", "te": "Telugu",
            "mr": "Marathi", "gu": "Gujarati", "kn": "Kannada", "ml": "Malayalam",
            "pa": "Punjabi", "or": "Odia"}.get(language, "English" if language == "en" else language)
    return f"Respond entirely in {name}."


def _confidence(has_source: bool, has_recent: bool, n: int) -> str:
    if has_source and has_recent and n >= 3:
        return "High"
    if has_source and n >= 1:
        return "Medium"
    return "Low"


def _fallback_explainer(query: str, msg: str) -> ExplainerResponse:
    return ExplainerResponse(
        title=query, what_is=msg, why_introduced="Information unavailable.",
        benefits=[], eligibility=[], documents=[], how_to_apply="Not available.",
        deadlines=None, misunderstood_clauses=[], source="Official records not found",
        ministry="Unknown", last_updated="N/A", confidence="Low",
        disclaimer="This is AI-generated guidance. Please verify with official government sources before applying.",
    )


def generate_explainer(query: str, language: str = "en", state: Optional[str] = None) -> ExplainerResponse:
    rag_results = rag_service.search(query, top_k=5, language=language)
    context = "\n\n".join(r["text"] for r in rag_results)
    if not rag_results:
        return _fallback_explainer(query, "This information is not in the official records currently loaded into JanNiti.")

    prompt = f"""{_lang(language)}

Based ONLY on the official context below, explain this scheme simply (Grade 6-8).

Context:
{context}

User query: {query}
{f"State: {state}" if state else ""}

Return JSON with keys: title, what_is, why_introduced, benefits (array), eligibility (array),
documents (array), how_to_apply (string), deadlines (string or null), misunderstood_clauses (array),
source, ministry, last_updated, confidence (High/Medium/Low),
disclaimer ("This is AI-generated guidance based on publicly available information. Please verify with official government sources before applying.")."""

    content = llm_chat(
        messages=[{"role": "system", "content": SYSTEM_PROMPT}, {"role": "user", "content": prompt}],
        json_mode=True,
    )
    data = parse_json_or_none(content)
    if data is None:
        # LLM down/out of credit -> show the real official text from retrieval
        return ExplainerResponse(**extractive.build_explainer(query, rag_results, language))

    for k in ("how_to_apply", "why_introduced"):
        if isinstance(data.get(k), list):
            data[k] = "\n".join(str(x) for x in data[k])
    if isinstance(data.get("deadlines"), list):
        data["deadlines"] = "\n".join(data["deadlines"]) if data["deadlines"] else None

    has_recent = any(y in str(data.get("last_updated", "")) for y in _RECENT_YEARS)
    data["confidence"] = _confidence(
        bool(data.get("source") and data["source"] != "General knowledge"),
        has_recent, len(rag_results),
    )
    try:
        return ExplainerResponse(**data)
    except Exception as e:
        logger.error(f"Explainer schema error: {e}; data keys={list(data.keys())}")
        return ExplainerResponse(**extractive.build_explainer(query, rag_results, language))


def detect_conditions(query: str, language: str = "en") -> dict:
    rag_results = rag_service.search(query, top_k=10, language=language)
    context = "\n\n".join(r["text"] for r in rag_results)
    prompt = f"""{_lang(language)}

From the scheme text below, list hidden conditions, exclusions, obligations, and penalties.

Scheme text:
{context if context else query}

Return JSON: {{"conditions": [{{"text","severity"(green|yellow|red),"explanation"}}], "summary": "..."}}.
green=general info, yellow=read carefully, red=penalties/exclusions/disqualification."""
    data = parse_json_or_none(llm_chat(
        messages=[{"role": "system", "content": SYSTEM_PROMPT}, {"role": "user", "content": prompt}],
        json_mode=True))
    if data is None:
        return extractive.build_conditions(rag_results)
    data.setdefault("conditions", [])
    data.setdefault("summary", "")
    return data


def generate_eli5(query: str, language: str = "en") -> ELI5Response:
    rag_results = rag_service.search(query, top_k=3, language=language)
    context = "\n\n".join(r["text"] for r in rag_results)
    prompt = f"""{_lang(language)}

Explain this scheme to a 12-year-old using a short story and an everyday example.
Context: {context if context else query}
Return JSON: {{"story","simple_explanation","everyday_example","key_takeaway"}}. Use Indian names/settings."""
    data = parse_json_or_none(llm_chat(
        messages=[{"role": "system", "content": SYSTEM_PROMPT}, {"role": "user", "content": prompt}],
        json_mode=True))
    if data is None:
        return ELI5Response(
            story="We couldn't reach the AI just now.",
            simple_explanation="Please try again in a moment.",
            everyday_example="Like a shop that's briefly closed — it'll reopen.",
            key_takeaway="Try again shortly.")
    try:
        return ELI5Response(**data)
    except Exception:
        return ELI5Response(story=data.get("story", ""), simple_explanation=data.get("simple_explanation", ""),
                            everyday_example=data.get("everyday_example", ""), key_takeaway=data.get("key_takeaway", ""))


def compare_schemes(scheme1: str, scheme2: str, language: str = "en") -> dict:
    c1 = "\n\n".join(r["text"] for r in rag_service.search(scheme1, top_k=5, language=language))
    c2 = "\n\n".join(r["text"] for r in rag_service.search(scheme2, top_k=5, language=language))
    prompt = f"""{_lang(language)}

Compare these two Indian government schemes side by side.
SCHEME 1: {scheme1}
Context: {c1 or "No official records found."}
SCHEME 2: {scheme2}
Context: {c2 or "No official records found."}
Return JSON: {{"scheme1_name","scheme2_name","comparisons":[{{"aspect","scheme1_value","scheme2_value"}}],"recommendation"}}."""
    data = parse_json_or_none(llm_chat(
        messages=[{"role": "system", "content": SYSTEM_PROMPT}, {"role": "user", "content": prompt}],
        json_mode=True))
    if data is None:
        return {"scheme1_name": scheme1, "scheme2_name": scheme2, "comparisons": [],
                "recommendation": "Comparison is unavailable right now. Please try again."}
    return data


def recommend_for_profile(scheme1: str, scheme2: str, profile: dict, language: str = "en") -> dict:
    """Given two schemes and a citizen's profile, recommend which fits better — grounded in the documents."""
    c1 = "\n\n".join(r["text"] for r in rag_service.search(scheme1, top_k=5, language=language))
    c2 = "\n\n".join(r["text"] for r in rag_service.search(scheme2, top_k=5, language=language))
    # build a readable profile line, skipping blanks
    parts = []
    for label, key in [("Age", "age"), ("State", "state"), ("Gender", "gender"),
                       ("Occupation", "occupation"), ("Annual income", "income"),
                       ("Category", "category")]:
        v = (profile or {}).get(key)
        if v: parts.append(f"{label}: {v}")
    profile_str = "; ".join(parts) if parts else "No specific details provided."
    prompt = f"""{_lang(language)}

A citizen wants to know which of these two schemes suits THEM better.
Their details — {profile_str}

SCHEME 1: {scheme1}
Official context: {c1 or "No official records found."}

SCHEME 2: {scheme2}
Official context: {c2 or "No official records found."}

Using ONLY the official context, decide which scheme fits this person better based on their details (eligibility, income limits, age, occupation, category, state). Speak in warm, plain language — no markdown symbols, no #, no **bold**, no tables. Explain WHY in 2-4 short sentences a citizen can understand. If the documents don't contain enough to decide, say so honestly and tell them what detail or official source would help.
Return JSON: {{"recommended_scheme","reasoning"}}."""
    data = parse_json_or_none(llm_chat(
        messages=[{"role": "system", "content": SYSTEM_PROMPT}, {"role": "user", "content": prompt}],
        json_mode=True))
    if data is None:
        return {"recommended_scheme": "", "reasoning": "Recommendation is unavailable right now. Please try again."}
    return data


def chat_with_ai(message: str, conversation_history: Optional[List[dict]] = None, language: str = "en") -> dict:
    rag_results = rag_service.search(message, top_k=8, language=language)
    context = "\n\n".join(r["text"] for r in rag_results)
    system_msg = f"""You are JanNiti, a warm, patient government welfare advisor helping an Indian citizen.
{_lang(language)}

HOW TO WRITE (very important):
- Be CRISP and SHORT. Most answers should be 3 to 6 simple points, not long paragraphs. A citizen will not read a wall of text.
- Lead with the direct answer in one short line. Then give the key facts as short, separate points, each on its own line starting with a dash (-).
- Each point should be one short sentence. Keep total answer under about 120 words unless the person asks for more detail.
- Plain, warm, everyday language for someone with limited education. No #, no **bold**, no | tables |, no --- lines, no emojis. A simple dash (-) at the start of each point is fine.
- No phrases like "as an AI" or "based on the context". Just help directly.

MATCHING SCHEMES:
- Citizens use everyday names. Treat these as the SAME scheme: "PM Kisan" / "PM-KISAN" / "Pradhan Mantri Kisan Samman Nidhi" / "Kisan Samman Nidhi" all mean the PM-KISAN farmer income scheme. Match flexibly on meaning, not exact spelling.
- If the official information below clearly covers the scheme the person is asking about (even under a slightly different name), USE it and answer fully. Do not say it's unavailable just because the name is spelled differently.
- Only say you don't have it if nothing in the information below relates to their question. In that case, gently suggest they check the official portal myscheme.gov.in.

Official information you can use:
{context}

End with ONE short line: remind them to confirm on the official website before applying. Keep the whole reply brief and scannable."""
    messages = [{"role": "system", "content": system_msg}]
    if conversation_history:
        for m in conversation_history[-10:]:
            if isinstance(m, dict) and m.get("role") in ("user", "assistant") and m.get("content"):
                messages.append({"role": m["role"], "content": str(m["content"])})
    messages.append({"role": "user", "content": message})

    reply = llm_chat(messages=messages, json_mode=False)
    if reply == LLM_UNAVAILABLE:
        ext = extractive.build_chat_reply(message, rag_results)
        srcs = list({(r.get("metadata") or {}).get("name") or (r.get("metadata") or {}).get("source", "Official source")
                     for r in rag_results if r.get("metadata")})[:3]
        return {"reply": ext, "sources": srcs or ["No official source matched"],
                "confidence": "Medium" if rag_results else "Low", "faithfulness": None, "grounded": bool(rag_results)}

    sources = list({r["metadata"].get("name") or r["metadata"].get("source", "Official source")
                    for r in rag_results if r.get("metadata")})[:3] or ["No official source matched"]

    score, grounded, _ = (faithfulness.score(reply, context) if (config.ENABLE_FAITHFULNESS and context)
                          else (1.0, True, []))
    confidence = faithfulness.label(score) if context else "Low"
    return {"reply": reply, "sources": sources, "confidence": confidence,
            "faithfulness": score, "grounded": grounded}
