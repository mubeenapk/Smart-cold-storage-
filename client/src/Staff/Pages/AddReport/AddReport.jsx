import React, { useEffect, useState } from "react";
import axios from "axios";
import Styles from "./AddReport.module.css";
import { useParams, useNavigate } from "react-router-dom";

const AddReport = () => {
  const { id } = useParams(); 
  const navigate = useNavigate();

  const [product, setProduct] = useState(null);
  const [workDone, setWorkDone] = useState("");

  const staffId = sessionStorage.getItem("sid");

  // Check login
  useEffect(() => {
    if (!staffId) {
      alert("Staff not logged in");
      navigate("/staff/login");
    }
  }, [staffId, navigate]);

  // Load Product
  useEffect(() => {
    axios
      .get(`http://localhost:5000/product/${id}`)
      .then((res) => setProduct(res.data.data))
      .catch(console.error);
  }, [id]);

  // Submit
  const handleSubmit = async () => {
    if (!workDone.trim()) {
      alert("Please enter work details");
      return;
    }

    try {
      const res = await axios.post("http://localhost:5000/report", {
        productId: id,
        staffId,
        workDone,
      });

      alert(res.data.message);
      navigate("/staff/viewproducts");

    } catch (err) {
      alert(err.response?.data?.error || "Submission failed");
    }
  };

  return (
    <div className={Styles.container}>
      <div className={Styles.card}>
        <h2>ADD WORK REPORT</h2>

        {product && (
          <div className={Styles.productBox}>
            <p><strong>Product:</strong> {product.name}</p>
            <p><strong>Section:</strong> {product.sectionId?.sectionName}</p>
            <p><strong>Status:</strong> {product.status}</p>
          </div>
        )}

        <label>Work Done *</label>
        <textarea
          value={workDone}
          onChange={(e) => setWorkDone(e.target.value)}
          placeholder="Describe the work completed..."
          className={Styles.input}
        />

        <div className={Styles.buttonRow}>
          <button className={Styles.submit} onClick={handleSubmit}>
            Submit Report
          </button>

          <button
            className={Styles.cancel}
            onClick={() => navigate(-1)}
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
};

export default AddReport;