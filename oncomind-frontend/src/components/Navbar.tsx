// components/Navbar.tsx

import React from 'react';
import { BrutalistButton } from './BrutalistButton'; // Import your button
import '../css/Navbar.css';

export const Navbar: React.FC = () => {
  return (
    <nav className="navbar-container">
      <a style={{textDecoration:"none"}} href="/">
        <div className="navbar-logo">
          {/* You can use an SVG logo here */}
          OncoMind
        </div>
      </a>
      <div className="navbar-links">
        <a href="/research">Research</a>
        <a href="/awareness">Awareness</a>
        <a href="/pipeline">Drug Pipeline</a>
        <a href="/about">About Us</a>
      </div>
      <div className="navbar-cta">
        <a style={{ textDecoration: "none" }} href="/dashboard">
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