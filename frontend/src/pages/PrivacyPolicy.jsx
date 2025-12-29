import { useContext } from "react";
import { AuthContext } from "../context/AuthContext";

export default function PrivacyPolicy() {
  const { dark } = useContext(AuthContext);

  return (
    <div className={`page-container ${dark ? "dark" : ""}`}>
      <div className="container">
        <div className="page-header">
          <h1>Privacy Policy</h1>
          <p>Last updated: {new Date().toLocaleDateString()}</p>
        </div>

        <div className="policy-content">
          <section className="policy-section">
            <h2>Information We Collect</h2>
            <p>We collect information you provide when creating an account, applying for opportunities, and using our services:</p>
            <ul>
              <li>Personal information (name, email, phone number)</li>
              <li>Profile information (skills, interests, location)</li>
              <li>Application and messaging data</li>
              <li>Usage analytics and preferences</li>
            </ul>
          </section>

          <section className="policy-section">
            <h2>How We Use Your Information</h2>
            <p>Your information is used to:</p>
            <ul>
              <li>Connect volunteers with organizations</li>
              <li>Facilitate communication between users</li>
              <li>Improve our services and user experience</li>
              <li>Send important notifications and updates</li>
              <li>Ensure platform security and prevent abuse</li>
            </ul>
          </section>

          <section className="policy-section">
            <h2>Information Sharing</h2>
            <p>We do not sell your personal information. We may share information:</p>
            <ul>
              <li>With organizations when you apply for opportunities</li>
              <li>With other volunteers in the same events (for coordination)</li>
              <li>When required by law or to protect our rights</li>
              <li>With service providers who help operate our platform</li>
            </ul>
          </section>

          <section className="policy-section">
            <h2>Data Security</h2>
            <p>We implement appropriate security measures to protect your personal information:</p>
            <ul>
              <li>Encrypted data transmission (HTTPS)</li>
              <li>Secure password storage with hashing</li>
              <li>Regular security audits and updates</li>
              <li>Limited access to personal data by staff</li>
            </ul>
          </section>

          <section className="policy-section">
            <h2>Your Rights</h2>
            <p>You have the right to:</p>
            <ul>
              <li>Access and update your personal information</li>
              <li>Delete your account and associated data</li>
              <li>Opt out of non-essential communications</li>
              <li>Request a copy of your data</li>
            </ul>
          </section>

          <section className="policy-section">
            <h2>Contact Us</h2>
            <p>For privacy concerns or questions about this policy, contact us at:</p>
            <p><strong>Email:</strong> privacy@volunteermatch.com</p>
            <p><strong>Address:</strong> 123 Volunteer Street, Community City, CC 12345</p>
          </section>
        </div>
      </div>
    </div>
  );
}