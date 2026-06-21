'use client';

import { useCallback, useEffect, useState } from 'react';
import Header from '../components/layout/Header.jsx';
import BudgetForm from '../components/transaction/BudgetForm.jsx';
import BudgetList from '../components/transaction/BudgetList.jsx';
import { budgetApi } from '../api/budgets.js';
import { expenseApi } from '../api/expenses.js';
import FAB from '../components/layout/FAB.jsx';
import { formatCurrency, getExpenseMonth } from '../utils/format.js';

export default function BudgetPage() {
  const [budgets, setBudgets] = useState([]);
  const [expenses, setExpenses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const loadData = useCallback(async (isInitial = false) => {
    if (!isInitial) {
      setLoading(true);
      setError(null);
    }

    try {
      const [budgetData, expenseData] = await Promise.all([
        budgetApi.getBudgets(),
        expenseApi.getExpenses(),
      ]);
      setBudgets(budgetData);
      setExpenses(expenseData);
    } catch {
      setError('Gagal memuat data. Silakan coba lagi.');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    const initFetch = async () => {
      await loadData(true);
    };
    initFetch();
  }, [loadData]);

  const handleAddBudget = async (payload) => {
    try {
      await budgetApi.createBudget(payload);
      await loadData();
      return { success: true };
    } catch (err) {
      const message =
        err.response?.data?.message || 'Gagal menambahkan budget.';
      return { success: false, error: message };
    }
  };

  const handleUpdateBudget = async (id, payload) => {
    try {
      await budgetApi.updateBudget(id, payload);
      await loadData();
      return { success: true };
    } catch (err) {
      const message =
        err.response?.data?.message || 'Gagal memperbarui budget.';
      return { success: false, error: message };
    }
  };

  const handleDeleteBudget = async (id) => {
    try {
      await budgetApi.deleteBudget(id);
      await loadData();
      return { success: true };
    } catch (err) {
      const message = err.response?.data?.message || 'Gagal menghapus budget.';
      return { success: false, error: message };
    }
  };

  const handleDeleteCategory = async (category) => {
    try {
      await budgetApi.deleteCategory(category);
      await loadData();
      return { success: true };
    } catch (err) {
      const message =
        err.response?.data?.message || 'Gagal menghapus kategori.';
      return { success: false, error: message };
    }
  };

  const currentMonth = new Date().toISOString().slice(0, 7);
  const totalBudget = budgets.reduce(
    (sum, b) => sum + Number(b.limitAmount),
    0,
  );
  const currentMonthExpenses = expenses.filter(
    (e) => getExpenseMonth(e) === currentMonth,
  );
  const totalSpent = currentMonthExpenses.reduce(
    (sum, e) => sum + Number(e.amount),
    0,
  );
  const sisaKuota = totalBudget - totalSpent;

  return (
    <>
      <Header />
      <main className="main-content">
        <div className="container">
          <h1>Budget Management</h1>

          <div className="budget-summary-grid">
            {/* Total Budget Card */}
            <div className="card summary-card summary-card--budget">
              <div className="summary-card-header">
                <div className="summary-card-icon">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"/>
                  </svg>
                </div>
                <span className="summary-card-label">Total Budget</span>
              </div>
              <p className="summary-amount">{formatCurrency(totalBudget)}</p>
              <p className="summary-card-sub">{budgets.length} kategori aktif</p>
            </div>

            {/* Sisa Kuota Card */}
            <div className={`card summary-card summary-card--sisa ${sisaKuota < 0 ? 'is-over' : sisaKuota < totalBudget * 0.2 ? 'is-warning' : ''}`}>
              <div className="summary-card-header">
                <div className="summary-card-icon">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M12 22c5.523 0 10-4.477 10-10S17.523 2 12 2 2 6.477 2 12s4.477 10 10 10z"/>
                    <path d="M12 6v6l4 2"/>
                  </svg>
                </div>
                <span className="summary-card-label">Sisa Kuota</span>
              </div>
              <p className="summary-amount">{formatCurrency(sisaKuota)}</p>
              {totalBudget > 0 && (
                <div className="summary-mini-bar">
                  <div
                    className="summary-mini-bar-fill"
                    style={{ width: `${Math.max(0, Math.min(100, (sisaKuota / totalBudget) * 100))}%` }}
                  />
                </div>
              )}
            </div>
          </div>

          <div className="grid-2-cols">
            <div>
              <BudgetForm
                onSubmit={handleAddBudget}
                onDeleteCategory={handleDeleteCategory}
                budgets={budgets}
              />
            </div>
            <div>
              <BudgetList
                budgets={budgets}
                expenses={expenses}
                loading={loading}
                error={error}
                onUpdate={handleUpdateBudget}
                onDelete={handleDeleteBudget}
              />
            </div>
          </div>
        </div>
        <FAB to="/expense" />
      </main>
    </>
  );
}
