import "devextreme/dist/css/dx.light.css";
import "./styles/theme.css";
import React from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Landing from "./pages/Landing";
import Home from "./pages/Home";
import Dashboard from "./pages/Dashboard";
import MainLayout from "./layouts/MainLayout";
import AdminLayout from "./layouts/AdminLayout.";
import NotFoundPage from "./pages/NotFoundPage"
import About from "./pages/About";
import Research from "./pages/Research";
// Add these imports to your main entry file (e.g., index.js or App.js)
import 'devextreme/dist/css/dx.light.css';
import 'devextreme/dist/css/dx.common.css';
import 'devextreme/dist/css/dx.light.css';

function AppRouter() {
  return (
    <BrowserRouter>
      <Routes>
        <Route element={<MainLayout />}>
          <Route path="/" element={<Landing />} />
          <Route path="/home" element={<Home />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/about" element={<About />} />
          <Route path="/research" element={<Research />} />

        </Route>
        <Route element={<AdminLayout />}>
          <Route path="/admin" element={<Home />} />

        </Route>

        <Route path="*" element={<NotFoundPage />} />
      </Routes>
    </BrowserRouter>
  );
}

createRoot(document.getElementById("root") as HTMLElement).render(<AppRouter />);
