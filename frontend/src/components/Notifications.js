import React, { useEffect, useState } from 'react';

const API = process.env.REACT_APP_API_BASE || '';

const TYPE_ICON = {
  like: (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor" stroke="none">
      <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5
               2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09
               C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5
               c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"/>
    </svg>
  ),
  comment: (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none"
         stroke="currentColor" strokeWidth="2.5">
      <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/>
    </svg>
  ),
};

function timeAgo(ts) {
  const diff = (Date.now() - new Date(ts)) / 1000;
  if (diff < 60)   return `${Math.floor(diff)}s ago`;
  if (diff < 3600) return `${Math.floor(diff / 60)}m ago`;
  if (diff < 86400)return `${Math.floor(diff / 3600)}h ago`;
  return `${Math.floor(diff / 86400)}d ago`;
}

function Notifications() {
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading]             = useState(true);
  const [error, setError]                 = useState(null);
  const [filter, setFilter]               = useState('all');

  useEffect(() => {
    fetch(`${API}/igxsecure/api/notifications`, { credentials: 'include' })
      .then(r => r.json())
      .then(data => {
        if (data.error) setError(data.error);
        else setNotifications(data.notifications || []);
        setLoading(false);
      })
      .catch(() => { setError('Could not load notifications'); setLoading(false); });
  }, []);

  const filtered = filter === 'all'
    ? notifications
    : notifications.filter(n => n.type === filter);

  return (
    <div className="notif-wrap">

      {/* ── Header ── */}
      <div className="notif-header">
        <span className="notif-title">Notifications</span>
        {notifications.length > 0 &&
          <span className="notif-badge">{notifications.length}</span>}
      </div>

      {/* ── Filter tabs ── */}
      <div className="notif-tabs">
        {['all', 'like', 'comment'].map(tab => (
          <button
            key={tab}
            className={`notif-tab ${filter === tab ? 'notif-tab-active' : ''}`}
            onClick={() => setFilter(tab)}
          >
            {tab === 'all' ? 'All' : tab === 'like' ? '❤️ Likes' : '💬 Comments'}
          </button>
        ))}
      </div>

      {/* ── List ── */}
      <div className="notif-list">
        {loading ? (
          <>
            {[1,2,3,4].map(i => (
              <div key={i} className="notif-skeleton">
                <div className="skeleton skeleton-avatar" />
                <div style={{ flex:1, display:'flex', flexDirection:'column', gap:'6px' }}>
                  <div className="skeleton skeleton-text" style={{ width:'70%' }} />
                  <div className="skeleton skeleton-text" style={{ width:'45%' }} />
                </div>
                <div className="skeleton" style={{ width:42, height:42, borderRadius:'var(--r-md)', flexShrink:0 }} />
              </div>
            ))}
          </>
        ) : error ? (
          <div className="notif-state notif-error">{error}</div>
        ) : filtered.length === 0 ? (
          <div className="notif-empty">
            <svg width="38" height="38" viewBox="0 0 24 24" fill="none"
                 stroke="currentColor" strokeWidth="1.5" opacity="0.25">
              <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"/>
              <path d="M13.73 21a2 2 0 0 1-3.46 0"/>
            </svg>
            <p>No {filter === 'all' ? '' : filter} notifications yet</p>
          </div>
        ) : (
          filtered.map(n => (
            <div key={n.id} className="notif-item">
              {/* Icon badge */}
              <div className={`notif-icon notif-icon-${n.type}`}>
                {TYPE_ICON[n.type]}
              </div>

              {/* Content */}
              <div className="notif-content">
                {n.type === 'like' && (
                  <p className="notif-text">
                    <strong>{n.text}</strong>
                    {n.caption && <> on "<em>{n.caption}</em>"</>}
                  </p>
                )}
                {n.type === 'comment' && (
                  <p className="notif-text">
                    <strong>@{n.username}</strong> commented: <em>"{n.text}"</em>
                  </p>
                )}
                <span className="notif-time">{timeAgo(n.timestamp)}</span>
              </div>

              {/* Post thumbnail */}
              {n.postThumb && (
                <img
                  src={`/igxsecure/api/proxy/image?url=${encodeURIComponent(n.postThumb)}`}
                  alt="post"
                  className="notif-thumb"
                />
              )}
            </div>
          ))
        )}
      </div>
    </div>
  );
}

export default Notifications;