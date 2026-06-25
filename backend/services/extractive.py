"""
Extractive fallback — build a real, useful answer straight from the retrieved
official scheme text, WITHOUT needing the LLM.

This is what makes the app work even when OpenAI is out of credit or slow:
instead of showing "Official records not found", we surface the actual indexed
PDF content (benefits, eligibility, documents, how-to-apply) pulled from the
retrieved chunks. When the LLM *is* available it still takes over and writes a
polished, translated answer; this is the graceful floor beneath it.

IMPROVEMENT: Now uses section metadata from structured Markdown ingestion to
properly classify content instead of just keyword matching. Sections like
"Key Benefits", "Eligibility Criteria", etc. are preserved from the knowledge base.
"""
import re
from typing import List, Optional, Dict

_SENT = re.compile(r"(?<=[.!?])\s+|\n+")

# Mapping of section names in markdown to response field names
SECTION_MAP = {
    "benefits": ["Key Benefits", "Benefits", "What are the benefits"],
    "eligibility": ["Eligibility Criteria", "Eligibility", "Who is eligible"],
    "documents": ["Required Documents", "Documents Required", "Documents"],
    "apply": ["Application Process", "How to Apply", "Application"],
    "dates": ["Important Dates", "Dates", "Deadlines"],
    "clauses": ["Misunderstood Clauses", "Important Clauses", "Terms and Conditions"],
}

# Fallback keyword cues if section metadata is not available
CUES = {
    "benefits": ["benefit", "assistance", "amount", "provides", "provided", "support",
                 "pension", "insurance", "cover", "coverage", "installment", "instalment",
                 "subsidy", "grant", "scholarship", "rs.", "rs ", "₹", "rupees", "per year",
                 "per month", "financial"],
    "eligibility": ["eligib", "applicant", "must be", "should be", "age ", "income",
                    "farmer", "resident", "citizen", "criteria", "qualify", "beneficiary",
                    "below poverty", "bpl", "category", "years of age"],
    "documents": ["document", "aadhaar", "aadhar", "ration card", "certificate", "proof",
                  "bank account", "passbook", "photograph", "id card", "identity"],
    "apply": ["apply", "application", "portal", "register", "registration", "online",
              "csc", "common service", "website", "form", "submit"],
    "dates": ["date", "deadline", "last date", "closing date", "valid until", "expires",
              "expiry", "start date", "end date", "apply by", "due date"],
    "clauses": ["exclud", "not eligible", "penal", "terminat", "premium", "repay",
                "recover", "disqualif", "lapse", "forfeit", "discontinu", "deduct"],
}


def _sentences(text: str) -> List[str]:
    """Split text into sentences, filtering by length."""
    out = []
    for s in _SENT.split(text or ""):
        s = re.sub(r"\s+", " ", s).strip()
        if 25 <= len(s) <= 320:
            out.append(s)
    return out


def _pick(sents: List[str], key: str, limit: int = 5) -> List[str]:
    """Fallback: pick sentences using keyword cues (if section metadata not available)."""
    cues = CUES[key]
    hits, seen = [], set()
    for s in sents:
        low = s.lower()
        if any(c in low for c in cues):
            k = low[:60]
            if k not in seen:
                seen.add(k)
                hits.append(s)
        if len(hits) >= limit:
            break
    return hits


def _is_section_match(section_title: str, field_key: str) -> bool:
    """Check if a retrieved section title matches the field we're looking for."""
    section_lower = section_title.lower()
    for target_section in SECTION_MAP.get(field_key, []):
        if target_section.lower() in section_lower or section_lower in target_section.lower():
            return True
    return False


def _extract_sections_by_metadata(rag_results: List[dict]) -> Dict[str, List[str]]:
    """Extract content grouped by section metadata from structured markdown ingestion."""
    sections = {
        "benefits": [],
        "eligibility": [],
        "documents": [],
        "apply": [],
        "dates": [],
        "clauses": [],
    }
    seen = set()
    
    for result in rag_results:
        text = result.get("text", "")
        metadata = result.get("metadata", {})
        section = metadata.get("section", "").strip()
        
        if not text or not section:
            continue
            
        # Skip full official text section - use structured parts instead
        if section.lower() in ["full official text", "overview"]:
            continue
        
        # Extract sentences from this section
        sents = _sentences(text)
        
        for sent in sents:
            sent_key = sent[:80]  # use first 80 chars to detect dupes
            if sent_key not in seen:
                seen.add(sent_key)
                
                # Classify by section name
                if _is_section_match(section, "benefits"):
                    sections["benefits"].append(sent)
                elif _is_section_match(section, "eligibility"):
                    sections["eligibility"].append(sent)
                elif _is_section_match(section, "documents"):
                    sections["documents"].append(sent)
                elif _is_section_match(section, "apply"):
                    sections["apply"].append(sent)
                elif _is_section_match(section, "dates"):
                    sections["dates"].append(sent)
                elif _is_section_match(section, "clauses"):
                    sections["clauses"].append(sent)
    
    # Limit each section to reasonable count
    for k in sections:
        sections[k] = sections[k][:6]
    
    return sections


