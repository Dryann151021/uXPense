import { Link } from 'react-router-dom';

export default function AuthBrand() {
  return (
    <Link to="/" className="auth-brand" aria-label="Cuan home">
      <span className="auth-brand-mark" aria-hidden="true">
        <svg viewBox="0 0 32 32" fill="none">
          <rect width="32" height="32" rx="9" fill="url(#authLogoGrad)" />
          <path
            d="M9 20.5l4-4.5 3.2 3 5.8-7"
            stroke="#fff"
            strokeWidth="2.4"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          <circle cx="22" cy="12" r="1.6" fill="#fff" />
          <defs>
            <linearGradient id="authLogoGrad" x1="0" y1="0" x2="32" y2="32">
              <stop stopColor="#818cf8" />
              <stop offset="1" stopColor="#6366f1" />
            </linearGradient>
          </defs>
        </svg>
      </span>
      <span className="auth-brand-text">Cuan</span>
    </Link>
  );
}
