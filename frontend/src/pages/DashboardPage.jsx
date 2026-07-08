import React from 'react';
import { useAuth } from '../context/AuthContext';
import { Link } from 'react-router-dom';
import { ArrowRight, CalendarDays, ShieldCheck, Stethoscope, UserCircle2 } from 'lucide-react';

const DashboardPage = () => {
  const { user } = useAuth();

  const cards = [
    {
      title: 'Patient workspace',
      text: 'Book consultations, manage your profile, and review your care timeline.',
      link: '/patient/dashboard',
      icon: UserCircle2,
      role: 'patient'
    },
    {
      title: 'Therapist workspace',
      text: 'Coordinate your schedule, update notes, and follow each case closely.',
      link: '/therapist/dashboard',
      icon: Stethoscope,
      role: 'therapist'
    },
    {
      title: 'Admin console',
      text: 'Track appointments, manage users, and monitor clinic activity.',
      link: '/admin/dashboard',
      icon: ShieldCheck,
      role: 'admin'
    }
  ];

  return (
    <div className="page-wrap">
      <section className="hero-panel p-6 sm:p-8">
        <div className="flex flex-col gap-5 md:flex-row md:items-end md:justify-between">
          <div>
            <div className="flex items-center gap-3 text-[#c07dd4]">
              <CalendarDays className="h-6 w-6" />
              <p className="text-xs font-bold uppercase tracking-[0.24em]">Dashboard</p>
            </div>
            <h1 className="mt-4 text-3xl font-black tracking-tight sm:text-4xl">
              Welcome back, {user?.full_name || 'there'}.
            </h1>
            <p className="mt-3 max-w-2xl leading-7 text-[#e8d5f5]">
              Choose the workspace that matches your role and keep each care touchpoint moving.
            </p>
          </div>
          <div className="rounded-lg bg-white/10 px-4 py-3 ring-1 ring-white/15">
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[#c07dd4]">Signed in as</p>
            <p className="mt-1 font-bold capitalize text-white">{user?.role || 'team member'}</p>
          </div>
        </div>
      </section>

      <section className="mt-6 grid gap-5 md:grid-cols-3">
        {cards.map(({ title, text, link, icon: Icon, role }) => (
          <Link key={title} to={link} className="section-card group">
            <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-[#f5eefa] text-[#7c3aad] transition group-hover:bg-[#7c3aad] group-hover:text-white">
              <Icon className="h-6 w-6" />
            </div>
            <h2 className="mt-5 text-xl font-black text-[#3d1f52]">{title}</h2>
            <p className="mt-2 text-sm leading-6 text-[#6b5a7a]">{text}</p>
            <div className="mt-5 inline-flex items-center gap-2 text-sm font-bold text-[#7c3aad]">
              Open {role} workspace
              <ArrowRight className="h-4 w-4 transition group-hover:translate-x-1" />
            </div>
          </Link>
        ))}
      </section>
    </div>
  );
};

export default DashboardPage;
