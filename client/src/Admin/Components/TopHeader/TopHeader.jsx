import React from "react";
import styles from "./TopHeader.module.css";
import {
  Search,
  Bell,
  PanelLeftClose,
  PanelLeftOpen,
} from "lucide-react";

const TopHeader = ({ collapsed }) => {
  return (
    <header className={styles.topHeader}>
      <div className={styles.left}>
        <button className={styles.menuBtn}>
          {collapsed ? <PanelLeftOpen size={18} /> : <PanelLeftClose size={18} />}
        </button>

        <div className={styles.searchBox}>
          <Search size={16} />
          <input type="text" placeholder="Search warehouses, categories, alerts..." />
        </div>
      </div>

      <div className={styles.right}>
        <button className={styles.iconBtn}>
          <Bell size={18} />
        </button>

        <div className={styles.profileCard}>
          <div className={styles.avatar}>A</div>
          <div>
            <h4>Admin Core</h4>
            <p>Super Administrator</p>
          </div>
        </div>
      </div>
    </header>
  );
};

export default TopHeader;