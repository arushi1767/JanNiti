import logging
from fastapi import APIRouter, HTTPException
from models.schemas import PolicyQuery, ExplainerResponse, ELI5Response, ConditionResponse
from services.ai_service import generate_explainer, detect_conditions, generate_eli5
from services.data_service import search_schemes
from services.rag_service import rag_service
from utils.response import success_response, error_response

logger = logging.getLogger("janniti.explainer")
router = APIRouter(prefix="/api/explainer", tags=["Explainer"])

@router.post("/explain")
async def explain_scheme(query: PolicyQuery):
    try:
        result = generate_explainer(query.query, query.language, query.state)
        return success_response(result)
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Explainer failed: {e}", exc_info=True)
        return error_response("Failed to generate explanation. Please try again.")

@router.post("/conditions")
async def detect_hidden_conditions(query: PolicyQuery):
    try:
        result = detect_conditions(query.query, query.language)
        return success_response(result)
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Conditions detection failed: {e}", exc_info=True)
        return error_response("Failed to detect conditions. Please try again.")

@router.post("/eli5")
async def explain_like_im_12(query: PolicyQuery):
    try:
        result = generate_eli5(query.query, query.language)
        return success_response(result)
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"ELI5 failed: {e}", exc_info=True)
        return error_response("Failed to generate simple explanation. Please try again.")

@router.get("/search")
async def search_policies(q: str = ""):
    try:
        results = await search_schemes(q)
        return success_response({"results": results})
    except Exception as e:
        logger.error(f"Search failed: {e}", exc_info=True)
        return error_response("Search failed. Please try again.")

@router.get("/stats")
async def get_stats():
    try:
        data = {
            "total_schemes": rag_service.count_documents() if rag_service else 0,
            "languages_supported": ["English", "Hindi", "Bengali", "Telugu", "Tamil", "Marathi", "Gujarati"],
            "schemes_covered": 20
        }
        return success_response(data)
    except Exception as e:
        logger.error(f"Stats failed: {e}", exc_info=True)
        return error_response("Failed to fetch stats.")
