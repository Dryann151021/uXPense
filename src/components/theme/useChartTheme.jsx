'use client';

import { useTheme } from '../../hooks/useTheme.jsx';

// Recharts needs concrete color strings (it can't read CSS variables),
// so we map the active theme to a palette used across all charts.
const PALETTES = {
  light: {
    grid: '#d8ebe0',
    axis: '#4d7060',
    axisLine: '#ccddd2',
    cursor: '#b4ccbc',
    tooltipBg: '#f6faf7',
    tooltipBorder: '#ccddd2',
    tooltipText: '#0e1f13',
  },
  dark: {
    grid: '#2e2e33',
    axis: '#a1a1aa',
    axisLine: '#2e2e33',
    cursor: '#44444c',
    tooltipBg: '#18181b',
    tooltipBorder: '#2e2e33',
    tooltipText: '#fafafa',
  },
};

// Brand colors stay constant across themes.
export const CHART_BRAND = {
  spend: '#f43f5e',
  spendLight: '#fb7185',
  budget: '#0a2512', // Dark green for light mode
  budgetLight: '#d4ff00', // Neon lime for dark mode
  dot: '#d4ff00',
};

export function useChartTheme() {
  const { resolvedTheme } = useTheme();
  const palette = PALETTES[resolvedTheme === 'dark' ? 'dark' : 'light'];

  return {
    ...palette,
    tooltipContentStyle: {
      backgroundColor: palette.tooltipBg,
      border: `1px solid ${palette.tooltipBorder}`,
      borderRadius: '12px',
      boxShadow: '0 8px 24px -10px rgba(0,0,0,0.35)',
      fontSize: '12px',
      color: palette.tooltipText,
    },
  };
}
