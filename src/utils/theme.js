export const THEME_VALUES = {
  light: 'light',
  dark: 'dark',
  system: 'system',
};

export function getSystemTheme() {
  if (typeof window === 'undefined') {
    return THEME_VALUES.light;
  }

  return window.matchMedia('(prefers-color-scheme: dark)').matches
    ? THEME_VALUES.dark
    : THEME_VALUES.light;
}

export function resolveTheme(theme) {
  if (theme === THEME_VALUES.system) {
    return getSystemTheme();
  }

  return theme === THEME_VALUES.dark ? THEME_VALUES.dark : THEME_VALUES.light;
}

export function applyThemeToDocument(theme) {
  const resolved = resolveTheme(theme);
  document.documentElement.setAttribute('data-theme', resolved);
  return resolved;
}
