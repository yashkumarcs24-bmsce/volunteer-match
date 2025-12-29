import { useContext, useEffect, useRef, useState } from "react";
import { Navigate, useNavigate } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";
import api from "../api/axios";
import Timeline from "../components/Timeline";
import VolunteerProfileModal from "../components/VolunteerProfileModal";
import SkillScoreBar from "../components/SkillScoreBar";
import CursorReactBits from "../components/CursorReactBits";

import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  LineChart,
  Line,
  Cell,
} from "recharts";

export default function AdminDashboard() {
  const { user, dark } = useContext(AuthContext);
  const navigate = useNavigate();

  const [apps, setApps] = useState([]);
  const [leaderboard, setLeaderboard] = useState([]);
  const [statusFilter, setStatusFilter] = useState(null);
  const [loading, setLoading] = useState(true);
  const [selectedVolunteer, setSelectedVolunteer] = useState(null);
  const [volunteerApps, setVolunteerApps] = useState([]);

  const cardRefs = useRef({});

  /* 🔐 PROTECT */
  if (user?.role !== "org") {
    return <Navigate to="/dashboard" />;
  }

  /* ---------------- FETCH ---------------- */
  const fetchApplications = async () => {
    try {
      const res = await api.get("/applications");
      setApps(res.data);
    } catch (error) {
      console.error("Failed to fetch applications:", error);
    }
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        await Promise.all([
          fetchApplications(),
          api.get("/admin/leaderboard").then(res => setLeaderboard(res.data))
        ]);
      } catch (error) {
        console.error("Failed to fetch data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  /* ---------------- MODAL ACTIONS ---------------- */
  const approveFromProfile = async (id) => {
    try {
      await api.put(`/applications/${id}`, { status: "approved" });
      fetchApplications();
    } catch (error) {
      console.error("Failed to approve application:", error);
    }
  };

  const rejectFromProfile = async (id) => {
    try {
      await api.put(`/applications/${id}`, { status: "rejected" });
      fetchApplications();
    } catch (error) {
      console.error("Failed to reject application:", error);
    }
  };

  /* ---------------- ANALYTICS ---------------- */
  const stats = [
    { name: "Pending", value: apps.filter(a => a.status === "pending").length, color: "#fde047" },
    { name: "Approved", value: apps.filter(a => a.status === "approved").length, color: "#22c55e" },
    { name: "Rejected", value: apps.filter(a => a.status === "rejected").length, color: "#ef4444" },
  ];

  const topOpps = Object.values(
    apps.reduce((acc, a) => {
      const name = a.opportunity?.title || "Unknown";
      acc[name] = acc[name] || { name, value: 0 };
      acc[name].value += 1;
      return acc;
    }, {})
  )
    .sort((a, b) => b.value - a.value)
    .slice(0, 5);

  const decisions = apps.filter(a => a.history?.length > 1);
  const avgDecisionTime =
    decisions.length === 0
      ? "N/A"
      : Math.round(
          decisions.reduce((sum, a) => {
            const start = new Date(a.history[0].changedAt);
            const end = new Date(a.history.at(-1).changedAt);
            return sum + (end - start) / 36e5;
          }, 0) / decisions.length
        );

  const visibleApps = statusFilter
    ? apps.filter(a => a.status === statusFilter)
    : apps;

  if (loading) {
    return (
      <div className={`admin-page ${dark ? "dark" : ""}`}>
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
            <p>Loading dashboard...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className={`admin-page ${dark ? "dark" : ""}`}>
      <div className="page-shapes">
        <div className="page-shape"></div>
        <div className="page-shape"></div>
        <div className="page-shape"></div>
        <div className="page-shape"></div>
        <div className="page-shape"></div>
      </div>
      <div className="react-bits">
        <div className="react-bit"></div>
        <div className="react-bit"></div>
        <div className="react-bit"></div>
        <div className="react-bit"></div>
        <div className="react-bit"></div>
        <div className="react-bit"></div>
        <div className="react-bit"></div>
        <div className="react-bit"></div>
        <div className="react-bit"></div>
        <div className="react-bit"></div>
        <div className="react-bit"></div>
        <div className="react-bit"></div>
        <div className="react-bit"></div>
        <div className="react-bit"></div>
        <div className="react-bit"></div>
      </div>
      <CursorReactBits />
      <div className="container">
        <div className="admin-header">
          <div>
            <h1>📊 Admin Dashboard</h1>
            <p>Manage applications and track volunteer performance</p>
          </div>
        </div>

        {/* Analytics Overview */}
        <div className="admin-stats">
          <div className="kpi-card">
            <h4>Total Applications</h4>
            <div className="kpi-value">{apps.length}</div>
          </div>
          <div className="kpi-card">
            <h4>Avg Decision Time</h4>
            <div className="kpi-value">{avgDecisionTime}</div>
            <div className="kpi-change">hours</div>
          </div>
          <div className="kpi-card">
            <h4>Active Volunteers</h4>
            <div className="kpi-value">{leaderboard.length}</div>
          </div>
        </div>

        {/* Charts Section */}
        <div className="charts-section" id="charts-section">
          {/* Status Distribution */}
          <div className="chart-card">
            <h3>📈 Application Status Distribution</h3>
            <div className="chart-container">
              <ResponsiveContainer width="100%" height={240}>
                <BarChart data={stats}>
                  <XAxis dataKey="name" />
                  <YAxis allowDecimals={false} />
                  <Tooltip />
                  <Bar
                    dataKey="value"
                    radius={[6, 6, 0, 0]}
                    onClick={(data) => {
                      const status = data.name.toLowerCase();
                      setStatusFilter(status === statusFilter ? null : status);
                      // Scroll to applications section
                      setTimeout(() => {
                        const element = document.getElementById('applications');
                        if (element) {
                          element.scrollIntoView({ behavior: 'smooth' });
                        }
                      }, 100);
                    }}
                    style={{ cursor: 'pointer' }}
                  >
                    {stats.map((s, i) => (
                      <Cell key={i} fill={s.color} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
            <p className="chart-hint">💡 Click on bars to filter applications</p>
          </div>

          {/* Top Opportunities */}
          {topOpps.length > 0 && (
            <div className="chart-card">
              <h3>🏆 Most Popular Opportunities</h3>
              <div className="chart-container">
                <ResponsiveContainer width="100%" height={260}>
                  <BarChart data={topOpps} layout="vertical">
                    <XAxis type="number" allowDecimals={false} />
                    <YAxis dataKey="name" type="category" width={160} />
                    <Tooltip />
                    <Bar dataKey="value" fill="var(--primary)" radius={[0, 4, 4, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>
          )}
        </div>

        {/* Filter Section */}
        <div className="filter-section" id="applications">
          <div className="filter-header">
            <h3>📋 Applications ({visibleApps.length})</h3>
            {statusFilter && (
              <div className="active-filter">
                <span>Showing: <strong>{statusFilter.toUpperCase()}</strong></span>
                <button
                  className="btn btn-sm btn-secondary"
                  onClick={() => setStatusFilter(null)}
                >
                  Clear Filter
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Applications List */}
        <div className="applications-grid">
          {visibleApps.length === 0 ? (
            <div className="empty-state">
              <div className="empty-icon">📝</div>
              <h3>No applications found</h3>
              <p>
                {statusFilter 
                  ? `No ${statusFilter} applications at the moment.`
                  : "No applications have been submitted yet."
                }
              </p>
            </div>
          ) : (
            visibleApps.map(a => {
              const safeHistory =
                Array.isArray(a.history) && a.history.length > 0
                  ? a.history
                  : [{ status: a.status, changedAt: a.createdAt }];

              return (
                <div
                  key={a._id}
                  ref={el => (cardRefs.current[a._id] = el)}
                  className="application-card"
                >
                  <div className="application-header">
                    <div className="volunteer-info">
                      <div className="avatar">
                        {a.applicant?.name?.charAt(0)?.toUpperCase() || "?"}
                      </div>
                      <div>
                        <h4
                          className="volunteer-name"
                          onClick={() => {
                            setSelectedVolunteer(a.applicant);
                            setVolunteerApps(
                              apps.filter(x => x.applicant?._id === a.applicant?._id)
                            );
                          }}
                        >
                          {a.applicant?.name || "Unknown"}
                        </h4>
                        <p className="volunteer-email">{a.applicant?.email}</p>
                      </div>
                    </div>
                    <span className={`status-pill ${a.status}`}>
                      {a.status === "pending" && "⏳"}
                      {a.status === "approved" && "✅"}
                      {a.status === "rejected" && "❌"}
                      {a.status.toUpperCase()}
                    </span>
                  </div>

                  <div className="application-body">
                    <p><strong>Opportunity:</strong> {a.opportunity?.title || "Unknown"}</p>
                    
                    <div className="skill-section">
                      <label>Volunteer Score:</label>
                      <SkillScoreBar
                        score={
                          Math.min(
                            100,
                            (a.history?.filter(h => h.status === "approved").length || 0) * 30
                          )
                        }
                      />
                    </div>

                    <div className="timeline-section">
                      <Timeline history={safeHistory} />
                    </div>
                  </div>
                </div>
              );
            })
          )}
        </div>

        {/* Leaderboard */}
        <div className="leaderboard-section" id="leaderboard">
          <h3>🏆 Top Volunteers</h3>
          
          {leaderboard.length === 0 ? (
            <div className="empty-state">
              <div className="empty-icon">🏅</div>
              <h4>No leaderboard data yet</h4>
              <p>Volunteer rankings will appear here once applications are processed.</p>
            </div>
          ) : (
            <div className="leaderboard-grid">
              {leaderboard.map((v, i) => {
                const volunteer = apps.find(
                  a => a.applicant?._id === v._id
                )?.applicant;

                if (!volunteer) return null;

                return (
                  <div
                    key={v._id}
                    className="leaderboard-item"
                    onClick={() => {
                      setSelectedVolunteer(volunteer);
                      setVolunteerApps(
                        apps.filter(a => a.applicant?._id === volunteer._id)
                      );
                    }}
                  >
                    <div className="rank-badge">#{i + 1}</div>
                    <div className="avatar lg">
                      {volunteer.name?.charAt(0)?.toUpperCase() || "?"}
                    </div>
                    <div className="volunteer-details">
                      <h4>{volunteer.name}</h4>
                      <p>✅ {v.approvedCount} approvals</p>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>

      {/* Modal */}
      {selectedVolunteer && (
        <VolunteerProfileModal
          volunteer={selectedVolunteer}
          applications={volunteerApps}
          dark={dark}
          onApprove={approveFromProfile}
          onReject={rejectFromProfile}
          onClose={() => setSelectedVolunteer(null)}
        />
      )}
    </div>
  );
}