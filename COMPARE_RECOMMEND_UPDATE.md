# Compare page — "Which is better for me?" recommendation

New feature on the Compare page. After the side-by-side table, a small form
asks the citizen for a few optional details (age, state, gender, occupation,
annual income, category). On "Recommend for me", the app suggests which of the
two schemes fits THEM better — grounded only in the scheme documents, in plain
language, in the selected interface language.

Files changed (additive only — nothing removed):
- backend/services/ai_service.py : new recommend_for_profile() (document-grounded)
- backend/routers/compare.py      : new POST /api/compare/recommend
- backend/models/schemas.py       : new RecommendRequest
- frontend/lib/api.ts             : new recommendForProfile()
- frontend/lib/i18n.tsx           : form labels (EN + HI; others fall back to EN)
- frontend/app/compare/page.tsx   : profile form + suggestion card after the table

How to use: copy this folder over your project (choose "replace"), then RESTART
the backend (for the new route) and hard-refresh. Existing compare table,
explainer, chatbot, and the 10-language UI are all unchanged.
