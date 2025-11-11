// components/Navbar.tsx

import React from 'react';
import { BrutalistButton } from './BrutalistButton'; // Import your button
import '../css/Navbar.css';

export const Navbar: React.FC = () => {
  return (
    <nav className="navbar-container">
      <div className="navbar-logo">
        {/* You can use an SVG logo here */}
        OncoMind
      </div>
      <div className="navbar-links">
        <a href="/research">Research</a>
        <a href="/awareness">Awareness</a>
        <a href="/pipeline">Drug Pipeline</a>
        <a href="/about">About Us</a>
      </div>
      <div className="navbar-cta">
        <BrutalistButton 
          width='225px'
          height='50px'
          onClick={() => console.log('Portal clicked')}
          style={{ padding: '10px 16px', fontSize: '0.9rem' }}
        >
          <a style={{textDecoration:"none", color:"#cbd5e1"}} href="/dashboard">Dashboard</a>
        </BrutalistButton>
      </div>
    </nav>
  );
};