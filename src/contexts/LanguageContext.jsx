import React, { createContext, useState, useContext, useEffect } from 'react';
import { LANGUAGES, STRINGS, t as translate, speak as speakText, speakKey as speakTextKey } from '../lib/bhashini';

const LanguageContext = createContext(null);

export const LanguageProvider = ({ children }) => {
  const [lang, setLangState] = useState(() => {
    try {
      return localStorage.getItem('luma_language') || 'en';
    } catch {
      return 'en';
    }
  });

  const setLang = (newLang) => {
    setLangState(newLang);
    try {
      localStorage.setItem('luma_language', newLang);
    } catch {}
  };

  const t = (key) => translate(key, lang);
  const speak = (text) => speakText(text, lang);
  const speakKey = (key) => speakTextKey(key, lang);

  return (
    <LanguageContext.Provider value={{ lang, setLang, t, speak, speakKey, languages: LANGUAGES }}>
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
      t: (key) => translate(key, 'en'),
      speak: (text) => speakText(text, 'en'),
      speakKey: (key) => speakTextKey(key, 'en'),
      languages: LANGUAGES
    };
  }
  return context;
};
