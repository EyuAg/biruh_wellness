import React from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { Bell, Calendar, Home, LogOut, FileText, Plane } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import BrandLogo from '../common/BrandLogo';
import './TherapistShell.css';

const navItems = [
  { label: 'Home', to: '/therapist/dashboard', icon: Home },
  { label: 'Schedule', to: '/therapist/schedule', icon: Calendar },
  { label: 'Session Notes', to: '/therapist/notes', icon: FileText },
  { label: 'Leave Request', to: '/therapist/leave', icon: Plane },
];

const initials = (name) => {
  if (!name) return 'T';
  return name
    .split(' ')
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0])
    .join('')
    .toUpperCase();
};

const TherapistShell = ({ title, subtitle, children }) => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const displayName = user?.full_name || 'Therapist';

  const handleLogout = async () => {
    await logout();
    navigate('/');
  };

  return (
    <div className="therapist-app">
      <header className="therapist-topbar">
        <div className="therapist-brand">
          <div className="therapist-brand-mark"><BrandLogo variant="mark" /></div>
          <div>
            <div className="therapist-brand-name">Biruh Wellness</div>
            <div className="therapist-brand-sub">Mental Health Clinic</div>
          </div>
        </div>
        <div className="therapist-topnav">
          <NavLink to="/">Home</NavLink>
          <NavLink to="/therapist/dashboard">Dashboard</NavLink>
        </div>
        <div className="therapist-topuser">
          <div className="therapist-pill">{displayName}</div>
          <button type="button" className="therapist-pill-outline" onClick={handleLogout}>
            <LogOut size={15} /> Logout
          </button>
        </div>
      </header>

      <div className="therapist-shell">
        <aside className="therapist-sidebar">
          <div>
            <div className="therapist-side-brand">
              <div className="therapist-side-square"><BrandLogo variant="mark" /></div>
              <div>
                <div className="therapist-side-title">Biruh</div>
                <div className="therapist-side-sub">Mental Health Clinic</div>
              </div>
            </div>
            <div className="therapist-role-tag">Therapist</div>
            <nav className="therapist-nav" aria-label="Therapist navigation">
              {navItems.map(({ label, to, icon: Icon }) => (
                <NavLink key={to} to={to} className={({ isActive }) => (isActive ? 'therapist-nav-item active' : 'therapist-nav-item')}>
                  <Icon size={18} />
                  {label}
                </NavLink>
              ))}
            </nav>
          </div>
          <button type="button" className="therapist-signout" onClick={handleLogout}>
            <LogOut size={17} />
            Sign out
          </button>
        </aside>

        <main className="therapist-main">
          <div className="therapist-page-head">
            <div>
              <h1 className="therapist-page-title">{title}</h1>
              {subtitle && <p className="therapist-page-sub">{subtitle}</p>}
            </div>
            <div className="therapist-head-actions">
              <button type="button" className="therapist-bell" aria-label="Notifications">
                <Bell size={17} />
                <span />
              </button>
              <div className="therapist-user-chip">
                <div className="therapist-avatar">{initials(displayName)}</div>
                <strong>{displayName}</strong>
              </div>
            </div>
          </div>
          {children}
        </main>
      </div>
    </div>
  );
};

export { initials };
export default TherapistShell;
