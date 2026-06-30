# JanNiti — polish fixes

1. SOURCE LINK (Explainer): the external-link icon next to the source PDF now
   actually works — it opens the scheme on the official myScheme portal
   (myscheme.gov.in search). File: frontend/components/ui/SourceBadge.tsx

2. CHATBOT ANSWERS — now CRISP & SCANNABLE: short points (each on its own line
   with a dash), direct answer first, under ~120 words, no walls of text.
   File: backend/services/ai_service.py  (chat prompt)

3. IMPACT DASHBOARD — state table no longer empty: shows the real indexed
   scheme count as "All India (Central scheme)". We deliberately do NOT invent
   per-state beneficiary numbers — the app has 18 scheme documents, not a live
   government statistics feed, so headline figures stay honestly labelled
   "Illustrative". For real live numbers you'd connect data.gov.in APIs (a
   separate data project). File: backend/services/data_service.py

Restart the BACKEND after copying (for #2 and #3). Frontend auto-reloads (#1).
