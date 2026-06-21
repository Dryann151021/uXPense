'use client';

import { useTheme } from '../../hooks/useTheme.jsx';

// Recharts needs concrete color strings (it can't read CSS variables),
// so we map the active theme to a palette used across all charts.
const PALETTES = {
  light: {
    grid: '#eceef6',
    axis: '#6b7194',
    axisLine: '#e7e9f2',
    cursor: '#c7cbe0',
    tooltipBg: '#ffffff',
    tooltipBorder: '#e7e9f2',
    tooltipText: '#1e2235',
  },
  dark: {
    grid: '#262a45',
    axis: '#9499b5',
    axisLine: '#2c3150',
    cursor: '#3a4066',
    tooltipBg: '#1f2338',
    tooltipBorder: '#2c3150',
    tooltipText: '#e8eaf6',
  },
};

// Brand colors stay constant across themes.
export const CHART_BRAND = {
  spend: '#f43f5e',
  spendLight: '#fb7185',
  budget: '#6366f1',
  budgetLight: '#818cf8',
  dot: '#22d3ee',
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
