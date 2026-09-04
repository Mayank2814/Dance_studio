import React, { useState } from 'react';
import { useNavigate } from "react-router-dom";
import HeroSection from '../components/HeroSection.jsx';
import FeaturesSection from '../components/FeaturesSection.jsx';
import InstrumentsSection from '../components/InstrumentsSection.jsx';
import TestimonialsSection from '../components/TestimonialsSection.jsx';
import './LandingPage.css';

const LandingPage = () => {
  const navigate = useNavigate();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const scrollTo = (id) => {
    setMobileMenuOpen(false);
    const el = document.getElementById(id);
    if (el) el.scrollIntoView({ behavior: 'smooth' });
    else window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="landing-page">

      {/* ── Floating Navbar overlaid on the right panel of the hero ── */}
      <header className="lp-navbar">
        <nav className="lp-navbar__inner">
          {/* Nav links — right side (desktop) */}
          <ul className={`lp-navbar__links${mobileMenuOpen ? ' lp-navbar__links--open' : ''}`}>
            {[
              { label: 'Home',     id: 'home' },
              { label: 'About',    id: 'features-section' },
              { label: 'Schedule', id: 'instruments-section' },
              { label: 'Gallery',  id: 'testimonials-section' },
              { label: 'Contact',  id: 'contact-footer' },
            ].map(({ label, id }) => (
              <li key={label}>
                <button className="lp-navbar__link" onClick={() => scrollTo(id)}>
                  {label}
                </button>
              </li>
            ))}
            <li className="lp-navbar__auth-sep">
              <button className="lp-navbar__auth-btn lp-navbar__auth-btn--ghost" onClick={() => navigate('/login')}>Login</button>
              <button className="lp-navbar__auth-btn lp-navbar__auth-btn--solid" onClick={() => navigate('/register')}>Register</button>
            </li>
          </ul>

          {/* Hamburger (mobile) */}
          <button
            className={`lp-navbar__hamburger${mobileMenuOpen ? ' lp-navbar__hamburger--open' : ''}`}
            onClick={() => setMobileMenuOpen(p => !p)}
            aria-label="Toggle menu"
          >
            <span /><span /><span />
          </button>
        </nav>
      </header>

      {/* ── Hero ── */}
      <HeroSection />

      {/* ── Remaining sections ── */}
      <FeaturesSection />
      <div id="instruments-section">
        <InstrumentsSection />
      </div>
      <div id="testimonials-section">
        <TestimonialsSection />
      </div>

      {/* ── Footer ── */}
      <footer className="landing-footer" id="contact-footer">
        <div className="footer-container">
          <div className="footer-content">
            <div className="footer-brand">
              <div className="footer-logo">
                <span className="ds-logo__box" style={{ fontSize: '1rem', padding: '0.25rem 0.6rem' }}>D4E</span>
                <span className="logo-text">Dance School</span>
              </div>
              <p className="footer-description">
                Inspiring dancers and fostering creativity through world-class training and personalized instruction.
              </p>
            </div>

            <div className="footer-links">
              <div className="footer-section">
                <h4>Programs</h4>
                <ul>
                  <li><button className="footer-link-btn" onClick={() => scrollTo('instruments-section')}>Ballet</button></li>
                  <li><button className="footer-link-btn" onClick={() => scrollTo('instruments-section')}>Hip Hop</button></li>
                  <li><button className="footer-link-btn" onClick={() => scrollTo('instruments-section')}>Contemporary</button></li>
                  <li><button className="footer-link-btn" onClick={() => scrollTo('instruments-section')}>Bollywood</button></li>
                </ul>
              </div>

              <div className="footer-section">
                <h4>Resources</h4>
                <ul>
                  <li><button className="footer-link-btn" onClick={() => scrollTo('instruments-section')}>Schedule</button></li>
                  <li><button className="footer-link-btn" onClick={() => navigate('/login')}>Fees</button></li>
                  <li><button className="footer-link-btn" onClick={() => scrollTo('features-section')}>FAQs</button></li>
                  <li><button className="footer-link-btn" onClick={() => scrollTo('contact-footer')}>Contact</button></li>
                </ul>
              </div>

              <div className="footer-section">
                <h4>Connect</h4>
                <div className="social-links">
                  <a href="#" className="social-link">📘 Facebook</a>
                  <a href="#" className="social-link">📷 Instagram</a>
                  <a href="#" className="social-link">🎬 YouTube</a>
                  <a href="#" className="social-link">🎵 TikTok</a>
                </div>
              </div>
            </div>
          </div>

          <div className="footer-bottom">
            <div className="footer-bottom-content">
              <p>&copy; 2025 Dance School Management System. All rights reserved.</p>
              <div className="footer-bottom-links">
                <a href="#">Privacy Policy</a>
                <a href="#">Terms of Service</a>
                <a href="#">Accessibility</a>
              </div>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default LandingPage;