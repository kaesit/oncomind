import React from 'react';
import { Outlet } from 'react-router-dom';
import { Navbar } from "../components/Navbar";
import { config } from '@fortawesome/fontawesome-svg-core'
import '@fortawesome/fontawesome-svg-core/styles.css'
// --- We moved the 'items' array from index.tsx to here ---
// This keeps all the navbar logic in one place.

const MainLayout: React.FC = () => {
     return (
          <>
               <Navbar></Navbar>
               {/* This Outlet renders the child route (e.g., About, Projects) */}
               <main>
                    <Outlet />
               </main>
          </>
     );
};

export default MainLayout;