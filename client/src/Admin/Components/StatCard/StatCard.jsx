import React from "react";
import styles from "./StatCard.module.css";
import { ArrowUpRight } from "lucide-react";

const StatCard = ({ icon, title, value, trend, danger }) => {
  return (
    <div className={styles.card}>
      <div className={styles.top}>
        <div className={styles.iconBox}>{icon}</div>
        {trend && (
          <div className={danger ? styles.trendDanger : styles.trend}>
            {trend} <ArrowUpRight size={14} />
          </div>
        )}
      </div>

      <h3>{value}</h3>
      <p>{title}</p>
    </div>
  );
};

export default StatCard;