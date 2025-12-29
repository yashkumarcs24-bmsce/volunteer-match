import Timeline from "./Timeline";
import { useState, useEffect, useCallback } from "react";

export default function VolunteerProfileModal({
  volunteer,
  applications = [],
  onClose,
  dark,
  onApprove,
  onReject,
}) {
  const [activeTab, setActiveTab] = useState("overview");
  const [processing, setProcessing] = useState(null);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    setIsVisible(true);
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, []);

  const handleClose = useCallback(() => {
    setIsVisible(false);
    setTimeout(onClose, 300);
  }, [onClose]);

  useEffect(() => {
    const handleEscape = (e) => {
      if (e.key === 'Escape') {
        handleClose();
      }
    };
    document.addEventListener('keydown', handleEscape);
    return () => document.removeEventListener('keydown', handleEscape);
  }, [handleClose]);

  if (!volunteer) return null;

  const approved = applications.filter(a => a.status === "approved").length;
  const rejected = applications.filter(a => a.status === "rejected").length;
  const pending = applications.filter(a => a.status === "pending").length;
  const total = applications.length;
  const successRate = total > 0 ? Math.round((approved / total) * 100) : 0;

  const handleAction = useCallback(async (appId, action) => {
    setProcessing(appId);
    try {
      if (action === "approve") {
        await onApprove(appId);
      } else {
        await onReject(appId);
      }
    } catch (error) {
      console.error(`Failed to ${action} application:`, error);
    } finally {
      setProcessing(null);
    }
  }, [onApprove, onReject]);

  const getVolunteerLevel = () => {
    if (approved >= 10) return { level: "Expert", icon: "🏆", color: "#f59e0b" };
    if (approved >= 5) return { level: "Advanced", icon: "⭐", color: "#8b5cf6" };
    if (approved >= 2) return { level: "Intermediate", icon: "🌟", color: "#06b6d4" };
    return { level: "Beginner", icon: "🌱", color: "#10b981" };
  };

  const volunteerLevel = getVolunteerLevel();

  return (
    <div 
      className={`modal-overlay ${isVisible ? 'visible' : ''}`} 
      onClick={handleClose}
    >
      <div
        className="volunteer-modal"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="modal-header">
          <div className="volunteer-header-info">
            <div className="volunteer-avatar-large">
              {volunteer.name?.charAt(0)?.toUpperCase() || "?"}
            </div>
            <div>
              <h2>{volunteer.name}</h2>
              <p className="volunteer-email">{volunteer.email}</p>
              <div className="volunteer-level" style={{ color: volunteerLevel.color }}>
                {volunteerLevel.icon} {volunteerLevel.level} Volunteer
              </div>
            </div>
          </div>
          <button 
            className="modal-close-btn" 
            onClick={handleClose}
            aria-label="Close modal"
          >
            ✕
          </button>
        </div>

        {/* Stats Overview */}
        <div className="volunteer-stats">
          <div className="stat-card success">
            <div className="stat-icon">✅</div>
            <div className="stat-info">
              <div className="stat-number">{approved}</div>
              <div className="stat-label">Approved</div>
            </div>
          </div>
          
          <div className="stat-card warning">
            <div className="stat-icon">⏳</div>
            <div className="stat-info">
              <div className="stat-number">{pending}</div>
              <div className="stat-label">Pending</div>
            </div>
          </div>
          
          <div className="stat-card danger">
            <div className="stat-icon">❌</div>
            <div className="stat-info">
              <div className="stat-number">{rejected}</div>
              <div className="stat-label">Rejected</div>
            </div>
          </div>
          
          <div className="stat-card info">
            <div className="stat-icon">📊</div>
            <div className="stat-info">
              <div className="stat-number">{successRate}%</div>
              <div className="stat-label">Success Rate</div>
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div className="modal-tabs">
          <button 
            className={`tab-btn ${activeTab === "overview" ? "active" : ""}`}
            onClick={() => setActiveTab("overview")}
          >
            📋 Overview
          </button>
          <button 
            className={`tab-btn ${activeTab === "applications" ? "active" : ""}`}
            onClick={() => setActiveTab("applications")}
          >
            📄 Applications ({total})
          </button>
        </div>

        {/* Tab Content */}
        <div className="modal-content">
          {activeTab === "overview" && (
            <div className="overview-tab">
              <div className="overview-section">
                <h4>📈 Performance Metrics</h4>
                <div className="metrics-grid">
                  <div className="metric-item">
                    <span className="metric-label">Total Applications:</span>
                    <span className="metric-value">{total}</span>
                  </div>
                  <div className="metric-item">
                    <span className="metric-label">Success Rate:</span>
                    <span className="metric-value">{successRate}%</span>
                  </div>
                  <div className="metric-item">
                    <span className="metric-label">Volunteer Level:</span>
                    <span className="metric-value">{volunteerLevel.level}</span>
                  </div>
                  <div className="metric-item">
                    <span className="metric-label">Join Date:</span>
                    <span className="metric-value">
                      {applications.length > 0 
                        ? new Date(Math.min(...applications.map(a => new Date(a.createdAt)))).toLocaleDateString()
                        : "N/A"
                      }
                    </span>
                  </div>
                  <div className="metric-item">
                    <span className="metric-label">Last Activity:</span>
                    <span className="metric-value">
                      {applications.length > 0 
                        ? new Date(Math.max(...applications.map(a => new Date(a.updatedAt || a.createdAt)))).toLocaleDateString()
                        : "N/A"
                      }
                    </span>
                  </div>
                  <div className="metric-item">
                    <span className="metric-label">Response Rate:</span>
                    <span className="metric-value">
                      {applications.length > 0 
                        ? `${Math.round(((approved + rejected) / total) * 100)}%`
                        : "N/A"
                      }
                    </span>
                  </div>
                </div>
              </div>

              {applications.length === 0 && (
                <div className="empty-state">
                  <div className="empty-icon">📝</div>
                  <h4>No Applications Yet</h4>
                  <p>This volunteer hasn't submitted any applications.</p>
                </div>
              )}
            </div>
          )}

          {activeTab === "applications" && (
            <div className="applications-tab">
              {applications.length === 0 ? (
                <div className="empty-state">
                  <div className="empty-icon">📝</div>
                  <h4>No Applications Found</h4>
                  <p>This volunteer hasn't submitted any applications yet.</p>
                </div>
              ) : (
                <div className="applications-list">
                  {applications.map(app => {
                    const safeHistory =
                      Array.isArray(app.history) && app.history.length > 0
                        ? app.history
                        : [{ status: app.status, changedAt: app.createdAt }];

                    return (
                      <div key={app._id} className="application-item">
                        <div className="application-header">
                          <div className="application-info">
                            <h4>{app.opportunity?.title || "Unknown Opportunity"}</h4>
                            <p className="application-date">
                              Applied: {new Date(app.createdAt).toLocaleDateString()}
                              {app.updatedAt && app.updatedAt !== app.createdAt && (
                                <span className="updated-date">
                                  • Updated: {new Date(app.updatedAt).toLocaleDateString()}
                                </span>
                              )}
                            </p>
                          </div>
                          <span className={`status-pill ${app.status}`}>
                            {app.status === "pending" && "⏳"}
                            {app.status === "approved" && "✅"}
                            {app.status === "rejected" && "❌"}
                            {app.status.toUpperCase()}
                          </span>
                        </div>

                        <div className="application-timeline">
                          <Timeline history={safeHistory} />
                        </div>

                        {app.status === "pending" && (
                          <div className="application-actions">
                            <button
                              className={`btn btn-success btn-sm ${processing === app._id ? 'loading' : ''}`}
                              onClick={() => handleAction(app._id, "approve")}
                              disabled={processing !== null}
                            >
                              {processing === app._id ? (
                                <>
                                  <span className="spinner"></span>
                                  <span>Approving...</span>
                                </>
                              ) : (
                                "✅ Approve"
                              )}
                            </button>

                            <button
                              className={`btn btn-danger btn-sm ${processing === app._id ? 'loading' : ''}`}
                              onClick={() => handleAction(app._id, "reject")}
                              disabled={processing !== null}
                            >
                              {processing === app._id ? (
                                <>
                                  <span className="spinner"></span>
                                  <span>Rejecting...</span>
                                </>
                              ) : (
                                "❌ Reject"
                              )}
                            </button>
                          </div>
                        )}
                        
                        {app.opportunity?.description && (
                          <div className="opportunity-description">
                            <h5>📝 Opportunity Details:</h5>
                            <p>{app.opportunity.description}</p>
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}