import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import {
  Activity,
  ArrowRight,
  Brain,
  CalendarDays,
  Check,
  ClipboardList,
  HeartHandshake,
  Lock,
  Mail,
  ShieldCheck,
  Sparkles,
  Star,
  UsersRound,
} from 'lucide-react';
import Navbar from '../components/common/Navbar';
import Footer from '../components/common/Footer';
import drMichaelPhoto from '../assets/dr-michael-kefyalew.jpg';
import drTeferraPhoto from '../assets/dr-teferra-beyero.jpg';
import mekdesPhoto from '../assets/mekdes-mengiste.jpg';
import tigistPhoto from '../assets/tigist-fille.jpg';
import whyChoosePhoto from '../assets/biruh-why-photo.jpg';
import './Home.css';

const specialties = [
  { icon: Brain, name: 'CBT Therapy', count: '4 therapists' },
  { icon: HeartHandshake, name: 'Trauma Care', count: '3 therapists' },
  { icon: UsersRound, name: 'Family Therapy', count: '5 therapists' },
  { icon: Activity, name: 'Anxiety Support', count: '6 therapists' },
  { icon: ClipboardList, name: 'Progress Plans', count: 'Secure notes' },
];

const checks = [
  'Licensed therapists and supervised care',
  'Private session notes with encrypted records',
  'Online appointment booking and reminders',
  'Care available in Amharic and English',
];

const tabs = [
  {
    id: 'treatment',
    label: 'Treatment Plans',
    title: 'Care plans that stay organized',
    copy: 'Therapists can document goals, session notes, medication context, and progress in one secure place.',
    points: ['Progress notes after every session', 'Treatment goals visible over time', 'Patient history available to assigned care team'],
  },
  {
    id: 'security',
    label: 'Privacy',
    title: 'Built for confidential care',
    copy: 'Role-based access, encrypted clinical records, and audit logs help protect sensitive patient information.',
    points: ['JWT authentication', 'AES-256 clinical note encryption', 'Role-based dashboards for every user'],
  },
  {
    id: 'booking',
    label: 'Booking',
    title: 'Simple scheduling without double-booking',
    copy: 'Patients can browse availability while therapists manage weekly schedules and unavailable dates.',
    points: ['Real-time therapist slots', 'Conflict checks before confirmation', 'Automated email reminders'],
  },
];

const services = [
  { icon: CalendarDays, title: 'Online Booking', text: 'Browse therapist availability and request your session in minutes.' },
  { icon: Lock, title: 'Encrypted Records', text: 'Clinical notes are protected and restricted to assigned care roles.' },
  { icon: Activity, title: 'Progress Tracking', text: 'Track session history, care plans, and wellness progress over time.' },
  { icon: Mail, title: 'Email Reminders', text: 'Receive appointment reminders so care stays consistent.' },
];

const therapists = [
  { initials: 'TB', name: 'Dr. Teferra Beyero', specialty: 'Cognitive Behavioral Therapist', tags: ['CBT', 'Anxiety'], tone: 'purple', photo: drTeferraPhoto },
  { initials: 'MK', name: 'Dr. Michael Kefyalew', specialty: 'Trauma and PTSD Specialist', tags: ['Trauma', 'PTSD'], tone: 'green', photo: drMichaelPhoto },
  { initials: 'MM', name: 'Mekdes Mengiste', specialty: 'Family and Couples Therapist', tags: ['Family', 'Couples'], tone: 'blue', photo: mekdesPhoto },
  { initials: 'TF', name: 'Tigist Fille', specialty: 'Depression and Mood Disorders', tags: ['Depression', 'Mood'], tone: 'amber', photo: tigistPhoto },
];

const testimonials = [
  {
    initials: 'JC',
    name: 'Jemila Challa',
    role: 'Patient, Addis Ababa',
    text: 'My therapist came through in a difficult time. The scheduled appointments, professional notes, and discretion made me feel safe.',
  },
  {
    initials: 'BH',
    name: 'Biruk Haile',
    role: 'Patient, Addis Ababa',
    text: 'Booking my first session was easy. I found an available therapist the same week and the experience felt calm from the start.',
  },
  {
    initials: 'DT',
    name: 'Dr. Tigist Bekele',
    role: 'Therapist, Biruh Wellness',
    text: 'The session notes and schedule tools help me track progress clearly while patients stay confident in the platform.',
  },
];

