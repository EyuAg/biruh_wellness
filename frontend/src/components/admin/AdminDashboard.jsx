import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { CalendarCheck, DollarSign, UsersRound } from 'lucide-react';
import api from '../../services/api';
import Loading from '../common/Loading';
import AdminShell from './AdminShell';

const AdminDashboard = () => {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadStats = async () => {
      try {
        const res = await api.get('/admin/dashboard');
        setStats(res.data);
      } catch (error) {
        // Suppress toast to avoid intrusive popups when endpoint fails; log for debugging.
        console.error('AdminDashboard load error:', error?.response?.data || error.message || error);
        setStats({});
      } finally {
        setLoading(false);
      }
    };

    loadStats();
  }, []);

  if (loading) return <Loading />;

  const metrics = [
    { label: 'Appointments', value: stats?.appointments?.total_appointments || 0, icon: CalendarCheck },
    { label: 'Active users', value: stats?.users?.active || 0, icon: UsersRound },
    { label: 'Revenue', value: stats?.revenue?.total_revenue || 0, icon: DollarSign }
  ];

  return (
    <AdminShell title="Clinic Administration" subtitle="Monitor appointments, active users, and revenue from one place.">
      <section className="admin-quick-grid" aria-label="Metrics">
        {metrics.map(({ label, value, icon: Icon }) => (
          <div key={label} className="admin-card" style={{ padding: '20px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
              <p style={{ fontSize: '14px', fontWeight: '600', color: 'var(--admin-ink-soft)' }}>{label}</p>
              <div style={{ display: 'flex', height: '40px', width: '40px', alignItems: 'center', justifyContent: 'center', borderRadius: '8px', background: 'var(--admin-teal-soft)', color: 'var(--admin-teal)' }}>
                <Icon style={{ height: '20px', width: '20px' }} />
              </div>
            </div>
            <p style={{ fontSize: '24px', fontWeight: '900', color: 'var(--admin-ink)' }}>{value}</p>
          </div>
        ))}
      </section>

      <section className="admin-card" style={{ marginTop: '26px' }}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', marginBottom: '20px', justifyContent: 'space-between', alignItems: 'flex-start' }}>
          <div>
            <p style={{ fontSize: '12px', fontWeight: '700', color: 'var(--admin-teal)', textTransform: 'uppercase', letterSpacing: '0.06em' }}>Administration</p>
            <h2 className="admin-card-title">User Management</h2>
          </div>
          <Link to="/admin/users" style={{ padding: '8px 16px', background: 'var(--admin-plum)', color: '#fff', borderRadius: '8px', textDecoration: 'none', fontSize: '14px', fontWeight: '600' }}>
            Manage users
          </Link>
        </div>
      </section>
    </AdminShell>
  );
};

export default AdminDashboard;
