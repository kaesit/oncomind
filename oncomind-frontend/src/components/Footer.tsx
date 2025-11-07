import React from "react";
import "../css/Footer.css";

const Footer: React.FC = () => {
  return (
    <footer className="footer-container">
      <div className="footer-content">
        {/* Sol kısım */}
        <div className="footer-section">
          <h4 className="footer-title">MBS Liberty Tech</h4>
          <p className="footer-text">
            Building innovative solutions with freedom, order, and creativity.
          </p>
        </div>

        {/* Orta linkler */}
        <div className="footer-section">
          <h4 className="footer-title">Quick Links</h4>
          <ul className="footer-links">
            <li>
              <a href="/projects">Projects</a>
            </li>
            <li>
              <a href="https://github.com/kaesit">Blogs</a>
            </li>
            <li>
              <a href="https://github.com/kaesit">Contact</a>
            </li>
          </ul>
        </div>

        {/* Sosyal medya */}
        <div className="footer-section">
          <h4 className="footer-title">Connect</h4>
          <div className="footer-socials">
            <a href="https://github.com/kaesit" aria-label="GitHub">
              GitHub
            </a>
            <a href="https://linkedin.com" aria-label="LinkedIn">
              LinkedIn
            </a>
            <a href="https://instagram.com" aria-label="Instagram">
              Instagram
            </a>
          </div>
        </div>
      </div>

      {/* Alt copyright */}
      <div className="footer-bottom">
        <p>
          © {new Date().getFullYear()} Esad Abdullah Kösedağ. All rights reserved.
        </p>
      </div>
    </footer>
  );
};

export default Footer;

export {};