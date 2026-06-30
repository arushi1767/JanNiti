# JanNiti Knowledge Base — Regenerated (18 schemes)

Drop-in replacement for the JanNiti RAG knowledge base.

## Contents
- `backend/data/knowledge_base_md/*.md` — 18 regenerated, RAG-optimized scheme files
  (place these in your repo at exactly this path, overwriting the old files).
- `backend/data/knowledge_base_md/metadata.json` — per-file metadata.
- `CHANGELOG.md` — full description of what changed, sources, and backend-compatibility checks.

## Deploy
1. Copy `backend/data/knowledge_base_md/*.md` over the existing files.
2. Re-run ingestion: `python scripts/ingest_pdfs.py` (rebuilds the ChromaDB vector store).
3. (Optional) `python scripts/validate_kb.py` → expect 100/100 on all 18.

All files: single-line frontmatter (backend-parser safe), the 7 required H2 headings,
30+ FAQs, ~80-90 keywords, section-level source citations, and the full official PDF text
preserved for recall. Verified against the backend's chunker (~780 retrieval chunks total).
