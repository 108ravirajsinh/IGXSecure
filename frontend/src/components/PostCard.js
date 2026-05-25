// src/components/PostCard.js
import ReactDOM from 'react-dom';
import React, { useState, useEffect } from 'react';
import { apiBaseUrl } from '../config/api';

function timeAgo(timestamp) {
  const diff = Date.now() - new Date(timestamp);
  const mins = Math.floor(diff / 60000);
  if (mins < 1)  return 'just now';
  if (mins < 60) return `${mins}m ago`;
  const hrs = Math.floor(mins / 60);
  if (hrs < 24)  return `${hrs}h ago`;
  return `${Math.floor(hrs / 24)}d ago`;
}

function proxyUrl(url) {
  if (!url) return null;
  return `${apiBaseUrl}/proxy/image?url=${encodeURIComponent(url)}`;
}

// Renders lightbox via React Portal into document.body
// This escapes ANY parent stacking context — fixes offset bug
function LightboxPortal({ children }) {
  const [el] = useState(() => document.createElement('div'));
  useEffect(() => {
    document.body.appendChild(el);
    document.body.style.overflow = 'hidden'; // prevent bg scroll
    return () => {
      document.body.removeChild(el);
      document.body.style.overflow = '';
    };
  }, [el]);

  const ReactDOM = require('react-dom');
  return ReactDOM.createPortal(children, el);
}

function PostCard({ post }) {
  if (!post || !post.media_type) return null;

  const [expanded,  setExpanded]  = useState(false);
  const [imgError,  setImgError]  = useState(false);
  const [lightbox,  setLightbox]  = useState(false);

  const isVideo  = post.media_type === 'VIDEO';
  const thumbUrl = proxyUrl(post.thumbnail_url);
  const imageUrl = proxyUrl(post.media_url);
  const initial  = post.username ? post.username.charAt(0).toUpperCase() : '?';
  const caption  = post.caption || '';

  // Close lightbox on Escape key
  useEffect(() => {
    if (!lightbox) return;
    const handler = e => { if (e.key === 'Escape') setLightbox(false); };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, [lightbox]);

  return (
    <>
      <article className="post-card">
        <header className="post-header">
          <div className="post-avatar" aria-hidden="true">{initial}</div>
          <div className="post-meta">
            <span className="post-username">{post.username}</span>
            <span className="post-time">{timeAgo(post.timestamp)}</span>
          </div>
          {isVideo && <span className="post-type-badge">▶ Video</span>}
        </header>

        {/* ── Image Post ── */}
        {!isVideo && imageUrl && !imgError && (
          <div
            className="post-image-wrapper"
            onClick={() => setLightbox(true)}
            role="button" tabIndex={0}
            aria-label="View full image"
            onKeyDown={e => e.key === 'Enter' && setLightbox(true)}
          >
            <img
              src={imageUrl}
              alt={`Post by ${post.username}`}
              className="post-image"
              loading="lazy"
              onError={() => setImgError(true)}
            />
            <div className="post-image-overlay">
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none"
                   stroke="currentColor" strokeWidth="2">
                <path d="M15 3h6v6M9 21H3v-6M21 3l-7 7M3 21l7-7"/>
              </svg>
            </div>
          </div>
        )}

        {/* ── Video Post ── */}
        {isVideo && post.media_url && (
          <div
            className="post-image-wrapper post-video-wrapper"
            onClick={() => setLightbox(true)}
            role="button" tabIndex={0}
            aria-label="View full video"
            onKeyDown={e => e.key === 'Enter' && setLightbox(true)}
          >
            <video
              className="post-video"
              poster={thumbUrl || undefined}
              preload="metadata"
              playsInline
            >
              <source src={proxyUrl(post.media_url)} type="video/mp4" />
            </video>
            <div className="post-video-overlay">
              <svg width="52" height="52" viewBox="0 0 24 24" fill="currentColor">
                <circle cx="12" cy="12" r="10" fill="rgba(0,0,0,0.55)"/>
                <polygon points="10,8 16,12 10,16" fill="white"/>
              </svg>
            </div>
          </div>
        )}

        {/* ── Video fallback thumbnail ── */}
        {isVideo && !post.media_url && thumbUrl && !imgError && (
          <div className="post-image-wrapper">
            <img
              src={thumbUrl}
              alt={`Video thumbnail by ${post.username}`}
              className="post-image"
              loading="lazy"
              onError={() => setImgError(true)}
            />
            <div className="post-video-overlay">
              <svg width="48" height="48" viewBox="0 0 24 24" fill="currentColor">
                <circle cx="12" cy="12" r="10" fill="rgba(0,0,0,0.55)"/>
                <polygon points="10,8 16,12 10,16" fill="white"/>
              </svg>
            </div>
          </div>
        )}

        {imgError && (
          <div className="post-image-wrapper post-image-error">
            <span>Media unavailable</span>
          </div>
        )}

        {caption && (
          <div className="post-caption">
            <strong>{post.username}</strong>{' '}
            <span>
              {expanded || caption.length <= 120
                ? caption
                : `${caption.slice(0, 120)}…`}
            </span>
            {caption.length > 120 && (
              <button className="caption-toggle" onClick={() => setExpanded(!expanded)}>
                {expanded ? ' less' : ' more'}
              </button>
            )}
          </div>
        )}
      </article>

      {/* ── Lightbox — rendered in document.body via Portal (fixes offset) ── */}
      {lightbox && (
        <LightboxPortal>
          <div
            className="lightbox-backdrop"
            onClick={() => setLightbox(false)}
            role="dialog"
            aria-modal="true"
            aria-label="Media viewer"
          >
            {/* Close button — always top right */}
            <button
              className="lightbox-close"
              onClick={() => setLightbox(false)}
              aria-label="Close"
            >
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none"
                   stroke="currentColor" strokeWidth="2.5">
                <path d="M18 6 6 18M6 6l12 12"/>
              </svg>
            </button>

            {/* Image lightbox */}
            {!isVideo && (
              <img
                src={imageUrl}
                alt={`Post by ${post.username}`}
                className="lightbox-image"
                onClick={e => e.stopPropagation()}
              />
            )}

            {/* Video lightbox */}
            {isVideo && post.media_url && (
              <video
                className="lightbox-video"
                poster={thumbUrl || undefined}
                controls
                autoPlay
                playsInline
                onClick={e => e.stopPropagation()}
              >
                <source src={proxyUrl(post.media_url)} type="video/mp4" />
              </video>
            )}

            {caption && (
              <p className="lightbox-caption" onClick={e => e.stopPropagation()}>
                <strong>{post.username}</strong> {caption}
              </p>
            )}
          </div>
        </LightboxPortal>
      )}
    </>
  );
}

export default PostCard;