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

      {/* ── Welcome Banner ── */}
      <div className="welcome-banner">
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", flexWrap: "wrap", gap: "16px", position: "relative", zIndex: 1 }}>
          <div style={{ display: "flex", alignItems: "center", gap: "16px" }}>
            <div style={{ width: "60px", height: "60px", borderRadius: "50%", background: "linear-gradient(135deg, #6366f1, #a855f7, #ec4899)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "28px", boxShadow: "0 4px 20px rgba(99,102,241,0.4)" }}>
              🎓
            </div>
            <div>
              <h1 style={{ fontSize: "22px", fontWeight: "800", margin: 0, color: "#f1f5f9", fontFamily: "'Outfit', sans-serif", letterSpacing: "-0.01em" }}>
                Welcome back, {profile?.user?.name || "Student"}!
              </h1>
              <p style={{ margin: "4px 0 0 0", color: "#94a3b8", fontSize: "13px", fontFamily: "'Inter', sans-serif" }}>
                Dance style: <strong style={{ color: "#c084fc" }}>{profile?.instrument || "Not assigned"}</strong> · Level: <strong style={{ color: "#60a5fa" }}>{profile?.courseLevel || "Beginner"}</strong>
              </p>
            </div>
          </div>
          <div style={{ padding: "10px 18px", borderRadius: "12px", background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.1)", backdropFilter: "blur(10px)" }}>
            <div style={{ fontSize: "11px", color: "#94a3b8", letterSpacing: "0.06em", textTransform: "uppercase", fontFamily: "'Outfit', sans-serif" }}>Assigned Instructor</div>
            <div style={{ fontSize: "15px", fontWeight: "700", color: "#34d399", marginTop: "2px", fontFamily: "'Outfit', sans-serif" }}>
              👨‍🏫 {profile?.assignedTeacher?.user?.name || "Pending Assignment"}
            </div>
          </div>
        </div>
      </div>

      {/* ── Stat Cards ── */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: "16px" }}>
        <div className="stat-card-lp">
          <div className="stat-card-icon" style={{ background: "rgba(59,130,246,0.18)", border: "1px solid rgba(59,130,246,0.25)" }}>📅</div>
          <div className="stat-card-body">
            <span className="stat-card-label">Upcoming Lessons</span>
            <span className="stat-card-value" style={{ color: "#60a5fa" }}>{schedules.length}</span>
          </div>
        </div>

        <div className="stat-card-lp">
          <div className="stat-card-icon" style={{ background: "rgba(168,85,247,0.18)", border: "1px solid rgba(168,85,247,0.25)" }}>⏱️</div>
          <div className="stat-card-body">
            <span className="stat-card-label">Practice Hours</span>
            <span className="stat-card-value" style={{ color: "#c084fc" }}>{practiceHours} <span style={{ fontSize: "0.9rem", fontWeight: 500 }}>hrs</span></span>
          </div>
        </div>

        <div className="stat-card-lp">
          <div className="stat-card-icon" style={{ background: "rgba(52,211,153,0.15)", border: "1px solid rgba(52,211,153,0.25)" }}>💰</div>
          <div className="stat-card-body">
            <span className="stat-card-label">Fee Status</span>
            <span className="stat-card-value" style={{ fontSize: "1.3rem", color: feeSummary?.status === "Paid" ? "#34d399" : "#f59e0b" }}>
              {feeSummary?.status || "Pending"}
            </span>
          </div>
        </div>

        <div className="stat-card-lp">
          <div className="stat-card-icon" style={{ background: "rgba(244,63,94,0.15)", border: "1px solid rgba(244,63,94,0.25)" }}>🎭</div>
          <div className="stat-card-body">
            <span className="stat-card-label">Recitals</span>
            <span className="stat-card-value" style={{ color: "#fb7185" }}>{recitals.length}</span>
          </div>
        </div>
      </div>

      {/* ── Quick Actions ── */}
      <div className="quick-actions-section">
        <div className="section-header" style={{ marginBottom: "1rem" }}>
          <div className="section-header-left">
            <div className="section-header-icon">⚡</div>
            <h3 className="section-title">Quick Actions</h3>
          </div>
        </div>
        <div className="quick-actions-grid">
          <Link to="/student/enroll" className="quick-action-btn primary">
            <span>➕</span> Enroll in Classes
          </Link>
          <Link to="/student/practice-logs" className="quick-action-btn">
            <span>🎼</span> Submit Practice Log
          </Link>
          <Link to="/student/fees" className="quick-action-btn">
            <span>💰</span> View Fee Details
          </Link>
          <Link to="/student/recitals" className="quick-action-btn">
            <span>🎭</span> View Recitals
          </Link>
        </div>
      </div>

      {/* ── Main Grid ── */}
      <div className="grid-responsive">
        {/* Next Lessons */}
        <div className="card">
          <div className="section-header">
            <div className="section-header-left">
              <div className="section-header-icon">📅</div>
              <h2 className="section-title">Next Upcoming Lessons</h2>
            </div>
            <Link to="/student/schedules" style={{ fontSize: "13px", color: "#c084fc", textDecoration: "none", fontWeight: 600, whiteSpace: "nowrap" }}>View All →</Link>
          </div>
          <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
            {schedules.slice(0, 5).map((s, index) => (
              <div key={s._id} style={{ display: "flex", alignItems: "center", gap: "12px", padding: "12px 14px", borderRadius: "12px", background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.07)" }}>
                <div style={{ width: "30px", height: "30px", borderRadius: "50%", background: "linear-gradient(135deg, #a855f7, #ec4899)", display: "flex", alignItems: "center", justifyContent: "center", color: "#fff", fontSize: "12px", fontWeight: "bold", flexShrink: 0 }}>
                  {index + 1}
                </div>
                <div style={{ flex: 1 }}>
                  <p style={{ margin: 0, fontSize: "13px", fontWeight: "600", color: "#e5e7eb", fontFamily: "'Outfit', sans-serif" }}>
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
              <div style={{ textAlign: "center", padding: "32px 24px", color: "#9ca3af" }}>
                <div style={{ fontSize: "40px", marginBottom: "10px" }}>📭</div>
                <p style={{ margin: 0, fontSize: "14px" }}>No upcoming lessons scheduled</p>
                <Link to="/student/enroll" style={{ display: "inline-block", marginTop: "12px", fontSize: "13px", color: "#c084fc", fontWeight: 600 }}>
                  Browse &amp; Enroll in Available Classes →
                </Link>
              </div>
            )}
          </div>
        </div>

        {/* Recent Practice Logs */}
        <div className="card">
          <div className="section-header">
            <div className="section-header-left">
              <div className="section-header-icon">🎼</div>
              <h2 className="section-title">Recent Practice Logs</h2>
            </div>
            <Link to="/student/practice-logs" style={{ fontSize: "13px", color: "#c084fc", textDecoration: "none", fontWeight: 600, whiteSpace: "nowrap" }}>View All →</Link>
          </div>
          <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
            {logs.slice(0, 4).map((log) => (
              <div key={log._id} style={{ padding: "12px 14px", borderRadius: "12px", background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.07)" }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                  <span style={{ fontSize: "13px", fontWeight: "700", color: "#c084fc", fontFamily: "'Outfit', sans-serif" }}>
                    {new Date(log.date).toLocaleDateString([], { dateStyle: "medium" })}
                  </span>
                  <span style={{ fontSize: "12px", background: "rgba(168,85,247,0.15)", color: "#e9d5ff", padding: "3px 10px", borderRadius: "8px", fontWeight: 600 }}>
                    ⏱️ {log.durationMinutes} mins
                  </span>
                </div>
                {log.notes && (
                  <p style={{ margin: "6px 0 0 0", fontSize: "13px", color: "#d1d5db", fontStyle: "italic", lineHeight: 1.5 }}>
                    "{log.notes}"
                  </p>
                )}
              </div>
            ))}
            {logs.length === 0 && (
              <div style={{ textAlign: "center", padding: "32px 24px", color: "#9ca3af" }}>
                <div style={{ fontSize: "40px", marginBottom: "10px" }}>📝</div>
                <p style={{ margin: 0, fontSize: "14px" }}>No practice logs submitted yet</p>
                <Link to="/student/practice-logs" style={{ display: "inline-block", marginTop: "12px", fontSize: "13px", color: "#c084fc", fontWeight: 600 }}>
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
