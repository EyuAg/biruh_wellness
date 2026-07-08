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
      <section
        className="dashboard-hero overflow-hidden rounded-[22px] p-11"
        style={{
          backgroundImage:
            'radial-gradient(ellipse 600px 300px at 85% -10%, rgba(201,161,90,0.16), transparent 60%), ' +
            'radial-gradient(ellipse 500px 400px at 100% 100%, rgba(148,87,201,0.25), transparent 60%), ' +
            'linear-gradient(135deg, #2a1642 0%, #3d1f5e 55%, #4A2470 100%)',
        }}
      >
        <div className="grid gap-10 lg:grid-cols-[minmax(0,1fr)_minmax(auto,320px)]">
          <div>
            <div className="inline-flex items-center gap-3 rounded-full border border-white/10 bg-white/10 px-4 py-2 text-xs font-semibold uppercase tracking-[0.22em] text-[#d9b8f5] shadow-[0_0_0_1px_rgba(255,255,255,0.06)] backdrop-blur-sm">
              <CalendarDays className="h-4 w-4" />
              Dashboard
            </div>
            <h1 className="mt-6 max-w-3xl text-4xl font-semibold leading-tight text-white sm:text-5xl">
              Welcome back, {user?.full_name || 'there'}.
            </h1>
            <p className="mt-5 max-w-2xl text-sm leading-7 text-[#d8cbe9]">
              Choose the workspace that matches your role and keep each care touchpoint moving.
            </p>
          </div>

          <div className="hero-badge rounded-[18px] border border-white/20 bg-white/10 p-6 text-left backdrop-blur-xl shadow-[0_24px_80px_-48px_rgba(255,255,255,0.45)] sm:p-7">
            <p className="text-[10.5px] font-semibold uppercase tracking-[0.15em] text-[#c9b6e0]">
              Signed in as
            </p>
            <p className="mt-3 inline-flex items-center gap-3 text-lg font-bold text-white sm:text-xl capitalize">
              <span className="inline-flex h-2.5 w-2.5 rounded-full bg-[#7ee787] shadow-[0_0_0_3px_rgba(126,231,135,0.25)]" />
              {user?.role || 'team member'}
            </p>
          </div>
        </div>
      </section>

      <section className="dashboard-cards mt-8 grid gap-6 lg:grid-cols-3">
        {cards.map(({ title, text, link, icon: Icon, role }) => {
          const roleStyles = {
            patient: 'bg-[#F3E9FC] text-[#7C3FB0]',
            therapist: 'bg-[#FBE9F5] text-[#B0439A]',
            admin: 'bg-[#ECEAFC] text-[#4A3FB0]',
          };

          return (
            <Link
              key={title}
              to={link}
              className="group overflow-hidden rounded-[18px] border border-[#e1d3f2] bg-white p-7 shadow-[0_1px_2px_rgba(237,228,245,0.8)] transition duration-200 hover:-translate-y-1 hover:shadow-[0_16px_32px_-12px_rgba(60,20,90,0.18)]"
            >
              <div className={`flex h-12 w-12 items-center justify-center rounded-[13px] ${roleStyles[role]} transition duration-200 group-hover:scale-[1.03]`}>
                <Icon className="h-6 w-6" />
              </div>
              <h2 className="mt-6 text-xl font-semibold text-[#1e1530]">{title}</h2>
              <p className="mt-3 text-sm leading-6 text-[#6b6280]">{text}</p>
              <div className="mt-6 inline-flex items-center gap-2 text-sm font-bold text-[#4a3fb0] transition group-hover:text-[#7c3fb0]">
                Open {role} workspace
                <ArrowRight className="h-4 w-4 transition duration-200 group-hover:translate-x-1" />
              </div>
            </Link>
          );
        })}
      </section>
    </div>
  );
};

export default DashboardPage;
