import React, { useState, useEffect, useRef, useCallback } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import { useAuth } from "../../state/AuthContext.jsx";

export const DashboardLayout = ({ role, children }) => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isProfileDropdownOpen, setIsProfileDropdownOpen] = useState(false);
  const [isProfileModalOpen, setIsProfileModalOpen] = useState(false);

  // Ref on the entire profile menu wrapper (button + dropdown)
  const profileWrapperRef = useRef(null);

  const navItemsByRole = {
    admin: [
      { to: "/admin",           label: "Overview",       icon: "📊" },
      { to: "/admin/users",     label: "Users",          icon: "👥" },
      { to: "/admin/schedules", label: "Schedules",      icon: "📅" },
      { to: "/admin/enroll",    label: "Enroll Classes", icon: "➕" },
      { to: "/admin/fees",      label: "Fees",           icon: "💰" },
      { to: "/admin/salaries",  label: "Salaries",       icon: "💵" },
      { to: "/admin/recitals",  label: "Recitals",       icon: "🎭" },
      { to: "/admin/faqs",      label: "FAQs",           icon: "❓" },
    ],
    teacher: [
      { to: "/teacher",                label: "Overview",      icon: "📊" },
      { to: "/teacher/students",       label: "Students",      icon: "👨‍🎓" },
      { to: "/teacher/schedules",      label: "Schedules",     icon: "📅" },
      { to: "/teacher/practice-logs",  label: "Practice Logs", icon: "🎼" },
      { to: "/teacher/salaries",       label: "Salary",        icon: "💵" },
      { to: "/teacher/recitals",       label: "Recitals",      icon: "🎭" },
      { to: "/teacher/faqs",           label: "FAQs",          icon: "❓" },
    ],
    student: [
      { to: "/student",                label: "Overview",        icon: "📊" },
      { to: "/student/enroll",         label: "Enroll in Classes", icon: "➕" },
      { to: "/student/schedules",      label: "Schedule",        icon: "📅" },
      { to: "/student/practice-logs",  label: "Practice Logs",   icon: "🎼" },
      { to: "/student/fees",           label: "Fees",            icon: "💰" },
      { to: "/student/recitals",       label: "Recitals",        icon: "🎭" },
      { to: "/student/faqs",           label: "FAQs",            icon: "❓" },
    ],
  };

  const items = navItemsByRole[role] || [];

  // Close dropdown on outside click
  const handleClickOutside = useCallback((e) => {
    if (profileWrapperRef.current && !profileWrapperRef.current.contains(e.target)) {
      setIsProfileDropdownOpen(false);
    }
  }, []);

  // Close dropdown on ESC
  const handleKeyDown = useCallback((e) => {
    if (e.key === "Escape") {
      setIsProfileDropdownOpen(false);
      setIsProfileModalOpen(false);
      setIsMobileMenuOpen(false);
    }
  }, []);

  useEffect(() => {
    document.addEventListener("mousedown", handleClickOutside);
    document.addEventListener("touchstart", handleClickOutside);
    document.addEventListener("keydown", handleKeyDown);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      document.removeEventListener("touchstart", handleClickOutside);
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [handleClickOutside, handleKeyDown]);

  const handleLogout = () => {
    setIsProfileDropdownOpen(false);
    logout(); // clears token from localStorage, sets user to null, redirects to /login
  };

  const handleViewProfile = () => {
    setIsProfileDropdownOpen(false);
    setIsProfileModalOpen(true);
  };

  return (
    <div className="dash-shell">
      {/* ── Navigation Header ── */}
      <header className="dash-nav-header">
        {/* Brand */}
        <div className="nav-brand">
          <div className="brand-logo">
            <span className="brand-icon">💃</span>
            <span className="brand-text">Dance School</span>
          </div>
        </div>

        {/* Mobile hamburger */}
        <button
          className="mobile-menu-toggle"
          onClick={() => setIsMobileMenuOpen((p) => !p)}
          aria-label="Toggle navigation menu"
          aria-expanded={isMobileMenuOpen}
        >
          <span className={`hamburger ${isMobileMenuOpen ? "open" : ""}`}>
            <span />
            <span />
            <span />
          </span>
        </button>

        {/* Nav links */}
        <nav className={`nav-menu ${isMobileMenuOpen ? "active" : ""}`} role="navigation">
          {items.map((item, index) => (
            <NavLink
              key={item.to}
              to={item.to}
              end={item.to === `/${role}`}
              className={({ isActive }) => `nav-item${isActive ? " active" : ""}`}
              style={{ animationDelay: `${index * 0.05}s` }}
              onClick={() => setIsMobileMenuOpen(false)}
            >
              <span className="nav-icon">{item.icon}</span>
              <span className="nav-label">{item.label}</span>
            </NavLink>
          ))}
        </nav>

        {/* Profile menu — wrapper is position:relative so dropdown anchors here */}
        <div className="nav-actions">
          <div className="profile-menu-wrapper" ref={profileWrapperRef}>
            <button
              className="user-profile"
              onClick={() => setIsProfileDropdownOpen((p) => !p)}
              aria-haspopup="true"
              aria-expanded={isProfileDropdownOpen}
              type="button"
            >
              <div className="avatar-circle">
                {user?.name?.charAt(0)?.toUpperCase() || "U"}
              </div>
              <div className="user-details">
                <div className="user-name">{user?.name}</div>
                <div className="user-role">{user?.role?.toUpperCase()}</div>
              </div>
              <span className={`dropdown-arrow${isProfileDropdownOpen ? " open" : ""}`}>▼</span>
            </button>

            {/* Dropdown — absolutely anchored to .profile-menu-wrapper */}
            {isProfileDropdownOpen && (
              <div className="profile-dropdown" role="menu">
                <button
                  className="dropdown-item"
                  role="menuitem"
                  onClick={handleViewProfile}
                  type="button"
                >
                  <span className="dropdown-icon">👤</span>
                  <span>View Profile</span>
                </button>
                <div className="dropdown-divider" />
                <button
                  className="dropdown-item logout-item"
                  role="menuitem"
                  onClick={handleLogout}
                  type="button"
                >
                  <span className="dropdown-icon">🚪</span>
                  <span>Logout</span>
                </button>
              </div>
            )}
          </div>
        </div>
      </header>

      {/* ── Main Content ── */}
      <main className="dash-main">
        <div className="main-content">
          {children}
        </div>
      </main>

      {/* ── Profile Modal ── */}
      {isProfileModalOpen && (
        <div
          className="modal-backdrop"
          onClick={() => setIsProfileModalOpen(false)}
          role="dialog"
          aria-modal="true"
          aria-label="User profile"
        >
          <div
            className="profile-modal"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="profile-modal-header">
              <div className="profile-modal-avatar">
                {user?.name?.charAt(0)?.toUpperCase() || "U"}
              </div>
              <button
                className="modal-close-btn"
                onClick={() => setIsProfileModalOpen(false)}
                aria-label="Close profile"
                type="button"
              >✕</button>
            </div>

            <div className="profile-modal-body">
              <h2 className="profile-modal-name">{user?.name}</h2>
              <span className="profile-modal-role-badge">{user?.role?.toUpperCase()}</span>

              <div className="profile-modal-fields">
                <div className="profile-field">
                  <span className="profile-field-icon">📧</span>
                  <div>
                    <div className="profile-field-label">Email</div>
                    <div className="profile-field-value">{user?.email || "—"}</div>
                  </div>
                </div>
                <div className="profile-field">
                  <span className="profile-field-icon">🏷️</span>
                  <div>
                    <div className="profile-field-label">Username</div>
                    <div className="profile-field-value">{user?.username || "—"}</div>
                  </div>
                </div>
                <div className="profile-field">
                  <span className="profile-field-icon">📞</span>
                  <div>
                    <div className="profile-field-label">Contact</div>
                    <div className="profile-field-value">{user?.contactNumber || "—"}</div>
                  </div>
                </div>
                <div className="profile-field">
                  <span className="profile-field-icon">🔒</span>
                  <div>
                    <div className="profile-field-label">Account Status</div>
                    <div className="profile-field-value" style={{ color: user?.isActive ? "#10b981" : "#ef4444" }}>
                      {user?.isActive ? "Active" : "Inactive"}
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="profile-modal-footer">
              <button
                className="btn-primary"
                onClick={handleLogout}
                type="button"
                style={{ background: "linear-gradient(135deg, #ef4444, #dc2626)", width: "auto", padding: "0.6rem 1.5rem" }}
              >
                🚪 Logout
              </button>
              <button
                className="btn-ghost"
                onClick={() => setIsProfileModalOpen(false)}
                type="button"
                style={{ padding: "0.6rem 1.5rem" }}
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

