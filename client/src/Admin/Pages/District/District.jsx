import React, { useEffect, useState } from "react";
import style from "./District.module.css";
import SearchIcon from "@mui/icons-material/Search";
import DeleteOutlineIcon from "@mui/icons-material/DeleteOutline";
import EditOutlinedIcon from "@mui/icons-material/EditOutlined";
import AddIcon from "@mui/icons-material/Add";
import LocationOnOutlinedIcon from "@mui/icons-material/LocationOnOutlined";
import axios from "axios";

const District = () => {
  const [district, setDistrict] = useState("");
  const [list, setList] = useState([]);
  const [search, setSearch] = useState("");
  const [showForm, setShowForm] = useState(false);
  const [editId, setEditId] = useState(null);

  const loadDistricts = () => {
    axios
      .get("http://localhost:5000/district")
      .then((res) => setList(res.data.districtData || []))
      .catch((err) => console.log(err));
  };

  useEffect(() => {
    loadDistricts();
  }, []);

  const handleSave = () => {
    if (!district.trim()) {
      alert("Enter district name");
      return;
    }

    if (editId) {
      axios
        .put(`http://localhost:5000/district/${editId}`, {
          districtName: district,
        })
        .then(() => {
          setEditId(null);
          setDistrict("");
          setShowForm(false);
          loadDistricts();
        })
        .catch((err) => console.log(err));
    } else {
      axios
        .post("http://localhost:5000/district", {
          districtName: district,
        })
        .then(() => {
          setDistrict("");
          setShowForm(false);
          loadDistricts();
        })
        .catch((err) => console.log(err));
    }
  };

  const handleDelete = (id) => {
    if (!window.confirm("Delete this district?")) return;

    axios
      .delete(`http://localhost:5000/district/${id}`)
      .then(loadDistricts)
      .catch((err) => console.log(err));
  };

  const startEdit = (item) => {
    setEditId(item._id);
    setDistrict(item.districtName);
    setShowForm(true);
  };

  const filteredList = list.filter((d) =>
    d.districtName?.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className={style.page}>
      <div className={style.header}>
        <div>
          <h2>District Management</h2>
          <p>Manage warehouse districts for ColdCore inventory.</p>
        </div>

        <button className={style.addBtn} onClick={() => setShowForm(true)}>
          <AddIcon /> Add District
        </button>
      </div>

      <div className={style.statsRow}>
        <div className={style.statCard}>
          <h3>{list.length}</h3>
          <p>Total Districts</p>
        </div>

        <div className={style.statCard}>
          <h3>{filteredList.length}</h3>
          <p>Filtered Results</p>
        </div>
      </div>

      {showForm && (
        <div className={style.formBox}>
          <input
            type="text"
            placeholder="District Name"
            value={district}
            onChange={(e) => setDistrict(e.target.value)}
          />

          <div className={style.formButtons}>
            <button className={style.saveBtn} onClick={handleSave}>
              {editId ? "Update District" : "Save District"}
            </button>

            <button
              className={style.cancelBtn}
              onClick={() => {
                setShowForm(false);
                setDistrict("");
                setEditId(null);
              }}
            >
              Cancel
            </button>
          </div>
        </div>
      )}

      <div className={style.searchBox}>
        <SearchIcon className={style.searchIcon} />
        <input
          type="text"
          placeholder="Search districts..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </div>

      <div className={style.tableCard}>
        <table className={style.table}>
          <thead>
            <tr>
              <th>DISTRICT</th>
              <th>ACTIONS</th>
            </tr>
          </thead>

          <tbody>
            {filteredList.length > 0 ? (
              filteredList.map((item) => (
                <tr key={item._id}>
                  <td>
                    <div
                      style={{
                        display: "flex",
                        alignItems: "center",
                        gap: "12px",
                      }}
                    >
                      <LocationOnOutlinedIcon style={{ color: "#38bdf8" }} />
                      {item.districtName}
                    </div>
                  </td>

                  <td className={style.actions}>
                    <EditOutlinedIcon
                      className={style.editIcon}
                      onClick={() => startEdit(item)}
                    />
                    <DeleteOutlineIcon
                      className={style.deleteIcon}
                      onClick={() => handleDelete(item._id)}
                    />
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="2" style={{ textAlign: "center", padding: "20px" }}>
                  No districts found
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default District;