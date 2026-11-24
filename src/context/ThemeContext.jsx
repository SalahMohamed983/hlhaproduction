import { createContext, useContext, useEffect, useState } from 'react';

const ThemeContext = createContext({
  theme: 'light',
  darkMode: false,
  toggleTheme: () => {},
  setDarkMode: () => {},
  setTheme: () => {},
});

function getStoredTheme() {
  if (typeof window === 'undefined') return 'light';
  try {
    const stored = localStorage.getItem('halha-theme');
    if (stored === 'dark' || stored === 'light') return stored;
  } catch (e) {}
  return 'light';
}

function applyTheme(theme) {
  if (typeof document === 'undefined') return;
  const root = document.documentElement;
  if (theme === 'dark') {
    root.classList.add('dark');
  } else {
    root.classList.remove('dark');
  }
  try {
    localStorage.setItem('halha-theme', theme);
  } catch (e) {}
}

export function ThemeProvider({ children }) {
  const [theme, setThemeState] = useState(() => {
    const initial = getStoredTheme();
    applyTheme(initial);
    return initial;
  });

  const setTheme = (newTheme) => {
    setThemeState((prev) => {
      const resolved = typeof newTheme === 'function' ? newTheme(prev) : newTheme;
      const next = resolved === 'dark' ? 'dark' : 'light';
      applyTheme(next);
      return next;
    });
  };

  const toggleTheme = () => {
    setTheme((prev) => (prev === 'light' ? 'dark' : 'light'));
  };

  const setDarkMode = (val) => {
    if (typeof val === 'function') {
      setTheme((prev) => (val(prev === 'dark') ? 'dark' : 'light'));
    } else {
      setTheme(val ? 'dark' : 'light');
    }
  };

  useEffect(() => {
    applyTheme(theme);
  }, [theme]);

  const darkMode = theme === 'dark';

  return (
    <ThemeContext.Provider value={{ theme, darkMode, toggleTheme, setTheme, setDarkMode }}>
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  return useContext(ThemeContext);
}

