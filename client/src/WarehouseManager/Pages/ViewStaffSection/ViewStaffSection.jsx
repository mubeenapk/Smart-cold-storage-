import axios from "axios";
import Styles from "./ViewStaffSection.module.css";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

const ViewStaffSection = () => {
  const [list, setList] = useState([]);
  const navigate = useNavigate();

  const wid = sessionStorage.getItem("wid");

  // LOAD PRODUCTS FOR THIS WAREHOUSE
  const loadProducts = () => {
    axios
      .get(`http://localhost:5000/product/warehouse/${wid}`)
      .then((res) => {
        // Filter only products belonging to this warehouse
        const filtered = res.data.data.filter(
          (item) =>
            item.sectionId?.warehouseManagerId === wid ||
            item.staffId?.warehouseManagerId === wid,
        );

        setList(filtered);
      })
      .catch(console.error);
  };

  useEffect(() => {
    loadProducts();
  }, []);

  return (
    <div>
      <h2>Staff Section Status</h2>

      <table className={Styles.table}>
        <thead>
          <tr>
            <th>SI No</th>
            <th>Name</th>
            <th>Details</th>
            <th>Quantity</th>
            <th>Section</th>
            <th>Category</th>
            <th>Subcategory</th>
            <th>Staff</th>
            <th>Status</th>
          </tr>
        </thead>

        <tbody>
          {list.map((item, index) => (
            <tr key={item._id}>
              <td>{index + 1}</td>
              <td>{item.name}</td>
              <td>{item.details}</td>
              <td>{item.quantity}</td>
              <td>{item.sectionId?.sectionName}</td>
              <td>{item.categoryId?.categoryName}</td>
              <td>{item.subcategoryId?.subcategoryName}</td>
              <td>{item.staffId?.staffName}</td>

              <td>
                {item.status === "completed" ? (
                  <>
                    <span className={Styles.statusCompleted}>Completed</span>

                    <button
                      className={Styles.viewBtn}
                      onClick={() =>
                        navigate(`/warehouse/viewreport/${item._id}`)
                      }
                    >
                      View Report
                    </button>
                  </>
                ) : (
                  <span className={Styles.statusPending}>Pending</span>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default ViewStaffSection;
