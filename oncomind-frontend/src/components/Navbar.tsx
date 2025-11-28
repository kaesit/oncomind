// components/Navbar.tsx

import React, { useState } from 'react';
import { BrutalistButton } from './BrutalistButton'; // Import your button
import '../css/Navbar.css';
import cancer_icon from "../icons/forensic-science.png";

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
          <img style={{ width: "25px", height: "25px", marginRight: "10px" }} src={cancer_icon} alt="" />
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
        <a style={{ textDecoration: "none", textWrap: "nowrap" }} href="/pipeline" onClick={closeMobileMenu}>
          <BrutalistButton
            onClick={() => console.log('Portal clicked')}
            style={{ padding: '10px 16px', fontSize: '0.9rem' }}
          >

            Drug Pipeline
          </BrutalistButton>

        </a>
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
        <a style={{ textDecoration: "none", textWrap: "nowrap" }} href="/dashboard" onClick={closeMobileMenu}>
          
          <BrutalistButton
            onClick={() => console.log('Portal clicked')}
            style={{ padding: '10px 16px', fontSize: '0.9rem' }}
          >
            Dashboard
          </BrutalistButton>
        </a>
        
        <a style={{ textDecoration: "none", textWrap: "nowrap" }} href="/search" onClick={closeMobileMenu}>
          
          <BrutalistButton
            onClick={() => console.log('Portal clicked')}
            style={{ padding: '10px 16px', fontSize: '0.9rem' }}
          >
            <img style={{width: "20px", height: "20px", margin: "0.2rem"}} src="https://img.icons8.com/?size=100&id=132&format=png&color=ffffff" alt="" />
            Search
          </BrutalistButton>
        </a>
      </div>
    </nav>
  );
};