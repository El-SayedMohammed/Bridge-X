import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { forgotPassword } from "../../services/api";
import "../Register/Register.css";
import "./ForgotPassword.css";

import logo from "../../assets/logo.svg";
import emailIcon from "../../assets/images/email-icon.svg";
import helpIcon from "../../assets/images/help-icon.svg";
import arrowLeftIcon from "../../assets/images/arrow-left.svg";
import arrowRightIcon from "../../assets/images/arrow-right.svg";

function ForgotPassword() {
  const [email, setEmail] = useState("");
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [apiError, setApiError] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!email) {
      setErrors({ email: "Email is required" });
      return;
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      setErrors({ email: "Valid email is required" });
      return;
    }

    setLoading(true);
    setApiError("");

    try {
      await forgotPassword({ email });
      localStorage.setItem("resetEmail", email);
      navigate("/verify-email");
    } catch (err) {
      setApiError(err.message || "Failed to send reset code");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-page">
      <div className="bg-blur top-left"></div>
      <div className="bg-blur bottom-right"></div>

      <nav className="top-nav">
        <div className="nav-container">
          <Link to="/" className="nav-brand" style={{ textDecoration: "none" }}>
            Bridge X
          </Link>
          <button className="nav-help">
            <img src={helpIcon} alt="Help" />
            forget password
          </button>
        </div>
      </nav>

      <div className="auth-container">
        <div className="auth-branding">
          <div className="auth-logo-wrapper">
            <img src={logo} alt="Logo" className="auth-logo-img" />
          </div>
          <h1 className="auth-brand-title">Bridge X</h1>
        </div>

        <div className="auth-card forgot-card">
          <div className="card-header center-header">
            <h2 className="card-title">Reset Your Password</h2>
            <p className="card-subtitle">
              We will send a verification code to your email
            </p>
          </div>

          <form className="auth-form" onSubmit={handleSubmit} noValidate>
            <div className="form-group uppercase-label">
              <label>EMAIL ADDRESS</label>
              <div className={`input-wrapper ${errors.email ? "error" : ""}`}>
                <span className="input-icon">
                  <img src={emailIcon} alt="Email" className="field-icon" />
                </span>
                <input
                  type="email"
                  placeholder="name@company.com"
                  value={email}
                  onChange={(e) => {
                    setEmail(e.target.value);
                    if (errors.email) setErrors({});
                  }}
                />
              </div>
              {errors.email && (
                <span className="error-message">{errors.email}</span>
              )}
            </div>

            {apiError && (
              <div
                className="error-message"
                style={{
                  textAlign: "center",
                  marginBottom: "12px",
                  background: "#FEF2F2",
                  padding: "10px",
                  borderRadius: "8px",
                }}
              >
                {apiError}
              </div>
            )}

            <button
              type="submit"
              className="btn-primary btn-gradient mt-2"
              disabled={loading}
              style={{ opacity: loading ? 0.7 : 1 }}
            >
              <span>{loading ? "Sending..." : "Send Code"}</span>
              {!loading && <img src={arrowRightIcon} alt="Arrow" />}
            </button>
          </form>

          <div className="back-link">
            <Link to="/login">
              <img src={arrowLeftIcon} alt="Back" />
              Back to Login
            </Link>
          </div>
        </div>
      </div>

      <footer className="auth-footer">
        <div className="footer-container">
          <div className="footer-brand">
            <span className="brand-name">Bridge X</span>
            <span className="copyright">
              © 2026 Bridge X. Engineered for collaboration.
            </span>
          </div>
          <div className="footer-links">
            <Link to="#">Privacy Policy</Link>
            <Link to="#">Terms of Service</Link>
            <Link to="#">Cookie Policy</Link>
            <Link to="#">Security</Link>
            <Link to="#">Contact</Link>
          </div>
        </div>
      </footer>
    </div>
  );
}

export default ForgotPassword;
