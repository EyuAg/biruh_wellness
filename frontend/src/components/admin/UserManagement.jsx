import React, { useEffect, useState } from 'react';
import api from '../../services/api';
import toast from 'react-hot-toast';
import AdminShell from './AdminShell';

const UserManagement = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);

  const loadUsers = async () => {
    try {
      const res = await api.get('/admin/users');
      setUsers(res.data || []);
    } catch (error) {
      toast.error('Could not load users');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadUsers();
  }, []);

  const updateRole = async (id, role) => {
    try {
      await api.put(`/admin/users/${id}/role`, { role });
      toast.success('Role updated');
      loadUsers();
    } catch (error) {
      toast.error('Role update failed');
    }
  };

  const toggleStatus = async (id, is_active) => {
    try {
      await api.put(`/admin/users/${id}/status`, { is_active });
      toast.success('User status updated');
      loadUsers();
    } catch (error) {
      toast.error('Status update failed');
    }
  };

  if (loading) return <AdminShell title="User Management" subtitle="Manage roles and accounts for the platform."><div style={{ padding: '32px', textAlign: 'center', color: 'var(--admin-ink-soft)' }}>Loading users...</div></AdminShell>;

  return (
    <AdminShell title="User Management" subtitle="Manage roles and accounts for the platform.">
      <div className="admin-card">
        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead>
              <tr style={{ background: 'var(--admin-bg)', borderBottom: '1px solid var(--admin-line)' }}>
                <th style={{ padding: '12px 16px', textAlign: 'left', fontSize: '12px', fontWeight: '900', textTransform: 'uppercase', letterSpacing: '0.14em', color: 'var(--admin-ink-soft)' }}>Name</th>
                <th style={{ padding: '12px 16px', textAlign: 'left', fontSize: '12px', fontWeight: '900', textTransform: 'uppercase', letterSpacing: '0.14em', color: 'var(--admin-ink-soft)' }}>Email</th>
                <th style={{ padding: '12px 16px', textAlign: 'left', fontSize: '12px', fontWeight: '900', textTransform: 'uppercase', letterSpacing: '0.14em', color: 'var(--admin-ink-soft)' }}>Role</th>
                <th style={{ padding: '12px 16px', textAlign: 'left', fontSize: '12px', fontWeight: '900', textTransform: 'uppercase', letterSpacing: '0.14em', color: 'var(--admin-ink-soft)' }}>Status</th>
              </tr>
            </thead>
            <tbody>
              {users.map((user) => (
                <tr key={user.id} style={{ borderBottom: '1px solid var(--admin-line)', transition: 'background 0.15s ease' }} onMouseEnter={(e) => e.currentTarget.style.background = 'var(--admin-teal-soft)'} onMouseLeave={(e) => e.currentTarget.style.background = 'transparent'}>
                  <td style={{ padding: '12px 16px', fontSize: '14px', fontWeight: '800', color: 'var(--admin-ink)' }}>{user.full_name}</td>
                  <td style={{ padding: '12px 16px', fontSize: '14px', color: 'var(--admin-ink-soft)' }}>{user.email}</td>
                  <td style={{ padding: '12px 16px', fontSize: '14px', color: 'var(--admin-ink)' }}>
                    <select value={user.role} onChange={(e) => updateRole(user.id, e.target.value)} style={{ padding: '8px 12px', border: '1px solid var(--admin-line)', borderRadius: '8px', background: '#fff', fontSize: '13px', fontWeight: '600', fontFamily: 'inherit', cursor: 'pointer' }}>
                      <option value="patient">Patient</option>
                      <option value="therapist">Therapist</option>
                      <option value="receptionist">Receptionist</option>
                      <option value="admin">Admin</option>
                    </select>
                  </td>
                  <td style={{ padding: '12px 16px', fontSize: '14px', color: 'var(--admin-ink)' }}>
                    <button onClick={() => toggleStatus(user.id, !user.is_active)} style={{ padding: '6px 12px', borderRadius: '999px', border: 'none', fontSize: '12px', fontWeight: '700', cursor: 'pointer', background: user.is_active ? 'var(--admin-teal-soft)' : '#fecaca', color: user.is_active ? 'var(--admin-teal)' : '#991b1b', textTransform: 'capitalize' }}>
                      {user.is_active ? 'Active' : 'Disabled'}
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </AdminShell>
  );
};

export default UserManagement;
