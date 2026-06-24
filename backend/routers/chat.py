import logging
from fastapi import APIRouter, HTTPException
from pydantic import BaseModel, Field
from typing import Optional, List
from services.ai_service import chat_with_ai
from utils.response import success_response, error_response

logger = logging.getLogger("janniti.chat")
router = APIRouter(prefix="/api/chat", tags=["Chat"])


class ConversationMessage(BaseModel):
    role: str  # "user" or "assistant"
    content: str


class ChatMessage(BaseModel):
    message: str = Field(..., min_length=1, max_length=1000)
    language: str = "en"
    conversation_id: Optional[str] = None
    history: Optional[List[ConversationMessage]] = None


class ChatResponse(BaseModel):
    reply: str
    sources: List[str]
    confidence: str


@router.post("/message")
async def chat(message: ChatMessage):
    try:
        # Build history in the format ai_service expects
        history = None
        if message.history:
            history = [{"role": m.role, "content": m.content} for m in message.history]

        result = chat_with_ai(
            message=message.message,
            conversation_history=history,
            language=message.language,
        )
        return success_response(ChatResponse(**result))
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Chat failed: {e}", exc_info=True)
        return error_response("Chat request failed. Please try again.")
