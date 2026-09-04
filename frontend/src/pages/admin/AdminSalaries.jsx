import React, { useEffect, useState } from "react";
import { api } from "../../utils/api.js";

const AdminSalaries = () => {
  const [teachers, setTeachers] = useState([]);
  const [salaries, setSalaries] = useState([]);
  const [form, setForm] = useState({
    teacherId: "",
    period: "",
    type: "monthly",
    amount: "",
    status: "Not Credited"
  });

  const load = async () => {
    const [tRes, sRes] = await Promise.all([
      api.get("/admin/teachers"),
      api.get("/admin/salaries")
    ]);
    setTeachers(tRes.data);
    setSalaries(sRes.data);
  };

  useEffect(() => {
    load();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    await api.post("/admin/salaries", form);
    load();
  };

  return (
    <div className="two-column">
      <form className="card form-card" onSubmit={handleSubmit}>
        <h2>Update Teacher Salary</h2>
        <div className="form-group">
          <label>Teacher</label>
          <select
            value={form.teacherId}
            onChange={(e) => setForm({ ...form, teacherId: e.target.value })}
            required
          >
            <option value="">Select teacher</option>
            {teachers.map((t) => (
              <option key={t._id} value={t._id}>
                {t.user.name}
              </option>
            ))}
          </select>
        </div>
        <div className="form-group">
          <label>Period (e.g. 2025-01)</label>
          <input
            value={form.period}
            onChange={(e) => setForm({ ...form, period: e.target.value })}
            required
          />
        </div>
        <div className="grid-2">
          <div className="form-group">
            <label>Type</label>
            <select
              value={form.type}
              onChange={(e) => setForm({ ...form, type: e.target.value })}
            >
              <option value="monthly">Monthly</option>
              <option value="per_class">Per Class</option>
              <option value="fixed">Fixed</option>
            </select>
          </div>
          <div className="form-group">
            <label>Amount</label>
            <input
              type="number"
              value={form.amount}
              onChange={(e) =>
                setForm({ ...form, amount: Number(e.target.value) })
              }
              required
            />
          </div>
        </div>
        <div className="form-group">
          <label>Status</label>
          <select
            value={form.status}
            onChange={(e) => setForm({ ...form, status: e.target.value })}
          >
            <option value="Not Credited">Not Credited</option>
            <option value="Credited">Credited</option>
          </select>
        </div>
        <button className="btn-primary">Save Salary</button>
      </form>

      <div className="card">
        <h2>Salary History</h2>
        <div className="table-container">
          <table className="table">
          <thead>
            <tr>
              <th>Teacher</th>
              <th>Period</th>
              <th>Type</th>
              <th>Amount</th>
              <th>Status</th>
            </tr>
          </thead>
          <tbody>
            {salaries.map((s) => (
              <tr key={s._id}>
                <td>{s.teacher?.user?.name}</td>
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
    </div>
  );
};

export default AdminSalaries;


