'use client';

import { useState } from 'react';
import { formatCurrency, formatDate } from '../../utils/format.js';

export default function TransactionList({ transactions = [], loading, error }) {
  const [selectedCategory, setSelectedCategory] = useState('');

  const filtered = selectedCategory
    ? transactions.filter((t) => t.category === selectedCategory)
    : transactions;

  const categories = [
    ...new Set(transactions.map((t) => t.category).filter(Boolean)),
  ];

  const totalAmount = filtered.reduce(
    (sum, t) => sum + Number(t.amount || 0),
    0,
  );

  if (loading) {
    return (
      <div className="card">
        <h3>Daftar Pengeluaran</h3>
        <div className="transaction-empty">Memuat pengeluaran...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="card">
        <h3>Daftar Pengeluaran</h3>
        <div className="transaction-empty">{error}</div>
      </div>
    );
  }

  return (
    <div className="card">
      <h3>Daftar Pengeluaran</h3>

      <div className="form-group">
        <label htmlFor="category-filter" className="form-label">
          Filter Kategori
        </label>
        <select
          id="category-filter"
          className="form-select"
          value={selectedCategory}
          onChange={(e) => setSelectedCategory(e.target.value)}
        >
          <option value="">Semua Kategori</option>
          {categories.map((cat) => (
            <option key={cat} value={cat}>
              {cat}
            </option>
          ))}
        </select>
      </div>

      <div className="transaction-summary">
        <div className="transaction-summary-label">Total Pengeluaran</div>
        <div className="transaction-summary-value">
          {formatCurrency(totalAmount)}
        </div>
      </div>

      {filtered.length > 0 ? (
        <div className="transaction-items">
          {filtered.map((transaction) => (
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
                {formatDate(transaction.created_at)}
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="transaction-empty">Tidak ada data pengeluaran</div>
      )}
    </div>
  );
}
