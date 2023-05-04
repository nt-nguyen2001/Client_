import { createContext, useEffect, useState } from 'react';

interface IThemeContext {
  themeMode: { darkMode: boolean; isTransition: boolean };
  toggleDarkMode: () => void;
}

export const ThemeContext = createContext<IThemeContext>({
  themeMode: { darkMode: false, isTransition: false },
  toggleDarkMode() {},
});

export default function ThemeProvider({ children }: { children: JSX.Element }) {
  const [themeMode, setThemeMode] = useState({
    darkMode: false,
    isTransition: false,
  });

  const toggleDarkMode = () => {
    const html = document.documentElement;
    const next = themeMode.darkMode ? 'light' : 'dark';
    html.setAttribute('data-theme', next);
    localStorage.setItem('theme', next);
    setThemeMode({
      ...themeMode,
      darkMode: !themeMode.darkMode,
    });
  };
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const theme = localStorage.theme;
      const html = document.documentElement;
      // html.setAttribute('data-theme', theme);
      html.setAttribute('data-theme', 'dark');
      setThemeMode({
        darkMode: theme === 'dark',
        isTransition: true,
      });
    }
  }, []);

  return <ThemeContext.Provider value={{ themeMode, toggleDarkMode }}>{children}</ThemeContext.Provider>;
}
