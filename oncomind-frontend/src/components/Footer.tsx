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
              An experimental, open-source research project exploring how AI could
              support oncology research. Not a medical device, not medical advice.
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

          {/* Contact */}
          <div>
            <h4>Contact</h4>
            <ul className="site-footer-links">
              <li>
                <a href="https://github.com/kaesit/oncomind" target="_blank" rel="noopener noreferrer" aria-label="Visit our GitHub repository">
                  GitHub <ArrowUpRight size={13} />
                </a>
              </li>
              <li>
                <a href="https://github.com/kaesit/oncomind/issues/new" target="_blank" rel="noopener noreferrer">
                  Open an issue <ArrowUpRight size={13} />
                </a>
              </li>
            </ul>
          </div>
        </div>

        <div className="site-wordmark" aria-hidden>OncoMind</div>

        {/* Copyright */}
        <div className="site-footer-bottom">
          <span>© {currentYear} Esad Abdullah Kösedağ & OncoMind. All rights reserved.</span>
          <span>Photography via Unsplash · Research use only</span>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
