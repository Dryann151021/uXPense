export function formatCurrency(value, locale = 'id-ID', currency = 'IDR') {
  return new Intl.NumberFormat(locale, {
    style: 'currency',
    currency,
    minimumFractionDigits: 0,
  }).format(value);
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
