'use client';

export default function AppModal({
  isOpen,
  variant = 'default',
  title,
  description,
  confirmLabel = 'Lanjutkan',
  cancelLabel = 'Batal',
  onConfirm,
  onClose,
  confirmDisabled = false,
  showCancel = true,
}) {
  if (!isOpen) {
    return null;
  }

  const infoClass = !showCancel ? 'app-modal--info' : '';

  const iconPath =
    variant === 'danger'
      ? 'M12 9v4m0 4h.01M10.29 3.86 1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0Z'
      : 'M9 12l2 2 4-4m6 2a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z';

  return (
    <div className="app-modal-overlay" role="presentation" onMouseDown={onClose}>
      <div
        className={`app-modal app-modal--${variant} ${infoClass}`}
        role="dialog"
        aria-modal="true"
        aria-labelledby="app-modal-title"
        onMouseDown={(e) => e.stopPropagation()}
      >
        <div className="app-modal-icon" aria-hidden="true">
          <svg
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d={iconPath} />
          </svg>
        </div>

        <div className="app-modal-body">
          <h2 id="app-modal-title">{title}</h2>
          {description && <p>{description}</p>}
        </div>

        <div className="app-modal-actions">
          {showCancel && (
            <button
              type="button"
              className="btn btn-secondary"
              onClick={onClose}
              disabled={confirmDisabled}
            >
              {cancelLabel}
            </button>
          )}
          <button
            type="button"
            className={`btn ${variant === 'danger' ? 'btn-danger-solid' : 'btn-primary'}`}
            onClick={onConfirm || onClose}
            disabled={confirmDisabled}
          >
            {confirmLabel}
          </button>
        </div>
      </div>
    </div>
  );
}
