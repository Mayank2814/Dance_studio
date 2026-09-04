import React, { useEffect, useState } from "react";
import { api } from "../../utils/api.js";

const TeacherSchedules = () => {
  const [schedules, setSchedules] = useState([]);

  const load = async () => {
    const res = await api.get("/teacher/schedules");
    setSchedules(res.data);
  };

  useEffect(() => {
    load();
  }, []);

  const markCompleted = async (scheduleId) => {
    await api.post("/teacher/attendance", { scheduleId, status: "completed" });
    load();
  };

  return (
    <div className="card">
      <h2>My Lesson Schedule</h2>
      <div className="table-container">
        <table className="table">
        <thead>
          <tr>
            <th>Students</th>
            <th>Time</th>
            <th>Room</th>
            <th>Status</th>
            <th></th>
          </tr>
        </thead>
        <tbody>
          {schedules.map((s) => (
            <tr key={s._id}>
              <td>
                {(s.students || []).map((st) => st.user?.name || st._id).join(", ")}
              </td>
              <td>
                {new Date(s.startTime).toLocaleString()} -{" "}
                {new Date(s.endTime).toLocaleTimeString()}
              </td>
              <td>{s.room || "—"}</td>
              <td>
                <span
                  className={
                    s.status === "scheduled"
                      ? "badge badge-info"
                      : s.status === "completed"
                      ? "badge badge-success"
                      : "badge badge-muted"
                  }
                >
                  {s.status}
                </span>
              </td>
              <td>
                {s.status !== "completed" && (
                  <button
                    className="btn-link"
                    onClick={() => markCompleted(s._id)}
                  >
                    Mark Completed
                  </button>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      </div>
    </div>
  );
};

export default TeacherSchedules;


