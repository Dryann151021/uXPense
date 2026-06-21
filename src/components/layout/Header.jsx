'use client';

import { useState, useRef, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth.jsx';
import { useStreakContext } from '../../hooks/useStreakContext.jsx';
import { useTheme } from '../../hooks/useTheme.jsx';
import ThemeToggle from '../theme/ThemeToggle.jsx';
import AppModal from '../ui/AppModal.jsx';

const navLinks = [
  { to: '/home', label: 'Home' },
  { to: '/budget', label: 'Budget' },
  { to: '/expense', label: 'Expense' },
  { to: '/leaderboard', label: 'Leaderboard' },
];

export default function Header() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [showLogoutModal, setShowLogoutModal] = useState(false);
  const [isLoggingOut, setIsLoggingOut] = useState(false);
  const profileRef = useRef(null);
  const { pathname } = useLocation();
  const navigate = useNavigate();
  const { logout, user } = useAuth();
  const { streak } = useStreakContext();
  const { resolvedTheme } = useTheme();

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (profileRef.current && !profileRef.current.contains(e.target)) {
        setIsProfileOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const today = new Date();
  const todayStr = new Date(today.getTime() - today.getTimezoneOffset() * 60000)
    .toISOString()
    .split('T')[0];
  const isTodayActive =
    streak?.current > 0 && streak?.lastExpenseDate?.split('T')[0] === todayStr;

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  const handleLogout = async () => {
    setIsLoggingOut(true);
    await logout();
    setIsLoggingOut(false);
    setShowLogoutModal(false);
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

          <Link to="/" className="logo" aria-label="uXPense landing page">
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
                    <stop stopColor="#d4ff00" />
                    <stop offset="1" stopColor="#b8e600" />
                  </linearGradient>
                </defs>
              </svg>
            </span>
            <span className="logo-text">uXPense</span>
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
          <div
            className={`streak-display ${isTodayActive ? 'active' : ''}`}
            title="Streak harian"
          >
            <span className="streak-flame" aria-hidden="true">
              <svg viewBox="0 0 24 24" fill="currentColor">
                <path d="M12 2c1 3-1 4.5-2.5 6C8 9.5 7 11 7 13a5 5 0 0 0 10 0c0-1.5-.6-2.9-1.5-4 .3 1.2-.2 2.3-1 2.8.5-2.3-.7-4.7-2.5-6 .3 1.6-.3 2.7-1.2 3.6C9.7 9.2 11 6 12 2z" />
              </svg>
            </span>
            <span>{streak?.current || 0}</span>
          </div>

          {/* User Avatar + Profile Dropdown */}
          <div className="profile-menu" ref={profileRef}>
            <button
              type="button"
              className="user-avatar-outline"
              title="User Profile"
              aria-label="User profile"
              aria-expanded={isProfileOpen}
              onClick={() => setIsProfileOpen((prev) => !prev)}
            >
              <img
                src="/placeholder-user.jpg"
                alt="users"
                style={{
                  width: '100%',
                  height: '100%',
                  borderRadius: '50%',
                  objectFit: 'cover',
                }}
              />
            </button>

            {isProfileOpen && (
              <div className="profile-dropdown">
                {/* User info */}
                <div className="profile-dropdown-user">
                  <div className="profile-dropdown-avatar">
                    <img src="/placeholder-user.jpg" alt="users" />
                  </div>
                  <div>
                    <p className="profile-dropdown-name">
                      {user?.fullname || user?.username || 'User'}
                    </p>
                    <p className="profile-dropdown-role">Level User</p>
                  </div>
                </div>

                <div className="profile-dropdown-divider" />

                {/* View Profile */}
                <button
                  type="button"
                  className="profile-dropdown-item"
                  disabled
                >
                  <svg
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                  >
                    <circle cx="12" cy="8" r="4" />
                    <path d="M4 20c0-4 3.6-7 8-7s8 3 8 7" />
                  </svg>
                  View Profile
                  <span className="profile-dropdown-badge">Segera</span>
                </button>

                {/* Theme toggle row */}
                <div className="profile-dropdown-item profile-dropdown-theme">
                  <svg
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                  >
                    <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" />
                  </svg>
                  <span>
                    {resolvedTheme === 'dark' ? 'Mode Gelap' : 'Mode Terang'}
                  </span>
                  <ThemeToggle compact />
                </div>

                <div className="profile-dropdown-divider" />

                {/* Logout */}
                <button
                  type="button"
                  className="profile-dropdown-item profile-dropdown-danger"
                  onClick={() => {
                    setIsProfileOpen(false);
                    setShowLogoutModal(true);
                  }}
                >
                  <svg
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                  >
                    <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
                    <polyline points="16 17 21 12 16 7" />
                    <line x1="21" y1="12" x2="9" y2="12" />
                  </svg>
                  Keluar
                </button>
              </div>
            )}
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

      <AppModal
        isOpen={showLogoutModal}
        variant="danger"
        title="Keluar dari akun?"
        description="Sesi kamu akan ditutup dari perangkat ini."
        confirmLabel="Keluar"
        confirmDisabled={isLoggingOut}
        onClose={() => setShowLogoutModal(false)}
        onConfirm={handleLogout}
      />
    </>
  );
}
