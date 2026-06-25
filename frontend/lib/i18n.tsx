'use client'

import { createContext, useContext, useEffect, useState, ReactNode } from 'react'

export type LangCode =
  | 'en' | 'hi' | 'bn' | 'as' | 'brx' | 'doi' | 'gu' | 'kn' | 'ks' | 'kok'
  | 'mai' | 'ml' | 'mni' | 'mr' | 'ne' | 'or' | 'pa' | 'sa' | 'sat' | 'sd'
  | 'ta' | 'te' | 'ur'

/**
 * UI string translations. English is the base; Hindi is fully translated.
 * Other languages fall back to English for chrome, while the AI *answers*
 * come back in the selected language from the backend.
 */
const STRINGS: Record<string, Record<string, string>> = {
  en: {
    nav_home: 'Home', nav_explainer: 'Explainer', nav_compare: 'Compare',
    nav_chat: 'AI Chat', nav_impact: 'Impact',
    search_placeholder: 'Search a scheme — e.g. PM Kisan, Ayushman Bharat',
    search: 'Search', searching: 'Searching…',
    explain: 'Explain', eli5: 'Simple', conditions: 'Fine print',
    what_is: 'What is it', benefits: 'Benefits', eligibility: 'Who is eligible',
    documents: 'Documents needed', how_to_apply: 'How to apply',
    source: 'Source', confidence: 'Confidence', ask_placeholder: 'Ask about any scheme…',
    send: 'Send', thinking: 'Thinking…', no_results: 'No matching scheme found.',
    chat_title: 'Ask JanNiti', explainer_title: 'Scheme Explainer',
    page_title: 'Policy Explainer',
    page_sub: 'Search any central or state government scheme. Get a simple explanation.',
    explain_btn: 'Explain Scheme', researching: 'Researching...',
    analyzing: 'Analyzing scheme information...',
    tab_explanation: 'Explanation', tab_story: 'Simple Story', tab_hidden: 'Hidden Conditions',
    q_what_is: 'What is this scheme?', q_why: 'Why was it introduced?',
    q_benefits: 'What benefits do you get?', q_eligible: 'Who is eligible?',
    q_documents: 'Required Documents', q_how_apply: 'How to Apply',
    q_deadlines: 'Deadlines', q_clauses: 'Frequently Misunderstood Clauses',
    story_title: 'A Simple Story', story_simple: 'In Simple Words',
    story_example: 'Everyday Example', story_takeaway: 'Key Takeaway',
    cond_summary: 'Summary of Key Risks', cond_general: 'General Info',
    cond_read: 'Read Carefully', cond_alert: 'Important Alert',
    cond_none: 'No specific hidden conditions found for this scheme. Always verify with official sources.',
    chatbot_title: 'AI Chatbot', chatbot_sub: 'Ask anything about government schemes in natural language',
    chat_sources: 'Sources', chat_confidence: 'Confidence',
    chat_input_placeholder: 'Ask a question about any scheme...',
    chat_disclaimer: 'This AI assistant provides guidance based on publicly available information. Always verify with official government sources before applying for any scheme. The AI may make mistakes - please use your judgment.',
  },
  hi: {
    nav_home: 'होम', nav_explainer: 'जानकारी', nav_compare: 'तुलना',
    nav_chat: 'AI चैट', nav_impact: 'प्रभाव',
    search_placeholder: 'योजना खोजें — जैसे PM किसान, आयुष्मान भारत',
    search: 'खोजें', searching: 'खोज रहे हैं…',
    explain: 'समझाएँ', eli5: 'आसान', conditions: 'बारीक शर्तें',
    what_is: 'यह क्या है', benefits: 'लाभ', eligibility: 'कौन पात्र है',
    documents: 'ज़रूरी दस्तावेज़', how_to_apply: 'आवेदन कैसे करें',
    source: 'स्रोत', confidence: 'विश्वास', ask_placeholder: 'किसी भी योजना के बारे में पूछें…',
    send: 'भेजें', thinking: 'सोच रहे हैं…', no_results: 'कोई मेल खाती योजना नहीं मिली।',
    chat_title: 'JanNiti से पूछें', explainer_title: 'योजना जानकारी',
    page_title: 'योजना जानकारी',
    page_sub: 'किसी भी केंद्रीय या राज्य सरकार की योजना खोजें। सरल व्याख्या पाएँ।',
    explain_btn: 'योजना समझाएँ', researching: 'खोज रहे हैं...',
    analyzing: 'योजना की जानकारी पढ़ी जा रही है...',
    tab_explanation: 'व्याख्या', tab_story: 'सरल कहानी', tab_hidden: 'छिपी शर्तें',
    q_what_is: 'यह योजना क्या है?', q_why: 'यह क्यों शुरू की गई?',
    q_benefits: 'आपको क्या लाभ मिलते हैं?', q_eligible: 'कौन पात्र है?',
    q_documents: 'ज़रूरी दस्तावेज़', q_how_apply: 'आवेदन कैसे करें',
    q_deadlines: 'अंतिम तिथियाँ', q_clauses: 'अक्सर ग़लत समझी जाने वाली शर्तें',
    story_title: 'एक सरल कहानी', story_simple: 'सरल शब्दों में',
    story_example: 'रोज़मर्रा का उदाहरण', story_takeaway: 'मुख्य बात',
    cond_summary: 'मुख्य जोखिमों का सारांश', cond_general: 'सामान्य जानकारी',
    cond_read: 'ध्यान से पढ़ें', cond_alert: 'महत्वपूर्ण चेतावनी',
    cond_none: 'इस योजना के लिए कोई विशेष छिपी शर्त नहीं मिली। हमेशा आधिकारिक स्रोतों से पुष्टि करें।',
    chatbot_title: 'AI चैटबॉट', chatbot_sub: 'सरकारी योजनाओं के बारे में सामान्य भाषा में कुछ भी पूछें',
    chat_sources: 'स्रोत', chat_confidence: 'विश्वास',
    chat_input_placeholder: 'किसी भी योजना के बारे में प्रश्न पूछें...',
    chat_disclaimer: 'यह AI सहायक सार्वजनिक रूप से उपलब्ध जानकारी के आधार पर मार्गदर्शन देता है। किसी भी योजना के लिए आवेदन करने से पहले हमेशा आधिकारिक सरकारी स्रोतों से पुष्टि करें। AI ग़लती कर सकता है — कृपया अपने विवेक का उपयोग करें।',
  },
}

interface LangCtx {
  lang: LangCode
  setLang: (l: LangCode) => void
  t: (key: string) => string
}

const Ctx = createContext<LangCtx>({ lang: 'en', setLang: () => {}, t: (k) => k })

export function LanguageProvider({ children }: { children: ReactNode }) {
  const [lang, setLangState] = useState<LangCode>('en')

  useEffect(() => {
    const saved = (typeof window !== 'undefined' && localStorage.getItem('janniti_lang')) as LangCode | null
    if (saved) setLangState(saved)
  }, [])

  const setLang = (l: LangCode) => {
    setLangState(l)
    if (typeof window !== 'undefined') localStorage.setItem('janniti_lang', l)
    if (typeof document !== 'undefined') document.documentElement.lang = l
  }

  const t = (key: string) => STRINGS[lang]?.[key] ?? STRINGS.en[key] ?? key

  return <Ctx.Provider value={{ lang, setLang, t }}>{children}</Ctx.Provider>
}

export function useLang() {
  return useContext(Ctx)
}
