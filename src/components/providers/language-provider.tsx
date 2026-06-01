'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';
import { translations, Language } from '@/config/i18n';

interface LanguageContextProps {
  currentLanguage: Language;
  setLanguage: (lang: Language) => void;
  t: (key: string, replacements?: Record<string, string | number>) => string;
}

const LanguageContext = createContext<LanguageContextProps | undefined>(undefined);

export function LanguageProvider({ children }: { children: React.ReactNode }) {
  const [lang, setLang] = useState<Language>('th');

  useEffect(() => {
    const savedLang = localStorage.getItem('app-language') as Language;
    if (savedLang === 'th' || savedLang === 'en') {
      setLang(savedLang);
    }
  }, []);

  useEffect(() => {
    document.documentElement.lang = lang;
    document.documentElement.dataset.language = lang;
  }, [lang]);

  const changeLanguage = (newLang: Language) => {
    setLang(newLang);
    localStorage.setItem('app-language', newLang);
  };

  const t = (key: string, replacements?: Record<string, string | number>): string => {
    const langDict = (translations[lang] || translations.th) as Record<string, string>;
    let val = langDict[key] || key;

    if (replacements) {
      Object.entries(replacements).forEach(([k, v]) => {
        val = val.replace(`{${k}}`, String(v));
      });
    }
    return val;
  };

  // Avoid hydrations mismatch by rendering with default 'th' before mount
  return (
    <LanguageContext.Provider value={{ currentLanguage: lang, setLanguage: changeLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
}
