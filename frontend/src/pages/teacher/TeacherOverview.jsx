import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { api } from "../../utils/api.js";

const TeacherOverview = () => {
  const [profile, setProfile] = useState(null);
  const [students, setStudents] = useState([]);
  const [schedules, setSchedules] = useState([]);
  const [logs, setLogs] = useState([]);
  const [salaries, setSalaries] = useState([]);
  const [recitals, setRecitals] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadData = async () => {
      try {
        const [pRes, stRes, scRes, lRes, saRes, rRes] = await Promise.all([
          api.get("/teacher/me").catch(() => ({ data: null })),
          api.get("/teacher/students").catch(() => ({ data: [] })),
          api.get("/teacher/schedules").catch(() => ({ data: [] })),
          api.get("/teacher/practice-logs").catch(() => ({ data: [] })),
          api.get("/teacher/salaries").catch(() => ({ data: [] })),
          api.get("/teacher/recitals").catch(() => ({ data: [] }))
        ]);
        setProfile(pRes.data);
        setStudents(stRes.data || []);
        setSchedules(scRes.data || []);
        setLogs(lRes.data || []);
        setSalaries(saRes.data || []);
        setRecitals(rRes.data || []);
      } catch (err) {
        console.error("Error loading teacher dashboard data:", err);
      } finally {
        setLoading(false);
      }
    };
    loadData();
  }, []);

  const totalSalaryPaid = salaries.reduce((acc, curr) => acc + (curr.amount || 0), 0);
  const pendingFeedbackLogsCount = logs.filter((l) => !l.teacherFeedback).length;

  if (loading) {
    return <div className="p-6 text-center text-gray-400">Loading teacher dashboard...</div>;
  }

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "24px" }}>
      {/* Top Welcome Banner */}
      <div className="card" style={{ background: "linear-gradient(135deg, rgba(59, 130, 246, 0.15), rgba(16, 185, 129, 0.15))", border: "1px solid rgba(16, 185, 129, 0.3)" }}>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", flexWrap: "wrap", gap: "16px" }}>
          <div style={{ display: "flex", alignItems: "center", gap: "16px" }}>
            <div style={{ width: "56px", height: "56px", borderRadius: "50%", background: "linear-gradient(135deg, #10b981, #3b82f6)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "28px", color: "#fff" }}>
              👨‍🏫
            </div>
            <div>
              <h1 style={{ fontSize: "24px", fontWeight: "bold", margin: 0, color: "#fff" }}>
                Welcome back, {profile?.user?.name || "Teacher"}!
              </h1>
              <p style={{ margin: "4px 0 0 0", color: "#9ca3af", fontSize: "14px" }}>
               Dance Style: <strong style={{ color: "#34d399" }}>{(profile?.danceStyles || []).join(", ") || "General Dance"}</strong>
              </p>
            </div>
          </div>
          <div style={{ padding: "10px 16px", borderRadius: "12px", background: "rgba(255, 255, 255, 0.05)", border: "1px solid rgba(255, 255, 255, 0.1)" }}>
            <div style={{ fontSize: "12px", color: "#9ca3af" }}>Contact Number</div>
            <div style={{ fontSize: "15px", fontWeight: "600", color: "#60a5fa" }}>
              📞 {profile?.user?.contactNumber || "Not specified"}
            </div>
          </div>
        </div>
        {profile?.bio && (
          <div style={{ marginTop: "14px", padding: "10px 14px", borderRadius: "8px", background: "rgba(0, 0, 0, 0.2)", fontSize: "13px", color: "#d1d5db", fontStyle: "italic" }}>
            "{profile.bio}"
          </div>
        )}
      </div>

      {/* 4 Stat Cards */}
      <div className="grid-responsive" style={{ gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))", gap: "16px" }}>
        <div className="card" style={{ display: "flex", alignItems: "center", gap: "16px" }}>
          <div style={{ width: "48px", height: "48px", borderRadius: "12px", background: "rgba(16, 185, 129, 0.2)", color: "#34d399", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "24px" }}>
            👥
          </div>
          <div>
            <div style={{ fontSize: "13px", color: "#9ca3af" }}>Assigned Students</div>
            <div style={{ fontSize: "22px", fontWeight: "bold", color: "#fff" }}>{students.length}</div>
          </div>
        </div>

        <div className="card" style={{ display: "flex", alignItems: "center", gap: "16px" }}>
          <div style={{ width: "48px", height: "48px", borderRadius: "12px", background: "rgba(59, 130, 246, 0.2)", color: "#60a5fa", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "24px" }}>
            📅
          </div>
          <div>
            <div style={{ fontSize: "13px", color: "#9ca3af" }}>Teaching Sessions</div>
            <div style={{ fontSize: "22px", fontWeight: "bold", color: "#fff" }}>{schedules.length}</div>
          </div>
        </div>

        <div className="card" style={{ display: "flex", alignItems: "center", gap: "16px" }}>
          <div style={{ width: "48px", height: "48px", borderRadius: "12px", background: "rgba(245, 158, 11, 0.2)", color: "#fbbf24", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "24px" }}>
            🎼
          </div>
          <div>
            <div style={{ fontSize: "13px", color: "#9ca3af" }}>Logs Needing Feedback</div>
            <div style={{ fontSize: "22px", fontWeight: "bold", color: pendingFeedbackLogsCount > 0 ? "#fbbf24" : "#fff" }}>
              {pendingFeedbackLogsCount}
            </div>
          </div>
        </div>

        <div className="card" style={{ display: "flex", alignItems: "center", gap: "16px" }}>
          <div style={{ width: "48px", height: "48px", borderRadius: "12px", background: "rgba(168, 85, 247, 0.2)", color: "#c084fc", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "24px" }}>
            💵
          </div>
          <div>
            <div style={{ fontSize: "13px", color: "#9ca3af" }}>Total Salary Received</div>
            <div style={{ fontSize: "20px", fontWeight: "bold", color: "#34d399" }}>
              ${totalSalaryPaid.toFixed(2)}
            </div>
          </div>
        </div>
      </div>

      {/* Quick Action Navigation Buttons */}
      <div className="card">
        <h3 style={{ fontSize: "16px", fontWeight: "600", marginBottom: "16px", color: "#fff" }}>⚡ Quick Actions</h3>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))", gap: "12px" }}>
          <Link to="/teacher/students" className="btn btn-primary" style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: "8px", textDecoration: "none", padding: "12px" }}>
            <span>👥</span> Student Roster
          </Link>
          <Link to="/teacher/schedules" className="btn btn-secondary" style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: "8px", textDecoration: "none", padding: "12px" }}>
            <span>📅</span> Manage Schedule
          </Link>
          <Link to="/teacher/practice-logs" className="btn btn-secondary" style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: "8px", textDecoration: "none", padding: "12px" }}>
            <span>🎼</span> Student Practice Logs
          </Link>
          <Link to="/teacher/salaries" className="btn btn-secondary" style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: "8px", textDecoration: "none", padding: "12px" }}>
            <span>💵</span> Salary Details
          </Link>
        </div>
      </div>

      {/* Main Grid: Upcoming Teaching Schedule & Student Roster */}
      <div className="grid-responsive">
        {/* Next Teaching Sessions Card */}
        <div className="card">
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "16px" }}>
            <h2 style={{ fontSize: "18px", fontWeight: "bold", margin: 0, color: "#fff", display: "flex", alignItems: "center", gap: "8px" }}>
              <span>📅</span> Next Teaching Sessions
            </h2>
            <Link to="/teacher/schedules" style={{ fontSize: "13px", color: "#34d399", textDecoration: "none" }}>View All →</Link>
          </div>
          <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
            {schedules.slice(0, 5).map((s, index) => (
              <div key={s._id} style={{ display: "flex", alignItems: "center", gap: "12px", padding: "12px", borderRadius: "10px", background: "rgba(255, 255, 255, 0.03)", border: "1px solid rgba(255, 255, 255, 0.08)" }}>
                <div style={{ width: "32px", height: "32px", borderRadius: "50%", background: "linear-gradient(135deg, #10b981, #3b82f6)", display: "flex", alignItems: "center", justifyContent: "center", color: "#fff", fontSize: "12px", fontWeight: "bold" }}>
                  {index + 1}
                </div>
                <div style={{ flex: 1 }}>
                  <p style={{ margin: 0, fontSize: "14px", fontWeight: "600", color: "#e5e7eb" }}>
                    {new Date(s.startTime).toLocaleString([], { dateStyle: "medium", timeStyle: "short" })}
                  </p>
                  <p style={{ margin: "2px 0 0 0", fontSize: "12px", color: "#9ca3af" }}>
                    Students: {(s.students || []).map((st) => st.user?.name).filter(Boolean).join(", ") || "No students enrolled"}
                  </p>
                </div>
                <span className="badge badge-success" style={{ fontSize: "11px" }}>
                  {s.status || "Scheduled"}
                </span>
              </div>
            ))}
            {schedules.length === 0 && (
              <div style={{ textAlign: "center", padding: "24px", color: "#9ca3af" }}>
                <div style={{ fontSize: "36px", marginBottom: "8px" }}>📭</div>
                <p style={{ margin: 0 }}>No teaching sessions scheduled</p>
                <Link to="/teacher/schedules" style={{ display: "inline-block", marginTop: "12px", fontSize: "13px", color: "#34d399" }}>
                  Create a New Schedule →
                </Link>
              </div>
            )}
          </div>
        </div>

        {/* Assigned Student Roster Card */}
        <div className="card">
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "16px" }}>
            <h2 style={{ fontSize: "18px", fontWeight: "bold", margin: 0, color: "#fff", display: "flex", alignItems: "center", gap: "8px" }}>
              <span>👨‍🎓</span> Assigned Student Roster
            </h2>
            <Link to="/teacher/students" style={{ fontSize: "13px", color: "#34d399", textDecoration: "none" }}>View All →</Link>
          </div>
          <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
            {students.slice(0, 5).map((st) => (
              <div key={st._id} style={{ display: "flex", alignItems: "center", gap: "12px", padding: "12px", borderRadius: "10px", background: "rgba(255, 255, 255, 0.03)", border: "1px solid rgba(255, 255, 255, 0.08)" }}>
                <div style={{ width: "36px", height: "36px", borderRadius: "50%", background: "rgba(59, 130, 246, 0.2)", color: "#60a5fa", display: "flex", alignItems: "center", justifyContent: "center", fontWeight: "bold", fontSize: "14px" }}>
                  {st.user?.name?.charAt(0)?.toUpperCase() || "S"}
                </div>
                <div style={{ flex: 1 }}>
                  <p style={{ margin: 0, fontSize: "14px", fontWeight: "600", color: "#fff" }}>
                    {st.user?.name || "Student"}
                  </p>
                  <p style={{ margin: "2px 0 0 0", fontSize: "12px", color: "#9ca3af" }}>
                    {st.instrument || "Instrument"} • {st.courseLevel || "Level"}
                  </p>
                </div>
                <span className="badge badge-info" style={{ fontSize: "11px" }}>
                  {st.user?.contactNumber || "Contact N/A"}
                </span>
              </div>
            ))}
            {students.length === 0 && (
              <div style={{ textAlign: "center", padding: "24px", color: "#9ca3af" }}>
                <div style={{ fontSize: "36px", marginBottom: "8px" }}>👥</div>
                <p style={{ margin: 0 }}>No students currently assigned</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default TeacherOverview;


