# JanNiti — run locally (4 languages: English, Hindi, Bengali, Tamil)

This build has the trimmed language dropdown plus everything from before
(MD-based RAG, plain-language chatbot, Compare + "Which is better for me?").

## Install (over your existing folder — keeps your .env, node_modules, db)
Copy the inner JanNiti folder's contents over
   C:\Users\SUMI AIMS\Downloads\JanNiti_KB2\JanNiti\
choosing "Replace the files in the destination".

## Run — TWO terminals, both stay open
Terminal 1 (in ...\JanNiti\backend):
   py -3.11 -m uvicorn main:app --port 8000
   wait for: "anthropic | configured: True" and "Application startup complete"

Terminal 2 (in ...\JanNiti\frontend):
   npm run dev
   open http://localhost:3000

backend\.env must contain:
   LLM_PROVIDER=anthropic
   ANTHROPIC_API_KEY=sk-ant-...
   ANTHROPIC_MODEL=claude-sonnet-4-6
   CORS_ORIGINS=*
frontend\.env.local must contain:
   NEXT_PUBLIC_API_URL=http://127.0.0.1:8000

The language dropdown now shows only English, हिन्दी, বাংলা, தமிழ்.
To change which 4, edit frontend/lib/utils.ts (LANGUAGES list).
