import logging
from fastapi import APIRouter, HTTPException
from models.schemas import PolicyQuery
from services.ai_service import generate_explainer, detect_conditions, generate_eli5
from services.data_service import search_schemes
from services.rag_service import rag_service
from utils.response import success_response, error_response

logger = logging.getLogger("janniti.explainer")
router = APIRouter(prefix="/api/explainer", tags=["Explainer"])

@router.post("/explain")
async def explain_scheme(query: PolicyQuery):
    try:
        user_query = query.query
        language = query.language

        # Step 1: RAG search (safe)
        results = rag_service.search(user_query)

        # Step 2: fallback if nothing found
        if not results:
            context = "No relevant policy data found in database."
        else:
            context = "\n".join([r["text"] for r in results[:3]])

        # Step 3: generate explanation using AI service
        answer = generate_explainer(user_query, context, language)

        return {"answer": answer}

    except HTTPException:
        raise

    except Exception as e:
        logger.error(f"Explainer failed: {e}", exc_info=True)
        return error_response("Failed to generate explanation. Please try again.")