import React from 'react';
import { Link } from 'react-router-dom';
import { Mail, MapPin, Phone } from 'lucide-react';
import BrandLogo from './BrandLogo';
import '../../pages/Home.css';

const Footer = () => {
  return (
    <footer className="landing-footer" id="contact">
      <div className="landing-footer__grid">
        <div>
          <Link to="/" className="landing-brand landing-brand--footer">
            <BrandLogo variant="wide" className="brand-logo-footer" />
          </Link>
          <p>Providing compassionate, confidential mental health therapy to the people of Addis Ababa and beyond.</p>
          <div className="landing-footer__contact">
            <span><Phone size={14} /> +251 911 234 567</span>
            <span><Mail size={14} /> info@biruhwellness.et</span>
            <span><MapPin size={14} /> Addis Ababa, Ethiopia</span>
          </div>
        </div>
        <div>
          <h3>Useful links</h3>
          <Link to="/#about">About us</Link>
          <Link to="/#services">Services</Link>
          <Link to="/#therapists">Meet therapists</Link>
          <Link to="/#appointment">Book a session</Link>
        </div>
        <div>
          <h3>Platform</h3>
          <Link to="/login">Login</Link>
          <Link to="/register">Register</Link>
          <Link to="/dashboard">Dashboard</Link>
        </div>
        <div>
          <h3>Contact</h3>
          <a href="tel:+251911234567">+251 911 234 567</a>
          <a href="mailto:info@biruhwellness.et">info@biruhwellness.et</a>
          <span>Bole Sub-city, Addis Ababa</span>
        </div>
      </div>
      <div className="landing-footer__bottom">
        <span>(c) 2026 Biruh Wellness Center. All rights reserved.</span>
        <span>JWT secured - AES-256 - RBAC</span>
      </div>
    </footer>
  );
};

export default Footer;
