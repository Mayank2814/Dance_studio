import React, { useEffect, useState } from "react";
import { api } from "../../utils/api.js";

const AdminRecitals = () => {
  const [students, setStudents] = useState([]);
  const [teachers, setTeachers] = useState([]);
  const [recitals, setRecitals] = useState([]);
  const [form, setForm] = useState({
    title: "",
    date: "",
    description: "",
    students: [],
    mentoringTeachers: [],
    preparationStatus: "Planned"
  });

  const load = async () => {
    const [sRes, tRes, rRes] = await Promise.all([
      api.get("/admin/students"),
      api.get("/admin/teachers"),
      api.get("/admin/recitals")
    ]);
    setStudents(sRes.data);
    setTeachers(tRes.data);
    setRecitals(rRes.data);
  };

  useEffect(() => {
    load();
  }, []);

  const toggleItem = (listKey, id) => {
    setForm((prev) => {
      const exists = prev[listKey].includes(id);
      return {
        ...prev,
        [listKey]: exists ? prev[listKey].filter((x) => x !== id) : [...prev[listKey], id]
      };
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    await api.post("/admin/recitals", form);
    setForm({
      title: "",
      date: "",
      description: "",
      students: [],
      mentoringTeachers: [],
      preparationStatus: "Planned"
    });
    load();
  };

  return (
    <div className="two-column">
      <form className="card form-card" onSubmit={handleSubmit}>
        <h2>Create Recital / Event</h2>
        <div className="form-group">
          <label>Title</label>
          <input
            value={form.title}
            onChange={(e) => setForm({ ...form, title: e.target.value })}
            required
          />
        </div>
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
          <label>Description</label>
          <textarea
            value={form.description}
            onChange={(e) => setForm({ ...form, description: e.target.value })}
          />
        </div>
        <div className="form-group">
          <label>Participating Students</label>
          <div className="pill-list">
            {students.map((s) => (
              <button
                type="button"
                key={s._id}
                className={
                  form.students.includes(s._id) ? "pill pill-selected" : "pill"
                }
                onClick={() => toggleItem("students", s._id)}
              >
                {s.user.name}
              </button>
            ))}
          </div>
        </div>
        <div className="form-group">
          <label>Mentoring Teachers</label>
          <div className="pill-list">
            {teachers.map((t) => (
              <button
                type="button"
                key={t._id}
                className={
                  form.mentoringTeachers.includes(t._id)
                    ? "pill pill-selected"
                    : "pill"
                }
                onClick={() => toggleItem("mentoringTeachers", t._id)}
              >
                {t.user.name}
              </button>
            ))}
          </div>
        </div>
        <div className="form-group">
          <label>Preparation Status</label>
          <select
            value={form.preparationStatus}
            onChange={(e) =>
              setForm({ ...form, preparationStatus: e.target.value })
            }
          >
            <option value="Planned">Planned</option>
            <option value="In Progress">In Progress</option>
            <option value="Ready">Ready</option>
          </select>
        </div>
        <button className="btn-primary">Create Recital</button>
      </form>

      <div className="card">
        <h2>Recitals & Events</h2>
        <div className="list">
          {recitals.map((r) => (
            <div key={r._id} className="list-item">
              <div className="list-main">
                <h3>{r.title}</h3>
                <p className="muted">
                  {new Date(r.date).toLocaleDateString()} •{" "}
                  {r.students.length} students • {r.mentoringTeachers.length} teachers
                </p>
              </div>
              <div className="list-meta">
                <span
                  className={
                    r.preparationStatus === "Ready"
                      ? "badge badge-success"
                      : r.preparationStatus === "In Progress"
                      ? "badge badge-info"
                      : "badge badge-muted"
                  }
                >
                  {r.preparationStatus}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default AdminRecitals;


