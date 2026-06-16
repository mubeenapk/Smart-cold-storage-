import React, { useEffect, useState } from "react";
import style from "./Subcategory.module.css";
import SearchIcon from "@mui/icons-material/Search";
import DeleteOutlineIcon from "@mui/icons-material/DeleteOutline";
import EditOutlinedIcon from "@mui/icons-material/EditOutlined";
import AddIcon from "@mui/icons-material/Add";
import CategoryOutlinedIcon from "@mui/icons-material/CategoryOutlined";
import axios from "axios";

const Subcategory = () => {
  const [subcategory, setSubcategory] = useState("");
  const [category, setCategory] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState("");
  const [list, setList] = useState([]);
  const [search, setSearch] = useState("");
  const [showForm, setShowForm] = useState(false);
  const [totalProducts, setTotalProducts] = useState(0);
  const [editId, setEditId] = useState(null);

  const loadCategory = () => {
    axios
      .get("http://localhost:5000/category")
      .then((res) => setCategory(res.data.categoryData));
  };

  const loadSubcategory = () => {
    axios.get("http://localhost:5000/subcategory").then((res) => {
      setList(res.data.data);

      const total = res.data.data.reduce(
        (sum, s) => sum + (s.productCount || 0),
        0
      );

      setTotalProducts(total);
    });
  };

  useEffect(() => {
    loadCategory();
    loadSubcategory();
  }, []);

  const handleSave = () => {
    if (!subcategory || !selectedCategory) {
      alert("Fill all fields");
      return;
    }

    if (editId) {
      axios
        .put(`http://localhost:5000/subcategory/${editId}`, {
          subcategoryName: subcategory,
          categoryId: selectedCategory,
        })
        .then(() => {
          setEditId(null);
          setSubcategory("");
          setSelectedCategory("");
          setShowForm(false);
          loadSubcategory();
        });
    } else {
      const wid = sessionStorage.getItem("wid");

      axios
        .post("http://localhost:5000/subcategory", {
          subcategoryName: subcategory,
          categoryId: selectedCategory,
          warehouseManagerId: wid,
        })
        .then(() => {
          setSubcategory("");
          setSelectedCategory("");
          setShowForm(false);
          loadSubcategory();
        });
    }
  };

  const handleDelete = (id) => {
    if (!window.confirm("Delete this subcategory?")) return;
    axios.delete(`http://localhost:5000/subcategory/${id}`).then(loadSubcategory);
  };

  const startEdit = (item) => {
    setEditId(item._id);
    setSubcategory(item.subcategoryName);
    setSelectedCategory(item.categoryId?._id);
    setShowForm(true);
  };

  const filteredList = list.filter((s) =>
    s.subcategoryName.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className={style.page}>
      <div className={style.header}>
        <div>
          <h2>Subcategory Management</h2>
          <p>Manage product subcategories for ColdCore inventory.</p>
        </div>

        <button className={style.addBtn} onClick={() => setShowForm(true)}>
          <AddIcon /> Add Subcategory
        </button>
      </div>

      <div className={style.statsRow}>
        <div className={style.statCard}>
          <h3>{list.length}</h3>
          <p>Total Subcategories</p>
        </div>

        <div className={style.statCard}>
          <h3>{totalProducts}</h3>
          <p>Total Products</p>
        </div>
      </div>

      {showForm && (
        <div className={style.formBox}>
          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
          >
            <option value="">Select Category</option>
            {category.map((cat) => (
              <option key={cat._id} value={cat._id}>
                {cat.categoryName}
              </option>
            ))}
          </select>

          <input
            type="text"
            placeholder="Subcategory Name"
            value={subcategory}
            onChange={(e) => setSubcategory(e.target.value)}
          />

          <div className={style.formButtons}>
            <button className={style.saveBtn} onClick={handleSave}>
              {editId ? "Update Subcategory" : "Save Subcategory"}
            </button>

            <button
              className={style.cancelBtn}
              onClick={() => {
                setShowForm(false);
                setSubcategory("");
                setSelectedCategory("");
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
          placeholder="Search subcategories..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </div>

      <div className={style.tableCard}>
        <table className={style.table}>
          <thead>
            <tr>
              <th>SUBCATEGORY</th>
              <th>CATEGORY</th>
              <th>PRODUCTS</th>
              <th>ACTIONS</th>
            </tr>
          </thead>

          <tbody>
            {filteredList.map((item) => (
              <tr key={item._id}>
                <td>
                  <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
                    <CategoryOutlinedIcon style={{ color: "#38bdf8" }} />
                    {item.subcategoryName}
                  </div>
                </td>

                <td>{item.categoryId?.categoryName}</td>
                <td>{item.productCount || 0}</td>

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
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Subcategory;