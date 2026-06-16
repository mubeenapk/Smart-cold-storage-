import React, { useState } from "react";
import Styles from "./AdminRegistration.module.css";
import axios from "axios";

const AdminRegistration = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const res = await axios.post(
        "http://localhost:5000/adminregistration",
        {
          name,
          email,
          password,
        }
      );

      alert(res.data.message);
      setName("");
      setEmail("");
      setPassword("");
    } catch (err) {
      alert(err.response?.data?.message || "Something went wrong");
    }
  };

  return (
    <div className={Styles.container}>
      <div className={Styles.card}>
        <h2 className={Styles.title}>Admin Registration</h2>

        <form onSubmit={handleSubmit}>
          <div className={Styles.formGroup}>
            <input
              type="text"
              placeholder="Enter full name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
            />
          </div>

          <div className={Styles.formGroup}>
            <input
              type="email"
              placeholder="Enter email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>

          <div className={Styles.formGroup}>
            <input
              type="password"
              placeholder="Enter password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>

          <button type="submit" className={Styles.button}>
            Create Account
          </button>
        </form>
      </div>
    </div>
  );
};

export default AdminRegistration;