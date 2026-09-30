/**
 * Bhashini Multilingual Localization & Speech Service for Luma
 * Supports 7 Indian languages with offline dictionary & Web Speech API TTS.
 */

export const LANGUAGES = [
  { code: 'en', label: 'English', native: 'English', locale: 'en-IN' },
  { code: 'hi', label: 'Hindi', native: 'हिंदी', locale: 'hi-IN' },
  { code: 'mr', label: 'Marathi', native: 'मराठी', locale: 'mr-IN' },
  { code: 'ta', label: 'Tamil', native: 'தமிழ்', locale: 'ta-IN' },
  { code: 'te', label: 'Telugu', native: 'తెలుగు', locale: 'te-IN' },
  { code: 'bn', label: 'Bengali', native: 'বাংলা', locale: 'bn-IN' },
  { code: 'gu', label: 'Gujarati', native: 'ગુજરાતી', locale: 'gu-IN' },
];

export const STRINGS = {
  // Navigation & General
  home: {
    en: 'Home', hi: 'होम', mr: 'मुख्यपृष्ठ', ta: 'முகப்பு', te: 'హోమ్', bn: 'হোম', gu: 'હોમ'
  },
  skin: {
    en: 'Skin Analysis', hi: 'त्वचा स्कैन', mr: 'त्वचा स्कॅन', ta: 'தோல் ஸ்கேன்', te: 'చర్మ స్కాన్', bn: 'ত্বক স্ক্যান', gu: 'ત્વચા સ્કેન'
  },
  dermai_title: {
    en: 'Clinical Triage', hi: 'क्लिनिकल ट्राइएज', mr: 'क्लिनिकल ट्राइएज', ta: 'மருத்துவ பரிசோதனை', te: 'క్లినికల్ పరీక్ష', bn: 'ক্লিনিকাল ট্রায়াজ', gu: 'ક્લિનિકલ ટ્રાયેજ'
  },
  outbreak_map: {
    en: 'Outbreak Map', hi: 'प्रकोप मानचित्र', mr: 'साथ नकाशा', ta: 'நோய் பரவல் வரைபடம்', te: 'వ్యాధి వ్యాప్తి మ్యాప్', bn: 'প্রকোপ মানচিত্র', gu: 'રોગચાળો નકશો'
  },
  history: {
    en: 'Patient Records', hi: 'रोगी रिकॉर्ड्स', mr: 'रुग्ण नोंदी', ta: 'நோயாளி பதிவுகள்', te: 'రోగి రికార్డులు', bn: 'রোগীর রেকর্ড', gu: 'દર્દી રેકોર્ડ્સ'
  },
  skincare: {
    en: 'Skincare Engine', hi: 'त्वचा देखभाल इंजन', mr: 'त्वचा काळजी इंजिन', ta: 'தோல் பராமரிப்பு', te: 'చర్మ సంరక్షణ', bn: 'স্কিনকেয়ার ইঞ্জিন', gu: 'સ્કિનકેર એન્જિન'
  },
  language: {
    en: 'Language', hi: 'भाषा', mr: 'भाषा', ta: 'மொழி', te: 'భాష', bn: 'ভাষা', gu: 'ભાષા'
  },
  disclaimer: {
    en: 'DISCLAIMER: This is an offline assistive screening tool, not a definitive medical diagnosis. Consult a licensed medical officer.',
    hi: 'अस्वीकरण: यह एक ऑफ़लाइन सहायक स्क्रीनिंग उपकरण है, अंतिम चिकित्सा निदान नहीं। योग्य चिकित्सक से परामर्श लें।',
    mr: 'अस्वीकरण: हे एक ऑफलाइन स्क्रीनिंग साधन आहे, वैद्यकीय निदान नाही. कृपया डॉक्टरांचा सल्ला घ्या.',
    ta: 'பொறுப்புத் துறப்பு: இது ஒரு ஆஃப்லைன் திரையிடல் கருவி மட்டுமே. மருத்துவரை அணுகவும்.',
    te: 'నిరాకరణ: ఇది కేవలం స్క్రీనింగ్ సాధనం మాత్రమే. వైద్యుడిని సంప్రదించండి.',
    bn: 'দাবিত্যাগ: এটি একটি অফলাইন স্ক্রিনিং টুল, চিকিৎসা নির্ণয় নয়। ডাক্তারের পরামর্শ নিন।',
    gu: 'અસ્વીકરણ: આ એક ઑફલાઇન સ્ક્રીનિંગ સાધન છે. તબીબી સલાહ મેળવો.'
  },
  app_tagline: {
    en: 'Skin Diagnosis · Offline Diagnostic Intelligence',
    hi: 'त्वचा निदान · ऑफ़लाइन डायग्नोस्टिक इंटेलिजेंस',
    mr: 'त्वचा निदान · ऑफलाइन निदान बुद्धिमत्ता',
    ta: 'தோல் பரிசோதனை · ஆஃப்லைன் நுண்ணறிவு',
    te: 'చర్మ పరీక్ష · ఆఫ్‌లైన్ నిర్ధారణ',
    bn: 'ত্বক নির্ণয় · অফলাইন ডায়াগনস্টিক ইন্টেলিজেন্স',
    gu: 'ત્વચા નિદાન · ઑફલાઇન ડાયગ્નોસ્ટિક ઇન્ટેલિજન્સ'
  },

  // Workflow steps
  start_diagnosis: {
    en: 'Start Clinical Triage', hi: 'क्लिनिकल जांच शुरू करें', mr: 'क्लिनिकल तपासणी सुरू करा', ta: 'பரிசோதனையை தொடங்கு', te: 'పరీక్ష ప్రారంభించండి', bn: 'ট্রায়াজ শুরু করুন', gu: 'તપાસ શરૂ કરો'
  },
  patient_details: {
    en: 'Patient Details', hi: 'रोगी विवरण', mr: 'रुग्ण तपशील', ta: 'நோயாளி விவரம்', te: 'రోగి వివరాలు', bn: 'রোগীর বিবরণ', gu: 'દર્દીની વિગતો'
  },
  patient_history: {
    en: 'Clinical History', hi: 'नैदानिक इतिहास', mr: 'क्लिनिकल इतिहास', ta: 'மருத்துவ வரலாறு', te: 'క్లినికల్ చరిత్ర', bn: 'ক্লিনিকাল ইতিহাস', gu: 'ક્લિનિકલ ઇતિહાસ'
  },
  camera_scan: {
    en: 'Guided Camera Scan', hi: 'निर्देशित कैमरा स्कैन', mr: 'मार्गदर्शित कॅमेरा स्कॅन', ta: 'வழிகாட்டப்பட்ட கேமரா ஸ்கேன்', te: 'కెమెరా స్కాన్', bn: 'ক্যামেরা স্ক্যান', gu: 'કેમેરા સ્કેન'
  },
  diagnosis_report: {
    en: 'Diagnosis Report', hi: 'निदान रिपोर्ट', mr: 'निदान अहवाल', ta: 'பரிசோதனை அறிக்கை', te: 'రోగ నిర్ధారణ నివేదిక', bn: 'রোগ নির্ণয় প্রতিবেদন', gu: 'નિદાન અહેવાલ'
  },

  // Patient Fields
  full_name: { en: 'Full Name', hi: 'पूरा नाम', mr: 'पूर्ण नाव', ta: 'முழு பெயர்', te: 'పూర్తి పేరు', bn: 'পুরো নাম', gu: 'પૂરું નામ' },
  age: { en: 'Age (Years)', hi: 'उम्र (वर्ष)', mr: 'वय (वर्षे)', ta: 'வயது', te: 'వయస్సు', bn: 'বয়স', gu: 'ઉંમર' },
  sex: { en: 'Sex', hi: 'लिंग', mr: 'लिंग', ta: 'பால்', te: 'లింగం', bn: 'লিঙ্গ', gu: 'જાતિ' },
  weight: { en: 'Weight (kg)', hi: 'वजन (किग्रा)', mr: 'वजन (किलो)', ta: 'எடை (கிலோ)', te: 'బరువు (కిలో)', bn: 'ওজন (কেজি)', gu: 'વજન (કિગ્રા)' },
  village: { en: 'Village / Town', hi: 'गाँव / शहर', mr: 'गाव / शहर', ta: 'கிராமம் / நகரம்', te: 'గ్రామం / పట్టణం', bn: 'গ্রাম / শহর', gu: 'ગામ / શહેર' },
  male: { en: 'Male', hi: 'पुरुष', mr: 'पुरुष', ta: 'ஆண்', te: 'పురుషుడు', bn: 'পুরুষ', gu: 'પુરુષ' },
  female: { en: 'Female', hi: 'महिला', mr: 'स्त्री', ta: 'பெண்', te: 'మహిళ', bn: 'মহিলা', gu: 'સ્ત્રી' },
  other: { en: 'Other', hi: 'अन्य', mr: 'इतर', ta: 'மற்றவை', te: 'ఇతర', bn: 'অন্যান্য', gu: 'અન્ય' },

  // Buttons & Controls
  next: { en: 'Next Step', hi: 'अगला चरण', mr: 'पुढील टप्पा', ta: 'அடுத்த கட்டம்', te: 'తదుపరి దశ', bn: 'পরবর্তী ধাপ', gu: 'આગળનું પગલું' },
  back: { en: 'Back', hi: 'पीछे', mr: 'मागे', ta: 'பின்செல்', te: 'వెనుకకు', bn: 'পেছনে', gu: 'પાછળ' },
  undo: { en: 'Undo', hi: 'पूर्ववत करें', mr: 'पूर्ववत करा', ta: 'செயல்தவிர்', te: 'రద్దు చేయి', bn: 'পূর্বাবস্থায় ফেরান', gu: 'રદ કરો' },
  finish: { en: 'Proceed to Scan', hi: 'स्कैन के लिए आगे बढ़ें', mr: 'स्कॅनकडे जा', ta: 'ஸ்கேன் செய்ய தொடரவும்', te: 'స్కాన్ వైపు సాగండి', bn: 'স্ক্যানে এগিয়ে যান', gu: 'સ્કેન તરફ આગળ વધો' },
  capture: { en: 'Capture Skin Lesion', hi: 'त्वचा की तस्वीर लें', mr: 'त्वचेचा फोटो घ्या', ta: 'புகைப்படம் எடு', te: 'ఫోటో తీయండి', bn: 'ছবি তুলুন', gu: 'ફોટો લો' },
  point_at_skin: {
    en: 'Align affected skin inside the reticle',
    hi: 'प्रभावित त्वचा को चौकोर फ्रेम के बीच में रखें',
    mr: 'बाधित त्वचा फ्रेमच्या मध्यभागी ठेवा',
    ta: 'பாதிக்கப்பட்ட தோல் பகுதியை கட்டத்திற்குள் வைக்கவும்',
    te: 'ప్రభావిత చర్మ భాగాన్ని ఫ్రేమ్ లోపల ఉంచండి',
    bn: 'আক্রান্ত ত্বক ফ্রেমের মাঝে রাখুন',
    gu: 'અસરગ્રસ્ત ત્વચાને ફ્રેમની અંદર રાખો'
  },
  generate_referral: {
    en: 'Generate Referral Slip', hi: 'रेफरल पर्ची बनाएं', mr: 'रेफरल स्लिप तयार करा', ta: 'பரிந்துரை சீட்டு உருவாக்கு', te: 'రిఫరల్ స్లిప్ సృష్టించండి', bn: 'রেফারেল স্লিপ তৈরি করুন', gu: 'રેફરલ સ્લિપ બનાવો'
  },
  send_sms: {
    en: 'Send via Fast2SMS', hi: 'SMS द्वारा भेजें', mr: 'SMS द्वारे पाठवा', ta: 'SMS அனுப்பு', te: 'SMS పంపండి', bn: 'SMS পাঠান', gu: 'SMS મોકલો'
  },
  new_patient: {
    en: 'New Patient Intake', hi: 'नया रोगी पंजीयन', mr: 'नवीन रुग्ण नोंदणी', ta: 'புதிய நோயாளி', te: 'కొత్త రోగి నమోదు', bn: 'নতুন রোগী', gu: 'નવો દર્દી'
  },

  // 7 Clinical Questions
  question_1: {
    en: 'How long have you had this skin condition?',
    hi: 'आपको यह त्वचा रोग कब से है?',
    mr: 'तुम्हाला ही त्वचेची समस्या किती काळापासून आहे?',
    ta: 'இந்த தோல் நோய் எவ்வளவு காலமாக உள்ளது?',
    te: 'మీకు ఈ చర్మ సమస్య ఎంతకాలంగా ఉంది?',
    bn: 'আপনার এই ত্বকের রোগ কতদিন ধরে?',
    gu: 'તમને આ ત્વચા રોગ ક્યારથી છે?'
  },
  question_2: {
    en: 'Is there itching, burning, or pain?',
    hi: 'क्या खुजली, जलन या दर्द है?',
    mr: 'खाज, जळजळ किंवा वेदना आहेत का?',
    ta: 'அரிப்பு, எரிச்சல் அல்லது வலி உள்ளதா?',
    te: 'దురద, మంట లేదా నొప్పి ఉందా?',
    bn: 'কি চুলকানি, জ্বালা বা ব্যথা আছে?',
    gu: 'ખંજવાળ, બળતરા કે દુખાવો છે?'
  },
  question_3: {
    en: 'Has anyone in your household had a similar condition?',
    hi: 'क्या आपके परिवार या घर में किसी को ऐसी समस्या रही है?',
    mr: 'तुमच्या कुटुंबातील कोणाला अशी समस्या होती का?',
    ta: 'உங்கள் வீட்டில் யாருக்காவது இதே போன்ற நோய் இருந்ததா?',
    te: 'మీ ఇంట్లో ఎవరికైనా ఇలాంటి సమస్య ఉందా?',
    bn: 'আপনার পরিবারে কারো অনুরূপ সমস্যা ছিল?',
    gu: 'તમારા ઘરમાં કોઈને આવી સમસ્યા હતી?'
  },
  question_4: {
    en: 'Have you been treated for a skin disease before?',
    hi: 'क्या पहले किसी त्वचा रोग का इलाज हुआ है?',
    mr: 'पूर्वी कधी त्वचा रोगाचा उपचार झाला आहे का?',
    ta: 'முன்பு தோல் நோய்க்கு சிகிச்சை பெற்றுள்ளீர்களா?',
    te: 'మీరు ముందు చర్మ వ్యాధికి చిकीత్స పొందారా?',
    bn: 'আগে কখনো ত্বকের রোগের চিকিৎসা নিয়েছেন?',
    gu: 'પહેલાં ક્યારેય ત્વચા રોગની સારવાર લીધી છે?'
  },
  question_5: {
    en: 'Do you have diabetes, HIV, or any chronic illness?',
    hi: 'क्या आपको मधुमेह, HIV या कोई पुरानी बीमारी है?',
    mr: 'तुम्हाला मधुमेह, HIV किंवा कोणताही जुनाट आजार आहे का?',
    ta: 'உங்களுக்கு நீரிழிவு, HIV அல்லது நாள்பட்ட நோய் உள்ளதா?',
    te: 'మీకు మధుమేహం, HIV లేదా దీర్ఘకాలిక వ్యాధి ఉందా?',
    bn: 'আপনার কি ডায়াবেটিস, HIV বা কোনো দীর্ঘস্থায়ী রোগ আছে?',
    gu: 'તમને ડાયાબિટીસ, HIV કે કોઈ લાંબાગાળાનો રોગ છે?'
  },
  question_6: {
    en: 'Are you currently taking any medication?',
    hi: 'क्या आप वर्तमान में कोई दवा ले रहे हैं?',
    mr: 'तुम्ही सध्या कोणतेही औषध घेत आहात का?',
    ta: 'நீங்கள் தற்போது மருந்து எடுத்துக்கொள்கிறீர்களா?',
    te: 'మీరు ప్రస్తుతం ఏదైనా మందు తీసుకుంటున్నారా?',
    bn: 'আপনি কি বর্তমানে কোনো ওষুধ খাচ্ছেন?',
    gu: 'તમે હાલમાં કોઈ દવા લો છો?'
  },
  question_7: {
    en: 'Has the affected area changed in size or colour recently?',
    hi: 'क्या प्रभावित क्षेत्र हाल ही में आकार या रंग में बदला है?',
    mr: 'बाधित भागाचा आकार किंवा रंग अलीकडे बदलला आहे का?',
    ta: 'பாதிக்கப்பட்ட பகுதி அளவு அல்லது நிறத்தில் சமீபத்தில் மாறியதா?',
    te: 'ప్రభావిత ప్రాంతం పరిమాణం లేదా రంగులో మారిందా?',
    bn: 'আক্রান্ত এলাকার আকার বা রঙ সম্প্রতি পরিবর্তিত হয়েছে?',
    gu: 'અસરગ્રસ્ત વિસ્તાર તાજેતરમાં કદ કે રંગમાં બદલાયો છે?'
  },

  // Answers & Directives
  yes: { en: 'Yes', hi: 'हाँ', mr: 'होय', ta: 'ஆம்', te: 'అవును', bn: 'হ্যাঁ', gu: 'હા' },
  no: { en: 'No', hi: 'नहीं', mr: 'नाही', ta: 'இல்லை', te: 'కాదు', bn: 'না', gu: 'ના' },
  describe: { en: 'Describe details...', hi: 'विवरण लिखें...', mr: 'तपशील लिहा...', ta: 'விவரங்களை உள்ளிடவும்...', te: 'వివరాలు...', bn: 'বিবরণ লিখুন...', gu: 'વિગતો લખો...' },

  // Audio helper prompt
  voice_front: {
    en: 'Please position the affected skin directly in the center of the screen.',
    hi: 'कृपया प्रभावित त्वचा को स्क्रीन के ठीक बीच में रखें।',
    mr: 'कृपया बाधित त्वचा स्क्रीनच्या मध्यभागी ठेवा.',
    ta: 'தயவுசெய்து பாதிக்கப்பட்ட தோலை திரையின் மையத்தில் வைக்கவும்.',
    te: 'దయచేసి ప్రభావిత చర్మాన్ని స్క్రీన్ మధ్యలో ఉంచండి.',
    bn: 'দয়া করে আক্রান্ত ত্বকটি স্ক্রিনের ঠিক মাঝখানে রাখুন।',
    gu: 'કૃપા કરીને અસરગ્રસ્ત ત્વચાને સ્ક્રીનની મધ્યમાં રાખો.'
  },
  voice_side: {
    en: 'Please take another photo from a different angle or close up.',
    hi: 'कृपया एक अलग कोण या पास से एक और फोटो लें।',
    mr: 'कृपया वेगळ्या कोनातून किंवा जवळून आणखी एक फोटो घ्या.',
    ta: 'தயவுசெய்து வேறு கோணத்தில் அல்லது நெருக்கமாக படம் எடுக்கவும்.',
    te: 'దయచేసి వేరే కోణం నుండి మరొక ఫోటో తీయండి.',
    bn: 'দয়া করে অন্য কোণ থেকে বা কাছাকাছি থেকে আরেকটি ছবি নিন।',
    gu: 'કૃપા કરીને બીજા ખૂણાથી અથવા નજીકથી બીજો ફોટો લો.'
  }
};

