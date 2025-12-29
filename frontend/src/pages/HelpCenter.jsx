import { useContext } from "react";
import { AuthContext } from "../context/AuthContext";

export default function HelpCenter() {
  const { dark } = useContext(AuthContext);

  return (
    <div className={`page-container ${dark ? "dark" : ""}`}>
      <div className="container">
        <div className="page-header">
          <h1>Help Center</h1>
          <p>Find answers to frequently asked questions</p>
        </div>

        <div className="help-content">
          <div className="faq-section">
            <h2>Frequently Asked Questions</h2>
            
            <div className="faq-item">
              <h3>How do I create a volunteer opportunity?</h3>
              <p>Navigate to your dashboard and click "Create Opportunity". Fill in the details including title, description, location, date, and required skills. Once published, volunteers can apply to your opportunity.</p>
            </div>

            <div className="faq-item">
              <h3>How do I apply for opportunities?</h3>
              <p>Browse opportunities on the Opportunities page and click "Apply" on any that interest you. Organizations will review your application and notify you of their decision.</p>
            </div>

            <div className="faq-item">
              <h3>How do I message other users?</h3>
              <p>Go to the Messages section in your dashboard to communicate with organizations or volunteers. Messages are automatically created when you apply for opportunities.</p>
            </div>

            <div className="faq-item">
              <h3>How do I update my profile?</h3>
              <p>Visit your Profile page to update your information, upload an avatar, add skills, and manage your volunteer preferences.</p>
            </div>

            <div className="faq-item">
              <h3>How do notifications work?</h3>
              <p>You'll receive real-time notifications for application updates, new messages, and important announcements. Check the notification bell in the navbar.</p>
            </div>

            <div className="faq-item">
              <h3>Can I edit or delete my opportunities?</h3>
              <p>Yes, organizations can edit or delete their opportunities from the dashboard. Click the edit icon on any opportunity card to make changes.</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}