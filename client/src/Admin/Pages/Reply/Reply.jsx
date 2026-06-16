import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import styles from "./Reply.module.css";

const Reply = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [reply, setReply] = useState("");
  const [complaint, setComplaint] = useState(null);

  useEffect(() => {
    axios
      .get(`http://localhost:5000/complaint/single/${id}`)
      .then((res) => setComplaint(res.data.data))
      .catch(console.error);
  }, [id]);

  const handleReply = () => {
    axios
      .put(`http://localhost:5000/complaint/reply/${id}`, { reply })
      .then(() => {
        alert("Reply sent successfully");
        navigate("../viewcomplaint");
      })
      .catch(console.error);
  };

  return (
    <div className={styles.page}>
      <div className={styles.card}>
        <h2 className={styles.title}>Reply to Complaint</h2>

        {complaint && (
          <div className={styles.infoBox}>
            <p><b>Title:</b> {complaint.title}</p>
            <p><b>Content:</b> {complaint.content}</p>
          </div>
        )}

        <textarea
          className={styles.textarea}
          placeholder="Write reply..."
          value={reply}
          onChange={(e) => setReply(e.target.value)}
        />

        <button className={styles.submitBtn} onClick={handleReply}>
          Submit Reply
        </button>
      </div>
    </div>
  );
};

export default Reply;