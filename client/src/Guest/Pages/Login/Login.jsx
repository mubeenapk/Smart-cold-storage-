import React, { useState } from "react";
import Styles from "./Login.module.css";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const handleLogin = () => {
    axios
      .post("http://localhost:5000/login", { email, password })
      .then((res) => {
        const { role, id, name, message, token } = res.data;

        alert(message);

        sessionStorage.setItem("token", token); // ✅ IMPORTANT

        if (role === "admin") {
          sessionStorage.setItem("aid", id);
          sessionStorage.setItem("adminName", name);
          navigate("/admin/");
        }

        if (role === "Warehouse") {
          sessionStorage.setItem("wid", id);
          sessionStorage.setItem("warehouseName", name);
          navigate("/warehouse/");
        }

        if (role === "Staff") {
          sessionStorage.setItem("sid", id);
          sessionStorage.setItem("staffName", name);
          navigate("/staff/");
        }
      })
      .catch((err) => {
        console.log(err.response);
        alert(err.response?.data?.message || "Login failed");
      });
  };

  return (
    <div className={Styles.container}>
      <div className={Styles.subcontainer}>
        <div className="card">
          <h2>LOGIN</h2>
        </div>

        <input
          type="email"
          placeholder="Enter Email"
          className={Styles.inp}
          onChange={(e) => setEmail(e.target.value)}
        />

        <input
          type="password"
          placeholder="Enter Password"
          className={Styles.inp}
          onChange={(e) => setPassword(e.target.value)}
        />

        <div className={Styles.cntr}>
          <button className={Styles.sb} onClick={handleLogin}>
            Login
          </button>
        </div>
      </div>
    </div>
  );
};

export default Login;
