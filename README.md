# JanNiti — India's Policy Literacy Platform

AI-powered platform explaining Indian government schemes in plain language.

## Stack
- **Frontend**: Next.js 14 + Tailwind CSS → deploy free on **Vercel**
- **Backend**: FastAPI + Python → deploy free on **Railway** or **Render**
- **AI**: [Groq API](https://console.groq.com) (free tier, `llama3-8b-8192`) — no credit card needed
- **Vector DB**: ChromaDB (embedded, no separate server)
- **Embeddings**: `paraphrase-multilingual-MiniLM-L12-v2` (runs on CPU, free)
- **TTS**: gTTS (free, no API key needed)
- **STT**: Browser Web Speech API (free, no API key needed)

## Quick Start (Local)

### Backend
```bash
cd backend
cp .env.example .env
# Edit .env — set GROQ_API_KEY (free at https://console.groq.com)

pip install -r requirements.txt
python main.py
# Server starts at http://localhost:8000
# RAG database auto-seeds on first run
```

### Frontend
```bash
cd frontend
cp .env.example .env.local
# Edit .env.local — NEXT_PUBLIC_API_URL=http://localhost:8000

npm install
npm run dev
# App starts at http://localhost:3000
```

## Free Deployment

### Step 1: Deploy backend on Railway (free tier)
1. Go to [railway.app](https://railway.app) → New Project → Deploy from GitHub
2. Select your repo, set root directory to `backend`
3. Add environment variables:
   - `GROQ_API_KEY` = your key from [console.groq.com](https://console.groq.com)
   - `ALLOWED_ORIGINS` = `https://your-app.vercel.app`
4. Railway auto-detects the Dockerfile and deploys
5. Copy your Railway URL (e.g. `https://janniti-backend.railway.app`)

### Step 2: Deploy frontend on Vercel (free tier)
1. Go to [vercel.com](https://vercel.com) → New Project → Import GitHub repo
2. Set root directory to `frontend`
3. Add environment variable:
   - `NEXT_PUBLIC_API_URL` = your Railway backend URL
4. Deploy

## Getting a Free Groq API Key
1. Go to [console.groq.com](https://console.groq.com)
2. Sign up (no credit card required)
3. Create an API key
4. Free tier: 14,400 requests/day, 6,000 tokens/minute — sufficient for this app

## Architecture
```
User → Vercel (Next.js) → Railway (FastAPI)
                              ↓
                         ChromaDB (embedded)
                              ↓
                         Groq API (LLM)
```

## Features
- Policy Explainer (Grade 6-8 reading level)
- Hidden Conditions Detector (green/yellow/red alerts)
- ELI5 Mode (explain like I'm 5)
- Scheme Comparison
- AI Chatbot with conversation memory
- Voice Input (browser Web Speech API — free, works in Chrome)
- Text-to-Speech (gTTS — free)
- 10 Indian languages supported
- 15 major central schemes pre-loaded

## Adding More Schemes
Edit `backend/seed_data.py` → add entries to `SCHEME_DATA` → restart the server (or delete `data/chroma/` to force re-seed).
