import React from "react";
import styles from "./StatusBadge.module.css";

const StatusBadge = ({ value }) => {
  const status = value?.toLowerCase() || "active";

  return (
    <span className={styles[status] || styles.active}>
      {value}
    </span>
  );
};

export default StatusBadge;