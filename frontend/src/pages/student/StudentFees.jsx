import React, { useEffect, useState } from "react";
import { api } from "../../utils/api.js";

const StudentFees = () => {
  const [fees, setFees] = useState([]);

  useEffect(() => {
    const load = async () => {
      const res = await api.get("/student/fees");
      setFees(res.data);
    };
    load();
  }, []);

  const badge = (status) => {
    if (status === "Paid") return "badge badge-success";
    if (status === "Overpaid") return "badge badge-info";
    if (status === "Partially Paid") return "badge badge-warning";
    return "badge badge-danger";
  };

  return (
    <div className="card">
      <h2>My Yearly Fees</h2>
      <div className="table-container">
        <table className="table">
        <thead>
          <tr>
            <th>Year</th>
            <th>Instrument / Level</th>
            <th>Total</th>
            <th>Paid</th>
            <th>Balance</th>
            <th>Status</th>
          </tr>
        </thead>
        <tbody>
          {fees.map((f) => (
            <tr key={f.id}>
              <td>{f.year}</td>
              <td>
                {f.instrument} / {f.courseLevel}
              </td>
              <td>${f.yearlyFee.toFixed(2)}</td>
              <td>${f.amountPaid.toFixed(2)}</td>
              <td>${f.balance.toFixed(2)}</td>
              <td>
                <span className={badge(f.status)}>{f.status}</span>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      </div>
      <p className="muted">
        Fees are managed by the admin. You can only view your own fee status here.
      </p>
    </div>
  );
};

export default StudentFees;


