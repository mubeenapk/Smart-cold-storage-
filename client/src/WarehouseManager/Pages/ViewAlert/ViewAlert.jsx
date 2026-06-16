import React, { useEffect, useState } from "react";
import axios from "axios";
import { io } from "socket.io-client";
import styles from "./ViewAlert.module.css";

const socket = io("http://localhost:5000");

const ViewAlert = () => {

  const [alerts, setAlerts] = useState([]);
  const [filterSeverity, setFilterSeverity] = useState("all");
  const [filterType, setFilterType] = useState("all");

  const wid = sessionStorage.getItem("wid");

  // 🔹 Initial Load
  const loadAlerts = () => {
    axios
      .get(`http://localhost:5000/alerts/${wid}`)
      .then((res) => {
        setAlerts(res.data.data);
      })
      .catch((err) => console.log(err));
  };

  useEffect(() => {
    loadAlerts();

    // 🔥 REAL-TIME ALERT LISTENER
    socket.on("newAlert", (newAlert) => {
      // Only add alert if it belongs to this warehouse
      if (newAlert.warehouseId === wid) {
        setAlerts((prev) => [newAlert, ...prev]);
      }
    });

    return () => {
      socket.off("newAlert");
    };

  }, [wid]);

  // 🔹 Row color
  const getRowClass = (severity) => {
    if (severity === "critical") return styles.rowCritical;
    if (severity === "warning") return styles.rowWarning;
    return "";
  };

  // 🔥 FILTER LOGIC
  const filteredAlerts = alerts.filter((a) => {
    const severityMatch =
      filterSeverity === "all" || a.severity === filterSeverity;

    const typeMatch =
      filterType === "all" || a.type === filterType;

    return severityMatch && typeMatch;
  });

  return (
    <div className={styles.container}>

      <h2 className={styles.title}>Warehouse Alerts</h2>

      {/* 🔥 FILTER UI */}
      <div className={styles.filters}>

        <select
          value={filterSeverity}
          onChange={(e) => setFilterSeverity(e.target.value)}
        >
          <option value="all">All Severity</option>
          <option value="critical">Critical</option>
          <option value="warning">Warning</option>
          <option value="info">Info</option>
        </select>

        <select
          value={filterType}
          onChange={(e) => setFilterType(e.target.value)}
        >
          <option value="all">All Types</option>
          <option value="temperature">Temperature</option>
          <option value="expiry">Expiry</option>
          <option value="equipment">Equipment</option>
          <option value="door">Door</option>
        </select>

      </div>

      {filteredAlerts.length === 0 ? (

        <div className={styles.empty}>
          No alerts found
        </div>

      ) : (

        <table className={styles.table}>

          <thead>
            <tr>
              <th>Type</th>
              <th>Product</th>
              <th>Message</th>
              <th>Time</th>
              <th>Severity</th>
            </tr>
          </thead>

          <tbody>

            {filteredAlerts.map((a, index) => (

              <tr key={index} className={getRowClass(a.severity)}>

                <td className={styles.type}>
                  {a.type === "expiry" && "Expiry"}
                  {a.type === "temperature" && "Temperature"}
                  {a.type === "equipment" && "Equipment"}
                  {a.type === "door" && "Door"}
                </td>

                <td>
                  {a.productId?.name || "N/A"}
                </td>

                <td className={styles.message}>
                  {a.message}
                </td>

                <td>
                  {new Date(a.createdAt).toLocaleString()}
                </td>

                <td>
                  <span
                    className={`${styles.badge} ${styles[a.severity]}`}
                  >
                    {a.severity}
                  </span>
                </td>

              </tr>

            ))}

          </tbody>

        </table>

      )}

    </div>
  );
};

export default ViewAlert;