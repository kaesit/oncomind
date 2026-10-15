import React, { useEffect } from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import { Navbar } from "../components/Navbar";
import Footer from "../components/Footer";
import { useOmTheme } from "../dashboard/ui/theme";
import "../dashboard/styles/dashboard.css";
import "../site/site.css";

// Navbar, footer and theme live here so every public page shares them.
const MainLayout: React.FC = () => {
     const { theme, toggle } = useOmTheme();
     const { pathname, hash } = useLocation();

     // client-side navigation keeps scroll position: start new pages at the top,
     // or at the #anchor when the link has one (e.g. /home#demo)
     useEffect(() => {
          if (!hash) {
               window.scrollTo(0, 0);
               return;
          }
          const t = setTimeout(() => document.getElementById(hash.slice(1))?.scrollIntoView({ behavior: "smooth", block: "start" }), 60);
          return () => clearTimeout(t);
     }, [pathname, hash]);

     return (
          <div className="om-site">
               <Navbar theme={theme} onToggleTheme={toggle} />
               {/* This Outlet renders the child route (e.g., About, Research) */}
               <main>
                    <Outlet />
               </main>
               <Footer />
          </div>
     );
};

export default MainLayout;
