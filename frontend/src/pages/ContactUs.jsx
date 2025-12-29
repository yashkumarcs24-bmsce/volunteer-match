import { useContext } from "react";
import { AuthContext } from "../context/AuthContext";

export default function ContactUs() {
  const { dark } = useContext(AuthContext);

  return (
    <div className={`page-container ${dark ? "dark" : ""}`}>
      <div className="container">
        <div className="page-header">
          <h1>Contact Us</h1>
          <p>Get in touch with our support team</p>
        </div>

        <div className="contact-content">
          <div className="contact-grid">
            <div className="contact-card">
              <div className="contact-icon">📧</div>
              <h3>Email Support</h3>
              <p>support@volunteermatch.com</p>
              <p>We typically respond within 24 hours</p>
            </div>

            <div className="contact-card">
              <div className="contact-icon">📞</div>
              <h3>Phone Support</h3>
              <p>+1 (555) 123-4567</p>
              <p>Monday - Friday: 9:00 AM - 6:00 PM EST</p>
            </div>

            <div className="contact-card">
              <div className="contact-icon">🏢</div>
              <h3>Office Address</h3>
              <p>123 Volunteer Street<br/>Community City, CC 12345</p>
              <p>United States</p>
            </div>

            <div className="contact-card">
              <div className="contact-icon">⏰</div>
              <h3>Support Hours</h3>
              <p>Monday - Friday: 9:00 AM - 6:00 PM EST</p>
              <p>Weekend: Emergency support only</p>
            </div>
          </div>

          <div className="contact-form-section">
            <h2>Send us a Message</h2>
            <form className="contact-form">
              <div className="form-row">
                <div className="form-group">
                  <label>Name</label>
                  <input type="text" placeholder="Your full name" />
                </div>
                <div className="form-group">
                  <label>Email</label>
                  <input type="email" placeholder="your@email.com" />
                </div>
              </div>
              <div className="form-group">
                <label>Subject</label>
                <input type="text" placeholder="What's this about?" />
              </div>
              <div className="form-group">
                <label>Message</label>
                <textarea rows="5" placeholder="Tell us how we can help..."></textarea>
              </div>
              <button type="submit" className="btn btn-primary">Send Message</button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}