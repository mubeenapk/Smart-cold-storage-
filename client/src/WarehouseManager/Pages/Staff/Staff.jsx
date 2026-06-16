import React, { useState, useRef } from "react";
import Styles from "./Staff.module.css";
import axios from "axios";

const Staff = () => {

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [photo, setPhoto] = useState(null);

  const fileRef = useRef();

  const wid = sessionStorage.getItem("wid");

  const handleSubmit = () => {

    const fd = new FormData();
    fd.append('name', name);
    fd.append('email', email);
    fd.append('password', password);
    fd.append('warehouseManagerId', wid);

    if (photo) fd.append('photo', photo);

    axios.post('http://localhost:5000/staff', fd)
      .then((res) => {

        alert(res.data.message);

        // Reset form
        setName("");
        setEmail("");
        setPassword("");
        setPhoto(null);

        if(fileRef.current){
          fileRef.current.value = "";
        }

      })
      .catch(err => {
        console.log(err.response?.data || err.message);
      });
  }

  return (
    <div className={Styles.container}>
      <div className={Styles.subcontainer}>

        <h2 align="center" className={Styles.hd}>REGISTRATION</h2>

        <input
          type="text"
          value={name}
          placeholder="Enter First Name"
          className={Styles.inp}
          onChange={e => setName(e.target.value)}
        />

        <input
          type="email"
          value={email}
          placeholder="Enter Email"
          className={Styles.inp}
          onChange={e => setEmail(e.target.value)}
        />

        <input
          type="password"
          value={password}
          placeholder="Enter Password"
          className={Styles.inp}
          onChange={e => setPassword(e.target.value)}
        />

        <input
          type="file"
          ref={fileRef}
          className={Styles.inp}
          onChange={e => setPhoto(e.target.files[0])}
        />

        <div className={Styles.cntr}>
          <input
            type="submit"
            value="Submit"
            className={Styles.sb}
            onClick={handleSubmit}
          />
        </div>

      </div>
    </div>
  );
};

export default Staff;