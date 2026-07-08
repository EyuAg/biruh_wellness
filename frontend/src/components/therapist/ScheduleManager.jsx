import React, { useEffect, useState } from 'react';
import api from '../../services/api';
import toast from 'react-hot-toast';
import TherapistShell from './TherapistShell';

const dayOptions = [
  { value: 0, label: 'Sunday' },
  { value: 1, label: 'Monday' },
  { value: 2, label: 'Tuesday' },
  { value: 3, label: 'Wednesday' },
  { value: 4, label: 'Thursday' },
  { value: 5, label: 'Friday' },
  { value: 6, label: 'Saturday' }
];

const ScheduleManager = () => {
  const [schedule, setSchedule] = useState([]);
  const [form, setForm] = useState({ day_of_week: 1, start_time: '09:00', end_time: '17:00' });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadSchedule = async () => {
      try {
        const res = await api.get('/therapists/schedule');
        setSchedule(res.data || []);
      } catch (error) {
        toast.error('Could not load schedule');
      } finally {
        setLoading(false);
      }
    };

    loadSchedule();
  }, []);

  const handleAddSlot = async (e) => {
    e.preventDefault();
    try {
      const updated = [...schedule, { ...form, day_of_week: Number(form.day_of_week) }];
      await api.put('/therapists/schedule', updated);
      setSchedule(updated);
      toast.success('Schedule updated');
    } catch (error) {
      toast.error(error.response?.data?.message || 'Could not save schedule');
    }
  };

  return (
    <TherapistShell title="Availability Schedule" subtitle="Set the weekly hours you are available for sessions.">
      <div>
        <div className="therapist-card">
          <form onSubmit={handleAddSlot} style={{ display: 'grid', gap: '24px', gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))', marginBottom: '32px' }}>
            <label style={{ display: 'flex', flexDirection: 'column' }}>
              <span style={{ marginBottom: '8px', fontSize: '14px', fontWeight: '600', color: 'var(--therapist-ink)' }}>Day</span>
              <select value={form.day_of_week} onChange={(e) => setForm({ ...form, day_of_week: e.target.value })} style={{ padding: '10px 12px', border: '1px solid var(--therapist-line)', borderRadius: '8px', fontSize: '14px', fontFamily: 'inherit' }}>
                {dayOptions.map((day) => <option key={day.value} value={day.value}>{day.label}</option>)}
              </select>
            </label>
            <label style={{ display: 'flex', flexDirection: 'column' }}>
              <span style={{ marginBottom: '8px', fontSize: '14px', fontWeight: '600', color: 'var(--therapist-ink)' }}>Start time</span>
              <input type="time" value={form.start_time} onChange={(e) => setForm({ ...form, start_time: e.target.value })} style={{ padding: '10px 12px', border: '1px solid var(--therapist-line)', borderRadius: '8px', fontSize: '14px', fontFamily: 'inherit' }} />
            </label>
            <label style={{ display: 'flex', flexDirection: 'column' }}>
              <span style={{ marginBottom: '8px', fontSize: '14px', fontWeight: '600', color: 'var(--therapist-ink)' }}>End time</span>
              <input type="time" value={form.end_time} onChange={(e) => setForm({ ...form, end_time: e.target.value })} style={{ padding: '10px 12px', border: '1px solid var(--therapist-line)', borderRadius: '8px', fontSize: '14px', fontFamily: 'inherit' }} />
            </label>
            <div style={{ display: 'flex', justifyContent: 'flex-end', gridColumn: 'span -1' }}>
              <button type="submit" style={{ padding: '10px 24px', background: 'linear-gradient(155deg, var(--therapist-plum), var(--therapist-plum-deep))', color: '#fff', borderRadius: '8px', border: 'none', fontSize: '14px', fontWeight: '600', cursor: 'pointer' }}>Save availability</button>
            </div>
          </form>

          <div style={{ marginTop: '32px' }}>
            <h2 style={{ fontSize: '18px', fontWeight: '800', color: 'var(--therapist-ink)', marginBottom: '16px' }}>Current schedule</h2>
            <div style={{ display: 'grid', gap: '12px' }}>
              {schedule.length === 0 ? (
                <div style={{ border: '1.5px dashed var(--therapist-line)', borderRadius: '12px', background: 'var(--therapist-bg)', padding: '20px', textAlign: 'center', color: 'var(--therapist-ink-soft)', fontSize: '14px' }}>
                  No availability has been added yet.
                </div>
              ) : (
                schedule.map((slot, index) => (
                  <div key={`${slot.day_of_week}-${index}`} style={{ border: '1px solid var(--therapist-line)', borderRadius: '12px', background: 'var(--therapist-bg)', padding: '16px', fontSize: '14px', fontWeight: '600', color: 'var(--therapist-ink)' }}>
                    {dayOptions.find((day) => day.value === Number(slot.day_of_week))?.label}: {slot.start_time} - {slot.end_time}
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      </div>
    </TherapistShell>
  );
};

export default ScheduleManager;
