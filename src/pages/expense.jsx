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
import { formatCurrency, getExpenseMonth } from '../utils/format.js';

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

  const handleUpdateExpense = async (id, payload) => {
    try {
      await expenseApi.editExpense(id, payload);
      await loadExpenses();
      return { success: true };
    } catch (err) {
      const message =
        err.response?.data?.message || 'Gagal memperbarui pengeluaran.';
      return { success: false, error: message };
    }
  };

  const handleDeleteExpense = async (id) => {
    try {
      await expenseApi.deleteExpense(id);
      await loadExpenses();
      await Promise.all([refetchStreak(), refetchLevel()]);
      return { success: true };
    } catch (err) {
      const message =
        err.response?.data?.message || 'Gagal menghapus pengeluaran.';
      return { success: false, error: message };
    }
  };

  const currentMonth = new Date().toISOString().slice(0, 7);
  const currentMonthExpenses = expenses.filter(
    (expense) => getExpenseMonth(expense) === currentMonth,
  );
  const monthlyTotal = currentMonthExpenses.reduce(
    (sum, expense) => sum + Number(expense.amount || 0),
    0,
  );
  const activeCategories = new Set(expenses.map((expense) => expense.category));

  return (
    <>
      <Header />
      <main className="main-content">
        <div className="container expense-page">
          <div className="expense-page-header">
            <div>
              <h1>Expense Tracking</h1>
              <p>Catat, koreksi, dan pantau pengeluaran harianmu.</p>
            </div>
          </div>

          <div className="expense-summary-grid">
            <div className="expense-summary-card">
              <span className="expense-summary-label">Bulan Ini</span>
              <strong>{formatCurrency(monthlyTotal)}</strong>
              <span>{currentMonthExpenses.length} transaksi</span>
            </div>
            <div className="expense-summary-card">
              <span className="expense-summary-label">Kategori Aktif</span>
              <strong>{activeCategories.size}</strong>
              <span>kategori tercatat</span>
            </div>
            <div className="expense-summary-card">
              <span className="expense-summary-label">Total Catatan</span>
              <strong>{expenses.length}</strong>
              <span>pengeluaran tersimpan</span>
            </div>
          </div>

          <div className="grid-2-cols expense-layout">
            <div>
              <ExpenseForm onSubmit={handleAddExpense} budgets={budgets} />
            </div>
            <div>
              <TransactionList
                type="expense"
                transactions={expenses}
                budgets={budgets}
                loading={loading}
                error={error}
                onUpdate={handleUpdateExpense}
                onDelete={handleDeleteExpense}
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
