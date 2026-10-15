import "./dashboard/styles/dashboard.css";
import React, { lazy, Suspense } from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { Toaster } from "sonner";
import Landing from "./pages/Landing";
import Home from "./pages/Home";
import MainLayout from "./layouts/MainLayout";
import NotFoundPage from "./pages/NotFoundPage"
import About from "./pages/About";
import Research from "./pages/Research";
import AwarenessPage from "./pages/Awareness";
import Contact from "./pages/Contact";
import Future from "./pages/Future";
import Signin from "./pages/Signin";

// Dashboard is code-split: visitors of the public site never download its
// charts, data table or PDF export.
const AdminLayout = lazy(() => import("./layouts/AdminLayout"));
const AdminDashboard = lazy(() => import("./pages/AdminDashboard"));
const DashboardSettings = lazy(() => import("./pages/dashboardpages/DashboardSettings"));
const DataSets = lazy(() => import("./pages/dashboardpages/DataSets"));
const Patients = lazy(() => import("./pages/dashboardpages/Patients"));
const Models = lazy(() => import("./pages/dashboardpages/Models"));
const PatientProfile = lazy(() => import("./pages/dashboardpages/PatientInfo"));
const DrugCandidates = lazy(() => import("./pages/dashboardpages/DrugCandidates"));
const DashboardAnalytics = lazy(() => import("./pages/dashboardpages/DashboardAnalytics").then((m) => ({ default: m.DashboardAnalytics })));
const DashboardSignIn = lazy(() => import("./pages/auth/DashboardSignIn"));
const PersonalizedTreatment = lazy(() => import("./pages/dashboardpages/PersonalizedTreatment"));

function AppRouter() {
  return (
    <BrowserRouter>
      <Toaster position="bottom-right" richColors closeButton toastOptions={{ className: "om-toast" }} />
      <Suspense fallback={null}>
      <Routes>
        <Route element={<MainLayout />}>
          <Route path="/" element={<Landing />} />
          <Route path="/home" element={<Home />} />
          <Route path="/about" element={<About />} />
          <Route path="/research" element={<Research />} />
          <Route path="/future" element={<Future />} />
          <Route path="/awareness" element={<AwarenessPage />} />
          <Route path="/contact" element={<Contact />} />


        </Route>
        <Route element={<AdminLayout />}>
          <Route path="/admin" element={<AdminDashboard />} />
          <Route path="/admin/settings" element={<DashboardSettings />} />
          <Route path="/admin/datasets" element={<DataSets />} />
          <Route path="/admin/patients" element={<Patients />} />
          <Route path="/admin/models" element={<Models />} />
          <Route path="/admin/patients/:id" element={<PatientProfile />} />
          <Route path="/admin/drug_candidates" element={<DrugCandidates />} />
          <Route path="/admin/analytics" element={<DashboardAnalytics />} />
          <Route path="/admin/personalized_treatment" element={<PersonalizedTreatment />} />



        </Route>
        <Route path="/signin" element={<Signin />} />
        <Route path="/login" element={<DashboardSignIn />} />
        <Route path="*" element={<NotFoundPage />} />
      </Routes>
      </Suspense>
    </BrowserRouter>
  );
}

createRoot(document.getElementById("root") as HTMLElement).render(<AppRouter />);
