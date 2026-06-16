import React, { useEffect, useState } from "react";
import style from "./ProductTemplate.module.css";
import axios from "axios";

import SearchIcon from "@mui/icons-material/Search";
import AddIcon from "@mui/icons-material/Add";
import EditOutlinedIcon from "@mui/icons-material/EditOutlined";
import DeleteOutlineIcon from "@mui/icons-material/DeleteOutline";
import Inventory2OutlinedIcon from "@mui/icons-material/Inventory2Outlined";

const ProductTemplate = () => {
  const [category, setCategory] = useState([]);
  const [subcategory, setSubcategory] = useState([]);
  const [list, setList] = useState([]);

  const [selectedCategory, setSelectedCategory] = useState("");
  const [selectedSubcategory, setSelectedSubcategory] = useState("");

  const [productName, setProductName] = useState("");
  const [storageType, setStorageType] = useState("");

  const [search, setSearch] = useState("");
  const [showForm, setShowForm] = useState(false);

  const [editId, setEditId] = useState(null);

  const storageOptions = [
    "Deep Freeze",
    "Frozen Storage",
    "Cooler Storage",
    "Pharma Storage",
  ];

  const loadCategory = () => {
    axios
      .get("http://localhost:5000/category")
      .then((res) => setCategory(res.data.categoryData));
  };

  const loadSubcategory = (id) => {
    axios
      .get(`http://localhost:5000/category/${id}/subcategories`)
      .then((res) => setSubcategory(res.data.data));
  };

  const loadTemplates = () => {
    axios
      .get("http://localhost:5000/producttemplate")
      .then((res) => setList(res.data.data));
  };

  useEffect(() => {
    loadCategory();
    loadTemplates();
  }, []);

  const handleSave = () => {
    if (!productName || !selectedCategory || !selectedSubcategory || !storageType) {
      alert("Fill all fields");
      return;
    }

    const payload = {
      name: productName,
      subcategoryId: selectedSubcategory,
      storageType,
    };

    if (editId) {
      axios.put(`http://localhost:5000/producttemplate/${editId}`, payload).then(() => {
        setEditId(null);
        resetForm();
        loadTemplates();
      });
    } else {
      axios.post("http://localhost:5000/producttemplate", payload).then(() => {
        resetForm();
        loadTemplates();
      });
    }
  };

  const handleDelete = (id) => {
    if (!window.confirm("Delete this product template?")) return;
    axios.delete(`http://localhost:5000/producttemplate/${id}`).then(loadTemplates);
  };

  const startEdit = (item) => {
    setEditId(item._id);
    setProductName(item.name);
    setSelectedCategory(item.subcategoryId?.categoryId?._id);
    setSelectedSubcategory(item.subcategoryId?._id);
    setStorageType(item.storageType);
    if (item.subcategoryId?.categoryId?._id) {
      loadSubcategory(item.subcategoryId.categoryId._id);
    }
    setShowForm(true);
  };

  const resetForm = () => {
    setProductName("");
    setSelectedCategory("");
    setSelectedSubcategory("");
    setStorageType("");
    setShowForm(false);
    setEditId(null);
  };

  const filtered = list.filter((p) =>
    p.name.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className={style.page}>
      <div className={style.header}>
        <div>
          <h2>Product Template Management</h2>
          <p>Manage master products for warehouse inventory setup.</p>
        </div>

        <button className={style.addBtn} onClick={() => setShowForm(true)}>
          <AddIcon /> Add Product
        </button>
      </div>

      {showForm && (
        <div className={style.formBox}>
          <select
            value={selectedCategory}
            onChange={(e) => {
              setSelectedCategory(e.target.value);
              loadSubcategory(e.target.value);
            }}
          >
            <option value="">Select Category</option>
            {category.map((c) => (
              <option key={c._id} value={c._id}>
                {c.categoryName}
              </option>
            ))}
          </select>

          <select
            value={selectedSubcategory}
            onChange={(e) => setSelectedSubcategory(e.target.value)}
          >
            <option value="">Select Subcategory</option>
            {subcategory.map((s) => (
              <option key={s._id} value={s._id}>
                {s.subcategoryName}
              </option>
            ))}
          </select>

          <input
            type="text"
            placeholder="Product Name"
            value={productName}
            onChange={(e) => setProductName(e.target.value)}
          />

          <select
            value={storageType}
            onChange={(e) => setStorageType(e.target.value)}
          >
            <option value="">Select Storage Type</option>
            {storageOptions.map((s, i) => (
              <option key={i} value={s}>
                {s}
              </option>
            ))}
          </select>

          <div className={style.formButtons}>
            <button className={style.saveBtn} onClick={handleSave}>
              {editId ? "Update Product" : "Save Product"}
            </button>

            <button className={style.cancelBtn} onClick={resetForm}>
              Cancel
            </button>
          </div>
        </div>
      )}

      <div className={style.searchBox}>
        <SearchIcon className={style.searchIcon} />
        <input
          type="text"
          placeholder="Search products..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </div>

      <div className={style.tableCard}>
        <table className={style.table}>
          <thead>
            <tr>
              <th>PRODUCT</th>
              <th>SUBCATEGORY</th>
              <th>CATEGORY</th>
              <th>STORAGE</th>
              <th>ACTIONS</th>
            </tr>
          </thead>

          <tbody>
            {filtered.map((item) => (
              <tr key={item._id}>
                <td>
                  <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
                    <Inventory2OutlinedIcon style={{ color: "#38bdf8" }} />
                    {item.name}
                  </div>
                </td>
                <td>{item.subcategoryId?.subcategoryName}</td>
                <td>{item.subcategoryId?.categoryId?.categoryName}</td>
                <td>{item.storageType}</td>
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

export default ProductTemplate;