import React, { useEffect, useState } from "react";
import { api } from "../../utils/api.js";

const StudentSchedules = () => {
  const [schedules, setSchedules] = useState([]);

  useEffect(() => {
    const load = async () => {
      const res = await api.get("/student/schedules");
      setSchedules(res.data);
    };
    load();
  }, []);

  return (
    <div className="card">
      <h2>My Schedule</h2>
      <div className="table-container">
        <table className="table">
        <thead>
          <tr>
            <th>Teacher</th>
            <th>Time</th>
            <th>Room</th>
            <th>Status</th>
          </tr>
        </thead>
        <tbody>
          {schedules.map((s) => (
            <tr key={s._id}>
              <td>{s.teacher?.user?.name}</td>
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
            </tr>
          ))}
        </tbody>
      </table>
      </div>
    </div>
  );
};

export default StudentSchedules;


