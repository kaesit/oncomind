import React, { useState } from "react";
import { Outlet } from "react-router-dom";
import Drawer from "devextreme-react/drawer";
import List from "devextreme-react/list";
import { Toolbar, Item as ToolbarItem } from "devextreme-react/toolbar";
import "../styles/adminlayout.css";

const menuItems = [
  { id: 1, text: "Admin Home", path: "/admin", icon: "home" },
  { id: 2, text: "Users", path: "/admin/users", icon: "group" },
  { id: 3, text: "Datasets", path: "/admin/datasets", icon: "folder" },
  { id: 4, text: "Models", path: "/admin/models", icon: "chart" },
  { id: 5, text: "Experiments", path: "/admin/experiments", icon: "flask" },
  { id: 6, text: "Settings", path: "/admin/settings", icon: "preferences" },
];

import { useNavigate } from "react-router-dom";

const AdminLayout: React.FC = () => {
  const [opened, setOpened] = useState(true);
  const navigate = useNavigate();

  return (
    <div className="admin-root">
      <Drawer
        opened={opened}
        openedStateMode="shrink"
        position="left"
        revealMode="slide"
        component={() => (
          <List
            dataSource={menuItems}
            width={240}
            onItemClick={(e: any) => navigate(e.itemData.path)}
            itemRender={(item: any) => (
              <div className="admin-menu-item">
                <i className={`dx-icon dx-icon-${item.icon}`} />
                <span>{item.text}</span>
              </div>
            )}
          />
        )}
      >
        {/* Top Navbar */}
        <div className="admin-topbar">
          <Toolbar>
            <ToolbarItem
              location="before"
              widget="dxButton"
              options={{
                icon: "menu",
                onClick: () => setOpened(!opened),
              }}
            />
            <ToolbarItem
              location="center"
              template={() => <span className="admin-title">OncoMind Admin</span>}
            />
            <ToolbarItem
              widget="dxButton"
              location="after"
              options={{
                icon: "user",
                stylingMode: "text",
              }}
            />
          </Toolbar>
        </div>

        {/* Main Content */}
        <div className="admin-content">
          <Outlet />
        </div>
      </Drawer>
    </div>
  );
};

export default AdminLayout;
