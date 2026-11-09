import React, { createContext, useState, useEffect, useContext } from 'react';
import { 
  LANGUAGES, 
  VOICE_LANGUAGES,
  t as translate, 
  speak as speakText, 
  speakKey as speakTextKey,
  speakStepGuidance as dictateStep,
  speakPlatformOverview as dictatePlatformOverview,
  stopSpeaking as cancelSpeech,
  subscribeSpeechState,
  startVoiceRecognition as listenVoice,
  parseVoiceCommand
} from '../lib/bhashini';

const LanguageContext = createContext(null);

export const LanguageProvider = ({ children }) => {
  const [lang, setLangState] = useState(() => {
    try {
      return localStorage.getItem('luma_language') || 'en';
    } catch {
      return 'en';
    }
  });

  const [voiceLang, setVoiceLangState] = useState(() => {
    try {
      return localStorage.getItem('luma_voice_language') || (localStorage.getItem('luma_language') === 'hi' ? 'hi' : 'en');
    } catch {
      return 'en';
    }
  });

  const [isSpeaking, setIsSpeaking] = useState(false);

  useEffect(() => {
    const unsubscribe = subscribeSpeechState((speaking) => {
      setIsSpeaking(speaking);
    });
    return unsubscribe;
  }, []);

  const setLang = (newLang) => {
    setLangState(newLang);
    setVoiceLangState(newLang);
    try {
      localStorage.setItem('luma_language', newLang);
      localStorage.setItem('luma_voice_language', newLang);
    } catch {}
  };

  const setVoiceLang = (newVoiceLang) => {
    setVoiceLangState(newVoiceLang);
    try {
      localStorage.setItem('luma_voice_language', newVoiceLang);
    } catch {}
  };

  const t = (key) => translate(key, lang);
  const speak = (text, targetLang = voiceLang) => speakText(text, targetLang);
  const speakKey = (key, targetLang = voiceLang) => speakTextKey(key, targetLang);
  const speakStepGuidance = (step, extra = {}) => dictateStep(step, voiceLang, extra);
  const speakPlatformOverview = (targetLang = lang) => dictatePlatformOverview(targetLang);
  const stopSpeaking = () => cancelSpeech();

  return (
    <LanguageContext.Provider value={{ 
      lang, 
      setLang, 
      voiceLang,
      setVoiceLang,
      t, 
      speak, 
      speakKey, 
      speakStepGuidance,
      speakPlatformOverview,
      stopSpeaking,
      isSpeaking,
      languages: LANGUAGES,
      voiceLanguages: VOICE_LANGUAGES,
      startVoiceRecognition: listenVoice,
      parseVoiceCommand
    }}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = () => {
  const context = useContext(LanguageContext);
  if (!context) {
    return {
      lang: 'en',
      setLang: () => {},
      voiceLang: 'en',
      setVoiceLang: () => {},
      t: (key) => translate(key, 'en'),
      speak: (text) => speakText(text, 'en'),
      speakKey: (key) => speakTextKey(key, 'en'),
      speakStepGuidance: (step, extra) => dictateStep(step, 'en', extra),
      speakPlatformOverview: () => dictatePlatformOverview('en'),
      stopSpeaking: () => cancelSpeech(),
      isSpeaking: false,
      languages: LANGUAGES,
      voiceLanguages: VOICE_LANGUAGES,
      startVoiceRecognition: listenVoice,
      parseVoiceCommand
    };
  }
  return context;
};
