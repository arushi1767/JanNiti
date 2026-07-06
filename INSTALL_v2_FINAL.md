# JanNiti v2.0 — FINAL UI + Backend Pack (built against your real code)

This pack was built by editing YOUR actual codebase (the JanNiti-clean.zip you
sent), so it drops straight in. The whole project type-checks with **0 errors**.

## What changed

### Indic UI (home page)
- **Animated banner strip** across the very top that scrolls your poster images
  LEFT → RIGHT in an infinite loop (pauses on hover).
- **Indic animated hero** (tricolor Digital-India theme, rotating Ashoka-Chakra
  ring, floating scheme icons) replaces the old blue "Understand Every
  Government Scheme" block.
- **Animated scheme illustrations** (farmer, student, woman entrepreneur,
  senior, youth) auto-rotating under the stats.
- Tricolor dividers, saffron/green accents throughout, tricolor footer bar.
- **Logo:** the navbar now shows `frontend/public/logo.png` if you add it
  (falls back to the shield + "JanNiti" wordmark if the file is missing).

### Impact page
- The old placeholder "beneficiaries / funds disbursed" numbers are gone.
- Replaced with a real, working **"New & Upcoming Schemes" tracker**
  (PM Dhan-Dhaanya Krishi Yojana, PM Vidyalakshmi, PM Internship, Ayushman
  Vaya Vandana, etc.) with status, date, ministry, official link and category
  filters. No backend call — always loads.

### Language dropdown
- Fixed: the navbar list lived in `lib/utils.ts` and had only 4 languages.
  It now has all **15** (MyScheme parity).

### Accessibility
- The **Ctrl+F2 accessibility panel** is now wired in globally (via
  `app/providers.tsx`) so it works on every page.

### Explainer (speed + red disclaimer)
- English explainers are served straight from the knowledge base with **no AI
  call** — sub-second.
- Non-English is translated once, then **cached** on disk, so every later view
  is instant too.
- The "Required documents" note now renders as a **red warning box**.
- Per-request **timing logs** print in the backend terminal so you can measure
  any language.

## How to install (Windows)

1. Stop both servers (Ctrl+C in each terminal).
2. Copy the `frontend` and `backend` folders from this pack over your project at
   `C:\Users\SUMI AIMS\Downloads\JanNiti-clean\JanNiti-clean\`, choosing
   **Replace the files in the destination**.
3. **Add your images** (this makes the banner show your posters):
   - Put your poster images in `frontend\public\banners\`
   - Name them `banner1.png`, `banner2.png`, ... up to `banner8.png`
     (missing numbers are skipped automatically).
   - Optional: put your logo at `frontend\public\logo.png`.
4. Restart both servers with the same commands as before:
   - Backend: `cd backend` then `py -3.11 -m uvicorn main:app --reload --port 8000`
   - Frontend: `cd frontend` then `npm run dev`
5. Open http://localhost:3000

No `npm install` and no re-ingestion needed. The banner reads the images from
disk; the knowledge base and translation cache are read from `backend\data\`.

## Test checklist
- Home page: poster strip scrolls left→right; hero is tricolor and animated;
  illustrations rotate; language dropdown shows 15 languages.
- Impact tab: shows the New & Upcoming Schemes cards with filters.
- Explainer in English: loads in under a second (backend log: `llm=SKIPPED`).
- Explainer in Hindi: first load slower (`cache=MISS`), reopen = instant (`HIT`).
- Required documents: red note box at the bottom of the list.
- Press Ctrl+F2 anywhere: accessibility panel opens.

## One honest note
The banner shows whatever images you place in `public\banners\`. Your posters
prominently feature a serving political leader with attributed quotes — that's
your editorial choice for your project; just be aware some reviewers or public
deployments may view that as political endorsement. The mechanism itself is
neutral and will display any images you choose.
