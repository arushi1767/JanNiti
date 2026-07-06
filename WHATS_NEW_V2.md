# JanNiti v2.0 Update Pack — What's New & How to Install

## What this fixes (from your screenshots)

1. **"Required documents... not fully detailed" / "not available in loaded records" — FIXED.**
   A new curated knowledge base (`backend/data/kb/` — 18 markdown files built from your
   18 official PDFs) is now the primary source. When a query matches a scheme, the AI
   receives the COMPLETE official record (benefits, eligibility, documents, apply steps,
   dates, exclusions) instead of random RAG chunks.
2. **Garbled half-sentence bullets — FIXED.** Bullets are generated from clean, complete
   sections, not chunk fragments.
3. **Wrong scheme content mixing — FIXED.** The matched scheme's record is used alone.
4. **PM-VBRY, PMGKAY, Skill Loan "not in records" — FIXED.** All 18 schemes have full records.
5. **15 languages (MyScheme parity).** Language dropdown now shows all 15: English, Hindi,
   Odia, Assamese, Bengali, Gujarati, Kannada, Malayalam, Marathi, Punjabi, Tamil, Telugu,
   Urdu, Kashmiri, Maithili. AI answers (explainer, story, hidden rules, chat, compare)
   are translated for ALL 15 by the backend. UI menus are fully translated in en/hi/bn/ta,
   core strings in 10 more; anything untranslated shows English automatically.
6. **Accessibility panel (MyScheme-style, Ctrl+F2).** Bigger/Smaller Text, Text Spacing,
   Line Height, Dyslexia Friendly, ADHD Mode, High Saturation, Invert Colors, Highlight
   Links, Big Cursor, Pause Animation, Hide Images, Reset All. Settings are remembered.
7. **Homepage stat updated:** "4 Languages" → "15 Languages".
8. **Faster answers.** When a scheme is recognised, the backend now skips ~7 vector
   searches per request and uses the cached knowledge record directly — the explainer
   responds noticeably faster.
9. **Chatbot hallucinations reduced.** The chat AI now has strict zero-hallucination
   rules: it may only use the official record, must never invent amounts/dates/limits,
   and must say "I don't have that detail" + point to the official portal when unsure.
10. **Required-documents disclaimer.** Every documents list ends with a short note (in
   the selected language) that banks/portals/states may ask for extra documents.
11. **Indic animated hero (new component).** `IndianHero.tsx` — deep navy + tricolor
   Digital-India theme, slowly rotating Ashoka-Chakra ring, floating animated icons of
   scheme beneficiaries (farmer, student, business, health, pension). Respects
   prefers-reduced-motion and the accessibility panel's Pause Animation.

## Files in this pack

```
backend/data/kb/*.md                     18 curated scheme records (NEW)
backend/services/kb_service.py           KB loader + query matcher (NEW)
backend/services/ai_service.py           KB-first grounding + 15 languages (REPLACES old)
frontend/lib/i18n.tsx                    15 languages (REPLACES old)
frontend/lib/schemes.ts                  verified apply/official links (same as v1)
frontend/components/ui/AccessibilityPanel.tsx   NEW component
frontend/components/ui/IndianHero.tsx    NEW animated Indic hero component
frontend/components/ui/SourceBadge.tsx   same as v1
frontend/app/explainer/page.tsx          same as v1
frontend/app/compare/page.tsx            same as v1
```

## Install (Windows)

