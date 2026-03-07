/* eslint-disable react-refresh/only-export-components */
import { createContext, useState, useEffect, useCallback, useContext, type ReactNode } from 'react';
import i18n from '../i18n';

export type Language = 'pt-BR' | 'es' | 'en' | 'de';

interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
}

const STORAGE_KEY = 'uph_lang';

const getInitialLanguage = (): Language => {
  if (typeof window === 'undefined') return 'pt-BR';
  const stored = localStorage.getItem(STORAGE_KEY);
  if (stored && ['pt-BR', 'es', 'en', 'de'].includes(stored)) {
    return stored as Language;
  }
  return 'pt-BR';
};

export const LanguageContext = createContext<LanguageContextType>({
  language: 'pt-BR',
  setLanguage: () => {},
});

export const useLanguage = () => useContext(LanguageContext);

interface LanguageProviderProps {
  children: ReactNode;
}

export const LanguageProvider = ({ children }: LanguageProviderProps) => {
  const [language, setLanguageState] = useState<Language>(getInitialLanguage);

  const setLanguage = useCallback((lang: Language) => {
    setLanguageState(lang);
    localStorage.setItem(STORAGE_KEY, lang);
    i18n.changeLanguage(lang);
  }, []);

  useEffect(() => {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored && ['pt-BR', 'es', 'en', 'de'].includes(stored)) {
      setLanguageState(stored as Language);
      i18n.changeLanguage(stored);
    }
  }, []);

  return (
    <LanguageContext.Provider value={{ language, setLanguage }}>
      {children}
    </LanguageContext.Provider>
  );
};

export const languageLabels: Record<Language, string> = {
  'pt-BR': 'Português',
  'es': 'Español',
  'en': 'English',
  'de': 'Deutsch',
};
