import React, { createContext, useContext, useState } from 'react';

const ThemeContext = createContext();

export function ThemeProvider({ children }) {
  // Global theme state and constants for the application
  const [theme, setTheme] = useState('light');

  const brandConfig = {
    colors: {
      primary: '#2874F0',   // Flipkart Blue
      accent: '#FB641B',    // Flipkart Orange
      background: '#F1F3F6',// Flipkart Light Gray bg
      text: '#212121',      // Primary Text
      textMuted: '#878787', // Secondary Text
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
