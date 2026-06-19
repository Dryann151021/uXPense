'use client';

import { useCallback, useEffect, useState } from 'react';
import Header from '../components/layout/Header.jsx';
import BudgetForm from '../components/transaction/BudgetForm.jsx';
import BudgetList from '../components/transaction/BudgetList.jsx';
import { budgetApi } from '../api/budgets.js';
import { expenseApi } from '../api/expenses.js';
import FAB from '../components/layout/FAB.jsx';
import { formatCurrency } from '../utils/format.js';

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
    } catch (err) {
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

  const currentMonth = new Date().toISOString().slice(0, 7);
  const totalBudget = budgets.reduce((sum, b) => sum + Number(b.limitAmount), 0);
  const currentMonthExpenses = expenses.filter(e => e.date && e.date.startsWith(currentMonth));
  const totalSpent = currentMonthExpenses.reduce((sum, e) => sum + Number(e.amount), 0);
  const sisaKuota = totalBudget - totalSpent;

  return (
    <>
      <Header />
      <main className="main-content">
        <div className="container">
          <h1>Budget Management</h1>
          
          <div className="budget-summary-grid">
            <div className="card summary-card">
              <h3>Total Budget</h3>
              <p className="summary-amount">{formatCurrency(totalBudget)}</p>
            </div>
            <div className="card summary-card">
              <h3>Sisa Kuota</h3>
              <p className="summary-amount">{formatCurrency(sisaKuota)}</p>
            </div>
          </div>

          <div className="grid-2-cols">
            <div>
              <BudgetForm onSubmit={handleAddBudget} />
            </div>
            <div>
              <BudgetList budgets={budgets} expenses={expenses} loading={loading} error={error} />
            </div>
          </div>
        </div>
        <FAB to="/expense" />
      </main>
    </>
  );
}
