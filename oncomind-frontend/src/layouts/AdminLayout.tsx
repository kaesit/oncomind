import React, { useEffect, useState } from "react";
import { Outlet, useNavigate, useLocation } from "react-router-dom";
import Drawer from "devextreme-react/drawer";
import TreeView from "devextreme-react/tree-view";
import { Toolbar, Item as ToolbarItem } from "devextreme-react/toolbar";
import DropDownButton from "devextreme-react/drop-down-button";
import Button from "devextreme-react/button";
import "../styles/adminlayout.css";

// --- TYPES & DATA ---
type NavItem = { id: string; text: string; icon?: string; path?: string; items?: NavItem[] };

const navItems: NavItem[] = [
  { id: "home", text: "Overview", icon: "home", path: "/admin" },
  {
    id: "data",
    text: "Data",
    icon: "folder",
    items: [
      { id: "datasets", text: "Datasets", icon: "doc", path: "/admin/datasets" },
      { id: "models", text: "Models", icon: "chart", path: "/admin/models" },
    ],
  },
  { id: "patients", text: "Patients", icon: "user", path: "/admin/patients" },
  { id: "analytics", text: "Analytics", icon: "event", path: "/admin/analytics" },
  { id: "drug_candidates", text: "Drug Candidates", icon: "formula", path: "/admin/drug_candidates" },
  { id: "settings", text: "Settings", icon: "preferences", path: "/admin/settings" },
];

export default function AdminLayout() {
  const navigate = useNavigate();
  const [opened, setOpened] = useState<boolean>(true);
  const [drawerMode, setDrawerMode] = useState<"shrink" | "over">("shrink");

  const [doctorName, setDoctorName] = useState("Doctor");
  const [specialization, setSpecialization] = useState("Specialization");
  const [initials, setInitials] = useState("DR");

  useEffect(() => {
    const doctorId = localStorage.getItem("doctorId");
    const name = localStorage.getItem("doctorName");
    const specialization_branch = localStorage.getItem("doctorSpecialization");
    setSpecialization(specialization_branch.toString());

    if (!doctorId) {
      navigate("/login");
    } else if (name) {
      setDoctorName(name);
      const parts = name.split(' ');
      if (parts.length >= 2) {
        setInitials(`${parts[0][0]}${parts[1][0]}`.toUpperCase());
      } else {
        setInitials(name.substring(0, 3).toLocaleUpperCase());
      }
    }
  }, [navigate]);

  useEffect(() => {
    const onResize = () => {
      if (window.innerWidth < 900) {
        setOpened(false);
        setDrawerMode("over");
      } else {
        setOpened(true);
        setDrawerMode("shrink");
      }
    };
    onResize();
    window.addEventListener("resize", onResize);
    return () => window.removeEventListener("resize", onResize);
  }, []);

  function onNavItemClick(e: any) {
    const path = e.itemData.path;
    if (path) navigate(path);
    if (drawerMode === "over") setOpened(false);
  }

  const handleLogout = () => {
    localStorage.removeItem("doctorId");
    localStorage.removeItem("doctorName");
    localStorage.removeItem("specialization");
    navigate("/login");
  };

  const userMenuItems = [
    { text: "Profile", onClick: () => navigate("/admin/profile") },
    { text: "Settings", onClick: () => navigate("/admin/settings") },
    { text: "Sign out", onClick: handleLogout },
  ];

  // This is the component used inside the 'template' prop
  const UserProfileHeader = () => (
    <div
      id="profile-target"
      style={{
        display: "flex",
        width: "200px",
        alignItems: "center",  // Align items vertically in the center
        gap: "12px",           // Space between Avatar and Text
        paddingRight: "10px",
        cursor: "pointer"
      }}
    >
      {/* 1. Avatar Section (First) */}
      <div style={{
        width: "38px",
        height: "38px",
        borderRadius: "20%", // Rounded square look
        background: "linear-gradient(135deg, #2563eb 0%, #a855f7 100%)",
        color: "white",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        fontWeight: "bold",
        fontSize: "14px",
        border: "2px solid rgba(255,255,255,0.2)",
        boxShadow: "0 4px 10px rgba(0,0,0,0.3)"
      }}>
        <img src={""} alt="" />
      </div>

      {/* 2. Text Section (Second) */}
      <div style={{ textAlign: "left", display: "flex", flexDirection: "column" }}>
        <span style={{ fontSize: "14px", fontWeight: "600", color: "#ffffff", lineHeight: "1.2" }}>
          Dr. {doctorName}
        </span>
        <span style={{ fontSize: "11px", color: "#a0a0a0", lineHeight: "1" }}>
          {specialization}
        </span>
      </div>
    </div>
  );

  return (
    <>
      <div className="dx-viewport admin-root">
        <Drawer
          opened={opened}
          openedStateMode="shrink"
          position="left"
          revealMode="slide"
          shading={false}
          component={() => (
            <div className="nav-shell" role="navigation">
              <div className="nav-brand">
                <UserProfileHeader />
              </div>

              <TreeView
                items={navItems}
                width="100%"
                selectionMode="single"
                showCheckBoxesMode="none"
                keyExpr="id"
                displayExpr="text"
                onItemClick={onNavItemClick}
                itemRender={(data) => (
                  <div className="nav-item">
                    {data.icon ? <i className={`dx-icon dx-icon-${data.icon}`} /> : null}
                    <span>{data.text}</span>
                  </div>
                )}
              />

              <div style={{ padding: "20px" }}>
                <Button
                  text="Logout"
                  type="danger"
                  stylingMode="outlined"
                  icon="runner"
                  width="100%"
                  onClick={handleLogout}
                />
              </div>

              <div style={{ flex: 1 }} />
              <div className="nav-footer small">v0.1 • Presentation demo</div>
            </div>
          )}
        >
          <header className="admin-topbar">
            <Toolbar>
              <ToolbarItem
                location="before"
                widget="dxButton"
                options={{
                  icon: "menu",
                  stylingMode: "text",
                  onClick: () => setOpened(!opened),
                  elementAttr: { class: "menu-button-white" } // Helper class if needed
                }}
              />

              <ToolbarItem
                template={() => (
                  <div className="top-title" style={{ color: "white", fontWeight: "bold", fontSize: "1.2rem" }}>
                    Admin • OncoMind
                  </div>
                )}
              />

              <ToolbarItem
                location="after"
                template={() => (
                  <div className="top-actions" style={{ display: "flex", alignItems: "center", gap: "15px" }}>
                    {/* Refresh Button - Forced White Icon */}
                    <Button
                      icon="refresh"
                      stylingMode="text"
                      onClick={() => window.location.reload()}
                      elementAttr={{ style: { color: "white" } }}
                    />

                    {/* 👇 2. UPDATE THIS DROPDOWN (Safe Template Syntax) */}

                  </div>
                )}
              />
            </Toolbar>
          </header>


          <main className="admin-content">
            <Outlet />
          </main>
        </Drawer>
      </div>
    </>
  );
}