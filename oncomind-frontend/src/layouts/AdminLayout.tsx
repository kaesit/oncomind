import React, { useEffect, useState } from "react";
import { NavLink, Outlet, useLocation, useNavigate } from "react-router-dom";
import {
  BarChart3,
  Boxes,
  ChevronRight,
  Database,
  FlaskConical,
  Folder,
  HeartPulse,
  LayoutGrid,
  LogOut,
  Menu,
  Moon,
  RotateCw,
  Settings,
  Sun,
  Users,
} from "lucide-react";
import { Button } from "../dashboard/ui";
import { useOmTheme } from "../dashboard/ui/theme";
import "../dashboard/styles/dashboard.css";

// --- TYPES & DATA ---
type NavItem = { id: string; text: string; icon: React.ReactNode; path?: string; items?: NavItem[] };

const navItems: NavItem[] = [
  { id: "home", text: "Overview", icon: <LayoutGrid size={18} />, path: "/admin" },
  {
    id: "data",
    text: "Data",
    icon: <Folder size={18} />,
    items: [
      { id: "datasets", text: "Datasets", icon: <Database size={17} />, path: "/admin/datasets" },
      { id: "models", text: "Models", icon: <Boxes size={17} />, path: "/admin/models" },
    ],
  },
  { id: "personalized_treatment", text: "Personalized Treatment", icon: <HeartPulse size={18} />, path: "/admin/personalized_treatment" },
  { id: "patients", text: "Patients", icon: <Users size={18} />, path: "/admin/patients" },
  { id: "analytics", text: "Analytics", icon: <BarChart3 size={18} />, path: "/admin/analytics" },
  { id: "drug_candidates", text: "Drug Candidates", icon: <FlaskConical size={18} />, path: "/admin/drug_candidates" },
  { id: "settings", text: "Settings", icon: <Settings size={18} />, path: "/admin/settings" },
];

const flatNav = navItems.flatMap((n) => (n.items ? n.items : [n]));
const titleFor = (pathname: string) => {
  if (/^\/admin\/patients\/.+/.test(pathname)) return "Patient profile";
  return flatNav.find((n) => n.path === pathname)?.text ?? "Overview";
};

export default function AdminLayout() {
  const navigate = useNavigate();
  const location = useLocation();
  const { theme, toggle } = useOmTheme();

  const [collapsed, setCollapsed] = useState(false); // desktop
  const [mobileOpen, setMobileOpen] = useState(false); // < 900px
  const [dataOpen, setDataOpen] = useState(true);

  const [doctorName, setDoctorName] = useState("Doctor");
  const [specialization, setSpecialization] = useState("Specialization");
  const [initials, setInitials] = useState("DR");
  const [doctorImage, setDoctorImage] = useState("Image");

  useEffect(() => {
    const doctorId = localStorage.getItem("doctorId");
    const name = localStorage.getItem("doctorName");
    const specialization_branch = localStorage.getItem("doctorSpecialization");
    const image = localStorage.getItem("doctorImage");
    setSpecialization(specialization_branch || "Doctor");
    setDoctorImage(image || "");

    if (!doctorId) {
      navigate("/login");
    } else if (name) {
      setDoctorName(name);
      const parts = name.split(" ");
      if (parts.length >= 2) {
        setInitials(`${parts[0][0]}${parts[1][0]}`.toUpperCase());
      } else {
        setInitials(name.substring(0, 2).toUpperCase());
      }
    }
  }, [navigate]);

  // close the mobile drawer whenever the route changes
  useEffect(() => setMobileOpen(false), [location.pathname]);

  const handleLogout = () => {
    localStorage.removeItem("doctorId");
    localStorage.removeItem("doctorName");
    localStorage.removeItem("doctorSpecialization");
    navigate("/login");
  };

  const toggleMenu = () => {
    if (window.innerWidth < 900) setMobileOpen((o) => !o);
    else setCollapsed((c) => !c);
  };

  const imageOk = doctorImage && doctorImage !== "undefined" && doctorImage !== "null";

  return (
    <div className="om-root" data-collapsed={collapsed} data-mobile-open={mobileOpen}>
      <div className="om-scrim" onClick={() => setMobileOpen(false)} />

      <aside className="om-sidebar" role="navigation" aria-label="Dashboard">
        <div className="om-brand">
          <span className="om-brand-mark" />
          OncoMind
        </div>

        <div className="om-profile">
          <div className="om-avatar">{imageOk ? <img src={doctorImage} alt="Dr" /> : initials}</div>
          <div style={{ minWidth: 0 }}>
            <div className="om-profile-name">Dr. {doctorName}</div>
            <div className="om-profile-role">{specialization}</div>
          </div>
        </div>

        <nav className="om-nav">
          <div className="om-nav-label">Workspace</div>
          {navItems.map((item) =>
            item.items ? (
              <div key={item.id}>
                <button className="om-nav-item" onClick={() => setDataOpen((o) => !o)} aria-expanded={dataOpen}>
                  {item.icon}
                  <span>{item.text}</span>
                  <ChevronRight size={15} className="om-nav-chevron" data-open={dataOpen} />
                </button>
                {dataOpen && (
                  <div className="om-nav-children">
                    {item.items.map((child) => (
                      <NavLink key={child.id} to={child.path!} className="om-nav-item">
                        {child.icon}
                        <span>{child.text}</span>
                      </NavLink>
                    ))}
                  </div>
                )}
              </div>
            ) : (
              <NavLink key={item.id} to={item.path!} end={item.path === "/admin"} className="om-nav-item">
                {item.icon}
                <span>{item.text}</span>
              </NavLink>
            )
          )}
        </nav>

        <div className="om-sidebar-foot">
          <Button variant="danger" block icon={<LogOut size={16} />} onClick={handleLogout}>
            Logout
          </Button>
          <div className="om-version">v0.1 • Presentation demo</div>
        </div>
      </aside>

      <div className="om-main">
        <div className="om-stage">
          <header className="om-topbar">
            <Button variant="ghost" iconOnly icon={<Menu size={18} />} onClick={toggleMenu} aria-label="Toggle navigation" />
            <span className="om-topbar-title">
              OncoMind / <b>{titleFor(location.pathname)}</b>
            </span>
            <span className="om-topbar-spacer" />
            <div className="om-segment" role="group" aria-label="Theme">
              <button aria-pressed={theme === "light"} onClick={() => theme !== "light" && toggle()} aria-label="Light theme">
                <Sun size={14} />
              </button>
              <button aria-pressed={theme === "dark"} onClick={() => theme !== "dark" && toggle()} aria-label="Dark theme">
                <Moon size={14} />
              </button>
            </div>
            <Button variant="ghost" iconOnly icon={<RotateCw size={17} />} onClick={() => window.location.reload()} aria-label="Refresh" />
          </header>

          <main className="om-content">
            <Outlet />
          </main>
        </div>
      </div>
    </div>
  );
}
