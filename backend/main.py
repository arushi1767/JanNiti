import logging
from dotenv import load_dotenv
load_dotenv()

logging.basicConfig(level=logging.INFO, format="%(asctime)s [%(name)s] %(levelname)s: %(message)s")
logger = logging.getLogger("janniti")

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

import config
from routers import explainer, chat, compare, dashboard, voice

app = FastAPI(
    title="JanNiti - India's Policy Literacy Platform",
    description="AI-powered platform explaining Indian government schemes in simple language",
    version="1.1.0",
    docs_url="/docs", redoc_url="/redoc",
)

app.add_middleware(
    CORSMiddleware,
    # If the configured origins include a wildcard, credentialed CORS must
    # be disabled; browsers will block requests with credentials when
    # Access-Control-Allow-Origin is '*'. See bug #8.
    allow_origins=config.CORS_ORIGINS,      # env-driven (bug #8)
    allow_credentials=(False if "*" in config.CORS_ORIGINS else True),
    allow_methods=["*"], allow_headers=["*"],
)

app.include_router(explainer.router)
app.include_router(chat.router)
app.include_router(compare.router)
app.include_router(dashboard.router)
app.include_router(voice.router)


@app.on_event("startup")
async def _startup():
    logger.info(f"LLM provider: {config.LLM_PROVIDER} | configured: {config.llm_configured()}")
    if not config.llm_configured():
        logger.warning("No LLM key configured — chat/explainer will return a clear "
                       "'AI unavailable' message until a key is set.")
    if config.AUTO_INGEST_ON_START:
        try:
            from services.rag_service import rag_service
            count = rag_service.ensure_populated()   # rebuild index if empty (bug #5)
            logger.info(f"Vector store ready: {count} documents.")
        except Exception as e:
            logger.error(f"Startup ingest failed: {e}", exc_info=True)


@app.get("/")
async def root():
    return {"name": "JanNiti API", "version": "1.1.0", "status": "running"}


@app.get("/health")
async def health():
    from services.rag_service import rag_service
    return {
        "status": "healthy",
        "llm_provider": config.LLM_PROVIDER,
        "llm_configured": config.llm_configured(),
        "documents_indexed": rag_service.count_documents(),
        "rag_available": rag_service.available,
    }


if __name__ == "__main__":
    import os, uvicorn
    logger.info("Starting JanNiti backend server...")
    uvicorn.run(app, host="0.0.0.0", port=int(os.getenv("PORT", "8000")))
