import { useState, useContext, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";
import toast from "react-hot-toast";

function CreateOpportunity() {
  const { token, dark } = useContext(AuthContext);
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    title: "",
    description: "",
    deadline: "",
    image: "",
    category: "",
    location: "",
    requirements: ""
  });
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});
  
  const categories = [
    "Education", "Healthcare", "Environment", "Community Service",
    "Animal Welfare", "Disaster Relief", "Technology", "Arts & Culture", "Other"
  ];

  const handleChange = useCallback((e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: "" }));
    }
  }, [errors]);

  const validateForm = useCallback(() => {
    const newErrors = {};
    
    if (!formData.title.trim()) {
      newErrors.title = "Title is required";
    } else if (formData.title.length < 5) {
      newErrors.title = "Title must be at least 5 characters";
    }
    
    if (!formData.description.trim()) {
      newErrors.description = "Description is required";
    } else if (formData.description.length < 20) {
      newErrors.description = "Description must be at least 20 characters";
    }
    
    if (!formData.deadline) {
      newErrors.deadline = "Deadline is required";
    } else {
      const deadlineDate = new Date(formData.deadline);
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      if (deadlineDate <= today) {
        newErrors.deadline = "Deadline must be in the future";
      }
    }
    
    if (!formData.category) newErrors.category = "Category is required";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  }, [formData]);
  
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      toast.error("Please fix the errors below");
      return;
    }

    setLoading(true);

    try {
      const res = await fetch("http://localhost:8000/api/opportunities", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(formData),
      });

      const data = await res.json();

      if (!res.ok) {
        toast.error(data.message || "Failed to create opportunity");
        return;
      }

      toast.success("Opportunity created successfully! 🎉");
      navigate("/dashboard");
    } catch (error) {
      toast.error("Network error. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const suggestedImages = [
    { url: "https://images.unsplash.com/photo-1559027615-cd4628902d4a?w=400&h=225&fit=crop", alt: "Community volunteers" },
    { url: "https://images.unsplash.com/photo-1582213782179-e0d53f98f2ca?w=400&h=225&fit=crop", alt: "Helping hands" },
    { url: "https://images.unsplash.com/photo-1488521787991-ed7bbaae773c?w=400&h=225&fit=crop", alt: "Team collaboration" },
    { url: "https://images.unsplash.com/photo-1593113598332-cd288d649433?w=400&h=225&fit=crop", alt: "Environmental care" }
  ];

  const handleImageSelect = useCallback((imageUrl) => {
    setFormData(prev => ({ ...prev, image: imageUrl }));
  }, []);

  return (
    <div className={`create-page ${dark ? "dark" : ""}`}>
      <div className="page-shapes">
        <div className="page-shape"></div>
        <div className="page-shape"></div>
        <div className="page-shape"></div>
        <div className="page-shape"></div>
        <div className="page-shape"></div>
      </div>
      <div className="container">
        <div className="create-opportunity-form">
          <div className="form-header">
            <h1>✨ Create New Opportunity</h1>
            <p>Share a meaningful volunteer opportunity with our community</p>
          </div>

          <form onSubmit={handleSubmit}>
            <div className="form-grid">
              {/* Title */}
              <div className="form-group full-width">
                <label htmlFor="title">Opportunity Title *</label>
                <input
                  id="title"
                  name="title"
                  type="text"
                  placeholder="e.g., Help at Local Food Bank"
                  value={formData.title}
                  onChange={handleChange}
                  className={`form-input ${errors.title ? 'error' : ''}`}
                  disabled={loading}
                />
                {errors.title && <span className="error-message">{errors.title}</span>}
              </div>

              {/* Category */}
              <div className="form-group">
                <label htmlFor="category">Category *</label>
                <select
                  id="category"
                  name="category"
                  value={formData.category}
                  onChange={handleChange}
                  className={`form-input ${errors.category ? 'error' : ''}`}
                  disabled={loading}
                >
                  <option value="">Select a category</option>
                  {categories.map(cat => (
                    <option key={cat} value={cat}>{cat}</option>
                  ))}
                </select>
                {errors.category && <span className="error-message">{errors.category}</span>}
              </div>

              {/* Location */}
              <div className="form-group">
                <label htmlFor="location">Location</label>
                <input
                  id="location"
                  name="location"
                  type="text"
                  placeholder="e.g., New York, NY"
                  value={formData.location}
                  onChange={handleChange}
                  className="form-input"
                  disabled={loading}
                />
              </div>

              {/* Deadline */}
              <div className="form-group">
                <label htmlFor="deadline">Application Deadline *</label>
                <input
                  id="deadline"
                  name="deadline"
                  type="date"
                  value={formData.deadline}
                  onChange={handleChange}
                  className={`form-input ${errors.deadline ? 'error' : ''}`}
                  disabled={loading}
                  min={new Date().toISOString().split('T')[0]}
                />
                {errors.deadline && <span className="error-message">{errors.deadline}</span>}
              </div>

              {/* Description */}
              <div className="form-group full-width">
                <label htmlFor="description">Description *</label>
                <textarea
                  id="description"
                  name="description"
                  placeholder="Describe the volunteer opportunity, what volunteers will do, and any special requirements..."
                  value={formData.description}
                  onChange={handleChange}
                  className={`form-input ${errors.description ? 'error' : ''}`}
                  disabled={loading}
                  rows={4}
                />
                {errors.description && <span className="error-message">{errors.description}</span>}
              </div>

              {/* Requirements */}
              <div className="form-group full-width">
                <label htmlFor="requirements">Requirements & Skills</label>
                <textarea
                  id="requirements"
                  name="requirements"
                  placeholder="List any specific skills, experience, or requirements for volunteers..."
                  value={formData.requirements}
                  onChange={handleChange}
                  className="form-input"
                  disabled={loading}
                  rows={3}
                />
              </div>

              {/* Image URL */}
              <div className="form-group full-width">
                <label htmlFor="image">Cover Image URL</label>
                <input
                  id="image"
                  name="image"
                  type="url"
                  placeholder="https://example.com/image.jpg"
                  value={formData.image}
                  onChange={handleChange}
                  className="form-input"
                  disabled={loading}
                />
                
                {/* Suggested Images */}
                <div className="suggested-images">
                  <p className="suggested-label">Or choose from suggested images:</p>
                  <div className="image-suggestions">
                    {suggestedImages.map((image, index) => (
                      <button
                        key={index}
                        type="button"
                        className={`image-suggestion ${formData.image === image.url ? 'selected' : ''}`}
                        onClick={() => handleImageSelect(image.url)}
                        disabled={loading}
                        title={image.alt}
                      >
                        <img 
                          src={image.url} 
                          alt={image.alt}
                          loading="lazy"
                        />
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              {/* Image Preview */}
              {formData.image && (
                <div className="form-group full-width">
                  <label>Image Preview</label>
                  <div className="image-preview">
                    <img
                      src={formData.image}
                      alt="Opportunity cover image preview"
                      loading="lazy"
                      onError={(e) => {
                        e.target.src = suggestedImages[0].url;
                        toast.error("Failed to load image. Using default image.");
                      }}
                    />
                  </div>
                </div>
              )}
            </div>

            {/* Submit Button */}
            <div className="form-actions">
              <button
                type="button"
                className="btn btn-secondary"
                onClick={() => navigate("/dashboard")}
                disabled={loading}
              >
                Cancel
              </button>
              <button
                type="submit"
                className={`btn btn-primary btn-lg ${loading ? 'loading' : ''}`}
                disabled={loading}
              >
                {loading ? (
                  <>
                    <span className="spinner"></span>
                    <span>Creating...</span>
                  </>
                ) : (
                  <>
                    <>🚀 Create Opportunity</>
                  </>
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}

export default CreateOpportunity;