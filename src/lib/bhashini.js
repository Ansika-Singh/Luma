/**
 * Bhashini Multilingual Localization & Speech Service for Luma
 * Supports 7 Indian languages with comprehensive offline dictionary & Web Speech API TTS.
 */

export const LANGUAGES = [
  { code: 'en', label: 'English', native: 'English', locale: 'en-IN', active: true },
  { code: 'hi', label: 'Hindi', native: 'हिंदी', locale: 'hi-IN', active: true },
  { code: 'mr', label: 'Marathi', native: 'मराठी', locale: 'mr-IN', active: false },
  { code: 'ta', label: 'Tamil', native: 'தமிழ்', locale: 'ta-IN', active: false },
  { code: 'te', label: 'Telugu', native: 'తెలుగు', locale: 'te-IN', active: false },
  { code: 'bn', label: 'Bengali', native: 'বাংলা', locale: 'bn-IN', active: false },
  { code: 'gu', label: 'Gujarati', native: 'ગુજરાતી', locale: 'gu-IN', active: false },
];

export const VOICE_LANGUAGES = [
  { code: 'en', label: 'English (Indian)', native: 'English', locale: 'en-IN', active: true },
  { code: 'hi', label: 'Hindi (हिंदी)', native: 'हिंदी', locale: 'hi-IN', active: true },
  { code: 'mr', label: 'Marathi (मराठी) - Coming Soon', native: 'मराठी', locale: 'mr-IN', active: false },
  { code: 'ta', label: 'Tamil (தமிழ்) - Coming Soon', native: 'தமிழ்', locale: 'ta-IN', active: false },
  { code: 'te', label: 'Telugu (తెలుగు) - Coming Soon', native: 'తెలుగు', locale: 'te-IN', active: false },
  { code: 'bn', label: 'Bengali (বাংলা) - Coming Soon', native: 'বাংলা', locale: 'bn-IN', active: false },
  { code: 'gu', label: 'Gujarati (ગુજરાતી) - Coming Soon', native: 'ગુજરાતી', locale: 'gu-IN', active: false },
];

