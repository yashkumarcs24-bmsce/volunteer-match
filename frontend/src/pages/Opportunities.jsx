import { useState, useEffect, useContext } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";
import api from "../api/axios";
import OpportunityCard from "../components/OpportunityCard";
import AdvancedSearch from "../components/AdvancedSearch";
import toast from "react-hot-toast";

export default function Opportunities() {
  const { user, dark } = useContext(AuthContext);
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  
  const [opportunities, setOpportunities] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [advancedFilters, setAdvancedFilters] = useState({});
  
  const categories = ["Education", "Healthcare", "Environment", "Community", "Technology", "Arts"];
  const locations = ["New York", "Los Angeles", "Chicago", "Houston", "Phoenix", "Philadelphia"];

  // Get search from URL params
  useEffect(() => {
    const category = searchParams.get("category");
    const search = searchParams.get("search");
    
    if (category) {
      setAdvancedFilters(prev => ({ ...prev, category }));
    }
    
    if (search) {
      setSearchTerm(search);
    }
  }, [searchParams]);

  // Fetch opportunities
  useEffect(() => {
    const fetchOpportunities = async () => {
      try {
        const res = await api.get("/opportunities");
        setOpportunities(res.data);
      } catch (error) {
        toast.error("Failed to load opportunities");
      } finally {
        setLoading(false);
      }
    };
    fetchOpportunities();
  }, []);

  // Apply for opportunity
  const apply = async (opportunityId) => {
    if (!user) {
      navigate("/login");
      return;
    }
    
    try {
      await api.post("/applications", { opportunityId });
      toast.success("Applied successfully! 🎉");
    } catch (err) {
      toast.error(err.response?.data?.message || "Apply failed");
    }
  };

  // Filter opportunities
  const filteredOpportunities = opportunities.filter(op => {
    const matchesSearch = !searchTerm || 
      op.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      op.description.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesCategory = !advancedFilters.category || 
      op.category === advancedFilters.category;
    
    const matchesLocation = !advancedFilters.location || 
      op.location === advancedFilters.location;

    return matchesSearch && matchesCategory && matchesLocation;
  });

  if (loading) {
    return (
      <div className={`opportunities-page ${dark ? "dark" : ""}`}>
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
    <div className={`opportunities-page ${dark ? "dark" : ""}`}>
      <div className="page-shapes">
        <div className="page-shape"></div>
        <div className="page-shape"></div>
        <div className="page-shape"></div>
      </div>
      
      <div className="container">
        <div className="page-header">
          <h1>🌟 Volunteer Opportunities</h1>
          <p>Discover meaningful ways to make a difference in your community</p>
        </div>

        <AdvancedSearch 
          onSearch={setSearchTerm}
          onFilter={setAdvancedFilters}
          categories={categories}
          locations={locations}
          dark={dark}
        />

        <div className="opportunities-stats">
          <span>{filteredOpportunities.length} opportunities found</span>
          {advancedFilters.category && (
            <span className="filter-tag">
              Category: {advancedFilters.category}
              <button onClick={() => setAdvancedFilters(prev => ({ ...prev, category: "" }))}>×</button>
            </span>
          )}
          {searchTerm && (
            <span className="filter-tag">
              Search: "{searchTerm}"
              <button onClick={() => setSearchTerm("")}>×</button>
            </span>
          )}
        </div>

        {filteredOpportunities.length === 0 ? (
          <div className="empty-state">
            <div className="empty-icon">🔍</div>
            <h3>No opportunities found</h3>
            <p>Try adjusting your search criteria or check back later for new opportunities.</p>
            {!user && (
              <button className="btn btn-primary" onClick={() => navigate("/register")}>
                Join to Get Notified
              </button>
            )}
          </div>
        ) : (
          <div className="cards-grid">
            {filteredOpportunities.map(op => (
              <OpportunityCard
                key={op._id}
                title={op.title}
                description={op.description}
                image={op.image || "https://images.unsplash.com/photo-1559027615-cd4628902d4a"}
                deadline={new Date(op.deadline).toLocaleDateString("en-IN")}
                category={op.category}
                location={op.location}
                skills={op.skills}
                createdBy={op.createdBy}
                opportunityId={op._id}
              >
                {user?.role === "volunteer" ? (
                  <button
                    className="btn btn-primary"
                    onClick={() => apply(op._id)}
                  >
                    🚀 Apply Now
                  </button>
                ) : user?.role === "org" ? (
                  <div className="org-info">
                    <span className="info-text">📋 View applications in Dashboard</span>
                  </div>
                ) : (
                  <button
                    className="btn btn-secondary"
                    onClick={() => navigate("/login")}
                  >
                    Sign In to Apply
                  </button>
                )}
              </OpportunityCard>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}