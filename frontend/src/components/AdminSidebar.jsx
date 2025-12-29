import { useEffect, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import api from "../api/axios";

export default function AdminSidebar() {
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    fetchNotifications();
  }, []);

  const fetchNotifications = async () => {
    try {
      const res = await api.get("/admin/notifications");
      setNotifications(res.data);
    } catch (error) {
      console.error("Failed to fetch notifications:", error);
    } finally {
      setLoading(false);
    }
  };

  const markRead = async () => {
    try {
      await api.put("/admin/notifications/read");
      setNotifications([]);
    } catch (error) {
      console.error("Failed to mark notifications as read:", error);
    }
  };

  const menuItems = [
    { path: "/admin-dashboard", icon: "📊", label: "Dashboard", section: "main" },
    { path: "/admin-dashboard#charts-section", icon: "📈", label: "Analytics", section: "analytics" },
    { path: "/admin-dashboard#applications", icon: "📝", label: "Applications", section: "applications" },
    { path: "/admin-dashboard#leaderboard", icon: "🏆", label: "Leaderboard", section: "leaderboard" },
    { path: "/applicants", icon: "👥", label: "Manage Applicants", section: "applicants" },
    { path: "/create-opportunity", icon: "➕", label: "Create Opportunity", section: "create" },
  ];

  const isActive = (path) => {
    if (path.includes("#")) {
      return location.pathname + location.hash === path;
    }
    return location.pathname === path;
  };

  return (
    <aside className="admin-sidebar">
      <div className="sidebar-shapes">
        <div className="sidebar-shape"></div>
        <div className="sidebar-shape"></div>
        <div className="sidebar-shape"></div>
      </div>
      <div className="admin-sidebar-header">
        <h3>🔧 Admin Panel</h3>
        <p className="sidebar-subtitle">Organization Management</p>
      </div>

      {/* Notifications Section */}
      <div className="notifications-section">
        <div className="notifications-header">
          <span className="notifications-title">
            🔔 Notifications
          </span>
          <span className="notifications-badge">
            {notifications.length}
          </span>
        </div>

        {loading ? (
          <div className="notifications-loading">
            <div className="spinner"></div>
            <span>Loading...</span>
          </div>
        ) : notifications.length > 0 ? (
          <div className="notifications-list">
            {notifications.slice(0, 3).map((n, i) => (
              <div key={i} className="notification-item">
                <div className="notification-icon">•</div>
                <div className="notification-text">{n.message}</div>
              </div>
            ))}
            {notifications.length > 3 && (
              <div className="notification-more">
                +{notifications.length - 3} more
              </div>
            )}
            <button className="btn btn-sm btn-secondary" onClick={markRead}>
              Mark all read
            </button>
          </div>
        ) : (
          <div className="notifications-empty">
            <span>✓ All caught up!</span>
          </div>
        )}
      </div>

      {/* Navigation Menu */}
      <nav className="admin-nav">
        <div className="nav-section">
          <h4 className="nav-section-title">Main</h4>
          {menuItems.filter(item => ["main", "analytics"].includes(item.section)).map((item) => (
            <button
              key={item.path}
              className={`nav-item ${isActive(item.path) ? "active" : ""}`}
              onClick={() => {
                if (item.path.includes("#")) {
                  const [path, hash] = item.path.split("#");
                  navigate(path);
                  setTimeout(() => {
                    const element = document.getElementById(hash);
                    if (element) {
                      element.scrollIntoView({ behavior: "smooth" });
                    }
                  }, 100);
                } else {
                  navigate(item.path);
                }
              }}
            >
              <span className="nav-icon">{item.icon}</span>
              <span className="nav-label">{item.label}</span>
            </button>
          ))}
        </div>

        <div className="nav-section">
          <h4 className="nav-section-title">Management</h4>
          {menuItems.filter(item => ["applications", "applicants", "leaderboard"].includes(item.section)).map((item) => (
            <button
              key={item.path}
              className={`nav-item ${isActive(item.path) ? "active" : ""}`}
              onClick={() => {
                if (item.path.includes("#")) {
                  const [path, hash] = item.path.split("#");
                  navigate(path);
                  setTimeout(() => {
                    const element = document.getElementById(hash);
                    if (element) {
                      element.scrollIntoView({ behavior: "smooth" });
                    }
                  }, 100);
                } else {
                  navigate(item.path);
                }
              }}
            >
              <span className="nav-icon">{item.icon}</span>
              <span className="nav-label">{item.label}</span>
            </button>
          ))}
        </div>

        <div className="nav-section">
          <h4 className="nav-section-title">Actions</h4>
          {menuItems.filter(item => item.section === "create").map((item) => (
            <button
              key={item.path}
              className={`nav-item ${isActive(item.path) ? "active" : ""}`}
              onClick={() => navigate(item.path)}
            >
              <span className="nav-icon">{item.icon}</span>
              <span className="nav-label">{item.label}</span>
            </button>
          ))}
        </div>
      </nav>

      {/* Quick Stats */}
      <div className="sidebar-stats">
        <h4 className="stats-title">Quick Stats</h4>
        <div className="stats-grid">
          <div className="stat-item">
            <div className="stat-icon">📝</div>
            <div className="stat-info">
              <div className="stat-label">Pending</div>
              <div className="stat-value">-</div>
            </div>
          </div>
          <div className="stat-item">
            <div className="stat-icon">✅</div>
            <div className="stat-info">
              <div className="stat-label">Approved</div>
              <div className="stat-value">-</div>
            </div>
          </div>
        </div>
      </div>
    </aside>
  );
}