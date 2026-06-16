import axios from "axios";
import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import Styles from "./ViewReport.module.css";

const ViewReport = () => {
  const { id } = useParams(); // product id
  const navigate = useNavigate();

  const [report, setReport] = useState(null);

  useEffect(() => {
    axios
      .get(`http://localhost:5000/report/product/${id}`)
      .then((res) => {
        if (res.data.data.length > 0) {
          setReport(res.data.data[0]);
        }
      })
      .catch(console.error);
  }, [id]);

  return (
    <div className={Styles.container}>
      <div className={Styles.card}>
        <h2>Work Report</h2>

        {report ? (
          <>
            <p><strong>Product:</strong> {report.productId?.name}</p>
            <p><strong>Staff:</strong> {report.staffId?.staffName}</p>
            <p><strong>Submitted On:</strong> {new Date(report.createdAt).toLocaleString()}</p>

            <div className={Styles.reportBox}>
              {report.workDone}
            </div>
          </>
        ) : (
          <p>No report found.</p>
        )}

        <button
          className={Styles.backBtn}
          onClick={() => navigate(-1)}
        >
          Back
        </button>
      </div>
    </div>
  );
};

export default ViewReport;