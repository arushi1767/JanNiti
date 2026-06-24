import os
import logging
import tempfile
import base64
from gtts import gTTS

logger = logging.getLogger("janniti.voice")

LANGUAGE_MAP = {
    "en": "en", "hi": "hi", "bn": "bn", "te": "te",
    "ta": "ta", "mr": "mr", "gu": "gu", "kn": "kn",
    "ml": "ml", "pa": "pa",
}

# OpenAI is optional — only used if key is present and valid
_openai_client = None
try:
    from openai import OpenAI
    api_key = os.getenv("OPENAI_API_KEY", "")
    if api_key and not api_key.startswith("sk-your") and api_key != "sk-placeholder":
        _openai_client = OpenAI(api_key=api_key)
        logger.info("OpenAI client available for STT/TTS")
    else:
        logger.info("No valid OPENAI_API_KEY — using gTTS for TTS, browser STT for speech input")
except ImportError:
    logger.info("openai package not installed — using gTTS fallback")


async def speech_to_text(audio_bytes: bytes, language: str = "en") -> str:
    """
    STT: use OpenAI Whisper if available, otherwise return a helpful message
    so the frontend can gracefully fall back to browser SpeechRecognition API.
    """
    if _openai_client:
        with tempfile.NamedTemporaryFile(delete=False, suffix=".webm") as tmp:
            tmp.write(audio_bytes)
            tmp_path = tmp.name
        try:
            with open(tmp_path, "rb") as f:
                transcript = _openai_client.audio.transcriptions.create(
                    model="whisper-1",
                    file=f,
                    language=language if language in LANGUAGE_MAP else "en",
                    response_format="text",
                )
            return transcript
        finally:
            os.unlink(tmp_path)
    else:
        # Signal to frontend to use browser Web Speech API instead
        raise NotImplementedError("server-stt-unavailable")


async def text_to_speech(text: str, language: str = "en") -> str:
    """TTS: OpenAI TTS if available, else gTTS (always free)."""
    lang_code = LANGUAGE_MAP.get(language, "en")

    if _openai_client:
        try:
            response = _openai_client.audio.speech.create(
                model="tts-1",
                voice="alloy",
                input=text,
                speed=0.9,
            )
            return base64.b64encode(response.content).decode("utf-8")
        except Exception as e:
            logger.warning(f"OpenAI TTS failed, falling back to gTTS: {e}")

    # Free fallback: gTTS
    try:
        with tempfile.NamedTemporaryFile(delete=False, suffix=".mp3") as tmp:
            tts = gTTS(text=text, lang=lang_code, slow=False)
            tts.save(tmp.name)
            tmp_path = tmp.name
        with open(tmp_path, "rb") as f:
            audio_bytes = f.read()
        os.unlink(tmp_path)
        return base64.b64encode(audio_bytes).decode("utf-8")
    except Exception as e:
        logger.error(f"gTTS failed: {e}")
        return ""
