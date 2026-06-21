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
    (e) => e.created_at && e.created_at.startsWith(currentMonth),
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

            const spentPercentage =
              limit > 0 ? Math.min((spent / limit) * 100, 100) : 0;
            const isDanger = spentPercentage >= 80;

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
                    className={`budget-progress-fill ${isDanger ? 'is-danger' : 'is-hp-bar'}`}
                    style={{ width: `${spentPercentage}%` }}
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
