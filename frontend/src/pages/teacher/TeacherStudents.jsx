import React, { useEffect, useState } from "react";
import { api } from "../../utils/api.js";

const TeacherStudents = () => {
  const [students, setStudents] = useState([]);

  useEffect(() => {
    const load = async () => {
      const res = await api.get("/teacher/students");
      setStudents(res.data);
    };
    load();
  }, []);

  return (
    <div className="card">
      <h2>Assigned Students</h2>
      <div className="table-container">
        <table className="table">
        <thead>
          <tr>
            <th>Name</th>
            <th>Instrument</th>
            <th>Course Level</th>
          </tr>
        </thead>
        <tbody>
          {students.map((s) => (
            <tr key={s._id}>
              <td>{s.user.name}</td>
              <td>{s.instrument || "—"}</td>
              <td>{s.courseLevel || "—"}</td>
            </tr>
          ))}
        </tbody>
      </table>
      </div>
    </div>
  );
};

export default TeacherStudents;


