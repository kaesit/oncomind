// components/Navbar.tsx

import React, { useState } from 'react';
import { BrutalistButton } from './BrutalistButton'; // Import your button
import '../css/Navbar.css';

export const Navbar: React.FC = () => {
  // State to manage the mobile menu (open/closed)
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  // Toggle the mobile menu
  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  // Function to close the menu (e.g., when a link is clicked)
  const closeMobileMenu = () => {
    setIsMobileMenuOpen(false);
  };

  return (
    <nav className="navbar-container">
      {/* Logo - closes menu on click */}
      <a style={{ textDecoration: "none" }} href="/" onClick={closeMobileMenu}>
        <div className="navbar-logo">
          OncoMind
        </div>
      </a>

      {/* Hamburger Menu Button (Mobile Only) */}
      <button
        className={`navbar-hamburger ${isMobileMenuOpen ? 'open' : ''}`}
        onClick={toggleMobileMenu}
        aria-label="Toggle navigation menu"
        aria-expanded={isMobileMenuOpen}
      >
        <span></span>
        <span></span>
        <span></span>
      </button>

      {/* Navigation Links (Toggles on Mobile) */}
      <div className={`navbar-links ${isMobileMenuOpen ? 'open' : ''}`}>
        <a href="/research" onClick={closeMobileMenu}>Research</a>
        <a href="/awareness" onClick={closeMobileMenu}>Awareness</a>
        <a href="/pipeline" onClick={closeMobileMenu}>Drug Pipeline</a>
        <a href="/about" onClick={closeMobileMenu}>About Us</a>
        <a href="/contact" onClick={closeMobileMenu}>Contact</a>


        {/* CTA Button (Now inside links container) */}
        <div className="navbar-cta">
          <a className="cta-button" style={{ textDecoration: "none" }} href="/dashboard" onClick={closeMobileMenu}>
            <BrutalistButton
              onClick={() => console.log('Portal clicked')}
              style={{ padding: '10px 16px', fontSize: '0.9rem' }}
            >
              Dashboard
            </BrutalistButton>
          </a>
        </div>
      </div>
    </nav>
  );
};