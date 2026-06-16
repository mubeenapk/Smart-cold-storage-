import React from "react";
import styles from "./PageHeader.module.css";

const PageHeader = ({ title, subtitle, action }) => {
  return (
    <div className={styles.header}>
      <div>
        <p className={styles.kicker}>COLDCORE MANAGEMENT</p>
        <h2>{title}</h2>
        <span>{subtitle}</span>
      </div>

      {action && <div>{action}</div>}
    </div>
  );
};

export default PageHeader;