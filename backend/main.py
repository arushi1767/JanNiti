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
    redoc_url="/redoc"
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:3000",
        "http://localhost:3001",
        "http://127.0.0.1:3000",
        "https://janniti.vercel.app",
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(explainer.router)
app.include_router(chat.router)
app.include_router(compare.router)
app.include_router(dashboard.router)
app.include_router(voice.router)

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
            "voice": "/api/voice/*"
        }
    }

@app.get("/health")
async def health():
    return {"status": "healthy"}

if __name__ == "__main__":
    import uvicorn
    logger.info("Starting JanNiti backend server...")
    uvicorn.run(app, host="0.0.0.0", port=8000)
