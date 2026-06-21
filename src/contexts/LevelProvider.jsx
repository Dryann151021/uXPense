'use client';

import { useState, useCallback, useEffect } from 'react';
import { LevelContext } from './LevelContext.jsx';
import { usersApi } from '../api/users.js';

export function LevelProvider({ children, userId }) {
  const [level, setLevel] = useState({
    current: 1,
    currentXp: 0,
    xpRequiredForNext: 100,
    progressPercentage: 0,
    daily: { expensesCount: 0, remaining: 3 },
    lastXpDate: null,
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const refetch = useCallback(async () => {
    if (!userId) return;

    setLoading(true);
    setError(null);
    try {
      const responseData = await usersApi.getLevel(userId);
      const levelData = responseData.level;
      setLevel({
        current: levelData.current,
        currentXp: levelData.currentXp,
        xpRequiredForNext: levelData.xpRequiredForNext,
        progressPercentage: levelData.progressPercentage,
        daily: levelData.daily,
        lastXpDate: levelData.lastXpDate,
      });
    } catch (err) {
      setError(err.message);
      console.error('Failed to fetch level:', err);
    } finally {
      setLoading(false);
    }
  }, [userId]);

  // Instantly update level state from createExpense response
  const updateFromResponse = useCallback((xpData) => {
    if (!xpData) return;
    setLevel((prev) => ({
      ...prev,
      currentXp: xpData.current ?? prev.currentXp,
      current: xpData.level ?? prev.current,
      daily: {
        expensesCount: xpData.daily?.count ?? prev.daily?.expensesCount ?? 0,
        remaining: xpData.daily?.remaining ?? prev.daily?.remaining ?? 3,
      },
    }));
  }, []);

  // Initial fetch on mount and when userId changes
  useEffect(() => {
    if (!userId) return;
    const init = async () => {
      await refetch();
    };
    init();
  }, [userId, refetch]);

  const value = {
    level,
    loading,
    error,
    refetch,
    updateFromResponse,
  };

  return (
    <LevelContext.Provider value={value}>{children}</LevelContext.Provider>
  );
}
