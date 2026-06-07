'use client';

import { useEffect, useMemo, useState, useCallback } from 'react';
import { useLocalStorage } from '../hooks/useLocalStorage.jsx';
import {
  applyThemeToDocument,
  resolveTheme,
  THEME_VALUES,
} from '../utils/theme.js';
import { ThemeContext } from './themeContext';

const STORAGE_KEY = 'cuan-theme';

export function ThemeProvider({ children }) {
  const [theme, setTheme] = useLocalStorage(STORAGE_KEY, THEME_VALUES.system);
  const [mounted] = useState(() => typeof window !== 'undefined');

  const resolvedTheme = useMemo(() => resolveTheme(theme), [theme]);

  useEffect(() => {
    applyThemeToDocument(theme);
  }, [theme]);

  useEffect(() => {
    if (theme !== THEME_VALUES.system) return;
    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
    const handleChange = () => applyThemeToDocument(theme);

    mediaQuery.addEventListener('change', handleChange);
    return () => mediaQuery.removeEventListener('change', handleChange);
  }, [theme]);

  const toggleTheme = useCallback(() => {
    setTheme((currentTheme) =>
      currentTheme === THEME_VALUES.dark
        ? THEME_VALUES.light
        : THEME_VALUES.dark,
    );
  }, [setTheme]);

  return (
    <ThemeContext.Provider
      value={{ theme, resolvedTheme, setTheme, toggleTheme, mounted }}
    >
      {children}
    </ThemeContext.Provider>
  );
}
