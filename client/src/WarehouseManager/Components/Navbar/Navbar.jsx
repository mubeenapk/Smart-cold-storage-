import React, { useState } from "react";
import style from "./Navbar.module.css";
import { Link } from "react-router-dom";
import {
  Package,
  Users,
  Bell,
  LayoutPanelTop,
  Thermometer,
  ChevronDown,
  UserCircle2,
  Settings,
  KeyRound,
} from "lucide-react";

const Navbar = () => {
  const [open, setOpen] = useState(false);

  return (
    <div className={style.navbar}>
      <div className={style.logo}>
        <span className={style.logoIcon}>❄</span>
        <div>
          <h2 className={style.c}>ColdCore</h2>
          <p>Warehouse Panel</p>
        </div>
      </div>

      <div className={style.nav}>
        <Link to="/warehouse/addproduct" className={style.link}>
          <Package size={16} />
          Add Product
        </Link>

        <Link to="/warehouse/viewstaffsection" className={style.link}>
          <Users size={16} />
          Staff Section
        </Link>

        <Link to="/warehouse/viewalert" className={style.link}>
          <Bell size={16} />
          Alerts
        </Link>

        <Link to="/warehouse/section" className={style.link}>
          <LayoutPanelTop size={16} />
          Sections
        </Link>

        <Link to="/warehouse/staff" className={style.link}>
          <Users size={16} />
          Staff
        </Link>

        <Link to="/warehouse/temperaturemonitor" className={style.link}>
          <Thermometer size={16} />
          Temperature
        </Link>

        <div className={style.dropdown}>
          <button
            className={style.profile}
            onClick={() => setOpen(!open)}
          >
            <UserCircle2 size={18} />
            Profile
            <ChevronDown size={16} className={open ? style.rotate : ""} />
          </button>

          {open && (
            <div className={style.dropdownMenu}>
              <Link to="/warehouse/myprofile" className={style.dropItem}>
                <UserCircle2 size={16} />
                My Profile
              </Link>

              <Link to="/warehouse/editprofile" className={style.dropItem}>
                <Settings size={16} />
                Edit Profile
              </Link>

              <Link to="/warehouse/changepassword" className={style.dropItem}>
                <KeyRound size={16} />
                Change Password
              </Link>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Navbar;