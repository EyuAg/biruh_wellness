import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { CalendarClock, FileText, UsersRound } from 'lucide-react';
import api from '../../services/api';
import toast from 'react-hot-toast';
import Loading from '../common/Loading';
import TherapistShell from './TherapistShell';

const TherapistDashboard = () => {
  const [profile, setProfile] = useState(null);
  const [appointments, setAppointments] = useState([]);
  const [caseload, setCaseload] = useState({});
  const [notes, setNotes] = useState([]);
  const [leaveRequests, setLeaveRequests] = useState([]);
  const [newRequest, setNewRequest] = useState({ from: '', to: '', reason: '' });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadData = async () => {
      try {
        const [profileRes, appointmentsRes, caseloadRes, notesRes, leaveRes] = await Promise.all([
          api.get('/therapists/profile'),
          api.get('/therapists/appointments'),
          api.get('/therapists/caseload'),
          api.get('/therapists/notes'),
          api.get('/therapists/leave-requests')
        ]);
        setProfile(profileRes.data);
        setAppointments(appointmentsRes.data || []);
        setCaseload(caseloadRes.data || {});
        setNotes(notesRes.data || []);
        setLeaveRequests(leaveRes.data || []);
      } catch (error) {
        toast.error('Could not load therapist workspace');
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, []);

  if (loading) return <Loading />;

  const metrics = [
    { label: 'Active appointments', value: appointments.length, icon: CalendarClock },
    { label: 'Patients in caseload', value: caseload.total_patients || 0, icon: UsersRound },
    { label: 'Session notes', value: caseload.total_notes || 0, icon: FileText }
  ];

  return (
    <TherapistShell title="Welcome, Therapist" subtitle="Review your caseload, upcoming sessions, and notes that need attention.">
      <section className="therapist-quick-grid" aria-label="Metrics">
        {metrics.map(({ label, value, icon: Icon }) => (
          <div key={label} className="therapist-card" style={{ padding: '20px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
              <p style={{ fontSize: '14px', fontWeight: '600', color: 'var(--therapist-ink-soft)' }}>{label}</p>
              <div style={{ display: 'flex', height: '40px', width: '40px', alignItems: 'center', justifyContent: 'center', borderRadius: '8px', background: 'var(--therapist-teal-soft)', color: 'var(--therapist-teal)' }}>
                <Icon style={{ height: '20px', width: '20px' }} />
              </div>
            </div>
            <p style={{ fontSize: '24px', fontWeight: '900', color: 'var(--therapist-ink)' }}>{value}</p>
          </div>
        ))}
      </section>

      <section className="therapist-card" style={{ marginTop: '26px' }}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', marginBottom: '20px', justifyContent: 'space-between' }}>
          <div>
            <p style={{ fontSize: '12px', fontWeight: '700', color: 'var(--therapist-teal)', textTransform: 'uppercase', letterSpacing: '0.06em' }}>Schedule</p>
            <h2 className="therapist-card-title">Upcoming appointments</h2>
          </div>
          <Link to="/therapist/schedule" style={{ alignSelf: 'flex-start', padding: '8px 16px', background: 'var(--therapist-plum)', color: '#fff', borderRadius: '8px', textDecoration: 'none', fontSize: '14px', fontWeight: '600' }}>Manage availability</Link>
        </div>
        <div style={{ display: 'grid', gap: '12px' }}>
          {appointments.length === 0 ? (
            <div style={{ border: '1.5px dashed var(--therapist-line)', borderRadius: '12px', background: 'var(--therapist-bg)', padding: '20px', textAlign: 'center', color: 'var(--therapist-ink-soft)', fontSize: '14px' }}>
              No appointments are currently scheduled.
            </div>
          ) : (
            appointments.map((appointment) => (
              <article key={appointment.id} style={{ border: '1px solid var(--therapist-line)', borderRadius: '12px', padding: '16px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div>
                  <p style={{ fontWeight: '800', color: 'var(--therapist-ink)', marginBottom: '4px' }}>{appointment.patient_name}</p>
                  <p style={{ fontSize: '13px', color: 'var(--therapist-ink-soft)' }}>{appointment.appointment_date} / {appointment.start_time} - {appointment.end_time}</p>
                </div>
                <span style={{ background: 'var(--therapist-teal-soft)', color: 'var(--therapist-teal)', padding: '6px 12px', borderRadius: '999px', fontSize: '12px', fontWeight: '700', textTransform: 'capitalize' }}>{appointment.status}</span>
              </article>
            ))
          )}
        </div>
      </section>

      <section className="therapist-card" style={{ marginTop: '26px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
          <div>
            <p style={{ fontSize: '12px', fontWeight: '700', color: 'var(--therapist-teal)', textTransform: 'uppercase', letterSpacing: '0.06em' }}>Session Notes</p>
            <h2 className="therapist-card-title">Session Notes</h2>
          </div>
          <button style={{ padding: '8px 16px', background: 'var(--therapist-plum)', color: '#fff', borderRadius: '8px', border: 'none', fontSize: '14px', fontWeight: '600', cursor: 'pointer' }} onClick={() => { /* future: open create note modal */ }}>
            + New Note
          </button>
        </div>
        <div style={{ display: 'grid', gap: '12px' }}>
          {notes.length === 0 ? (
            <div style={{ border: '1.5px dashed var(--therapist-line)', borderRadius: '12px', background: 'var(--therapist-bg)', padding: '20px', textAlign: 'center', color: 'var(--therapist-ink-soft)', fontSize: '14px' }}>
              No session notes yet.
            </div>
          ) : (
            notes.map((note) => (
              <article key={note.id} style={{ border: '1px solid var(--therapist-line)', borderRadius: '12px', padding: '16px', display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                <div>
                  <p style={{ fontWeight: '800', color: 'var(--therapist-ink)', marginBottom: '4px' }}>{note.patient_name}</p>
                  <p style={{ fontSize: '13px', color: 'var(--therapist-ink-soft)' }}>{note.excerpt || 'Encrypted note summary'}</p>
                </div>
                <div style={{ fontSize: '13px', color: 'var(--therapist-ink-soft)' }}>
                  {note.date} {note.time}
                </div>
              </article>
            ))
          )}
        </div>
      </section>

      <section className="therapist-card" style={{ marginTop: '26px' }}>
        <div>
          <p style={{ fontSize: '12px', fontWeight: '700', color: 'var(--therapist-teal)', textTransform: 'uppercase', letterSpacing: '0.06em' }}>Leave Request</p>
          <h2 className="therapist-card-title">Leave Request</h2>
        </div>
        <div style={{ border: '1px solid var(--therapist-line)', borderRadius: '12px', padding: '20px', marginTop: '16px' }}>
          <div style={{ display: 'grid', gap: '16px', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', marginBottom: '16px' }}>
            <input
              type="date"
              value={newRequest.from}
              onChange={(e) => setNewRequest({ ...newRequest, from: e.target.value })}
              style={{ padding: '10px 12px', border: '1px solid var(--therapist-line)', borderRadius: '8px', fontSize: '14px', fontFamily: 'inherit' }}
              placeholder="From Date"
            />
            <input
              type="date"
              value={newRequest.to}
              onChange={(e) => setNewRequest({ ...newRequest, to: e.target.value })}
              style={{ padding: '10px 12px', border: '1px solid var(--therapist-line)', borderRadius: '8px', fontSize: '14px', fontFamily: 'inherit' }}
              placeholder="To Date"
            />
          </div>
          <textarea
            value={newRequest.reason}
            onChange={(e) => setNewRequest({ ...newRequest, reason: e.target.value })}
            style={{ width: '100%', padding: '10px 12px', border: '1px solid var(--therapist-line)', borderRadius: '8px', fontSize: '14px', fontFamily: 'inherit', marginBottom: '16px', minHeight: '80px' }}
            placeholder="Describe the reason for your leave request..."
          />
          <div>
            <button
              style={{ padding: '10px 20px', background: 'var(--therapist-plum)', color: '#fff', borderRadius: '8px', border: 'none', fontSize: '14px', fontWeight: '600', cursor: 'pointer' }}
              onClick={async () => {
                try {
                  const res = await api.post('/therapists/leave-requests', newRequest);
                  setLeaveRequests([res.data, ...leaveRequests]);
                  setNewRequest({ from: '', to: '', reason: '' });
                  toast.success('Leave request submitted');
                } catch (err) {
                  toast.error('Could not submit leave request');
                }
              }}
            >
              Submit Request
            </button>
          </div>
        </div>

        <div style={{ display: 'grid', gap: '12px', marginTop: '20px' }}>
          {leaveRequests.length === 0 ? (
            <div style={{ border: '1.5px dashed var(--therapist-line)', borderRadius: '12px', background: 'var(--therapist-bg)', padding: '20px', textAlign: 'center', color: 'var(--therapist-ink-soft)', fontSize: '14px' }}>
              No leave requests.
            </div>
          ) : (
            leaveRequests.map((req) => (
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

export default TherapistDashboard;
