import { useContext, useState } from "react";
import { AuthContext } from "../context/AuthContext";
import { Link } from "react-router-dom";
import { FiHeart, FiMail, FiGithub, FiLinkedin, FiTwitter, FiX } from "react-icons/fi";

export default function Footer() {
  const { dark } = useContext(AuthContext);
  const currentYear = new Date().getFullYear();
  const [activeModal, setActiveModal] = useState(null);

  const openModal = (type) => setActiveModal(type);
  const closeModal = () => setActiveModal(null);

  const modals = {
    help: {
      title: "Help Center",
      content: (
        <div>
          <h4>How do I create opportunities?</h4>
          <p>Go to Dashboard → Create Opportunity and fill in the details.</p>
          <h4>How do I apply?</h4>
          <p>Browse opportunities and click "Apply" on any that interest you.</p>
          <h4>How do I message users?</h4>
          <p>Use the Messages section in your dashboard.</p>
        </div>
      )
    },
    contact: {
      title: "Contact Us",
      content: (
        <div>
          <p><strong>📧 Email:</strong> support@volunteermatch.com</p>
          <p><strong>📞 Phone:</strong> +1 (555) 123-4567</p>
          <p><strong>🏢 Address:</strong> 123 Volunteer Street, Community City</p>
          <p><strong>⏰ Hours:</strong> Mon-Fri 9AM-6PM EST</p>
        </div>
      )
    },
    privacy: {
      title: "Privacy Policy",
      content: (
        <div>
          <p>We collect information to connect volunteers with organizations and improve our services.</p>
          <p>We do not sell your personal information and implement security measures to protect your data.</p>
          <p>Contact privacy@volunteermatch.com for concerns.</p>
        </div>
      )
    },
    terms: {
      title: "Terms of Service",
      content: (
        <div>
          <p>By using VolunteerMatch, you agree to provide accurate information and use the platform respectfully.</p>
          <p>We facilitate connections but are not responsible for volunteer activities or disputes between users.</p>
          <p>Contact legal@volunteermatch.com for questions.</p>
        </div>
      )
    }
  };

  return (
    <>
      <footer className={`app-footer ${dark ? "dark" : ""}`}>
        <div className="footer-container">
          <div className="footer-content">
            <div className="footer-section">
              <h3 className="footer-title">Volunteer Match</h3>
              <p className="footer-description">
                Connecting volunteers with meaningful opportunities to create positive social impact.
              </p>
              <div className="footer-social">
                <a href="#" className="social-link" aria-label="GitHub">
                  <FiGithub />
                </a>
                <a href="#" className="social-link" aria-label="LinkedIn">
                  <FiLinkedin />
                </a>
                <a href="#" className="social-link" aria-label="Twitter">
                  <FiTwitter />
                </a>
                <a href="mailto:contact@volunteermatch.com" className="social-link" aria-label="Email">
                  <FiMail />
                </a>
              </div>
            </div>
            
            <div className="footer-section">
              <h4 className="footer-subtitle">Quick Links</h4>
              <ul className="footer-links">
                <li><Link to="/dashboard">Dashboard</Link></li>
                <li><Link to="/opportunities">Opportunities</Link></li>
                <li><Link to="/create-opportunity">Create Opportunity</Link></li>
                <li><Link to="/messages">Messages</Link></li>
              </ul>
            </div>
            
            <div className="footer-section">
              <h4 className="footer-subtitle">Support</h4>
              <ul className="footer-links">
                <li><button onClick={() => openModal('help')} className="footer-link-btn">Help Center</button></li>
                <li><button onClick={() => openModal('contact')} className="footer-link-btn">Contact Us</button></li>
                <li><button onClick={() => openModal('privacy')} className="footer-link-btn">Privacy Policy</button></li>
                <li><button onClick={() => openModal('terms')} className="footer-link-btn">Terms of Service</button></li>
              </ul>
            </div>
          </div>
          
          <div className="footer-bottom">
            <div className="footer-copyright">
              <p>
                © {currentYear} Volunteer Match Platform. Made with{" "}
                <FiHeart className="heart-icon" /> for social good.
              </p>
            </div>
            <div className="footer-tech">
              <span>Built with React & Node.js</span>
            </div>
          </div>
        </div>
      </footer>

      {activeModal && (
        <div className="support-modal-overlay" onClick={closeModal}>
          <div className="support-modal" onClick={(e) => e.stopPropagation()}>
            <div className="support-modal-header">
              <h3>{modals[activeModal].title}</h3>
              <button onClick={closeModal} className="support-modal-close">
                <FiX />
              </button>
            </div>
            <div className="support-modal-body">
              {modals[activeModal].content}
            </div>
          </div>
        </div>
      )}
    </>
  );
}
