########################################################################
  WHY HINDI (AND ALL LANGUAGES) SHOW ENGLISH — AND HOW TO FIND THE CAUSE
########################################################################

WHAT WE KNOW FOR SURE
- English works instantly (it's built from the knowledge base, no AI).
- Hindi explainer shows English content, and the chatbot answered in English
  with a messy raw text dump.
- That messy dump is the app's FALLBACK — it only appears when the AI call
  FAILS. So the real problem is: THE AI (LLM) CALLS ARE FAILING.
- No UI/code change can fix this — the AI service itself isn't responding.
  Usual causes: wrong/expired API key, no credits, or a wrong model name.

FIND THE EXACT CAUSE (1 command)
Open a terminal (NOT the ones running the servers — open a new one), then:

    cd "C:\Users\SUMI AIMS\Downloads\JanNiti-clean\JanNiti-clean\backend"
    py -3.11 -m scripts.diagnose

It prints your provider, model, whether the key is set, and then makes ONE real
AI call and shows the EXACT error. Send me that whole output. It will say one of:
  • authentication / 401  -> the API key is wrong or expired
  • credit / quota / 429   -> the account is out of credits or rate-limited
  • model / not_found / 404 -> the model name in your .env is wrong
  • or "SUCCESS" (then the AI works and we look elsewhere)

WHERE THE KEY LIVES
In the backend folder there is a file named ".env" (you may need to turn on
"File name extensions" and "Hidden items" in File Explorer's View menu to see
it). It contains lines like:
    LLM_PROVIDER=anthropic
    ANTHROPIC_API_KEY=sk-ant-...
    ANTHROPIC_MODEL=claude-...
The diagnose script tells you which of these is the problem.

########################################################################
  UI FIXES INCLUDED IN THIS PACK (already coded, just copy + refresh)
########################################################################

1. BANNERS NOW SHOW  (real bug fixed)
   There was a genuine bug that cancelled the image check before the posters
   could appear. Fixed in:
     frontend/components/ui/IndianHero.tsx
     frontend/components/ui/BannerCarousel.tsx
   Copy those over, then hard-refresh (Ctrl+Shift+R). Your banner1..banner4
   posters will animate in the hero.

2. LOGO IS BIGGER  now (h-12/h-14, up to 220px wide) — in
     frontend/components/Navbar.tsx

3. ACCESSIBILITY PANEL (the MyScheme features) IS ALREADY THERE.
   It's the round purple person-icon button on the RIGHT edge of the page,
   or press Ctrl+F2. It opens with: Bigger Text, Smaller Text, Text Spacing,
   Line Height, Dyslexia Friendly, ADHD Mode, High Saturation, Invert Colors,
   Highlight Links, Big Cursor, Pause Animation, Hide Images, Reset All —
   exactly like MyScheme. Nothing to add; just click it.

HOW TO APPLY THE UI FIXES
- Copy the frontend folder from this pack over your project (Replace).
- Hard-refresh the browser: Ctrl+Shift+R.
- No server restart needed for frontend changes (npm dev auto-reloads), but if
  in doubt, stop npm run dev and start it again.
########################################################################