export const STRINGS = {
  // Navigation & General Branding
  home: {
    en: 'Home', hi: 'होम', mr: 'मुख्यपृष्ठ', ta: 'முகப்பு', te: 'హోమ్', bn: 'হোম', gu: 'હોમ'
  },
  skin: {
    en: 'Skin Analysis', hi: 'त्वचा विश्लेषण', mr: 'त्वचा स्कॅन', ta: 'தோல் ஸ்கேன்', te: 'చర్మ స్కాన్', bn: 'ত্বক স্ক্যান', gu: 'ત્વચા સ્કેન'
  },
  triage_title: {
    en: 'Clinical Triage', hi: 'क्लिनिकल ट्राइएज', mr: 'क्लिनिकल ट्राइएज', ta: 'மருத்துவ பரிசோதனை', te: 'క్లినికల్ పరీక్ష', bn: 'ক্লিনিকাল ট্রায়াজ', gu: 'ક્લિનિકલ ટ્રાયેજ'
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
    en: 'Skincare Engine', hi: 'त्वचा देखभाल', mr: 'त्वचा काळजी इंजिन', ta: 'தோல் பராமரிப்பு', te: 'చర్మ సంరక్షణ', bn: 'স্কিনকেয়ার ইঞ্জিন', gu: 'સ્કિનકેર એન્જિન'
  },
  language: {
    en: 'Language', hi: 'भाषा', mr: 'भाषा', ta: 'மொழி', te: 'భాష', bn: 'ভাষা', gu: 'ભાષા'
  },
  disclaimer: {
    en: 'DISCLAIMER: This is an offline assistive screening tool, not a definitive medical diagnosis. Consult a licensed medical officer.',
    hi: 'अस्वीकरण: यह एक ऑफ़लाइन सहायक स्क्रीनिंग उपकरण है, अंतिम चिकित्सा निदान नहीं। योग्य चिकित्सा अधिकारी से परामर्श लें।',
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
  app_subtitle: {
    en: 'Rural operator screening, 7-point clinical history & automated PHC referral protocol.',
    hi: 'ग्रामीण स्वास्थ्य कार्यकर्ता स्क्रीनिंग, 7-बिंदु नैदानिक इतिहास और स्वचालित पीएचसी रेफरल प्रोटोकॉल।',
    mr: 'ग्रामीण ऑपरेटर स्क्रीनिंग, 7-बिंदू क्लिनिकल इतिहास आणि स्वयंचलित पीएचसी संदर्भ प्रोटोकॉल.',
    ta: 'கிராமப்புற திரையிடல், 7-புள்ளி மருத்துவ வரலாறு மற்றும் தானியங்கி PHC பரிந்துரை நெறிமுறை.',
    te: 'గ్రామీణ స్క్రీనింగ్, 7-పాయింట్ క్లినికల్ హిస్టరీ మరియు ఆటోమేటెడ్ PHC రిఫరల్ ప్రోటోకాల్.',
    bn: 'গ্রামীণ স্ক্রীনিং, 7-পয়েন্ট ক্লিনিকাল ইতিহাস এবং স্বয়ংক্রিয় PHC রেফারেল প্রোটোকল।',
    gu: 'ગ્રામીણ સ્ક્રીનિંગ, 7-પોઇન્ટ ક્લિનિકલ હિસ્ટ્રી અને સ્વચાલિત PHC રેફરલ પ્રોટોકોલ.'
  },

  // Banner Badges
  offline_intelligence: {
    en: 'Offline Intelligence · v2.4',
    hi: 'ऑफ़लाइन इंटेलिजेंस · v2.4',
    mr: 'ऑफलाइन इंटेलिजन्स · v2.4'
  },
  fitz_calibrated: {
    en: 'Fitzpatrick V/VI Calibrated',
    hi: 'फ़िट्ज़पैट्रिक V/VI कैलिब्रेटेड',
    mr: 'फिट्झपॅट्रिक V/VI कॅलिब्रेटेड'
  },
  nha_hfr_integrated: {
    en: 'NHA HFR Integrated',
    hi: 'एनएचए एचएफआर एकीकृत',
    mr: 'NHA HFR समाकलित'
  },

  // Voice Guidance & Command Bar
  voice_guidance: {
    en: 'Voice Guidance',
    hi: 'आवाज मार्गदर्शन'
  },
  voice_command: {
    en: 'Voice Command',
    hi: 'वॉयस कमांड'
  },
  dictate_instructions: {
    en: 'Dictate Instructions',
    hi: 'निर्देश बोलें'
  },
  stop_audio: {
    en: 'Stop Audio',
    hi: 'ऑडियो रोकें'
  },
  listening: {
    en: 'Listening...',
    hi: 'सुन रहा है...'
  },
  voice_language_label: {
    en: 'Voice Language',
    hi: 'आवाज की भाषा'
  },
  voice_command_hint: {
    en: 'Say: "Next", "Back", "Male", "Female", "Scan", or "Instructions"',
    hi: 'बोलें: "आगे", "पीछे", "पुरुष", "महिला", "स्कैन", या "निर्देश"'
  },
  speech_unsupported: {
    en: 'Voice recognition not supported in this browser. Use Dictate Instructions for speech.',
    hi: 'इस ब्राउज़र में वॉयस रिकग्निशन समर्थित नहीं है। ऑडियो सुनने के लिए "निर्देश बोलें" का उपयोग करें।'
  },
  mic_denied: {
    en: 'Microphone permission denied. Please allow microphone access for voice commands.',
    hi: 'माइक्रोफ़ोन अनुमति अस्वीकृत। कृपया वॉयस कमांड के लिए माइक्रोफ़ोन की अनुमति दें।'
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
  step_prefix: {
    en: 'Step', hi: 'चरण'
  },
  of: {
    en: 'of', hi: 'का'
  },
  intake_short: {
    en: 'Intake', hi: 'पंजीयन'
  },
  history_short: {
    en: 'History', hi: 'इतिहास'
  },
  scan_short: {
    en: 'Scan', hi: 'स्कैन'
  },
  report_short: {
    en: 'Report', hi: 'रिपोर्ट'
  },

  // Step 1: Patient Fields & Labels
  full_name: { en: 'Full Name', hi: 'पूरा नाम', mr: 'पूर्ण नाव', ta: 'முழு பெயர்', te: 'పూర్తి పేరు', bn: 'পুরো নাম', gu: 'પૂરું નામ' },
  full_name_label: { en: 'Full Name / Patient ID', hi: 'पूरा नाम / रोगी आईडी' },
  full_name_placeholder: { en: 'e.g. Ramesh Patil / Sunita Sharma', hi: 'उदा. रमेश पाटिल / सुनीता शर्मा' },
  age: { en: 'Age (Years)', hi: 'उम्र (वर्ष)', mr: 'वय (वर्षे)', ta: 'வயது', te: 'వయస్సు', bn: 'বয়স', gu: 'ઉંમર' },
  age_placeholder: { en: 'e.g. 42', hi: 'उदा. 42' },
  sex: { en: 'Sex / Gender', hi: 'लिंग', mr: 'लिंग', ta: 'பால்', te: 'లింగం', bn: 'লিঙ্গ', gu: 'જાતિ' },
  male: { en: 'Male', hi: 'पुरुष', mr: 'पुरुष', ta: 'ஆண்', te: 'పురుషుడు', bn: 'পুরুষ', gu: 'પુરુષ' },
  female: { en: 'Female', hi: 'महिला', mr: 'स्त्री', ta: 'பெண்', te: 'మహిళ', bn: 'মহিলা', gu: 'સ્ત્રી' },
  other: { en: 'Other', hi: 'अन्य', mr: 'इतर', ta: 'மற்றவை', te: 'ఇతర', bn: 'অন্যান্য', gu: 'અન્ય' },
  weight: { en: 'Weight (kg)', hi: 'वजन (किग्रा)', mr: 'वजन (किलो)', ta: 'எடை (கிலோ)', te: 'బరువు (కిలో)', bn: 'ওজন (কেজি)', gu: 'વજન (કિગ્રા)' },
  weight_placeholder: { en: 'e.g. 58', hi: 'उदा. 58' },
  village: { en: 'Village / Rural Corridor', hi: 'गाँव / ग्रामीण क्षेत्र', mr: 'गाव / शहर', ta: 'கிராமம் / நகரம்', te: 'గ్రామం / పట్టణం', bn: 'গ্রাম / শহর', gu: 'ગામ / શહેર' },
  nearest_prefix: { en: 'Nearest', hi: 'निकटतम' },
  rural_intake_desc: {
    en: 'Rural community operator triage intake & demographic baseline',
    hi: 'ग्रामीण समुदाय संचालक ट्राइएज पंजीयन एवं जनसांख्यिकीय आधार'
  },
  zero_cloud_uploads: {
    en: 'Zero cloud uploads · Demographic data remains strictly on-device',
    hi: 'शून्य क्लाउड अपलोड · जनसांख्यिकीय डेटा पूरी तरह डिवाइस पर सुरक्षित है'
  },

  // Buttons & Controls
  next: { en: 'Next Step', hi: 'अगला चरण', mr: 'पुढील टप्पा', ta: 'அடுத்த கட்டம்', te: 'తదుపరి దశ', bn: 'পরবর্তী ধাপ', gu: 'આગળનું પગલું' },
  next_step: { en: 'Next Step', hi: 'अगला चरण', mr: 'पुढील टप्पा', ta: 'அடுத்த கட்டம்', te: 'తదుపరి దశ', bn: 'পরবর্তী ধাপ', gu: 'આગળનું પગલું' },
  back: { en: 'Back', hi: 'पीछे', mr: 'मागे', ta: 'பின்செல்', te: 'వెనుకకు', bn: 'পেছনে', gu: 'પાછળ' },
  previous_step: { en: 'Previous Question', hi: 'पिछला प्रश्न' },
  undo: { en: 'Undo', hi: 'पूर्ववत करें', mr: 'पूर्ववत करा', ta: 'செயல்தவிர்', te: 'రద్దు చేయి', bn: 'পূর্বাবস্থায় ফেরান', gu: 'રદ કરો' },
  undo_available: { en: 'Previous input modification available in undo history', hi: 'पिछला संशोधन पूर्ववत करने के लिए उपलब्ध है' },
  finish: { en: 'Proceed to Scan', hi: 'स्कैन के लिए आगे बढ़ें', mr: 'स्कॅनकडे जा', ta: 'ஸ்கேன் செய்ய தொடரவும்', te: 'స్కాన్ వైపు సాగండి', bn: 'স্ক্যানে এগিয়ে যান', gu: 'સ્કેન તરફ આગળ વધો' },
  capture: { en: 'Capture Skin Lesion', hi: 'त्वचा की तस्वीर लें', mr: 'त्वचेचा फोटो घ्या', ta: 'புகைப்படம் எடு', te: 'ఫోటో తీయండి', bn: 'ছবি তুলুন', gu: 'ફોટો લો' },

  // Step 2: 7 Clinical Questions
  question_prefix: { en: 'Question', hi: 'प्रश्न' },
  essential_criteria: { en: 'Essential rural triage criteria', hi: 'आवश्यक ग्रामीण ट्राइएज मानदंड' },
  answer_observations: { en: 'Answer & Clinical Observations', hi: 'उत्तर एवं नैदानिक अवलोकन' },
  optional_details_placeholder: {
    en: 'Optional details (e.g. 3 weeks, spreading to chest...)',
    hi: 'अतिरिक्त विवरण (उदा. 3 सप्ताह, छाती पर फैल रहा है...)'
  },
  question_1: {
    en: 'How long have you had this skin condition?',
    hi: 'आपको यह त्वचा रोग कितने समय से है?',
    mr: 'तुम्हाला ही त्वचेची समस्या किती काळापासून आहे?'
  },
  question_2: {
    en: 'Is there itching, burning, or pain?',
    hi: 'क्या खुजली, जलन या दर्द महसूस होता है?',
    mr: 'खाज, जळजळ किंवा वेदना आहेत का?'
  },
  question_3: {
    en: 'Has anyone in your household had a similar condition?',
    hi: 'क्या आपके परिवार या घर में किसी को ऐसी समस्या रही है?',
    mr: 'तुमच्या कुटुंबातील कोणाला अशी समस्या होती का?'
  },
  question_4: {
    en: 'Have you been treated for a skin disease before?',
    hi: 'क्या पहले किसी त्वचा रोग का इलाज हुआ है?',
    mr: 'पूर्वी कधी त्वचा रोगाचा उपचार झाला आहे का?'
  },
  question_5: {
    en: 'Do you have diabetes, HIV, or any chronic illness?',
    hi: 'क्या आपको मधुमेह (डायबिटीज), HIV या कोई पुरानी बीमारी है?',
    mr: 'तुम्हाला मधुमेह, HIV किंवा कोणताही जुनाट आजार आहे का?'
  },
  question_6: {
    en: 'Are you currently taking any medication?',
    hi: 'क्या आप वर्तमान में कोई नियमित दवा ले रहे हैं?',
    mr: 'तुम्ही सध्या कोणतेही औषध घेत आहात का?'
  },
  question_7: {
    en: 'Has the affected area changed in size or colour recently?',
    hi: 'क्या प्रभावित त्वचा हाल ही में आकार या रंग में बदली है?',
    mr: 'बाधित भागाचा आकार किंवा रंग अलीकडे बदलला आहे का?'
  },
  yes: { en: 'Yes', hi: 'हाँ', mr: 'होय', ta: 'ஆம்', te: 'అవును', bn: 'হ্যাঁ', gu: 'હા' },
  no: { en: 'No', hi: 'नहीं', mr: 'नाही', ta: 'இல்லை', te: 'కాదు', bn: 'না', gu: 'ના' },

  // Step 3: Camera & Scan
  smart_lesion_framing: { en: 'Smart Lesion Framing', hi: 'स्मार्ट घाव फ्रेमिंग' },
  point_at_skin: {
    en: 'Align affected skin inside the reticle',
    hi: 'प्रभावित त्वचा को चौकोर फ्रेम के बीच में रखें',
    mr: 'बाधित त्वचा फ्रेमच्या मध्यभागी ठेवा'
  },
  lesion_framing_instruction: {
    en: 'Position affected skin directly inside the center reticle. Maintain steady lighting.',
    hi: 'प्रभावित त्वचा को सीधे मध्य फ्रेम में रखें। पर्याप्त रोशनी बनाए रखें।'
  },
  live_camera_stream: { en: 'Live Camera Stream', hi: 'लाइव कैमरा स्ट्रीम' },
  camera_off_prompt: { en: 'Camera Off - Click Below to Start', hi: 'कैमरा बंद है - शुरू करने के लिए नीचे क्लिक करें' },
  ambient_light: { en: 'Ambient Light', hi: 'परिवेश प्रकाश' },
  start_guided_camera: { en: 'Start Guided Camera', hi: 'निर्देशित कैमरा शुरू करें' },
  retake_rescan: { en: 'Retake / Re-scan', hi: 'दोबारा फोटो लें' },
  analyze_generate_diagnosis: { en: 'Analyze & Generate Diagnosis', hi: 'विश्लेषण करें और निदान उत्पन्न करें' },
  upload_lesion_photo: { en: 'Upload Lesion Photo', hi: 'घाव की फोटो अपलोड करें' },
  upload_macro_desc: {
    en: 'Upload high-res photo for macro shots or private body areas',
    hi: 'मैक्रो शॉट्स या निजी अंगों के लिए गैलरी से फोटो अपलोड करें'
  },
  sample_lesions_label: { en: 'Or Test with Sample Lesions:', hi: 'या नमूना त्वचा घावों से परीक्षण करें:' },

  // Step 4: Diagnosis & Referral
  clinical_triage_decision: { en: 'Clinical Triage & Decision Support', hi: 'नैदानिक ट्राइएज एवं निर्णय सहायता' },
  syndromic_eval_protocol: { en: 'Syndromic Evaluation & Referral Protocol', hi: 'सिंड्रोमिक मूल्यांकन एवं रेफरल प्रोटोकॉल' },
  primary_clinical_finding: { en: 'Primary Clinical Finding', hi: 'प्राथमिक नैदानिक निष्कर्ष' },
  triage_priority_level: { en: 'Triage Priority Level', hi: 'ट्राइएज प्राथमिकता स्तर' },
  recommended_action_directives: { en: 'Recommended Action & Directives', hi: 'अनुशंसित कार्रवाई एवं निर्देश' },
  emergency_hospital_referral: { en: 'EMERGENCY: Immediate Referral Required', hi: 'आपातकालीन: तत्काल अस्पताल रेफरल आवश्यक' },
  abdm_referral_slip: { en: 'ABDM Digital Referral Slip', hi: 'आयुष्मान भारत डिजिटल रेफरल पर्ची' },
  copy_digital_slip: { en: 'Copy Digital Slip', hi: 'डिजिटल पर्ची कॉपी करें' },
  copied_to_clipboard: { en: 'Copied to Clipboard!', hi: 'क्लिपबोर्ड पर कॉपी हो गया!' },
  send_sms: { en: 'Send via Fast2SMS', hi: 'Fast2SMS द्वारा रेफरल भेजें' },
  sending_sms: { en: 'Sending SMS...', hi: 'एसएमएस भेजा जा रहा है...' },
  sms_sent: { en: 'SMS Dispatched to ASHA / Patient', hi: 'आशा / रोगी को एसएमएस भेज दिया गया' },
  new_patient: { en: 'New Patient Intake', hi: 'नया रोगी पंजीयन' },
  statutory_cdss_disclaimer: { en: 'Statutory CDSS Disclaimer', hi: 'वैधानिक सीडीएसएस अस्वीकरण' },
  cdss_disclaimer_content: {
    en: 'Luma is a Clinical Decision Support System (CDSS) for trained community health operators and ASHA workers. It provides risk stratification and clinical guidance, not autonomous definitive medical diagnosis. Always confirm findings with the Medical Officer at the assigned PHC/CHC.',
    hi: 'लूमा प्रशिक्षित सामुदायिक स्वास्थ्य कार्यकर्ताओं और आशा कार्यकर्ताओं के लिए एक क्लिनिकल डिसीजन सपोर्ट सिस्टम (सीडीएसएस) है। यह जोखिम स्तरीकरण और नैदानिक मार्गदर्शन प्रदान करता है, स्वायत्त अंतिम चिकित्सा निदान नहीं। हमेशा प्राथमिक स्वास्थ्य केंद्र के चिकित्सा अधिकारी से पुष्टि करें।'
  },

  // Right Side Panel: Active Session & Facility
  active_triage_session: { en: 'Active Triage Session', hi: 'सक्रिय ट्राइएज सत्र' },
  patient: { en: 'Patient', hi: 'रोगी' },
  awaiting_intake: { en: 'Awaiting Intake', hi: 'पंजीयन प्रतीक्षारत' },
  demographics: { en: 'Demographics', hi: 'जनसांख्यिकी' },
  corridor_village: { en: 'Corridor Village', hi: 'संबंधित गाँव' },
  clinical_history_status: { en: 'Clinical History', hi: 'नैदानिक इतिहास' },
  recorded: { en: 'recorded', hi: 'दर्ज' },
  assigned_health_facility: { en: 'Assigned Health Facility', hi: 'आवंटित स्वास्थ्य केंद्र' },
  nha_hfr_registered: { en: 'NHA HFR Registered', hi: 'एनएचए एचएफआर पंजीकृत' },
  proximity: { en: 'Proximity', hi: 'दूरी' },
  medical_officer: { en: 'Medical Officer', hi: 'चिकित्सा अधिकारी' },
  call_prefix: { en: 'Call', hi: 'कॉल करें' },
  ambulance_108: { en: 'Ambulance 108', hi: 'एंबुलेंस 108' },
  edge_ai_specifications: { en: 'Edge AI Specifications', hi: 'एज एआई विनिर्देश' },
  inference_engine: { en: 'Inference Engine', hi: 'अनुमान इंजन' },
  fitzpatrick_bias: { en: 'Fitzpatrick Bias', hi: 'फ़िट्ज़पैट्रिक पूर्वाग्रह' },
  fitz_types_calibrated: { en: 'Types V & VI Calibrated', hi: 'प्रकार V व VI कैलिब्रेटेड' },
  language_tts: { en: 'Language TTS', hi: 'भाषा टीटीएस' },
  bhashini_locales: { en: 'Bhashini 7 Indic Locales', hi: 'भाषिणी 7 भारतीय भाषाएं' },
  network_sandbox: { en: 'Network Sandbox', hi: 'नेटवर्क सैंडबॉक्स' },
  offline_capable: { en: '100% Offline Capable', hi: '100% ऑफ़लाइन सक्षम' },

  // Condition Directives
  directive_scabies: {
    en: 'Apply Permethrin 5% cream neck-to-toe. Treat patient AND every household contact simultaneously. Wash bedding in hot water. Immediate PHC referral.',
    hi: 'गर्दन से पैर तक परमेथ्रिन 5% क्रीम लगाएं। रोगी और परिवार के सभी सदस्यों का एक साथ इलाज करें। बिस्तरों को गर्म पानी में धोएं। तत्काल पीएचसी रेफरल।'
  },
  directive_eczema: {
    en: 'Apply bland emollient (liquid paraffin / white soft paraffin) thrice daily. Short course mild topical steroid (Hydrocortisone 1%). Avoid harsh soaps and heat triggers.',
    hi: 'दिन में तीन बार साधारण मॉइस्चराइज़र (पैराफिन) लगाएं। हल्के सामयिक स्टेरॉयड (हाइड्रोकार्टिसोन 1%) का छोटा कोर्स। कठोर साबुन और अत्यधिक गर्मी से बचें।'
  },
  directive_dermatitis: {
    en: 'Identify and eliminate contact allergen (detergents, agricultural chemicals, nickel, plants). Apply cold compresses and soothing calamine or emollient.',
    hi: 'एलर्जी पैदा करने वाले तत्व (डिटर्जेंट, कीटनाशक, पौधे) की पहचान करें और दूर रहें। ठंडी सिकाई करें और सुखदायक कैलामाइन लोशन लगाएं।'
  },
  directive_tinea: {
    en: 'Topical antifungal cream (Clotrimazole 1% or Terbinafine 1%) applied twice daily for 3-4 weeks. Keep area dry. DO NOT use steroid creams (avoid steroid misuse).',
    hi: 'सामयिक एंटीफंगल क्रीम (क्लोट्रिमेज़ोल 1% या टर्बिनाफाइन 1%) दिन में दो बार 3-4 सप्ताह लगाएं। प्रभावित जगह सूखी रखें। स्टेरॉयड क्रीम का उपयोग न करें।'
  },
  directive_vitiligo: {
    en: 'Preserve skin barrier. Counsel on strict sun protection to prevent sunburn in amelanotic skin. Refer to District Hospital for phototherapy / topical calcineurin evaluation.',
    hi: 'त्वचा की सुरक्षा बनाए रखें। धूप से सख्त सुरक्षा रखें ताकि सनबर्न न हो। फोटोथेरेपी और विशेष मूल्यांकन के लिए जिला अस्पताल रेफर करें।'
  },
  directive_melanoma: {
    en: 'CRITICAL: Lesion exhibits high risk features (Asymmetry, Border irregularity, Color variation). Immediate oncology or surgical dermatology evaluation required.',
    hi: 'अति-महत्वपूर्ण: घाव में उच्च जोखिम वाले लक्षण हैं। तत्काल ऑन्कोलॉजी या सर्जिकल त्वचा विशेषज्ञ से जांच आवश्यक है।'
  },
  directive_bcc: {
    en: 'Suspected non-melanoma skin cancer. Arrange formal biopsy at District Hospital. Avoid topical unprescribed remedies.',
    hi: 'संदिग्ध गैर-मेलेनोमा त्वचा कैंसर। जिला अस्पताल में बायोप्सी की व्यवस्था करें। बिना पर्चे के किसी भी मरहम से बचें।'
  },
  directive_ak: {
    en: 'Precancerous solar keratosis. Cryotherapy or topical 5-FU may be indicated by dermatologist. Strict broad-spectrum sun protection required.',
    hi: 'कैंसर-पूर्व धूप की समस्या (एक्टिनिक केराटोसिस)। त्वचा विशेषज्ञ द्वारा क्रायोथेरेपी की आवश्यकता हो सकती है। सख्त धूप से बचाव करें।'
  },
  directive_bk: {
    en: 'Benign lesion. No aggressive intervention required unless mechanically irritated by clothing. Reassure patient.',
    hi: 'हानिरहित (सौम्य) घाव। जब तक कपड़ों से जलन न हो, किसी उपचार की आवश्यकता नहीं है। रोगी को आश्वस्त करें।'
  },
  directive_df: {
    en: 'Benign reactive fibrous histiocytoma (pinch/dimple sign positive). Reassure patient. No surgical excision needed unless symptomatic.',
    hi: 'हानिरहित फाइब्रोमा। जब तक दर्द या लक्षण न हों, सर्जरी की आवश्यकता नहीं है। रोगी को आश्वस्त करें।'
  },
  directive_nevus: {
    en: 'Benign melanocytic proliferation. Counsel patient on regular monthly self-monitoring for any ABCDE changes.',
    hi: 'हानिरहित तिल (नेवस)। रोगी को आकार या रंग में किसी भी बदलाव पर नज़र रखने की सलाह दें।'
  },
  directive_vascular: {
    en: 'Benign vascular lesion. Reassure patient. Protect against trauma or excessive bleeding.',
    hi: 'हानिरहित संवहनी घाव। रोगी को आश्वस्त करें। रगड़ या चोट से बचाएं।'
  },

  // Condition Display Names
  'Scabies': { en: 'Scabies', hi: 'स्केबीज (Scabies)' },
  'Eczema': { en: 'Eczema', hi: 'एक्जिमा (Eczema)' },
  'Dermatitis': { en: 'Dermatitis', hi: 'डर्मेटाइटिस (Dermatitis)' },
  'Tinea Ringworm': { en: 'Tinea Ringworm', hi: 'दाद (Tinea Ringworm)' },
  'Vitiligo': { en: 'Vitiligo', hi: 'विटिलिगो (Vitiligo)' },
  'Melanoma': { en: 'Melanoma', hi: 'मेलेनोमा (Melanoma)' },
  'Eczema (Atopic Dermatitis)': { en: 'Eczema (Atopic Dermatitis)', hi: 'एक्जिमा (एटॉपिक डर्मेटाइटिस)' },
  'Contact Dermatitis': { en: 'Contact Dermatitis', hi: 'कॉन्टैक्ट डर्मेटाइटिस' },
  'Tinea Corporis (Ringworm)': { en: 'Tinea Corporis (Ringworm)', hi: 'दाद (टिनिया कॉर्पोरिस)' },
  'Vitiligo (Hypopigmentation)': { en: 'Vitiligo (Hypopigmentation)', hi: 'विटिलिगो (सफेद दाग)' },
  'Melanoma (Suspect Lesion)': { en: 'Melanoma (Suspect Lesion)', hi: 'मेलेनोमा (संदिग्ध घातक घाव)' },
  'Basal Cell Carcinoma': { en: 'Basal Cell Carcinoma', hi: 'बेसल सेल कार्सिनोमा' },
  'Actinic Keratoses': { en: 'Actinic Keratoses', hi: 'एक्टिनिक केराटोसिस' },
  'Benign Keratosis (Seborrheic)': { en: 'Benign Keratosis (Seborrheic)', hi: 'सौम्य केराटोसिस' },
  'Dermatofibroma': { en: 'Dermatofibroma', hi: 'डर्मेटोफाइब्रोमा' },
  'Melanocytic Nevus (Common Mole)': { en: 'Melanocytic Nevus (Common Mole)', hi: 'सौम्य तिल (नेवस)' },

  // Priority Tiers
  priority_high: { en: 'HIGH - IMMEDIATE ESCALATION', hi: 'उच्च जोखिम - तत्काल रेफरल आवश्यक' },
  priority_medium: { en: 'MODERATE - PHC OPD REFERRAL', hi: 'मध्यम - नियमित पीएचसी ओपीडी परामर्श' },
  priority_low: { en: 'LOW - LOCAL MONITORING', hi: 'कम जोखिम - स्थानीय देखभाल एवं निगरानी' },

  // Audio helper prompt
  voice_front: {
    en: 'Please position the affected skin directly in the center of the screen.',
    hi: 'कृपया प्रभावित त्वचा को स्क्रीन के ठीक बीच में रखें।',
    mr: 'कृपया बाधित त्वचा स्क्रीनच्या मध्यभागी ठेवा.'
  },
  voice_side: {
    en: 'Please take another photo from a different angle or close up.',
    hi: 'कृपया एक अलग कोण या पास से एक और फोटो लें।',
    mr: 'कृपया वेगळ्या कोनातून किंवा जवळून आणखी एक फोटो घ्या.'
  },

  // Spoken Step Instructions (Dictation)
  voice_step_1: {
    en: "Welcome to Luma Clinical Triage. Please enter the patient's full name, age, gender, and weight, then choose their village to connect with the nearest primary health centre. After filling the details, click Next Step.",
    hi: "लूमा क्लिनिकल ट्राइएज में आपका स्वागत है। कृपया रोगी का पूरा नाम, आयु, लिंग और वजन भरें, और निकटतम स्वास्थ्य केंद्र से जोड़ने के लिए गाँव चुनें। विवरण भरने के बाद अगला चरण बटन दबाएँ।"
  },
  voice_step_2: {
    en: "Step 2: Clinical history questionnaire. Please answer the 7 questions regarding symptoms, duration, itching, and family history. Select Yes or No for each question.",
    hi: "चरण 2: नैदानिक इतिहास प्रश्नावली। कृपया खुजली, अवधि और पारिवारिक इतिहास से संबंधित 7 प्रश्नों के उत्तर दें। प्रत्येक प्रश्न के लिए हाँ या नहीं चुनें।"
  },
  voice_step_3: {
    en: "Step 3: Guided lesion scan. Hold the camera steady and place the affected skin in the center frame, or upload a clear photo from your gallery. Then tap Capture to start AI analysis.",
    hi: "चरण 3: त्वचा स्कैन। कैमरे को स्थिर रखकर घाव को फ्रेम के बीच में रखें, या फोन से फोटो अपलोड करें। इसके बाद कैप्चर और विश्लेषण पर टैप करें।"
  },
  voice_step_4: {
    en: "Step 4: Clinical diagnosis and referral report. Review the suspected condition and triage priority level. You can generate an ABDM referral slip or dispatch an emergency SMS.",
    hi: "चरण 4: नैदानिक रिपोर्ट। संभावित स्थिति और प्राथमिकता स्तर की समीक्षा करें। आप आयुष्मान भारत रेफरल पर्ची बना सकते हैं या एसएमएस भेज सकते हैं।"
  }
};

/** Translate string key with fallback to English or the key itself */
export function t(key, lang = 'en') {
  return STRINGS[key]?.[lang] || STRINGS[key]?.en || key;
}

// Track active utterance to prevent browser garbage collection cutting off speech
let activeUtterance = null;
let speechListeners = new Set();

export function subscribeSpeechState(listener) {
  speechListeners.add(listener);
  return () => speechListeners.delete(listener);
}

function notifySpeechState(isSpeaking) {
  speechListeners.forEach((l) => {
    try { l(isSpeaking); } catch {}
  });
}

/** Check if speech is currently active */
export function isSpeakingActive() {
  if (typeof window === 'undefined' || !('speechSynthesis' in window)) return false;
  return window.speechSynthesis.speaking;
}

/** Stop ongoing speech immediately */
export function stopSpeaking() {
  if (typeof window === 'undefined' || !('speechSynthesis' in window)) return;
  try {
    window.speechSynthesis.cancel();
    activeUtterance = null;
    notifySpeechState(false);
  } catch (err) {
    console.warn('Error stopping speech:', err);
  }
}

/** Web Speech API Text-to-Speech with authentic Indic voice selection */
export function speak(text, lang = 'en', onComplete = null) {
  if (typeof window === 'undefined' || !('speechSynthesis' in window) || typeof SpeechSynthesisUtterance === 'undefined') return;
  try {
    window.speechSynthesis.cancel();
    if (!text || !text.trim()) return;

    const utterance = new SpeechSynthesisUtterance(text);
    activeUtterance = utterance;

    const targetLang = LANGUAGES.find((l) => l.code === lang) || { locale: 'en-IN' };
    utterance.lang = targetLang.locale || (lang === 'hi' ? 'hi-IN' : 'en-IN');
    utterance.rate = lang === 'hi' ? 0.88 : 0.92;
    utterance.pitch = 1.0;

    // Pick best matching native voice if available
    const voices = window.speechSynthesis.getVoices?.() || [];
    if (voices.length > 0) {
      if (lang === 'hi') {
        const hindiVoice = voices.find((v) => v.lang === 'hi-IN' || v.lang.startsWith('hi') || v.name.toLowerCase().includes('hindi'));
        if (hindiVoice) utterance.voice = hindiVoice;
      } else {
        const indianEngVoice = voices.find((v) => v.lang === 'en-IN' || (v.lang.startsWith('en') && v.name.toLowerCase().includes('india')));
        if (indianEngVoice) utterance.voice = indianEngVoice;
      }
    }

    utterance.onstart = () => notifySpeechState(true);
    utterance.onend = () => {
      activeUtterance = null;
      notifySpeechState(false);
      if (onComplete) onComplete();
    };
    utterance.onerror = (e) => {
      activeUtterance = null;
      notifySpeechState(false);
      console.warn('TTS playback issue:', e);
    };

    window.speechSynthesis.speak(utterance);
  } catch (err) {
    console.warn('TTS playback error:', err);
    notifySpeechState(false);
  }
}

/** Read aloud a localized key */
export function speakKey(key, lang = 'en') {
  return speak(t(key, lang), lang);
}

/** Dictate full operational guidance for a specific workflow step */
export function speakStepGuidance(step, lang = 'en', extraContext = {}) {
  let promptText = '';
  if (step === 1) {
    promptText = t('voice_step_1', lang);
  } else if (step === 2) {
    const questionText = extraContext.questionKey ? t(extraContext.questionKey, lang) : '';
    const qNum = extraContext.questionIndex !== undefined ? extraContext.questionIndex + 1 : 1;
    if (lang === 'hi') {
      promptText = `चरण 2: नैदानिक इतिहास। प्रश्न ${qNum} / 7: ${questionText}। कृपया रोगी से पूछकर हाँ या नहीं चुनें, और यदि आवश्यक हो तो अतिरिक्त विवरण दर्ज करें।`;
    } else {
      promptText = `Step 2: Clinical history questionnaire. Question ${qNum} of 7: ${questionText}. Please ask the patient and choose Yes or No, and record any additional details if needed.`;
    }
  } else if (step === 3) {
    promptText = t('voice_step_3', lang);
  } else if (step === 4) {
    const condition = extraContext.condition || '';
    if (lang === 'hi') {
      promptText = `चरण 4: नैदानिक निदान रिपोर्ट। संभावित स्थिति: ${condition || 'त्वचा घाव'}। कृपया अनुशंसित कार्रवाई की समीक्षा करें। आप आयुष्मान भारत डिजिटल रेफरल पर्ची बना सकते हैं या पीएचसी को एसएमएस भेज सकते हैं।`;
    } else {
      promptText = `Step 4: Clinical diagnosis and triage report. Suspected condition: ${condition || 'Skin Lesion'}. Review the recommended action directives. You can generate an ABDM referral slip or dispatch an SMS to the PHC.`;
    }
  }

  if (promptText) {
    speak(promptText, lang);
  }
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

/**
 * Speech Recognition Parser for Hands-Free Voice Commands
 * Supports Hindi & English commands
 */
export function parseVoiceCommand(rawTranscript, lang = 'en') {
  if (!rawTranscript) return null;
  const text = rawTranscript.trim().toLowerCase();

  // 1. Navigation Commands (Next / Proceed)
  if (
    text.includes('next') || text.includes('forward') || text.includes('continue') ||
    text.includes('proceed') || text.includes('आगे') || text.includes('अगला') || text.includes('चलो')
  ) {
    return { type: 'NEXT_STEP', action: 'next' };
  }

  // 2. Navigation Commands (Back / Undo)
  if (
    text.includes('back') || text.includes('previous') || text.includes('undo') ||
    text.includes('पीछे') || text.includes('पिछला') || text.includes('वापस')
  ) {
    return { type: 'PREV_STEP', action: 'back' };
  }

  // 3. Clinical Questionnaire: YES
  if (
    text === 'yes' || text.startsWith('yes') || text.includes('yeah') ||
    text === 'हाँ' || text === 'हा' || text.includes('हाँ') || text.includes('सही')
  ) {
    return { type: 'ANSWER', value: 'Yes' };
  }

  // 4. Clinical Questionnaire: NO
  if (
    text === 'no' || text.startsWith('no') || text.includes('nope') ||
    text === 'नहीं' || text === 'ना' || text.includes('नहीं')
  ) {
    return { type: 'ANSWER', value: 'No' };
  }

  // 5. Gender / Sex selection
  if (text.includes('female') || text.includes('महिला') || text.includes('स्त्री') || text.includes('औरत')) {
    return { type: 'SET_FIELD', field: 'sex', value: 'Female' };
  }
  if (text.includes('male') || text.includes('पुरुष') || text.includes('आदमी')) {
    return { type: 'SET_FIELD', field: 'sex', value: 'Male' };
  }
  if (text.includes('other') || text.includes('अन्य')) {
    return { type: 'SET_FIELD', field: 'sex', value: 'Other' };
  }

  // 6. Camera / Scan Actions
  if (
    text.includes('scan') || text.includes('camera') || text.includes('capture') ||
    text.includes('photo') || text.includes('स्कैन') || text.includes('कैमरा') || text.includes('फोटो')
  ) {
    return { type: 'SCAN_ACTION', action: 'capture' };
  }

  // 7. Language Switch commands
  if (text.includes('hindi') || text.includes('हिंदी')) {
    return { type: 'SWITCH_LANG', lang: 'hi' };
  }
  if (text.includes('english') || text.includes('अंग्रेजी')) {
    return { type: 'SWITCH_LANG', lang: 'en' };
  }

  // 8. Help / Dictate Instructions
  if (
    text.includes('help') || text.includes('instructions') || text.includes('dictate') ||
    text.includes('मदद') || text.includes('निर्देश') || text.includes('बताओ') || text.includes('समझाओ')
  ) {
    return { type: 'DICTATE_HELP' };
  }

  // 9. Stop Speech
  if (
    text.includes('stop') || text.includes('quiet') || text.includes('mute') ||
    text.includes('रुको') || text.includes('रुकिए') || text.includes('चुप')
  ) {
    return { type: 'STOP_SPEECH' };
  }

  return { type: 'UNKNOWN', raw: text };
}

/**
 * Start Speech Recognition Listener
 * Returns cleanup function or null
 */
export function startVoiceRecognition({
  lang = 'hi',
  onResult = null,
  onCommand = null,
  onError = null,
  onEnd = null
}) {
  if (typeof window === 'undefined') return null;

  const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
  if (!SpeechRecognition) {
    if (onError) onError('SPEECH_RECOGNITION_UNSUPPORTED');
    return null;
  }

  try {
    const recognition = new SpeechRecognition();
    recognition.lang = lang === 'hi' ? 'hi-IN' : 'en-IN';
    recognition.continuous = false;
    recognition.interimResults = false;
    recognition.maxAlternatives = 1;

    recognition.onresult = (event) => {
      if (!event.results || event.results.length === 0) return;
      const transcript = event.results[0][0]?.transcript || '';
      if (onResult) onResult(transcript);

      const parsed = parseVoiceCommand(transcript, lang);
      if (onCommand && parsed) onCommand(parsed, transcript);
    };

    recognition.onerror = (event) => {
      if (onError) onError(event.error || 'RECOGNITION_ERROR');
    };

    recognition.onend = () => {
      if (onEnd) onEnd();
    };

    recognition.start();
    return recognition;
  } catch (err) {
    if (onError) onError(err.message || 'INIT_ERROR');
    return null;
  }
}
