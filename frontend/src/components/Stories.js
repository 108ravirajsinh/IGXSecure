import React, { useEffect, useState, useRef } from 'react';

const API = process.env.REACT_APP_API_BASE || '';

function Stories() {
  const [stories, setStories]   = useState([]);
  const [loading, setLoading]   = useState(true);
  const [selected, setSelected] = useState(null);
  const [selIdx, setSelIdx]     = useState(0);
  const [progress, setProgress] = useState(0);
  const [error, setError]       = useState(null);
  const progressRef             = useRef(null);
  const STORY_DURATION          = 5000; // ms per story

  useEffect(() => {
    fetch(`${API}/igxsecure/api/stories/insights`, { credentials: 'include' })
      .then(r => r.json())
      .then(data => { setStories(data.stories || []); setLoading(false); })
      .catch(() => { setError('Could not load stories'); setLoading(false); });
  }, []);

  // ── Progress bar timer ──
  useEffect(() => {
    if (!selected) return;
    setProgress(0);
    const start = Date.now();
    progressRef.current = setInterval(() => {
      const pct = Math.min(((Date.now() - start) / STORY_DURATION) * 100, 100);
      setProgress(pct);
      if (pct >= 100) {
        clearInterval(progressRef.current);
        // Auto advance to next story
        if (selIdx < stories.length - 1) {
          const next = selIdx + 1;
          setSelIdx(next);
          setSelected(stories[next]);
        } else {
          setSelected(null);
        }
      }
    }, 50);
    return () => clearInterval(progressRef.current);
  }, [selected?.id]);

  const openStory = (story, idx) => {
    setSelIdx(idx);
    setSelected(story);
  };

  const closeStory = () => {
    clearInterval(progressRef.current);
    setSelected(null);
    setProgress(0);
  };

  const goPrev = (e) => {
    e.stopPropagation();
    if (selIdx > 0) { setSelIdx(selIdx-1); setSelected(stories[selIdx-1]); }
  };

  const goNext = (e) => {
    e.stopPropagation();
    if (selIdx < stories.length - 1) { setSelIdx(selIdx+1); setSelected(stories[selIdx+1]); }
    else closeStory();
  };

  if (loading) return (
    <div className="stories-row">
      {[1,2,3].map(i => (
        <div key={i} className="story-bubble-wrap">
          <div className="skeleton" style={{ width:62, height:62, borderRadius:'50%' }} />
          <div className="skeleton skeleton-text" style={{ width:36, height:10 }} />
        </div>
      ))}
    </div>
  );

  if (error) return <div className="stories-error">{error}</div>;
  if (!stories.length) return (
    <div className="stories-empty">
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none"
           stroke="currentColor" strokeWidth="1.5" style={{ opacity:0.3 }}>
        <circle cx="12" cy="12" r="10"/>
        <circle cx="12" cy="12" r="4"/>
        <circle cx="17.5" cy="6.5" r="1" fill="currentColor" stroke="none"/>
      </svg>
      No active stories
    </div>
  );

  return (
    <>
      {/* ── Bubbles row ── */}
      <div className="stories-row">
        {stories.map((story, idx) => (
          <button key={story.id} className="story-bubble-wrap"
                  onClick={() => openStory(story, idx)}>
            <div className="story-ring">
              <div className="story-bubble">
                <img
                  src={`/igxsecure/api/proxy/image?url=${encodeURIComponent(
                    story.thumbnail_url || story.media_url)}`}
                  alt="story"
                  className="story-thumb"
                />
              </div>
            </div>
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

      {/* ── Story modal ── */}
      {selected && (
        <div className="story-modal-overlay" onClick={closeStory}>
          <div className="story-modal" onClick={e => e.stopPropagation()}>

            {/* Progress bars */}
            <div className="story-progress-row">
              {stories.map((s, i) => (
                <div key={s.id} className="story-progress-track">
                  <div
                    className="story-progress-fill"
                    style={{
                      width: i < selIdx ? '100%'
                           : i === selIdx ? `${progress}%`
                           : '0%'
                    }}
                  />
                </div>
              ))}
            </div>

            {/* Close */}
            <button className="story-modal-close" onClick={closeStory}>✕</button>

            {/* Prev / Next tap zones */}
            <button className="story-nav story-nav-prev" onClick={goPrev} />
            <button className="story-nav story-nav-next" onClick={goNext} />

            {/* Media */}
            {selected.media_type === 'VIDEO' ? (
              <video src={selected.media_url} className="story-modal-media"
                     autoPlay muted playsInline />
            ) : (
              <img
                src={`/igxsecure/api/proxy/image?url=${encodeURIComponent(
                  selected.media_url)}`}
                alt="story"
                className="story-modal-media"
              />
            )}

            {/* Insights bar */}
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