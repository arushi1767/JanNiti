# JanNiti — Fixes Applied

Every bug from the review (Parts 1) is addressed, plus two endpoint bugs the
review missed. Mapped to the roadmap (Part 2).

## Phase 1 — Make it run (the unblocker)
| # | Bug | Fix |
|---|-----|-----|
| 1 | Local Ollama model → "AI unavailable" when deployed; 5s timeout | New `services/llm.py` uses a **hosted** provider (Anthropic default, OpenAI optional). `config.LLM_TIMEOUT=60`. |
| 2 | Two different AIs (voice=OpenAI, chat=Ollama) | One `llm_chat()` used by every feature; provider via `LLM_PROVIDER`. Voice still uses OpenAI for STT/TTS. |
| 3 | `pypdf`, `langchain-text-splitters` missing from requirements | Added (plus `anthropic`); removed `ollama`. |
| 4 | `$contains` used in Chroma metadata `where` (invalid) | `get_policy_context` now retrieves broadly and substring-filters in Python. |
| 5 | Fragile pre-built DB may not load on fresh server | `RAGService.ensure_populated()` rebuilds the index on startup if empty. |
| 7 | Silent error swallowing | `print` → structured `logging` with `exc_info`; `/health` reports real state. |
| 8 | CORS hardcoded; stale 2024/25 recency; gTTS slow | CORS via `CORS_ORIGINS` env; recency uses the current year; `slow=False`. |
| — | **(missed)** `/conditions`, `/eli5`, `/search` called by frontend but never registered → 404 | Registered in `routers/explainer.py`. |
| — | **(missed)** `generate_explainer(query, context, language)` wrong signature | Router now calls it correctly (it does its own RAG). |
| 8 | Chat forgets earlier messages | `ChatMessage.conversation_history` added; router forwards it; frontend `chatWithAI` sends it. |

## Phase 2 — Grounding & faithfulness
- `services/faithfulness.py`: RAGAS/POLIS-Bench-style check; each answer scored against retrieved context, fabricated numbers penalised. Surfaced as `faithfulness` + `grounded` on chat responses and as the confidence label.

## Phase 4 — Honest data (CRAG)
- `data_service.py`: dashboard flagged `is_illustrative=True` with the **real** indexed scheme count; search driven by the **real** ingested PDF names; data.gov.in fetch returns data only with a real key + dataset id.

## Run locally
```bash
cd backend
python -m venv .venv && source .venv/bin/activate
pip install -r requirements.txt
cp .env.example .env          # set ANTHROPIC_API_KEY (or LLM_PROVIDER=openai + OPENAI_API_KEY)
uvicorn main:app --reload     # http://localhost:8000/docs ; auto-ingests PDFs on first run
```
Frontend: `cd frontend && npm install && npm run dev` (set `NEXT_PUBLIC_API_URL`).

## Deploy backend (Railway/Render, Docker)
Set env vars `ANTHROPIC_API_KEY` (and `CORS_ORIGINS=https://your-frontend`). The
container reads `$PORT`, rebuilds the index on boot, and serves `/docs`.

## Not faked
LayoutLMv3 (no scanned PDFs in the corpus — text extraction handles all 18; scanned files would be flagged in `ingest_pdfs` `skipped_scanned`) and a full POLIS-Bench/RAGAS benchmark are left as honest extension points rather than stubbed.
