import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import api from '../../services/api';
import toast from 'react-hot-toast';
import TherapistShell from './TherapistShell';
import Loading from '../common/Loading';

const SessionNotesList = () => {
  const [notes, setNotes] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      try {
        const res = await api.get('/therapists/notes');
        setNotes(res.data || []);
      } catch (err) {
        // Suppress toast to avoid modal pop-up when endpoint is missing or returns an error.
        // Log to console for debugging; page will show empty state instead.
        console.error('SessionNotesList load error:', err?.response?.data || err.message || err);
        setNotes([]);
      } finally {
        setLoading(false);
      }
    };
    load();
  }, []);

  if (loading) return <TherapistShell title="Session Notes" subtitle="Recent session notes and quick access to create new notes."><Loading /></TherapistShell>;

  return (
    <TherapistShell title="Session Notes" subtitle="Recent session notes and quick access to create new notes.">
      <section className="therapist-card">
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
          <h2 style={{ fontSize: '18px', fontWeight: '800', color: 'var(--therapist-ink)' }}>Session Notes</h2>
          <Link to="/therapist/schedule" style={{ padding: '8px 16px', background: 'linear-gradient(155deg, var(--therapist-plum), var(--therapist-plum-deep))', color: '#fff', borderRadius: '8px', textDecoration: 'none', fontSize: '14px', fontWeight: '600' }}>+ New Note</Link>
        </div>

        <div style={{ display: 'grid', gap: '12px' }}>
          {notes.length === 0 ? (
            <div style={{ border: '1.5px dashed var(--therapist-line)', borderRadius: '12px', background: 'var(--therapist-bg)', padding: '32px 20px', textAlign: 'center', fontWeight: '600', color: 'var(--therapist-ink-soft)' }}>No notes found.</div>
          ) : (
            notes.map((note) => (
              <article key={note.id} style={{ border: '1px solid var(--therapist-line)', borderRadius: '12px', padding: '16px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div>
                  <p style={{ fontWeight: '800', color: 'var(--therapist-ink)', marginBottom: '4px' }}>{note.patient_name} <span style={{ fontSize: '12px', fontWeight: '500', color: 'var(--therapist-ink-soft)' }}>Session #{note.session_number}</span></p>
                  <p style={{ marginTop: '4px', fontSize: '13px', color: 'var(--therapist-ink-soft)' }}>{note.excerpt}</p>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                  <span style={{ fontSize: '13px', color: 'var(--therapist-ink-soft)' }}>{note.date}</span>
                  <Link to={`/therapist/notes/${note.appointment_id}`} style={{ padding: '6px 12px', background: 'transparent', border: '1.5px solid var(--therapist-line)', color: 'var(--therapist-ink-soft)', borderRadius: '8px', textDecoration: 'none', fontSize: '13px', fontWeight: '600', cursor: 'pointer' }}>Open</Link>
                </div>
              </article>
            ))
          )}
        </div>
      </section>
    </TherapistShell>
  );
};

export default SessionNotesList;
