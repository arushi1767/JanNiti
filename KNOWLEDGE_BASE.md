# JanNiti — Knowledge Base (the text layer between PDFs and the LLM)

Your schemes are now stored as a clean, **OCR-verified text layer** that the app
ingests directly, instead of parsing PDFs at runtime. This is why retrieval is
now reliable — a tricky PDF can no longer break the search.

## What's included
- `backend/data/knowledge_base/*.txt` — 18 unique schemes, one clean text file
  each (duplicates like `_1` were removed). Garbled/scanned pages were recovered
  with OCR (tesseract), so the text is fully machine-readable.
- `backend/data/knowledge_base/manifest.json` — the scheme list (drives search
  and the dashboard).
- `JanNiti_Knowledge_Base.docx` — the same content as a readable Word document,
  one section per scheme. This is the human-readable "Word layer" you asked for.

## How the app uses it
On startup the backend ingests `data/knowledge_base/*.txt` (preferred) instead
of the PDFs. Search, explainer, and chat all retrieve from this clean text — so
answers fetch with full accuracy. Scheme names come from each file's header.

## Rebuild it from PDFs (with OCR) any time
```
cd backend
pip install pdfplumber                      # plus system tools: tesseract-ocr, poppler-utils
python scripts/build_kb.py  PATH_TO_PDFS  data/knowledge_base
# then re-ingest:
python scripts/ingest_pdfs.py
```
`build_kb.py` extracts each PDF, OCRs any scanned/garbled page, de-duplicates,
and writes the clean `.txt` + `manifest.json`.

## Uploads: PDF / image identification (new)
`POST /api/explainer/extract` accepts a PDF, JPG, or PNG, reads it (OCR if
needed), identifies the matching scheme, and returns an explanation. This is the
"user uploads a document and it's recognised" capability.

## Deployment note (important for OCR)
OCR needs two system packages: **tesseract-ocr** and **poppler-utils**.
- The `backend/Dockerfile` now installs them automatically (Render/Railway via
  Docker get OCR for free).
- Locally on Windows: install Tesseract (UB-Mannheim build) and Poppler, and add
  them to PATH — OR just rely on the pre-built `knowledge_base/` text (already
  included), which needs no OCR at runtime.

## Voice
Voice (speech-to-text / read-aloud) already exists in the app and follows the
selected language. It does not need OCR.

## UPGRADE: RAG-optimized structured Markdown layer
The knowledge base is now also available as structured Markdown — one `.md` per
scheme in `backend/data/knowledge_base_md/` with:
- YAML frontmatter (scheme_name, type, beneficiary, tags, keywords, source)
- hierarchical sections: Overview / Key Benefits / Eligibility / Required
  Documents / Application Process / Important Dates / Generated FAQs / Full
  Official Text
- generated FAQs and a source citation line

The backend now ingests this layer with **section-aware chunking** (each `##`
section becomes its own retrieval unit, tagged with scheme + section name), so
retrieval lands on the right section (e.g. "benefits", "eligibility") instead of
a generic chunk. This raised the index from 128 to ~262 targeted chunks.

Rebuild / validate:
```
cd backend
python scripts/build_kb.py  PATH_TO_PDFS  data/knowledge_base   # PDF -> clean text (OCR)
python scripts/build_md_kb.py                                   # text -> structured .md
python scripts/validate_kb.py                                   # quality score /100
python scripts/ingest_pdfs.py                                   # re-index (prefers .md)
```
Current quality: 98.1/100 across 18 schemes (quality_report.json).
