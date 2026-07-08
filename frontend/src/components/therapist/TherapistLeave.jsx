import React, { useEffect, useState } from 'react';
import api from '../../services/api';
import toast from 'react-hot-toast';
import TherapistShell from './TherapistShell';
import Loading from '../common/Loading';

const TherapistLeave = () => {
  const [requests, setRequests] = useState([]);
  const [form, setForm] = useState({ from: '', to: '', reason: '' });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      try {
        const res = await api.get('/therapists/leave-requests');
        setRequests(res.data || []);
      } catch (err) {
        // Suppress toast to avoid modal pop-up when endpoint is missing or returns an error.
        // We'll show an empty state instead and log the error for debugging.
        console.error('TherapistLeave load error:', err?.response?.data || err.message || err);
        setRequests([]);
      } finally {
        setLoading(false);
      }
    };
    load();
  }, []);

  const handleSubmit = async () => {
    try {
      const res = await api.post('/therapists/leave-requests', form);
      setRequests([res.data, ...requests]);
      setForm({ from: '', to: '', reason: '' });
      toast.success('Leave request submitted');
    } catch (err) {
      toast.error('Could not submit leave request');
    }
  };

  if (loading) return <TherapistShell title="Leave Request" subtitle="Create a new leave request and view your past requests."><Loading /></TherapistShell>;

  return (
    <TherapistShell title="Leave Request" subtitle="Create a new leave request and view your past requests.">
      <section className="therapist-card">
        <div style={{ border: '1px solid var(--therapist-line)', borderRadius: '12px', padding: '20px', marginBottom: '20px' }}>
          <div style={{ display: 'grid', gap: '16px', gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))', marginBottom: '16px' }}>
            <input type="date" value={form.from} onChange={(e) => setForm({ ...form, from: e.target.value })} style={{ padding: '10px 12px', border: '1px solid var(--therapist-line)', borderRadius: '8px', fontSize: '14px', fontFamily: 'inherit' }} />
            <input type="date" value={form.to} onChange={(e) => setForm({ ...form, to: e.target.value })} style={{ padding: '10px 12px', border: '1px solid var(--therapist-line)', borderRadius: '8px', fontSize: '14px', fontFamily: 'inherit' }} />
          </div>
          <textarea value={form.reason} onChange={(e) => setForm({ ...form, reason: e.target.value })} style={{ width: '100%', padding: '10px 12px', border: '1px solid var(--therapist-line)', borderRadius: '8px', fontSize: '14px', fontFamily: 'inherit', marginBottom: '16px', minHeight: '80px' }} placeholder="Describe the reason for your leave request..." />
          <div>
            <button style={{ padding: '10px 24px', background: 'linear-gradient(155deg, var(--therapist-plum), var(--therapist-plum-deep))', color: '#fff', borderRadius: '8px', border: 'none', fontSize: '14px', fontWeight: '600', cursor: 'pointer' }} onClick={handleSubmit}>Submit Request</button>
          </div>
        </div>

        <div style={{ display: 'grid', gap: '12px' }}>
          {requests.length === 0 ? (
            <div style={{ border: '1.5px dashed var(--therapist-line)', borderRadius: '12px', background: 'var(--therapist-bg)', padding: '32px 20px', textAlign: 'center', fontWeight: '600', color: 'var(--therapist-ink-soft)' }}>No leave requests.</div>
          ) : (
            requests.map((req) => (
              <article key={req.id} style={{ border: '1px solid var(--therapist-line)', borderRadius: '12px', padding: '16px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div>
                  <p style={{ fontWeight: '800', color: 'var(--therapist-ink)', marginBottom: '4px' }}>{req.from} — {req.to}</p>
                  <p style={{ fontSize: '13px', color: 'var(--therapist-ink-soft)' }}>{req.reason}</p>
                </div>
                <span style={{ background: 'var(--therapist-teal-soft)', color: 'var(--therapist-teal)', padding: '6px 12px', borderRadius: '999px', fontSize: '12px', fontWeight: '700', textTransform: 'capitalize' }}>{req.status || 'Pending'}</span>
              </article>
            ))
          )}
        </div>
      </section>
    </TherapistShell>
  );
};

export default TherapistLeave;
