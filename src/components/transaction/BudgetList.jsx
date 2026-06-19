'use client';

import { formatCurrency } from '../../utils/format.js';

export default function BudgetList({
  budgets = [],
  expenses = [],
  loading,
  error,
}) {
  if (loading) {
    return (
      <div className="card">
        <h3>Budget Bulan Ini</h3>
        <div className="budget-empty">Memuat budget...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="card">
        <h3>Budget Bulan Ini</h3>
        <div className="budget-empty">{error}</div>
      </div>
    );
  }

  const currentMonth = new Date().toISOString().slice(0, 7);
  const currentMonthExpenses = expenses.filter(
    (e) => e.date && e.date.startsWith(currentMonth),
  );

  return (
    <div className="card">
      <h3>Budget Bulan Ini</h3>
      {budgets.length > 0 ? (
        <div className="budget-list">
          {budgets.map((budget) => {
            const spent = currentMonthExpenses
              .filter((e) => e.category === budget.category)
              .reduce((sum, e) => sum + Number(e.amount), 0);
            const limit = Number(budget.limitAmount);

            const remaining = limit - spent;
            const remainingPercentage =
              limit > 0 ? Math.max((remaining / limit) * 100, 0) : 0;

            return (
              <div key={budget.id} className="budget-item">
                <div className="budget-item-head">
                  <span className="budget-item-category">
                    {budget.category}
                  </span>
                  <span className="budget-item-amount">
                    {formatCurrency(spent)} / {formatCurrency(limit)}
                  </span>
                </div>
                <div className="budget-progress">
                  <div
                    className="budget-progress-fill is-hp-bar"
                    style={{ width: `${remainingPercentage}%` }}
                  ></div>
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        <div className="budget-empty">
          Belum ada budget. Tambahkan budget baru.
        </div>
      )}
    </div>
  );
}
