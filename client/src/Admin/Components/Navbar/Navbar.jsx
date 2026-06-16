import React from "react";
import { Link } from "react-router-dom";
import style from "./Navbar.module.css";

const Navbar = () => {
  return (
    <div className={style.navbar}>
      <div className={style.left}>
        <h3>Dashboard</h3>
      </div>

      {/* <div className={style.navLinks}>
        <Link to="viewcomplaint" className={style.link}>
          View Complaints
        </Link>
      </div> */}
    </div>
  );
};

export default Navbar;