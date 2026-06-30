# JanNiti — Final Fix: Apply Guide

## What's in this zip

| File | Action | What it fixes |
|------|--------|---------------|
| `frontend/lib/schemes.ts` | **NEW** | Canonical list of all 18 schemes with names in EN/HI/BN/TA |
| `frontend/lib/i18n.tsx` | OVERWRITE | Rebuilt i18n — all UI strings in all 4 languages, incl. explainer + compare |
| `frontend/lib/schemeLinks.ts` | OVERWRITE | Scheme name → official portal URL map |
| `frontend/app/explainer/page.tsx` | OVERWRITE | Dropdown replacing search bar, multilingual, exact slug passed to API |
| `frontend/app/compare/page.tsx` | OVERWRITE | Dropdowns replacing search bar, translated headers, fix for `Input` import |
| `frontend/components/ui/SourceBadge.tsx` | OVERWRITE | Opens real portal (pmkisan.gov.in etc.) not MyScheme search |
| `frontend/components/ui/TransliterateInput.tsx` | OVERWRITE | Multilingual phonetic keyboard |
| `backend/routers/transliterate.py` | NEW | Transliteration proxy (Google Input Tools, no key needed) |
| `backend/requirements.txt` | OVERWRITE | Adds `anthropic` + `httpx` |

---

## Step 1 — Copy files

Copy each file into your project at the same relative path, overwriting when prompted.

Your project root: `JanNiti_KB2\JanNiti\`

---

## Step 2 — Register the transliterate router in `backend/main.py`

Open `backend/main.py` and add these two lines (if they aren't already there):

```python
from routers import transliterate          # near the top with other imports
app.include_router(transliterate.router)   # near other include_router() calls
```

---

## Step 3 — Install new backend dependency

In your backend terminal (venv active):

```powershell
cd "C:\Users\SUMI AIMS\Downloads\JanNiti_KB2\JanNiti\backend"
pip install anthropic httpx
```

---

## Step 4 — Restart both servers

**Backend terminal:**
```powershell
# Ctrl+C to stop uvicorn if running, then:
uvicorn main:app --reload --port 8000
```
Wait for `Application startup complete.`

**Frontend terminal:**
```powershell
# Ctrl+C to stop npm if running, then:
npm run dev
```
Wait for `Ready — http://localhost:3000`

---

## Step 5 — Test

1. Open http://localhost:3000
2. Change language to **हिन्दी**
3. Go to **Explainer** → the dropdown shows all 18 schemes in Hindi → click one → content loads in Hindi
4. Go to **Compare** → two dropdowns with Hindi scheme names → compare button → results in Hindi with translated headers
5. Go to **AI Chat** → source badges click through to real portals (not MyScheme search)
6. In the chat box, type `kisan` phonetically → Hindi suggestions appear → Space to accept

---

## Troubleshooting

| Issue | Fix |
|-------|-----|
| Explainer shows raw English text | LLM not connected — check `backend/.env` has valid `ANTHROPIC_API_KEY`, run `pip install anthropic`, restart uvicorn |
| `/api/transliterate` 404 | The transliterate router wasn't registered in `main.py` — see Step 2 |
| Dropdown shows only English names | `i18n.tsx` wasn't updated — re-copy the file |
| Compare headers still English | `i18n.tsx` missing `compare_*` keys — re-copy the file |
