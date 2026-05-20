import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { resetPassword } from "../../services/api";
import "../Register/Register.css";
import "../ForgotPassword/ForgotPassword.css";
import "./CreatePassword.css";

import logo from "../../assets/logo.svg";
import passwordIcon from "../../assets/images/password-icon.svg";
import helpIcon from "../../assets/images/help-icon.svg";
import confirmPassIcon from "../../assets/images/confirm-pass-icon.svg";
import lockLgIcon from "../../assets/images/lock-lg.svg";
import checkValidIcon from "../../assets/images/check-circle-valid.svg";
import checkInvalidIcon from "../../assets/images/check-circle-invalid.svg";
import arrowLeftIcon from "../../assets/images/arrow-left.svg";
import eyeIcon from "../../assets/images/eye-icon.svg";

function CreatePassword() {
  const [formData, setFormData] = useState({
    password: "",
    confirmPassword: "",
  });
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [apiError, setApiError] = useState("");
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    if (errors[e.target.name]) {
      setErrors({ ...errors, [e.target.name]: "" });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    let newErrors = {};

    if (!formData.password) newErrors.password = "Password is required";
    else if (formData.password.length < 8)
      newErrors.password = "Password must be at least 8 characters";

    if (!formData.confirmPassword)
      newErrors.confirmPassword = "Confirm password is required";
    else if (formData.password !== formData.confirmPassword)
      newErrors.confirmPassword = "Passwords do not match";

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    setLoading(true);
    setApiError("");

    try {
      const resetToken = localStorage.getItem("resetToken") || "";
      const email = localStorage.getItem("resetEmail") || "";

      await resetPassword({
        resetToken,
        email,
        password: formData.password,
        passwordConfirmation: formData.confirmPassword,
      });

      localStorage.removeItem("resetToken");
      localStorage.removeItem("resetEmail");
      navigate("/login");
    } catch (err) {
      setApiError(err.message || "Failed to reset password");
    } finally {
      setLoading(false);
    }
  };

  const hasMinLength = formData.password.length >= 8;
  const hasNumberOrSymbol = /[\d!@#$%^&*(),.?":{}|<>]/.test(formData.password);

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


        <div className="auth-card create-pass-card">

          <div className="icon-visual-header">
            <div className="icon-bg-light">
              <img src={lockLgIcon} alt="Lock" />
            </div>
          </div>

          <div className="card-header center-header">
            <h2 className="card-title">Create New Password</h2>
            <p className="card-subtitle">
              Choose a strong password to protect your account.
            </p>
          </div>

          <form className="auth-form" onSubmit={handleSubmit} noValidate>

            <div className="form-group">
              <label>New Password</label>
              <div className={`input-wrapper ${errors.password ? "error" : ""}`}>
                <span className="input-icon">
                  <img src={passwordIcon} alt="Password" className="field-icon" />
                </span>
                <input
                  type={showPassword ? "text" : "password"}
                  name="password"
                  placeholder="••••••••"
                  value={formData.password}
                  onChange={handleChange}
                />
                <button
                  type="button"
                  className="password-toggle"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  <img
                    src={eyeIcon}
                    alt={showPassword ? "Hide password" : "Show password"}
                    style={{ opacity: showPassword ? 0.5 : 1 }}
                  />
                </button>
              </div>
              {errors.password && (
                <span className="error-message">{errors.password}</span>
              )}
            </div>


            <div className="form-group">
              <label>Confirm Password</label>
              <div className={`input-wrapper ${errors.confirmPassword ? "error" : ""}`}>
                <span className="input-icon">
                  <img src={confirmPassIcon} alt="Confirm Password" className="field-icon" />
                </span>
                <input
                  type={showConfirmPassword ? "text" : "password"}
                  name="confirmPassword"
                  placeholder="••••••••"
                  value={formData.confirmPassword}
                  onChange={handleChange}
                />
                <button
                  type="button"
                  className="password-toggle"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                >
                  <img
                    src={eyeIcon}
                    alt={showConfirmPassword ? "Hide password" : "Show password"}
                    style={{ opacity: showConfirmPassword ? 0.5 : 1 }}
                  />
                </button>
              </div>
              {errors.confirmPassword && (
                <span className="error-message">{errors.confirmPassword}</span>
              )}
            </div>


            <div className="password-checklist">
              <div className="checklist-item">
                <img
                  src={hasMinLength ? checkValidIcon : checkInvalidIcon}
                  alt={hasMinLength ? "Valid" : "Invalid"}
                />
                <span style={{ color: hasMinLength ? "#111827" : "#737782" }}>
                  Minimum 8 characters long
                </span>
              </div>
              <div className="checklist-item">
                <img
                  src={hasNumberOrSymbol ? checkValidIcon : checkInvalidIcon}
                  alt={hasNumberOrSymbol ? "Valid" : "Invalid"}
                />
                <span style={{ color: hasNumberOrSymbol ? "#111827" : "#737782" }}>
                  At least one number or symbol
                </span>
              </div>
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
              <span>{loading ? "Resetting..." : "Reset Password"}</span>
            </button>
          </form>


          <div className="back-link">
            <Link
              to="/login"
              style={{ display: "flex", alignItems: "center", gap: "8px" }}
            >
              <img src={arrowLeftIcon} alt="Back" />
              Back to Sign In
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

export default CreatePassword;