1. Close both running servers (press Ctrl+C in each terminal).
2. Open the extracted `JanNiti-v2-update-pack` folder.
3. Copy the `backend` and `frontend` folders and paste them into:
   `C:\Users\SUMI AIMS\Downloads\JanNiti-clean\JanNiti-clean\`
   When Windows asks, choose **Replace the files in the destination**.
4. **ONE small edit (adds the accessibility panel):**
   Open `frontend\app\layout.tsx` in Notepad/VS Code.
   - Add this import near the other imports at the top:
     `import AccessibilityPanel from '@/components/ui/AccessibilityPanel'`
   - Add `<AccessibilityPanel />` just before the closing `</body>` tag
     (i.e. after `{children}`).
   Save the file. (If your layout renders children through a Providers component,
   you can put `<AccessibilityPanel />` inside providers.tsx instead — either works.)
5. **OPTIONAL second edit (Indic animated hero):**
   Open `frontend\app\page.tsx`, add at the top:
     `import IndianHero from '@/components/ui/IndianHero'`
   and replace the existing hero `<section>...</section>` (the block with
   "Understand Every Government Scheme") with:
     `<IndianHero />`
6. Start the servers again, exactly like before:
   - Terminal 1:
     `cd "C:\Users\SUMI AIMS\Downloads\JanNiti-clean\JanNiti-clean\backend"`
     `py -3.11 -m uvicorn main:app --reload --port 8000`
   - Terminal 2:
     `cd "C:\Users\SUMI AIMS\Downloads\JanNiti-clean\JanNiti-clean\frontend"`
     `npm run dev`
7. Open http://localhost:3000

No `npm install` needed. No re-ingestion needed — the knowledge base is read
directly from `backend\data\kb\` when the backend starts.

## Quick test checklist

- Explainer → pick **PM Viksit Bharat Rozgar Yojana** → benefits, eligibility,
  documents, apply steps and dates should all be filled (this was "not available" before).
- Explainer → **PM Garib Kalyan Anna Yojana** and **Skill Loan Scheme** → same.
- Explainer → **Atal Pension Yojana** → eligibility bullets are complete sentences.
- Hidden Rules tab → red/yellow/green items appear for every scheme.
- Language dropdown → 15 languages; pick Telugu/Odia → headings change instantly,
  then run an explainer → the AI answer arrives in that language.
- Press **Ctrl+F2** → accessibility panel opens; try Bigger Text, Invert Colors,
  ADHD Mode; click Reset All.
- Apply Now on any scheme → opens the correct official portal in a new tab.

## Honest notes on scope

- UI menu translations beyond en/hi/bn/ta cover the most-visible strings; less-common
  labels show English until translated (the app never breaks — it falls back).
- Kashmiri UI falls back to English entirely; AI answers still come in Kashmiri.
- The full "Indian government theme + animated hero" redesign from your spec needs the
  complete frontend codebase (layout.tsx, page.tsx, globals.css, Navbar) — those files
  aren't in this pack's scope. Send them if you want that pass next.
- Every fact in the knowledge base comes from your 18 official PDFs; the only additions
  are the PMJJBY/PMSBY document lists, taken from the official Jansuraksha
  enrolment form (jansuraksha.gov.in). Nothing is invented.


---

## v2.1 additions (this update)

### 1. Explainer is now near-instant (English)
When you pick a scheme in English, the backend serves the answer straight from
the curated knowledge base with NO AI/LLM call — it renders in well under a
second instead of 5-10s. (Other languages still use the AI to translate.)
This is in the new `ai_service.py` + `kb_service.py`; nothing to configure.

### 2. Red disclaimer inside Required Documents
The documents "Note:" now shows as a red warning box (not a plain bullet).
This is in `frontend/app/explainer/page.tsx` (already in this pack — just copy it over).

### 3. Impact section -> "New & Upcoming Schemes" tracker
Replaces the placeholder "Illustrative - not live data" numbers with a real,
honest tracker of the latest central schemes (PM Dhan-Dhaanya Krishi Yojana,
PM Vidyalakshmi, PM Internship, Ayushman Vaya Vandana, etc.) with status,
date, ministry and official link, plus category filters.
NEW component: `frontend/components/ui/UpcomingSchemes.tsx`
To use: open `frontend/app/dashboard/page.tsx`, add
`import UpcomingSchemes from '@/components/ui/UpcomingSchemes'` and render
`<UpcomingSchemes />` in place of the old stats/impact content.

### 4. Indic animated interface (drop-in components)
Two new components you paste into your home page (`frontend/app/page.tsx`):
- `IndianHero.tsx` — tricolor Digital-India hero, rotating Ashoka-Chakra ring,
  floating scheme icons. Use in place of the old blue hero section.
- `SchemeShowcase.tsx` — auto-rotating animated illustrations of scheme
  beneficiaries (farmer, student, woman entrepreneur, senior, youth) in Indian
  tricolor tones, with a MyScheme-style caption band. Render it under the hero:
      import SchemeShowcase from '@/components/ui/SchemeShowcase'
      <SchemeShowcase />
  (Illustrations are animated SVG — no external/copyrighted photos, so they
  always load. To use real government photos instead, drop your own licensed
  images into the SVG slots.)

All new UI respects the accessibility panel's Pause Animation and the OS
reduced-motion setting.
