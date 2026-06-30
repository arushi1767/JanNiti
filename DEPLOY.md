# Deploying JanNiti

This build uses **OpenAI only** — one key (`OPENAI_API_KEY`) powers chat and voice.
All 8 review bugs are fixed; the search index rebuilds itself from the PDFs on first boot.

## What deploys where
- **Backend** (FastAPI, the `backend/` folder) → a Python/Docker host (Railway, Render, etc.)
- **Frontend** (Next.js, the `frontend/` folder) → Vercel

Deploy the backend first, then point the frontend at it.

---

## 1. Backend on Railway

1. railway.app → **New Project** → **Deploy from GitHub repo** → pick this repo.
2. Open the service → **Settings** → set **Root Directory** = `backend`  ← *required* (the app is in that subfolder; without this the build fails in ~2 seconds).
3. **Variables** tab → add:
   - `OPENAI_API_KEY` = your `sk-...` key
   - `CORS_ORIGINS` = `*`   (tighten to your Vercel URL after step 2)
4. Redeploy. First build takes a few minutes (installs AI libraries, then ingests the 18 PDFs).
5. **Settings → Networking → Generate Domain** to get a public URL.
6. Test: open `https://<your-railway-url>/health` → expect `"configured": true` and `"documents": <a number > 0>`.

> The backend loads a local embedding model, so it needs ~1 GB RAM (Railway Hobby plan is comfortable).
> If you hit an out-of-memory crash, switch embeddings to OpenAI to make it lightweight.

## 2. Frontend on Vercel

1. vercel.com → **Add New Project** → import this repo → set **Root Directory** = `frontend`.
2. **Environment Variables** → `NEXT_PUBLIC_API_URL` = your Railway backend URL.
3. Deploy. The URL it gives you (e.g. `https://janniti.vercel.app`) is your prototype link.

## 3. Lock CORS
Back in Railway, set `CORS_ORIGINS` to your exact Vercel URL and redeploy.

---

## Run locally instead (to test first)

**Backend**
```bash
cd backend
python -m venv venv && venv\Scripts\activate        # macOS/Linux: source venv/bin/activate
pip install -r requirements.txt
copy .env.example .env        # macOS/Linux: cp .env.example .env  — then put your key in OPENAI_API_KEY
python scripts/ingest_pdfs.py
uvicorn main:app --reload     # http://localhost:8000  (API docs at /docs)
```

**Frontend**
```bash
cd frontend
npm install
# create .env.local with: NEXT_PUBLIC_API_URL=http://localhost:8000
npm run dev                   # http://localhost:3000
```

## Security
Never put your key in a committed file. Use a local `.env` (gitignored) or the host's Variables.
Billing must be enabled at platform.openai.com or the key returns errors.
