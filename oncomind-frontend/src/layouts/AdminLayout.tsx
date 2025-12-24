import React, { useEffect, useState } from "react";
import { Outlet, useNavigate, useLocation } from "react-router-dom";
import Drawer from "devextreme-react/drawer";
import TreeView from "devextreme-react/tree-view";
import { Toolbar, Item as ToolbarItem } from "devextreme-react/toolbar";
import DropDownButton from "devextreme-react/drop-down-button";
import Button from "devextreme-react/button";
import "../styles/adminlayout.css";

type NavItem = { id: string; text: string; icon?: string; path?: string; items?: NavItem[] };

const navItems: NavItem[] = [
  { id: "home", text: "Overview", icon: "home", path: "/admin" },
  {
    id: "data",
    text: "Data",
    icon: "folder",
    items: [
      { id: "datasets", text: "Datasets", icon:"doc", path: "/admin/datasets" },
      { id: "models", text: "Models", icon: "chart", path: "/admin/models" },

    ],
  },
  { id: "patients", text: "Patients", icon: "user", path: "/admin/patients" },
  { id: "analytics", text:"Analytics", icon: "event", path: "/admin/analytics"},
  { id: "drug_candidates", text: "Drug Candidates", icon: "formula", path: "/admin/drug_candidates" },
  { id: "settings", text: "Settings", icon: "preferences", path: "/admin/settings" },
];

export default function AdminLayout() {
  const navigate = useNavigate();
  const location = useLocation();
  const [opened, setOpened] = useState<boolean>(true);
  const [drawerMode, setDrawerMode] = useState<"shrink" | "over">("shrink");
  const [selectedItem, setSelectedItem] = useState<string | null>(null);

  useEffect(() => {
    // select nav item by path
    const p = location.pathname;
    const find = (items: NavItem[]): string | null => {
      for (const it of items) {
        if (it.path === p) return it.id;
        if (it.items) {
          const r = find(it.items);
          if (r) return r;
        }
      }
      return null;
    };
    setSelectedItem(find(navItems));
  }, [location.pathname]);

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

  const userMenuItems = [
    { text: "Profile", onClick: () => navigate("/admin/profile") },
    { text: "Settings", onClick: () => navigate("/admin/settings") },
    { text: "Sign out", onClick: () => alert("Sign out (demo)") },
  ];

  return (
    <>
      <body className="dx-viewport">
        <div className="admin-root">
          <Drawer
            opened={opened}
            openedStateMode="shrink"   // always valid and closest to material design side-nav
            position="left"
            revealMode="slide"
            shading={false}
            component={() => (
              <div className="nav-shell" role="navigation">
                <div className="nav-brand">
                  <div className="nav-logo" />
                  <div className="nav-title">OncoMind</div>
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
                  }}
                />

                <ToolbarItem
                  location="center"
                  template={() => <div className="top-title">Admin • OncoMind</div>}
                />

                <ToolbarItem
                  location="after"
                  template={() => (
                    <div className="top-actions">
                      <Button icon="refresh" stylingMode="text" onClick={() => window.location.reload()} />
                      <DropDownButton
                        displayExpr="text"
                        dropDownOptions={{ width: 180 }}
                        stylingMode="text"
                        icon="user"
                        items={userMenuItems}
                        onItemClick={(e: any) => e.itemData.onClick()}
                      />
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
      </body>
    </>

  );
}
