import React, { useState, useEffect } from 'react';
import { Link, NavLink, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { LogOut, UserRound, Menu, X } from 'lucide-react';
import BrandLogo from './BrandLogo';

const Navbar = () => {
  const { isAuthenticated, user, logout } = useAuth();
  const [menuOpen, setMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const location = useLocation();
  const isLandingPage = location.pathname === '/';

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Helper function to create nav link with proper href/to
  const createNavLink = (label, path) => {
    if (isLandingPage) {
      return (
        <a 
          href={path} 
          key={label}
          onClick={() => setMenuOpen(false)}
          className="btn-ghost"
        >
          {label}
        </a>
      );
    } else {
      // On other pages, link to landing page with anchor
      return (
        <Link 
          to={`/${path}`}
          key={label}
          onClick={() => setMenuOpen(false)}
          className="btn-ghost"
        >
          {label}
        </Link>
      );
    }
  };

  return (
    <header className={`sticky top-0 z-40 border-b transition-all duration-300 ${
      isScrolled 
        ? 'border-[#ede4f5] bg-white/95 backdrop-blur-2xl shadow-sm' 
        : 'border-[#ede4f5]/30 bg-white/50 backdrop-blur-lg'
    }`}>
      <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-3 sm:px-6 lg:px-8">
        <Link to="/" className="landing-brand" aria-label="Biruh Wellness home">
          <BrandLogo variant="wide"/>
        </Link>

        {/* Mobile menu toggle */}
        <button 
          className="lg:hidden" 
          type="button" 
          onClick={() => setMenuOpen(!menuOpen)} 
          aria-label="Toggle navigation"
        >
          {menuOpen ? <X size={20} /> : <Menu size={20} />}
        </button>

        {/* Navigation */}
        <nav className={`${menuOpen ? 'absolute top-16 left-0 right-0 flex flex-col gap-3 bg-white border-b border-[#ede4f5] p-4' : 'hidden lg:flex'} lg:flex lg:items-center lg:gap-2 lg:text-sm text-sm`}>
          {/* Main navigation - Services, Therapists, About, Contact */}
          {createNavLink('Services', '#services')}
          {createNavLink('Therapists', '#therapists')}
          {createNavLink('About', '#about')}
          {createNavLink('Contact', '#contact')}

          {/* Authentication-based navigation */}
          {isAuthenticated ? (
            <>
              <NavLink to="/dashboard" className="btn-ghost" onClick={() => setMenuOpen(false)}>
                Dashboard
              </NavLink>
              <div className="flex min-h-10 items-center gap-2 rounded-lg bg-[#f5eefa] px-3 py-2 text-sm font-semibold text-[#7c3aad]">
                <UserRound className="h-4 w-4 text-[#7c3aad]" />
                <span className="max-w-[12rem] truncate">{user?.full_name || 'User'}</span>
              </div>
              <button onClick={() => { logout(); setMenuOpen(false); }} className="btn-secondary px-3">
                <LogOut className="h-4 w-4" />
                Logout
              </button>
            </>
          ) : (
            <>
              <NavLink to="/login" className="btn-ghost" onClick={() => setMenuOpen(false)}>
                Login
              </NavLink>
              <NavLink to="/register" className="btn-primary px-4" onClick={() => setMenuOpen(false)}>
                Register
              </NavLink>
            </>
          )}
        </nav>
      </div>
    </header>
  );
};

export default Navbar;
