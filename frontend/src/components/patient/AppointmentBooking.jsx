import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../../services/api';
import toast from 'react-hot-toast';
import PatientShell from './PatientShell';

const AppointmentBooking = () => {
  const navigate = useNavigate();
  const [therapists, setTherapists] = useState([]);
  const [loading, setLoading] = useState(true);
  const [form, setForm] = useState({
    therapist_id: '',
    appointment_date: '',
    start_time: '09:00',
    end_time: '10:00',
    type: 'follow-up',
    notes: ''
  });

  useEffect(() => {
    const loadTherapists = async () => {
      try {
        const res = await api.get('/patients/therapists');
        setTherapists(res.data || []);
      } catch (error) {
        toast.error('Could not load therapists');
      } finally {
        setLoading(false);
      }
    };

    loadTherapists();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await api.post('/patients/appointments', {
        ...form,
        therapist_id: Number(form.therapist_id)
      });
      toast.success('Appointment booked successfully');
      navigate('/patient/dashboard');
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to book appointment');
    }
  };

  return (
    <PatientShell title="Book Session" subtitle="Choose a therapist and reserve a time that works for you.">
      <div className="patient-form-card">
        <p className="page-kicker">Appointments</p>
        <h1 className="mt-2 page-title">Book a consultation</h1>
        <p className="page-subtitle">Choose a therapist and reserve a time that works for you.</p>

        <form onSubmit={handleSubmit} className="mt-8 grid gap-6 md:grid-cols-2">
          <label className="field-label md:col-span-2">
            <span className="mb-2 block">Select therapist</span>
            <select required value={form.therapist_id} onChange={(e) => setForm({ ...form, therapist_id: e.target.value })} className="form-control">
              <option value="">Choose a therapist</option>
              {therapists.map((therapist) => (
                <option key={therapist.id} value={therapist.id}>{therapist.full_name} / {therapist.specialization}</option>
              ))}
            </select>
          </label>

          <label className="field-label">
            <span className="mb-2 block">Date</span>
            <input required type="date" value={form.appointment_date} onChange={(e) => setForm({ ...form, appointment_date: e.target.value })} className="form-control" />
          </label>

          <label className="field-label">
            <span className="mb-2 block">Appointment type</span>
            <select value={form.type} onChange={(e) => setForm({ ...form, type: e.target.value })} className="form-control">
              <option value="initial">Initial consultation</option>
              <option value="follow-up">Follow-up</option>
              <option value="emergency">Emergency</option>
            </select>
          </label>

          <label className="field-label">
            <span className="mb-2 block">Start time</span>
            <input required type="time" value={form.start_time} onChange={(e) => setForm({ ...form, start_time: e.target.value })} className="form-control" />
          </label>

          <label className="field-label">
            <span className="mb-2 block">End time</span>
            <input required type="time" value={form.end_time} onChange={(e) => setForm({ ...form, end_time: e.target.value })} className="form-control" />
          </label>

          <label className="field-label md:col-span-2">
            <span className="mb-2 block">Notes</span>
            <textarea rows="4" value={form.notes} onChange={(e) => setForm({ ...form, notes: e.target.value })} className="form-control" placeholder="Share a short note for the therapist" />
          </label>

          <div className="flex justify-end md:col-span-2">
            <button type="submit" className="btn-primary" disabled={loading}>
              {loading ? 'Loading...' : 'Book appointment'}
            </button>
          </div>
        </form>
      </div>
    </PatientShell>
  );
};

export default AppointmentBooking;
