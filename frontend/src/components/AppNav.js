// frontend/src/components/AppNav.js
import React from 'react';
import { NavLink } from 'react-router-dom';
import { Grid, MessageSquare, Settings } from 'lucide-react';

const navItems = [
  { to: '/feed',     icon: Grid,          label: 'Feed'     },
  { to: '/messages', icon: MessageSquare, label: 'Messages' },
  { to: '/settings', icon: Settings,      label: 'Settings' },
];

function AppNav() {
  return (
    <nav className="app-nav" aria-label="Main navigation">
      {navItems.map(({ to, icon: Icon, label }) => (
        <NavLink
          key={to}
          to={to}
          className={({ isActive }) =>
            'app-nav__item' + (isActive ? ' app-nav__item--active' : '')
          }
        >
          <Icon size={22} className="app-nav__icon" />
          <span className="app-nav__label">{label}</span>
        </NavLink>
      ))}
    </nav>
  );
}

export default AppNav;