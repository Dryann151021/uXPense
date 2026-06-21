'use client';

import { useEffect, useRef, useState } from 'react';
import { useForm } from '../../hooks/useForm.jsx';
import { formatRupiahInput, parseRupiahInput } from '../../utils/format.js';
import AppModal from '../ui/AppModal.jsx';

export default function BudgetForm({
  onSubmit,
  onDeleteCategory,
  budgets = [],
}) {
  const existingCategories = [...new Set(budgets.map((b) => b.category))].sort();
  const [isAddingNew, setIsAddingNew] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isDeletingCategory, setIsDeletingCategory] = useState(false);
  const [categoryToDelete, setCategoryToDelete] = useState('');
  const [isConfirmDeleteOpen, setIsConfirmDeleteOpen] = useState(false);
  const [isCategoryMenuOpen, setIsCategoryMenuOpen] = useState(false);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const categoryMenuRef = useRef(null);

  const {
    form: formData,
    handleChange,
    resetForm,
  } = useForm({
    category: '',
    limitAmount: '',
    month: new Date().toISOString().slice(0, 7),
  });

  useEffect(() => {
    if (!isCategoryMenuOpen) return undefined;

    const handleDocumentClick = (event) => {
      if (!categoryMenuRef.current?.contains(event.target)) {
        setIsCategoryMenuOpen(false);
      }
    };

    document.addEventListener('mousedown', handleDocumentClick);
    return () => document.removeEventListener('mousedown', handleDocumentClick);
  }, [isCategoryMenuOpen]);

  const selectCategory = (category) => {
    setIsAddingNew(false);
    setIsCategoryMenuOpen(false);
    handleChange({ target: { name: 'category', value: category } });
  };

  const startAddCategory = () => {
    setIsAddingNew(true);
    setIsCategoryMenuOpen(false);
    handleChange({ target: { name: 'category', value: '' } });
  };

  const handleCategoryKeyDown = (event) => {
    if (event.key === 'Escape') {
      setIsCategoryMenuOpen(false);
    }

    if (event.key === 'ArrowDown' || event.key === 'Enter' || event.key === ' ') {
      event.preventDefault();
      setIsCategoryMenuOpen(true);
    }
  };

  const openDeleteCategoryConfirm = (category) => {
    if (!category || !existingCategories.includes(category)) {
      return;
    }

    setCategoryToDelete(category);
    setIsCategoryMenuOpen(false);
    setIsConfirmDeleteOpen(true);
  };

  const handleDeleteCategory = async () => {
    if (!onDeleteCategory || !categoryToDelete) return;

    setIsDeletingCategory(true);
    setError('');
    setMessage('');

    const result = await onDeleteCategory(categoryToDelete);
    setIsDeletingCategory(false);

    if (!result.success) {
      setError(result.error);
      setIsConfirmDeleteOpen(false);
      return;
    }

    setMessage(`Kategori "${categoryToDelete}" berhasil dihapus.`);
    if (formData.category === categoryToDelete) {
      handleChange({ target: { name: 'category', value: '' } });
    }
    setCategoryToDelete('');
    setIsConfirmDeleteOpen(false);
  };

  const handleLimitAmountChange = (event) => {
    handleChange({
      target: {
        name: 'limitAmount',
        value: formatRupiahInput(event.target.value),
      },
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setMessage('');

    const payload = {
      category: formData.category,
      limitAmount: parseRupiahInput(formData.limitAmount),
      month: formData.month,
    };

    if (!payload.category) {
      setError('Kategori harus dipilih atau ditambahkan.');
      return;
    }

    if (!onSubmit) {
      console.log('Budget submitted:', payload);
      setIsAddingNew(false);
      resetForm({
        category: '',
        limitAmount: '',
        month: new Date().toISOString().slice(0, 7),
      });
      return;
    }

    setIsSubmitting(true);
    const result = await onSubmit(payload);
    setIsSubmitting(false);

    if (!result.success) {
      setError(result.error);
      return;
    }

    setMessage('Budget berhasil ditambahkan.');
    setIsAddingNew(false);
    resetForm({
      category: '',
      limitAmount: '',
      month: new Date().toISOString().slice(0, 7),
    });
  };

  return (
    <>
      <div className="card">
        <h3>Tambah Budget Kategori</h3>
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="category" className="form-label">
              Kategori
            </label>
            {isAddingNew ? (
              <div className="category-input-row">
                <input
                  type="text"
                  id="category"
                  name="category"
                  className="form-input"
                  placeholder="e.g., Kebutuhan Rumah"
                  value={formData.category}
                  onChange={handleChange}
                  required
                />
                <button
                  type="button"
                  className="btn btn-secondary"
                  onClick={() => {
                    setIsAddingNew(false);
                    handleChange({ target: { name: 'category', value: '' } });
                  }}
                >
                  Batal
                </button>
              </div>
            ) : (
              <div className="category-dropdown" ref={categoryMenuRef}>
                <button
                  id="category"
                  type="button"
                  className="category-dropdown-trigger"
                  aria-haspopup="listbox"
                  aria-expanded={isCategoryMenuOpen}
                  onClick={() => setIsCategoryMenuOpen((current) => !current)}
                  onKeyDown={handleCategoryKeyDown}
                >
                  <span className={formData.category ? '' : 'is-placeholder'}>
                    {formData.category || 'Pilih Kategori'}
                  </span>
                  <span className="category-dropdown-caret" aria-hidden="true">
                    ▾
                  </span>
                </button>

                {isCategoryMenuOpen && (
                  <div className="category-dropdown-menu" role="listbox">
                    {existingCategories.length > 0 ? (
                      existingCategories.map((cat) => (
                        <div
                          key={cat}
                          className={`category-dropdown-option ${formData.category === cat ? 'is-selected' : ''}`}
                          role="option"
                          aria-selected={formData.category === cat}
                        >
                          <button
                            type="button"
                            className="category-option-label"
                            onClick={() => selectCategory(cat)}
                          >
                            {cat}
                          </button>
                          {onDeleteCategory && (
                            <button
                              type="button"
                              className="category-option-delete"
                              onClick={(event) => {
                                event.stopPropagation();
                                openDeleteCategoryConfirm(cat);
                              }}
                              disabled={isDeletingCategory}
                              aria-label={`Hapus kategori ${cat}`}
                              title={`Hapus kategori ${cat}`}
                            >
                              ×
                            </button>
                          )}
                        </div>
                      ))
                    ) : (
                      <div className="category-dropdown-empty">
                        Belum ada kategori
                      </div>
                    )}

                    <button
                      type="button"
                      className="category-add-option"
                      onClick={startAddCategory}
                    >
                      + Tambah Kategori Baru
                    </button>
                  </div>
                )}
              </div>
            )}
          </div>

          <div className="form-group">
            <label htmlFor="limitAmount" className="form-label">
              Limit Jumlah
            </label>
            <input
              type="text"
              inputMode="numeric"
              id="limitAmount"
              name="limitAmount"
              className="form-input"
              placeholder="Rp.500.000"
              value={formData.limitAmount}
              onChange={handleLimitAmountChange}
              required
            />
          </div>
          {message && <div className="form-success">{message}</div>}
          {error && <div className="form-error">{error}</div>}
          <button
            type="submit"
            className="btn btn-primary"
            style={{ width: '100%' }}
            disabled={isSubmitting}
          >
            {isSubmitting ? 'Menyimpan...' : 'Tambah Budget'}
          </button>
        </form>
      </div>

      <AppModal
        isOpen={isConfirmDeleteOpen}
        variant="danger"
        title={`Hapus kategori "${categoryToDelete}"?`}
        description="Semua budget aktif dengan kategori ini akan dihapus dari daftar pilihan. Data pengeluaran lama tetap tersimpan."
        confirmLabel="Hapus"
        confirmDisabled={isDeletingCategory}
        onClose={() => setIsConfirmDeleteOpen(false)}
        onConfirm={handleDeleteCategory}
      />
    </>
  );
}
