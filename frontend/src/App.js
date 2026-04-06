// src/App.js
import React, { useEffect, useState } from 'react';
import Navbar    from './components/Navbar';
import Stories   from './components/Stories';
import PostList  from './components/PostList';
import Settings  from './components/Settings';
import { apiBaseUrl } from './config/api';
import './App.css';

function App() {
  const [auth, setAuth]     = useState({ loading: true, authenticated: false, userId: null });
  const [view, setView]     = useState('feed'); // 'feed' | 'settings'

  useEffect(() => {
    fetch(`${apiBaseUrl}/auth/status`, { credentials: 'include' })
      .then(r => r.json())
      .then(d => setAuth({ loading: false, authenticated: d.authenticated, userId: d.userId }))
      .catch(() => setAuth({ loading: false, authenticated: false, userId: null }));
  }, []);

  const [isLoggingOut, setIsLoggingOut] = useState(false);

const handleLogout = async () => {
  if (isLoggingOut) return;          // ← blocks double calls
  setIsLoggingOut(true);
  try {
    await fetch('/igxsecure/api/auth/logout', {
      method: 'POST',
      credentials: 'include'
    });
  } finally {
    setIsLoggingOut(false);
    setAuthenticated(false);         // instant UI update, no freeze
  }
};
  /* ── Loading ── */
  if (auth.loading) return (
    <div className="loading-wrapper">
      <div className="spinner" role="status" aria-label="Loading" />
      <span>Checking session…</span>
    </div>
  );

  /* ── Not logged in ── */
  if (!auth.authenticated) return (
    <div className="landing-wrap">
      <div className="landing-card">
        <div className="brand">
          <div className="brand-icon">
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none"
                 stroke="currentColor" strokeWidth="2">
              <rect x="2" y="2" width="20" height="20" rx="5"/>
              <circle cx="12" cy="12" r="4"/>
              <circle cx="17.5" cy="6.5" r="1" fill="currentColor" stroke="none"/>
            </svg>
          </div>
          <span className="brand-name">IGX<span>Secure</span></span>
        </div>

        <h1 className="landing-heading">Your Instagram.<br/>Distraction-free.</h1>
        <p className="landing-sub">
          A private, self-hosted interface for posts, stories, and messages —
          no ads, no reels, no algorithmic noise.
        </p>

        <ul className="feature-list">
          <li><span className="check">✓</span> Posts from people you follow</li>
          <li><span className="check">✓</span> Stories and direct messages</li>
          <li><span className="check">✓</span> Tokens encrypted AES-256, never exposed</li>
          <li><span className="cross">✕</span> No reels · No explore · No ads</li>
          <li><span className="cross">✕</span> No algorithmic suggestions</li>
        </ul>

        <button className="connect-btn"
          onClick={() => { window.location.href = `${apiBaseUrl}/auth/login`; }}>
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none"
               stroke="currentColor" strokeWidth="2">
            <rect x="2" y="2" width="20" height="20" rx="5"/>
            <circle cx="12" cy="12" r="4"/>
            <circle cx="17.5" cy="6.5" r="1" fill="currentColor" stroke="none"/>
          </svg>
          Connect with Instagram
        </button>

        <p className="privacy-note">
          IGXSecure uses only the official Instagram Graph API.
          Your password is never stored.
        </p>
      </div>
    </div>
  );

  /* ── Logged in ── */
  return (
    <div className="app">
      <Navbar
        userId={auth.userId}
        onLogout={handleLogout}
        view={view}
        onViewChange={setView}
      />
      <main className="app-main">
        {view === 'feed' && (
          <div className="feed-wrapper">
            <Stories />
            <PostList />
          </div>
        )}
        {view === 'settings' && (
          <Settings userId={auth.userId} onLogout={handleLogout} />
        )}
      </main>
      <footer className="app-footer">
        Distraction-free · No ads · No reels · No suggestions
      </footer>
    </div>
  );
}

export default App;