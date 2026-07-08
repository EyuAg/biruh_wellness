import React from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { Bell, FileText, Home, LogOut, Users } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import BrandLogo from '../common/BrandLogo';
import './AdminShell.css';

const navItems = [
  { label: 'Home', to: '/admin/dashboard', icon: Home },
  { label: 'Users', to: '/admin/users', icon: Users },
  { label: 'AuditLogs', to: '/admin/audit-logs', icon: FileText },
];

const initials = (name) => {
  if (!name) return 'A';
  return name
    .split(' ')
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0])
    .join('')
    .toUpperCase();
};

const AdminShell = ({ title, subtitle, children }) => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const displayName = user?.full_name || 'Admin';

  const handleLogout = async () => {
    await logout();
    navigate('/');
  };

  return (
    <div className="admin-app">
      <header className="admin-topbar">
        <div className="admin-brand">
          <div className="admin-brand-mark"><BrandLogo variant="mark" /></div>
          <div>
            <div className="admin-brand-name">Biruh Wellness</div>
            <div className="admin-brand-sub">Mental Health Clinic</div>
          </div>
        </div>
        <div className="admin-topnav">
          <NavLink to="/">Home</NavLink>
          <NavLink to="/admin/dashboard">Dashboard</NavLink>
        </div>
        <div className="admin-topuser">
          <div className="admin-pill">{displayName}</div>
          <button type="button" className="admin-pill-outline" onClick={handleLogout}>
            <LogOut size={15} /> Logout
          </button>
        </div>
      </header>

      <div className="admin-shell">
        <aside className="admin-sidebar">
          <div>
            <div className="admin-side-brand">
              <div className="admin-side-square"><BrandLogo variant="mark" /></div>
              <div>
                <div className="admin-side-title">Biruh</div>
                <div className="admin-side-sub">Mental Health Clinic</div>
              </div>
            </div>
            <div className="admin-role-tag">Admin</div>
            <nav className="admin-nav" aria-label="Admin navigation">
              {navItems.map(({ label, to, icon: Icon }) => (
                <NavLink key={to} to={to} className={({ isActive }) => (isActive ? 'admin-nav-item active' : 'admin-nav-item')}>
                  <Icon size={18} />
                  {label}
                </NavLink>
              ))}
            </nav>
          </div>
          <button type="button" className="admin-signout" onClick={handleLogout}>
            <LogOut size={17} />
            Sign out
          </button>
        </aside>

        <main className="admin-main">
          <div className="admin-page-head">
            <div>
              <h1 className="admin-page-title">{title}</h1>
              {subtitle && <p className="admin-page-sub">{subtitle}</p>}
            </div>
            <div className="admin-head-actions">
              <button type="button" className="admin-bell" aria-label="Notifications">
                <Bell size={17} />
                <span />
              </button>
              <div className="admin-user-chip">
                <div className="admin-avatar">{initials(displayName)}</div>
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
export default AdminShell;
