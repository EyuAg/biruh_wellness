import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Calendar, Clock, FileText, Plus, User } from 'lucide-react';
import api from '../../services/api';
import { useAuth } from '../../context/AuthContext';
import { format } from 'date-fns';
import Loading from '../common/Loading';
import PatientShell, { initials } from './PatientShell';

const formatDate = (date, pattern = 'MMM d, yyyy') => {
  if (!date) return 'Date pending';
  return format(new Date(date), pattern);
};

const formatTime = (time) => time || '09:00 AM';

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

const PatientDashboard = () => {
  const { user } = useAuth();
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        const appointmentsRes = await api.get('/patients/appointments');
        setAppointments(appointmentsRes.data || []);
      } catch (error) {
        console.error('Error fetching dashboard data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

  if (loading) return <Loading />;

  const upcomingAppointments = appointments
    .filter((appointment) => appointment.status === 'scheduled' || appointment.status === 'confirmed')
    .sort((a, b) => new Date(a.appointment_date) - new Date(b.appointment_date));

  const pastAppointments = appointments
    .filter((appointment) => ['completed', 'cancelled', 'no_show'].includes(appointment.status))
    .sort((a, b) => new Date(b.appointment_date) - new Date(a.appointment_date));

  const nextAppointment = upcomingAppointments[0] || null;
  const displayName = user?.full_name || 'Patient';

  return (
    <PatientShell title="Dashboard" subtitle="Your care, all in one place.">
      <section className="patient-hero">
        <div className="patient-hero-eyebrow">Good morning</div>
        <div className="patient-hero-name">{displayName}</div>
        {nextAppointment ? (
          <div className="patient-hero-appt">
            <div className="patient-hero-appt-left">
              <div className="patient-avatar">{initials(nextAppointment.therapist_name)}</div>
              <div>
                <div className="patient-doc-name">{nextAppointment.therapist_name || 'Assigned therapist'}</div>
                <div className="patient-appt-time">
                  {formatDate(nextAppointment.appointment_date, 'EEE, MMM d')} / {formatTime(nextAppointment.start_time)}
                </div>
              </div>
            </div>
            <div className="patient-status">{statusLabel(nextAppointment.status)}</div>
          </div>
        ) : (
          <div className="patient-empty-note">No upcoming session yet. Book your next appointment when you are ready.</div>
        )}
      </section>

      <section className="patient-quick-grid" aria-label="Quick actions">
        <Link className="patient-quick-card" to="/patient/book">
          <div className="patient-quick-icon plum"><Plus size={24} /></div>
          <strong>Book Session</strong>
        </Link>
        <Link className="patient-quick-card" to="/patient/appointments">
          <div className="patient-quick-icon gold"><FileText size={24} /></div>
          <strong>View History</strong>
        </Link>
        <Link className="patient-quick-card" to="/patient/profile">
          <div className="patient-quick-icon teal"><User size={24} /></div>
          <strong>My Profile</strong>
        </Link>
      </section>

      <section className="patient-lower-grid">
        <article className="patient-card">
          <h2 className="patient-card-title">Next Appointment</h2>
          {nextAppointment ? (
            <>
              <div className="patient-next-top">
                <div className="patient-avatar">{initials(nextAppointment.therapist_name)}</div>
                <div>
                  <div className="patient-doc-name">{nextAppointment.therapist_name || 'Assigned therapist'}</div>
                  <div className="patient-doc-spec">{nextAppointment.service_type || 'Cognitive Behavioral Therapy'}</div>
                </div>
              </div>
              <div className="patient-meta-row">
                <div className="patient-meta-item">
                  <Calendar size={16} />
                  {formatDate(nextAppointment.appointment_date)}
                </div>
                <div className="patient-meta-item">
                  <Clock size={16} />
                  {formatTime(nextAppointment.start_time)}
                </div>
              </div>
              <div className="patient-countdown">
                <span>Status</span>
                <span>{statusLabel(nextAppointment.status)}</span>
              </div>
              <div className="patient-btn-row">
                <button type="button" className="patient-btn ghost">Cancel</button>
                <button type="button" className="patient-btn primary">Confirm</button>
              </div>
            </>
          ) : (
            <div className="patient-empty-note">Your next confirmed appointment will appear here.</div>
          )}
        </article>

        <article className="patient-card">
          <h2 className="patient-card-title">Recent Sessions</h2>
          {pastAppointments.length > 0 ? (
            <div className="patient-timeline">
              {pastAppointments.slice(0, 4).map((appointment) => (
                <div className="patient-timeline-item" key={appointment.id || `${appointment.therapist_name}-${appointment.appointment_date}`}>
                  <div className="patient-timeline-dot" />
                  <div className="patient-timeline-doc">{appointment.therapist_name || 'Therapist'}</div>
                  <div className="patient-timeline-meta">
                    {formatDate(appointment.appointment_date)} / {appointment.type === 'initial' ? 'Initial consultation' : 'Follow-up'}
                  </div>
                  <div className="patient-status">{statusLabel(appointment.status)}</div>
                </div>
              ))}
            </div>
          ) : (
            <div className="patient-empty-note">Future sessions will appear here as you complete them.</div>
          )}
        </article>
      </section>
    </PatientShell>
  );
};

export default PatientDashboard;
