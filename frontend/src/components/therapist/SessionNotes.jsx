import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import api from '../../services/api';
import toast from 'react-hot-toast';
import TherapistShell from './TherapistShell';

const SessionNotes = () => {
  const { appointmentId } = useParams();
  const navigate = useNavigate();
  const [form, setForm] = useState({
    subjective: '',
    objective: '',
    assessment: '',
    plan: '',
    mood_rating: 5,
    anxiety_rating: 3,
    sleep_quality: 3,
    appetite_status: 'normal',
    suicidal_ideation: false,
    self_harm: false
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await api.post(`/therapists/appointments/${appointmentId}/notes`, { ...form, appointment_id: Number(appointmentId) });
      toast.success('Session note saved');
      navigate('/therapist/dashboard');
    } catch (error) {
      toast.error(error.response?.data?.message || 'Could not save note');
    }
  };

  return (
    <TherapistShell title="Create Session Note" subtitle="Capture SOAP notes and risk indicators for this appointment.">
      <form onSubmit={handleSubmit} className="therapist-form-card" style={{ display: 'grid', gap: '24px' }}>
        <label style={{ display: 'flex', flexDirection: 'column' }}>
          <span style={{ marginBottom: '8px', fontSize: '14px', fontWeight: '600', color: 'var(--therapist-ink)' }}>Subjective</span>
          <textarea rows="3" value={form.subjective} onChange={(e) => setForm({ ...form, subjective: e.target.value })} style={{ padding: '10px 12px', border: '1px solid var(--therapist-line)', borderRadius: '8px', fontSize: '14px', fontFamily: 'inherit' }} />
        </label>
        <label style={{ display: 'flex', flexDirection: 'column' }}>
          <span style={{ marginBottom: '8px', fontSize: '14px', fontWeight: '600', color: 'var(--therapist-ink)' }}>Objective</span>
          <textarea rows="3" value={form.objective} onChange={(e) => setForm({ ...form, objective: e.target.value })} style={{ padding: '10px 12px', border: '1px solid var(--therapist-line)', borderRadius: '8px', fontSize: '14px', fontFamily: 'inherit' }} />
        </label>
        <label style={{ display: 'flex', flexDirection: 'column' }}>
          <span style={{ marginBottom: '8px', fontSize: '14px', fontWeight: '600', color: 'var(--therapist-ink)' }}>Assessment</span>
          <textarea rows="3" value={form.assessment} onChange={(e) => setForm({ ...form, assessment: e.target.value })} style={{ padding: '10px 12px', border: '1px solid var(--therapist-line)', borderRadius: '8px', fontSize: '14px', fontFamily: 'inherit' }} />
        </label>
        <label style={{ display: 'flex', flexDirection: 'column' }}>
          <span style={{ marginBottom: '8px', fontSize: '14px', fontWeight: '600', color: 'var(--therapist-ink)' }}>Plan</span>
          <textarea rows="3" value={form.plan} onChange={(e) => setForm({ ...form, plan: e.target.value })} style={{ padding: '10px 12px', border: '1px solid var(--therapist-line)', borderRadius: '8px', fontSize: '14px', fontFamily: 'inherit' }} />
        </label>

        <div style={{ display: 'grid', gap: '16px', gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))' }}>
          <label style={{ display: 'flex', flexDirection: 'column' }}>
            <span style={{ marginBottom: '8px', fontSize: '14px', fontWeight: '600', color: 'var(--therapist-ink)' }}>Mood rating (1-10)</span>
            <input type="number" min="1" max="10" value={form.mood_rating} onChange={(e) => setForm({ ...form, mood_rating: Number(e.target.value) })} style={{ padding: '10px 12px', border: '1px solid var(--therapist-line)', borderRadius: '8px', fontSize: '14px', fontFamily: 'inherit' }} />
          </label>
          <label style={{ display: 'flex', flexDirection: 'column' }}>
            <span style={{ marginBottom: '8px', fontSize: '14px', fontWeight: '600', color: 'var(--therapist-ink)' }}>Anxiety rating (1-10)</span>
            <input type="number" min="1" max="10" value={form.anxiety_rating} onChange={(e) => setForm({ ...form, anxiety_rating: Number(e.target.value) })} style={{ padding: '10px 12px', border: '1px solid var(--therapist-line)', borderRadius: '8px', fontSize: '14px', fontFamily: 'inherit' }} />
          </label>
        </div>

        <div style={{ display: 'flex', gap: '16px', flexWrap: 'wrap' }}>
          <label style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '8px 12px', border: '1px solid var(--therapist-line)', borderRadius: '8px', background: 'var(--therapist-bg)', fontSize: '13px', fontWeight: '600', color: 'var(--therapist-ink)', cursor: 'pointer' }}>
            <input type="checkbox" checked={form.suicidal_ideation} onChange={(e) => setForm({ ...form, suicidal_ideation: e.target.checked })} style={{ cursor: 'pointer' }} />
            Suicidal ideation
          </label>
          <label style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '8px 12px', border: '1px solid var(--therapist-line)', borderRadius: '8px', background: 'var(--therapist-bg)', fontSize: '13px', fontWeight: '600', color: 'var(--therapist-ink)', cursor: 'pointer' }}>
            <input type="checkbox" checked={form.self_harm} onChange={(e) => setForm({ ...form, self_harm: e.target.checked })} style={{ cursor: 'pointer' }} />
            Self-harm concerns
          </label>
        </div>

        <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '12px' }}>
          <button type="button" onClick={() => navigate('/therapist/dashboard')} style={{ padding: '10px 24px', background: 'transparent', border: '1.5px solid var(--therapist-line)', color: 'var(--therapist-ink-soft)', borderRadius: '8px', fontSize: '14px', fontWeight: '600', cursor: 'pointer' }}>Cancel</button>
          <button type="submit" style={{ padding: '10px 24px', background: 'linear-gradient(155deg, var(--therapist-plum), var(--therapist-plum-deep))', color: '#fff', borderRadius: '8px', border: 'none', fontSize: '14px', fontWeight: '600', cursor: 'pointer' }}>Save note</button>
        </div>
      </form>
    </TherapistShell>
  );
};

export default SessionNotes;
