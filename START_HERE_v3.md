# JanNiti v3 FINAL — START HERE

## 0) One-time: copy your .env
This zip does not contain your API key. Copy your existing file
`backend\.env` from your old folder into this new folder's `backend\`.
Then make sure it reads EXACTLY (three lines that matter):

    LLM_PROVIDER=anthropic
    ANTHROPIC_API_KEY=sk-ant-your-real-key
    ANTHROPIC_MODEL=claude-sonnet-4-6

IMPORTANT CORRECTIONS to advice you may have received:
* `claude-sonnet-4-6` IS a valid, current Anthropic model — do NOT change
  it to claude-3-5-sonnet-20241022 (that model is from 2024 and old).
* Your earlier `diagnose` failure said `ANTHROPIC_API_KEY = NOT SET`. That
  means the key line was missing, empty, or the file wasn't SAVED (Ctrl+S)
  before restarting. Fix the key, save, restart, re-run
  `py -3.11 -m scripts.diagnose` — it must show your key (sk-ant...) and
  provider `anthropic`.
* The key needs a small paid credit balance at console.anthropic.com.

## 1) Run it (two terminals, as always)
Terminal 1:
    cd backend
    py -3.11 -m uvicorn main:app --reload --port 8000
Terminal 2:
    cd frontend
    npm install
    npm run dev
Open http://localhost:3000

## 2) What's new in v3

### Hindi works INSTANTLY — even with NO API key
All 18 schemes now ship with complete, professionally written Hindi
explainers, pre-installed at `backend/data/translations/*__hi.json`.
The backend serves them directly from disk (cache HIT) — no AI call, no
delay, no English fallback. Watch the backend terminal:
    [explainer] lang=hi  kb=0.002s  llm=SKIPPED  cache=HIT  total=0.01s
This is the "knowledge base in the selected language" you asked for.

### Other 13 languages — build once, instant forever
After your API key works, run this ONCE (Terminal 3):
    cd backend
    py -3.11 -m scripts.pretranslate
It translates every scheme into every remaining language and saves them
to disk. After that, EVERY language is instant, exactly like Hindi.
(Without this, a language's first view translates live and then caches.)

### Hero posters no longer cut off
The homepage poster carousel now shows each image in FULL
(object-contain, frame sized to the image) — nothing is cropped from the
top anymore. The top banner strip images are also never cropped.

### Bigger logo
The navbar logo is now much larger (h-16 → 4.5rem on desktop, up to
340px wide) and the navbar is taller to fit it. Put your logo at
`frontend/public/logo.png`.

### Everything from earlier packs is included
Section-targeted RAG, instant language re-fetch on switch, verified
scheme-specific Apply Now links + offline/hybrid notes, 15-language
dropdown, accessibility panel (Ctrl+F2), Indic hero + tricolor theme,
Upcoming Schemes tracker, English explainer served from KB in
milliseconds, translation caching, red documents-warning box.

## 3) Quick test checklist
1. Explainer → PM-KISAN → switch language to हिन्दी → the ENTIRE
   explanation appears in Hindi instantly (works even before the key fix).
2. Backend terminal shows `cache=HIT` for Hindi.
3. Homepage → posters are fully visible, logo is big.
4. After fixing the key: run pretranslate, then try Bengali/Tamil —
   instant too.
5. Chatbot + Simple Story/Hidden Rules tabs in non-English need the
   working API key (first view per language, then cached).
