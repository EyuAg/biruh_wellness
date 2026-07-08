import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { ArrowRight, Lock, Mail } from 'lucide-react';
import BrandLogo from '../components/common/BrandLogo';

const LoginPage = () => {
  const navigate = useNavigate();
  const { login } = useAuth();
  const [form, setForm] = useState({ email: '', password: '' });
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    const result = await login(form.email, form.password);
    setLoading(false);
    if (result.success) navigate('/dashboard');
  };

  return (
    <div className="page-wrap flex min-h-[calc(100vh-8rem)] items-center justify-center">
      <section className="panel mx-auto w-full max-w-md p-6 sm:p-8">
        <div className="text-center">
          <BrandLogo variant="stacked" className="mx-auto mb-5 w-36" />
          <h2 className="mt-3 text-3xl font-black tracking-tight text-slate-950">Sign in</h2>
          <p className="mt-2 text-sm leading-6 text-slate-600">Enter your details to continue to your dashboard.</p>
        </div>

        <form className="mt-8 space-y-5" onSubmit={handleSubmit}>
          <label className="field-label">
            <span className="mb-2 block">Email address</span>
            <div className="input-shell">
              <Mail className="h-4 w-4 text-[#c07dd4]" />
              <input type="email" required value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} className="field-control" placeholder="you@example.com" />
            </div>
          </label>

          <label className="field-label">
            <span className="mb-2 block">Password</span>
            <div className="input-shell">
              <Lock className="h-4 w-4 text-[#c07dd4]" />
              <input type="password" required value={form.password} onChange={(e) => setForm({ ...form, password: e.target.value })} className="field-control" placeholder="Your password" />
            </div>
          </label>

          <button type="submit" disabled={loading} className="btn-primary w-full">
            {loading ? 'Signing in...' : 'Sign in'}
            <ArrowRight className="h-4 w-4" />
          </button>
        </form>

        <p className="mt-6 text-center text-sm text-[#6b5a7a]">
          New here? <Link to="/register" className="font-bold text-[#7c3aad] hover:text-[#6b2e92]">Create an account</Link>
        </p>
      </section>
    </div>
  );
};

export default LoginPage;
