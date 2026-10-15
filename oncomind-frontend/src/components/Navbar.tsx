// components/Navbar.tsx

import React, { useEffect, useState } from "react";
import { Link, NavLink, useLocation } from "react-router-dom";
import { ArrowUpRight, Menu, Moon, Sun, X } from "lucide-react";
import { Button } from "../dashboard/ui";
import type { OmTheme } from "../dashboard/ui/theme";

const links = [
  { to: "/research", text: "Research" },
  { to: "/future", text: "Future" },
  { to: "/awareness", text: "Awareness" },
  { to: "/about", text: "About Us" },
  { to: "/contact", text: "Contact" },
];

export const Navbar: React.FC<{ theme: OmTheme; onToggleTheme: () => void }> = ({ theme, onToggleTheme }) => {
  // State to manage the mobile menu (open/closed)
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [lastScroll, setLastScroll] = useState(0);
  const [showNavbar, setShowNavbar] = useState(true);
  const location = useLocation();

  // close the mobile menu whenever the route changes
  useEffect(() => setIsMobileMenuOpen(false), [location.pathname]);

  useEffect(() => {
    const handleScroll = () => {
      const currentScroll = window.pageYOffset;

      if (currentScroll <= 0) {
        setShowNavbar(true);
        return;
      }

      if (currentScroll > lastScroll && currentScroll > 100) {
        setShowNavbar(false); // Aşağı scroll - gizle
        setIsMobileMenuOpen(false);
      } else if (currentScroll < lastScroll) {
        setShowNavbar(true); // Yukarı scroll - göster
      }

      setLastScroll(currentScroll);
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, [lastScroll]);

  const navLinks = links.map((l) => (
    <NavLink key={l.to} to={l.to} className="site-nav-link">
      {l.text}
    </NavLink>
  ));

  return (
    <>
      <nav className="site-nav" data-hidden={!showNavbar} aria-label="Main">
        <Link to="/" className="site-brand">
          <span className="om-brand-mark" />
          OncoMind
        </Link>

        <div className="site-nav-links">{navLinks}</div>

        <Button
          variant="ghost"
          iconOnly
          size="sm"
          icon={theme === "dark" ? <Sun size={16} /> : <Moon size={16} />}
          onClick={onToggleTheme}
          aria-label={theme === "dark" ? "Switch to light theme" : "Switch to dark theme"}
        />
        <Link to="/login" className="om-btn om-btn--primary om-btn--sm site-nav-cta" style={{ textDecoration: "none" }}>
          Open dashboard <ArrowUpRight size={15} />
        </Link>
        <Button
          className="site-nav-burger"
          variant="ghost"
          iconOnly
          size="sm"
          icon={isMobileMenuOpen ? <X size={18} /> : <Menu size={18} />}
          onClick={() => setIsMobileMenuOpen((o) => !o)}
          aria-label="Toggle navigation menu"
          aria-expanded={isMobileMenuOpen}
        />
      </nav>

      {/* Mobile menu */}
      <div className="site-menu" data-open={isMobileMenuOpen}>
        {navLinks}
        <Link to="/login" className="om-btn om-btn--primary" style={{ textDecoration: "none", marginTop: 6 }}>
          Open dashboard <ArrowUpRight size={15} />
        </Link>
      </div>
    </>
  );
};
