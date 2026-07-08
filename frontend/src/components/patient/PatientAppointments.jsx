import React, { useEffect, useState } from 'react';
import { Calendar, Clock } from 'lucide-react';
import { format } from 'date-fns';
import api from '../../services/api';
import Loading from '../common/Loading';
import PatientShell, { initials } from './PatientShell';

const formatDate = (date) => {
  if (!date) return 'Date pending';
  return format(new Date(date), 'MMM d, yyyy');
};

const statusLabel = (status) => {
  const labels = {
    scheduled: 'Scheduled',
    confirmed: 'Confirmed',
    in_progress: 'In progress',
    completed: 'Completed',
    cancelled: 'Cancelled',
    no_show: 'No show',
  };
  return labels[status] || status || 'Pending';
};

const PatientAppointments = () => {
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadAppointments = async () => {
      try {
        const res = await api.get('/patients/appointments');
        setAppointments(res.data || []);
      } catch (error) {
        console.error('Could not load appointments:', error);
      } finally {
        setLoading(false);
      }
    };

    loadAppointments();
  }, []);

  if (loading) return <Loading />;

  const sortedAppointments = [...appointments].sort((a, b) => new Date(b.appointment_date) - new Date(a.appointment_date));

  return (
    <PatientShell title="My Appointments" subtitle="Review upcoming and past care sessions.">
      <div className="patient-appointments-list">
        {sortedAppointments.length > 0 ? (
          sortedAppointments.map((appointment) => (
            <article className="patient-appointment-row" key={appointment.id || `${appointment.therapist_name}-${appointment.appointment_date}`}>
              <div className="patient-next-top" style={{ marginBottom: 0 }}>
                <div className="patient-avatar">{initials(appointment.therapist_name)}</div>
                <div>
                  <div className="patient-doc-name">{appointment.therapist_name || 'Assigned therapist'}</div>
                  <div className="patient-doc-spec">{appointment.service_type || appointment.type || 'Therapy session'}</div>
                  <div className="patient-meta-row" style={{ marginBottom: 0, marginTop: 10 }}>
                    <span className="patient-meta-item"><Calendar size={15} /> {formatDate(appointment.appointment_date)}</span>
                    <span className="patient-meta-item"><Clock size={15} /> {appointment.start_time || '09:00 AM'}</span>
                  </div>
                </div>
              </div>
              <div className="patient-status">{statusLabel(appointment.status)}</div>
            </article>
          ))
        ) : (
          <div className="patient-card">
            <div className="patient-empty-note">No appointments yet. Book a session to begin your care timeline.</div>
          </div>
        )}
      </div>
    </PatientShell>
  );
};

export default PatientAppointments;
