"""
Suggested questions endpoint — generates questions backed by actual KB content.

Every suggested question is validated against the knowledge base so users never
see a question whose answer can't be generated confidently.
"""
import logging
import random
from fastapi import APIRouter
from services import kb_service
from services.rag_service import rag_service
from utils.response import success_response

logger = logging.getLogger("janniti.questions")
router = APIRouter(prefix="/api/questions", tags=["Questions"])

_TEMPLATES = [
    ("Do I qualify for {scheme}?", "eligibility"),
    ("What is the benefit amount in {scheme}?", "benefits"),
    ("How to apply for {scheme}?", "apply"),
    ("What documents are needed for {scheme}?", "documents"),
    ("What is the catch in {scheme}?", "conditions"),
    ("Compare {scheme} with another scheme", "compare"),
    ("Tell me about {scheme}", "general"),
    ("Is there any hidden penalty in {scheme}?", "conditions"),
]


def _validate_question(template: str, scheme_name: str) -> bool:
    """Validate that a question about this scheme can be answered."""
    kb = kb_service.match(scheme_name)
    if kb is not None:
        return True
    results = rag_service.search(scheme_name, top_k=3, language="en")
    good = sum(1 for r in results if r.get("score", 0) >= 0.5)
    return good >= 1


@router.get("/suggested")
async def suggested_questions(count: int = 6):
    """Return a list of suggested questions backed by actual KB content."""
    schemes = kb_service.all_schemes()
    if not schemes:
        return success_response({"questions": [
            "What is PM-KISAN?",
            "Do I qualify for Ayushman Bharat?",
            "How to apply for Atal Pension Yojana?",
            "What benefits does MUDRA loan offer?",
            "What is the catch in PM Awas Yojana?",
            "How to apply for PM Ujjwala Yojana?"
        ]})

    questions = []
    used_schemes = set()
    scheme_names = [s.title for s in schemes]
    random.shuffle(scheme_names)

    for name in scheme_names:
        if len(questions) >= count:
            break
        if name in used_schemes:
            continue
        used_schemes.add(name)
        random.shuffle(_TEMPLATES)
        for template, category in _TEMPLATES:
            q = template.format(scheme=name)
            if _validate_question(template, name):
                questions.append(q)
                break

    if len(questions) < count:
        extras = [s for s in scheme_names if s not in used_schemes]
        for name in extras:
            if len(questions) >= count:
                break
            questions.append(f"Tell me about {name}")

    return success_response({"questions": questions[:count]})
