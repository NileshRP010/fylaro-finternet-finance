import React, { createContext, useContext, useState, useEffect } from 'react';

interface Language {
  code: string;
  name: string;
  flag: string;
}

export const languages: Language[] = [
  { code: 'en', name: 'English', flag: '🇺🇸' },
  { code: 'es', name: 'Español', flag: '🇪🇸' },
  { code: 'fr', name: 'Français', flag: '🇫🇷' },
  { code: 'de', name: 'Deutsch', flag: '🇩🇪' },
  { code: 'zh', name: '中文', flag: '🇨🇳' },
  { code: 'ja', name: '日本語', flag: '🇯🇵' },
  { code: 'ko', name: '한국어', flag: '🇰🇷' },
  { code: 'pt', name: 'Português', flag: '🇧🇷' },
];

interface LanguageContextType {
  currentLanguage: Language;
  changeLanguage: (code: string) => void;
  t: (key: string) => string;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

// Basic translations (expand this based on your needs)
const translations: Record<string, Record<string, string>> = {
  en: {
    'navbar.marketplace': 'Marketplace',
    'navbar.dashboard': 'Dashboard',
    'navbar.portfolio': 'Portfolio',
    'navbar.trading': 'Trading',
    'navbar.connectWallet': 'Connect Wallet',
    'navbar.connecting': 'Connecting...',
    'navbar.switchToArbitrum': 'Switch to Arbitrum',
    'navbar.arbitrumConnected': 'Arbitrum Connected',
    'navbar.wrongNetwork': 'Wrong Network',
  },
  es: {
    'navbar.marketplace': 'Mercado',
    'navbar.dashboard': 'Panel',
    'navbar.portfolio': 'Portafolio',
    'navbar.trading': 'Trading',
    'navbar.connectWallet': 'Conectar Billetera',
    'navbar.connecting': 'Conectando...',
    'navbar.switchToArbitrum': 'Cambiar a Arbitrum',
    'navbar.arbitrumConnected': 'Arbitrum Conectado',
    'navbar.wrongNetwork': 'Red Incorrecta',
  },
  // Add other languages as needed
};

export const LanguageProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [currentLanguage, setCurrentLanguage] = useState<Language>(() => {
    const savedLanguage = localStorage.getItem('language');
    const browserLanguage = navigator.language.split('-')[0];
    const defaultLanguage = languages.find(l => l.code === savedLanguage) || 
                          languages.find(l => l.code === browserLanguage) || 
                          languages[0];
    return defaultLanguage;
  });

  useEffect(() => {
    localStorage.setItem('language', currentLanguage.code);
    document.documentElement.lang = currentLanguage.code;
  }, [currentLanguage]);

  const changeLanguage = (code: string) => {
    const newLanguage = languages.find(l => l.code === code);
    if (newLanguage) {
      setCurrentLanguage(newLanguage);
    }
  };

  const t = (key: string): string => {
    return translations[currentLanguage.code]?.[key] || translations.en[key] || key;
  };

  return (
    <LanguageContext.Provider value={{ currentLanguage, changeLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = () => {
  const context = useContext(LanguageContext);
  if (context === undefined) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
};
