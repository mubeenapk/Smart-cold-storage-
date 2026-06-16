import React, { useState, useEffect } from "react";
import Styles from "./ViewComplaint.module.css";
import axios from "axios";
import { Link } from "react-router-dom";

const ViewComplaint = () => {
  const [list, setList] = useState([]);
  const warehouseId = sessionStorage.getItem("wid");

  const loadComplaints = () => {
    if (!warehouseId) return;

    axios
      .get(`http://localhost:5000/complaint/${warehouseId}`)
      .then((res) => setList(res.data.data))
      .catch(console.error);
  };

  useEffect(() => {
    loadComplaints();
  }, []);

  return (
    <div className={Styles.page}>
      <div className={Styles.header}>
        <h2>Complaint Management</h2>
        <p>Review and respond to complaints submitted by staff.</p>
      </div>

      <div className={Styles.tablebox}>
        <table className={Styles.table}>
          <thead>
            <tr>
              <th>SI No</th>
              <th>Staff Details</th>
              <th>Title</th>
              <th>Content</th>
              <th>Action</th>
            </tr>
          </thead>

          <tbody>
            {list.map((item, index) => (
              <tr key={item._id}>
                <td>{index + 1}</td>
                <td>
                  {item.staffId
                    ? `${item.staffId.staffName} (${item.staffId.email})`
                    : "No Staff"}
                </td>
                <td>{item.title}</td>
                <td>{item.content}</td>
                <td>
                  <Link to={`/admin/reply/${item._id}`} className={Styles.replyLink}>
                    Reply
                  </Link>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default ViewComplaint;