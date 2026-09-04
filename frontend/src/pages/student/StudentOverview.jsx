import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { api } from "../../utils/api.js";

const StudentOverview = () => {
  const [profile, setProfile] = useState(null);
  const [schedules, setSchedules] = useState([]);
  const [logs, setLogs] = useState([]);
  const [fees, setFees] = useState([]);
  const [recitals, setRecitals] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadData = async () => {
      try {
        const [pRes, sRes, lRes, fRes, rRes] = await Promise.all([
          api.get("/student/me").catch(() => ({ data: null })),
          api.get("/student/schedules").catch(() => ({ data: [] })),
          api.get("/student/practice-logs").catch(() => ({ data: [] })),
          api.get("/student/fees").catch(() => ({ data: [] })),
          api.get("/student/recitals").catch(() => ({ data: [] }))
        ]);
        setProfile(pRes.data);
        setSchedules(sRes.data || []);
        setLogs(lRes.data || []);
        setFees(fRes.data || []);
        setRecitals(rRes.data || []);
      } catch (err) {
        console.error("Error loading student dashboard data:", err);
      } finally {
        setLoading(false);
      }
    };
    loadData();
  }, []);

  const totalPracticeMinutes = logs.reduce((acc, curr) => acc + (curr.durationMinutes || 0), 0);
  const practiceHours = (totalPracticeMinutes / 60).toFixed(1);

  const feeSummary = fees[0] || null;

  if (loading) {
    return <div className="p-6 text-center text-gray-400">Loading student dashboard...</div>;
  }

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "24px" }}>
      {/* Top Welcome Banner */}
      <div className="card" style={{ background: "linear-gradient(135deg, rgba(147, 51, 234, 0.15), rgba(59, 130, 246, 0.15))", border: "1px solid rgba(147, 51, 234, 0.3)" }}>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", flexWrap: "wrap", gap: "16px" }}>
          <div style={{ display: "flex", alignItems: "center", gap: "16px" }}>
            <div style={{ width: "56px", height: "56px", borderRadius: "50%", background: "linear-gradient(135deg, #a855f7, #6366f1)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "28px", color: "#fff" }}>
              🎓
            </div>
            <div>
              <h1 style={{ fontSize: "24px", fontWeight: "bold", margin: 0, color: "#fff" }}>
                Welcome back, {profile?.user?.name || "Student"}!
              </h1>
              <p style={{ margin: "4px 0 0 0", color: "#9ca3af", fontSize: "14px" }}>
                Instrument: <strong style={{ color: "#c084fc" }}>{profile?.instrument || "Not assigned"}</strong> • Level: <strong style={{ color: "#60a5fa" }}>{profile?.courseLevel || "Beginner"}</strong>
              </p>
            </div>
          </div>
          <div style={{ padding: "10px 16px", borderRadius: "12px", background: "rgba(255, 255, 255, 0.05)", border: "1px solid rgba(255, 255, 255, 0.1)" }}>
            <div style={{ fontSize: "12px", color: "#9ca3af" }}>Assigned Instructor</div>
            <div style={{ fontSize: "15px", fontWeight: "600", color: "#34d399" }}>
              👨‍🏫 {profile?.assignedTeacher?.user?.name || "Pending Assignment"}
            </div>
          </div>
        </div>
      </div>

      {/* 4 Stat Cards */}
      <div className="grid-responsive" style={{ gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))", gap: "16px" }}>
        <div className="card" style={{ display: "flex", alignItems: "center", gap: "16px" }}>
          <div style={{ width: "48px", height: "48px", borderRadius: "12px", background: "rgba(59, 130, 246, 0.2)", color: "#60a5fa", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "24px" }}>
            📅
          </div>
          <div>
            <div style={{ fontSize: "13px", color: "#9ca3af" }}>Upcoming Lessons</div>
            <div style={{ fontSize: "22px", fontWeight: "bold", color: "#fff" }}>{schedules.length}</div>
          </div>
        </div>

        <div className="card" style={{ display: "flex", alignItems: "center", gap: "16px" }}>
          <div style={{ width: "48px", height: "48px", borderRadius: "12px", background: "rgba(168, 85, 247, 0.2)", color: "#c084fc", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "24px" }}>
            ⏱️
          </div>
          <div>
            <div style={{ fontSize: "13px", color: "#9ca3af" }}>Practice Hours</div>
            <div style={{ fontSize: "22px", fontWeight: "bold", color: "#fff" }}>{practiceHours} hrs</div>
          </div>
        </div>

        <div className="card" style={{ display: "flex", alignItems: "center", gap: "16px" }}>
          <div style={{ width: "48px", height: "48px", borderRadius: "12px", background: "rgba(52, 211, 153, 0.2)", color: "#34d399", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "24px" }}>
            💰
          </div>
          <div>
            <div style={{ fontSize: "13px", color: "#9ca3af" }}>Fee Status</div>
            <div style={{ fontSize: "18px", fontWeight: "bold", color: feeSummary?.status === "Paid" ? "#34d399" : "#f59e0b" }}>
              {feeSummary?.status || "Pending"}
            </div>
          </div>
        </div>

        <div className="card" style={{ display: "flex", alignItems: "center", gap: "16px" }}>
          <div style={{ width: "48px", height: "48px", borderRadius: "12px", background: "rgba(244, 63, 94, 0.2)", color: "#fb7185", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "24px" }}>
            🎭
          </div>
          <div>
            <div style={{ fontSize: "13px", color: "#9ca3af" }}>Recitals</div>
            <div style={{ fontSize: "22px", fontWeight: "bold", color: "#fff" }}>{recitals.length}</div>
          </div>
        </div>
      </div>

      {/* Quick Action Navigation Buttons */}
      <div className="card">
        <h3 style={{ fontSize: "16px", fontWeight: "600", marginBottom: "16px", color: "#fff" }}>⚡ Quick Actions</h3>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))", gap: "12px" }}>
          <Link to="/student/enroll" className="btn btn-primary" style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: "8px", textDecoration: "none", padding: "12px" }}>
            <span>➕</span> Enroll in Classes
          </Link>
          <Link to="/student/practice-logs" className="btn btn-secondary" style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: "8px", textDecoration: "none", padding: "12px" }}>
            <span>🎼</span> Submit Practice Log
          </Link>
          <Link to="/student/fees" className="btn btn-secondary" style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: "8px", textDecoration: "none", padding: "12px" }}>
            <span>💰</span> View Fee Details
          </Link>
          <Link to="/student/recitals" className="btn btn-secondary" style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: "8px", textDecoration: "none", padding: "12px" }}>
            <span>🎭</span> View Recitals
          </Link>
        </div>
      </div>

      {/* Main Grid: Upcoming Lessons & Recent Practice Logs */}
      <div className="grid-responsive">
        {/* Next Lessons Card */}
        <div className="card">
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "16px" }}>
            <h2 style={{ fontSize: "18px", fontWeight: "bold", margin: 0, color: "#fff", display: "flex", alignItems: "center", gap: "8px" }}>
              <span>📅</span> Next Upcoming Lessons
            </h2>
            <Link to="/student/schedules" style={{ fontSize: "13px", color: "#c084fc", textDecoration: "none" }}>View All →</Link>
          </div>
          <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
            {schedules.slice(0, 5).map((s, index) => (
              <div key={s._id} style={{ display: "flex", alignItems: "center", gap: "12px", padding: "12px", borderRadius: "10px", background: "rgba(255, 255, 255, 0.03)", border: "1px solid rgba(255, 255, 255, 0.08)" }}>
                <div style={{ width: "32px", height: "32px", borderRadius: "50%", background: "linear-gradient(135deg, #a855f7, #ec4899)", display: "flex", alignItems: "center", justifyContent: "center", color: "#fff", fontSize: "12px", fontWeight: "bold" }}>
                  {index + 1}
                </div>
                <div style={{ flex: 1 }}>
                  <p style={{ margin: 0, fontSize: "14px", fontWeight: "600", color: "#e5e7eb" }}>
                    {new Date(s.startTime).toLocaleString([], { dateStyle: "medium", timeStyle: "short" })}
                  </p>
                  <p style={{ margin: "2px 0 0 0", fontSize: "12px", color: "#9ca3af" }}>
                    Instructor: {s.teacher?.user?.name || "Teacher"}
                  </p>
                </div>
                <span className="badge badge-info" style={{ fontSize: "11px" }}>
                  {s.status || "Scheduled"}
                </span>
              </div>
            ))}
            {schedules.length === 0 && (
              <div style={{ textAlign: "center", padding: "24px", color: "#9ca3af" }}>
                <div style={{ fontSize: "36px", marginBottom: "8px" }}>📭</div>
                <p style={{ margin: 0 }}>No upcoming lessons scheduled</p>
                <Link to="/student/enroll" style={{ display: "inline-block", marginTop: "12px", fontSize: "13px", color: "#c084fc" }}>
                  Browse & Enroll in Available Classes →
                </Link>
              </div>
            )}
          </div>
        </div>

        {/* Recent Practice Logs Card */}
        <div className="card">
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "16px" }}>
            <h2 style={{ fontSize: "18px", fontWeight: "bold", margin: 0, color: "#fff", display: "flex", alignItems: "center", gap: "8px" }}>
              <span>🎼</span> Recent Practice Logs
            </h2>
            <Link to="/student/practice-logs" style={{ fontSize: "13px", color: "#c084fc", textDecoration: "none" }}>View All →</Link>
          </div>
          <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
            {logs.slice(0, 4).map((log) => (
              <div key={log._id} style={{ padding: "12px", borderRadius: "10px", background: "rgba(255, 255, 255, 0.03)", border: "1px solid rgba(255, 255, 255, 0.08)" }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                  <span style={{ fontSize: "13px", fontWeight: "600", color: "#c084fc" }}>
                    {new Date(log.date).toLocaleDateString([], { dateStyle: "medium" })}
                  </span>
                  <span style={{ fontSize: "12px", background: "rgba(168, 85, 247, 0.15)", color: "#e9d5ff", padding: "2px 8px", borderRadius: "6px" }}>
                    ⏱️ {log.durationMinutes} mins
                  </span>
                </div>
                {log.notes && (
                  <p style={{ margin: "6px 0 0 0", fontSize: "13px", color: "#d1d5db", fontStyle: "italic" }}>
                    "{log.notes}"
                  </p>
                )}
              </div>
            ))}
            {logs.length === 0 && (
              <div style={{ textAlign: "center", padding: "24px", color: "#9ca3af" }}>
                <div style={{ fontSize: "36px", marginBottom: "8px" }}>📝</div>
                <p style={{ margin: 0 }}>No practice logs submitted yet</p>
                <Link to="/student/practice-logs" style={{ display: "inline-block", marginTop: "12px", fontSize: "13px", color: "#c084fc" }}>
                  Add Your First Practice Log →
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default StudentOverview;


