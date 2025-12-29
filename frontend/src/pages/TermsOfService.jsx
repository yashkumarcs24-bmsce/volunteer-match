import { useContext } from "react";
import { AuthContext } from "../context/AuthContext";

export default function TermsOfService() {
  const { dark } = useContext(AuthContext);

  return (
    <div className={`page-container ${dark ? "dark" : ""}`}>
      <div className="container">
        <div className="page-header">
          <h1>Terms of Service</h1>
          <p>Last updated: {new Date().toLocaleDateString()}</p>
        </div>

        <div className="terms-content">
          <section className="terms-section">
            <h2>Acceptance of Terms</h2>
            <p>By using VolunteerMatch, you agree to these terms and conditions. If you do not agree with any part of these terms, you may not use our service.</p>
          </section>

          <section className="terms-section">
            <h2>User Responsibilities</h2>
            <p>As a user of our platform, you agree to:</p>
            <ul>
              <li>Provide accurate and truthful information</li>
              <li>Use the platform respectfully and lawfully</li>
              <li>Respect other users' privacy and rights</li>
              <li>Follow through on volunteer commitments when possible</li>
              <li>Report inappropriate behavior or content</li>
            </ul>
          </section>

          <section className="terms-section">
            <h2>Prohibited Activities</h2>
            <p>Users may not:</p>
            <ul>
              <li>Post false, misleading, or fraudulent information</li>
              <li>Engage in spam, harassment, or discriminatory behavior</li>
              <li>Use the platform for commercial purposes without permission</li>
              <li>Attempt to hack, disrupt, or damage the platform</li>
              <li>Share inappropriate or offensive content</li>
            </ul>
          </section>

          <section className="terms-section">
            <h2>Content and Intellectual Property</h2>
            <p>You retain ownership of content you post, but grant us license to use it for platform operations. Our platform content, design, and features are protected by intellectual property laws.</p>
          </section>

          <section className="terms-section">
            <h2>Volunteer Activities</h2>
            <p>VolunteerMatch facilitates connections but is not responsible for:</p>
            <ul>
              <li>The quality or safety of volunteer opportunities</li>
              <li>Disputes between volunteers and organizations</li>
              <li>Outcomes or results of volunteer activities</li>
              <li>Background checks or verification of users</li>
            </ul>
          </section>

          <section className="terms-section">
            <h2>Account Termination</h2>
            <p>We reserve the right to suspend or terminate accounts that violate these terms. Users may delete their accounts at any time through their profile settings.</p>
          </section>

          <section className="terms-section">
            <h2>Limitation of Liability</h2>
            <p>VolunteerMatch is provided "as is" without warranties. We are not liable for any damages arising from use of the platform, volunteer activities, or interactions between users.</p>
          </section>

          <section className="terms-section">
            <h2>Changes to Terms</h2>
            <p>We may update these terms periodically. Continued use of the platform after changes constitutes acceptance of the new terms.</p>
          </section>

          <section className="terms-section">
            <h2>Contact Information</h2>
            <p>For questions about these terms, contact us at:</p>
            <p><strong>Email:</strong> legal@volunteermatch.com</p>
            <p><strong>Address:</strong> 123 Volunteer Street, Community City, CC 12345</p>
          </section>
        </div>
      </div>
    </div>
  );
}