// src/components/PrivacyPolicy.js
import React from 'react';

function PrivacyPolicy({ onBack }) {
  return (
    <div className="legal-page">
      <div className="legal-back">
        <button className="legal-back-btn" onClick={onBack}>
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none"
               stroke="currentColor" strokeWidth="2">
            <path d="M19 12H5M12 5l-7 7 7 7"/>
          </svg>
          Back
        </button>
      </div>

      <div className="legal-header">
        <div className="legal-icon">🔒</div>
        <h1 className="legal-title">Privacy Policy</h1>
        <p className="legal-meta">IGXSecure · Last updated: April 2026</p>
      </div>

      <div className="legal-body">

        <section className="legal-section">
          <h2>Overview</h2>
          <p>
            IGXSecure is a self-hosted, private Instagram viewer built for personal use.
            This Privacy Policy explains what data we collect, how it is stored, and
            how it is used when you connect your Instagram account through the official
            Meta Instagram Graph API.
          </p>
          <p>
            IGXSecure is not affiliated with, endorsed by, or sponsored by Meta Platforms, Inc.
          </p>
        </section>

        <section className="legal-section">
          <h2>1. Data We Collect</h2>
          <p>When you authenticate with Instagram, IGXSecure collects and stores the following:</p>
          <ul>
            <li>
              <strong>Instagram User ID</strong> — a numeric identifier assigned by Meta to
              your Instagram account. This is used to identify your session.
            </li>
            <li>
              <strong>Instagram Access Token</strong> — a short-lived or long-lived OAuth
              token issued by Meta, used to retrieve your feed, stories, and messages
              through the Graph API on your behalf.
            </li>
          </ul>
          <p>
            We do <strong>not</strong> collect your Instagram username, password, email
            address, phone number, profile picture, or any personal demographic information.
          </p>
        </section>

        <section className="legal-section">
          <h2>2. How Data Is Stored</h2>
          <ul>
            <li>
              <strong>Access tokens are encrypted using AES-256-GCM</strong> before
              being written to the server-side database (PostgreSQL). The encryption
              key is stored separately as an environment variable and is never embedded
              in source code.
            </li>
            <li>
              <strong>Tokens are never transmitted to or stored in your browser.</strong>
              They exist only on the server. Your browser only receives a session cookie
              (HttpOnly, Secure) that identifies your server-side session.
            </li>
            <li>
              <strong>Sessions are stored server-side</strong> using express-session with
              a PostgreSQL session store. Session data contains your User ID only — not
              your access token.
            </li>
            <li>
              No data is written to localStorage, sessionStorage, or any client-side
              storage mechanism.
            </li>
          </ul>
        </section>

        <section className="legal-section">
          <h2>3. How Data Is Used</h2>
          <p>Your data is used exclusively for the following purposes:</p>
          <ul>
            <li>Fetching and displaying posts from your Instagram feed</li>
            <li>Fetching and displaying your Instagram Stories</li>
            <li>Reading your Instagram Direct Message inbox and threads</li>
            <li>Displaying notifications (likes, comments) on your content</li>
          </ul>
          <p>
            No content is cached beyond your active session. All data displayed in the
            app is fetched in real-time from the Meta Instagram Graph API.
          </p>
        </section>

        <section className="legal-section">
          <h2>4. Data Sharing</h2>
          <p>
            <strong>We do not sell, rent, share, or disclose your data to any third parties,
            advertisers, analytics services, or data brokers.</strong>
          </p>
          <p>
            IGXSecure does not use any third-party tracking, telemetry, or analytics
            libraries. There are no external scripts, pixels, or beacons embedded in this
            application.
          </p>
        </section>

        <section className="legal-section">
          <h2>5. Data Retention</h2>
          <ul>
            <li>
              <strong>Session data</strong> is automatically cleared when you log out or
              when the session expires (default: 7 days of inactivity).
            </li>
            <li>
              <strong>Encrypted access tokens</strong> are deleted from the database
              immediately upon logout.
            </li>
            <li>
              You can request deletion of all stored data at any time by logging out
              via Settings → Logout, or by contacting us at the address below.
            </li>
          </ul>
        </section>

        <section className="legal-section">
          <h2>6. Your Rights & Data Deletion</h2>
          <p>
            You have the right to request deletion of any data associated with your
            Instagram User ID at any time. To do so:
          </p>
          <ol>
            <li>Open IGXSecure and go to <strong>Settings</strong>.</li>
            <li>Tap <strong>Logout</strong> — this immediately clears your session
              and deletes your encrypted token from the database.</li>
            <li>To revoke IGXSecure's access entirely, visit
              <strong> Instagram → Settings → Security → Apps and Websites</strong>
              and remove IGXSecure.</li>
          </ol>
          <p>
            For additional data deletion requests, contact us at the address in
            Section 8 below.
          </p>
        </section>

        <section className="legal-section">
          <h2>7. API Compliance</h2>
          <p>
            IGXSecure uses only the official Meta Instagram Graph API and complies
            with Meta's Platform Terms and Developer Policies. The application requests
            only the minimum scopes required for its features:
          </p>
          <ul>
            <li><code>instagram_basic</code> — read feed and profile</li>
            <li><code>instagram_manage_insights</code> — read story insights</li>
            <li><code>pages_show_list</code> — required for Graph API access</li>
          </ul>
          <p>
            IGXSecure does not scrape, crawl, or access Instagram via unofficial means.
          </p>
        </section>

        <section className="legal-section">
          <h2>8. Contact</h2>
          <p>
            For questions, data deletion requests, or privacy-related concerns:
          </p>
          <div className="legal-contact-card">
            <div><strong>Developer:</strong> Ravirajsinh Rathod</div>
            <div><strong>Location:</strong> Chatham, Ontario, Canada</div>
            <div><strong>GitHub:</strong>{' '}
              <a href="https://github.com/108ravirajsinh" target="_blank"
                 rel="noopener noreferrer">github.com/108ravirajsinh</a>
            </div>
          </div>
        </section>

        <section className="legal-section">
          <h2>9. Changes to This Policy</h2>
          <p>
            If this Privacy Policy changes, the "Last updated" date at the top of
            this page will be revised. Continued use of IGXSecure after changes are
            posted constitutes acceptance of the revised policy.
          </p>
        </section>

      </div>
    </div>
  );
}

export default PrivacyPolicy;