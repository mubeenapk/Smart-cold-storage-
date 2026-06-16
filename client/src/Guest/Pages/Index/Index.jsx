import React, { useEffect, useState } from "react";
import axios from "axios";
import styles from "./Index.module.css";
import { useNavigate } from "react-router-dom";
import {
  Snowflake,
  ShieldCheck,
  Boxes,
  ThermometerSnowflake,
  Activity,
  ArrowRight,
  Warehouse,
  Users,
  BellRing,
} from "lucide-react";

const Index = () => {
  const navigate = useNavigate();
  const [dashboardData, setDashboardData] = useState(null);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const res = await axios.get("http://localhost:5000/admin/dashboard/", {
        headers: {
          Authorization: sessionStorage.getItem("token"),
        },
      });
      setDashboardData(res.data);
    } catch (err) {
      console.log(err);
    }
  };

  // ✅ Reusable navigation logic
  const goDashboard = () => {
    const token = sessionStorage.getItem("token");
    if (token) {
      navigate("/admin/dashboard");
    } else {
      navigate("/login");
    }
  };

  const metrics = dashboardData
    ? [
        {
          title: "Avg Storage Temp",
          value: "-24.5°C",
          icon: <ThermometerSnowflake size={20} />,
        },
        {
          title: "Active Warehouses",
          value: dashboardData.stats.totalWarehouses,
          icon: <Warehouse size={20} />,
        },
        {
          title: "Monitored Units",
          value: dashboardData.stats.totalProducts,
          icon: <Activity size={20} />,
        },
        {
          title: "Protected Inventory",
          value: dashboardData.stats.totalCategories,
          icon: <Boxes size={20} />,
        },
      ]
    : [];

  const features = [
    {
      icon: <Snowflake size={22} />,
      title: "Temperature Intelligence",
      desc: "Real-time monitoring of storage conditions across all cold-chain units.",
    },
    {
      icon: <ShieldCheck size={22} />,
      title: "Secure Operations",
      desc: "Role-based access and protected operational controls for all facilities.",
    },
    {
      icon: <Boxes size={22} />,
      title: "Inventory Visibility",
      desc: "Track categories, quantities, and storage placement without complexity.",
    },
    {
      icon: <BellRing size={22} />,
      title: "Risk Alerts",
      desc: "Receive immediate warnings for thermal deviation, stock risks, and section overloads.",
    },
  ];

  return (
    <div className={styles.container}>
      {/* NAVBAR */}
      <nav className={styles.navbar}>
        <div className={styles.logoWrap}>
          <div className={styles.logoIcon}>
            <Snowflake size={18} />
          </div>
          <div className={styles.logoText}>
            <span>COLD</span>CORE
          </div>
        </div>

        <div className={styles.navActions}>
          <button
            className={styles.ghostBtn}
            onClick={() => navigate("/registration")}
          >
            Register
          </button>

          <button
            className={styles.primaryBtn}
            onClick={() => navigate("/login")}
          >
            Login
          </button>
        </div>
      </nav>

      {/* HERO */}
      <section className={styles.hero}>
        <div className={styles.heroLeft}>
          <div className={styles.badge}>THERMAL NETWORK STATUS • STABLE</div>

          <h1>
            Premium Cold Storage
            <br />
            Intelligence for
            <br />
            Modern Warehouses
          </h1>

          <p>
            ColdCore delivers precision visibility across inventory,
            temperature, warehouse capacity, and operational risk — built for
            cold-chain excellence.
          </p>

          <div className={styles.heroButtons}>
            <button className={styles.primaryBtn} onClick={goDashboard}>
              Launch Dashboard
            </button>

            {/* <button className={styles.secondaryBtn}>
              Explore Features
            </button> */}
          </div>

          <div className={styles.heroStats}>
            <div>
              <h3>99.98%</h3>
              <span>System Stability</span>
            </div>
            <div>
              <h3>24/7</h3>
              <span>Live Monitoring</span>
            </div>
            <div>
              <h3>250ms</h3>
              <span>Alert Trigger Speed</span>
            </div>
          </div>
        </div>

        {/* RIGHT PANEL */}
        <div className={styles.heroRight}>
          <div className={styles.heroPanel}>
            <div className={styles.panelTop}>
              <span>GLOBAL TEMPERATURE AVERAGE</span>
              <div className={styles.liveDot}></div>
            </div>

            <div className={styles.tempValue}>-24.5°C</div>

            <div className={styles.panelGrid}>
              <div className={styles.panelCard}>
                <span>Critical Alerts</span>
                <h4>{dashboardData?.stats?.totalAlerts || 0}</h4>
              </div>

              <div className={styles.panelCard}>
                <span>Active Units</span>
                <h4>{dashboardData?.stats?.totalProducts || 0}</h4>
              </div>

              <div className={styles.panelCard}>
                <span>Capacity Usage</span>
                <h4>
                  {dashboardData
                    ? Math.floor(Math.random() * 100) + "%"
                    : "0%"}
                </h4>
              </div>

              <div className={styles.panelCard}>
                <span>Protected Zones</span>
                <h4>{dashboardData?.stats?.totalCategories || 0}</h4>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* LIVE METRICS */}
      <section className={styles.metricsSection}>
        <div className={styles.sectionHead}>
          <p className={styles.kicker}>LIVE OPERATIONAL SNAPSHOT</p>
          <h2>Cold-chain visibility, without operational blind spots.</h2>
        </div>

        <div className={styles.metricsGrid}>
          {metrics.map((item, index) => (
            <div key={index} className={styles.metricCard}>
              <div className={styles.metricIcon}>{item.icon}</div>
              <div>
                <p>{item.title}</p>
                <h3>{item.value}</h3>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* FEATURES (unchanged) */}
      <section className={styles.featuresSection}>
        <div className={styles.sectionHead}>
          <p className={styles.kicker}>PLATFORM CAPABILITIES</p>
          <h2>Everything your cold storage operation needs in one system.</h2>
        </div>

        <div className={styles.featuresGrid}>
          {features.map((feature, index) => (
            <div key={index} className={styles.featureCard}>
              <div className={styles.featureIcon}>{feature.icon}</div>
              <h3>{feature.title}</h3>
              <p>{feature.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section className={styles.ctaSection}>
        <div className={styles.ctaCard}>
          <div>
            <p className={styles.kicker}>READY TO OPERATE</p>
            <h2>Access the ColdCore control environment.</h2>
            <p>
              Manage inventory, warehouses, temperature-sensitive assets, and
              risk alerts from one premium interface.
            </p>
          </div>

          {/* ✅ FIXED BUTTON */}
          <button className={styles.primaryBtn} onClick={goDashboard}>
            Enter Dashboard
          </button>
        </div>
      </section>

      <footer className={styles.footer}>
        <p>© 2026 ColdCore • Cold Storage Warehouse Intelligence Platform</p>
      </footer>
    </div>
  );
};

export default Index;