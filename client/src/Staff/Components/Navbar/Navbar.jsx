import React, { useState } from "react";
import { Link } from "react-router-dom";
import style from "./Navbar.module.css";
import {
  Package,
  MessageSquareWarning,
  ChevronDown,
  UserCircle2,
  Settings,
  KeyRound,
  Snowflake
} from "lucide-react";

const Navbar = () => {

  const [open, setOpen] = useState(false);

  return (
    <div className={style.navbar}>

      {/* Logo */}
      <div className={style.logo}>

        <div className={style.logoIcon}>
          <Snowflake size={18}/>
        </div>

        <div>
          <h2>ColdCore</h2>
          <p>Staff Panel</p>
        </div>

      </div>

      {/* Menu */}
      <div className={style.nav}>

        <Link to="/staff/viewproducts" className={style.link}>
          <Package size={16}/>
          Products
        </Link>

        <Link to="/staff/complaint" className={style.link}>
          <MessageSquareWarning size={16}/>
          Complaint
        </Link>

        {/* Profile Dropdown */}
        <div className={style.dropdown}>

          <button
            className={style.profile}
            onClick={() => setOpen(!open)}
          >
            <UserCircle2 size={18}/>
            Profile
            <ChevronDown size={16} className={open ? style.rotate : ""}/>
          </button>

          {open && (
            <div className={style.dropdownMenu}>

              <Link to="/staff/myprofile" className={style.dropItem}>
                <UserCircle2 size={16}/>
                My Profile
              </Link>

              <Link to="/staff/editprofile" className={style.dropItem}>
                <Settings size={16}/>
                Edit Profile
              </Link>

              <Link to="/staff/changepassword" className={style.dropItem}>
                <KeyRound size={16}/>
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