import os
import logging
from dotenv import load_dotenv
load_dotenv()

logging.basicConfig(
    level=logging.INFO,
    format="%(asctime)s [%(name)s] %(levelname)s: %(message)s",
)
logger = logging.getLogger("janniti")

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from routers import explainer, chat, compare, dashboard, voice

app = FastAPI(
    title="JanNiti - India's Policy Literacy Platform",
    description="AI-powered platform explaining Indian government schemes in simple language",
    version="1.0.0",
    docs_url="/docs",
    redoc_url="/redoc",
)

# CORS: read from env so it works across dev/staging/prod without code changes
_raw_origins = os.getenv(
    "ALLOWED_ORIGINS",
    "http://localhost:3000,http://localhost:3001,http://127.0.0.1:3000,https://janniti.vercel.app"
)
ALLOWED_ORIGINS = [o.strip() for o in _raw_origins.split(",") if o.strip()]

app.add_middleware(
    CORSMiddleware,
    allow_origins=ALLOWED_ORIGINS,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(explainer.router)
app.include_router(chat.router)
app.include_router(compare.router)
app.include_router(dashboard.router)
app.include_router(voice.router)


@app.on_event("startup")
async def startup_event():
    """Seed the RAG database on startup if it's empty."""
    from services.rag_service import rag_service
    count = rag_service.count_documents()
    logger.info(f"RAG store has {count} documents")
    if count == 0:
        logger.info("RAG store is empty — seeding with built-in scheme data...")
        try:
            from seed_data import seed_database
            seed_database(rag_service)
            logger.info(f"Seeding complete. RAG store now has {rag_service.count_documents()} documents")
        except Exception as e:
            logger.error(f"Seeding failed: {e}")


@app.get("/")
async def root():
    return {
        "name": "JanNiti API",
        "version": "1.0.0",
        "status": "running",
        "endpoints": {
            "explainer": "/api/explainer/*",
            "chat": "/api/chat/*",
            "compare": "/api/compare/*",
            "dashboard": "/api/dashboard/*",
            "voice": "/api/voice/*",
        },
    }


@app.get("/health")
async def health():
    from services.rag_service import rag_service
    return {
        "status": "healthy",
        "rag_documents": rag_service.count_documents(),
        "groq_configured": bool(os.getenv("GROQ_API_KEY")),
        "openai_configured": bool(os.getenv("OPENAI_API_KEY", "").startswith("sk-") and not os.getenv("OPENAI_API_KEY", "").startswith("sk-your")),
    }


if __name__ == "__main__":
    import uvicorn
    logger.info("Starting JanNiti backend server...")
    uvicorn.run(app, host="0.0.0.0", port=8000)
