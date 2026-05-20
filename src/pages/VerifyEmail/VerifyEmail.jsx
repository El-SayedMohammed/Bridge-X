import { useState, useRef } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  verifyEmail,
  resendVerification,
  verifyResetCode,
  forgotPassword,
} from "../../services/api";
import "../Register/Register.css";
import "./VerifyEmail.css";

import logo from "../../assets/logo.svg";
import helpIcon from "../../assets/images/help-icon.svg";
import envelopeLgIcon from "../../assets/images/envelope-lg.svg";

function VerifyEmail() {
  const [otp, setOtp] = useState(["", "", "", "", "", ""]);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [resendMsg, setResendMsg] = useState("");
  const inputRefs = useRef([]);
  const navigate = useNavigate();

  const regData = JSON.parse(localStorage.getItem("registrationData") || "{}");
  const resetEmail = localStorage.getItem("resetEmail");
  const isResetMode = !!resetEmail;
  const userEmail = isResetMode ? resetEmail : regData.email || "";

  const handleChange = (element, index) => {
    if (isNaN(element.value)) return false;

    setOtp([...otp.map((d, idx) => (idx === index ? element.value : d))]);
    setError("");

    if (element.nextSibling && element.value !== "") {
      element.nextSibling.focus();
    }
  };

  const handleKeyDown = (e, index) => {
    if (e.key === "Backspace" && !otp[index] && inputRefs.current[index - 1]) {
      inputRefs.current[index - 1].focus();
    }
  };

  const handleResend = async () => {
    setOtp(["", "", "", "", "", ""]);
    setError("");
    setResendMsg("");

    if (inputRefs.current[0]) {
      inputRefs.current[0].focus();
    }

    if (userEmail) {
      try {
        if (isResetMode) {
          await forgotPassword({ email: userEmail });
        } else {
          await resendVerification({ email: userEmail });
        }
        setResendMsg("Verification code resent!");
      } catch (err) {
        setError(err.message || "Failed to resend code");
      }
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const code = otp.join("");

    if (code.length === 6) {
      setLoading(true);
      setError("");

      try {
        if (isResetMode) {
          
          const res = await verifyResetCode({ email: userEmail, code });
          const actualToken =
            res.token ||
            res.reset_token ||
            res.data?.token ||
            res.data?.reset_token ||
            code;
          localStorage.setItem("resetToken", actualToken);
          navigate("/create-password");
        } else {
          
          await verifyEmail({ email: userEmail, code });
          navigate("/company-register");
        }
      } catch (err) {
        setError(err.message || "Invalid verification code");
      } finally {
        setLoading(false);
      }
    } else {
      setError("Please enter the complete 6-digit code");
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

        <div className="auth-card verify-card">
          <div className="icon-visual-header">
            <div className="icon-bg">
              <img src={envelopeLgIcon} alt="Email Verification" />
            </div>
          </div>

          <div className="card-header center-header mb-0">
            <h2 className="card-title">Verify Your Email</h2>
            <p className="card-subtitle">Enter the code sent to your email</p>
          </div>

          <form className="auth-form" onSubmit={handleSubmit}>
            <div className="otp-input-group">
              {otp.map((data, index) => (
                <input
                  className={`otp-field ${error ? "error" : ""}`}
                  type="text"
                  name="otp"
                  maxLength="1"
                  key={index}
                  value={data}
                  onChange={(e) => handleChange(e.target, index)}
                  onKeyDown={(e) => handleKeyDown(e, index)}
                  ref={(el) => (inputRefs.current[index] = el)}
                  style={{ borderColor: error ? "#dc2626" : "" }}
                />
              ))}
            </div>

            {error && (
              <div
                className="error-message"
                style={{ textAlign: "center", marginTop: "8px" }}
              >
                {error}
              </div>
            )}

            <button
              type="submit"
              className="btn-primary btn-gradient mt-3"
              disabled={loading}
              style={{ opacity: loading ? 0.7 : 1 }}
            >
              <span>{loading ? "Verifying..." : "Verify"}</span>
            </button>
          </form>

          <div className="secondary-options" style={{ justifyContent: "center" }}>
            {resendMsg && (
              <p
                style={{
                  color: "#16a34a",
                  textAlign: "center",
                  fontSize: "13px",
                  marginBottom: "4px",
                }}
              >
                {resendMsg}
              </p>
            )}
            <p className="resend-text">
              Didn't receive the code?{" "}
              <button type="button" className="resend-link" onClick={handleResend}>
                Resend code
              </button>
            </p>
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

export default VerifyEmail;
