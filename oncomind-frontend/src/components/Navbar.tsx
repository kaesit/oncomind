// components/Navbar.tsx

import React, { useState, useEffect } from 'react';
import BrutalistButton from './BrutalistButton'; // Import your button
import '../css/Navbar.css';
import cancer_icon from '../icons/forensic-science.png';
import search_icon from '../icons/search_icon.png';
import logo from '../icons/OncomindLogo3.svg'

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
  const [lastScroll, setLastScroll] = useState(0);
  const [showNavbar, setShowNavbar] = useState(true);

  useEffect(() => {
    const handleScroll = () => {
      const currentScroll = window.pageYOffset;

      if (currentScroll <= 0) {
        setShowNavbar(true);
        return;
      }

      if (currentScroll > lastScroll && currentScroll > 100) {
        setShowNavbar(false); // Aşağı scroll - gizle
      } else if (currentScroll < lastScroll) {
        setShowNavbar(true); // Yukarı scroll - göster
      }

      setLastScroll(currentScroll);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, [lastScroll]);


  return (

    <nav className={`navbar-container ${showNavbar ? 'show' : 'hide'}`}>
      {/* Logo - closes menu on click */}
      <a style={{ textDecoration: "none" }} href="/" onClick={closeMobileMenu}>
        <div className="navbar-logo">
          <img style={{ width: "30px", height: "30px", marginRight: "10px" }} src={logo} alt="" />
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
        <a href="/research" style={{ textDecoration: "none", textWrap: "nowrap" }} onClick={closeMobileMenu}>
          <BrutalistButton
            onClick={() => console.log('Portal clicked')}
            style={{ padding: '10px 16px', fontSize: '0.9rem' }}
          >
            Research
          </BrutalistButton></a>
        <a style={{ textDecoration: "none", textWrap: "nowrap" }} href="/awareness" onClick={closeMobileMenu}>
          <BrutalistButton
            onClick={() => console.log('Portal clicked')}
            style={{ padding: '10px 16px', fontSize: '0.9rem' }}
          >

            Awareness
          </BrutalistButton></a>
        <a style={{ textDecoration: "none", textWrap: "nowrap" }} href="/about" onClick={closeMobileMenu}>
          <BrutalistButton
            onClick={() => console.log('Portal clicked')}
            style={{ padding: '10px 16px', fontSize: '0.9rem' }}
          >

            About Us
          </BrutalistButton>
        </a>
        <a style={{ textDecoration: "none", textWrap: "nowrap" }} href="/contact" onClick={closeMobileMenu}>

          <BrutalistButton
            onClick={() => console.log('Portal clicked')}
            style={{ padding: '10px 16px', fontSize: '0.9rem' }}
          >

            Contact
          </BrutalistButton>
        </a>
        <a style={{ textDecoration: "none", textWrap: "nowrap" }} href="/dashboard" onClick={closeMobileMenu}>
          <BrutalistButton
            onClick={() => console.log('Portal clicked')}
            style={{ padding: '10px 16px', fontSize: '0.9rem' }}
          >
            Dashboard
          </BrutalistButton>
        </a>
      </div>
    </nav>
  );
};