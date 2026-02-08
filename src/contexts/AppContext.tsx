import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';

interface AppContextType {
  hasAcceptedTerms: boolean;
  acceptTerms: () => void;
  isDarkMode: boolean;
  toggleDarkMode: () => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

const TERMS_KEY = 'terms_accepted';
const THEME_KEY = 'theme_preference';

export function AppProvider({ children }: { children: ReactNode }) {
  const [hasAcceptedTerms, setHasAcceptedTerms] = useState<boolean>(() => {
    return localStorage.getItem(TERMS_KEY) === 'true';
  });

  const [isDarkMode, setIsDarkMode] = useState<boolean>(() => {
    const stored = localStorage.getItem(THEME_KEY);
    if (stored !== null) {
      return stored === 'dark';
    }
    return window.matchMedia('(prefers-color-scheme: dark)').matches;
  });

  useEffect(() => {
    if (isDarkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
    localStorage.setItem(THEME_KEY, isDarkMode ? 'dark' : 'light');
  }, [isDarkMode]);

  const acceptTerms = () => {
    setHasAcceptedTerms(true);
    localStorage.setItem(TERMS_KEY, 'true');
  };

  const toggleDarkMode = () => {
    setIsDarkMode(prev => !prev);
  };

  return (
    <AppContext.Provider
      value={{
        hasAcceptedTerms,
        acceptTerms,
        isDarkMode,
        toggleDarkMode,
      }}
    >
      {children}
    </AppContext.Provider>
  );
}

export function useApp() {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
}
