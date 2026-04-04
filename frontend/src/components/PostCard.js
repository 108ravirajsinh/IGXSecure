// src/components/PostCard.js
import React, { useState } from 'react';
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

function PostCard({ post }) {
  const [expanded,  setExpanded]  = useState(false);
  const [imgError,  setImgError]  = useState(false);
  const [lightbox,  setLightbox]  = useState(false);

  const isVideo  = post.media_type === 'VIDEO';
  const mediaUrl = proxyUrl(isVideo ? post.thumbnail_url : post.media_url);
  const initial  = post.username ? post.username.charAt(0).toUpperCase() : '?';
  const caption  = post.caption || '';

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

        {mediaUrl && !imgError && (
          <div
            className="post-image-wrapper"
            onClick={() => setLightbox(true)}
            role="button"
            tabIndex={0}
            aria-label="View full image"
            onKeyDown={e => e.key === 'Enter' && setLightbox(true)}
          >
            <img
              src={mediaUrl}
              alt={`Post by ${post.username}`}
              className="post-image"
              loading="lazy"
              width="600"
              height="600"
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

        {imgError && (
          <div className="post-image-wrapper post-image-error">
            <span>Image unavailable</span>
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

      {/* ── Lightbox ── */}
      {lightbox && (
        <div
          className="lightbox-backdrop"
          onClick={() => setLightbox(false)}
          role="dialog"
          aria-modal="true"
          aria-label="Full image view"
        >
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
          <img
            src={mediaUrl}
            alt={`Post by ${post.username}`}
            className="lightbox-image"
            onClick={e => e.stopPropagation()}
          />
          {caption && (
            <p className="lightbox-caption" onClick={e => e.stopPropagation()}>
              <strong>{post.username}</strong> {caption}
            </p>
          )}
        </div>
      )}
    </>
  );
}

export default PostCard;