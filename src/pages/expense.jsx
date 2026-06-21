'use client';

import { useCallback, useEffect, useState } from 'react';
import Header from '../components/layout/Header.jsx';
import ExpenseForm from '../components/transaction/ExpenseForm.jsx';
import TransactionList from '../components/transaction/TransactionList.jsx';
import { expenseApi } from '../api/expenses.js';
import { useStreakContext } from '../hooks/useStreakContext.jsx';
import { useLevelContext } from '../hooks/useLevelContext.jsx';
import FAB from '../components/layout/FAB.jsx';

export default function ExpensePage() {
  const [expenses, setExpenses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { refetch: refetchStreak } = useStreakContext();
  const { refetch: refetchLevel } = useLevelContext();

  const loadExpenses = useCallback(async (isInitial = false) => {
    if (!isInitial) {
      setLoading(true);
      setError(null);
    }

    try {
      const data = await expenseApi.getExpenses();
      setExpenses(data);
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
      await expenseApi.createExpense(payload);
      await loadExpenses();
      // Refetch streak and level after successful expense creation
      await Promise.all([refetchStreak(), refetchLevel()]);
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
              <ExpenseForm onSubmit={handleAddExpense} />
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
      </main>
    </>
  );
}
