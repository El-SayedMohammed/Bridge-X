import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { registerUser, getSocialLoginUrl } from "../../services/api";
import "./Register.css";

import logo from "../../assets/logo.svg";
import googleIcon from "../../assets/images/google-icon.svg";

import facebookIcon from "../../assets/images/facebook-icon.svg";
import emailIcon from "../../assets/images/email-icon.svg";
import passwordIcon from "../../assets/images/password-icon.svg";
import buildingIcon from "../../assets/images/building-icon.svg";
import eyeIcon from "../../assets/images/eye-icon.svg";
import confirmPassIcon from "../../assets/images/confirm-pass-icon.svg";
import arrowRightIcon from "../../assets/images/arrow-right.svg";

function Register() {
  const [formData, setFormData] = useState({
    username: "",
    email: "",
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

    if (!formData.username) newErrors.username = "Username is required";
    if (!formData.email) newErrors.email = "Email is required";
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email))
      newErrors.email = "Valid email is required";

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
      const response = await registerUser({
        fullName: formData.username,
        email: formData.email,
        password: formData.password,
        passwordConfirmation: formData.confirmPassword,
      });

      const userId = response.user?.id || response.data?.user?.id || response.data?.id || response.id;

      localStorage.setItem(
        "registrationData",
        JSON.stringify({
          username: formData.username,
          email: formData.email,
          userId: userId,
        }),
      );
      navigate("/company-register");
    } catch (err) {
      if (err.data?.errors) {
        const backendErrors = {};
        if (err.data.errors.email) backendErrors.email = err.data.errors.email[0];
        if (err.data.errors.full_name) backendErrors.username = err.data.errors.full_name[0];
        if (err.data.errors.password) backendErrors.password = err.data.errors.password[0];
        setErrors(backendErrors);
      } else {
        setApiError(err.message || "Registration failed. Please try again.");
      }
    } finally {
      setLoading(false);
    }
  };

  const handleSocialLogin = async (provider) => {
    try {
      setApiError("");
      const data = await getSocialLoginUrl(provider);
      if (data && data.url) {
        window.location.href = data.url;
      }
    } catch (err) {
      console.error(err);
      setApiError("Failed to connect to the authentication server. Please check your connection or try again later.");
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
          <div className="nav-auth-link">
            <span>Already have an account? </span>
            <Link to="/login">Log in</Link>
          </div>
        </div>
      </nav>

      <div className="auth-container">
        <div className="auth-branding">
          <div className="auth-logo-wrapper">
            <img src={logo} alt="Logo" className="auth-logo-img" />
          </div>
          <h1 className="auth-brand-title">Bridge X</h1>
        </div>

        <div className="auth-card register-card">
          <div className="card-header">
            <h2 className="card-title">Create Company Account</h2>
            <p className="card-subtitle">
              Set up your login credentials to get started.
            </p>
          </div>

          <form className="auth-form" onSubmit={handleSubmit} noValidate>
            <div className="form-group">
              <label>Company Username</label>
              <div className={`input-wrapper ${errors.username ? "error" : ""}`}>
                <span className="input-icon">
                  <img src={buildingIcon} alt="Company" className="field-icon" />
                </span>
                <input
                  type="text"
                  name="username"
                  placeholder="e.g. acme_corp"
                  value={formData.username}
                  onChange={handleChange}
                />
              </div>
              {errors.username && (
                <span className="error-message">{errors.username}</span>
              )}
            </div>

            <div className="form-group">
              <label>Business Email</label>
              <div className={`input-wrapper ${errors.email ? "error" : ""}`}>
                <span className="input-icon">
                  <img src={emailIcon} alt="Email" className="field-icon" />
                </span>
                <input
                  type="email"
                  name="email"
                  placeholder="admin@company.com"
                  value={formData.email}
                  onChange={handleChange}
                />
              </div>
              {errors.email && (
                <span className="error-message">{errors.email}</span>
              )}
            </div>

            <div className="form-group">
              <label>Password</label>
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

            <div className="divider">
              <div className="divider-line"></div>
              <span>OR CONTINUE WITH</span>
            </div>

            <div className="social-login">

              <button type="button" className="social-btn" onClick={() => handleSocialLogin("google")}>
                <img src={googleIcon} alt="Google" />
              </button>
              <button type="button" className="social-btn" onClick={() => handleSocialLogin("facebook")}>
                <img src={facebookIcon} alt="Facebook" />
              </button>
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
              className="btn-primary mt-2"
              disabled={loading}
              style={{ opacity: loading ? 0.7 : 1 }}
            >
              <span>{loading ? "Creating Account..." : "Continue"}</span>
              {!loading && <img src={arrowRightIcon} alt="Arrow" />}
            </button>
            <p className="terms-text">
              By continuing, you agree to our <Link to="#">Terms</Link> and{" "}
              <Link to="#">Privacy Policy</Link>.
            </p>
          </form>
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

export default Register;
