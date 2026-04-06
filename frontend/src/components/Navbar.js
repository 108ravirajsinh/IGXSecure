// src/components/Navbar.js
import React from 'react';

function Navbar({ userId, onLogout, view, onViewChange }) {
  return (
    <header className="app-header">
      <div className="brand">
        <div className="brand-icon">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none"
               stroke="currentColor" strokeWidth="2">
            <rect x="2" y="2" width="20" height="20" rx="5"/>
            <circle cx="12" cy="12" r="4"/>
            <circle cx="17.5" cy="6.5" r="1" fill="currentColor" stroke="none"/>
          </svg>
        </div>
        <span className="brand-name">IGX<span>Secure</span></span>
      </div>

      <div className="nav-actions">
        <span className="nav-user">ID: {userId}</span>

        {/* ── Feed toggle ── */}
        <button
          className={`nav-icon-btn ${view === 'feed' ? 'nav-icon-btn-active' : ''}`}
          onClick={() => onViewChange('feed')}
          aria-label="Feed"
          title="Feed"
        >
          <svg width="17" height="17" viewBox="0 0 24 24" fill="none"
               stroke="currentColor" strokeWidth="2">
            <rect x="3" y="3" width="7" height="7" rx="1"/>
            <rect x="14" y="3" width="7" height="7" rx="1"/>
            <rect x="3" y="14" width="7" height="7" rx="1"/>
            <rect x="14" y="14" width="7" height="7" rx="1"/>
          </svg>
        </button>

        {/* ── Settings toggle ── */}
        <button
          className={`nav-icon-btn ${view === 'settings' ? 'nav-icon-btn-active' : ''}`}
          onClick={() => onViewChange('settings')}
          aria-label="Settings"
          title="Settings"
        >
          <svg width="17" height="17" viewBox="0 0 24 24" fill="none"
               stroke="currentColor" strokeWidth="2">
            <circle cx="12" cy="12" r="3"/>
            <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83-2.83l.06-.06A1.65 1.65 0 0 0 4.68 15a1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 2.83-2.83l.06.06A1.65 1.65 0 0 0 9 4.68a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 2.83l-.06.06A1.65 1.65 0 0 0 19.4 9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z"/>
          </svg>
        </button>

        <button
            className="logout-btn"
            onClick={onLogout}
            disabled={isLoggingOut}           // ← prevents double clicks
          >
            {isLoggingOut ? 'Signing out…' : 'Sign out'}
          </button>
      </div>
    </header>
  );
}

export default Navbar;