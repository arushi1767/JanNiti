# JanNiti Update Pack — 02 July 2026

## How to install (2 minutes)
1. Close both terminals (Ctrl+C in each) if the app is running.
2. Unzip this file.
3. Copy the `backend` and `frontend` folders **over** your existing
   `C:\Users\SUMI AIMS\Downloads\JanNiti-clean\JanNiti-clean\` folder,
   choosing "Replace the files in the destination".
   (Your `.env`, `node_modules`, and database are untouched.)
4. Start both servers again exactly as before:
   - Terminal 1 (backend):  `py -3.11 -m uvicorn main:app --reload --port 8000`
   - Terminal 2 (frontend): `npm run dev`
   No `npm install` and no re-ingestion needed.

## What changed

### 1. Instant language switching (FIXED)
Previously only the headings translated; the fetched explanation stayed
in the old language. Now, changing the language re-translates EVERYTHING
already on screen — Explanation, Simple Story, Hidden Rules, and the
Compare results — automatically, with no new search and no refresh.
Files: `frontend/app/explainer/page.tsx`, `frontend/app/compare/page.tsx`

### 2. "Not available in loaded documents" gaps (FIXED)
Root cause found: the backend retrieved only 5 chunks with one generic
query, so benefits/eligibility/documents often weren't in the context and
the AI (correctly refusing to invent) said "not available". The backend
now runs one targeted retrieval per section (benefits, eligibility,
documents, apply steps, deadlines, rules), locks onto the matched scheme,
and merges up to 18 deduplicated chunks. Hidden Conditions uses the same
upgrade. File: `backend/services/ai_service.py`

### 3. Scheme-specific official links (FIXED)
- Apply Now now goes to each scheme's own verified application portal:
  - Kisan Credit Card -> jansamarth.in/kisan-credit-card-scheme (direct KCC apply page)
  - PM MUDRA -> udyamimitra.in (the official MUDRA online application portal)
  - CBSE Single Girl Child -> cbse.gov.in/cbsenew/scholar.html (stable scholarship page; the yearly cbseit.in link changes every year)
- Each scheme now also has an `official` info page and an application
  `mode` (online / hybrid / offline).
- Offline/hybrid schemes (PMJDY, PMGKAY, PMJJBY, PMSBY, APY, KCC, Skill
  Loan) now show an honest note under Apply Now, in all 4 languages,
  e.g. "This scheme is applied for offline — visit your bank branch...".
- The small link under the scheme title now opens that scheme's own
  official page — never a MyScheme listing/search.
Files: `frontend/lib/schemes.ts`, `frontend/lib/i18n.tsx`,
`frontend/components/ui/SourceBadge.tsx`

### 4. Official PDFs added as the canonical source layer
The 18 scheme PDFs are now stored at `backend/data/chroma/policies/` for
provenance and the document-upload/OCR feature. (The structured Markdown
knowledge base remains the retrieval layer — it already contains the full
official text of each PDF, so no re-ingestion is required.)

## How to test
1. Explainer -> pick "PM Fasal Bima Yojana" -> benefits, eligibility,
   documents and apply steps should now be filled in (no more "not
   available" placeholders).
2. With the result on screen, switch language to Hindi -> the whole
   explanation should re-render in Hindi within a few seconds.
3. Pick "PM MUDRA Yojana" -> Apply Now should show udyamimitra.in.
4. Pick "PM Jan Dhan Yojana" -> a blue note explains it is opened at a
   bank branch.
