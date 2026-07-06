"""
Language validation — supported codes and script ranges.

Single source of truth for the 15 JanNiti languages.
"""
import re

SUPPORTED_LANGUAGES = {
    "en", "hi", "or", "as", "bn", "gu", "kn", "ml",
    "mr", "pa", "ta", "te", "ur", "ks", "mai",
}

LANG_NAMES = {
    "en": "English", "hi": "Hindi", "bn": "Bengali", "ta": "Tamil",
    "te": "Telugu", "mr": "Marathi", "gu": "Gujarati", "kn": "Kannada",
    "ml": "Malayalam", "pa": "Punjabi", "or": "Odia", "as": "Assamese",
    "ur": "Urdu", "mai": "Maithili", "ks": "Kashmiri",
}

_SCRIPTS = {
    "hi": r"[\u0900-\u097F]", "mr": r"[\u0900-\u097F]", "mai": r"[\u0900-\u097F]",
    "bn": r"[\u0980-\u09FF]", "as": r"[\u0980-\u09FF]",
    "ta": r"[\u0B80-\u0BFF]", "te": r"[\u0C00-\u0C7F]", "kn": r"[\u0C80-\u0CFF]",
    "ml": r"[\u0D00-\u0D7F]", "gu": r"[\u0A80-\u0AFF]", "pa": r"[\u0A00-\u0A7F]",
    "or": r"[\u0B00-\u0B7F]", "ur": r"[\u0600-\u06FF]", "ks": r"[\u0600-\u06FF]",
}


def validate_language(lang: str) -> str:
    """Validate language code. Returns normalized code or raises ValueError."""
    code = (lang or "en").strip().lower()
    if code not in SUPPORTED_LANGUAGES:
        raise ValueError(f"Unsupported language code: {lang!r}. Supported: {sorted(SUPPORTED_LANGUAGES)}")
    return code


def has_script(text: str, language: str) -> bool:
    """Check if text contains characters from the target language's script."""
    if language == "en":
        return True
    pattern = _SCRIPTS.get(language)
    if not pattern:
        return True
    return bool(re.search(pattern, text))
