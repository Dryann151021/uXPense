import { useContext } from 'react';
import { LevelContext } from '../contexts/LevelContext.jsx';

export function useLevelContext() {
  const context = useContext(LevelContext);
  if (!context) {
    throw new Error('useLevelContext must be used within LevelProvider');
  }
  return context;
}
