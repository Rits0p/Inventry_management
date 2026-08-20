import React, { createContext, useContext, useState, useEffect } from 'react';

const ThemeContext = createContext();

function getInitialTheme() {
  try {
    const stored = localStorage.getItem('theme');
    if (stored === 'light' || stored === 'dark') return stored;
  } catch {}
  if (typeof window !== 'undefined' && window.matchMedia?.('(prefers-color-scheme: dark)').matches) {
    return 'dark';
  }
  return 'light';
}

export function ThemeProvider({ children }) {
  const [theme, setTheme] = useState(getInitialTheme);

  useEffect(() => {
    const root = document.documentElement;
    if (theme === 'dark') {
      root.classList.add('dark');
      root.style.backgroundColor = '#0e0e14';
      document.body.style.backgroundColor = '#0e0e14';
    } else {
      root.classList.remove('dark');
      root.style.backgroundColor = '#F1F3F6';
      document.body.style.backgroundColor = '#F1F3F6';
    }
    try {
      localStorage.setItem('theme', theme);
    } catch {}
  }, [theme]);

  useEffect(() => {
    const mq = window.matchMedia('(prefers-color-scheme: dark)');
    const handler = (e) => {
      try {
        if (!localStorage.getItem('theme')) {
          setTheme(e.matches ? 'dark' : 'light');
        }
      } catch {}
    };
    mq.addEventListener('change', handler);
    return () => mq.removeEventListener('change', handler);
  }, []);

  const brandConfig = {
    colors: {
      primary: '#2874F0',
      accent: '#FB641B',
      background: '#F1F3F6',
      text: '#212121',
      textMuted: '#878787',
    },
    companyName: 'InventoryPro'
  };

  return (
    <ThemeContext.Provider value={{ theme, setTheme, brandConfig }}>
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  return useContext(ThemeContext);
}
