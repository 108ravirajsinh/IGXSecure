// src/components/Navbar.js
import React from 'react';

function Navbar({ userId, onLogout }) {
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
        <button className="logout-btn" onClick={onLogout}>
          Sign out
        </button>
      </div>
    </header>
  );
}

export default Navbar;