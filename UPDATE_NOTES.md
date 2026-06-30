# JanNiti — what changed in this update

This build fixes the three problems you hit when running it: "not found / can't
fetch schemes", the language picker doing nothing, and the slow/empty results.

## 1. Schemes now show even without OpenAI credit (the big one)
Before, every answer ran through OpenAI; if the key had no billing credit the
call failed and the page showed **"Official records not found"** — so it looked
like RAG was broken when it wasn't. Now, if the AI model is unavailable, the
backend builds a real answer **straight from the indexed PDF text** (benefits,
eligibility, documents, how-to-apply, fine-print). So:
- Schemes fetch and display the real official content immediately (fast).
- The chatbot replies with grounded scheme text + its source.
- When you DO add OpenAI billing, the polished, translated AI answer takes over
  automatically — nothing else to change.

Files: `backend/services/extractive.py` (new), wired into
`backend/services/ai_service.py`.

## 2. Language selector now works across the whole app
Before, the navbar's language dropdown only changed a local value; every page
was hard-coded to English, so answers always came back in English. Now there's
a shared language context: picking हिन्दी (or any language) updates every page,
flows into every API call, and the AI answers in that language. UI labels are
translated (English + Hindi; others fall back to English chrome).

Files: `frontend/lib/i18n.tsx` (new), `frontend/app/providers.tsx` (new),
`frontend/app/layout.tsx`, `frontend/components/Navbar.tsx`,
`frontend/app/explainer/page.tsx`, `frontend/app/chatbot/page.tsx`,
`frontend/app/compare/page.tsx`.

Note: in offline mode (no AI credit) the *quoted document text* stays in its
original English, because translating it needs the model — but the interface and
labels switch, and once the AI is connected the whole answer is translated.

## How to run (clean)
Backend:
```
cd backend
python -m venv .venv && .venv\Scripts\activate      # Windows
pip install -r requirements.txt                      # clean install (fixes the earlier half-install)
copy .env.example .env                               # then put your OpenAI key in .env
python scripts/ingest_pdfs.py                         # builds the index (124 chunks)
python -m uvicorn main:app --port 8000
# check http://127.0.0.1:8000/health  ->  documents_indexed: 124
```
Frontend (second terminal):
```
cd frontend
npm install
# create frontend/.env.local with:  NEXT_PUBLIC_API_URL=http://127.0.0.1:8000
npm run dev   ->  open http://localhost:3000
```

## To get the AI-written answers (optional, needs billing)
platform.openai.com -> Settings -> Billing -> add a payment method + a few $.
Put the key in `backend/.env` as `OPENAI_API_KEY=sk-...`. Restart the backend.
Without this the app still works (extractive mode); with it, answers become
polished and translated.
