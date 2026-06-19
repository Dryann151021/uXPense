'use client';

import { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth.jsx';
import ThemeToggle from '../theme/ThemeToggle.jsx';

const navLinks = [
  { to: '/home', label: 'Home' },
  { to: '/budget', label: 'Budget' },
  { to: '/expense', label: 'Expense' },
  { to: '/leaderboard', label: 'Leaderboard' },
];

export default function Header() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const { pathname } = useLocation();
  const navigate = useNavigate();
  const { isAuthenticated, logout } = useAuth();

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  const handleLogout = async () => {
    await logout();
    navigate('/', { replace: true });
  };

  return (
    <>
      <header className="header">
        {/* Left section - Logo and Desktop Nav */}
        <div className="header-left">
          {/* Mobile Menu Button */}
          <button
            className={`mobile-menu-btn ${isMobileMenuOpen ? 'active' : ''}`}
            onClick={toggleMobileMenu}
            aria-label="Toggle mobile menu"
          >
            <span></span>
            <span></span>
            <span></span>
          </button>

          <Link to="/" className="logo" aria-label="Cuan landing page">
            <span className="logo-mark" aria-hidden="true">
              <svg viewBox="0 0 32 32" fill="none">
                <rect width="32" height="32" rx="9" fill="url(#logoGrad)" />
                <path
                  d="M9 20.5l4-4.5 3.2 3 5.8-7"
                  stroke="#fff"
                  strokeWidth="2.4"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
                <circle cx="22" cy="12" r="1.6" fill="#fff" />
                <defs>
                  <linearGradient id="logoGrad" x1="0" y1="0" x2="32" y2="32">
                    <stop stopColor="#818cf8" />
                    <stop offset="1" stopColor="#6366f1" />
                  </linearGradient>
                </defs>
              </svg>
            </span>
            <span className="logo-text">Cuan</span>
          </Link>
          <nav className="nav">
            {navLinks.map((link) => (
              <Link
                key={link.to}
                to={link.to}
                className={`nav-link ${pathname === link.to ? 'active' : ''}`}
              >
                {link.label}
              </Link>
            ))}
          </nav>
        </div>

        {/* Right section - Icons and User */}
        <div className="header-right">
          {/* Theme Toggle */}
          <ThemeToggle />

          {isAuthenticated && (
            <button
              type="button"
              className="logout-button"
              onClick={handleLogout}
            >
              Keluar
            </button>
          )}

          {/* Notification Bell */}
          <button className="header-icon" aria-label="Notifications">
            <svg
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
            >
              <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"></path>
              <path d="M13.73 21a2 2 0 0 1-3.46 0"></path>
            </svg>
            <span className="notification-badge" aria-hidden="true"></span>
          </button>

          {/* Streak Display */}
          <div className="streak-display" title="Streak harian">
            <span className="streak-flame" aria-hidden="true">
              <svg viewBox="0 0 24 24" fill="currentColor">
                <path d="M12 2c1 3-1 4.5-2.5 6C8 9.5 7 11 7 13a5 5 0 0 0 10 0c0-1.5-.6-2.9-1.5-4 .3 1.2-.2 2.3-1 2.8.5-2.3-.7-4.7-2.5-6 .3 1.6-.3 2.7-1.2 3.6C9.7 9.2 11 6 12 2z" />
              </svg>
            </span>
            <span>1</span>
          </div>

          {/* User Avatar */}
          <div
            className="user-avatar-outline"
            title="User Profile"
            aria-label="User profile"
          >
            <img src="/placeholder-user.jpg" alt="users" style={{ width: '100%', height: '100%', borderRadius: '50%', objectFit: 'cover' }} />
          </div>
        </div>
      </header>

      {/* Mobile Navigation Menu */}
      {isMobileMenuOpen && (
        <nav className="mobile-menu">
          {navLinks.map((link) => (
            <Link
              key={link.to}
              to={link.to}
              className={`mobile-menu-link ${pathname === link.to ? 'active' : ''}`}
              onClick={() => setIsMobileMenuOpen(false)}
            >
              {link.label}
            </Link>
          ))}
        </nav>
      )}
    </>
  );
}
