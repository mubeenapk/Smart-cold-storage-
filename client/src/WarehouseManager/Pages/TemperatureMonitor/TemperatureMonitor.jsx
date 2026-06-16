import React, { useEffect, useState } from "react";
import axios from "axios";

import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  AreaChart,
  Area,
} from "recharts";

import io from "socket.io-client";
import styles from "./TemperatureMonitor.module.css";

const TemperatureMonitor = () => {
  const [data, setData] = useState([]);
  const [alerts, setAlerts] = useState([]);

  const wid = sessionStorage.getItem("wid");

  // ---------------- FETCH ----------------

  const fetchTemperature = () => {
    return axios
      .get(`http://localhost:5000/temperature/${wid}`)
      .then((res) => setData(res.data.data))
      .catch((err) => console.error("Temp error:", err));
  };

  const fetchAlerts = () => {
    return axios
      .get(`http://localhost:5000/alerts/${wid}`)
      .then((res) => setAlerts(res.data.data))
      .catch((err) => console.error("Alert error:", err));
  };

  // ---------------- SOCKET ----------------

  useEffect(() => {
    const socket = io("http://localhost:5000");

    socket.on("temperatureUpdate", (newTemp) => {
      setData((prev) => [...prev, newTemp]);
    });

    return () => {
      socket.off("temperatureUpdate");
      socket.disconnect();
    };
  }, []);

  // ---------------- AUTO REFRESH ----------------

  useEffect(() => {
    if (!wid) return;

    const loadData = () => {
      Promise.all([fetchTemperature(), fetchAlerts()]);
    };

    loadData();

    const interval = setInterval(loadData, 15000);

    return () => clearInterval(interval);
  }, [wid]);

  // ---------------- GROUP BY SECTION ----------------

  const grouped = {};

  data.forEach((d) => {
    const name = d.sectionId?.sectionName;
    if (!name) return;

    if (!grouped[name]) grouped[name] = [];

    grouped[name].push(d);

    grouped[name].sort(
      (a, b) => new Date(a.recordedAt) - new Date(b.recordedAt),
    );
  });

  // ---------------- STATUS ----------------

  const getStatus = (last) => {
    if (!last) return "normal";

    if (last.temperature > last.sectionId.maxTemp) return "critical";

    if (
      last.temperature >= last.sectionId.maxTemp - 2 ||
      last.temperature <= last.sectionId.minTemp + 2
    )
      return "warning";

    return "normal";
  };

  let normal = 0;
  let warning = 0;
  let critical = 0;

  Object.values(grouped).forEach((arr) => {
    const last = arr[arr.length - 1];
    const status = getStatus(last);

    if (status === "critical") critical++;
    else if (status === "warning") warning++;
    else normal++;
  });

  // ---------------- AVG ----------------

  let avgTemp = 0;

  if (data.length > 0) {
    const total = data.reduce((sum, d) => sum + d.temperature, 0);
    avgTemp = (total / data.length).toFixed(1);
  }

  // ---------------- UI ----------------

  return (
    <div className={styles.container}>
      <h2 className={styles.title}>Temperature Monitor</h2>
      <p className={styles.subtitle}>
        Real-time temperature across all storage sections
      </p>

      {/* SUMMARY */}
      <div className={styles.cards}>
        <div className={styles.card}>
          <p>AVG TEMPERATURE</p>
          <h3>{avgTemp}°C</h3>
        </div>

        <div className={styles.card}>
          <p>SECTIONS NORMAL</p>
          <h3>{normal}</h3>
        </div>

        <div className={styles.card}>
          <p>SECTIONS WARNING</p>
          <h3>{warning}</h3>
        </div>

        <div className={styles.card}>
          <p>SECTIONS CRITICAL</p>
          <h3>{critical}</h3>
        </div>
      </div>

      {/* CHARTS */}
      <div className={styles.charts}>
        {Object.keys(grouped).map((section) => {
          const sectionData = grouped[section].slice(-20);
          const last = sectionData[sectionData.length - 1];
          const status = getStatus(last);

          return (
            <div key={section} className={styles.chartCard}>
              <h3 className={styles[status]}>Section {section}</h3>

              <p>{sectionData[0]?.sectionId?.storageType}</p>

              <p>
                Range:
                {sectionData[0]?.sectionId?.minTemp} to{" "}
                {sectionData[0]?.sectionId?.maxTemp} °C
              </p>

              <LineChart width={450} height={220} data={sectionData}>
                <defs>
                  <linearGradient id="colorTemp" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#2563eb" stopOpacity={0.8} />
                    <stop offset="95%" stopColor="#2563eb" stopOpacity={0} />
                  </linearGradient>
                </defs>

                <CartesianGrid strokeDasharray="3 3" />

                <XAxis
                  dataKey="recordedAt"
                  tickFormatter={(t) => new Date(t).toLocaleTimeString()}
                />

                <YAxis />

                <Tooltip
                  contentStyle={{
                    backgroundColor: "#111",
                    border: "none",
                    borderRadius: "8px",
                    color: "#fff",
                  }}
                />

                <Line
                  type="monotone"
                  dataKey="temperature"
                  stroke="url(#colorTemp)"
                  strokeWidth={3}
                  dot={false}
                  isAnimationActive={true}
                  animationDuration={800}
                />
              </LineChart>

              <AreaChart data={data}>
                <defs>
                  <linearGradient id="colorTemp" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#00c6ff" stopOpacity={0.8} />
                    <stop offset="95%" stopColor="#0072ff" stopOpacity={0} />
                  </linearGradient>
                </defs>

                <Area
                  type="monotone"
                  dataKey="temperature"
                  stroke="#0072ff"
                  fill="url(#colorTemp)"
                />
                <Area
                  dataKey="temperature"
                  isAnimationActive={true}
                  animationDuration={1000}
                />
              </AreaChart>
            </div>
          );
        })}
      </div>

      {/* ALERTS */}
      <div className={styles.alertPanel}>
        <h3>Recent Alerts</h3>

        {alerts.slice(0, 5).map((a, i) => (
          <div key={i} className={`${styles.alert} ${styles[a.severity]}`}>
            {a.message}
          </div>
        ))}
      </div>
    </div>
  );
};

export default TemperatureMonitor;
