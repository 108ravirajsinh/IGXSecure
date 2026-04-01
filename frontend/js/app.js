/* IGXSecure — Shared JS (Phase 1: static UI only) */

/* ── Navigation helpers ── */
const navigate = (page) => { window.location.href = page; };

/* ── Toast notification ── */
function showToast(message, duration = 3000) {
  let toast = document.getElementById('toast');
  if (!toast) {
    toast = document.createElement('div');
    toast.id = 'toast';
    toast.className = 'toast';
    document.body.appendChild(toast);
  }
  toast.textContent = message;
  toast.classList.add('show');
  setTimeout(() => toast.classList.remove('show'), duration);
}

/* ── Mock data (Phase 1 placeholder — replaced by API in Phase 5) ── */
const MOCK_POSTS = [
  {
    id: 1,
    user: 'alex_shoots',
    initial: 'A',
    caption: 'Golden hour never gets old. 🌅',
    time: '2h ago',
    likes: 142
  },
  {
    id: 2,
    user: 'minimal.life',
    initial: 'M',
    caption: 'Less noise. More focus. This is the feed you deserve.',
    time: '4h ago',
    likes: 89
  },
  {
    id: 3,
    user: 'urban_frames',
    initial: 'U',
    caption: 'Every street has a story. You just have to slow down.',
    time: '6h ago',
    likes: 203
  },
  {
    id: 4,
    user: 'quietmoments',
    initial: 'Q',
    caption: 'No ads. No suggestions. Just the people you chose to follow.',
    time: '8h ago',
    likes: 57
  }
];

const MOCK_STORIES = [
  { user: 'alex_shoots', initial: 'A', seen: false },
  { user: 'minimal.life', initial: 'M', seen: false },
  { user: 'urban_frames', initial: 'U', seen: true  },
  { user: 'quietmoments', initial: 'Q', seen: false },
  { user: 'northlight_co', initial: 'N', seen: true  },
  { user: 'rawcapture', initial: 'R', seen: false }
];

/* ── Render stories strip ── */
function renderStories(containerId) {
  const el = document.getElementById(containerId);
  if (!el) return;
  el.innerHTML = MOCK_STORIES.map(s => `
    <div class="story-item ${s.seen ? 'seen' : ''}">
      <div class="story-ring">
        <div class="avatar avatar-md">${s.initial}</div>
      </div>
      <span class="story-user">${s.user.length > 9 ? s.user.slice(0,8)+'…' : s.user}</span>
    </div>
  `).join('');
}

/* ── Render post feed ── */
function renderPosts(containerId) {
  const el = document.getElementById(containerId);
  if (!el) return;
  el.innerHTML = MOCK_POSTS.map(p => `
    <article class="post-card">
      <div class="post-header">
        <div class="avatar avatar-sm">${p.initial}</div>
        <span class="post-username">${p.user}</span>
        <span class="post-time">${p.time}</span>
      </div>
      <div class="post-image-placeholder">
        <div class="post-image-inner">
          <svg width="32" height="32" viewBox="0 0 24 24" fill="none"
               stroke="currentColor" stroke-width="1.5" opacity="0.3">
            <rect x="3" y="3" width="18" height="18" rx="3"/>
            <circle cx="8.5" cy="8.5" r="1.5"/>
            <path d="M21 15l-5-5L5 21"/>
          </svg>
          <span>Photo — connects in Phase 5</span>
        </div>
      </div>
      <div class="post-footer">
        <span class="post-likes">♥ ${p.likes}</span>
        <p class="post-caption"><strong>${p.user}</strong> ${p.caption}</p>
      </div>
    </article>
  `).join('');
}
