import React, { useEffect, useMemo, useState } from 'react';
import { Download, Filter } from 'lucide-react';
import api from '../../services/api';
import AdminShell from './AdminShell';
import './AdminAuditLogs.css';

const formatAction = (action = '') => {
  const normalized = action?.toUpperCase() || 'ACTION';
  return normalized.replace(/_/g, ' ');
};

const formatTimestamp = (value) => {
  if (!value) return '—';
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return value;
  return date.toLocaleString();
};

const AdminAuditLogs = () => {
  const [logs, setLogs] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadLogs = async () => {
      try {
        const res = await api.get('/admin/audit');
        setLogs(res.data || []);
      } catch (error) {
        console.error('Audit log load error:', error?.response?.data || error.message || error);
        setLogs([]);
      } finally {
        setLoading(false);
      }
    };

    loadLogs();
  }, []);

  const summary = useMemo(() => ({
    total: logs.length,
    roles: logs.reduce((acc, log) => {
      const role = log.user_role || 'unknown';
      acc[role] = (acc[role] || 0) + 1;
      return acc;
    }, {})
  }), [logs]);

  return (
    <AdminShell title="Audit Logs" subtitle="Track administrative actions and platform activity." >
      <div className="audit-shell">
        <div className="audit-toolbar">
          <div className="audit-filters">
            <div className="audit-filter-chip">
              <Filter size={14} />
              Date range
            </div>
            <div className="audit-filter-chip">
              <Filter size={14} />
              Role
            </div>
            <div className="audit-filter-chip">
              <Filter size={14} />
              Action type
            </div>
          </div>
          <button type="button" className="audit-export">
            <Download size={15} />
            Export CSV
          </button>
        </div>

        {loading ? (
          <div className="audit-state">Loading audit logs…</div>
        ) : logs.length === 0 ? (
          <div className="audit-state">No audit activity has been recorded yet.</div>
        ) : (
          <div className="audit-card">
            <table className="audit-table">
              <thead>
                <tr>
                  <th>Timestamp</th>
                  <th>User</th>
                  <th>Role</th>
                  <th>Action</th>
                  <th>Resource</th>
                  <th>IP</th>
                </tr>
              </thead>
              <tbody>
                {logs.map((log) => (
                  <tr key={log.id}>
                    <td className="audit-muted">{formatTimestamp(log.created_at)}</td>
                    <td className="audit-user">{log.user_name || log.user_email || 'System'}</td>
                    <td>
                      <span className={`audit-badge ${log.user_role || 'unknown'}`}>
                        {log.user_role || 'Unknown'}
                      </span>
                    </td>
                    <td>
                      <span className={`audit-badge ${log.action?.toLowerCase().includes('delete') ? 'delete' : log.action?.toLowerCase().includes('update') ? 'update' : log.action?.toLowerCase().includes('view') ? 'view' : 'create'}`}>
                        {formatAction(log.action)}
                      </span>
                    </td>
                    <td>{log.table_name || '—'}</td>
                    <td className="audit-muted">{log.ip_address || '—'}</td>
                  </tr>
                ))}
              </tbody>
            </table>
            <div className="audit-footer">
              <div className="audit-muted">Showing {logs.length} of {summary.total} entries</div>
              <div className="audit-muted">Recent activity • {Object.entries(summary.roles).map(([role, count]) => `${role}: ${count}`).join(' • ')}</div>
            </div>
          </div>
        )}
      </div>
    </AdminShell>
  );
};

export default AdminAuditLogs;
