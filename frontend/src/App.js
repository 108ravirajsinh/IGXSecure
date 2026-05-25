// src/App.js
import React, { useState, useEffect, useRef } from 'react';
import AppNav from './components/AppNav';
import Header from './components/Header';
import Navbar        from './components/Navbar';
import Stories       from './components/Stories';
import PostList      from './components/PostList';
import Settings      from './components/Settings';
import Messages      from './components/Messages';
import Notifications from './components/Notifications';
import PrivacyPolicy from './components/PrivacyPolicy';
import TermsOfUse   from './components/TermsOfUse';
import { apiBaseUrl } from './config/api';
import './App.css';

function App() {
  const [auth, setAuth] = useState({ loading: true, authenticated: false, userId: null });
  const [view, setView] = useState('feed');
  // remembers which view to return to after closing a legal page
  const [legalReturnView, setLegalReturnView] = useState('feed');

  useEffect(() => {
    fetch(`${apiBaseUrl}/auth/status`, { credentials: 'include' })
      .then(r => r.json())
      .then(d => setAuth({ loading: false, authenticated: d.authenticated, userId: d.userId }))
      .catch(() => setAuth({ loading: false, authenticated: false, userId: null }));
  }, []);

  // Token expiry warning + auto-refresh
  useEffect(() => {
  if (!auth.authenticated || !auth.expiresAt) return;

  const msLeft = new Date(auth.expiresAt) - Date.now();
  const daysLeft = Math.floor(msLeft / (1000 * 60 * 60 * 24));
  const [tokenWarning, setTokenWarning] = useState(null);
  if (daysLeft <= 7) {
    setTokenWarning(daysLeft);
  }
  }, [auth]);

  const isLoggingOutRef = useRef(false);
  const [isLoggingOut, setIsLoggingOut] = useState(false);

  const handleLogout = async () => {
    if (isLoggingOutRef.current) return;
    isLoggingOutRef.current = true;
    setIsLoggingOut(true);
    try {
      await fetch('/igxsecure/api/auth/logout', {
        method: 'POST',
        credentials: 'include'
      });
    } finally {
      isLoggingOutRef.current = false;
      setIsLoggingOut(false);
      setAuth({ authenticated: false, userId: null });
    }
  };

  const openLegal = (page) => {
    setLegalReturnView(view);
    setView(page);
  };
  const closeLegal = () => setView(legalReturnView);

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
      {/* Legal pages accessible from landing (no navbar needed) */}
      {view === 'privacy' && (
        <div className="landing-legal-overlay">
          <PrivacyPolicy onBack={() => setView('feed')} />
        </div>
      )}
      {view === 'terms' && (
        <div className="landing-legal-overlay">
          <TermsOfUse onBack={() => setView('feed')} />
        </div>
      )}

      {/* Hide the card while a legal page is open */}
      {view !== 'privacy' && view !== 'terms' && (
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

          {/* Legal links — visible before OAuth */}
          <div className="landing-legal">
            <button className="landing-legal-link" onClick={() => setView('privacy')}>
              Privacy Policy
            </button>
            <span className="landing-legal-sep">·</span>
            <button className="landing-legal-link" onClick={() => setView('terms')}>
              Terms of Use
            </button>
          </div>
        </div>
      )}
    </div>
  );

  /* ── Logged in ── */
  return (
    <div className="app">
       <div className="app-shell">
      <Header notifCount={0} onNavigate={setView} />
      {tokenWarning !== null && (
  <div className="token-warning-bar">
    <span>
      ⚠️ Your session {tokenWarning <= 0 ? 'has expired' : `expires in ${tokenWarning} day${tokenWarning === 1 ? '' : 's'}`}.
    </span>
    <button
      className="token-warning-refresh"
      onClick={async () => {
        const r = await fetch('/igxsecure/api/auth/refresh', { method: 'POST', credentials: 'include' });
        if (r.ok) setTokenWarning(null);
        else window.location.href = '/igxsecure/api/auth/login';
      }}
    >
      Renew Session
    </button>
  </div>
)}
      <div className="app-body">
        <AppNav activeView={view} onNavigate={setView} />        

            <main className="app-main">
              {view === 'feed' && (
                <div className="feed-wrapper">
                  <Stories />
                  <PostList />
                </div>
              )}

              {view === 'notifications' && <Notifications />}

              {view === 'messages' && (
                <Messages userId={auth.userId} />
              )}

              {view === 'settings' && (
                <Settings
                  userId={auth.userId}
                  onLogout={handleLogout}
                  onOpenPrivacy={() => openLegal('privacy')}
                  onOpenTerms={()   => openLegal('terms')}
                />
              )}

              {view === 'privacy' && <PrivacyPolicy onBack={closeLegal} />}
              {view === 'terms'   && <TermsOfUse   onBack={closeLegal} />}
            </main>
        </div>
        </div>
        {view !== 'privacy' && view !== 'terms' && (
          <footer className="app-footer">
            Distraction-free · No ads · No reels · No suggestions
            <span className="footer-sep"> · </span>
            <button className="footer-legal-link" onClick={() => openLegal('privacy')}>
              Privacy Policy
            </button>
            <span className="footer-sep"> · </span>
            <button className="footer-legal-link" onClick={() => openLegal('terms')}>
              Terms of Use
            </button>
          </footer>
      )}
    </div>
  );
}

export default App;