const Home = () => {
  const [activeTab, setActiveTab] = useState(tabs[0].id);
  const currentTab = tabs.find((tab) => tab.id === activeTab) || tabs[0];

  useEffect(() => {
    const revealGroups = [
      '.landing-specialties',
      '.landing-why__visual',
      '.landing-section__copy',
      '.landing-stats',
      '.landing-tabs__header',
      '.landing-tabbar',
      '.landing-tabcontent',
      '.landing-band',
      '.landing-service-grid',
      '.landing-service',
      '.landing-appointment__panel',
      '.landing-form',
      '.landing-therapist',
      '.landing-testimonial',
      '.landing-footer',
    ];

    const elements = Array.from(document.querySelectorAll(revealGroups.join(',')));

    elements.forEach((element, index) => {
      const groupIndex = Number(element.dataset.revealGroupIndex || index);
      element.classList.add('landing-reveal');
      element.style.setProperty('--reveal-delay', `${Math.min(groupIndex % 6, 5) * 70}ms`);
    });

    document.querySelectorAll('.landing-why__visual, .landing-service-grid, .landing-appointment__panel').forEach((element) => {
      element.classList.add('landing-reveal--from-left');
    });

    document.querySelectorAll('.landing-section__copy, .landing-form, .landing-feature-card').forEach((element) => {
      element.classList.add('landing-reveal--from-right');
    });

    document.querySelectorAll('.landing-stats, .landing-band').forEach((element) => {
      element.classList.add('landing-reveal--scale');
    });

    document.querySelectorAll('.landing-specialty').forEach((element, index) => {
      element.classList.add('landing-reveal', 'landing-reveal--lift');
      element.style.setProperty('--reveal-delay', `${index * 70}ms`);
    });

    if (!('IntersectionObserver' in window)) {
      elements.forEach((element) => element.classList.add('is-visible'));
      document.querySelectorAll('.landing-specialty').forEach((element) => element.classList.add('is-visible'));
      return undefined;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('is-visible');
          } else {
            entry.target.classList.remove('is-visible');
          }
        });
      },
      { rootMargin: '-8% 0px -16% 0px', threshold: 0.12 }
    );

    document.querySelectorAll('.landing-reveal').forEach((element) => observer.observe(element));

    return () => observer.disconnect();
  }, []);

  return (
    <div className="landing-page">
      <Navbar />

      <main>
        <section
          className="landing-hero"
          style={{ '--hero-bg-image': `url(${process.env.PUBLIC_URL}/images/hero_bg.png)` }}
        >
          <div className="landing-hero__content">
            <p className="landing-eyebrow">Addis Ababa mental wellness clinic</p>
            <h1>Your <span>mind</span>  deserves care, clarity, and steady support.</h1>
            <p className="landing-hero__lead">
              Biruh Wellness Center connects patients with licensed therapists for confidential,
              professional mental health care on a schedule that fits real life.
            </p>
            <div className="landing-hero__actions">
              <Link to="/register" className="landing-button landing-button--primary">
                Book your first session <ArrowRight size={17} />
              </Link>
              <a href="#therapists" className="landing-button landing-button--ghost">Meet therapists</a>
            </div>
          </div>

        </section>

        <section className="landing-specialties" id="services" aria-label="Therapy specialties">
          {specialties.map(({ icon: Icon, name, count }) => (
            <a href="#appointment" className="landing-specialty" key={name}>
              <span><Icon size={24} /></span>
              <strong>{name}</strong>
              <small>{count}</small>
            </a>
          ))}
        </section>

        <section className="landing-section landing-why" id="about">
          <div className="landing-why__visual">
            <img src={whyChoosePhoto} alt="Biruh Wellness clinical staff attending a training session" />
            <div className="landing-years">
              <strong>12+</strong>
              <span>licensed therapists</span>
            </div>
          </div>
          <div className="landing-section__copy">
            <p className="landing-eyebrow">Why choose Biruh</p>
            <h2>Compassionate therapy with a secure digital care platform.</h2>
            <p>
              Patients, therapists, and administrators each get the tools they need:
              booking, schedules, clinical notes, profile management, and clear care history.
            </p>
            <div className="landing-checks">
              {checks.map((item) => (
                <span key={item}><Check size={16} /> {item}</span>
              ))}
            </div>
            <Link to="/register" className="landing-button landing-button--primary">Start registration</Link>
          </div>
        </section>

        <section className="landing-stats" aria-label="Clinic statistics">
          <div><strong>12+</strong><span>Licensed therapists</span></div>
          <div><strong>800+</strong><span>Sessions completed</span></div>
          <div><strong>95%</strong><span>Patient satisfaction</span></div>
          <div><strong>100%</strong><span>Confidential records</span></div>
        </section>

        <section className="landing-section landing-tabs">
          <div className="landing-tabs__header">
            <p className="landing-eyebrow">Platform features</p>
            <h2>Everything needed for coordinated mental health care.</h2>
          </div>
          <div className="landing-tabbar" role="tablist" aria-label="Landing feature tabs">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                type="button"
                className={activeTab === tab.id ? 'is-active' : ''}
                onClick={() => setActiveTab(tab.id)}
              >
                {tab.label}
              </button>
            ))}
          </div>
          <div className="landing-tabcontent">
            <div>
              <h3>{currentTab.title}</h3>
              <p>{currentTab.copy}</p>
              <ul>
                {currentTab.points.map((point) => <li key={point}>{point}</li>)}
              </ul>
            </div>
            {currentTab.id === 'treatment' ? (
              <div className="landing-feature-photo">
                <img src="/images/treatment-plans.avif" alt="Therapist and patient discussing a care plan" />
              </div>
            ) : (
              <div className="landing-feature-card">
                <ShieldCheck size={42} />
                <strong>{currentTab.label}</strong>
                <span>Ready inside the Biruh Wellness platform</span>
              </div>
            )}
          </div>
        </section>

        <section className="landing-band">
          <div>
            <h2>Experienced therapists in every specialty.</h2>
            <p>Warm, responsible mental health care for patients across Addis Ababa and beyond.</p>
          </div>
          <a href="#appointment" className="landing-button landing-button--warm">Make an appointment</a>
        </section>

        <section className="landing-section landing-services" aria-label="Patient online services">
          <div className="landing-services-grid">
            <div className="landing-services-cards">
              {services.map(({ icon: Icon, title, text }) => (
                <article className={`landing-service-card${title === 'Encrypted Records' ? ' landing-service-card--featured' : ''}`} key={title}>
                  <span className="landing-service-icon"><Icon size={20} /></span>
                  <h3>{title}</h3>
                  <p>{text}</p>
                </article>
              ))}
            </div>

            <div className="landing-services-copy">
              <p className="landing-eyebrow"><span className="landing-service-eyebrow-mark"></span>Patient online services</p>
              <h2>Manage your care <em>from anywhere.</em></h2>
              <p>
                Book, review, and manage your full therapy journey in one secure place,
                with therapist availability and appointment history always close at hand.
              </p>
              <div className="landing-cta-row">
                <Link to="/register" className="landing-button landing-button--primary">Create patient account</Link>
                <a href="#about" className="landing-link-secondary">
                  See how it works
                  <ArrowRight size={16} />
                </a>
              </div>
            </div>
          </div>
        </section>

        <section className="landing-section landing-appointment" id="appointment">
          <div className="landing-appointment__panel">
            <img src="/images/photo-1653130892581-7c0ae1f4e8e0.png" alt="Wellness journey - professional mental health care" />
          </div>

          <form className="landing-form">
            <p className="landing-eyebrow">Book a session</p>
            <h2>Make an appointment.</h2>
            <p>Send your details and a care coordinator will confirm your session.</p>
            <div className="landing-form__row">
              <label>First name<input type="text" placeholder="Mekdes" /></label>
              <label>Last name<input type="text" placeholder="Alemu" /></label>
            </div>
            <label>Email address<input type="email" placeholder="mekdes@example.com" /></label>
            <div className="landing-form__row">
              <label>Phone number<input type="tel" placeholder="+251 911 ..." /></label>
              <label>
                Preferred therapist
                <select defaultValue="Any available therapist">
                  <option>Any available therapist</option>
                  <option>Dr. Tigist Bekele - CBT</option>
                  <option>Dr. Mekdes Alemu - Trauma</option>
                  <option>Dr. Samuel Asfaw - Family</option>
                </select>
              </label>
            </div>
            <label>What brings you here?<textarea placeholder="Briefly describe what you would like support with..." /></label>
            <button type="button" className="landing-button landing-button--primary">Submit appointment request</button>
          </form>
        </section>

        <section className="landing-section landing-therapists" id="therapists">
          <div className="landing-tabs__header">
            <p className="landing-eyebrow">Our team</p>
            <h2>Meet our therapists.</h2>
            <p>Licensed, experienced, and dedicated to compassionate mental health support.</p>
          </div>
          <div className="landing-therapist-grid">
            {therapists.map((therapist) => (
              <article className="landing-therapist" key={therapist.name}>
                <div className={`landing-therapist__photo landing-therapist__photo--${therapist.tone}`}>
                  <img src={therapist.photo} alt={therapist.name} />
                </div>
                <div>
                  <h3>{therapist.name}</h3>
                  <p>{therapist.specialty}</p>
                  <div>{therapist.tags.map((tag) => <span key={tag}>{tag}</span>)}</div>
                  <div className="landing-stars" aria-label="Five star rating">
                    {[1, 2, 3, 4, 5].map((item) => <Star key={item} size={14} fill="currentColor" />)}
                  </div>
                  <a href="#appointment">Book appointment</a>
                </div>
              </article>
            ))}
          </div>
        </section>

        <section className="landing-section landing-testimonials">
          <div className="landing-tabs__header">
            <p className="landing-eyebrow">Patient testimonials</p>
            <h2>What patients and clinicians say.</h2>
          </div>
          <div className="landing-testimonial-grid">
            {testimonials.map((testimonial) => (
              <article className="landing-testimonial" key={testimonial.name}>
                <div className="landing-stars">
                  {[1, 2, 3, 4, 5].map((item) => <Star key={item} size={14} fill="currentColor" />)}
                </div>
                <p>"{testimonial.text}"</p>
                <div className="landing-testimonial__author">
                  <div className="landing-avatar">{testimonial.initials}</div>
                  <span><strong>{testimonial.name}</strong><small>{testimonial.role}</small></span>
                </div>
              </article>
            ))}
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
};

export default Home;
