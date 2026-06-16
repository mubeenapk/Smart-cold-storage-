import React, { useEffect, useState } from "react";
import styles from "./Category.module.css";
import axios from "axios";
import { Search, Pencil, Trash2, Plus, LayoutGrid } from "lucide-react";

const Category = () => {
  const [categories, setCategories] = useState([]);
  const [search, setSearch] = useState("");
  const [value, setValue] = useState("");
  const [editId, setEditId] = useState(null);
  const [showForm, setShowForm] = useState(false);

  const loadCategories = async () => {
    try {
      const res = await axios.get("http://localhost:5000/category");
      setCategories(res.data.categoryData || []);
    } catch (err) {
      console.log("Error loading categories:", err);
    }
  };

  useEffect(() => {
    loadCategories();
  }, []);

  const handleSave = async () => {
    if (!value.trim()) return alert("Enter category name");

    try {
      if (editId) {
        await axios.put(`http://localhost:5000/category/${editId}`, {
          categoryName: value,
        });
      } else {
        await axios.post("http://localhost:5000/category", {
          categoryName: value,
        });
      }

      setValue("");
      setEditId(null);
      setShowForm(false);
      loadCategories();
    } catch (err) {
      console.log("Error saving category:", err);
      alert("Something went wrong while saving category.");
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Delete this category?")) return;

    try {
      await axios.delete(`http://localhost:5000/category/${id}`);
      loadCategories();
    } catch (err) {
      console.log("Error deleting category:", err);
      alert("Something went wrong while deleting category.");
    }
  };

  const startEdit = (item) => {
    setEditId(item._id);
    setValue(item.categoryName);
    setShowForm(true);
  };

  const filteredCategories = categories.filter((item) =>
    item.categoryName?.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className={styles.page}>
      <div className={styles.header}>
        <div>
          <h2>Category Management</h2>
          <p>Manage product categories for ColdCore inventory.</p>
        </div>

        <button
          className={styles.addBtn}
          onClick={() => {
            setShowForm(true);
            setEditId(null);
            setValue("");
          }}
        >
          <Plus size={18} /> Add Category
        </button>
      </div>

      <div className={styles.statsRow}>
        <div className={styles.statCard}>
          <h3>{categories.length}</h3>
          <p>Total Categories</p>
        </div>

        <div className={styles.statCard}>
          <h3>{filteredCategories.length}</h3>
          <p>Filtered Results</p>
        </div>
      </div>

      {showForm && (
        <div className={styles.formBox}>
          <input
            type="text"
            placeholder="Category Name"
            value={value}
            onChange={(e) => setValue(e.target.value)}
          />

          <div className={styles.formButtons}>
            <button className={styles.saveBtn} onClick={handleSave}>
              {editId ? "Update Category" : "Save Category"}
            </button>

            <button
              className={styles.cancelBtn}
              onClick={() => {
                setShowForm(false);
                setValue("");
                setEditId(null);
              }}
            >
              Cancel
            </button>
          </div>
        </div>
      )}

      <div className={styles.searchBox}>
        <Search size={18} className={styles.searchIcon} />
        <input
          type="text"
          placeholder="Search categories..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </div>

      <div className={styles.tableCard}>
        <table className={styles.table}>
          <thead>
            <tr>
              <th>CATEGORY</th>
              <th>ACTIONS</th>
            </tr>
          </thead>

          <tbody>
            {filteredCategories.map((item) => (
              <tr key={item._id}>
                <td>
                  <div className={styles.nameCell}>
                    <LayoutGrid size={18} className={styles.categoryIcon} />
                    {item.categoryName}
                  </div>
                </td>

                <td className={styles.actions}>
                  <Pencil
                    className={styles.editIcon}
                    size={18}
                    onClick={() => startEdit(item)}
                  />
                  <Trash2
                    className={styles.deleteIcon}
                    size={18}
                    onClick={() => handleDelete(item._id)}
                  />
                </td>
              </tr>
            ))}

            {filteredCategories.length === 0 && (
              <tr>
                <td colSpan="2" className={styles.emptyState}>
                  No categories found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Category;