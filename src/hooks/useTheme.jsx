import { useContext } from 'react';
import { ThemeContext } from '../contexts/themeContext.js';

export function useTheme() {
  return useContext(ThemeContext);
}
