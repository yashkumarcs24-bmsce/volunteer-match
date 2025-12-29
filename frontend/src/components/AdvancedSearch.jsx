import { useState, useEffect } from "react";
import { FiSearch, FiFilter, FiX } from "react-icons/fi";

export default function AdvancedSearch({ 
  onSearch, 
  onFilter, 
  categories = [], 
  locations = [],
  dark = false 
}) {
  const [searchTerm, setSearchTerm] = useState("");
  const [filters, setFilters] = useState({
    category: "",
    location: "",
    deadline: "",
    skills: [],
    sortBy: "newest",
    dateRange: ""
  });
  const [showFilters, setShowFilters] = useState(false);
  const [newSkill, setNewSkill] = useState("");
  const [searchHistory, setSearchHistory] = useState([]);

  useEffect(() => {
    // Load search history from localStorage
    const history = JSON.parse(localStorage.getItem('searchHistory') || '[]');
    setSearchHistory(history.slice(0, 5)); // Keep only last 5 searches
  }, []);

  useEffect(() => {
    const debounceTimer = setTimeout(() => {
      onSearch(searchTerm);
      
      // Save to search history if not empty
      if (searchTerm.trim() && !searchHistory.includes(searchTerm.trim())) {
        const newHistory = [searchTerm.trim(), ...searchHistory].slice(0, 5);
        setSearchHistory(newHistory);
        localStorage.setItem('searchHistory', JSON.stringify(newHistory));
      }
    }, 300);

    return () => clearTimeout(debounceTimer);
  }, [searchTerm, onSearch, searchHistory]);

  useEffect(() => {
    onFilter(filters);
  }, [filters, onFilter]);

  const handleFilterChange = (key, value) => {
    setFilters(prev => ({ ...prev, [key]: value }));
  };

  const addSkillFilter = () => {
    if (newSkill.trim() && !filters.skills.includes(newSkill.trim())) {
      setFilters(prev => ({
        ...prev,
        skills: [...prev.skills, newSkill.trim()]
      }));
      setNewSkill("");
    }
  };

  const removeSkillFilter = (skill) => {
    setFilters(prev => ({
      ...prev,
      skills: prev.skills.filter(s => s !== skill)
    }));
  };

  const clearFilters = () => {
    setFilters({
      category: "",
      location: "",
      deadline: "",
      skills: [],
      sortBy: "newest",
      dateRange: ""
    });
    setSearchTerm("");
  };

  const clearSearchHistory = () => {
    setSearchHistory([]);
    localStorage.removeItem('searchHistory');
  };

  const useHistorySearch = (term) => {
    setSearchTerm(term);
  };

  const hasActiveFilters = filters.category || filters.location || filters.deadline || filters.skills.length > 0 || filters.dateRange;

  return (
    <div className="advanced-search">
      <div className="search-bar">
        <div className="search-input-wrapper">
          <FiSearch className="search-icon" />
          <input
            type="text"
            className="search-input"
            placeholder="Search opportunities by title, description, or skills..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          {searchTerm && (
            <button 
              className="clear-search-btn"
              onClick={() => setSearchTerm("")}
            >
              <FiX />
            </button>
          )}
        </div>
        
        <button 
          className={`filter-toggle-btn ${showFilters ? "active" : ""}`}
          onClick={() => setShowFilters(!showFilters)}
        >
          <FiFilter />
          Filters
          {hasActiveFilters && <span className="filter-badge"></span>}
        </button>
      </div>

      {/* Search History */}
      {searchHistory.length > 0 && !searchTerm && (
        <div className="search-history">
          <div className="search-history-header">
            <span>Recent searches:</span>
            <button 
              className="clear-history-btn"
              onClick={clearSearchHistory}
              title="Clear history"
            >
              <FiX />
            </button>
          </div>
          <div className="search-history-items">
            {searchHistory.map((term, index) => (
              <button
                key={index}
                className="history-item"
                onClick={() => useHistorySearch(term)}
              >
                {term}
              </button>
            ))}
          </div>
        </div>
      )}

      {showFilters && (
        <div className="filters-panel">
          <div className="filters-grid">
            <div className="filter-group">
              <label>Category</label>
              <select
                className="form-input"
                value={filters.category}
                onChange={(e) => handleFilterChange("category", e.target.value)}
              >
                <option value="">All Categories</option>
                {categories.map(cat => (
                  <option key={cat} value={cat}>{cat}</option>
                ))}
              </select>
            </div>

            <div className="filter-group">
              <label>Location</label>
              <select
                className="form-input"
                value={filters.location}
                onChange={(e) => handleFilterChange("location", e.target.value)}
              >
                <option value="">All Locations</option>
                {locations.map(loc => (
                  <option key={loc} value={loc}>{loc}</option>
                ))}
              </select>
            </div>

            <div className="filter-group">
              <label>Date Range</label>
              <select
                className="form-input"
                value={filters.dateRange}
                onChange={(e) => handleFilterChange("dateRange", e.target.value)}
              >
                <option value="">Any Time</option>
                <option value="today">Today</option>
                <option value="week">This Week</option>
                <option value="month">This Month</option>
                <option value="quarter">Next 3 Months</option>
                <option value="year">This Year</option>
              </select>
            </div>

            <div className="filter-group">
              <label>Deadline</label>
              <select
                className="form-input"
                value={filters.deadline}
                onChange={(e) => handleFilterChange("deadline", e.target.value)}
              >
                <option value="">Any Time</option>
                <option value="week">This Week</option>
                <option value="month">This Month</option>
                <option value="quarter">Next 3 Months</option>
              </select>
            </div>

            <div className="filter-group">
              <label>Sort By</label>
              <select
                className="form-input"
                value={filters.sortBy}
                onChange={(e) => handleFilterChange("sortBy", e.target.value)}
              >
                <option value="newest">Newest First</option>
                <option value="oldest">Oldest First</option>
                <option value="deadline">Deadline Soon</option>
                <option value="title">Title A-Z</option>
              </select>
            </div>

            <div className="filter-group full-width">
              <label>Required Skills</label>
              <div className="skills-filter">
                <div className="skills-input">
                  <input
                    type="text"
                    className="form-input"
                    value={newSkill}
                    onChange={(e) => setNewSkill(e.target.value)}
                    placeholder="Filter by skills..."
                    onKeyPress={(e) => e.key === "Enter" && (e.preventDefault(), addSkillFilter())}
                  />
                  <button type="button" className="btn btn-secondary btn-sm" onClick={addSkillFilter}>
                    Add
                  </button>
                </div>
                <div className="skills-list">
                  {filters.skills.map((skill, index) => (
                    <span key={index} className="skill-tag">
                      {skill}
                      <button type="button" onClick={() => removeSkillFilter(skill)}>×</button>
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </div>

          <div className="filters-actions">
            {hasActiveFilters && (
              <button 
                type="button" 
                className="btn btn-secondary btn-sm"
                onClick={clearFilters}
              >
                Clear All Filters
              </button>
            )}
            <button 
              type="button" 
              className="btn btn-primary btn-sm"
              onClick={() => setShowFilters(false)}
            >
              Apply Filters
            </button>
          </div>
        </div>
      )}
    </div>
  );
}