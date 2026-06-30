"""
Explainer routes.

Fixes:
  * /explain previously called generate_explainer(user_query, context, language)
    — wrong signature; `context` landed in the `language` slot. Now calls it
    correctly (it does its own RAG internally) and returns via success_response.
  * /conditions, /eli5, /search were imported but never registered, so the
    frontend got 404s on every search. They're registered here.
"""
import logging
from fastapi import APIRouter, HTTPException, Query, UploadFile, File
from models.schemas import PolicyQuery
from services.ai_service import generate_explainer, detect_conditions, generate_eli5
from services.data_service import search_schemes
from services.rag_service import rag_service
from services import ocr
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
async def conditions(query: PolicyQuery):
    try:
        return success_response(detect_conditions(query.query, query.language))
    except Exception as e:
        logger.error(f"Conditions failed: {e}", exc_info=True)
        return error_response("Failed to analyze conditions. Please try again.")


@router.post("/eli5")
async def eli5(query: PolicyQuery):
    try:
        return success_response(generate_eli5(query.query, query.language))
    except Exception as e:
        logger.error(f"ELI5 failed: {e}", exc_info=True)
        return error_response("Failed to generate explanation. Please try again.")


@router.get("/search")
async def search(q: str = Query(..., description="Search text")):
    try:
        results = await search_schemes(q)
        return success_response({"results": results})
    except Exception as e:
        logger.error(f"Search failed: {e}", exc_info=True)
        return error_response("Search failed. Please try again.")


@router.post("/extract")
async def extract_document(file: UploadFile = File(...), language: str = Query("en")):
    """Read an uploaded PDF/JPG/PNG (with OCR), identify the matching scheme,
    and explain it. Powers 'upload a document and I'll identify it'."""
    try:
        data = await file.read()
        if not data:
            return error_response("Empty file.")
        res = ocr.extract(file.filename or "upload", data)
        if not res["ok"]:
            msg = ("Could not read text from this file. "
                   + ("" if res["ocr_available"] else
                      "OCR tools (tesseract/poppler) aren't installed on the server, so scanned files can't be read here."))
            return error_response(msg.strip())
        text = res["text"]
        # identify the scheme by retrieving against the extracted text
        hits = rag_service.search(text[:1000], top_k=3, language=language)
        matched = (hits[0]["metadata"].get("name") if hits and hits[0].get("metadata") else None)
        explanation = None
        if matched:
            explanation = generate_explainer(matched, language).model_dump()
        return success_response({
            "extracted_text": text[:6000],
            "method": res["method"],
            "matched_scheme": matched,
            "explanation": explanation,
        })
    except Exception as e:
        logger.error(f"extract failed: {e}", exc_info=True)
        return error_response("Failed to read the uploaded document.")
