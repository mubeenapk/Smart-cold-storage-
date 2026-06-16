import React, { useEffect, useState } from "react";
import Styles from "./WareHouseRegistration.module.css";
import axios from "axios";

const WareHouseRegistration = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [address, setAddress] = useState("");
  const [photo, setPhoto] = useState(null);

  const [districts, setDistricts] = useState([]);

  const [districtId, setDistrictId] = useState("");

  useEffect(() => {
    axios
      .get("http://localhost:5000/district")
      .then((r) => setDistricts(r.data.districtData));
  }, []);

  const handleSubmit = () => {
    const fd = new FormData();
    fd.append("name", name);
    fd.append("email", email);
    fd.append("password", password);
    fd.append("address", address);
    if (photo) fd.append("photo", photo);
    fd.append("districtId", districtId);
    axios
      .post("http://localhost:5000/warehouse", fd)
      .then((res) => {
        alert(res.data.message);
      })
      .catch((err) => {
        console.log(err.response?.data || err.message);
      });
  };

  return (
    <div className={Styles.container}>
      <div className={Styles.subcontainer}>
        <h2 align="center" className={Styles.hd}>
          REGISTRATION
        </h2>
        <input
          type="text"
          placeholder="Enter First Name"
          className={Styles.inp}
          onChange={(e) => setName(e.target.value)}
        />

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

        <textarea
          placeholder="Enter Address"
          className={Styles.inp}
          onChange={(e) => setAddress(e.target.value)}
        ></textarea>

        <input
          type="file"
          className={Styles.inp}
          onChange={(e) => setPhoto(e.target.files[0])}
        />

        {/* District dropdown (design only) */}
        <select
          className={Styles.inp}
          value={districtId}
          onChange={(e) => setDistrictId(e.target.value)}
        >
          <option value="">-- select district --</option>
          {districts.map((d) => (
            <option key={d._id} value={d._id}>
              {d.districtName}
            </option>
          ))}
        </select>

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

export default WareHouseRegistration;
