'use client';

import { useState } from 'react';
import AppModal from '../ui/AppModal.jsx';
import { formatCurrency, getExpenseMonth } from '../../utils/format.js';

export default function BudgetList({
  budgets = [],
  expenses = [],
  loading,
  error,
  onUpdate,
  onDelete,
}) {
  const [editingId, setEditingId] = useState(null);
  const [draft, setDraft] = useState({
    category: '',
    limitAmount: '',
    month: '',
  });
  const [actionError, setActionError] = useState('');
  const [busyId, setBusyId] = useState(null);
  const [confirmAction, setConfirmAction] = useState(null);

  const startEdit = (budget) => {
    setEditingId(budget.id);
    setActionError('');
    setDraft({
      category: budget.category || '',
      limitAmount: String(budget.limitAmount || ''),
      month: budget.month || new Date().toISOString().slice(0, 7),
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
      limitAmount: Number(draft.limitAmount),
      month: draft.month,
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
      title: 'Simpan perubahan budget?',
      description: 'Perubahan kategori, limit, dan bulan akan langsung memengaruhi perhitungan budget.',
      confirmLabel: 'Simpan',
      onConfirm: () => saveUpdate(id),
    });
  };

  const deleteBudget = async (budget) => {
    if (!onDelete) return;

    setBusyId(budget.id);
    setActionError('');
    const result = await onDelete(budget.id);
    setBusyId(null);

    if (!result.success) {
      setActionError(result.error);
    }
    setConfirmAction(null);
  };

  const handleDelete = (budget) => {
    setConfirmAction({
      type: 'delete',
      id: budget.id,
      title: `Hapus budget "${budget.category}"?`,
      description: 'Data pengeluaran tidak ikut terhapus, tapi kategori budget ini akan hilang dari daftar.',
      confirmLabel: 'Hapus',
      onConfirm: () => deleteBudget(budget),
    });
  };

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
    (e) => getExpenseMonth(e) === currentMonth,
  );

  return (
    <>
      <div className="card">
        <h3>Budget Bulan Ini</h3>
        {actionError && <div className="form-error">{actionError}</div>}
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
                  {editingId === budget.id ? (
                    <form
                      className="inline-edit-form"
                      onSubmit={(e) => handleUpdate(e, budget.id)}
                    >
                      <div className="inline-edit-grid">
                        <label className="form-label">
                        Kategori
                          <input
                            type="text"
                            name="category"
                            className="form-input"
                            value={draft.category}
                            onChange={handleDraftChange}
                            required
                          />
                        </label>
                        <label className="form-label">
                        Limit
                          <input
                            type="number"
                            name="limitAmount"
                            className="form-input"
                            value={draft.limitAmount}
                            onChange={handleDraftChange}
                            required
                          />
                        </label>
                        <label className="form-label">
                        Bulan
                          <input
                            type="month"
                            name="month"
                            className="form-input"
                            value={draft.month}
                            onChange={handleDraftChange}
                          />
                        </label>
                      </div>
                      <div className="item-actions">
                        <button
                          type="submit"
                          className="btn btn-primary btn-compact"
                          disabled={busyId === budget.id}
                        >
                          {busyId === budget.id ? 'Menyimpan...' : 'Simpan'}
                        </button>
                        <button
                          type="button"
                          className="btn btn-secondary btn-compact"
                          onClick={cancelEdit}
                          disabled={busyId === budget.id}
                        >
                        Batal
                        </button>
                      </div>
                    </form>
                  ) : (
                    <>
                      <div className="budget-item-head">
                        <span className="budget-item-category">
                          {budget.category}
                        </span>
                        <span className="budget-item-amount">
                          {formatCurrency(spent)} / {formatCurrency(limit)}
                        </span>
                      </div>
                      <div className="budget-progress">
                        {/* HP-bar: red background, green "remaining" overlay shrinks from right */}
                        <div
                          className={`budget-hp-remaining ${isDanger ? 'is-danger' : ''}`}
                          style={{ width: `${100 - spentPercentage}%` }}
                        />
                      </div>
                      <div className="item-actions">
                        <button
                          type="button"
                          className="btn btn-secondary btn-compact"
                          onClick={() => startEdit(budget)}
                        >
                        Edit
                        </button>
                        <button
                          type="button"
                          className="btn btn-danger btn-compact"
                          onClick={() => handleDelete(budget)}
                          disabled={busyId === budget.id}
                        >
                          {busyId === budget.id ? 'Menghapus...' : 'Hapus'}
                        </button>
                      </div>
                    </>
                  )}
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
