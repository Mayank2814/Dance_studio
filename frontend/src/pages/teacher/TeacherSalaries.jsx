import React, { useEffect, useState } from "react";
import { api } from "../../utils/api.js";

const TeacherSalaries = () => {
  const [salaries, setSalaries] = useState([]);

  useEffect(() => {
    const load = async () => {
      const res = await api.get("/teacher/salaries");
      setSalaries(res.data);
    };
    load();
  }, []);

  return (
    <div className="card">
      <h2>My Salary</h2>
      <div className="table-container">
        <table className="table">
        <thead>
          <tr>
            <th>Period</th>
            <th>Type</th>
            <th>Amount</th>
            <th>Status</th>
          </tr>
        </thead>
        <tbody>
          {salaries.map((s) => (
            <tr key={s._id}>
              <td>{s.period}</td>
              <td>{s.type}</td>
              <td>${s.amount.toFixed(2)}</td>
              <td>
                <span
                  className={
                    s.status === "Credited"
                      ? "badge badge-success"
                      : "badge badge-warning"
                  }
                >
                  {s.status}
                </span>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      </div>
    </div>
  );
};

export default TeacherSalaries;


