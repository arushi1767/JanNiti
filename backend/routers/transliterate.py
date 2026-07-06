"""
Transliteration proxy router.
Accepts GET with query params (text, lang) and returns
{ suggestions: list[str] } using Google Input Tools (no key needed).
"""
from fastapi import APIRouter, HTTPException, Query
from pydantic import BaseModel
import httpx
import logging
from utils.language import validate_language

logger = logging.getLogger("janniti.transliterate")

router = APIRouter()

# Google Input Tools language codes
LANG_MAP = {
    "hi": "hi", "bn": "bn", "ta": "ta", "te": "te",
    "mr": "mr", "gu": "gu", "kn": "kn", "ml": "ml",
    "pa": "pa", "or": "or", "as": "as",
}


class TransliterateResponse(BaseModel):
    suggestions: list[str]


@router.get("/api/transliterate", response_model=TransliterateResponse)
async def transliterate(text: str = Query(...), lang: str = Query("hi")):
    try:
        validate_language(lang)
    except ValueError:
        return TransliterateResponse(suggestions=[])

    lang_code = LANG_MAP.get(lang, "hi")
    text = text.strip()

    if not text or lang == "en":
        return TransliterateResponse(suggestions=[])

    try:
        url = (
            "https://inputtools.google.com/request"
            f"?text={text}&itc={lang_code}-t-i0-und&num=5&cp=0&cs=1&ie=utf-8&oe=utf-8&app=demopage"
        )
        async with httpx.AsyncClient(timeout=3.0) as client:
            resp = await client.get(url)
            resp.raise_for_status()
            data = resp.json()
            if data and data[0] == "SUCCESS" and data[1]:
                candidates = data[1][0][1]
                return TransliterateResponse(suggestions=candidates[:6])
    except Exception as exc:
        logger.warning("Transliteration failed: %s", exc)

    return TransliterateResponse(suggestions=[])


@router.post("/api/transliterate", response_model=TransliterateResponse)
async def transliterate_post(text: str = Query(...), lang: str = Query("hi")):
    """POST variant for backward compatibility."""
    return await transliterate(text, lang)
