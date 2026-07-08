import React from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { Bell, Calendar, Home, LogOut, Plus, User } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import BrandLogo from '../common/BrandLogo';
import './PatientShell.css';

const navItems = [
  { label: 'Home', to: '/patient/dashboard', icon: Home },
  { label: 'Book Session', to: '/patient/book', icon: Plus },
  { label: 'My Appointments', to: '/patient/appointments', icon: Calendar },
  { label: 'My Profile', to: '/patient/profile', icon: User },
];

const initials = (name) => {
  if (!name) return 'P';
  return name
    .split(' ')
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0])
    .join('')
    .toUpperCase();
};

const PatientShell = ({ title, subtitle, children }) => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const displayName = user?.full_name || 'Patient';

  const handleLogout = async () => {
    await logout();
    navigate('/');
  };

  return (
    <div className="patient-app">
      <header className="patient-topbar">
        <div className="patient-brand">
          <div className="patient-brand-mark"><BrandLogo variant="mark" /></div>
          <div>
            <div className="patient-brand-name">Biruh Wellness</div>
            <div className="patient-brand-sub">Mental Health Clinic</div>
          </div>
        </div>
        <div className="patient-topnav">
          <NavLink to="/">Home</NavLink>
          <NavLink to="/patient/dashboard">Dashboard</NavLink>
        </div>
        <div className="patient-topuser">
          <div className="patient-pill">{displayName}</div>
          <button type="button" className="patient-pill-outline" onClick={handleLogout}>
            <LogOut size={15} /> Logout
          </button>
        </div>
      </header>

      <div className="patient-shell">
        <aside className="patient-sidebar">
          <div>
            <div className="patient-side-brand">
              <div className="patient-side-square"><BrandLogo variant="mark" /></div>
              <div>
                <div className="patient-side-title">Biruh</div>
                <div className="patient-side-sub">Mental Health Clinic</div>
              </div>
            </div>
            <div className="patient-role-tag">Patient</div>
            <nav className="patient-nav" aria-label="Patient navigation">
              {navItems.map(({ label, to, icon: Icon }) => (
                <NavLink key={to} to={to} className={({ isActive }) => (isActive ? 'patient-nav-item active' : 'patient-nav-item')}>
                  <Icon size={18} />
                  {label}
                </NavLink>
              ))}
            </nav>
          </div>
          <button type="button" className="patient-signout" onClick={handleLogout}>
            <LogOut size={17} />
            Sign out
          </button>
        </aside>

        <main className="patient-main">
          <div className="patient-page-head">
            <div>
              <h1 className="patient-page-title">{title}</h1>
              {subtitle && <p className="patient-page-sub">{subtitle}</p>}
            </div>
            <div className="patient-head-actions">
              <button type="button" className="patient-bell" aria-label="Notifications">
                <Bell size={17} />
                <span />
              </button>
              <div className="patient-user-chip">
                <div className="patient-avatar">{initials(displayName)}</div>
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
export default PatientShell;
