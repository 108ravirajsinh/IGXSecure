import React from 'react';
import { Grid, MessageSquare, Settings } from 'lucide-react';

const navItems = [
  { view: 'feed', icon: Grid, label: 'Feed' },
  { view: 'messages', icon: MessageSquare, label: 'Messages' },
  { view: 'settings', icon: Settings, label: 'Settings' },
];

function AppNav({ activeView, onNavigate }) {
  return (
    <nav className="app-nav" aria-label="Main navigation">
      {navItems.map(({ view, icon: Icon, label }) => (
        <button
          key={view}
          type="button"
          className={`app-nav__item${activeView === view ? ' app-nav__item--active' : ''}`}
          onClick={() => onNavigate(view)}
          aria-label={label}
          aria-current={activeView === view ? 'page' : undefined}
        >
          <Icon size={22} className="app-nav__icon" />
          <span className="app-nav__label">{label}</span>
        </button>
      ))}
    </nav>
  );
}

export default AppNav;