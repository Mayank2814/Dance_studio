import React, { useEffect, useState } from "react";
import { api } from "../../utils/api.js";

const TeacherPracticeLogs = () => {
  const [logs, setLogs] = useState([]);
  const [feedback, setFeedback] = useState({});

  const load = async () => {
    const res = await api.get("/teacher/practice-logs");
    setLogs(res.data);
  };

  useEffect(() => {
    load();
  }, []);

  const saveFeedback = async (logId) => {
    await api.post("/teacher/practice-logs/feedback", {
      logId,
      feedback: feedback[logId] || ""
    });
    setFeedback((prev) => ({ ...prev, [logId]: "" }));
    load();
  };

  const feedbackStats = {
    total: logs.length,
    withFeedback: logs.filter(l => l.teacherFeedback).length,
    pending: logs.filter(l => !l.teacherFeedback).length
  };

  return (
    <div className="card">
      <h2>Student Practice Logs</h2>

      <div className="stats-grid">
        <div className="stat-card">
          <div className="stat-number">{feedbackStats.total}</div>
          <div className="stat-label">Total Logs</div>
        </div>
        <div className="stat-card">
          <div className="stat-number">{feedbackStats.withFeedback}</div>
          <div className="stat-label">With Feedback</div>
        </div>
        <div className="stat-card">
          <div className="stat-number">{feedbackStats.pending}</div>
          <div className="stat-label">Pending Feedback</div>
        </div>
      </div>

      <div className="table-container">
        <table className="table">
        <thead>
          <tr>
            <th>Student</th>
            <th>Date</th>
            <th>Duration</th>
            <th>Notes</th>
            <th>Feedback</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {logs.map((l) => (
            <tr key={l._id}>
              <td>{l.student?.user?.name}</td>
              <td>{new Date(l.date).toLocaleDateString()}</td>
              <td>{l.durationMinutes} min</td>
              <td>{l.notes}</td>
              <td>
                <div className="feedback-display">
                  <div className="feedback-text">
                    {l.teacherFeedback || "No feedback given yet"}
                  </div>
                  {l.feedbackGivenAt && (
                    <div className="feedback-timestamp">
                      {new Date(l.feedbackGivenAt).toLocaleDateString()}
                    </div>
                  )}
                </div>
              </td>
              <td>
                <div className="feedback-section">
                  <textarea
                    className="feedback-input"
                    placeholder="Add feedback for this practice session..."
                    value={feedback[l._id] ?? l.teacherFeedback ?? ""}
                    onChange={(e) =>
                      setFeedback((prev) => ({ ...prev, [l._id]: e.target.value }))
                    }
                  />
                  <button
                    className="btn-link small"
                    onClick={() => saveFeedback(l._id)}
                    disabled={!feedback[l._id] && !l.teacherFeedback}
                  >
                    {l.teacherFeedback ? "Update" : "Save"}
                  </button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      </div>
    </div>
  );
};

export default TeacherPracticeLogs;


