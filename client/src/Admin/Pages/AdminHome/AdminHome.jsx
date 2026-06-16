import React, { useState } from "react";
import styles from "./AdminHome.module.css";

import Sidebar from "../../Components/Sidebar/Sidebar";
import TopHeader from "../../Components/TopHeader/TopHeader";
import AdminRoutes from "../../../Routes/AdminRoutes";

const AdminHome = () => {
  const [collapsed, setCollapsed] = useState(false);

  return (
    <div className={styles.layout}>
      <Sidebar collapsed={collapsed} setCollapsed={setCollapsed} />

      <div className={`${styles.contentArea} ${collapsed ? styles.expanded : ""}`}>
        <TopHeader collapsed={collapsed} />
        <div className={styles.pageContent}>
          <AdminRoutes />
        </div>
      </div>
    </div>
  );
};

export default AdminHome;