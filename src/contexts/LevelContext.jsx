import { createContext } from 'react';

export const LevelContext = createContext({
  level: {
    current: 1,
    currentXp: 0,
    xpRequiredForNext: 100,
    progressPercentage: 0,
    daily: { expensesCount: 0, remaining: 3 },
    lastXpDate: null,
  },
  loading: false,
  error: null,
  refetch: () => {},
});
