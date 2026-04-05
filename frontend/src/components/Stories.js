// src/components/Stories.js
import React, { useEffect, useState } from 'react';
import { apiBaseUrl } from '../config/api';

function proxyUrl(url) {
  if (!url) return null;
  return `${apiBaseUrl}/proxy/image?url=${encodeURIComponent(url)}`;
}

function Stories() {
  const [stories,  setStories]  = useState([]);
  const [loading,  setLoading]  = useState(true);
  const [active,   setActive]   = useState(null); // lightbox index

  useEffect(() => {
    fetch(`${apiBaseUrl}/stories`, { credentials: 'include' })
      .then(r => r.json())
      .then(data => {
        if (data.success) setStories(data.data.filter(s => s && s.media_type));
      })
      .catch(err => console.warn('[STORIES]', err.message))
      .finally(() => setLoading(false));
  }, []);

  // Don't render anything if no stories
  if (loading || !stories.length) return null;

  const current = active !== null ? stories[active] : null;
  const isVideo = current?.media_type === 'VIDEO';
  const mediaSrc = current
    ? proxyUrl(isVideo ? current.thumbnail_url : current.media_url)
    : null;

  return (
    <>
      {/* ── Stories Strip ── */}
      <div className="stories-strip" role="region" aria-label="Stories">
        {stories.map((story, i) => {
          const thumb = proxyUrl(
            story.media_type === 'VIDEO' ? story.thumbnail_url : story.media_url
          );
          return (
            <button
              key={story.id}
              className="story-bubble"
              onClick={() => setActive(i)}
              aria-label={`View story ${i + 1}`}
            >
              <div className="story-ring">
                <div className="story-thumb">
                  {thumb
                    ? <img src={thumb} alt="" loading="lazy" onError={e => e.target.style.display='none'} />
                    : <span className="story-thumb-fallback">📷</span>
                  }
                  {story.media_type === 'VIDEO' && (
                    <span className="story-video-badge">▶</span>
                  )}
                </div>
              </div>
              <span className="story-label">Story {i + 1}</span>
            </button>
          );
        })}
      </div>

      {/* ── Story Lightbox ── */}
      {active !== null && current && (
        <div
          className="story-backdrop"
          onClick={() => setActive(null)}
          role="dialog"
          aria-modal="true"
        >
          {/* Close */}
          <button
            className="lightbox-close"
            onClick={() => setActive(null)}
            aria-label="Close story"
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none"
                 stroke="currentColor" strokeWidth="2.5">
              <path d="M18 6 6 18M6 6l12 12"/>
            </svg>
          </button>

          {/* Prev */}
          {active > 0 && (
            <button
              className="story-nav story-nav-prev"
              onClick={e => { e.stopPropagation(); setActive(active - 1); }}
              aria-label="Previous story"
            >
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none"
                   stroke="currentColor" strokeWidth="2.5">
                <path d="M15 18l-6-6 6-6"/>
              </svg>
            </button>
          )}

          {/* Media */}
          <div className="story-media" onClick={e => e.stopPropagation()}>
            {isVideo
              ? <video
                  className="story-full-media"
                  src={proxyUrl(current.media_url)}
                  poster={proxyUrl(current.thumbnail_url) || undefined}
                  controls autoPlay playsInline
                />
              : <img
                  className="story-full-media"
                  src={mediaSrc}
                  alt={`Story ${active + 1}`}
                />
            }
            <div className="story-counter">{active + 1} / {stories.length}</div>
          </div>

          {/* Next */}
          {active < stories.length - 1 && (
            <button
              className="story-nav story-nav-next"
              onClick={e => { e.stopPropagation(); setActive(active + 1); }}
              aria-label="Next story"
            >
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none"
                   stroke="currentColor" strokeWidth="2.5">
                <path d="M9 18l6-6-6-6"/>
              </svg>
            </button>
          )}
        </div>
      )}
    </>
  );
}

export default Stories;