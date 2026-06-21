export function formatCurrency(value, locale = 'id-ID', currency = 'IDR') {
  return new Intl.NumberFormat(locale, {
    style: 'currency',
    currency,
    minimumFractionDigits: 0,
  }).format(value);
}

export function parseRupiahInput(value) {
  if (value === null || value === undefined) {
    return 0;
  }

  const digits = String(value).replace(/\D/g, '');
  return digits ? Number(digits) : 0;
}

export function formatRupiahInput(value) {
  const amount = parseRupiahInput(value);

  if (!amount) {
    return '';
  }

  return `Rp.${amount.toLocaleString('id-ID')}`;
}

export function formatDate(isoDate) {
  if (!isoDate) {
    return '-';
  }
  try {
    return new Intl.DateTimeFormat('id-ID', {
      day: '2-digit',
      month: 'long',
      year: 'numeric',
    }).format(new Date(isoDate));
  } catch {
    return '-';
  }
}

export function toNumber(value) {
  if (value === null || value === undefined || value === '') {
    return 0;
  }

  if (typeof value === 'number') {
    return Number.isFinite(value) ? value : 0;
  }

  const text = String(value).trim();
  const hasComma = text.includes(',');
  const hasDot = text.includes('.');
  const normalized =
    hasComma && hasDot
      ? text.replace(/\./g, '').replace(',', '.')
      : hasComma
        ? text.replace(',', '.')
        : text;
  const parsed = Number(normalized);

  if (Number.isFinite(parsed)) {
    return parsed;
  }

  const digitsOnly = Number(text.replace(/[^\d-]/g, ''));
  return Number.isFinite(digitsOnly) ? digitsOnly : 0;
}

export function getExpenseDate(expense) {
  return expense?.date || expense?.created_at || expense?.createdAt || '';
}

export function getExpenseRecordedDate(expense) {
  return expense?.created_at || expense?.createdAt || getExpenseDate(expense);
}

export function getExpenseAmount(expense) {
  return toNumber(expense?.amount ?? expense?.totalAmount ?? expense?.total_amount);
}

export function getExpenseDateInputValue(expense) {
  const value = getExpenseDate(expense);

  if (!value) {
    return new Date().toISOString().split('T')[0];
  }

  return value.slice(0, 10);
}

export function getExpenseMonth(expense) {
  const value = getExpenseDate(expense);

  if (!value) {
    return '';
  }

  return value.slice(0, 7);
}

export function getBudgetAmount(budget) {
  return toNumber(
    budget?.limitAmount ??
      budget?.limit_amount ??
      budget?.amount ??
      budget?.budgetAmount ??
      budget?.budget_amount,
  );
}

export function getBudgetMonth(budget) {
  const value = budget?.month || budget?.budgetMonth || budget?.budget_month || '';

  if (!value) {
    return '';
  }

  return String(value).slice(0, 7);
}

export function getLocalDateKey(value = new Date()) {
  if (typeof value === 'string' && /^\d{4}-\d{2}-\d{2}$/.test(value)) {
    return value;
  }

  const date = value instanceof Date ? value : new Date(value);

  if (Number.isNaN(date.getTime())) {
    return '';
  }

  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');

  return `${year}-${month}-${day}`;
}

export function getStartOfWeek(date = new Date()) {
  const start = new Date(date);
  const day = start.getDay();
  const diffToMonday = start.getDate() - day + (day === 0 ? -6 : 1);
  start.setDate(diffToMonday);
  start.setHours(0, 0, 0, 0);

  return start;
}
