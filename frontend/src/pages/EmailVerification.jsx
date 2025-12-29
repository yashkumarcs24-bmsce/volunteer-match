import { useState, useEffect, useContext } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";
import toast from "react-hot-toast";

export default function EmailVerification() {
  const { dark } = useContext(AuthContext);
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [loading, setLoading] = useState(false);
  const [verified, setVerified] = useState(false);
  const [error, setError] = useState("");

  const token = searchParams.get("token");

  useEffect(() => {
    if (token) {
      verifyEmail(token);
    }
  }, [token]);

  const verifyEmail = async (verificationToken) => {
    setLoading(true);
    try {
      const res = await fetch(`${import.meta.env.VITE_API_URL || "http://localhost:8000/api"}/auth/verify-email`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ token: verificationToken }),
      });

      const data = await res.json();

      if (res.ok) {
        setVerified(true);
        toast.success("Email verified successfully! 🎉");
        setTimeout(() => navigate("/login"), 3000);
      } else {
        setError(data.message || "Verification failed");
        toast.error(data.message || "Verification failed");
      }
    } catch (err) {
      setError("Network error. Please try again.");
      toast.error("Network error. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const resendVerification = async () => {
    const email = prompt("Enter your email address:");
    if (!email) return;

    setLoading(true);
    try {
      const res = await fetch(`${import.meta.env.VITE_API_URL || "http://localhost:8000/api"}/auth/resend-verification`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });

      const data = await res.json();

      if (res.ok) {
        toast.success("Verification email sent! Check your inbox.");
      } else {
        toast.error(data.message || "Failed to send verification email");
      }
    } catch (err) {
      toast.error("Network error. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={`verification-page ${dark ? "dark" : ""}`}>
      <div className="floating-shape"></div>
      <div className="floating-shape"></div>
      <div className="floating-shape"></div>
      
      <div className="verification-container">
        <div className="verification-content">
          {loading ? (
            <>
              <div className="verification-icon loading">
                <div className="spinner-large"></div>
              </div>
              <h2>Verifying your email...</h2>
              <p>Please wait while we verify your email address.</p>
            </>
          ) : verified ? (
            <>
              <div className="verification-icon success">✅</div>
              <h2>Email Verified!</h2>
              <p>Your email has been successfully verified. You can now sign in to your account.</p>
              <button 
                className="btn btn-primary btn-lg"
                onClick={() => navigate("/login")}
              >
                Continue to Sign In
              </button>
            </>
          ) : error ? (
            <>
              <div className="verification-icon error">❌</div>
              <h2>Verification Failed</h2>
              <p>{error}</p>
              <div className="verification-actions">
                <button 
                  className="btn btn-primary"
                  onClick={resendVerification}
                  disabled={loading}
                >
                  Resend Verification Email
                </button>
                <button 
                  className="btn btn-secondary"
                  onClick={() => navigate("/register")}
                >
                  Back to Register
                </button>
              </div>
            </>
          ) : (
            <>
              <div className="verification-icon pending">📧</div>
              <h2>Check Your Email</h2>
              <p>We've sent a verification link to your email address. Click the link to verify your account.</p>
              <div className="verification-actions">
                <button 
                  className="btn btn-primary"
                  onClick={resendVerification}
                  disabled={loading}
                >
                  Resend Verification Email
                </button>
                <button 
                  className="btn btn-secondary"
                  onClick={() => navigate("/login")}
                >
                  Back to Sign In
                </button>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}