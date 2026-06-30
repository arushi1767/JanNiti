'use client'

import { createContext, useContext, useEffect, useState, ReactNode } from 'react'

export type LangCode = 'en' | 'hi' | 'bn' | 'ta'

export const LANGUAGES: { code: LangCode; label: string }[] = [
  { code: 'en', label: 'English' },
  { code: 'hi', label: 'हिन्दी' },
  { code: 'bn', label: 'বাংলা' },
  { code: 'ta', label: 'தமிழ்' },
]

/**
 * Centralised UI translations. English is the base; every visible string has a
 * key here and is translated for hi / bn / ta. Missing keys fall back to English.
 * (AI *answers* are translated by the backend, which says "respond in <language>".)
 */
const STRINGS: Record<LangCode, Record<string, string>> = {
  // ---------------------------------------------------------------- ENGLISH
  en: {
    // nav
    nav_home: 'Home', nav_explainer: 'Explainer', nav_compare: 'Compare',
    nav_chat: 'AI Chat', nav_impact: 'Impact', select_language: 'Select language',
    choose_scheme: 'Choose a scheme...', explainer_pick: 'Pick a scheme to see a simple explanation', compare_title: 'Compare Policies', compare_sub: 'Side-by-side comparison of any two government schemes', compare_scheme1: 'Scheme 1', compare_scheme2: 'Scheme 2', compare_btn: 'Compare Schemes', compare_loading: 'Comparing...',
    apply_now: 'Apply Now', apply_sub: 'Opens the official government portal in a new tab',
    // hero
    badge_platform: "India's First Policy Literacy Platform",
    hero_1: 'Understand Every', hero_gov: 'Government Scheme', hero_2: 'in Simple Words',
    hero_sub: 'JanNiti explains central and state government schemes in plain language. No legal jargon. No confusion. Just clear answers you can trust.',
    btn_search_scheme: 'Search a Scheme', btn_ask_ai: 'Ask AI',
    // stats
    stat_schemes_num: '18+', stat_schemes_label: 'Schemes Covered', stat_schemes_desc: 'Central & State schemes',
    stat_langs_num: '4', stat_langs_label: 'Languages', stat_langs_desc: 'English + Indian languages',
    stat_reading_num: 'Grade 6-8', stat_reading_label: 'Reading Level', stat_reading_desc: 'Ultra-simple explanations',
    stat_transparent_num: '100%', stat_transparent_label: 'Transparent', stat_transparent_desc: 'Sources & confidence levels',
    // features
    features_heading: 'What Can You Do on JanNiti?',
    features_sub: 'Everything you need to make informed decisions about government schemes',
    feat_explainer_title: 'Policy Explainer', feat_explainer_desc: 'Understand any government scheme in simple Grade 6-8 language with examples and analogies.',
    feat_hidden_title: 'Hidden Conditions Detector', feat_hidden_desc: 'Find exclusions, penalties and obligations hidden in legal jargon. Green, Yellow, Red alerts.',
    feat_chatbot_title: 'AI Chatbot', feat_chatbot_desc: 'Ask natural questions: "Do I qualify?" "What is the catch?" Get honest answers instantly.',
    feat_compare_title: 'Compare Policies', feat_compare_desc: 'Side-by-side comparison of benefits, eligibility, risks and the application process.',
    feat_dashboard_title: 'Impact Dashboard', feat_dashboard_desc: 'Real-time statistics: beneficiaries, funds disbursed and coverage from official data.',
    feat_voice_title: 'Voice-First Access', feat_voice_desc: 'Speak in Hindi or regional languages. Listen to explanations. Large buttons for easy use.',
    try_now: 'Try now',
    // trust
    trust_heading: 'Built on Trust and Transparency',
    trust_sub: 'Every explanation on JanNiti includes the official source, ministry name, last-updated date and a confidence indicator. Our AI uses official government data and always reminds you to verify before applying.',
    trust_trustworthy_title: 'Trustworthy', trust_trustworthy_desc: 'Official sources cited for every response',
    trust_simple_title: 'Simple Language', trust_simple_desc: 'Grade 6-8 reading level with examples',
    trust_nomis_title: 'No Misinformation', trust_nomis_desc: 'AI guidance is clearly labelled',
    // cta + footer
    cta_heading: 'Ready to understand government schemes?',
    cta_sub: 'No registration required. Start exploring schemes that matter to you.',
    btn_search_now: 'Search a Scheme Now',
    footer_tagline: 'JanNiti - Policy Literacy for All',
    footer_disclaimer: 'Disclaimer: AI guidance does not replace official notifications',
    // explainer page
    page_title: 'Scheme Explainer', page_sub: 'Search any scheme to get a simple, structured explanation',
    search_placeholder: 'Search a scheme (e.g. PM-KISAN, Mudra, Ayushman Bharat)...',
    explain_btn: 'Explain Scheme', researching: 'Searching...', analyzing: 'Analyzing scheme information...',
    tab_explanation: 'Explanation', tab_story: 'Simple Story', tab_hidden: 'Hidden Rules',
    q_what_is: 'What is this scheme?', q_why: 'Why was it introduced?',
    q_benefits: 'What benefits do you get?', q_eligible: 'Who is eligible?',
    q_documents: 'Required documents', q_how_apply: 'How to apply',
    q_deadlines: 'Important dates', q_clauses: 'Commonly misunderstood rules',
    story_title: 'A Simple Story', story_simple: 'In simple words',
    story_example: 'Everyday example', story_takeaway: 'Key takeaway',
    cond_summary: 'Summary of key risks', cond_general: 'General information',
    cond_read: 'Read carefully', cond_alert: 'Important alert',
    cond_none: 'No specific hidden rules for this scheme. Always verify with official sources.',
    // chatbot
    chatbot_title: 'AI Chat Assistant', chatbot_sub: 'Ask anything about government schemes in plain language',
    chat_sources: 'Sources', chat_confidence: 'Confidence',
    chat_input_placeholder: 'Ask a question about any scheme...',
    chat_disclaimer: 'This AI assistant gives guidance based on publicly available information. Always verify with official sources before applying for any scheme. AI can make mistakes — please use your own judgement.',
    chat_greeting: 'Namaste! I am the JanNiti AI assistant. I can answer your questions about any Indian government scheme in simple language. Try asking "Do I qualify for PM-KISAN?" or "What is the catch in Ayushman Bharat?"',
    chat_try_asking: 'Try asking:',
    chat_q1: 'Do I qualify for PM-KISAN?',
    chat_q2: 'What is the catch in Ayushman Bharat?',
    chat_q3: 'What happens if I give wrong information in MGNREGA?',
    chat_q4: 'Compare PM Awas Yojana with PM SVANidhi',
    chat_q5: 'How to apply for PM Ujjwala Yojana?',
    chat_q6: 'Is there any hidden penalty in PM Mudra Yojana?',
    // recommend widget
    rec_heading: 'Find schemes for you', rec_sub: 'Answer a few questions',
    rec_age: 'Age', rec_income: 'Annual income', rec_gender: 'Gender', rec_state: 'State',
    rec_category: 'Category', rec_occupation: 'Occupation', rec_btn: 'Find Schemes',
    rec_loading: 'Finding schemes...', rec_result_title: 'Schemes you may be eligible for',
  },

  // ---------------------------------------------------------------- हिन्दी
  hi: {
    nav_home: 'होम', nav_explainer: 'जानकारी', nav_compare: 'तुलना',
    nav_chat: 'AI चैट', nav_impact: 'प्रभाव', select_language: 'भाषा चुनें',
    choose_scheme: 'एक योजना चुनें...', explainer_pick: 'सरल व्याख्या देखने के लिए एक योजना चुनें', compare_title: 'योजनाओं की तुलना', compare_sub: 'किन्हीं दो सरकारी योजनाओं की आमने-सामने तुलना', compare_scheme1: 'योजना 1', compare_scheme2: 'योजना 2', compare_btn: 'योजनाओं की तुलना करें', compare_loading: 'तुलना की जा रही है...',
    apply_now: 'अभी आवेदन करें', apply_sub: 'आधिकारिक सरकारी पोर्टल नई टैब में खुलेगा',
    badge_platform: 'भारत का पहला नीति साक्षरता मंच',
    hero_1: 'समझें हर', hero_gov: 'सरकारी योजना', hero_2: 'आसान शब्दों में',
    hero_sub: 'जननीति केंद्र और राज्य सरकार की योजनाओं को सरल भाषा में समझाता है। कोई कानूनी शब्दजाल नहीं। कोई उलझन नहीं। बस ऐसे स्पष्ट उत्तर जिन पर आप भरोसा कर सकें।',
    btn_search_scheme: 'योजना खोजें', btn_ask_ai: 'AI से पूछें',
    stat_schemes_num: '18+', stat_schemes_label: 'योजनाएँ शामिल', stat_schemes_desc: 'केंद्र व राज्य योजनाएँ',
    stat_langs_num: '4', stat_langs_label: 'भाषाएँ', stat_langs_desc: 'अंग्रेज़ी + भारतीय भाषाएँ',
    stat_reading_num: 'कक्षा 6-8', stat_reading_label: 'पठन स्तर', stat_reading_desc: 'बेहद सरल व्याख्या',
    stat_transparent_num: '100%', stat_transparent_label: 'पारदर्शी', stat_transparent_desc: 'स्रोत व विश्वास स्तर',
    features_heading: 'जननीति पर आप क्या कर सकते हैं?',
    features_sub: 'सरकारी योजनाओं के बारे में सही निर्णय लेने के लिए आवश्यक सब कुछ',
    feat_explainer_title: 'नीति व्याख्याकार', feat_explainer_desc: 'किसी भी सरकारी योजना को उदाहरणों के साथ कक्षा 6-8 की सरल भाषा में समझें।',
    feat_hidden_title: 'छिपी शर्तें पहचानें', feat_hidden_desc: 'कानूनी भाषा में छिपे अपवाद, दंड और दायित्व खोजें। हरा, पीला, लाल संकेत।',
    feat_chatbot_title: 'AI चैटबॉट', feat_chatbot_desc: 'सहज सवाल पूछें: "क्या मैं पात्र हूँ?" "इसमें पेंच क्या है?" तुरंत ईमानदार उत्तर पाएँ।',
    feat_compare_title: 'योजनाओं की तुलना', feat_compare_desc: 'लाभ, पात्रता, जोखिम और आवेदन प्रक्रिया की आमने-सामने तुलना।',
    feat_dashboard_title: 'प्रभाव डैशबोर्ड', feat_dashboard_desc: 'वास्तविक आँकड़े: लाभार्थी, वितरित राशि और आधिकारिक डेटा से कवरेज।',
    feat_voice_title: 'आवाज़-पहले पहुँच', feat_voice_desc: 'हिंदी या क्षेत्रीय भाषाओं में बोलें। व्याख्याएँ सुनें। आसान उपयोग के लिए बड़े बटन।',
    try_now: 'अभी आज़माएँ',
    trust_heading: 'विश्वास और पारदर्शिता पर आधारित',
    trust_sub: 'जननीति की हर व्याख्या में आधिकारिक स्रोत, मंत्रालय का नाम, अंतिम अद्यतन तिथि और विश्वास संकेतक शामिल है। हमारा AI आधिकारिक सरकारी डेटा का उपयोग करता है और आवेदन से पहले हमेशा सत्यापित करने की सलाह देता है।',
    trust_trustworthy_title: 'भरोसेमंद', trust_trustworthy_desc: 'हर उत्तर के लिए आधिकारिक स्रोत उद्धृत',
    trust_simple_title: 'सरल भाषा', trust_simple_desc: 'उदाहरणों सहित कक्षा 6-8 पठन स्तर',
    trust_nomis_title: 'कोई भ्रामक जानकारी नहीं', trust_nomis_desc: 'AI मार्गदर्शन स्पष्ट रूप से अंकित',
    cta_heading: 'सरकारी योजनाएँ समझने के लिए तैयार हैं?',
    cta_sub: 'किसी पंजीकरण की आवश्यकता नहीं। अपने लिए महत्वपूर्ण योजनाएँ खोजना शुरू करें।',
    btn_search_now: 'अभी योजना खोजें',
    footer_tagline: 'जननीति - सबके लिए नीति साक्षरता',
    footer_disclaimer: 'अस्वीकरण: AI मार्गदर्शन आधिकारिक अधिसूचनाओं का स्थान नहीं लेता',
    page_title: 'योजना व्याख्याकार', page_sub: 'सरल, संरचित व्याख्या पाने के लिए कोई भी योजना खोजें',
    search_placeholder: 'योजना खोजें (जैसे PM-KISAN, मुद्रा, आयुष्मान भारत)...',
    explain_btn: 'योजना समझाएँ', researching: 'खोजा जा रहा है...', analyzing: 'योजना की जानकारी का विश्लेषण किया जा रहा है...',
    tab_explanation: 'व्याख्या', tab_story: 'सरल कहानी', tab_hidden: 'छिपे नियम',
    q_what_is: 'यह योजना क्या है?', q_why: 'यह क्यों शुरू की गई?',
    q_benefits: 'आपको क्या लाभ मिलते हैं?', q_eligible: 'कौन पात्र है?',
    q_documents: 'आवश्यक दस्तावेज़', q_how_apply: 'आवेदन कैसे करें',
    q_deadlines: 'महत्वपूर्ण तिथियाँ', q_clauses: 'अक्सर गलत समझे जाने वाले नियम',
    story_title: 'एक सरल कहानी', story_simple: 'सरल शब्दों में',
    story_example: 'रोज़मर्रा का उदाहरण', story_takeaway: 'मुख्य बात',
    cond_summary: 'मुख्य जोखिमों का सारांश', cond_general: 'सामान्य जानकारी',
    cond_read: 'ध्यान से पढ़ें', cond_alert: 'महत्वपूर्ण चेतावनी',
    cond_none: 'इस योजना के लिए कोई विशेष छिपे नियम नहीं। हमेशा आधिकारिक स्रोतों में सत्यापित करें।',
    chatbot_title: 'AI चैट सहायक', chatbot_sub: 'सरकारी योजनाओं के बारे में सरल भाषा में कुछ भी पूछें',
    chat_sources: 'स्रोत', chat_confidence: 'विश्वास',
    chat_input_placeholder: 'किसी भी योजना के बारे में प्रश्न पूछें...',
    chat_disclaimer: 'यह AI सहायक सार्वजनिक रूप से उपलब्ध जानकारी के आधार पर मार्गदर्शन देता है। किसी भी योजना के लिए आवेदन करने से पहले हमेशा आधिकारिक सरकारी स्रोतों से पुष्टि करें। AI ग़लती कर सकता है — कृपया अपने विवेक का उपयोग करें।',
    chat_greeting: 'नमस्ते! मैं जननीति AI सहायक हूँ। मैं किसी भी भारतीय सरकारी योजना के बारे में आपके प्रश्नों का सरल भाषा में उत्तर दे सकता हूँ। पूछकर देखें "क्या मैं PM-KISAN के लिए पात्र हूँ?" या "आयुष्मान भारत में पेंच क्या है?"',
    chat_try_asking: 'पूछकर देखें:',
    chat_q1: 'क्या मैं PM-KISAN के लिए पात्र हूँ?',
    chat_q2: 'आयुष्मान भारत में पेंच क्या है?',
    chat_q3: 'अगर मैं MGNREGA में गलत जानकारी दूँ तो क्या होगा?',
    chat_q4: 'PM आवास योजना की PM स्वनिधि से तुलना करें',
    chat_q5: 'PM उज्ज्वला योजना के लिए आवेदन कैसे करें?',
    chat_q6: 'क्या PM मुद्रा योजना में कोई छिपा दंड है?',
    rec_heading: 'आपके लिए योजनाएँ खोजें', rec_sub: 'कुछ सवालों के जवाब दें',
    rec_age: 'आयु', rec_income: 'वार्षिक आय', rec_gender: 'लिंग', rec_state: 'राज्य',
    rec_category: 'श्रेणी', rec_occupation: 'व्यवसाय', rec_btn: 'योजनाएँ खोजें',
    rec_loading: 'योजनाएँ खोजी जा रही हैं...', rec_result_title: 'योजनाएँ जिनके लिए आप पात्र हो सकते हैं',
  },

  // ---------------------------------------------------------------- বাংলা
  bn: {
    nav_home: 'হোম', nav_explainer: 'তথ্য', nav_compare: 'তুলনা',
    nav_chat: 'AI চ্যাট', nav_impact: 'প্রভাব', select_language: 'ভাষা নির্বাচন করুন',
    choose_scheme: 'একটি প্রকল্প বেছে নিন...', explainer_pick: 'সহজ ব্যাখ্যা দেখতে একটি প্রকল্প বেছে নিন', compare_title: 'প্রকল্প তুলনা', compare_sub: 'যেকোনো দুটি সরকারি প্রকল্পের পাশাপাশি তুলনা', compare_scheme1: 'প্রকল্প ১', compare_scheme2: 'প্রকল্প ২', compare_btn: 'প্রকল্প তুলনা করুন', compare_loading: 'তুলনা করা হচ্ছে...',
    apply_now: 'এখনই আবেদন করুন', apply_sub: 'অফিসিয়াল সরকারি পোর্টাল নতুন ট্যাবে খুলবে',
    badge_platform: 'ভারতের প্রথম নীতি সাক্ষরতা প্ল্যাটফর্ম',
    hero_1: 'বুঝে নিন প্রতিটি', hero_gov: 'সরকারি প্রকল্প', hero_2: 'সহজ ভাষায়',
    hero_sub: 'জননীতি কেন্দ্র ও রাজ্য সরকারের প্রকল্পগুলি সহজ ভাষায় ব্যাখ্যা করে। কোনও আইনি জটিলতা নেই। কোনও বিভ্রান্তি নেই। শুধু স্পষ্ট উত্তর যা আপনি বিশ্বাস করতে পারেন।',
    btn_search_scheme: 'প্রকল্প খুঁজুন', btn_ask_ai: 'AI-কে জিজ্ঞাসা করুন',
    stat_schemes_num: '18+', stat_schemes_label: 'অন্তর্ভুক্ত প্রকল্প', stat_schemes_desc: 'কেন্দ্র ও রাজ্য প্রকল্প',
    stat_langs_num: '4', stat_langs_label: 'ভাষা', stat_langs_desc: 'ইংরেজি + ভারতীয় ভাষা',
    stat_reading_num: 'শ্রেণি 6-8', stat_reading_label: 'পঠন স্তর', stat_reading_desc: 'অত্যন্ত সহজ ব্যাখ্যা',
    stat_transparent_num: '100%', stat_transparent_label: 'স্বচ্ছ', stat_transparent_desc: 'উৎস ও আস্থার স্তর',
    features_heading: 'জননীতিতে আপনি কী করতে পারেন?',
    features_sub: 'সরকারি প্রকল্প সম্পর্কে সঠিক সিদ্ধান্ত নিতে যা যা প্রয়োজন',
    feat_explainer_title: 'নীতি ব্যাখ্যাকারী', feat_explainer_desc: 'যেকোনো সরকারি প্রকল্প উদাহরণসহ শ্রেণি 6-8 স্তরের সহজ ভাষায় বুঝুন।',
    feat_hidden_title: 'লুকানো শর্ত শনাক্তকারী', feat_hidden_desc: 'আইনি ভাষায় লুকানো ব্যতিক্রম, জরিমানা ও বাধ্যবাধকতা খুঁজুন। সবুজ, হলুদ, লাল সতর্কতা।',
    feat_chatbot_title: 'AI চ্যাটবট', feat_chatbot_desc: 'সহজ প্রশ্ন করুন: "আমি কি যোগ্য?" "এতে ফাঁক কী?" তাৎক্ষণিক সৎ উত্তর পান।',
    feat_compare_title: 'প্রকল্প তুলনা', feat_compare_desc: 'সুবিধা, যোগ্যতা, ঝুঁকি ও আবেদন প্রক্রিয়ার পাশাপাশি তুলনা।',
    feat_dashboard_title: 'প্রভাব ড্যাশবোর্ড', feat_dashboard_desc: 'রিয়েল-টাইম পরিসংখ্যান: সুবিধাভোগী, বিতরিত অর্থ ও সরকারি তথ্য থেকে কভারেজ।',
    feat_voice_title: 'কণ্ঠস্বর-প্রথম অ্যাক্সেস', feat_voice_desc: 'হিন্দি বা আঞ্চলিক ভাষায় বলুন। ব্যাখ্যা শুনুন। সহজ ব্যবহারের জন্য বড় বোতাম।',
    try_now: 'এখনই চেষ্টা করুন',
    trust_heading: 'আস্থা ও স্বচ্ছতার উপর নির্মিত',
    trust_sub: 'জননীতির প্রতিটি ব্যাখ্যায় অফিসিয়াল উৎস, মন্ত্রকের নাম, সর্বশেষ হালনাগাদের তারিখ ও আস্থা নির্দেশক থাকে। আমাদের AI সরকারি তথ্য ব্যবহার করে এবং আবেদনের আগে সর্বদা যাচাই করতে মনে করিয়ে দেয়।',
    trust_trustworthy_title: 'বিশ্বাসযোগ্য', trust_trustworthy_desc: 'প্রতিটি উত্তরের জন্য অফিসিয়াল উৎস উদ্ধৃত',
    trust_simple_title: 'সহজ ভাষা', trust_simple_desc: 'উদাহরণসহ শ্রেণি 6-8 পঠন স্তর',
    trust_nomis_title: 'কোনও ভুল তথ্য নয়', trust_nomis_desc: 'AI নির্দেশনা স্পষ্টভাবে চিহ্নিত',
    cta_heading: 'সরকারি প্রকল্প বুঝতে প্রস্তুত?',
    cta_sub: 'কোনও নিবন্ধন প্রয়োজন নেই। আপনার জন্য গুরুত্বপূর্ণ প্রকল্পগুলি অন্বেষণ শুরু করুন।',
    btn_search_now: 'এখনই প্রকল্প খুঁজুন',
    footer_tagline: 'জননীতি - সবার জন্য নীতি সাক্ষরতা',
    footer_disclaimer: 'দাবিত্যাগ: AI নির্দেশনা অফিসিয়াল বিজ্ঞপ্তির বিকল্প নয়',
    page_title: 'প্রকল্প ব্যাখ্যাকারী', page_sub: 'সহজ, সংগঠিত ব্যাখ্যা পেতে যেকোনো প্রকল্প খুঁজুন',
    search_placeholder: 'প্রকল্প খুঁজুন (যেমন PM-KISAN, মুদ্রা, আয়ুষ্মান ভারত)...',
    explain_btn: 'প্রকল্প ব্যাখ্যা করুন', researching: 'খোঁজা হচ্ছে...', analyzing: 'প্রকল্পের তথ্য বিশ্লেষণ করা হচ্ছে...',
    tab_explanation: 'ব্যাখ্যা', tab_story: 'সহজ গল্প', tab_hidden: 'লুকানো নিয়ম',
    q_what_is: 'এই প্রকল্পটি কী?', q_why: 'কেন এটি চালু হয়েছিল?',
    q_benefits: 'আপনি কী সুবিধা পাবেন?', q_eligible: 'কে যোগ্য?',
    q_documents: 'প্রয়োজনীয় নথি', q_how_apply: 'কীভাবে আবেদন করবেন',
    q_deadlines: 'গুরুত্বপূর্ণ তারিখ', q_clauses: 'প্রায়ই ভুল বোঝা নিয়ম',
    story_title: 'একটি সহজ গল্প', story_simple: 'সহজ কথায়',
    story_example: 'দৈনন্দিন উদাহরণ', story_takeaway: 'মূল কথা',
    cond_summary: 'মূল ঝুঁকির সারসংক্ষেপ', cond_general: 'সাধারণ তথ্য',
    cond_read: 'মনোযোগ দিয়ে পড়ুন', cond_alert: 'গুরুত্বপূর্ণ সতর্কতা',
    cond_none: 'এই প্রকল্পের জন্য কোনও নির্দিষ্ট লুকানো নিয়ম নেই। সর্বদা অফিসিয়াল উৎসে যাচাই করুন।',
    chatbot_title: 'AI চ্যাট সহায়ক', chatbot_sub: 'সরকারি প্রকল্প সম্পর্কে সহজ ভাষায় যেকোনো কিছু জিজ্ঞাসা করুন',
    chat_sources: 'উৎস', chat_confidence: 'আস্থা',
    chat_input_placeholder: 'যেকোনো প্রকল্প সম্পর্কে প্রশ্ন করুন...',
    chat_disclaimer: 'এই AI সহায়ক সর্বজনীনভাবে উপলব্ধ তথ্যের ভিত্তিতে নির্দেশনা দেয়। যেকোনো প্রকল্পে আবেদনের আগে সর্বদা অফিসিয়াল সরকারি উৎসে যাচাই করুন। AI ভুল করতে পারে — অনুগ্রহ করে নিজের বিচার ব্যবহার করুন।',
    chat_greeting: 'নমস্কার! আমি জননীতি AI সহায়ক। আমি যেকোনো ভারতীয় সরকারি প্রকল্প সম্পর্কে আপনার প্রশ্নের সহজ ভাষায় উত্তর দিতে পারি। জিজ্ঞাসা করে দেখুন "আমি কি PM-KISAN-এর জন্য যোগ্য?" বা "আয়ুষ্মান ভারতে ফাঁক কী?"',
    chat_try_asking: 'জিজ্ঞাসা করে দেখুন:',
    chat_q1: 'আমি কি PM-KISAN-এর জন্য যোগ্য?',
    chat_q2: 'আয়ুষ্মান ভারতে ফাঁক কী?',
    chat_q3: 'MGNREGA-তে ভুল তথ্য দিলে কী হবে?',
    chat_q4: 'PM আবাস যোজনার সঙ্গে PM স্বনিধির তুলনা করুন',
    chat_q5: 'PM উজ্জ্বলা যোজনার জন্য কীভাবে আবেদন করবেন?',
    chat_q6: 'PM মুদ্রা যোজনায় কি কোনও লুকানো জরিমানা আছে?',
    rec_heading: 'আপনার জন্য প্রকল্প খুঁজুন', rec_sub: 'কয়েকটি প্রশ্নের উত্তর দিন',
    rec_age: 'বয়স', rec_income: 'বার্ষিক আয়', rec_gender: 'লিঙ্গ', rec_state: 'রাজ্য',
    rec_category: 'শ্রেণি', rec_occupation: 'পেশা', rec_btn: 'প্রকল্প খুঁজুন',
    rec_loading: 'প্রকল্প খোঁজা হচ্ছে...', rec_result_title: 'যে প্রকল্পগুলিতে আপনি যোগ্য হতে পারেন',
  },

  // ---------------------------------------------------------------- தமிழ்
  ta: {
    nav_home: 'முகப்பு', nav_explainer: 'விளக்கம்', nav_compare: 'ஒப்பீடு',
    nav_chat: 'AI அரட்டை', nav_impact: 'தாக்கம்', select_language: 'மொழியைத் தேர்ந்தெடுக்கவும்',
    choose_scheme: 'ஒரு திட்டத்தைத் தேர்வுசெய்க...', explainer_pick: 'எளிய விளக்கம் பார்க்க ஒரு திட்டத்தைத் தேர்வுசெய்க', compare_title: 'திட்ட ஒப்பீடு', compare_sub: 'எந்த இரண்டு அரசுத் திட்டங்களின் பக்கவாட்டு ஒப்பீடு', compare_scheme1: 'திட்டம் 1', compare_scheme2: 'திட்டம் 2', compare_btn: 'திட்டங்களை ஒப்பிடு', compare_loading: 'ஒப்பிடப்படுகிறது...',
    apply_now: 'இப்போது விண்ணப்பிக்கவும்', apply_sub: 'அதிகாரப்பூர்வ அரசு போர்டல் புதிய தாவலில் திறக்கும்',
    badge_platform: 'இந்தியாவின் முதல் கொள்கை எழுத்தறிவு தளம்',
    hero_1: 'புரிந்துகொள்ளுங்கள் ஒவ்வொரு', hero_gov: 'அரசுத் திட்டத்தையும்', hero_2: 'எளிய சொற்களில்',
    hero_sub: 'ஜன்நீதி மத்திய மற்றும் மாநில அரசுத் திட்டங்களை எளிய மொழியில் விளக்குகிறது. சட்டச் சிக்கல்கள் இல்லை. குழப்பம் இல்லை. நீங்கள் நம்பக்கூடிய தெளிவான பதில்கள் மட்டுமே.',
    btn_search_scheme: 'திட்டத்தைத் தேடுங்கள்', btn_ask_ai: 'AI-யிடம் கேளுங்கள்',
    stat_schemes_num: '18+', stat_schemes_label: 'திட்டங்கள்', stat_schemes_desc: 'மத்திய & மாநிலத் திட்டங்கள்',
    stat_langs_num: '4', stat_langs_label: 'மொழிகள்', stat_langs_desc: 'ஆங்கிலம் + இந்திய மொழிகள்',
    stat_reading_num: 'வகுப்பு 6-8', stat_reading_label: 'வாசிப்பு நிலை', stat_reading_desc: 'மிக எளிய விளக்கங்கள்',
    stat_transparent_num: '100%', stat_transparent_label: 'வெளிப்படை', stat_transparent_desc: 'ஆதாரங்கள் & நம்பிக்கை நிலைகள்',
    features_heading: 'ஜன்நீதியில் நீங்கள் என்ன செய்யலாம்?',
    features_sub: 'அரசுத் திட்டங்கள் குறித்து சரியான முடிவுகளை எடுக்கத் தேவையான அனைத்தும்',
    feat_explainer_title: 'கொள்கை விளக்கி', feat_explainer_desc: 'எந்த அரசுத் திட்டத்தையும் எடுத்துக்காட்டுகளுடன் வகுப்பு 6-8 எளிய மொழியில் புரிந்துகொள்ளுங்கள்.',
    feat_hidden_title: 'மறைந்த நிபந்தனை கண்டறிதல்', feat_hidden_desc: 'சட்ட மொழியில் மறைந்துள்ள விலக்குகள், அபராதங்கள் மற்றும் கடமைகளைக் கண்டறியுங்கள். பச்சை, மஞ்சள், சிவப்பு எச்சரிக்கைகள்.',
    feat_chatbot_title: 'AI அரட்டைப் பாட்', feat_chatbot_desc: 'இயல்பான கேள்விகள் கேளுங்கள்: "நான் தகுதியா?" "இதில் சிக்கல் என்ன?" உடனடி நேர்மையான பதில்கள்.',
    feat_compare_title: 'திட்டங்களை ஒப்பிடுங்கள்', feat_compare_desc: 'நன்மைகள், தகுதி, அபாயங்கள் மற்றும் விண்ணப்ப செயல்முறையின் பக்கவாட்டு ஒப்பீடு.',
    feat_dashboard_title: 'தாக்க டாஷ்போர்டு', feat_dashboard_desc: 'நேரடி புள்ளிவிவரங்கள்: பயனாளிகள், வழங்கப்பட்ட நிதி மற்றும் அதிகாரப்பூர்வத் தரவிலிருந்து கவரேஜ்.',
    feat_voice_title: 'குரல்-முதல் அணுகல்', feat_voice_desc: 'இந்தி அல்லது பிராந்திய மொழிகளில் பேசுங்கள். விளக்கங்களைக் கேளுங்கள். எளிதான பயன்பாட்டிற்கு பெரிய பொத்தான்கள்.',
    try_now: 'இப்போது முயற்சிக்கவும்',
    trust_heading: 'நம்பிக்கை மற்றும் வெளிப்படைத்தன்மையின் அடிப்படையில்',
    trust_sub: 'ஜன்நீதியின் ஒவ்வொரு விளக்கத்திலும் அதிகாரப்பூர்வ ஆதாரம், அமைச்சகப் பெயர், கடைசியாகப் புதுப்பித்த தேதி மற்றும் நம்பிக்கைக் குறிகாட்டி உள்ளன. எங்கள் AI அதிகாரப்பூர்வத் தரவைப் பயன்படுத்துகிறது, விண்ணப்பிக்கும் முன் சரிபார்க்க எப்போதும் நினைவூட்டுகிறது.',
    trust_trustworthy_title: 'நம்பகமான', trust_trustworthy_desc: 'ஒவ்வொரு பதிலுக்கும் அதிகாரப்பூர்வ ஆதாரங்கள்',
    trust_simple_title: 'எளிய மொழி', trust_simple_desc: 'எடுத்துக்காட்டுகளுடன் வகுப்பு 6-8 வாசிப்பு நிலை',
    trust_nomis_title: 'தவறான தகவல் இல்லை', trust_nomis_desc: 'AI வழிகாட்டுதல் தெளிவாகக் குறிக்கப்பட்டுள்ளது',
    cta_heading: 'அரசுத் திட்டங்களைப் புரிந்துகொள்ளத் தயாரா?',
    cta_sub: 'பதிவு தேவையில்லை. உங்களுக்கு முக்கியமான திட்டங்களை ஆராயத் தொடங்குங்கள்.',
    btn_search_now: 'இப்போது திட்டத்தைத் தேடுங்கள்',
    footer_tagline: 'ஜன்நீதி - அனைவருக்கும் கொள்கை எழுத்தறிவு',
    footer_disclaimer: 'பொறுப்புத் துறப்பு: AI வழிகாட்டுதல் அதிகாரப்பூர்வ அறிவிப்புகளுக்கு மாற்றல்ல',
    page_title: 'திட்ட விளக்கி', page_sub: 'எளிய, கட்டமைக்கப்பட்ட விளக்கம் பெற எந்த திட்டத்தையும் தேடுங்கள்',
    search_placeholder: 'திட்டத்தைத் தேடுங்கள் (எ.கா. PM-KISAN, முத்ரா, ஆயுஷ்மான் பாரத்)...',
    explain_btn: 'திட்டத்தை விளக்கு', researching: 'தேடுகிறது...', analyzing: 'திட்டத் தகவல் பகுப்பாய்வு செய்யப்படுகிறது...',
    tab_explanation: 'விளக்கம்', tab_story: 'எளிய கதை', tab_hidden: 'மறைந்த விதிகள்',
    q_what_is: 'இந்தத் திட்டம் என்ன?', q_why: 'இது ஏன் அறிமுகப்படுத்தப்பட்டது?',
    q_benefits: 'உங்களுக்கு என்ன நன்மைகள் கிடைக்கும்?', q_eligible: 'யார் தகுதியானவர்?',
    q_documents: 'தேவையான ஆவணங்கள்', q_how_apply: 'எப்படி விண்ணப்பிப்பது',
    q_deadlines: 'முக்கியத் தேதிகள்', q_clauses: 'அடிக்கடி தவறாகப் புரிந்துகொள்ளப்படும் விதிகள்',
    story_title: 'ஒரு எளிய கதை', story_simple: 'எளிய சொற்களில்',
    story_example: 'அன்றாட உதாரணம்', story_takeaway: 'முக்கியக் கருத்து',
    cond_summary: 'முக்கிய அபாயங்களின் சுருக்கம்', cond_general: 'பொதுத் தகவல்',
    cond_read: 'கவனமாகப் படியுங்கள்', cond_alert: 'முக்கிய எச்சரிக்கை',
    cond_none: 'இந்தத் திட்டத்திற்கு குறிப்பிட்ட மறைந்த விதிகள் இல்லை. எப்போதும் அதிகாரப்பூர்வ ஆதாரங்களில் சரிபார்க்கவும்.',
    chatbot_title: 'AI அரட்டை உதவியாளர்', chatbot_sub: 'அரசுத் திட்டங்கள் பற்றி எளிய மொழியில் எதையும் கேளுங்கள்',
    chat_sources: 'ஆதாரங்கள்', chat_confidence: 'நம்பிக்கை',
    chat_input_placeholder: 'எந்த திட்டம் பற்றியும் கேள்வி கேளுங்கள்...',
    chat_disclaimer: 'இந்த AI உதவியாளர் பொதுவில் கிடைக்கும் தகவலின் அடிப்படையில் வழிகாட்டுகிறது. எந்தத் திட்டத்திற்கும் விண்ணப்பிக்கும் முன் எப்போதும் அதிகாரப்பூர்வ ஆதாரங்களில் சரிபார்க்கவும். AI தவறு செய்யக்கூடும் — தயவுசெய்து உங்கள் சொந்த தீர்மானத்தைப் பயன்படுத்துங்கள்.',
    chat_greeting: 'வணக்கம்! நான் ஜன்நீதி AI உதவியாளர். எந்த இந்திய அரசுத் திட்டம் பற்றியும் உங்கள் கேள்விகளுக்கு எளிய மொழியில் பதிலளிக்க முடியும். கேட்டுப் பாருங்கள் "நான் PM-KISAN-க்கு தகுதியா?" அல்லது "ஆயுஷ்மான் பாரத்தில் சிக்கல் என்ன?"',
    chat_try_asking: 'கேட்டுப் பாருங்கள்:',
    chat_q1: 'நான் PM-KISAN-க்கு தகுதியா?',
    chat_q2: 'ஆயுஷ்மான் பாரத்தில் சிக்கல் என்ன?',
    chat_q3: 'MGNREGA-வில் தவறான தகவல் கொடுத்தால் என்ன ஆகும்?',
    chat_q4: 'PM ஆவாஸ் யோஜனாவை PM ஸ்வநிதியுடன் ஒப்பிடுங்கள்',
    chat_q5: 'PM உஜ்வலா யோஜனாவுக்கு எப்படி விண்ணப்பிப்பது?',
    chat_q6: 'PM முத்ரா யோஜனாவில் ஏதேனும் மறைந்த அபராதம் உள்ளதா?',
    rec_heading: 'உங்களுக்கான திட்டங்களைக் கண்டறியுங்கள்', rec_sub: 'சில கேள்விகளுக்குப் பதிலளியுங்கள்',
    rec_age: 'வயது', rec_income: 'ஆண்டு வருமானம்', rec_gender: 'பாலினம்', rec_state: 'மாநிலம்',
    rec_category: 'பிரிவு', rec_occupation: 'தொழில்', rec_btn: 'திட்டங்களைக் கண்டறி',
    rec_loading: 'திட்டங்கள் தேடப்படுகின்றன...', rec_result_title: 'நீங்கள் தகுதி பெறக்கூடிய திட்டங்கள்',
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
    if (saved && STRINGS[saved]) setLangState(saved)
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
// compatibility aliases — app/page.tsx, providers.tsx, Navbar.tsx import these names
export const useI18n = useLang;
export const I18nProvider = LanguageProvider;