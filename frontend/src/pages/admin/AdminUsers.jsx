import React, { useEffect, useState } from "react";
import { api } from "../../utils/api.js";

const emptyTeacher = {
  name: "",
  email: "",
  username: "",
  password: "",
  danceStyles: "",
  bio: "",
  salaryType: "monthly",
  salaryAmount: "",
  contactNumber: ""
};

const emptyStudent = {
  name: "",
  email: "",
  username: "",
  password: "",
  assignedTeacherId: "",
  instrument: "",
  courseLevel: "",
  contactNumber: ""
};

const AdminUsers = () => {
  const [teachers, setTeachers] = useState([]);
  const [students, setStudents] = useState([]);
  const [teacherForm, setTeacherForm] = useState(emptyTeacher);
  const [studentForm, setStudentForm] = useState(emptyStudent);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);
  
  // Bulk assignment state
  const [selectedTeacherId, setSelectedTeacherId] = useState("");
  const [selectedStudentIds, setSelectedStudentIds] = useState([]);
  const [bulkAssignLoading, setBulkAssignLoading] = useState(false);

  const load = async () => {
    const [tRes, sRes] = await Promise.all([
      api.get("/admin/teachers"),
      api.get("/admin/students")
    ]);
    setTeachers(tRes.data);
    setStudents(sRes.data);
  };

  useEffect(() => {
    load();
  }, []);

  const handleCreateTeacher = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setSuccess(null);
    try {
      const payload = {
        ...teacherForm,
        danceStyles: teacherForm.danceStyles
          ? teacherForm.danceStyles.split(",").map((s) => s.trim())
          : []
      };
      await api.post("/admin/teachers", payload);
      setTeacherForm(emptyTeacher);
      setSuccess("Teacher created successfully!");
      await load();
      setTimeout(() => setSuccess(null), 3000);
    } catch (err) {
      const errorMsg = err.response?.data?.message || err.message || "Failed to create teacher";
      setError(errorMsg);
      setTimeout(() => setError(null), 5000);
    } finally {
      setLoading(false);
    }
  };

  const handleCreateStudent = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setSuccess(null);
    try {
      await api.post("/admin/students", studentForm);
      setStudentForm(emptyStudent);
      setSuccess("Student created successfully!");
      await load();
      setTimeout(() => setSuccess(null), 3000);
    } catch (err) {
      const errorMsg = err.response?.data?.message || err.message || "Failed to create student";
      setError(errorMsg);
      setTimeout(() => setError(null), 5000);
    } finally {
      setLoading(false);
    }
  };

  const toggleTeacherActive = async (t) => {
    await api.put(`/admin/teachers/${t._id}`, { isActive: !t.user.isActive });
    load();
  };

  const toggleStudentActive = async (s) => {
    await api.put(`/admin/students/${s._id}`, { isActive: !s.user.isActive });
    load();
  };

  const handleBulkAssign = async (e) => {
    e.preventDefault();
    if (!selectedTeacherId || selectedStudentIds.length === 0) {
      setError("Please select a teacher and at least one student");
      return;
    }

    setBulkAssignLoading(true);
    setError(null);
    setSuccess(null);

    try {
      // Assign all selected students to the selected teacher
      await Promise.all(
        selectedStudentIds.map(studentId =>
          api.put(`/admin/students/${studentId}`, { assignedTeacherId: selectedTeacherId })
        )
      );

      setSuccess(`${selectedStudentIds.length} student(s) assigned to teacher successfully!`);
      setSelectedTeacherId("");
      setSelectedStudentIds([]);
      await load();
      setTimeout(() => setSuccess(null), 3000);
    } catch (err) {
      const errorMsg = err.response?.data?.message || err.message || "Failed to assign students";
      setError(errorMsg);
      setTimeout(() => setError(null), 5000);
    } finally {
      setBulkAssignLoading(false);
    }
  };

  const handleStudentSelection = (studentId) => {
    setSelectedStudentIds(prev =>
      prev.includes(studentId)
        ? prev.filter(id => id !== studentId)
        : [...prev, studentId]
    );
  };

  const selectAllStudents = () => {
    setSelectedStudentIds(students.map(s => s._id));
  };

  const clearAllStudents = () => {
    setSelectedStudentIds([]);
  };

  return (
    <>
      {(error || success) && (
        <div className="alert-container">
          {error && <div className="alert alert-error">{error}</div>}
          {success && <div className="alert alert-success">{success}</div>}
        </div>
      )}
      <div className="two-column">
        <div>
          <h2>Teachers</h2>
        <form className="card form-card" onSubmit={handleCreateTeacher}>
          <h3>Create Teacher</h3>
          <div className="grid-2">
            <div className="form-group">
              <label>Name</label>
              <input
                value={teacherForm.name}
                onChange={(e) => setTeacherForm({ ...teacherForm, name: e.target.value })}
                required
              />
            </div>
            <div className="form-group">
              <label>Email</label>
              <input
                type="email"
                value={teacherForm.email}
                onChange={(e) => setTeacherForm({ ...teacherForm, email: e.target.value })}
                required
              />
            </div>
            <div className="form-group">
              <label>Username</label>
              <input
                value={teacherForm.username}
                onChange={(e) =>
                  setTeacherForm({ ...teacherForm, username: e.target.value })
                }
                required
              />
            </div>
            <div className="form-group">
              <label>Temp Password</label>
              <input
                type="password"
                value={teacherForm.password}
                onChange={(e) =>
                  setTeacherForm({ ...teacherForm, password: e.target.value })
                }
                required
              />
            </div>
            <div className="form-group">
              <label>Contact Number</label>
              <input
                type="tel"
                value={teacherForm.contactNumber}
                onChange={(e) =>
                  setTeacherForm({ ...teacherForm, contactNumber: e.target.value })
                }
                placeholder="e.g., +1 (555) 123-4567"
              />
            </div>
            <div className="form-group">
              <label>Dance Style (comma separated)</label>
              <input
                value={teacherForm.danceStyles}
                onChange={(e) =>
                  setTeacherForm({ ...teacherForm, danceStyles: e.target.value })
                }
                placeholder="e.g. Hip Hop, Ballet, Contemporary, Bollywood"
              />
            </div>
            <div className="form-group">
              <label>Salary Type</label>
              <select
                value={teacherForm.salaryType}
                onChange={(e) =>
                  setTeacherForm({ ...teacherForm, salaryType: e.target.value })
                }
              >
                <option value="monthly">Monthly</option>
                <option value="per_class">Per Class</option>
                <option value="fixed">Fixed</option>
              </select>
            </div>
            <div className="form-group">
              <label>Salary Amount</label>
              <input
                type="number"
                value={teacherForm.salaryAmount}
                onChange={(e) =>
                  setTeacherForm({ ...teacherForm, salaryAmount: e.target.value })
                }
              />
            </div>
            <div className="form-group full-width">
              <label>Bio</label>
              <textarea
                value={teacherForm.bio}
                onChange={(e) => setTeacherForm({ ...teacherForm, bio: e.target.value })}
              />
            </div>
          </div>
          <button className="btn-primary" disabled={loading}>
            {loading ? "Creating..." : "Create Teacher"}
          </button>
        </form>

        <div className="card">
          <h3>Existing Teachers</h3>
          <div className="table-container">
            <table className="table">
            <thead>
              <tr>
                <th>Name</th>
                <th>Email</th>
                <th>Contact</th>
                <th>Dance Style</th>
                <th>Status</th>
                <th></th>
              </tr>
            </thead>
            <tbody>
              {teachers.length === 0 ? (
                <tr>
                  <td colSpan="6" style={{ textAlign: "center", padding: "2rem", color: "#94a3b8" }}>
                    No teachers found. Create your first teacher above.
                  </td>
                </tr>
              ) : (
                teachers.map((t) => (
                  <tr key={t._id}>
                    <td>{t.user?.name || "—"}</td>
                    <td>{t.user?.email || "—"}</td>
                    <td>{t.user?.contactNumber || "—"}</td>
                    <td>{(t.danceStyles || []).join(", ") || "—"}</td>
                    <td>
                      <span
                        className={
                          t.user?.isActive ? "badge badge-success" : "badge badge-muted"
                        }
                      >
                        {t.user?.isActive ? "Active" : "Inactive"}
                      </span>
                    </td>
                    <td>
                      <button
                        className="btn-link"
                        onClick={() => toggleTeacherActive(t)}
                      >
                        {t.user?.isActive ? "Deactivate" : "Activate"}
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
          </div>
        </div>
      </div>

      <div>
        <h2>Students</h2>
        <form className="card form-card" onSubmit={handleCreateStudent}>
          <h3>Create Student</h3>
          <div className="grid-2">
            <div className="form-group">
              <label>Name</label>
              <input
                value={studentForm.name}
                onChange={(e) => setStudentForm({ ...studentForm, name: e.target.value })}
                required
              />
            </div>
            <div className="form-group">
              <label>Email</label>
              <input
                type="email"
                value={studentForm.email}
                onChange={(e) =>
                  setStudentForm({ ...studentForm, email: e.target.value })
                }
                required
              />
            </div>
            <div className="form-group">
              <label>Username</label>
              <input
                value={studentForm.username}
                onChange={(e) =>
                  setStudentForm({ ...studentForm, username: e.target.value })
                }
                required
              />
            </div>
            <div className="form-group">
              <label>Temp Password</label>
              <input
                type="password"
                value={studentForm.password}
                onChange={(e) =>
                  setStudentForm({ ...studentForm, password: e.target.value })
                }
                required
              />
            </div>
            <div className="form-group">
              <label>Contact Number</label>
              <input
                type="tel"
                value={studentForm.contactNumber}
                onChange={(e) =>
                  setStudentForm({ ...studentForm, contactNumber: e.target.value })
                }
                placeholder="e.g., +1 (555) 123-4567"
              />
            </div>
            <div className="form-group">
              <label>Assigned Teacher</label>
              <select
                value={studentForm.assignedTeacherId}
                onChange={(e) =>
                  setStudentForm({
                    ...studentForm,
                    assignedTeacherId: e.target.value
                  })
                }
              >
                <option value="">Select teacher</option>
                {teachers.map((t) => (
                  <option key={t._id} value={t._id}>
                    {t.user.name}
                  </option>
                ))}
              </select>
            </div>
            <div className="form-group">
              <label>Dance Style</label>
              <input
                value={studentForm.instrument}
                onChange={(e) =>
                  setStudentForm({ ...studentForm, instrument: e.target.value })
                }
                placeholder="e.g. Hip Hop, Ballet, Contemporary"
              />
            </div>
            <div className="form-group">
              <label>Course Level</label>
              <input
                value={studentForm.courseLevel}
                onChange={(e) =>
                  setStudentForm({ ...studentForm, courseLevel: e.target.value })
                }
              />
            </div>
          </div>
          <button className="btn-primary" disabled={loading}>
            {loading ? "Creating..." : "Create Student"}
          </button>
        </form>

        <form className="card form-card" onSubmit={handleBulkAssign}>
          <h3>Bulk Assign Students to Teacher</h3>
          <div className="form-group">
            <label>Select Teacher</label>
            <select
              value={selectedTeacherId}
              onChange={(e) => setSelectedTeacherId(e.target.value)}
              required
            >
              <option value="">Choose a teacher</option>
              {teachers.filter(t => t.user?.isActive).map((t) => (
                <option key={t._id} value={t._id}>
                  {t.user.name} ({(t.danceStyles || []).join(", ")})
                </option>
              ))}
            </select>
          </div>

          <div className="form-group">
            <label>Select Students to Assign</label>
            <div style={{ display: "flex", gap: "0.5rem", marginBottom: "0.5rem" }}>
              <button
                type="button"
                className="btn-link small"
                onClick={selectAllStudents}
                disabled={students.length === 0}
              >
                Select All
              </button>
              <button
                type="button"
                className="btn-link small danger"
                onClick={clearAllStudents}
                disabled={selectedStudentIds.length === 0}
              >
                Clear All
              </button>
            </div>
            <div style={{
              maxHeight: "200px",
              overflowY: "auto",
              border: "1px solid #374151",
              borderRadius: "0.5rem",
              padding: "0.5rem",
              background: "#020617"
            }}>
              {students.length === 0 ? (
                <p style={{ color: "#94a3b8", margin: 0 }}>No students available</p>
              ) : (
                students.map((s) => (
                  <label key={s._id} style={{
                    display: "flex",
                    alignItems: "center",
                    gap: "0.5rem",
                    padding: "0.25rem",
                    cursor: "pointer",
                    borderRadius: "0.25rem",
                    marginBottom: "0.25rem"
                  }}>
                    <input
                      type="checkbox"
                      checked={selectedStudentIds.includes(s._id)}
                      onChange={() => handleStudentSelection(s._id)}
                    />
                    <span style={{ color: "#e5e7eb" }}>
                      {s.user?.name} ({s.instrument || "No dance style assigned"})
                      {s.assignedTeacher && ` - Currently: ${s.assignedTeacher.user?.name}`}
                    </span>
                  </label>
                ))
              )}
            </div>
            {selectedStudentIds.length > 0 && (
              <p style={{ color: "#10b981", marginTop: "0.5rem", fontSize: "0.875rem" }}>
                {selectedStudentIds.length} student(s) selected
              </p>
            )}
          </div>

          <button className="btn-primary" disabled={bulkAssignLoading || !selectedTeacherId || selectedStudentIds.length === 0}>
            {bulkAssignLoading ? "Assigning..." : "Assign Students to Teacher"}
          </button>
          <button
            type="button"
            className="btn-link danger"
            style={{ marginLeft: "1rem" }}
            onClick={async () => {
              if (selectedStudentIds.length === 0) {
                setError("Please select students to unassign");
                return;
              }
              
              setBulkAssignLoading(true);
              setError(null);
              setSuccess(null);
              
              try {
                await Promise.all(
                  selectedStudentIds.map(studentId =>
                    api.put(`/admin/students/${studentId}`, { assignedTeacherId: null })
                  )
                );
                
                setSuccess(`${selectedStudentIds.length} student(s) unassigned from teachers successfully!`);
                setSelectedStudentIds([]);
                await load();
                setTimeout(() => setSuccess(null), 3000);
              } catch (err) {
                const errorMsg = err.response?.data?.message || err.message || "Failed to unassign students";
                setError(errorMsg);
                setTimeout(() => setError(null), 5000);
              } finally {
                setBulkAssignLoading(false);
              }
            }}
            disabled={bulkAssignLoading || selectedStudentIds.length === 0}
          >
            Unassign Selected Students
          </button>
        </form>

        <div className="card">
          <h3>Existing Students</h3>
          <div className="table-container">
            <table className="table">
            <thead>
              <tr>
                <th>Name</th>
                <th>Email</th>
                <th>Contact</th>
                <th>Teacher</th>
                <th>Status</th>
                <th></th>
              </tr>
            </thead>
            <tbody>
              {students.length === 0 ? (
                <tr>
                  <td colSpan="6" style={{ textAlign: "center", padding: "2rem", color: "#94a3b8" }}>
                    No students found. Create your first student above.
                  </td>
                </tr>
              ) : (
                students.map((s) => (
                  <tr key={s._id}>
                    <td>{s.user?.name || "—"}</td>
                    <td>{s.user?.email || "—"}</td>
                    <td>{s.user?.contactNumber || "—"}</td>
                    <td>{s.assignedTeacher?.user?.name || "—"}</td>
                    <td>
                      <span
                        className={
                          s.user?.isActive ? "badge badge-success" : "badge badge-muted"
                        }
                      >
                        {s.user?.isActive ? "Active" : "Inactive"}
                      </span>
                    </td>
                    <td>
                      <button
                        className="btn-link"
                        onClick={() => toggleStudentActive(s)}
                      >
                        {s.user?.isActive ? "Deactivate" : "Activate"}
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
          </div>
        </div>
      </div>
    </div>
    </>
  );
};

export default AdminUsers;


