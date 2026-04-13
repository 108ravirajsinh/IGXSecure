// src/components/Settings.js
import React, { useState } from 'react';
import { apiBaseUrl } from '../config/api';

function Settings({ userId, onLogout, onOpenPrivacy, onOpenTerms }) {
  const [loggingOut, setLoggingOut] = useState(false);

  const handleLogout = () => {
    setLoggingOut(true);
    fetch(`${apiBaseUrl}/auth/logout`, { method: 'POST', credentials: 'include' })
      .then(() => onLogout())
      .catch(() => onLogout());
  };

  return (
    <div className="settings-wrap">

      {/* ── Header ── */}
      <div className="settings-header">
        <h2 className="settings-title">Settings</h2>
        <p className="settings-sub">Manage your IGXSecure session and preferences</p>
      </div>

      {/* ── Account Card ── */}
      <div className="settings-card">
        <div className="settings-card-label">Account</div>
        <div className="settings-row">
          <div className="settings-row-left">
            <div className="settings-avatar">{userId ? userId.toString().charAt(0) : 'U'}</div>
            <div>
              <div className="settings-row-title">Instagram Account</div>
              <div className="settings-row-value mono">ID: {userId || 'Unknown'}</div>
            </div>
          </div>
          <div className="settings-badge settings-badge-green">Connected</div>
        </div>
      </div>

      {/* ── Security Card ── */}
      <div className="settings-card">
        <div className="settings-card-label">Security</div>
        <div className="settings-row">
          <div className="settings-row-left">
            <div className="settings-icon">🔑</div>
            <div>
              <div className="settings-row-title">Token Storage</div>
              <div className="settings-row-value">AES-256-GCM encrypted, server-side only</div>
            </div>
          </div>
          <div className="settings-badge settings-badge-green">Secure</div>
        </div>
        <div className="settings-divider" />
        <div className="settings-row">
          <div className="settings-row-left">
            <div className="settings-icon">🔄</div>
            <div>
              <div className="settings-row-title">Token Auto-Refresh</div>
              <div className="settings-row-value">Renews automatically when &lt; 7 days remain</div>
            </div>
          </div>
          <div className="settings-badge settings-badge-green">Active</div>
        </div>
        <div className="settings-divider" />
        <div className="settings-row">
          <div className="settings-row-left">
            <div className="settings-icon">🛡️</div>
            <div>
              <div className="settings-row-title">Browser Exposure</div>
              <div className="settings-row-value">Token never sent to or stored in browser</div>
            </div>
          </div>
          <div className="settings-badge settings-badge-green">None</div>
        </div>
        <div className="settings-divider" />
        <div className="settings-row">
          <div className="settings-row-left">
            <div className="settings-icon">🌐</div>
            <div>
              <div className="settings-row-title">API Source</div>
              <div className="settings-row-value">Official Meta Graph API only — no scraping</div>
            </div>
          </div>
          <div className="settings-badge settings-badge-green">Compliant</div>
        </div>
      </div>

      {/* ── About Card ── */}
      <div className="settings-card">
        <div className="settings-card-label">About</div>
        <div className="settings-row">
          <div className="settings-row-left">
            <div className="settings-icon">📦</div>
            <div>
              <div className="settings-row-title">IGXSecure</div>
              <div className="settings-row-value">Version 0.5.0 — Phase 5</div>
            </div>
          </div>
        </div>
        <div className="settings-divider" />
        <div className="settings-row">
          <div className="settings-row-left">
            <div className="settings-icon">🖥️</div>
            <div>
              <div className="settings-row-title">Runtime</div>
              <div className="settings-row-value">Node.js + Express · React 18</div>
            </div>
          </div>
        </div>
        <div className="settings-divider" />
        <div className="settings-row">
          <div className="settings-row-left">
            <div className="settings-icon">👤</div>
            <div>
              <div className="settings-row-title">Developer</div>
              <div className="settings-row-value">Ravirajsinh Rathod — Ontario, Canada</div>
            </div>
          </div>
        </div>
      </div>

      {/* ── Legal Card (NEW) ── */}
      <div className="settings-card">
        <div className="settings-card-label">Legal</div>

        <button className="settings-row settings-row-btn" onClick={onOpenPrivacy}>
          <div className="settings-row-left">
            <div className="settings-icon">🔒</div>
            <div>
              <div className="settings-row-title">Privacy Policy</div>
              <div className="settings-row-value">How your data is collected, stored, and used</div>
            </div>
          </div>
          <svg className="settings-row-chevron" width="16" height="16" viewBox="0 0 24 24"
               fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M9 18l6-6-6-6"/>
          </svg>
        </button>

        <div className="settings-divider" />

        <button className="settings-row settings-row-btn" onClick={onOpenTerms}>
          <div className="settings-row-left">
            <div className="settings-icon">📋</div>
            <div>
              <div className="settings-row-title">Terms of Use</div>
              <div className="settings-row-value">Permitted use, prohibited actions, disclaimers</div>
            </div>
          </div>
          <svg className="settings-row-chevron" width="16" height="16" viewBox="0 0 24 24"
               fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M9 18l6-6-6-6"/>
          </svg>
        </button>
      </div>

      {/* ── Danger Zone ── */}
      <div className="settings-card settings-card-danger">
        <div className="settings-card-label">Session</div>
        <div className="settings-row">
          <div className="settings-row-left">
            <div className="settings-icon">🚪</div>
            <div>
              <div className="settings-row-title">Logout</div>
              <div className="settings-row-value">Clears your session and encrypted token</div>
            </div>
          </div>
          <button
            className="settings-logout-btn"
            onClick={handleLogout}
            disabled={loggingOut}
          >
            {loggingOut ? 'Logging out…' : 'Logout'}
          </button>
        </div>
      </div>

    </div>
  );
}

export default Settings;