import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { ArrowRight, Lock, Mail, Phone, User } from 'lucide-react';
import BrandLogo from '../components/common/BrandLogo';

const RegisterPage = () => {
  const navigate = useNavigate();
  const { register } = useAuth();
  const [form, setForm] = useState({ full_name: '', email: '', phone: '', password: '', role: 'patient' });
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});

  const validateEmailForRole = (email, role) => {
    if (!email || !email.includes('@')) return false;
    const domain = email.toLowerCase().split('@')[1] || '';
    const blockedPatientDomains = ['biruhwellness.com', 'biruhwellness.org'];

    if (role === 'patient') {
      return !blockedPatientDomains.some((blockedDomain) => domain === blockedDomain || domain.endsWith(`.${blockedDomain}`));
    }
    if (role === 'therapist') return domain === 'biruhwellness.com';
    if (role === 'admin') return domain === 'biruhwellness.org';
    return false;
  };

  const validateForm = () => {
    const newErrors = {};
    if (!form.full_name || form.full_name.trim().length < 2) {
      newErrors.full_name = 'Full name must be at least 2 characters.';
    }
    if (!form.email || !/\S+@\S+\.\S+/.test(form.email)) {
      newErrors.email = 'Enter a valid email address.';
    } else if (!validateEmailForRole(form.email, form.role)) {
      newErrors.email = form.role === 'therapist'
        ? 'Therapist email must be @biruhwellness.com.'
        : form.role === 'admin'
          ? 'Admin email must be @biruhwellness.org.'
          : 'Patient email cannot use @biruhwellness.com or @biruhwellness.org.';
    }
    if (!form.phone || form.phone.trim().length < 10) {
      newErrors.phone = 'Phone number must be at least 10 digits.';
    }
    if (!form.password || form.password.length < 8) {
      newErrors.password = 'Password must be at least 8 characters.';
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    setLoading(true);
    const result = await register(form);
    setLoading(false);
    if (result.success) navigate('/dashboard');
  };

  return (
    <div className="page-wrap flex min-h-[calc(100vh-8rem)] items-center justify-center">
      <section className="panel mx-auto w-full max-w-2xl p-6 sm:p-8">
        <div className="text-center">
          <BrandLogo variant="stacked" className="mx-auto mb-5 w-36" />
          <p className="page-kicker">Create Account</p>
          <h1 className="mt-3 text-3xl font-black tracking-tight text-slate-950">Join Biruh Wellness</h1>
          <p className="mt-2 text-sm leading-6 text-slate-600">Choose your role and set up access to the platform.</p>
        </div>

        <form className="mt-8 grid gap-5 sm:grid-cols-2" onSubmit={handleSubmit}>
          <label className="field-label sm:col-span-2">
            <span className="mb-2 block">Full name</span>
            <div className="input-shell">
              <User className="h-4 w-4 text-[#c07dd4]" />
              <input required value={form.full_name} onChange={(e) => setForm({ ...form, full_name: e.target.value })} className="field-control" placeholder="Abebe Bekele" />
            </div>
          </label>

          <label className="field-label">
            <span className="mb-2 block">Email address</span>
            <div className="input-shell">
              <Mail className="h-4 w-4 text-[#c07dd4]" />
              <input type="email" required value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} className="field-control" placeholder="you@example.com" />
            </div>
          </label>

          <label className="field-label">
            <span className="mb-2 block">Phone</span>
            <div className="input-shell">
              <Phone className="h-4 w-4 text-[#c07dd4]" />
              <input required value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} className="field-control" placeholder="0912345678" />
            </div>
          </label>

          <label className="field-label">
            <span className="mb-2 block">Password</span>
            <div className="input-shell">
              <Lock className="h-4 w-4 text-[#c07dd4]" />
              <input type="password" required value={form.password} onChange={(e) => setForm({ ...form, password: e.target.value })} className="field-control" placeholder="At least 8 characters" />
            </div>
          </label>

          <label className="field-label">
            <span className="mb-2 block">Role</span>
            <select value={form.role} onChange={(e) => setForm({ ...form, role: e.target.value })} className="form-control">
              <option value="patient">Patient</option>
              <option value="therapist">Therapist</option>
              <option value="admin">Admin</option>
            </select>
            <p className="mt-2 text-xs text-slate-500">
              Therapist email must be <span className="font-semibold">@biruhwellness.com</span>.<br />
              Admin email must be <span className="font-semibold">@biruhwellness.org</span>.<br />
              Patient email cannot use <span className="font-semibold">@biruhwellness.com</span> or <span className="font-semibold">@biruhwellness.org</span>.
            </p>
          </label>

          {errors.email && <p className="sm:col-span-2 text-sm text-red-600">{errors.email}</p>}
          {errors.full_name && <p className="sm:col-span-2 text-sm text-red-600">{errors.full_name}</p>}
          {errors.phone && <p className="sm:col-span-2 text-sm text-red-600">{errors.phone}</p>}
          {errors.password && <p className="sm:col-span-2 text-sm text-red-600">{errors.password}</p>}

          <button type="submit" disabled={loading} className="btn-primary sm:col-span-2">
            {loading ? 'Creating account...' : 'Create account'}
            <ArrowRight className="h-4 w-4" />
          </button>
        </form>

        <p className="mt-6 text-center text-sm text-[#6b5a7a]">
          Already have an account? <Link to="/login" className="font-bold text-[#7c3aad] hover:text-[#6b2e92]">Sign in</Link>
        </p>
      </section>
    </div>
  );
};

export default RegisterPage;
