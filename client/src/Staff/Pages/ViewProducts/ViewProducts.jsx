import axios from "axios";
import Styles from "./ViewProducts.module.css";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

const ViewProducts = () => {
  const [list, setList] = useState([]);
  const navigate = useNavigate();

  const role = sessionStorage.getItem("sid")
    ? "staff"
    : sessionStorage.getItem("wid")
    ? "warehouse"
    : sessionStorage.getItem("aid")
    ? "admin"
    : null;

  const userId =
    sessionStorage.getItem("sid") ||
    sessionStorage.getItem("wid") ||
    sessionStorage.getItem("aid");

  // ✅ LOAD PRODUCTS (FIXED WITH TOKEN)
  const loadProducts = () => {
    const token = sessionStorage.getItem("token");

    if (!token) {
      console.error("No token found. Please login again.");
      return;
    }

    if (role === "staff") {
      axios
        .get(`http://localhost:5000/product/staff/${userId}`, {
          headers: {
            Authorization: token,
          },
        })
        .then((res) => setList(res.data.data))
        .catch((err) => {
          console.error("Staff Products Error:", err);
        });
    } else {
      axios
        .get("http://localhost:5000/product", {
          headers: {
            Authorization: token,
          },
        })
        .then((res) => setList(res.data.data))
        .catch((err) => {
          console.error("All Products Error:", err);
        });
    }
  };

  useEffect(() => {
    loadProducts();
  }, []);

  // MARK AS COMPLETED
  const handleComplete = (id) => {
    axios
      .put(`http://localhost:5000/product/complete/${id}`, {
        role,
        userId,
      })
      .then((res) => {
        alert(res.data.message);
        loadProducts();
      })
      .catch((err) => {
        alert(err.response?.data?.message || "Action failed");
      });
  };

  return (
    <table className={Styles.table}>
      <thead>
        <tr>
          <th>SI No</th>
          <th>Name</th>
          <th>Details</th>
          <th>Quantity</th>
          <th>Temperature</th>
          <th>Expiry Date</th>
          <th>Section</th>
          <th>Category</th>
          <th>Subcategory</th>
          <th>Staff</th>
          <th>Status</th>
          <th>Action</th>
        </tr>
      </thead>

      <tbody>
        {list.map((item, index) => (
          <tr key={item._id}>
            <td>{index + 1}</td>
            <td>{item.name}</td>
            <td>{item.details}</td>
            <td>{item.quantity}</td>

            <td>{item.temperature} °C</td>

            <td>
              {item.expiryDate
                ? new Date(item.expiryDate).toLocaleDateString()
                : "N/A"}
            </td>

            <td>{item.sectionId?.sectionName}</td>
            <td>{item.categoryId?.categoryName}</td>
            <td>{item.subcategoryId?.subcategoryName}</td>
            <td>{item.staffId?.staffName}</td>

            <td>{item.status === "completed" ? "Completed" : "Pending"}</td>

            <td>
              {item.status !== "completed" && (
                <>
                  <button
                    className={Styles.complete}
                    onClick={() => handleComplete(item._id)}
                  >
                    Complete
                  </button>

                  <button
                    className={Styles.report}
                    onClick={() =>
                      navigate(`/staff/addreport/${item._id}`)
                    }
                  >
                    Add Report
                  </button>
                </>
              )}
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
};

export default ViewProducts;