import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';

const RegisterForm = () => {
  const { register } = useAuth();
  const [form, setForm] = useState({ full_name: '', email: '', phone: '', password: '', role: 'patient' });

  const handleSubmit = async (e) => {
    e.preventDefault();
    await register(form);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <input value={form.full_name} onChange={(e) => setForm({ ...form, full_name: e.target.value })} className="form-control" placeholder="Full name" />
      <input value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} className="form-control" placeholder="Email" />
      <input value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} className="form-control" placeholder="Phone" />
      <input type="password" value={form.password} onChange={(e) => setForm({ ...form, password: e.target.value })} className="form-control" placeholder="Password" />
      <select value={form.role} onChange={(e) => setForm({ ...form, role: e.target.value })} className="form-control">
        <option value="patient">Patient</option>
        <option value="therapist">Therapist</option>
        <option value="admin">Admin</option>
      </select>
      <button type="submit" className="btn-primary w-full">Create account</button>
    </form>
  );
};

export default RegisterForm;
