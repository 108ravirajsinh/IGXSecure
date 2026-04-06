// src/components/Stories.js
import React, { useEffect, useState } from 'react';

const API = process.env.REACT_APP_API_BASE || '';

function Stories() {
  const [stories, setStories]   = useState([]);
  const [loading, setLoading]   = useState(true);
  const [selected, setSelected] = useState(null);
  const [error, setError]       = useState(null);

  useEffect(() => {
    fetch(`${API}/igxsecure/api/stories/insights`, { credentials: 'include' })
      .then(r => r.json())
      .then(data => {
        setStories(data.stories || []);
        setLoading(false);
      })
      .catch(() => {
        setError('Could not load stories');
        setLoading(false);
      });
  }, []);

  if (loading) return <div className="stories-loading">Loading stories…</div>;
  if (error)   return <div className="stories-error">{error}</div>;
  if (!stories.length) return <div className="stories-empty">No active stories</div>;

  return (
    <>
      {/* ── Story bubbles row ── */}
      <div className="stories-row">
        {stories.map(story => (
          <button
            key={story.id}
            className="story-bubble-wrap"
            onClick={() => setSelected(story)}
          >
            <div className="story-bubble">
              <img
                src={story.thumbnail_url || story.media_url}
                alt="story"
                className="story-thumb"
              />
            </div>

            {/* 👁 view count badge */}
            <div className="story-views">
              <svg width="11" height="11" viewBox="0 0 24 24" fill="none"
                   stroke="currentColor" strokeWidth="2.5">
                <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/>
                <circle cx="12" cy="12" r="3"/>
              </svg>
              <span>{story.insights?.reach ?? 0}</span>
            </div>
          </button>
        ))}
      </div>

      {/* ── Story viewer modal ── */}
      {selected && (
        <div className="story-modal-overlay" onClick={() => setSelected(null)}>
          <div className="story-modal" onClick={e => e.stopPropagation()}>
            <button className="story-modal-close" onClick={() => setSelected(null)}>✕</button>

            {selected.media_type === 'VIDEO' ? (
              <video src={selected.media_url} className="story-modal-media" controls autoPlay />
            ) : (
              <img src={selected.media_url} alt="story" className="story-modal-media" />
            )}

            {/* Insights panel */}
            <div className="story-insights-bar">
              <div className="story-insight-item">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none"
                     stroke="currentColor" strokeWidth="2">
                  <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/>
                  <circle cx="12" cy="12" r="3"/>
                </svg>
                <span>{selected.insights?.reach ?? 0} <em>Reach</em></span>
              </div>
              <div className="story-insight-item">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none"
                     stroke="currentColor" strokeWidth="2">
                  <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/>
                  <circle cx="12" cy="12" r="3"/>
                </svg>
                <span>{selected.insights?.impressions ?? 0} <em>Impressions</em></span>
              </div>
              <div className="story-insight-item">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none"
                     stroke="currentColor" strokeWidth="2">
                  <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/>
                </svg>
                <span>{selected.insights?.replies ?? 0} <em>Replies</em></span>
              </div>
            </div>

            <div className="story-modal-time">
              {new Date(selected.timestamp).toLocaleString()}
            </div>
          </div>
        </div>
      )}
    </>
  );
}

export default Stories;