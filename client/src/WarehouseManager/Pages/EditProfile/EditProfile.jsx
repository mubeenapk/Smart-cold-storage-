import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const EditProfile = () => {
  const nav = useNavigate();
  const wid = sessionStorage.getItem("wid");
  if (!wid) return null;

  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [districts, setDistricts] = useState([]);
  const [districtId, setDistrictId] = useState("");

  /* 1. districts */
  useEffect(() => {
    axios
      .get("http://localhost:5000/district")
      .then((r) => setDistricts(r.data.districtData));
  }, []);

  /* 2. user + current selections */
  useEffect(() => {
    axios.get(`http://localhost:5000/warehouse/${wid}`).then((res) => {
      const u = res.data.data;
      setFullName(u.fullName);
      setEmail(u.email);
      setDistrictId(u.districtId);
    });
  }, [wid]);

  /* 4. save */
  const handleSave = () => {
    axios
      .put(`http://localhost:5000/warehouse/${wid}`, {
        fullName,
        email,
        districtId,
      })
      .then(() => alert("Profile updated"))
      .catch(() => alert("Update failed"));
  };

  /* 5. render */
  return (
    <div style={{ padding: 20 }}>
      <h3>Edit Profile</h3>
      <table border="1" cellPadding="8">
        <tbody>
          <tr>
            <td>Name</td>
            <td>
              <input
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
              />
            </td>
          </tr>
          <tr>
            <td>Email</td>
            <td>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </td>
          </tr>
          <tr>
            <td>District</td>
            <td>
              <select
                value={districtId}
                onChange={(e) => setDistrictId(e.target.value)}
              >
                <option value="">-- select --</option>
                {districts.map((d) => (
                  <option key={d._id} value={d._id}>
                    {d.districtName}
                  </option>
                ))}
              </select>
            </td>
          </tr>

          <tr>
            <td colSpan="2" align="center">
              <button onClick={handleSave}>Save</button>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  );
};

export default EditProfile;
