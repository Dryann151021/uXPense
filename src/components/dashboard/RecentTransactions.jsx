'use client';

import { Link } from 'react-router-dom';
import {
  formatCurrency,
  formatDate,
  getExpenseDate,
} from '../../utils/format.js';

export default function RecentTransactions({ expenses = [] }) {
  // Sort by created_at descending and get the top 5
  const recent = [...expenses]
    .sort((a, b) => new Date(b.created_at) - new Date(a.created_at))
    .slice(0, 5);

  return (
    <div className="card recent-transactions-card">
      <div
        className="recent-header"
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          marginBottom: '1rem',
        }}
      >
        <h3 style={{ margin: 0 }}>Transaksi Terakhir</h3>
        <Link
          to="/expense"
          style={{
            fontSize: '0.875rem',
            color: 'var(--color-primary)',
            textDecoration: 'none',
            fontWeight: 600,
          }}
        >
          Lihat Semua
        </Link>
      </div>

      {recent.length > 0 ? (
        <div className="transaction-items">
          {recent.map((transaction) => (
            <div key={transaction.id} className="transaction-item">
              <div className="transaction-item-head">
                <span className="transaction-item-category">
                  {transaction.category}
                </span>
                <span className="transaction-item-amount">
                  -{formatCurrency(transaction.amount)}
                </span>
              </div>
              <div className="transaction-item-desc">
                {transaction.description}
              </div>
              <div className="transaction-item-date">
                {formatDate(getExpenseDate(transaction))}
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="transaction-empty">
          Belum ada transaksi pengeluaran.
        </div>
      )}
    </div>
  );
}
