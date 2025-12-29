import { useNavigate } from "react-router-dom";
import { useContext, useState, useEffect } from "react";
import { AuthContext } from "../context/AuthContext";

export default function Home() {
  const navigate = useNavigate();
  const { dark } = useContext(AuthContext);
  const [currentTestimonial, setCurrentTestimonial] = useState(0);
  const [showModal, setShowModal] = useState(false);
  const [modalContent, setModalContent] = useState({});
  const [isVisible, setIsVisible] = useState({});
  const [expandedFeature, setExpandedFeature] = useState(null);

  const testimonials = [
    {
      name: "Sarah Johnson",
      role: "Environmental Volunteer",
      text: "VolunteerMatch helped me find the perfect opportunity to make a real difference in my community. The platform is intuitive and connects you with causes you truly care about.",
      avatar: "SJ",
      rating: 5
    },
    {
      name: "Michael Chen",
      role: "Education Mentor",
      text: "As a teacher, I wanted to volunteer in education. This platform matched me with amazing tutoring opportunities that fit my schedule perfectly.",
      avatar: "MC",
      rating: 5
    },
    {
      name: "Emily Rodriguez",
      role: "Healthcare Volunteer",
      text: "The application process was so smooth, and I love being able to track my volunteer hours and see the impact I'm making in real-time.",
      avatar: "ER",
      rating: 5
    }
  ];

  const impactStats = [
    { icon: "🌍", number: "50+", label: "Cities Served", color: "#22c55e" },
    { icon: "🏆", number: "95%", label: "Success Rate", color: "#f59e0b" },
    { icon: "⭐", number: "4.9", label: "User Rating", color: "#8b5cf6" },
    { icon: "🚀", number: "24/7", label: "Support", color: "#06b6d4" }
  ];

  const categories = [
    { icon: "🌱", title: "Environment", count: "120+ opportunities", color: "#22c55e" },
    { icon: "📚", title: "Education", count: "85+ opportunities", color: "#3b82f6" },
    { icon: "❤️", title: "Healthcare", count: "95+ opportunities", color: "#ef4444" },
    { icon: "🏠", title: "Community", count: "150+ opportunities", color: "#f59e0b" },
    { icon: "🎨", title: "Arts & Culture", count: "60+ opportunities", color: "#8b5cf6" },
    { icon: "🐾", title: "Animal Welfare", count: "45+ opportunities", color: "#06b6d4" }
  ];

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentTestimonial((prev) => (prev + 1) % testimonials.length);
    }, 5000);
    return () => clearInterval(interval);
  }, [testimonials.length]);

  const toggleFeatureDetails = (featureType) => {
    setExpandedFeature(expandedFeature === featureType ? null : featureType);
  };

  const featureDetails = {
    matching: "Our AI-powered matching system analyzes your skills, interests, location, and availability to connect you with the most relevant volunteer opportunities. We consider factors like your experience level, preferred causes, and time commitment to ensure every match is meaningful.",
    applications: "Skip the paperwork! Our streamlined application process lets you apply to multiple opportunities with just one click. Your profile information is automatically shared with organizations, and you'll receive instant confirmation and updates on your application status.",
    tracking: "See the real difference you're making! Track your volunteer hours, view impact metrics, earn achievement badges, and get detailed reports on your contributions. Share your volunteer journey and inspire others to join the cause."
  };

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setIsVisible(prev => ({ ...prev, [entry.target.id]: true }));
          }
        });
      },
      { threshold: 0.1 }
    );

    const elements = document.querySelectorAll('[data-animate]');
    elements.forEach((el) => observer.observe(el));

    return () => observer.disconnect();
  }, []);

  return (
    <div className={`page ${dark ? "dark" : ""}`}>
      {/* Hero Section */}
      <div className="hero-section">
        <div className="hero-background">
          <div className="hero-shape shape-1"></div>
          <div className="hero-shape shape-2"></div>
          <div className="hero-shape shape-3"></div>
        </div>
        
        <div className="container">
          <div className="hero-content-center">
            <div className="hero-badge">
              <span>🤝</span>
              <span>Making Impact Together</span>
            </div>
            
            <h1 className="hero-title">
              Connect. Volunteer. 
              <span className="gradient-text">Make a Difference</span>
            </h1>
            
            <p className="hero-subtitle">
              Join thousands of volunteers and organizations creating positive change in communities worldwide. 
              Find meaningful opportunities that match your skills and passion.
            </p>

            <div className="hero-actions">
              <button 
                className="btn btn-primary btn-lg hero-cta" 
                onClick={() => navigate("/register")}
              >
                <span>Get Started</span>
                <span>→</span>
              </button>
              <button 
                className="btn btn-secondary btn-lg" 
                onClick={() => navigate("/login")}
              >
                Sign In
              </button>
            </div>

            <div className="hero-stats">
              <div className="stat-item">
                <div className="stat-number">10K+</div>
                <div className="stat-label">Volunteers</div>
              </div>
              <div className="stat-divider"></div>
              <div className="stat-item">
                <div className="stat-number">500+</div>
                <div className="stat-label">Organizations</div>
              </div>
              <div className="stat-divider"></div>
              <div className="stat-item">
                <div className="stat-number">25K+</div>
                <div className="stat-label">Hours Volunteered</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Categories Section */}
      <div className="categories-section" id="categories" data-animate>
        <div className="container">
          <div className={`section-header ${isVisible.categories ? 'animate-in' : ''}`}>
            <h2 className="section-title">Explore Volunteer Categories</h2>
            <p className="section-subtitle">Find opportunities that match your interests and skills</p>
          </div>
          
          <div className="categories-grid">
            {categories.map((category, index) => (
              <div 
                key={index} 
                className={`category-card ${isVisible.categories ? 'animate-in' : ''}`}
                style={{ animationDelay: `${index * 0.1}s` }}
                onClick={() => navigate(`/opportunities?category=${encodeURIComponent(category.title)}`)}
              >
                <div className="category-icon" style={{ color: category.color }}>
                  {category.icon}
                </div>
                <h3>{category.title}</h3>
                <p>{category.count}</p>
                <div className="category-arrow">→</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Features Section */}
      <div className="features-section" id="features" data-animate>
        <div className="container">
          <div className={`section-header ${isVisible.features ? 'animate-in' : ''}`}>
            <h2 className="section-title">Why Choose VolunteerMatch?</h2>
            <p className="section-subtitle">Powerful features designed to connect hearts with causes</p>
          </div>
          
          <div className="features-grid">
            <div className={`feature-card ${isVisible.features ? 'animate-in' : ''}`}>
              <div className="feature-icon">🎯</div>
              <h3>Perfect Matches</h3>
              <p>AI-powered matching connects you with opportunities that align with your skills and interests.</p>
              {expandedFeature === 'matching' && (
                <div className="feature-details">
                  <p>{featureDetails.matching}</p>
                </div>
              )}
              <button className="feature-btn" onClick={() => toggleFeatureDetails('matching')}>
                {expandedFeature === 'matching' ? 'Show less ↑' : 'Learn more →'}
              </button>
            </div>
            
            <div className={`feature-card ${isVisible.features ? 'animate-in' : ''}`} style={{ animationDelay: '0.1s' }}>
              <div className="feature-icon">⚡</div>
              <h3>Instant Applications</h3>
              <p>Apply to multiple opportunities with one click. No paperwork, no hassle.</p>
              {expandedFeature === 'applications' && (
                <div className="feature-details">
                  <p>{featureDetails.applications}</p>
                </div>
              )}
              <button className="feature-btn" onClick={() => toggleFeatureDetails('applications')}>
                {expandedFeature === 'applications' ? 'Show less ↑' : 'Learn more →'}
              </button>
            </div>
            
            <div className={`feature-card ${isVisible.features ? 'animate-in' : ''}`} style={{ animationDelay: '0.2s' }}>
              <div className="feature-icon">📊</div>
              <h3>Track Impact</h3>
              <p>See your volunteer hours, achievements, and the real difference you're making.</p>
              {expandedFeature === 'tracking' && (
                <div className="feature-details">
                  <p>{featureDetails.tracking}</p>
                </div>
              )}
              <button className="feature-btn" onClick={() => toggleFeatureDetails('tracking')}>
                {expandedFeature === 'tracking' ? 'Show less ↑' : 'Learn more →'}
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Impact Stats Section */}
      <div className="impact-section" id="impact" data-animate>
        <div className="container">
          <div className={`section-header ${isVisible.impact ? 'animate-in' : ''}`}>
            <h2 className="section-title">Our Impact</h2>
            <p className="section-subtitle">Together, we're making a difference</p>
          </div>
          
          <div className="impact-grid">
            {impactStats.map((stat, index) => (
              <div 
                key={index} 
                className={`impact-card ${isVisible.impact ? 'animate-in' : ''}`}
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                <div className="impact-icon" style={{ color: stat.color }}>
                  {stat.icon}
                </div>
                <div className="impact-number" style={{ color: stat.color }}>
                  {stat.number}
                </div>
                <div className="impact-label">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Testimonials Section */}
      <div className="testimonials-section" id="testimonials" data-animate>
        <div className="container">
          <div className={`section-header ${isVisible.testimonials ? 'animate-in' : ''}`}>
            <h2 className="section-title">What Our Volunteers Say</h2>
            <p className="section-subtitle">Real stories from real people making a difference</p>
          </div>
          
          <div className="testimonial-carousel">
            <div className="testimonial-card">
              <div className="testimonial-content">
                <div className="testimonial-stars">
                  {[...Array(testimonials[currentTestimonial].rating)].map((_, i) => (
                    <span key={i}>⭐</span>
                  ))}
                </div>
                <p>"{testimonials[currentTestimonial].text}"</p>
              </div>
              <div className="testimonial-author">
                <div className="author-avatar">
                  {testimonials[currentTestimonial].avatar}
                </div>
                <div className="author-info">
                  <div className="author-name">{testimonials[currentTestimonial].name}</div>
                  <div className="author-role">{testimonials[currentTestimonial].role}</div>
                </div>
              </div>
            </div>
            
            <div className="testimonial-dots">
              {testimonials.map((_, index) => (
                <button
                  key={index}
                  className={`dot ${index === currentTestimonial ? 'active' : ''}`}
                  onClick={() => setCurrentTestimonial(index)}
                />
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* CTA Section */}
      <div className="cta-section">
        <div className="container">
          <div className="cta-content">
            <h2>Ready to Make a Difference?</h2>
            <p>Join thousands of volunteers creating positive change in their communities</p>
            <div className="cta-actions">
              <button 
                className="btn btn-primary btn-lg" 
                onClick={() => navigate("/register")}
              >
                Start Volunteering
              </button>
              <button 
                className="btn btn-outline btn-lg" 
                onClick={() => navigate("/opportunities")}
              >
                Browse Opportunities
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}