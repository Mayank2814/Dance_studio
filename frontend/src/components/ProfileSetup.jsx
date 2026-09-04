import React, { useState, useEffect } from "react";
import { useAuth } from "../state/AuthContext";
import { api } from "../utils/api";
import { Navigate, useNavigate } from "react-router-dom";

const ProfileSetup = () => {
  const { user, setUser } = useAuth();
  const navigate = useNavigate();

  const [contactNumber, setContactNumber] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Prefill if already exists
  useEffect(() => {
    if (user?.contactNumber) {
      setContactNumber(user.contactNumber);
    }
  }, [user]);

  // Redirect if profile already completed
  if (user?.contactNumber) {
    return <Navigate to="/dashboard" replace />;
  }

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!contactNumber.trim()) {
      setError("Contact number is required");
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const res = await api.put("/auth/profile", {
        contactNumber: contactNumber.trim(),
      });

      setUser(res.data.user);
      navigate("/dashboard");
    } catch (err) {
      setError(err.response?.data?.message || "Failed to update profile");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="centered-page">
      <div className="auth-container">
        <div className="auth-card">
          <div className="auth-header">
            <h2 className="auth-title">Complete Your Profile</h2>
            <p className="auth-subtitle">
              Please provide your contact number to continue.
            </p>
          </div>

          <form onSubmit={handleSubmit} className="auth-form">
            <div className="form-group">
              <label htmlFor="contactNumber" className="form-label">
                Contact Number *
              </label>
              <input
                type="tel"
                id="contactNumber"
                value={contactNumber}
                onChange={(e) => setContactNumber(e.target.value)}
                className="form-input"
                placeholder="Enter your contact number"
                required
              />
            </div>

            {error && <div className="error-message">{error}</div>}

            <button type="submit" className="auth-button" disabled={loading}>
              {loading ? "Updating..." : "Complete Profile"}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default ProfileSetup;
