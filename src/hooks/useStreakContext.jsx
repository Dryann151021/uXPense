import { useContext } from 'react';
import { StreakContext } from '../contexts/StreakContext.jsx';

export function useStreakContext() {
  const context = useContext(StreakContext);
  if (!context) {
    throw new Error('useStreakContext must be used within StreakProvider');
  }
  return context;
}
