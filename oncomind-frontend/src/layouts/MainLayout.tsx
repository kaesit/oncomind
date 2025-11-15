import React from 'react';
import { Outlet } from 'react-router-dom';
import { Navbar } from "../components/Navbar";
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