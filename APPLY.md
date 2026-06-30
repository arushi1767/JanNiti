# JanNiti — Explainer/Compare redesign + "Apply Now" button

Copy these 4 files over the same paths (overwrite), then restart `npm run dev`:
- frontend/lib/i18n.tsx              (compare + apply_now keys; supersedes the translation-fix i18n)
- frontend/lib/schemes.ts           (18 schemes: translated labels + OFFICIAL apply portal each)
- frontend/app/explainer/page.tsx   (dropdown picker + "Apply Now" button)
- frontend/app/compare/page.tsx     (two dropdowns + translated headers)

## What's included
1. Explainer: search bar -> one-click dropdown of all 18 schemes in the selected language.
   Exact-name retrieval fixes "Fasal Bima showing Kisan Credit Card".
2. Apply Now: once a scheme loads, a green "Apply Now" button opens that scheme's OFFICIAL
   government portal in a NEW TAB (e.g. PM-KISAN -> pmkisan.gov.in, PMFBY -> pmfby.gov.in,
   PMJJBY/PMSBY -> jansuraksha.gov.in, MUDRA/KCC/Skill Loan -> jansamarth.in,
   scholarships -> scholarships.gov.in). Never redirects back to JanNiti or a search page.
   To change any URL, edit the `apply` field in schemes.ts.
3. Compare: two dropdowns + fully translated headers/buttons.

## REQUIRED for content to show in the selected language
Restart uvicorn AFTER `pip install anthropic`. Your LLM test passed, but the running server
cached "no LLM" at startup, so it falls back to raw English until restarted.
