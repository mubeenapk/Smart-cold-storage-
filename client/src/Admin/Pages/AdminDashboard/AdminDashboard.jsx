import React, { useEffect, useState } from "react";
import axios from "axios";
import styles from "./AdminDashboard.module.css";
import {
  Warehouse,
  Users,
  Boxes,
  LayoutGrid,
  AlertTriangle,
  ThermometerSnowflake,
  Activity,
  ShieldCheck,
  ArrowUpRight,
} from "lucide-react";

const AdminDashboard = () => {
  const [data, setData] = useState(null);

  useEffect(() => {
    fetchDashboard();
  }, []);

  const fetchDashboard = async () => {
    try {
      const res = await axios.get("http://localhost:5000/admin/dashboard/", {
        headers: {
          Authorization: sessionStorage.getItem("token"),
        },
      });
      setData(res.data);
    } catch (err) {
      console.log(err);
    }
  };

  if (!data) {
    return (
      <div className={styles.loadingScreen}>
        <div className={styles.loadingCard}>
          <h2>Initializing ColdCore Admin Console...</h2>
          <p>Syncing cold-chain telemetry and warehouse intelligence.</p>
        </div>
      </div>
    );
  }

  const stats = [
    {
      title: "Warehouses",
      value: data.stats.totalWarehouses,
      icon: <Warehouse size={20} />,
      trend: "+8%",
    },
    {
      title: "Staff",
      value: data.stats.totalStaff,
      icon: <Users size={20} />,
      trend: "+12%",
    },
    {
      title: "Products",
      value: data.stats.totalProducts,
      icon: <Boxes size={20} />,
      trend: "+5%",
    },
    {
      title: "Categories",
      value: data.stats.totalCategories,
      icon: <LayoutGrid size={20} />,
      trend: "+3%",
    },
    {
      title: "Alerts",
      value: data.stats.totalAlerts,
      icon: <AlertTriangle size={20} />,
      trend: "-2%",
      danger: true,
    },
  ];

  return (
    <div className={styles.dashboard}>
      <div className={styles.topBar}>
        <div>
          <p className={styles.kicker}>COLDCORE ADMIN</p>
          <h1>Operational Intelligence Console</h1>
          <span>
            Monitor warehouse activity, risk signals, and inventory performance.
          </span>
        </div>

        <div className={styles.statusBadge}>
          <div className={styles.liveDot}></div>
          System Stable
        </div>
      </div>

      <div className={styles.statsGrid}>
        {stats.map((item, index) => (
          <div key={index} className={styles.statCard}>
            <div className={styles.statTop}>
              <div className={styles.iconBox}>{item.icon}</div>
              <div className={item.danger ? styles.trendDanger : styles.trend}>
                {item.trend} <ArrowUpRight size={14} />
              </div>
            </div>
            <h2>{item.value}</h2>
            <p>{item.title}</p>
          </div>
        ))}
      </div>

      <div className={styles.mainGrid}>
        <div className={styles.leftColumn}>
          <div className={styles.panel}>
            <div className={styles.panelHeader}>
              <div>
                <h3>System Overview</h3>
                <p>Live warehouse environment snapshot</p>
              </div>
              <Activity size={18} />
            </div>

            <div className={styles.overviewGrid}>
              <div className={styles.overviewCard}>
                <div className={styles.overviewTop}>
                  <ThermometerSnowflake size={18} />
                  <span>Avg Temperature</span>
                </div>
                <h2>-24.5°C</h2>
                <small>Optimal cold-chain stability</small>
              </div>

              <div className={styles.overviewCard}>
                <div className={styles.overviewTop}>
                  <ShieldCheck size={18} />
                  <span>System Health</span>
                </div>
                <h2>98.9%</h2>
                <small>All monitoring channels active</small>
              </div>
            </div>

            <div className={styles.capacityBox}>
              <div className={styles.capacityHeader}>
                <span>Global Capacity Utilization</span>
                <strong>74%</strong>
              </div>
              <div className={styles.progressTrack}>
                <div className={styles.progressFill}></div>
              </div>
              <div className={styles.progressMeta}>
                <span>Protected cold zones active</span>
                <span>38 Sections</span>
              </div>
            </div>
          </div>

          <div className={styles.panel}>
            <div className={styles.panelHeader}>
              <div>
                <h3>Recent Warehouses</h3>
                <p>Latest registered warehouse nodes</p>
              </div>
            </div>

            <div className={styles.listWrap}>
              {data.recentWarehouses?.map((w) => (
                <div key={w._id} className={styles.listItem}>
                  <div>
                    <h4>{w.name}</h4>
                    <p>{w.email}</p>
                  </div>
                  <span className={styles[w.status?.toLowerCase()] || styles.active}>
                    {w.status}
                  </span>
                </div>
              ))}
            </div>
          </div>

          <div className={styles.panel}>
            <div className={styles.panelHeader}>
              <div>
                <h3>Recent Products</h3>
                <p>Latest inventory entries</p>
              </div>
            </div>

            <div className={styles.listWrap}>
              {data.recentProducts?.map((p) => (
                <div key={p._id} className={styles.listItem}>
                  <div>
                    <h4>{p.name}</h4>
                    <p>Inventory registered</p>
                  </div>
                  <span className={styles.low}>
                    {p.categoryId?.categoryName || "Uncategorized"}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className={styles.rightColumn}>
          <div className={styles.panel}>
            <div className={styles.panelHeader}>
              <div>
                <h3>Alert Distribution</h3>
                <p>Severity concentration overview</p>
              </div>
            </div>

            <div className={styles.alertStats}>
              <div className={styles.alertRow}>
                <span>Critical</span>
                <strong>08</strong>
              </div>
              <div className={styles.alertBar}>
                <div className={`${styles.barFill} ${styles.criticalFill}`} style={{ width: "78%" }}></div>
              </div>

              <div className={styles.alertRow}>
                <span>High</span>
                <strong>14</strong>
              </div>
              <div className={styles.alertBar}>
                <div className={`${styles.barFill} ${styles.highFill}`} style={{ width: "60%" }}></div>
              </div>

              <div className={styles.alertRow}>
                <span>Medium</span>
                <strong>10</strong>
              </div>
              <div className={styles.alertBar}>
                <div className={`${styles.barFill} ${styles.mediumFill}`} style={{ width: "45%" }}></div>
              </div>

              <div className={styles.alertRow}>
                <span>Low</span>
                <strong>06</strong>
              </div>
              <div className={styles.alertBar}>
                <div className={`${styles.barFill} ${styles.lowFill}`} style={{ width: "28%" }}></div>
              </div>
            </div>
          </div>

          <div className={styles.panel}>
            <div className={styles.panelHeader}>
              <div>
                <h3>Recent Alerts</h3>
                <p>Latest risk and system notifications</p>
              </div>
            </div>

            <div className={styles.listWrap}>
              {data.recentAlerts?.map((a) => (
                <div key={a._id} className={styles.listItem}>
                  <div>
                    <h4>{a.message}</h4>
                    <p>ColdCore alert stream</p>
                  </div>
                  <span className={styles[a.severity?.toLowerCase()] || styles.high}>
                    {a.severity}
                  </span>
                </div>
              ))}
            </div>
          </div>

          <div className={styles.panel}>
            <div className={styles.panelHeader}>
              <div>
                <h3>Quick Intelligence</h3>
                <p>Operational recommendations</p>
              </div>
            </div>

            <div className={styles.insightBox}>
              <div className={styles.insightItem}>
                <span>01</span>
                <p>Two warehouses show elevated alert frequency this week.</p>
              </div>
              <div className={styles.insightItem}>
                <span>02</span>
                <p>Frozen category inventory has increased by 12% recently.</p>
              </div>
              <div className={styles.insightItem}>
                <span>03</span>
                <p>Capacity utilization remains within safe operational thresholds.</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;