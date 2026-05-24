import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { loginUser, getSocialLoginUrl } from "../../services/api";
import logo from "../../assets/logo.svg";
import googleIcon from "../../assets/images/google-icon.svg";

import facebookIcon from "../../assets/images/facebook-icon.svg";
import emailIcon from "../../assets/images/email-icon.svg";
import passwordIcon from "../../assets/images/password-icon.svg";
import eyeIcon from "../../assets/images/eye-icon.svg";
import arrowRightIcon from "../../assets/images/arrow-right.svg";
import "./Login.css";

function Login() {
  
  const [email, setEmail] = useState(
    () => localStorage.getItem("rememberedEmail") || "",
  );
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(
    () => !!localStorage.getItem("rememberedEmail"),
  );
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [apiError, setApiError] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();

    let newErrors = {};
    const arabicRegex = /[\u0600-\u06FF]/;
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!email) {
      newErrors.email = "Email is required";
    } else if (arabicRegex.test(email)) {
      newErrors.email = "Email must be in English";
    } else if (!email.includes("@")) {
      newErrors.email = "Email must contain @";
    } else if (!emailRegex.test(email)) {
      newErrors.email = "Please enter a valid email address";
    }

    if (!password) {
      newErrors.password = "Password is required";
    } else if (password.length < 8) {
      newErrors.password = "Password must be at least 8 characters";
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    setLoading(true);
    setApiError("");

    try {
      await loginUser({ email, password });

      if (rememberMe) {
        localStorage.setItem("rememberedEmail", email);
      } else {
        localStorage.removeItem("rememberedEmail");
      }

      setErrors({});
      navigate("/dashboard");
    } catch (err) {
      
      if (err.data?.errors) {
        const backendErrors = {};
        if (err.data.errors.email) backendErrors.email = err.data.errors.email[0];
        if (err.data.errors.password) backendErrors.password = err.data.errors.password[0];
        setErrors(backendErrors);
      } else {
        setApiError(err.message || "Login failed. Check your credentials.");
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
    <div className="login-page">
      <div className="bg-blur top-left"></div>
      <div className="bg-blur bottom-right"></div>

      <nav className="top-nav">
        <div className="nav-container">
          <Link to="/" className="nav-brand" style={{ textDecoration: "none" }}>
            Bridge X
          </Link>
          <div className="nav-auth-link">
            <span>Don't have an account? </span>
            <Link to="/register">Sign up</Link>
          </div>
        </div>
      </nav>

      <div className="login-container">

        <div className="login-branding">
          <div className="login-logo-wrapper">
            <img src={logo} alt="Logo" className="login-logo-img" />
          </div>
          <h1 className="login-brand-title">Bridge X</h1>
        </div>


        <div className="login-card">
          <div className="card-header">
            <h2 className="card-title">Welcome Back</h2>
            <p className="card-subtitle">
              Please enter your details to sign in
            </p>
          </div>

          <form className="login-form" onSubmit={handleSubmit} noValidate>

            <div className="form-group">
              <label>Email Address</label>
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
                    if (errors.email) setErrors({ ...errors, email: "" });
                  }}
                />
              </div>
              {errors.email && (
                <span className="error-message">{errors.email}</span>
              )}
            </div>


            <div className="form-group">
              <div className="label-row">
                <label>Password</label>
                <Link to="/forgot-password" className="forgot-link">
                  Forgot password?
                </Link>
              </div>
              <div className={`input-wrapper ${errors.password ? "error" : ""}`}>
                <span className="input-icon">
                  <img src={passwordIcon} alt="Password" className="field-icon" />
                </span>
                <input
                  type={showPassword ? "text" : "password"}
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => {
                    setPassword(e.target.value);
                    if (errors.password) setErrors({ ...errors, password: "" });
                  }}
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


            <div className="remember-me">
              <input
                type="checkbox"
                id="remember"
                checked={rememberMe}
                onChange={(e) => setRememberMe(e.target.checked)}
              />
              <label htmlFor="remember">Remember me</label>
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
              className="btn-login"
              disabled={loading}
              style={{ opacity: loading ? 0.7 : 1 }}
            >
              <span>{loading ? "Signing in..." : "Login"}</span>
              {!loading && <img src={arrowRightIcon} alt="Arrow" />}
            </button>
          </form>


          <div className="divider">
            <div className="divider-line"></div>
            <span>OR CONTINUE WITH</span>
          </div>


          <div className="social-login">

            <button className="social-btn" onClick={() => handleSocialLogin("google")}>
              <img src={googleIcon} alt="Google" />
            </button>
            <button className="social-btn" onClick={() => handleSocialLogin("facebook")}>
              <img src={facebookIcon} alt="Facebook" />
            </button>
          </div>

          <p className="register-text">
            Don't have an account? <Link to="/register">Register</Link>
          </p>
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

export default Login;

