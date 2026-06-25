# JanNiti — COMPLETE build (KB2 + all fixes)

This is your KB2 app with ALL fixes already inside. Nothing to copy/paste.
Fixes included:
- Whole interface translates (explainer + chatbot section titles, not just nav)
- Chatbot speaks plain language: no #, **bold**, tables, --- or emojis
- Chatbot matches "PM Kisan" to the loaded "Kissan Samman Nidhi" scheme (top-8 retrieval)
- Anthropic (Claude) is the default provider

## HOW TO USE (extract OVER your existing folder to keep your .env + node_modules)
Easiest: unzip this, then copy the inner `JanNiti` folder's contents over
   C:\Users\SUMI AIMS\Downloads\JanNiti_KB2\JanNiti\
   choosing "Replace the files in the destination". Your backend\.env,
   node_modules and database stay untouched.

## RUN (two terminals, both must stay running)
Terminal 1 — backend (in ...\JanNiti\backend):
   py -3.11 -m uvicorn main:app --port 8000
   (wait for: "LLM provider: anthropic | configured: True" and "Application startup complete")

Terminal 2 — frontend (in ...\JanNiti\frontend):
   npm install        (only the first time / if node_modules missing)
   npm run dev
   open http://localhost:3000

## IF THIS IS A FRESH FOLDER (no .env yet)
Create  backend\.env  with these 4 lines:
   LLM_PROVIDER=anthropic
   ANTHROPIC_API_KEY=sk-ant-...your key...
   ANTHROPIC_MODEL=claude-sonnet-4-6
   CORS_ORIGINS=*
Create  frontend\.env.local  with:
   NEXT_PUBLIC_API_URL=http://127.0.0.1:8000
Then in backend:  py -3.11 scripts/ingest_pdfs.py   (rebuilds the 262-chunk index)

## TEST
Pick हिन्दी (top-right). Whole interface should be Hindi.
Explainer: search "PM Kisan" -> Hindi answer + Simple Story + Hidden Conditions.
AI Chat: "Do I qualify for PM Kisan?" -> plain Hindi sentences, finds the scheme.

Note: needs Anthropic billing credit; without it, answers fall back to English text.
