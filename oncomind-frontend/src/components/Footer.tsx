import React from "react";
import { Link } from "react-router-dom";
import { ArrowUpRight } from "lucide-react";

const Footer: React.FC = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="site-footer">
      <div className="site-wrap">
        <div className="site-footer-grid">
          {/* Brand Section */}
          <div style={{ display: "flex", flexDirection: "column", gap: 16, maxWidth: 420 }}>
            <span className="site-brand" style={{ marginRight: 0 }}>
              <span className="om-brand-mark" />
              OncoMind
            </span>
            <p className="site-body">
              Building innovative solutions with science and passion, advancing
              precision oncology through AI-powered genomic analysis.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h4>Quick Links</h4>
            <ul className="site-footer-links">
              <li><Link to="/about">About Us</Link></li>
              <li><Link to="/research">Research</Link></li>
              <li><Link to="/awareness">Awareness</Link></li>
              <li><Link to="/contact">Contact</Link></li>
            </ul>
          </div>

          {/* Social Media */}
          <div>
            <h4>Contact</h4>
            <ul className="site-footer-links">
              <li>
                <a href="https://github.com/kaesit/oncomind" target="_blank" rel="noopener noreferrer" aria-label="Visit our GitHub repository">
                  GitHub <ArrowUpRight size={13} />
                </a>
              </li>
              <li>
                <a href="https://linkedin.com/in/your-profile" target="_blank" rel="noopener noreferrer" aria-label="Connect on LinkedIn">
                  LinkedIn <ArrowUpRight size={13} />
                </a>
              </li>
              <li>
                <a href="https://instagram.com/your-handle" target="_blank" rel="noopener noreferrer" aria-label="Follow on Instagram">
                  Instagram <ArrowUpRight size={13} />
                </a>
              </li>
            </ul>
          </div>
        </div>

        <div className="site-wordmark" aria-hidden>OncoMind</div>

        {/* Copyright */}
        <div className="site-footer-bottom">
          <span>© {currentYear} Esad Abdullah Kösedağ & OncoMind. All rights reserved.</span>
          <span>Research use only — not a medical device.</span>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
