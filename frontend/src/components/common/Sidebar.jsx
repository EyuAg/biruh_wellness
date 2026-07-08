import React from 'react';
import { Link } from 'react-router-dom';
import { Home, Plus, Calendar, User, LogOut, FileText } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

const Sidebar = () => {
  const { user, logout } = useAuth();

  const handleLogout = async () => {
    await logout();
  };

  const role = user?.role || 'patient';

  const roleLabelMap = {
    patient: 'Patient',
    therapist: 'Therapist',
    admin: 'Admin'
  };

  const renderNav = () => {
    if (role === 'therapist') {
      return (
        <>
          <Link to="/therapist/dashboard" style={linkStyle}>
            <Home size={18} /> Home
          </Link>
          <Link to="/therapist/schedule" style={linkStyle}>
            <Calendar size={18} /> My Schedule
          </Link>
          <Link to="/therapist/notes" style={linkStyle}>
            <FileText size={18} /> Session Notes
          </Link>
          <Link to="/therapist/treatment-plans" style={linkStyle}>
            <Plus size={18} /> Treatment Plans
          </Link>
          <Link to="/therapist/leave" style={linkStyle}>
            <Calendar size={18} /> Leave Request
          </Link>
        </>
      );
    }

    if (role === 'admin') {
      return (
        <>
          <Link to="/admin/dashboard" style={linkStyle}>
            <Home size={18} /> Home
          </Link>
          <Link to="/admin/users" style={linkStyle}>
            <User size={18} /> User Management
          </Link>
          <Link to="/admin/settings" style={linkStyle}>
            <FileText size={18} /> Settings
          </Link>
        </>
      );
    }

    // default = patient
    return (
      <>
        <Link to="/patient/dashboard" style={linkStyle}>
          <Home size={18} /> Home
        </Link>
        <Link to="/patient/book" style={linkStyle}>
          <Plus size={18} /> Book Session
        </Link>
        <Link to="#" style={linkStyle}>
          <Calendar size={18} /> My Appointments
        </Link>
        <Link to="/patient/profile" style={linkStyle}>
          <User size={18} /> My Profile
        </Link>
      </>
    );
  };

  const linkStyle = {
    display: 'flex',
    alignItems: 'center',
    gap: '10px',
    padding: '10px 12px',
    borderRadius: '8px',
    color: '#6b7280',
    textDecoration: 'none',
    fontSize: '14px',
    fontWeight: '500'
  };

  return (
    <div style={{
      width: '264px',
      background: '#ffffff',
      color: '#111827',
      padding: '2rem 1rem',
      display: 'flex',
      flexDirection: 'column',
      borderRight: '1px solid #e6e9ee'
    }}>
      {/* Logo */}
      <div style={{ marginBottom: '2rem' }}>
        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: '8px',
          marginBottom: '0.5rem'
        }}>
          <div style={{
            width: '32px',
            height: '32px',
            borderRadius: '8px',
            background: '#7c3aad',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: '16px',
            fontWeight: 'bold',
            color: '#fff'
          }}>
            B
          </div>
          <div>
            <div style={{ fontSize: '14px', fontWeight: 'bold' }}>Biruh</div>
            <div style={{ fontSize: '11px', color: '#9b8aaa' }}>Wellness Center</div>
          </div>
        </div>
        <div style={{
          fontSize: '12px',
          color: '#6b21a8',
          fontWeight: '500',
          marginTop: '0.5rem'
        }}>{roleLabelMap[role]}</div>
      </div>

      {/* Navigation */}
      <nav style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
        {renderNav()}
      </nav>

      {/* Sign Out */}
      <button
        onClick={handleLogout}
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: '10px',
          padding: '10px 12px',
          borderRadius: '8px',
          background: 'transparent',
          color: '#6b7280',
          border: 'none',
          textDecoration: 'none',
          fontSize: '14px',
          fontWeight: '500',
          cursor: 'pointer'
        }}
      >
        <LogOut size={18} /> Sign out
      </button>
    </div>
  );
};

export default Sidebar;
