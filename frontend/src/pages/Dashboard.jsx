import { useContext, useEffect, useState, useCallback, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";
import { useNotifications } from "../utils/notifications";
import api from "../api/axios";
import OpportunityCard from "../components/OpportunityCard";
import AdvancedSearch from "../components/AdvancedSearch";
import toast from "react-hot-toast";

export default function Dashboard({ search = "" }) {
  const { user, dark } = useContext(AuthContext);
  const { notifyApplicationApproved, notifyApplicationRejected } = useNotifications();
  const navigate = useNavigate();

  const [opportunities, setOpportunities] = useState([]);
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState("all");
  const [refreshing, setRefreshing] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [advancedFilters, setAdvancedFilters] = useState({});
  const [categories] = useState(["Education", "Healthcare", "Environment", "Community", "Technology", "Arts"]);
  const [locations] = useState(["New York", "Los Angeles", "Chicago", "Houston", "Phoenix", "Philadelphia"]);

  /* ---------------- FETCH OPPORTUNITIES ---------------- */
  const fetchOpportunities = useCallback(async () => {
    try {
      // Always fetch all opportunities for "All Opportunities" tab
      // "My Posts" filter will be applied in frontend filtering
      const res = await api.get("/opportunities");
      setOpportunities(res.data);
    } catch (error) {
      toast.error("Failed to load opportunities");
    }
  }, []);

  useEffect(() => {
    if (!user) return;
    const loadData = async () => {
      setLoading(true);
      await fetchOpportunities();
      setLoading(false);
    };
    loadData();
  }, [user, fetchOpportunities]);

  /* ---------------- FETCH APPLICATIONS ---------------- */
  const fetchApplications = useCallback(async () => {
    if (user?.role !== "volunteer") return;
    try {
      const res = await api.get(`/applications/volunteer/${user._id}`);
      const normalized = res.data.map(a => ({
        ...a,
        opportunityId: a.opportunity?._id || a.opportunity,
      }));
      setApplications(normalized);
    } catch (error) {
      toast.error("Failed to load applications");
    }
  }, [user]);

  useEffect(() => {
    fetchApplications();
  }, [fetchApplications]);

  /* ---------------- REFRESH DATA ---------------- */
  const refreshData = useCallback(async () => {
    setRefreshing(true);
    await Promise.all([fetchOpportunities(), fetchApplications()]);
    setRefreshing(false);
    toast.success("Data refreshed!");
  }, [fetchOpportunities, fetchApplications]);

  /* ---------------- APPLY ---------------- */
  const apply = async (opportunityId) => {
    try {
      await api.post("/applications", { opportunityId });
      toast.success("Applied successfully 🎉");
      fetchApplications();
    } catch (err) {
      toast.error(err.response?.data?.message || "Apply failed");
    }
  };

  /* ---------------- CANCEL ---------------- */
  const cancelApplication = async (appId) => {
    if (!window.confirm("Cancel this application?")) return;
    try {
      await api.put(`/applications/cancel/${appId}`);
      toast("Application cancelled 🚫", { icon: "⚠️" });
      fetchApplications();
    } catch (error) {
      toast.error("Failed to cancel application");
    }
  };

  /* ---------------- DELETE OPPORTUNITY ---------------- */
  const deleteOpportunity = async (id) => {
    if (!window.confirm("Delete this opportunity?")) return;
    try {
      await api.delete(`/opportunities/${id}`);
      toast.success("Opportunity deleted");
      setOpportunities(prev => prev.filter(op => op._id !== id));
    } catch (error) {
      toast.error("Failed to delete opportunity");
    }
  };

  /* ---------------- MATCH APPLICATION ---------------- */
  const getApplication = (opportunityId) => {
    const related = applications.filter(
      a => String(a.opportunityId) === String(opportunityId)
    );
    if (related.length === 0) return null;

    return related.sort(
      (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
    )[0];
  };

  /* ---------------- SEARCH & FILTER ---------------- */
  const filteredOpportunities = useMemo(() => {
    let filtered = opportunities.filter(op => {
      // Text search
      const matchesSearch = !searchTerm || 
        op.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        op.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (op.skills && op.skills.some(skill => 
          skill.toLowerCase().includes(searchTerm.toLowerCase())
        ));
      
      // Category filter
      const matchesCategory = !advancedFilters.category || 
        op.category === advancedFilters.category;
      
      // Location filter
      const matchesLocation = !advancedFilters.location || 
        op.location === advancedFilters.location;
      
      // Skills filter
      const matchesSkills = !advancedFilters.skills?.length || 
        advancedFilters.skills.every(skill => 
          op.skills && op.skills.some(opSkill => 
            opSkill.toLowerCase().includes(skill.toLowerCase())
          )
        );
      
      // Deadline filter
      let matchesDeadline = true;
      if (advancedFilters.deadline) {
        const now = new Date();
        const deadline = new Date(op.deadline);
        const diffDays = Math.ceil((deadline - now) / (1000 * 60 * 60 * 24));
        
        switch (advancedFilters.deadline) {
          case "week":
            matchesDeadline = diffDays <= 7 && diffDays >= 0;
            break;
          case "month":
            matchesDeadline = diffDays <= 30 && diffDays >= 0;
            break;
          case "quarter":
            matchesDeadline = diffDays <= 90 && diffDays >= 0;
            break;
        }
      }
      
      // Date range filter
      let matchesDateRange = true;
      if (advancedFilters.dateRange) {
        const now = new Date();
        const createdDate = new Date(op.createdAt);
        const diffDays = Math.ceil((now - createdDate) / (1000 * 60 * 60 * 24));
        
        switch (advancedFilters.dateRange) {
          case "today":
            matchesDateRange = diffDays === 0;
            break;
          case "week":
            matchesDateRange = diffDays <= 7;
            break;
          case "month":
            matchesDateRange = diffDays <= 30;
            break;
          case "quarter":
            matchesDateRange = diffDays <= 90;
            break;
          case "year":
            matchesDateRange = diffDays <= 365;
            break;
        }
      }
      
      // User-specific filters
      if (filter === "my-posts" && user?.role === "org") {
        const isMyPost = typeof op.createdBy === 'object' ? op.createdBy._id === user._id : op.createdBy === user._id;
        return matchesSearch && matchesCategory && matchesLocation && matchesSkills && matchesDeadline && matchesDateRange && isMyPost;
      }
      if (filter === "applied" && user?.role === "volunteer") {
        return matchesSearch && matchesCategory && matchesLocation && matchesSkills && matchesDeadline && matchesDateRange && getApplication(op._id);
      }
      
      return matchesSearch && matchesCategory && matchesLocation && matchesSkills && matchesDeadline && matchesDateRange;
    });

    // Sort results
    switch (advancedFilters.sortBy) {
      case "oldest":
        return filtered.sort((a, b) => new Date(a.createdAt) - new Date(b.createdAt));
      case "deadline":
        return filtered.sort((a, b) => new Date(a.deadline) - new Date(b.deadline));
      case "title":
        return filtered.sort((a, b) => a.title.localeCompare(b.title));
      default: // newest
        return filtered.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
    }
  }, [opportunities, searchTerm, advancedFilters, filter, user, applications]);

  const getStats = () => {
    if (user?.role === "volunteer") {
      const pending = applications.filter(a => a.status === "pending").length;
      const approved = applications.filter(a => a.status === "approved").length;
      const total = applications.length;
      return { pending, approved, total };
    } else {
      const myOpps = opportunities.filter(op => {
        const isMyPost = typeof op.createdBy === 'object' ? op.createdBy._id === user._id : op.createdBy === user._id;
        return isMyPost;
      }).length;
      return { myOpps, total: opportunities.length };
    }
  };

  const stats = getStats();

  if (loading) {
    return (
      <div className={`dashboard-page ${dark ? "dark" : ""}`}>
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
        <div className="container">
          <div className="loading-state">
            <div className="spinner-large"></div>
            <p>Loading opportunities...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className={`dashboard-page ${dark ? "dark" : ""}`}>
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
      <div className="container">
        <div className="dashboard-header">
          <div className="welcome-section">
            <div className="welcome-content">
              <h1>Welcome back, {user?.name}! 👋</h1>
              <p className="user-role">
                {user?.role === "volunteer" ? "🤝 Volunteer" : "🏢 Organization"}
              </p>
            </div>
            <button 
              className={`btn btn-secondary ${refreshing ? 'loading' : ''}`}
              onClick={refreshData}
              disabled={refreshing}
            >
              {refreshing ? (
                <>
                  <span className="spinner"></span>
                  Refreshing...
                </>
              ) : (
                <>🔄 Refresh</>
              )}
            </button>
          </div>

          {/* Advanced Search */}
          <AdvancedSearch 
            onSearch={setSearchTerm}
            onFilter={setAdvancedFilters}
            categories={categories}
            locations={locations}
            dark={dark}
          />

          {/* Stats Cards */}
          <div className="stats-grid">
            {user?.role === "volunteer" ? (
              <>
                <div className="kpi-card">
                  <h4>Total Applications</h4>
                  <div className="kpi-value">{stats.total}</div>
                </div>
                <div className="kpi-card">
                  <h4>Pending</h4>
                  <div className="kpi-value">{stats.pending}</div>
                </div>
                <div className="kpi-card">
                  <h4>Approved</h4>
                  <div className="kpi-value">{stats.approved}</div>
                  <div className="kpi-change positive">
                    {stats.total > 0 ? Math.round((stats.approved / stats.total) * 100) : 0}% success rate
                  </div>
                </div>
              </>
            ) : (
              <>
                <div className="kpi-card">
                  <h4>My Opportunities</h4>
                  <div className="kpi-value">{stats.myOpps}</div>
                </div>
                <div className="kpi-card">
                  <h4>Total Available</h4>
                  <div className="kpi-value">{stats.total}</div>
                </div>
                <div className="kpi-card">
                  <h4>Quick Actions</h4>
                  <button 
                    className="btn btn-primary btn-sm"
                    onClick={() => navigate("/create-opportunity")}
                  >
                    + New Opportunity
                  </button>
                </div>
              </>
            )}
          </div>
        </div>

        {/* Filter Tabs */}
        <div className="filter-tabs">
          <button 
            className={`filter-tab ${filter === "all" ? "active" : ""}`}
            onClick={() => setFilter("all")}
          >
            All Opportunities
          </button>
          {user?.role === "org" && (
            <button 
              className={`filter-tab ${filter === "my-posts" ? "active" : ""}`}
              onClick={() => setFilter("my-posts")}
            >
              My Posts
            </button>
          )}
          {user?.role === "volunteer" && (
            <button 
              className={`filter-tab ${filter === "applied" ? "active" : ""}`}
              onClick={() => setFilter("applied")}
            >
              Applied ({applications.length})
            </button>
          )}
        </div>

        {/* Opportunities Grid */}
        {filteredOpportunities.length === 0 ? (
          <div className="empty-state">
            <div className="empty-icon">🔍</div>
            <h3>No opportunities found</h3>
            <p>
              {searchTerm ? 
                `No results for "${searchTerm}". Try different keywords or adjust filters.` :
                filter === "my-posts" ? 
                  "You haven't posted any opportunities yet." :
                  "No opportunities available at the moment."
              }
            </p>
            {user?.role === "org" && filter === "my-posts" && (
              <button 
                className="btn btn-primary"
                onClick={() => navigate("/create-opportunity")}
              >
                Create Your First Opportunity
              </button>
            )}
          </div>
        ) : (
          <div className="cards-grid">
            {filteredOpportunities.map(op => {
              const application = getApplication(op._id);

              return (
                <OpportunityCard
                  key={op._id}
                  title={op.title}
                  description={op.description}
                  image={
                    op.image ||
                    "https://images.unsplash.com/photo-1559027615-cd4628902d4a"
                  }
                  deadline={new Date(op.deadline).toLocaleDateString("en-IN")}
                  category={op.category}
                  location={op.location}
                  skills={op.skills}
                  createdBy={op.createdBy}
                  opportunityId={op._id}
                  showParticipants={user?.role === "volunteer" && application?.status === "approved"}
                >
                  {/* VOLUNTEER ACTIONS */}
                  {user?.role === "volunteer" && (
                    <>
                      {!application && (
                        <button
                          className="btn btn-primary"
                          onClick={() => apply(op._id)}
                        >
                          🚀 Apply Now
                        </button>
                      )}

                      {application && (
                        <>
                          <span className={`status-pill ${application.status}`}>
                            {application.status === "pending" && "⏳"}
                            {application.status === "approved" && "✅"}
                            {application.status === "rejected" && "❌"}
                            {application.status.toUpperCase()}
                          </span>

                          {application.status === "pending" && (
                            <button
                              className="btn btn-danger btn-sm"
                              onClick={() =>
                                cancelApplication(application._id)
                              }
                            >
                              Cancel
                            </button>
                          )}
                        </>
                      )}
                    </>
                  )}

                  {/* ORG ACTIONS */}
                  {user?.role === "org" && (
                    typeof op.createdBy === 'object' ? op.createdBy._id === user._id : op.createdBy === user._id
                  ) && (
                    <>
                      <button
                        className="btn btn-secondary"
                        onClick={() =>
                          navigate(`/edit-opportunity/${op._id}`)
                        }
                      >
                        ✏️ Edit
                      </button>

                      <button
                        className="btn btn-danger"
                        onClick={() => deleteOpportunity(op._id)}
                      >
                        🗑️ Delete
                      </button>
                    </>
                  )}
                </OpportunityCard>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}