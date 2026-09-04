import React, { useEffect, useState } from "react";
import { api } from "../../utils/api.js";

const TeacherRecitals = () => {
  const [recitals, setRecitals] = useState([]);

  useEffect(() => {
    const load = async () => {
      const res = await api.get("/teacher/recitals");
      setRecitals(res.data);
    };
    load();
  }, []);

  return (
    <div className="card">
      <h2>Upcoming Recitals</h2>
      <div className="list">
        {recitals.map((r) => (
          <div key={r._id} className="list-item">
            <div className="list-main">
              <h3>{r.title}</h3>
              <p className="muted">
                {new Date(r.date).toLocaleDateString()} • {r.students.length} students
              </p>
              {r.description && <p>{r.description}</p>}
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
  );
};

export default TeacherRecitals;