def _scheme_name(rag_results: List[dict], query: str) -> str:
    """Extract scheme name from metadata or use query."""
    for r in rag_results:
        name = (r.get("metadata") or {}).get("name")
        if name:
            return name
    return query.strip().title()


def build_explainer(query: str, rag_results: List[dict], language: str = "en") -> dict:
    """
    Return a dict matching ExplainerResponse, filled from retrieved text.
    
    Strategy:
    1. Try to use section metadata from structured markdown ingestion
    2. Fall back to keyword-based extraction if metadata is sparse
    3. Always include raw text context for each section
    """
    if not rag_results:
        return {
            "title": query.strip().title(),
            "what_is": "Information not available in the loaded records.",
            "why_introduced": "Details not found.",
            "benefits": [],
            "eligibility": [],
            "documents": [],
            "how_to_apply": "Apply via the official portal or nearest CSC.",
            "deadlines": None,
            "misunderstood_clauses": [],
            "source": "N/A",
            "ministry": "Unknown",
            "last_updated": "N/A",
            "confidence": "Low",
            "disclaimer": ("Shown from official scheme documents. For a simplified, "
                          "translated summary, connect the AI model (add OpenAI billing)."),
        }
    
    name = _scheme_name(rag_results, query)
    
    # Try to extract sections using metadata
    sections = _extract_sections_by_metadata(rag_results)
    
    # Get full context for overview
    full_context = "\n".join(r.get("text", "") for r in rag_results)
    sents = _sentences(full_context)
    
    # Build what_is from overview or first few sentences
    what_is = " ".join(sents[:2]) if sents else f"Details for '{name}' were retrieved from the official document set."
    
    # If section extraction didn't work well, fall back to keyword matching
    if not any(sections.values()):
        sections["benefits"] = _pick(sents, "benefits")
        sections["eligibility"] = _pick(sents, "eligibility")
        sections["documents"] = _pick(sents, "documents", 6)
        sections["apply"] = _pick(sents, "apply", 3)
        sections["dates"] = _pick(sents, "dates", 3)
        sections["clauses"] = _pick(sents, "clauses", 4)
    
    how_to_apply = " ".join(sections["apply"]) if sections["apply"] \
                   else "Apply via the official portal (myscheme.gov.in) or your nearest CSC."
    
    note = ("Shown directly from the official scheme document. For a simplified, "
            "translated summary, connect the AI model (add OpenAI billing).")
    if language and language != "en":
        note = ("नीचे आधिकारिक योजना दस्तावेज़ से लिया गया मूल पाठ है। सरल/अनुवादित "
                "सारांश के लिए AI मॉडल जोड़ें।" if language == "hi" else note)

    return {
        "title": name,
        "what_is": what_is,
        "why_introduced": "See the official document for the scheme's objective.",
        "benefits": sections["benefits"],
        "eligibility": sections["eligibility"],
        "documents": sections["documents"],
        "how_to_apply": how_to_apply,
        "deadlines": (" ".join(sections["dates"]) if sections["dates"] else None),
        "misunderstood_clauses": sections["clauses"],
        "source": name,
        "ministry": "See official document",
        "last_updated": "From indexed document",
        "confidence": "Medium" if rag_results else "Low",
        "disclaimer": note,
    }


def build_chat_reply(message: str, rag_results: List[dict]) -> str:
    if not rag_results:
        return ("I couldn't find this in the loaded scheme documents. Try a scheme name "
                "like 'PM Kisan', 'Ayushman Bharat', or 'Atal Pension Yojana'.")
    name = _scheme_name(rag_results, message)
    sents = _sentences("\n".join(r.get("text", "") for r in rag_results))
    body = " ".join(sents[:4]) if sents else rag_results[0].get("text", "")[:500]
    return f"From the official document for {name}:\n\n{body}\n\n[Source: {name}]"


def build_conditions(rag_results: List[dict]) -> dict:
    """Extract important clauses and conditions from retrieved sections."""
    sections = _extract_sections_by_metadata(rag_results)
    
    # Get clauses from section metadata first
    clause_sents = sections["clauses"]
    
    # If no clauses found via metadata, fall back to keyword matching
    if not clause_sents:
        full_context = "\n".join(r.get("text", "") for r in rag_results)
        sents = _sentences(full_context)
        clause_sents = _pick(sents, "clauses", limit=6)
    
    conditions = []
    for s in clause_sents:
        low = s.lower()
        severity = "red" if any(w in low for w in
                   ["not eligible", "penal", "terminat", "disqualif", "forfeit", "repay", "recover"]) \
                   else "yellow"
        conditions.append({"text": s, "severity": severity,
                           "explanation": "Flagged from the scheme text — read this carefully before applying."})
    summary = (f"{len(conditions)} clause(s) worth noting were found in the official text."
               if conditions else "No high-risk clauses were detected in the retrieved text.")
    return {"conditions": conditions, "summary": summary}
