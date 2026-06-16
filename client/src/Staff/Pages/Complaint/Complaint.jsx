import React, { useState, useEffect } from "react";
import Styles from "./Complaint.module.css";
import axios from "axios";

const Complaint = () => {
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [list, setList] = useState([]);

  const warehouseId = sessionStorage.getItem("wid");
  const staffId = sessionStorage.getItem("sid"); // 

  // LOAD COMPLAINTS
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

  // SUBMIT
  const handleSubmit = () => {
    if (!warehouseId) {
      alert("Warehouse not logged in");
      return;
    }

    if (!staffId) {   
      alert("Staff not logged in");
      return;
    }

    if (!title || !content) {
      alert("Please fill all fields");
      return;
    }

    axios
      .post("http://localhost:5000/complaint", {
        title,
        content,
        warehouseManagerId: warehouseId,
        staffId: staffId  
      })
      .then((res) => {
        alert(res.data.message);
        setTitle("");
        setContent("");
        loadComplaints();
      })
      .catch((err) =>
        alert(err.response?.data?.error || "Error occurred")
      );
  };

  const handleDelete = (id) => {
    axios
      .delete(`http://localhost:5000/complaint/${id}`)
      .then((res) => {
        alert(res.data.message);
        loadComplaints();
      })
      .catch(console.error);
  };

  return (
    <div className={Styles.container}>
      <div className={Styles.subcontainer}>
        <h2 className={Styles.hd}>Complaint</h2>

        <input
          type="text"
          placeholder="Title"
          className={Styles.inp}
          value={title}
          onChange={(e) => setTitle(e.target.value)}
        />

        <textarea
          placeholder="Content"
          className={Styles.inp}
          value={content}
          onChange={(e) => setContent(e.target.value)}
        />

        <div className={Styles.cntr}>
          <button className={Styles.sb} onClick={handleSubmit}>
            Submit
          </button>

          <button
            className={Styles.cancel}
            onClick={() => {
              setTitle("");
              setContent("");
            }}
          >
            Cancel
          </button>
        </div>
      </div>

      <div className={Styles.tablebox}>
        <table className={Styles.table}>
          <thead>
            <tr>
              <th>SI No</th>
              <th>Title</th>
              <th>Content</th>
              <th>Reply</th>
              <th>Action</th>
            </tr>
          </thead>

          <tbody>
            {list.map((item, index) => (
              <tr key={item._id}>
                <td>{index + 1}</td>
                <td>{item.title}</td>
                <td>{item.content}</td>
                <td>{item.reply || "No reply yet"}</td>
                <td>
                  <button
                    className={Styles.delete}
                    onClick={() => handleDelete(item._id)}
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Complaint;