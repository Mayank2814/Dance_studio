import React, { useEffect, useState } from "react";
import { api } from "../../utils/api.js";

const AdminFees = () => {
  const [fees, setFees] = useState([]);
  const [students, setStudents] = useState([]);
  const [form, setForm] = useState({
    studentId: "",
    year: new Date().getFullYear(),
    instrument: "",
    courseLevel: "",
    yearlyFee: "",
    amountPaid: ""
  });

  const load = async () => {
    const [feesRes, studentsRes] = await Promise.all([
      api.get("/admin/fees"),
      api.get("/admin/students")
    ]);
    setFees(feesRes.data);
    setStudents(studentsRes.data);
  };

  useEffect(() => {
    load();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    await api.post("/admin/fees", form);
    load();
  };

  const getStatusBadge = (fee) => {
    const balance = fee.yearlyFee - fee.amountPaid;
    if (balance < 0) return <span className="badge badge-info">Overpaid</span>;
    if (balance === 0) return <span className="badge badge-success">Paid</span>;
    if (fee.amountPaid > 0) return <span className="badge badge-warning">Partially Paid</span>;
    return <span className="badge badge-danger">Pending</span>;
  };

  return (
    <div className="two-column">
      <form className="card form-card" onSubmit={handleSubmit}>
        <h2>Update Yearly Fee</h2>
        <div className="form-group">
          <label>Student</label>
          <select
            value={form.studentId}
            onChange={(e) => setForm({ ...form, studentId: e.target.value })}
            required
          >
            <option value="">Select student</option>
            {students.map((s) => (
              <option key={s._id} value={s._id}>
                {s.user.name}
              </option>
            ))}
          </select>
        </div>
        <div className="grid-2">
          <div className="form-group">
            <label>Year</label>
            <input
              type="number"
              value={form.year}
              onChange={(e) => setForm({ ...form, year: Number(e.target.value) })}
              required
            />
          </div>
          <div className="form-group">
            <label>Instrument</label>
            <input
              value={form.instrument}
              onChange={(e) => setForm({ ...form, instrument: e.target.value })}
              required
            />
          </div>
        </div>
        <div className="grid-2">
          <div className="form-group">
            <label>Course Level</label>
            <input
              value={form.courseLevel}
              onChange={(e) => setForm({ ...form, courseLevel: e.target.value })}
              required
            />
          </div>
          <div className="form-group">
            <label>Yearly Fee</label>
            <input
              type="number"
              value={form.yearlyFee}
              onChange={(e) =>
                setForm({ ...form, yearlyFee: Number(e.target.value) })
              }
              required
            />
          </div>
        </div>
        <div className="form-group">
          <label>Amount Paid (manual entry)</label>
          <input
            type="number"
            value={form.amountPaid}
            onChange={(e) =>
              setForm({ ...form, amountPaid: Number(e.target.value) })
            }
          />
        </div>
        <button className="btn-primary">Save Fee</button>
      </form>

      <div className="card">
        <h2>Yearly Fees</h2>
        <div className="table-container">
          <table className="table">
          <thead>
            <tr>
              <th>Student</th>
              <th>Year</th>
              <th>Instrument / Level</th>
              <th>Yearly Fee</th>
              <th>Paid</th>
              <th>Balance</th>
              <th>Status</th>
            </tr>
          </thead>
          <tbody>
            {fees.map((f) => {
              const balance = f.yearlyFee - f.amountPaid;
              return (
                <tr key={f._id}>
                  <td>{f.student?.user?.name}</td>
                  <td>{f.year}</td>
                  <td>
                    {f.instrument} / {f.courseLevel}
                  </td>
                  <td>${f.yearlyFee.toFixed(2)}</td>
                  <td>${f.amountPaid.toFixed(2)}</td>
                  <td>${balance.toFixed(2)}</td>
                  <td>{getStatusBadge(f)}</td>
                </tr>
              );
            })}
          </tbody>
        </table>
        </div>
      </div>
    </div>
  );
};

export default AdminFees;


