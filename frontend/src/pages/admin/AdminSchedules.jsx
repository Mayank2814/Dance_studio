import React, { useEffect, useState } from "react";
import { api } from "../../utils/api.js";

const AdminSchedules = () => {
  const [teachers, setTeachers] = useState([]);
  const [students, setStudents] = useState([]);
  const [schedules, setSchedules] = useState([]);
  const [form, setForm] = useState({
    teacherId: "",
    studentIds: [],
    startTime: "",
    endTime: "",
    room: ""
  });
  const [error, setError] = useState("");

  const load = async () => {
    const [tRes, sRes, schRes] = await Promise.all([
      api.get("/admin/teachers"),
      api.get("/admin/students"),
      api.get("/admin/schedules")
    ]);
    setTeachers(tRes.data);
    setStudents(sRes.data);
    setSchedules(schRes.data);
  };

  useEffect(() => {
    load();
  }, []);

  const toggleStudentInForm = (id) => {
    setForm((prev) => {
      const exists = prev.studentIds.includes(id);
      return {
        ...prev,
        studentIds: exists
          ? prev.studentIds.filter((x) => x !== id)
          : [...prev.studentIds, id]
      };
    });
  };

  const handleCreate = async (e) => {
    e.preventDefault();
    setError("");
    try {
      await api.post("/admin/schedules", form);
      setForm({ teacherId: "", studentIds: [], startTime: "", endTime: "", room: "" });
      load();
    } catch (err) {
      setError(err?.response?.data?.message || "Failed to create schedule");
    }
  };

  return (
    <div className="two-column">
      <form className="card form-card" onSubmit={handleCreate}>
        <h2>Create Lesson</h2>
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
          <label>Students</label>
          <div className="pill-list">
            {students.map((s) => (
              <button
                type="button"
                key={s._id}
                className={
                  form.studentIds.includes(s._id) ? "pill pill-selected" : "pill"
                }
                onClick={() => toggleStudentInForm(s._id)}
              >
                {s.user.name}
              </button>
            ))}
          </div>
        </div>
        <div className="grid-2">
          <div className="form-group">
            <label>Start Time</label>
            <input
              type="datetime-local"
              value={form.startTime}
              onChange={(e) => setForm({ ...form, startTime: e.target.value })}
              required
            />
          </div>
          <div className="form-group">
            <label>End Time</label>
            <input
              type="datetime-local"
              value={form.endTime}
              onChange={(e) => setForm({ ...form, endTime: e.target.value })}
              required
            />
          </div>
        </div>
        <div className="form-group">
          <label>Room</label>
          <input
            value={form.room}
            onChange={(e) => setForm({ ...form, room: e.target.value })}
          />
        </div>
        {error && <div className="error-banner">{error}</div>}
        <button className="btn-primary">Create Lesson</button>
      </form>

      <div className="card">
        <h2>Upcoming Lessons</h2>
        <div className="table-container">
          <table className="table">
          <thead>
            <tr>
              <th>Teacher</th>
              <th>Students</th>
              <th>Time</th>
              <th>Room</th>
              <th>Status</th>
            </tr>
          </thead>
          <tbody>
            {schedules.map((sch) => (
              <tr key={sch._id}>
                <td>{sch.teacher?.user?.name || "—"}</td>
                <td>
                  {(sch.students || [])
                    .map((s) => s.user?.name || s._id?.slice(-4))
                    .join(", ")}
                </td>
                <td>
                  {new Date(sch.startTime).toLocaleString()} -{" "}
                  {new Date(sch.endTime).toLocaleTimeString()}
                </td>
                <td>{sch.room || "—"}</td>
                <td>
                  <span
                    className={
                      sch.status === "scheduled"
                        ? "badge badge-info"
                        : sch.status === "completed"
                        ? "badge badge-success"
                        : "badge badge-muted"
                    }
                  >
                    {sch.status}
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

export default AdminSchedules;


