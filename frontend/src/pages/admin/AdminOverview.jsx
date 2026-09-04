import React, { useEffect, useState } from "react";
import { api } from "../../utils/api.js";

const AdminOverview = () => {
  const [stats, setStats] = useState(null);
  const [recentBatches, setRecentBatches] = useState([]);

  useEffect(() => {
    const load = async () => {
      try {
        const [teachers, students, schedules] = await Promise.all([
          api.get("/admin/teachers"),
          api.get("/admin/students"),
          api.get("/admin/schedules")
        ]);

        setStats({
          teachers: teachers.data.length,
          students: students.data.length,
          lessons: schedules.data.length
        });

        // Treat each schedule as an enrolled batch (group of students in a lesson)
        const sorted = [...schedules.data].sort(
          (a, b) => new Date(a.startTime) - new Date(b.startTime)
        );
        setRecentBatches(sorted.slice(0, 5));
      } catch {
        setStats({ teachers: 0, students: 0, lessons: 0 });
        setRecentBatches([]);
      }
    };
    load();
  }, []);

  return (
    <>
      <div className="grid-responsive">
        <div className="card">
        <div className="flex items-center gap-3 mb-4">
          <div className="w-12 h-12 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-white text-xl">
            👨‍🎓
          </div>
          <div>
            <h3 className="text-lg font-semibold">Total Teachers</h3>
            <p className="text-sm text-gray-400">Active instructors</p>
          </div>
        </div>
        <p className="big-number">{stats?.teachers ?? "—"}</p>
        <div className="mt-4">
          <div className="progress-bar">
            <div className="progress-fill" style={{ width: `${Math.min((stats?.teachers || 0) / 20 * 100, 100)}%` }}></div>
          </div>
        </div>
        </div>
        <div className="card">
        <div className="flex items-center gap-3 mb-4">
          <div className="w-12 h-12 rounded-full bg-gradient-to-br from-green-500 to-teal-600 flex items-center justify-center text-white text-xl">
            🎓
          </div>
          <div>
            <h3 className="text-lg font-semibold">Total Students</h3>
            <p className="text-sm text-gray-400">Enrolled learners</p>
          </div>
        </div>
        <p className="big-number">{stats?.students ?? "—"}</p>
        <div className="mt-4">
          <div className="progress-bar">
            <div className="progress-fill" style={{ width: `${Math.min((stats?.students || 0) / 50 * 100, 100)}%` }}></div>
          </div>
        </div>
        </div>
        <div className="card">
        <div className="flex items-center gap-3 mb-4">
          <div className="w-12 h-12 rounded-full bg-gradient-to-br from-purple-500 to-pink-600 flex items-center justify-center text-white text-xl">
            📅
          </div>
          <div>
            <h3 className="text-lg font-semibold">Scheduled Lessons</h3>
            <p className="text-sm text-gray-400">This month</p>
          </div>
        </div>
        <p className="big-number">{stats?.lessons ?? "—"}</p>
        <div className="mt-4">
          <div className="progress-bar">
            <div className="progress-fill" style={{ width: `${Math.min((stats?.lessons || 0) / 30 * 100, 100)}%` }}></div>
          </div>
        </div>
        </div>
      </div>

      <div className="card" style={{ marginTop: "1.5rem" }}>
        <div className="flex items-center gap-3 mb-4">
          <div className="w-12 h-12 rounded-full bg-gradient-to-br from-indigo-500 to-blue-600 flex items-center justify-center text-white text-xl">
            🧑‍🤝‍🧑
          </div>
          <div>
            <h3 className="text-lg font-semibold">Enrolled Batches</h3>
            <p className="text-sm text-gray-400">Recent lesson groups with enrolled students</p>
          </div>
        </div>

        {recentBatches.length === 0 ? (
          <div className="text-center py-8 text-gray-400">
            <div className="text-4xl mb-2">📭</div>
            <p>No enrolled batches yet. Create lessons from the Schedules page.</p>
          </div>
        ) : (
          <div className="table-container">
            <table className="table">
              <thead>
                <tr>
                  <th>Teacher</th>
                  <th>Enrolled Students</th>
                  <th>Time</th>
                  <th>Room</th>
                </tr>
              </thead>
              <tbody>
                {recentBatches.map((batch) => (
                  <tr key={batch._id}>
                    <td>{batch.teacher?.user?.name || "—"}</td>
                    <td>
                      {Array.isArray(batch.students)
                        ? `${batch.students.length} student${batch.students.length !== 1 ? "s" : ""}`
                        : "0 students"}
                    </td>
                    <td>
                      {batch.startTime
                        ? `${new Date(batch.startTime).toLocaleString()} - ${new Date(
                            batch.endTime
                          ).toLocaleTimeString()}`
                        : "—"}
                    </td>
                    <td>{batch.room || "—"}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </>
  );
};

export default AdminOverview;


