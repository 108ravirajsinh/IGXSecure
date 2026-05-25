// frontend/src/components/Header.js
import React from 'react';
import { Bell } from 'lucide-react';

function Header({ notifCount }) {
  return (
    <header className="app-header">
      <div className="header-brand">
        <svg className="brand-icon" viewBox="0 0 24 24" fill="none"
          stroke="currentColor" strokeWidth="2" aria-label="IGXSecure">
          <rect x="2" y="2" width="20" height="20" rx="5" ry="5"/>
          <circle cx="12" cy="12" r="4"/>
          <circle cx="17.5" cy="6.5" r="1.2" fill="currentColor" stroke="none"/>
        </svg>
        <span className="brand-name">IGXSecure</span>
      </div>
        <button
            className="notif-btn"
            aria-label="Notifications"
            onClick={() => onNavigate('notifications')}
          >
        <Bell size={20} />
        {notifCount > 0 && <span className="notif-badge">{notifCount}</span>}
      </button>
    </header>
  );
}

export default Header;