'use client';

import { useCallback, useEffect, useState } from 'react';
import Header from '../components/layout/Header.jsx';
import ExpenseForm from '../components/transaction/ExpenseForm.jsx';
import TransactionList from '../components/transaction/TransactionList.jsx';
import StreakModal from '../components/dashboard/StreakModal.jsx';
import { expenseApi } from '../api/expenses.js';
import { budgetApi } from '../api/budgets.js';
import { useStreakContext } from '../hooks/useStreakContext.jsx';
import { useLevelContext } from '../hooks/useLevelContext.jsx';
import FAB from '../components/layout/FAB.jsx';

export default function ExpensePage() {
  const [expenses, setExpenses] = useState([]);
  const [budgets, setBudgets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showStreakModal, setShowStreakModal] = useState(false);
  const [activatedStreakCount, setActivatedStreakCount] = useState(0);
  const { refetch: refetchStreak } = useStreakContext();
  const { refetch: refetchLevel, updateFromResponse } = useLevelContext();

  const loadExpenses = useCallback(async (isInitial = false) => {
    if (!isInitial) {
      setLoading(true);
      setError(null);
    }

    try {
      const [expenseData, budgetData] = await Promise.all([
        expenseApi.getExpenses(),
        budgetApi.getBudgets(),
      ]);
      setExpenses(expenseData);
      setBudgets(budgetData);
    } catch {
      setError('Gagal memuat pengeluaran. Silakan coba lagi.');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    const initFetch = async () => {
      await loadExpenses(true);
    };
    initFetch();
  }, [loadExpenses]);

  const handleAddExpense = async (payload) => {
    try {
      const result = await expenseApi.createExpense(payload);
      // Instantly update quest bar from response without waiting for full refetch
      if (result?.xp) {
        updateFromResponse(result.xp);
      }
      await loadExpenses();
      // Refetch streak and level for full sync
      await Promise.all([refetchStreak(), refetchLevel()]);

      // Jika ini adalah transaksi pertama hari ini, tampilkan modal streak
      if (result?.xp?.daily?.count === 1) {
        setActivatedStreakCount(result.streak.current);
        setShowStreakModal(true);
      }

      return { success: true };
    } catch (err) {
      const message =
        err.response?.data?.message || 'Gagal menambahkan pengeluaran.';
      return { success: false, error: message };
    }
  };

  return (
    <>
      <Header />
      <main className="main-content">
        <div className="container">
          <h1>Expense Tracking</h1>
          <div className="grid-2-cols">
            <div>
              <ExpenseForm onSubmit={handleAddExpense} budgets={budgets} />
            </div>
            <div>
              <TransactionList
                type="expense"
                transactions={expenses}
                loading={loading}
                error={error}
              />
            </div>
          </div>
        </div>
        <FAB to="/expense" />

        <StreakModal
          isOpen={showStreakModal}
          onClose={() => setShowStreakModal(false)}
          streakCount={activatedStreakCount}
        />
      </main>
    </>
  );
}
