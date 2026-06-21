'use client';

import { useState } from 'react';
import AppModal from '../ui/AppModal.jsx';
import {
  formatCurrency,
  formatDate,
  getExpenseDate,
  getExpenseDateInputValue,
} from '../../utils/format.js';

export default function TransactionList({
  transactions = [],
  budgets = [],
  loading,
  error,
  onUpdate,
  onDelete,
}) {
  const [selectedCategory, setSelectedCategory] = useState('');
  const [editingId, setEditingId] = useState(null);
  const [draft, setDraft] = useState({
    category: '',
    amount: '',
    description: '',
    date: '',
  });
  const [actionError, setActionError] = useState('');
  const [busyId, setBusyId] = useState(null);
  const [confirmAction, setConfirmAction] = useState(null);

  const filtered = selectedCategory
    ? transactions.filter((t) => t.category === selectedCategory)
    : transactions;

  const categories = [
    ...new Set([
      ...budgets.map((b) => b.category),
      ...transactions.map((t) => t.category),
    ].filter(Boolean)),
  ];

  const totalAmount = filtered.reduce(
    (sum, t) => sum + Number(t.amount || 0),
    0,
  );

  const startEdit = (transaction) => {
    setEditingId(transaction.id);
    setActionError('');
    setDraft({
      category: transaction.category || '',
      amount: String(transaction.amount || ''),
      description: transaction.description || '',
      date: getExpenseDateInputValue(transaction),
    });
  };

  const cancelEdit = () => {
    setEditingId(null);
    setActionError('');
  };

  const handleDraftChange = (e) => {
    const { name, value } = e.target;
    setDraft((current) => ({ ...current, [name]: value }));
  };

  const saveUpdate = async (id) => {
    if (!onUpdate) return;

    setBusyId(id);
    setActionError('');
    const result = await onUpdate(id, {
      category: draft.category,
      amount: Number(draft.amount),
      description: draft.description,
      date: draft.date,
    });
    setBusyId(null);

    if (!result.success) {
      setActionError(result.error);
      return;
    }

    setEditingId(null);
    setConfirmAction(null);
  };

  const handleUpdate = (e, id) => {
    e.preventDefault();
    setConfirmAction({
      type: 'edit',
      id,
      title: 'Simpan perubahan pengeluaran?',
      description: 'Nominal, kategori, tanggal, dan deskripsi transaksi akan diperbarui.',
      confirmLabel: 'Simpan',
      onConfirm: () => saveUpdate(id),
    });
  };

  const deleteTransaction = async (transaction) => {
    if (!onDelete) return;

    setBusyId(transaction.id);
    setActionError('');
    const result = await onDelete(transaction.id);
    setBusyId(null);

    if (!result.success) {
      setActionError(result.error);
    }
    setConfirmAction(null);
  };

  const handleDelete = (transaction) => {
    setConfirmAction({
      type: 'delete',
      id: transaction.id,
      title: 'Hapus pengeluaran ini?',
      description: `"${transaction.description}" sebesar ${formatCurrency(transaction.amount)} akan dihapus dari catatan.`,
      confirmLabel: 'Hapus',
      onConfirm: () => deleteTransaction(transaction),
    });
  };

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
    <>
      <div className="card expense-list-card">
        <h3>Daftar Pengeluaran</h3>
        {actionError && <div className="form-error">{actionError}</div>}

        <div className="expense-list-toolbar">
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
                {editingId === transaction.id ? (
                  <form
                    className="inline-edit-form"
                    onSubmit={(e) => handleUpdate(e, transaction.id)}
                  >
                    <div className="inline-edit-grid">
                      <label className="form-label">
                      Kategori
                        <select
                          name="category"
                          className="form-select"
                          value={draft.category}
                          onChange={handleDraftChange}
                          required
                        >
                          <option value="" disabled>
                          Pilih Kategori
                          </option>
                          {categories.map((cat) => (
                            <option key={cat} value={cat}>
                              {cat}
                            </option>
                          ))}
                        </select>
                      </label>
                      <label className="form-label">
                      Jumlah
                        <input
                          type="number"
                          name="amount"
                          className="form-input"
                          value={draft.amount}
                          onChange={handleDraftChange}
                          required
                        />
                      </label>
                      <label className="form-label">
                      Tanggal
                        <input
                          type="date"
                          name="date"
                          className="form-input"
                          value={draft.date}
                          onChange={handleDraftChange}
                          required
                        />
                      </label>
                    </div>
                    <label className="form-label">
                    Deskripsi
                      <input
                        type="text"
                        name="description"
                        className="form-input"
                        value={draft.description}
                        onChange={handleDraftChange}
                        required
                      />
                    </label>
                    <div className="item-actions">
                      <button
                        type="submit"
                        className="btn btn-primary btn-compact"
                        disabled={busyId === transaction.id}
                      >
                        {busyId === transaction.id ? 'Menyimpan...' : 'Simpan'}
                      </button>
                      <button
                        type="button"
                        className="btn btn-secondary btn-compact"
                        onClick={cancelEdit}
                        disabled={busyId === transaction.id}
                      >
                      Batal
                      </button>
                    </div>
                  </form>
                ) : (
                  <>
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
                    <div className="item-actions">
                      <button
                        type="button"
                        className="btn btn-secondary btn-compact"
                        onClick={() => startEdit(transaction)}
                      >
                      Edit
                      </button>
                      <button
                        type="button"
                        className="btn btn-danger btn-compact"
                        onClick={() => handleDelete(transaction)}
                        disabled={busyId === transaction.id}
                      >
                        {busyId === transaction.id ? 'Menghapus...' : 'Hapus'}
                      </button>
                    </div>
                  </>
                )}
              </div>
            ))}
          </div>
        ) : (
          <div className="transaction-empty">Tidak ada data pengeluaran</div>
        )}
      </div>

      <AppModal
        isOpen={!!confirmAction}
        variant={confirmAction?.type === 'delete' ? 'danger' : 'default'}
        title={confirmAction?.title}
        description={confirmAction?.description}
        confirmLabel={confirmAction?.confirmLabel}
        confirmDisabled={!!busyId}
        onClose={() => setConfirmAction(null)}
        onConfirm={confirmAction?.onConfirm}
      />
    </>
  );
}
