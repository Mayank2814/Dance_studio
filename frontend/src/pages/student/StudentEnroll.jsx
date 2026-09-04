import React, { useEffect, useState } from "react";
import { api } from "../../utils/api.js";
import { useAuth } from "../../state/AuthContext.jsx";

const StudentEnroll = () => {
  const { user } = useAuth();
  const [availableClasses, setAvailableClasses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [enrolling, setEnrolling] = useState({});
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [teachers, setTeachers] = useState([]);
  const [creating, setCreating] = useState(false);
  const [createError, setCreateError] = useState("");
  const [formData, setFormData] = useState({
    teacherId: "",
    startTime: "",
    endTime: "",
    room: ""
  });

  useEffect(() => {
    const load = async () => {
      try {
        // Use different endpoint based on role
        const endpoint = user?.role === "admin" 
          ? "/admin/schedules" 
          : "/student/available-classes";
        const res = await api.get(endpoint);
        
        // For admin, filter to show only scheduled future classes
        if (user?.role === "admin") {
          const now = new Date();
          const futureClasses = res.data.filter(
            (s) => s.status === "scheduled" && new Date(s.startTime) >= now
          );
          setAvailableClasses(futureClasses);
        } else {
          setAvailableClasses(res.data);
        }
      } catch (err) {
        console.error("Failed to load classes:", err);
        setCreateError(err?.response?.data?.message || "Failed to load classes");
      } finally {
        setLoading(false);
      }
    };
    load();

    // Load teachers if admin
    if (user?.role === "admin") {
      api.get("/admin/teachers")
        .then((res) => setTeachers(res.data))
        .catch((err) => console.error("Failed to load teachers:", err));
    }
  }, [user]);

  const handleEnroll = async (scheduleId) => {
    setEnrolling({ ...enrolling, [scheduleId]: true });
    try {
      await api.post("/student/enroll", { scheduleId });
      // Remove the enrolled class from the list
      setAvailableClasses(availableClasses.filter((c) => c._id !== scheduleId));
      alert("Successfully enrolled in class!");
    } catch (err) {
      alert(err?.response?.data?.message || "Failed to enroll in class");
    } finally {
      setEnrolling({ ...enrolling, [scheduleId]: false });
    }
  };

  const handleCreateClass = async (e) => {
    e.preventDefault();
    setCreateError("");
    setCreating(true);
    try {
      await api.post("/admin/schedules", {
        teacherId: formData.teacherId,
        studentIds: [], // Empty - students will enroll themselves
        startTime: formData.startTime,
        endTime: formData.endTime,
        room: formData.room
      });
      
      // Reset form
      setFormData({ teacherId: "", startTime: "", endTime: "", room: "" });
      setShowCreateForm(false);
      
      // Reload available classes
      const endpoint = user?.role === "admin" 
        ? "/admin/schedules" 
        : "/student/available-classes";
      const res = await api.get(endpoint);
      
      if (user?.role === "admin") {
        const now = new Date();
        const futureClasses = res.data.filter(
          (s) => s.status === "scheduled" && new Date(s.startTime) >= now
        );
        setAvailableClasses(futureClasses);
      } else {
        setAvailableClasses(res.data);
      }
      
      alert("Class created successfully! Students can now enroll.");
    } catch (err) {
      setCreateError(err?.response?.data?.message || "Failed to create class");
    } finally {
      setCreating(false);
    }
  };

  if (loading) {
    return (
      <div className="card">
        <div className="text-center py-8">
          <div className="loading-spinner" style={{ margin: "0 auto" }}></div>
          <p className="mt-4 text-gray-400">Loading available classes...</p>
        </div>
      </div>
    );
  }

  return (
    <div>
      {/* Create Class Form (Admin Only) */}
      {user?.role === "admin" && (
        <div className="card form-card" style={{ marginBottom: "1.5rem" }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "1rem" }}>
            <h2>Create New Class</h2>
            <button
              className="btn-ghost btn-sm"
              onClick={() => {
                setShowCreateForm(!showCreateForm);
                setCreateError("");
              }}
            >
              {showCreateForm ? "✕ Cancel" : "+ Create Class"}
            </button>
          </div>

          {showCreateForm && (
            <form onSubmit={handleCreateClass}>
              <div className="grid-2">
                <div className="form-group">
                  <label>Teacher</label>
                  <select
                    value={formData.teacherId}
                    onChange={(e) => setFormData({ ...formData, teacherId: e.target.value })}
                    required
                  >
                    <option value="">Select teacher</option>
                    {teachers.map((t) => (
                      <option key={t._id} value={t._id}>
                        {t.user?.name || "Unknown"}
                      </option>
                    ))}
                  </select>
                </div>
                <div className="form-group">
                  <label>Room (optional)</label>
                  <input
                    type="text"
                    value={formData.room}
                    onChange={(e) => setFormData({ ...formData, room: e.target.value })}
                    placeholder="Room number or name"
                  />
                </div>
              </div>
              <div className="grid-2">
                <div className="form-group">
                  <label>Start Time</label>
                  <input
                    type="datetime-local"
                    value={formData.startTime}
                    onChange={(e) => setFormData({ ...formData, startTime: e.target.value })}
                    required
                  />
                </div>
                <div className="form-group">
                  <label>End Time</label>
                  <input
                    type="datetime-local"
                    value={formData.endTime}
                    onChange={(e) => setFormData({ ...formData, endTime: e.target.value })}
                    required
                  />
                </div>
              </div>
              {createError && (
                <div className="error-banner status-error">
                  <span className="text-sm">⚠️ {createError}</span>
                </div>
              )}
              <button type="submit" className="btn-primary" disabled={creating}>
                {creating ? (
                  <>
                    <div className="loading-spinner"></div>
                    Creating...
                  </>
                ) : (
                  <>
                    Create Class
                    <span className="ml-2">→</span>
                  </>
                )}
              </button>
            </form>
          )}
        </div>
      )}

      <div className="card">
        <h2>Enroll in Classes</h2>
        <p className="text-gray-400 mb-4">
          Browse and enroll in available dance classes. Once enrolled, you'll see them in your schedule.
        </p>

      {availableClasses.length === 0 ? (
        <div className="text-center py-12 text-gray-400">
          <div className="text-5xl mb-4">📭</div>
          <p className="text-lg">No available classes at the moment</p>
          <p className="text-sm mt-2">Check back later or contact the admin to create new classes.</p>
        </div>
      ) : (
        <div className="grid-responsive" style={{ gridTemplateColumns: "repeat(auto-fill, minmax(350px, 1fr))" }}>
          {availableClasses.map((classItem) => (
            <div
              key={classItem._id}
              className="card"
              style={{
                display: "flex",
                flexDirection: "column",
                gap: "1rem"
              }}
            >
              <div>
                <h3 className="text-lg font-semibold mb-2">
                  {classItem.teacher?.user?.name || "Teacher"} - Class
                </h3>
                <div className="space-y-2 text-sm">
                  <div className="flex items-center gap-2">
                    <span className="text-gray-400">📅 Date & Time:</span>
                    <span>{new Date(classItem.startTime).toLocaleString()}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-gray-400">⏰ Duration:</span>
                    <span>
                      {new Date(classItem.startTime).toLocaleTimeString()} -{" "}
                      {new Date(classItem.endTime).toLocaleTimeString()}
                    </span>
                  </div>
                  {classItem.room && (
                    <div className="flex items-center gap-2">
                      <span className="text-gray-400">🏠 Room:</span>
                      <span>{classItem.room}</span>
                    </div>
                  )}
                  <div className="flex items-center gap-2">
                    <span className="text-gray-400">👥 Enrolled:</span>
                    <span>{classItem.students?.length || 0} student(s)</span>
                  </div>
                </div>
              </div>

              <button
                className="btn-primary"
                onClick={() => handleEnroll(classItem._id)}
                disabled={enrolling[classItem._id]}
                style={{ marginTop: "auto" }}
              >
                {enrolling[classItem._id] ? (
                  <>
                    <div className="loading-spinner"></div>
                    Enrolling...
                  </>
                ) : (
                  <>
                    Enroll Now
                    <span className="ml-2">→</span>
                  </>
                )}
              </button>
            </div>
          ))}
        </div>
      )}
      </div>
    </div>
  );
};

export default StudentEnroll;

