// src/components/TermsOfUse.js
import React from 'react';

function TermsOfUse({ onBack }) {
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
        <div className="legal-icon">📋</div>
        <h1 className="legal-title">Terms of Use</h1>
        <p className="legal-meta">IGXSecure · Last updated: April 2026</p>
      </div>

      <div className="legal-body">

        <section className="legal-section">
          <h2>1. Acceptance of Terms</h2>
          <p>
            By connecting your Instagram account to IGXSecure and using this application,
            you agree to these Terms of Use. If you do not agree, do not use IGXSecure.
          </p>
          <p>
            IGXSecure is an independent, self-hosted application and is not affiliated
            with, endorsed by, or sponsored by Meta Platforms, Inc. or Instagram.
          </p>
        </section>

        <section className="legal-section">
          <h2>2. Description of Service</h2>
          <p>
            IGXSecure is a personal, distraction-free interface for viewing your own
            Instagram content — posts, stories, and messages — through the official
            Meta Instagram Graph API. It is designed for personal use only.
          </p>
          <ul>
            <li>Read access to your Instagram feed (posts you follow)</li>
            <li>Read access to your Instagram Stories</li>
            <li>Read access to your Direct Message inbox</li>
            <li>Notification summaries for likes and comments on your content</li>
          </ul>
        </section>

        <section className="legal-section">
          <h2>3. Eligibility</h2>
          <p>
            You must have a valid Instagram account and be of legal age to use Instagram
            in your jurisdiction. By using IGXSecure you confirm you have the right to
            connect your Instagram account and use the Graph API through this application.
          </p>
        </section>

        <section className="legal-section">
          <h2>4. Permitted Use</h2>
          <ul>
            <li>View your own Instagram feed, stories, and messages</li>
            <li>Navigate your content in a distraction-free environment</li>
            <li>Use the application for personal, non-commercial purposes</li>
          </ul>
        </section>

        <section className="legal-section">
          <h2>5. Prohibited Use</h2>
          <p>You must <strong>not</strong> use IGXSecure to:</p>
          <ul>
            <li>Scrape, harvest, or bulk-download Instagram content</li>
            <li>Access other users' accounts without their explicit permission</li>
            <li>Automate interactions (likes, follows, comments) on Instagram</li>
            <li>Violate Meta's Platform Terms or Instagram's Community Guidelines</li>
            <li>Reverse-engineer, decompile, or tamper with the application</li>
            <li>Use the application for commercial purposes without explicit permission
              from the developer</li>
          </ul>
        </section>

        <section className="legal-section">
          <h2>6. Instagram & Meta Terms</h2>
          <p>
            Your use of IGXSecure is subject to Instagram's and Meta's terms in addition
            to these Terms of Use. You are responsible for complying with:
          </p>
          <ul>
            <li>
              <a href="https://help.instagram.com/581066165581870" target="_blank"
                 rel="noopener noreferrer">Instagram Terms of Use</a>
            </li>
            <li>
              <a href="https://developers.facebook.com/terms/" target="_blank"
                 rel="noopener noreferrer">Meta Platform Terms</a>
            </li>
          </ul>
        </section>

        <section className="legal-section">
          <h2>7. Access Revocation</h2>
          <ol>
            <li>Log out via <strong>Settings → Logout</strong> in IGXSecure.</li>
            <li>Go to <strong>Instagram → Settings → Security → Apps and Websites</strong>
              and remove IGXSecure from the authorized apps list.</li>
          </ol>
          <p>
            Upon logout, your session and encrypted access token are permanently deleted
            from the server database.
          </p>
        </section>

        <section className="legal-section">
          <h2>8. Disclaimers & Limitation of Liability</h2>
          <p>
            IGXSecure is provided <strong>"as is"</strong> without warranties of any kind,
            express or implied, including fitness for a particular purpose or uninterrupted
            availability.
          </p>
          <p>
            The developer is not liable for any data loss, service interruptions, or issues
            arising from changes to the Instagram Graph API, Meta policy updates, or
            third-party service outages.
          </p>
        </section>

        <section className="legal-section">
          <h2>9. Changes to These Terms</h2>
          <p>
            These Terms of Use may be updated at any time. The "Last updated" date at the
            top of this page will reflect any changes. Continued use of IGXSecure after
            updates constitutes acceptance of the revised terms.
          </p>
        </section>

        <section className="legal-section">
          <h2>10. Contact</h2>
          <div className="legal-contact-card">
            <div><strong>Developer:</strong> Ravirajsinh Rathod</div>
            <div><strong>Location:</strong> Chatham, Ontario, Canada</div>
            <div><strong>GitHub:</strong>{' '}
              <a href="https://github.com/108ravirajsinh" target="_blank"
                 rel="noopener noreferrer">github.com/108ravirajsinh</a>
            </div>
          </div>
        </section>

      </div>
    </div>
  );
}

export default TermsOfUse;