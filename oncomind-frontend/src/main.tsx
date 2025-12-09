import "devextreme/dist/css/dx.light.css";
import "./styles/theme.css";
import React from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Landing from "./pages/Landing";
import Home from "./pages/Home";
import Dashboard from "./pages/Dashboard";
import MainLayout from "./layouts/MainLayout";
import AdminLayout from "./layouts/AdminLayout";
import NotFoundPage from "./pages/NotFoundPage"
import About from "./pages/About";
import Research from "./pages/Research";
import AdminDashboard from "./pages/AdminDashboard";
import DashboardSettings from "./pages/dashboardpages/DashboardSettings";
import DataSets from "./pages/dashboardpages/DataSets";
import Patients from "./pages/dashboardpages/Patients";

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
          <Route path="/admin" element={<AdminDashboard />} />
          <Route path="/admin/settings" element={<DashboardSettings />} />
          <Route path="/admin/datasets" element={<DataSets />} />
          <Route path="/admin/patients" element={<Patients />} />


        </Route>

        <Route path="*" element={<NotFoundPage />} />
      </Routes>
    </BrowserRouter>
  );
}

createRoot(document.getElementById("root") as HTMLElement).render(<AppRouter />);
