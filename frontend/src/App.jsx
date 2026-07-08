import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { Toaster } from 'react-hot-toast';

// Pages
import Home from './pages/Home';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import DashboardPage from './pages/DashboardPage';
import PatientDashboard from './components/patient/PatientDashboard';
import TherapistDashboard from './components/therapist/TherapistDashboard';
import AdminDashboard from './components/admin/AdminDashboard';
import AppointmentBooking from './components/patient/AppointmentBooking';
import PatientAppointments from './components/patient/PatientAppointments';
import PatientProfile from './components/patient/PatientProfile';
import ScheduleManager from './components/therapist/ScheduleManager';
import SessionNotes from './components/therapist/SessionNotes';
import SessionNotesList from './components/therapist/SessionNotesList';
import TherapistLeave from './components/therapist/TherapistLeave';
import UserManagement from './components/admin/UserManagement';
import AdminAuditLogs from './components/admin/AdminAuditLogs';

// Components
import PrivateRoute from './components/common/PrivateRoute';
import Navbar from './components/common/Navbar';
import Footer from './components/common/Footer';

function AppRoutes() {
  const location = useLocation();
  const isLandingPage = location.pathname === '/';
  const isRoleWorkspace = ['/patient', '/therapist', '/admin'].some((path) => location.pathname.startsWith(path));

  return (
    <div className="app-shell flex min-h-screen flex-col">
      {!isLandingPage && !isRoleWorkspace && <Navbar />}
      <main className="flex-grow">
        <Routes>
          {/* Public Routes */}
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />
          
          {/* Protected Routes */}
          <Route path="/dashboard" element={
            <PrivateRoute>
              <DashboardPage />
            </PrivateRoute>
          } />
          
          {/* Patient Routes */}
          <Route path="/patient/dashboard" element={
            <PrivateRoute allowedRoles={['patient']}>
              <PatientDashboard />
            </PrivateRoute>
          } />
          <Route path="/patient/book" element={
            <PrivateRoute allowedRoles={['patient']}>
              <AppointmentBooking />
            </PrivateRoute>
          } />
          <Route path="/patient/appointments" element={
            <PrivateRoute allowedRoles={['patient']}>
              <PatientAppointments />
            </PrivateRoute>
          } />
          <Route path="/patient/profile" element={
            <PrivateRoute allowedRoles={['patient']}>
              <PatientProfile />
            </PrivateRoute>
          } />
          
          {/* Therapist Routes */}
          <Route path="/therapist/dashboard" element={
            <PrivateRoute allowedRoles={['therapist']}>
              <TherapistDashboard />
            </PrivateRoute>
          } />
          <Route path="/therapist/schedule" element={
            <PrivateRoute allowedRoles={['therapist']}>
              <ScheduleManager />
            </PrivateRoute>
          } />
          <Route path="/therapist/notes/:appointmentId" element={
            <PrivateRoute allowedRoles={['therapist']}>
              <SessionNotes />
            </PrivateRoute>
          } />
          <Route path="/therapist/notes" element={
            <PrivateRoute allowedRoles={['therapist']}>
              <SessionNotesList />
            </PrivateRoute>
          } />
          <Route path="/therapist/leave" element={
            <PrivateRoute allowedRoles={['therapist']}>
              <TherapistLeave />
            </PrivateRoute>
          } />
          
          {/* Admin Routes */}
          <Route path="/admin/dashboard" element={
            <PrivateRoute allowedRoles={['admin']}>
              <AdminDashboard />
            </PrivateRoute>
          } />
          <Route path="/admin/users" element={
            <PrivateRoute allowedRoles={['admin']}>
              <UserManagement />
            </PrivateRoute>
          } />
          <Route path="/admin/audit-logs" element={
            <PrivateRoute allowedRoles={['admin']}>
              <AdminAuditLogs />
            </PrivateRoute>
          } />
          
          {/* 404 */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </main>
      {!isLandingPage && !isRoleWorkspace && <Footer />}
      <Toaster
        position="top-right"
        toastOptions={{
          duration: 4000,
          style: {
            background: '#14213d',
            color: '#fff',
            borderRadius: '10px',
            boxShadow: '0 18px 45px rgba(15, 23, 42, 0.16)',
          },
        }}
      />
    </div>
  );
}

function App() {
  return (
    <AuthProvider>
      <Router>
        <AppRoutes />
      </Router>
    </AuthProvider>
  );
}

export default App;
