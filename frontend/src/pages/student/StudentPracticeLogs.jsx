import React, { useEffect, useState } from "react";
import { api } from "../../utils/api.js";

const StudentPracticeLogs = () => {
  const [logs, setLogs] = useState([]);
  const [form, setForm] = useState({
    date: new Date().toISOString().slice(0, 10),
    durationMinutes: "",
    notes: ""
  });

  const load = async () => {
    const res = await api.get("/student/practice-logs");
    setLogs(res.data);
  };

  useEffect(() => {
    load();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    await api.post("/student/practice-logs", form);
    setForm({
      date: new Date().toISOString().slice(0, 10),
      durationMinutes: "",
      notes: ""
    });
    load();
  };

  return (
    <div className="two-column">
      <form className="card form-card" onSubmit={handleSubmit}>
        <h2>Submit Practice Log</h2>
        <div className="grid-2">
          <div className="form-group">
            <label>Date</label>
            <input
              type="date"
              value={form.date}
              onChange={(e) => setForm({ ...form, date: e.target.value })}
              required
            />
          </div>
          <div className="form-group">
            <label>Duration (minutes)</label>
            <input
              type="number"
              value={form.durationMinutes}
              onChange={(e) =>
                setForm({ ...form, durationMinutes: Number(e.target.value) })
              }
              required
            />
          </div>
        </div>
        <div className="form-group">
          <label>Notes</label>
          <textarea
            value={form.notes}
            onChange={(e) => setForm({ ...form, notes: e.target.value })}
          />
        </div>
        <button className="btn-primary">Submit</button>
      </form>

      <div className="card">
        <h2>My Practice History</h2>
        <div className="table-container">
          <table className="table">
          <thead>
            <tr>
              <th>Date</th>
              <th>Duration</th>
              <th>Notes</th>
              <th>Teacher Feedback</th>
              <th>Feedback Date</th>
            </tr>
          </thead>
          <tbody>
            {logs.map((l) => (
              <tr key={l._id}>
                <td>{new Date(l.date).toLocaleDateString()}</td>
                <td>{l.durationMinutes} min</td>
                <td>{l.notes}</td>
                <td>{l.teacherFeedback || "—"}</td>
                <td>
                  {l.feedbackGivenAt
                    ? new Date(l.feedbackGivenAt).toLocaleDateString()
                    : "—"}
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

export default StudentPracticeLogs;


