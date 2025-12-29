import { useEffect, useState, useContext, useRef } from "react";
import { AuthContext } from "../context/AuthContext";
import api from "../api/axios";
import Timeline from "../components/Timeline";
import SkillScoreBar from "../components/SkillScoreBar";
import toast from "react-hot-toast";

export default function Applicants() {
  const { user, dark } = useContext(AuthContext);

  const [apps, setApps] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState("all");
  const [sortBy, setSortBy] = useState("newest");
  const cardRefs = useRef({});

  const [flashId, setFlashId] = useState(null);
  const [flashType, setFlashType] = useState(null);
  const [processing, setProcessing] = useState(new Set());

  useEffect(() => {
    fetchApplications();
  }, []);

  const fetchApplications = async () => {
    try {
      const res = await api.get("/applications");
      setApps(res.data);
    } catch (error) {
      toast.error("Failed to load applications");
    } finally {
      setLoading(false);
    }
  };

  const updateStatus = async (id, status) => {
    setProcessing(prev => new Set([...prev, id]));
    
    try {
      await api.put(`/applications/${id}`, { status });

      setFlashId(id);
      setFlashType(status);

      if (status === "approved") {
        toast.success("Application approved! 🎉");
      } else if (status === "rejected") {
        toast.error("Application rejected");
      }

      await fetchApplications();

      setTimeout(() => {
        setFlashId(null);
        setFlashType(null);
      }, 1000);
    } catch (error) {
      toast.error(`Failed to ${status} application`);
    } finally {
      setProcessing(prev => {
        const newSet = new Set(prev);
        newSet.delete(id);
        return newSet;
      });
    }
  };

  const bulkApprove = async () => {
    const pendingApps = filteredApps.filter(a => a.status === "pending");
    if (pendingApps.length === 0) {
      toast.error("No pending applications to approve");
      return;
    }

    if (!window.confirm(`Approve ${pendingApps.length} pending applications?`)) {
      return;
    }

    const promises = pendingApps.map(app => updateStatus(app._id, "approved"));
    await Promise.all(promises);
    toast.success(`Approved ${pendingApps.length} applications! 🎉`);
  };

  const getRecommendationScore = (app) => {
    let score = 50; // Base score

    // Early application bonus
    const appliedDate = new Date(app.createdAt);
    const deadline = new Date(app.opportunity?.deadline);
    const daysBeforeDeadline = (deadline - appliedDate) / (1000 * 60 * 60 * 24);
    if (daysBeforeDeadline > 7) score += 20;
    else if (daysBeforeDeadline > 3) score += 10;

    // Previous approvals bonus
    const approvedCount = app.history?.filter(h => h.status === "approved").length || 0;
    score += approvedCount * 15;

    // Penalty for cancellations
    const cancelled = app.history?.some(h => h.status === "cancelled");
    if (cancelled) score -= 25;

    return Math.min(100, Math.max(0, score));
  };

  const getFilteredApps = () => {
    let filtered = apps;

    // Apply status filter
    if (filter !== "all") {
      filtered = filtered.filter(app => app.status === filter);
    }

    // Apply sorting
    filtered.sort((a, b) => {
      switch (sortBy) {
        case "newest":
          return new Date(b.createdAt) - new Date(a.createdAt);
        case "oldest":
          return new Date(a.createdAt) - new Date(b.createdAt);
        case "score":
          return getRecommendationScore(b) - getRecommendationScore(a);
        case "deadline":
          return new Date(a.opportunity?.deadline) - new Date(b.opportunity?.deadline);
        default:
          return 0;
      }
    });

    return filtered;
  };

  const filteredApps = getFilteredApps();
  const stats = {
    total: apps.length,
    pending: apps.filter(a => a.status === "pending").length,
    approved: apps.filter(a => a.status === "approved").length,
    rejected: apps.filter(a => a.status === "rejected").length,
  };

  if (loading) {
    return (
      <div className={`applicants-page ${dark ? "dark" : ""}`}>
        <div className="page-shapes">
          <div className="page-shape"></div>
          <div className="page-shape"></div>
          <div className="page-shape"></div>
          <div className="page-shape"></div>
          <div className="page-shape"></div>
        </div>
        <div className="container">
          <div className="loading-state">
            <div className="spinner-large"></div>
            <p>Loading applications...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className={`applicants-page ${dark ? "dark" : ""}`}>
      <div className="page-shapes">
        <div className="page-shape"></div>
        <div className="page-shape"></div>
        <div className="page-shape"></div>
        <div className="page-shape"></div>
        <div className="page-shape"></div>
      </div>
      <div className="container">
        <div className="applicants-header">
          <div className="applicants-header-content">
            <h1>👥 Manage Applicants</h1>
            <p>Review and manage volunteer applications</p>
          </div>
          
          {stats.pending > 0 && (
            <button
              className="btn btn-success"
              onClick={bulkApprove}
            >
              ✅ Approve All Pending ({stats.pending})
            </button>
          )}
        </div>

        {/* Stats Overview */}
        <div className="applicants-stats">
          <div className="stat-card">
            <div className="stat-icon">📝</div>
            <div className="stat-info">
              <div className="stat-number">{stats.total}</div>
              <div className="stat-label">Total Applications</div>
            </div>
          </div>
          <div className="stat-card pending">
            <div className="stat-icon">⏳</div>
            <div className="stat-info">
              <div className="stat-number">{stats.pending}</div>
              <div className="stat-label">Pending Review</div>
            </div>
          </div>
          <div className="stat-card success">
            <div className="stat-icon">✅</div>
            <div className="stat-info">
              <div className="stat-number">{stats.approved}</div>
              <div className="stat-label">Approved</div>
            </div>
          </div>
          <div className="stat-card danger">
            <div className="stat-icon">❌</div>
            <div className="stat-info">
              <div className="stat-number">{stats.rejected}</div>
              <div className="stat-label">Rejected</div>
            </div>
          </div>
        </div>

        {/* Filters and Sorting */}
        <div className="applicants-controls">
          <div className="filter-section">
            <label>Filter by Status:</label>
            <select 
              value={filter} 
              onChange={(e) => setFilter(e.target.value)}
              className="form-input"
            >
              <option value="all">All Applications ({stats.total})</option>
              <option value="pending">Pending ({stats.pending})</option>
              <option value="approved">Approved ({stats.approved})</option>
              <option value="rejected">Rejected ({stats.rejected})</option>
            </select>
          </div>

          <div className="sort-section">
            <label>Sort by:</label>
            <select 
              value={sortBy} 
              onChange={(e) => setSortBy(e.target.value)}
              className="form-input"
            >
              <option value="newest">Newest First</option>
              <option value="oldest">Oldest First</option>
              <option value="score">Recommendation Score</option>
              <option value="deadline">Deadline</option>
            </select>
          </div>
        </div>

        {/* Applications List */}
        {filteredApps.length === 0 ? (
          <div className="empty-state">
            <div className="empty-icon">📝</div>
            <h3>No applications found</h3>
            <p>
              {filter === "all" 
                ? "No applications have been submitted yet."
                : `No ${filter} applications at the moment.`
              }
            </p>
          </div>
        ) : (
          <div className="applicants-grid">
            {filteredApps.map(app => {
              const safeHistory = Array.isArray(app.history) && app.history.length > 0
                ? app.history
                : [{ status: app.status, changedAt: app.createdAt }];
              
              const score = getRecommendationScore(app);
              const isProcessing = processing.has(app._id);

              return (
                <div
                  key={app._id}
                  ref={el => (cardRefs.current[app._id] = el)}
                  className={`applicant-card ${
                    flashId === app._id
                      ? flashType === "approved"
                        ? "flash-approved"
                        : "flash-rejected"
                      : ""
                  }`}
                >
                  <div className="applicant-header">
                    <div className="applicant-info">
                      <div className="avatar">
                        {app.applicant?.name?.charAt(0)?.toUpperCase() || "?"}
                      </div>
                      <div className="applicant-details">
                        <h3>{app.applicant?.name || "Unknown"}</h3>
                        <p className="applicant-email">{app.applicant?.email}</p>
                        <p className="opportunity-title">
                          🎯 {app.opportunity?.title || "Unknown Opportunity"}
                        </p>
                      </div>
                    </div>
                    
                    <div className="applicant-status">
                      <span className={`status-pill ${app.status}`}>
                        {app.status === "pending" && "⏳"}
                        {app.status === "approved" && "✅"}
                        {app.status === "rejected" && "❌"}
                        {app.status.toUpperCase()}
                      </span>
                    </div>
                  </div>

                  <div className="applicant-body">
                    <div className="score-section">
                      <SkillScoreBar 
                        score={score} 
                        label="Recommendation Score"
                        size="sm"
                      />
                    </div>

                    <div className="timeline-section">
                      <Timeline history={safeHistory} />
                    </div>

                    {app.status === "pending" && user?.role === "org" && (
                      <div className="applicant-actions">
                        <button
                          className={`btn btn-success btn-sm ${isProcessing ? 'loading' : ''}`}
                          onClick={() => updateStatus(app._id, "approved")}
                          disabled={isProcessing}
                        >
                          {isProcessing ? (
                            <>
                              <span className="spinner"></span>
                              <span>Processing...</span>
                            </>
                          ) : (
                            "✅ Approve"
                          )}
                        </button>

                        <button
                          className={`btn btn-danger btn-sm ${isProcessing ? 'loading' : ''}`}
                          onClick={() => updateStatus(app._id, "rejected")}
                          disabled={isProcessing}
                        >
                          {isProcessing ? (
                            <>
                              <span className="spinner"></span>
                              <span>Processing...</span>
                            </>
                          ) : (
                            "❌ Reject"
                          )}
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}