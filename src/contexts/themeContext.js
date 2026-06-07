import { createContext } from 'react';
import { THEME_VALUES } from '../utils/theme.js';

export const ThemeContext = createContext({
  theme: THEME_VALUES.light,
  resolvedTheme: THEME_VALUES.light,
  setTheme: () => {},
  toggleTheme: () => {},
  mounted: false,
});
