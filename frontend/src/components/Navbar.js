// src/components/Navbar.js
import React from 'react';

const NAV_ITEMS = [
  {
    id: 'feed',
    label: 'Feed',
    icon: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none"
           stroke="currentColor" strokeWidth="2">
        <rect x="3" y="3" width="7" height="7" rx="1"/>
        <rect x="14" y="3" width="7" height="7" rx="1"/>
        <rect x="3" y="14" width="7" height="7" rx="1"/>
        <rect x="14" y="14" width="7" height="7" rx="1"/>
      </svg>
    ),
  },
  {
    id: 'messages',
    label: 'Messages',
    icon: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none"
           stroke="currentColor" strokeWidth="2">
        <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/>
      </svg>
    ),
  },
  {
    id: 'settings',
    label: 'Settings',
    icon: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none"
           stroke="currentColor" strokeWidth="2">
        <circle cx="12" cy="12" r="3"/>
        <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1-2.83 2.83l-.06-.06
                 a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-4 0v-.09
                 A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83-2.83
                 l.06-.06A1.65 1.65 0 0 0 4.68 15a1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1 0-4h.09
                 A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 2.83-2.83
                 l.06.06A1.65 1.65 0 0 0 9 4.68a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 4 0v.09
                 a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 2.83
                 l-.06.06A1.65 1.65 0 0 0 19.4 9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 0 4h-.09
                 a1.65 1.65 0 0 0-1.51 1z"/>
      </svg>
    ),
  },
];

function Navbar({ userId, view, onViewChange }) {
  return (
    <>
      {/* ── Top header — visible on ALL screen sizes ── */}
      <header className="app-header">

        {/* Brand (left) */}
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

        {/* Desktop center nav — Feed / Messages / Settings (hidden on mobile) */}
        <nav className="desktop-nav" aria-label="Main navigation">
          {NAV_ITEMS.map(item => {
            const active = view === item.id;
            return (
              <button
                key={item.id}
                className={`desktop-nav-btn ${active ? 'desktop-nav-btn-active' : ''}`}
                onClick={() => onViewChange(item.id)}
                aria-label={item.label}
                aria-current={active ? 'page' : undefined}
              >
                {item.icon}
                <span className="desktop-nav-label">{item.label}</span>
                {active && <span className="desktop-nav-dot" aria-hidden="true" />}
              </button>
            );
          })}
        </nav>

        {/* Right — Alerts bell (always visible) */}
        <div className="nav-actions">
          <button
            className={`nav-icon-btn ${view === 'notifications' ? 'nav-icon-btn-active' : ''}`}
            onClick={() => onViewChange('notifications')}
            aria-label="Alerts"
            title="Alerts"
          >
            <svg width="17" height="17" viewBox="0 0 24 24" fill="none"
                 stroke="currentColor" strokeWidth="2">
              <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"/>
              <path d="M13.73 21a2 2 0 0 1-3.46 0"/>
            </svg>
          </button>
        </div>

      </header>

      {/* ── Bottom nav — mobile only (≤768px) ── */}
      <nav className="bottom-nav" aria-label="Main navigation">
        {NAV_ITEMS.map(item => {
          const active = view === item.id;
          return (
            <button
              key={item.id}
              className={`bottom-nav-item ${active ? 'bottom-nav-item-active' : ''}`}
              onClick={() => onViewChange(item.id)}
              aria-label={item.label}
              aria-current={active ? 'page' : undefined}
            >
              {item.icon}
              <span className="bottom-nav-label">{item.label}</span>
              <span className="bottom-nav-dot" aria-hidden="true" />
            </button>
          );
        })}
      </nav>
    </>
  );
}

export default Navbar;