import React from "react";
import style from "./Sidebar.module.css";
import { NavLink } from "react-router-dom";
import {
  LayoutDashboard,
  MapPinned,
  Shapes,
  Layers3,
  PackageSearch,
  UserPlus,
  MessageSquareWarning,
  Snowflake,
  ChevronRight,
  ShieldCheck,
  PanelLeftClose,
  PanelLeftOpen,
} from "lucide-react";

const Sidebar = ({ collapsed, setCollapsed }) => {
  const menuItems = [
    { to: "/admin", label: "Dashboard", icon: <LayoutDashboard size={18} /> },
    { to: "/admin/district", label: "Districts", icon: <MapPinned size={18} /> },
    { to: "/admin/category", label: "Categories", icon: <Shapes size={18} /> },
    { to: "/admin/subcategory", label: "Subcategories", icon: <Layers3 size={18} /> },
    { to: "/admin/producttemplate", label: "Product Templates", icon: <PackageSearch size={18} /> },
    { to: "/admin/adminregistration", label: "Admin Registration", icon: <UserPlus size={18} /> },
    { to: "/admin/viewcomplaint", label: "Complaints", icon: <MessageSquareWarning size={18} /> },
  ];

  return (
    <aside className={`${style.sidebar} ${collapsed ? style.collapsed : ""}`}>
      {/* Top */}
      <div className={style.topSection}>
        <div className={style.brand}>
          <div className={style.logoBox}>
            <Snowflake size={18} />
          </div>

          {!collapsed && (
            <div>
              <h2>ColdCore</h2>
              <p>Admin Intelligence</p>
            </div>
          )}
        </div>

        <button className={style.collapseBtn} onClick={() => setCollapsed(!collapsed)}>
          {collapsed ? <PanelLeftOpen size={18} /> : <PanelLeftClose size={18} />}
        </button>
      </div>

      {/* Menu */}
      <div className={style.menuWrap}>
        {!collapsed && <p className={style.menuTitle}>Navigation</p>}

        <nav className={style.menu}>
          {menuItems.map((item, index) => (
            <NavLink
              key={index}
              to={item.to}
              end={item.to === "/admin"}
              className={({ isActive }) =>
                isActive ? `${style.link} ${style.active}` : style.link
              }
            >
              <div className={style.linkLeft}>
                {item.icon}
                {!collapsed && <span>{item.label}</span>}
              </div>

              {!collapsed && <ChevronRight size={16} className={style.arrow} />}
            </NavLink>
          ))}
        </nav>
      </div>

      {/* Bottom */}
      {!collapsed && (
        <div className={style.systemCard}>
          <div className={style.systemIcon}>
            <ShieldCheck size={18} />
          </div>
          <div>
            <h4>System Secure</h4>
            <p>Cold-chain core integrity active</p>
          </div>
        </div>
      )}
    </aside>
  );
};

export default Sidebar;