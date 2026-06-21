import { createContext } from 'react';

export const StreakContext = createContext({
  streak: { current: 0, longest: 0, lastExpenseDate: null },
  loading: false,
  error: null,
  refetch: () => {},
});
