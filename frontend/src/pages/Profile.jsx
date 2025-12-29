import { useContext, useState, useEffect } from "react";
import { AuthContext } from "../context/AuthContext";
import api from "../api/axios";
import toast from "react-hot-toast";

export default function Profile() {
  const { user, dark, updateUser } = useContext(AuthContext);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    bio: "",
    skills: [],
    experience: "",
    location: "",
    phone: "",
    avatar: ""
  });
  const [newSkill, setNewSkill] = useState("");

  useEffect(() => {
    if (user) {
      setFormData({
        name: user.name || "",
        email: user.email || "",
        bio: user.bio || "",
        skills: user.skills || [],
        experience: user.experience || "",
        location: user.location || "",
        phone: user.phone || "",
        avatar: user.avatar || ""
      });
    }
  }, [user]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    
    try {
      const res = await api.put("/users/profile", formData);
      updateUser(res.data);
      toast.success("Profile updated successfully!");
    } catch (error) {
      console.error('Profile update error:', error);
      toast.error(error.response?.data?.message || "Failed to update profile");
    } finally {
      setLoading(false);
    }
  };

  const addSkill = () => {
    if (newSkill.trim() && !formData.skills.includes(newSkill.trim())) {
      setFormData(prev => ({
        ...prev,
        skills: [...prev.skills, newSkill.trim()]
      }));
      setNewSkill("");
    }
  };

  const removeSkill = (skillToRemove) => {
    setFormData(prev => ({
      ...prev,
      skills: prev.skills.filter(skill => skill !== skillToRemove)
    }));
  };

  return (
    <div className={`profile-page ${dark ? "dark" : ""}`}>
      <div className="page-shapes">
        <div className="page-shape"></div>
        <div className="page-shape"></div>
        <div className="page-shape"></div>
        <div className="page-shape"></div>
        <div className="page-shape"></div>
      </div>
      
      <div className="container">
        <div className="profile-container">
          <div className="profile-header">
            <div className="profile-avatar">
              {formData.avatar ? (
                <img src={formData.avatar} alt="Profile" />
              ) : (
                <div className="avatar-placeholder">
                  {formData.name.charAt(0).toUpperCase()}
                </div>
              )}
            </div>
            <div>
              <h1>👤 My Profile</h1>
              <p>Manage your account information and preferences</p>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="profile-form">
            <div className="form-grid">
              <div className="form-group">
                <label>Avatar URL (Optional)</label>
                <input
                  type="url"
                  className="form-input"
                  value={formData.avatar}
                  onChange={(e) => setFormData(prev => ({ ...prev, avatar: e.target.value }))}
                  placeholder="https://example.com/avatar.jpg"
                />
              </div>

              <div className="form-group">
                <label>Full Name</label>
                <input
                  type="text"
                  className="form-input"
                  value={formData.name}
                  onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                  required
                />
              </div>

              <div className="form-group">
                <label>Email</label>
                <input
                  type="email"
                  className="form-input"
                  value={formData.email}
                  onChange={(e) => setFormData(prev => ({ ...prev, email: e.target.value }))}
                  required
                />
              </div>

              <div className="form-group">
                <label>Phone</label>
                <input
                  type="tel"
                  className="form-input"
                  value={formData.phone}
                  onChange={(e) => setFormData(prev => ({ ...prev, phone: e.target.value }))}
                />
              </div>

              <div className="form-group">
                <label>Location</label>
                <input
                  type="text"
                  className="form-input"
                  value={formData.location}
                  onChange={(e) => setFormData(prev => ({ ...prev, location: e.target.value }))}
                  placeholder="City, State"
                />
              </div>

              <div className="form-group full-width">
                <label>Bio</label>
                <textarea
                  className="form-input"
                  rows="4"
                  value={formData.bio}
                  onChange={(e) => setFormData(prev => ({ ...prev, bio: e.target.value }))}
                  placeholder="Tell us about yourself..."
                />
              </div>

              {user?.role === "volunteer" && (
                <>
                  <div className="form-group full-width">
                    <label>Skills</label>
                    <div className="skills-input">
                      <input
                        type="text"
                        className="form-input"
                        value={newSkill}
                        onChange={(e) => setNewSkill(e.target.value)}
                        placeholder="Add a skill..."
                        onKeyPress={(e) => e.key === "Enter" && (e.preventDefault(), addSkill())}
                      />
                      <button type="button" className="btn btn-secondary" onClick={addSkill}>
                        Add
                      </button>
                    </div>
                    <div className="skills-list">
                      {formData.skills.map((skill, index) => (
                        <span key={index} className="skill-tag">
                          {skill}
                          <button type="button" onClick={() => removeSkill(skill)}>×</button>
                        </span>
                      ))}
                    </div>
                  </div>

                  <div className="form-group full-width">
                    <label>Experience</label>
                    <textarea
                      className="form-input"
                      rows="4"
                      value={formData.experience}
                      onChange={(e) => setFormData(prev => ({ ...prev, experience: e.target.value }))}
                      placeholder="Describe your relevant experience..."
                    />
                  </div>
                </>
              )}
            </div>

            <div className="form-actions">
              <button type="submit" className="btn btn-primary" disabled={loading}>
                {loading ? "Updating..." : "Update Profile"}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}