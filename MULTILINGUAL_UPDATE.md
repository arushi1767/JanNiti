# Full multilingual UI — update

What changed: ONE file — frontend/lib/i18n.tsx — now contains complete UI
translations for all 10 languages (was: English + Hindi only):
  English, Hindi, Bengali, Telugu, Tamil, Marathi, Gujarati, Kannada,
  Malayalam, Punjabi.
Every interface label (nav, explainer tabs, section titles, story labels,
hidden-conditions labels, chatbot page, disclaimer) now switches with the
language selector. The AI answers already came back in the selected language
via the backend, so the app is now fully multilingual end-to-end.

Nothing else was changed. All existing features, APIs and UI flows intact.

NOTE ON QUALITY: these UI-label translations are carefully done but
machine-quality; a native speaker should spot-check the longer disclaimer
text before a public launch. The scheme names and "AI"/"JanNiti"/"PM" are
intentionally left untranslated, as required.

To use: copy frontend/lib/i18n.tsx over your existing one (or copy this whole
folder over your project, choosing "replace"). The frontend auto-reloads.
Then hard-refresh, pick any language, and the whole interface switches.
