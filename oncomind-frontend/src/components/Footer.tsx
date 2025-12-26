import React from "react";
import "../css/Footer.css";

const Footer: React.FC = () => {
  const currentYear = new Date().getFullYear();

  return (
    <center>
      <footer className="footer-container">
        <div className="footer-content">
          {/* Brand Section */}
          <div className="footer-section">
            <h4 className="footer-title">OncoMind</h4>
            <p className="footer-text">
              Building innovative solutions with science and passion, advancing
              precision oncology through AI-powered genomic analysis.
            </p>
          </div>

          {/* Quick Links */}
          <div className="footer-section">
            <h4 className="footer-title">Quick Links</h4>
            <ul className="footer-links">
              <li>
                <a href="/about">About Us</a>
              </li>
              <li>
                <a href="/research">Research</a>
              </li>
              <li>
                <a href="/projects">Projects</a>
              </li>
              <li>
                <a href="/contact">Contact</a>
              </li>
            </ul>
          </div>

          {/* Social Media */}
          <div className="footer-section">
            <h4 className="footer-title">Connect</h4>
            <div className="footer-socials">
              <a
                href="https://github.com/kaesit/oncomind"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Visit our GitHub repository"
              >
                GitHub
              </a>
              <a
                href="https://linkedin.com/in/your-profile"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Connect on LinkedIn"
              >
                LinkedIn
              </a>
              <a
                href="https://twitter.com/your-handle"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Follow on Twitter"
              >
                Twitter
              </a>
            </div>
          </div>
        </div>

        {/* Copyright */}
        <div className="footer-bottom">
          <p>
            © {currentYear} Esad Abdullah Kösedağ & OncoMind. All rights reserved.
          </p>
        </div>
      </footer>
    </center>
  );
};

export default Footer;