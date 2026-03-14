import React, { createContext, useContext, useEffect, useState } from 'react';

interface ThemeContextType {
  isDark: boolean;
  toggleDark: () => void;
  notifications: boolean;
  toggleNotifications: () => void;
  chatSound: boolean;
  toggleChatSound: () => void;
  language: 'en' | 'hi';
  toggleLanguage: () => void;
  chatEnabled: boolean;
  toggleChat: () => void;
  // Chatbot Personality Toggle
  chatPersonality: 'friendly' | 'professional';
  toggleChatPersonality: () => void;
  // Bot Online Status
  botOnline: boolean;
  setBotOnline: (status: boolean) => void;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export const ThemeProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [isDark, setIsDark] = useState(() => {
    if (typeof window !== 'undefined') {
      return localStorage.getItem('darkMode') === 'true';
    }
    return false;
  });
  const [notifications, setNotifications] = useState(true);
  const [chatSound, setChatSound] = useState(true);
  const [language, setLanguage] = useState<'en' | 'hi'>('en');
  const [chatEnabled, setChatEnabled] = useState(true);
  // Chatbot Personality State
  const [chatPersonality, setChatPersonality] = useState<'friendly' | 'professional'>('friendly');
  // Bot Online Status State
  const [botOnline, setBotOnline] = useState(true);

  useEffect(() => {
    if (isDark) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
    localStorage.setItem('darkMode', String(isDark));
  }, [isDark]);

  const toggleDark = () => setIsDark((prev) => !prev);
  const toggleNotifications = () => setNotifications((prev) => !prev);
  const toggleChatSound = () => setChatSound((prev) => !prev);
  const toggleLanguage = () => setLanguage((prev) => (prev === 'en' ? 'hi' : 'en'));
  const toggleChat = () => setChatEnabled((prev) => !prev);
  const toggleChatPersonality = () => setChatPersonality((prev) => (prev === 'friendly' ? 'professional' : 'friendly'));

  return (
    <ThemeContext.Provider
      value={{
        isDark,
        toggleDark,
        notifications,
        toggleNotifications,
        chatSound,
        toggleChatSound,
        language,
        toggleLanguage,
        chatEnabled,
        toggleChat,
        chatPersonality,
        toggleChatPersonality,
        botOnline,
        setBotOnline,
      }}
    >
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
};