/** Translate string key with fallback to English or the key itself */
export function t(key, lang = 'en') {
  return STRINGS[key]?.[lang] || STRINGS[key]?.en || key;
}

/** Web Speech API Text-to-Speech */
export function speak(text, lang = 'en') {
  if (typeof window === 'undefined' || !('speechSynthesis' in window) || typeof SpeechSynthesisUtterance === 'undefined') return;
  try {
    window.speechSynthesis.cancel();
    const utterance = new SpeechSynthesisUtterance(text);
    const targetLang = LANGUAGES.find((l) => l.code === lang);
    utterance.lang = targetLang?.locale || 'en-IN';
    utterance.rate = 0.9;
    utterance.pitch = 1.0;
    window.speechSynthesis.speak(utterance);
  } catch (err) {
    console.warn('TTS playback error:', err);
  }
}

/** Read aloud a localized key */
export function speakKey(key, lang = 'en') {
  return speak(t(key, lang), lang);
}

/** Check if a language code is supported */
export function isSupportedLanguage(code) {
  return LANGUAGES.some((l) => l.code === code);
}

/** Get metadata for a supported language */
export function getLanguageDetails(code) {
  return LANGUAGES.find((l) => l.code === code) || null;
}

/** Get list of all supported language codes */
export function getSupportedLanguageCodes() {
  return LANGUAGES.map((l) => l.code);
}
