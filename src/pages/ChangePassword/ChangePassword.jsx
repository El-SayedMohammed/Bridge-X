import { useState } from "react";
import { useNavigate } from "react-router-dom";
import DashboardNav from "../../components/DashboardNav/DashboardNav";
import { changePassword } from "../../services/api";
import "./ChangePassword.css";

import eyeIcon from "../../assets/images/eye-icon.svg";
import eyeOffIcon from "../../assets/images/eye-off-icon.svg";
import checkCircleFilledIcon from "../../assets/images/check-circle-filled-icon.svg";
import circleEmptyIcon from "../../assets/images/circle-empty-icon.svg";
import infoFilledIcon from "../../assets/images/info-filled-icon.svg";
import lockSmallIcon from "../../assets/images/lock-small-icon.svg";

const EyeIcon = () => <img src={eyeIcon} alt="Show" />;
const EyeOffIcon = () => <img src={eyeOffIcon} alt="Hide" />;
const CheckCircleFilledIcon = () => <img src={checkCircleFilledIcon} alt="Met" />;
const CircleEmptyIcon = () => <img src={circleEmptyIcon} alt="Not met" />;
const InfoFilledIcon = () => <img src={infoFilledIcon} alt="Info" />;
const LockSmallIcon = () => <img src={lockSmallIcon} alt="Secure" />;

const ReqItem = ({ met, text }) => (
  <div className={`cp-req-item${met ? " cp-req-item--met" : ""}`}>
    {met ? <CheckCircleFilledIcon /> : <CircleEmptyIcon />}
    <span className="cp-req-text">{text}</span>
  </div>
);

const ChangePassword = () => {
  const navigate = useNavigate();
  const [currentPwd, setCurrentPwd] = useState("");
  const [newPwd, setNewPwd] = useState("");
  const [confirmPwd, setConfirmPwd] = useState("");
  const [showCurrent, setShowCurrent] = useState(false);
  const [showNew, setShowNew] = useState(false);
  const [loading, setLoading] = useState(false);
  const [toast, setToast] = useState(null);

  const hasMinLength = newPwd.length >= 8;
  const hasUppercase = /[A-Z]/.test(newPwd);
  const hasNumberOrSpecial = /[0-9!@#$%^&*]/.test(newPwd);

  const showToast = (msg, type = "success") => {
    setToast({ msg, type });
    setTimeout(() => setToast(null), 3000);
  };

  const handleSave = async () => {
    if (!currentPwd) return showToast("Please enter current password", "error");
    if (!hasMinLength || !hasUppercase || !hasNumberOrSpecial) {
      return showToast("Password doesn't meet requirements", "error");
    }
    if (newPwd !== confirmPwd) return showToast("Passwords don't match", "error");

    setLoading(true);
    try {
      await changePassword({
        oldPassword: currentPwd,
        password: newPwd,
        passwordConfirmation: confirmPwd,
      });
      showToast("Password updated successfully ✓");
      setTimeout(() => navigate("/settings"), 1500);
    } catch (error) {
      showToast(error.message || "Failed to update password", "error");
    } finally {
      setLoading(false);
    }
  };

  const confirmBorderClass =
    confirmPwd && confirmPwd !== newPwd
      ? " cp-input--mismatch"
      : confirmPwd && confirmPwd === newPwd
        ? " cp-input--match"
        : "";

  return (
    <div className="cp-page">
      {toast && (
        <div className={`cp-toast${toast.type === "error" ? " cp-toast--error" : ""}`}>
          {toast.msg}
        </div>
      )}

      <DashboardNav />

      <div className="cp-content">
        <div className="cp-card">
          <div className="cp-card-header">
            <h1 className="cp-title">Change Password</h1>
            <p className="cp-subtitle">
              Update your password to keep your account secure and protected.
            </p>
          </div>

          <div className="cp-form">
            <div className="cp-field">
              <label className="cp-label">Current Password</label>
              <div className="cp-input-wrapper">
                <input
                  type={showCurrent ? "text" : "password"}
                  className="cp-input"
                  placeholder="Enter current password"
                  value={currentPwd}
                  onChange={(e) => setCurrentPwd(e.target.value)}
                />
                <button
                  className="cp-eye-btn"
                  onClick={() => setShowCurrent((v) => !v)}
                  type="button"
                  aria-label="Toggle visibility"
                >
                  {showCurrent ? <EyeOffIcon /> : <EyeIcon />}
                </button>
              </div>
            </div>

            <div className="cp-field">
              <label className="cp-label">New Password</label>
              <div className="cp-input-wrapper">
                <input
                  type={showNew ? "text" : "password"}
                  className="cp-input"
                  placeholder="Enter new password"
                  value={newPwd}
                  onChange={(e) => setNewPwd(e.target.value)}
                />
                <button
                  className="cp-eye-btn"
                  onClick={() => setShowNew((v) => !v)}
                  type="button"
                  aria-label="Toggle visibility"
                >
                  {showNew ? <EyeOffIcon /> : <EyeIcon />}
                </button>
              </div>
            </div>

            <div className="cp-requirements">
              <div className="cp-req-header">
                <InfoFilledIcon />
                <span className="cp-req-title">Password Requirements</span>
              </div>
              <div className="cp-req-list">
                <ReqItem met={hasMinLength} text="At least 8 characters long" />
                <ReqItem met={hasUppercase} text="One uppercase letter" />
                <ReqItem met={hasNumberOrSpecial} text="One number or special character" />
              </div>
            </div>

            <div className="cp-field cp-field--padded">
              <label className="cp-label">Confirm New Password</label>
              <input
                type="password"
                className={`cp-input${confirmBorderClass}`}
                placeholder="Re-type new password"
                value={confirmPwd}
                onChange={(e) => setConfirmPwd(e.target.value)}
              />
              {confirmPwd && confirmPwd !== newPwd && (
                <span className="cp-hint cp-hint--error">Passwords don't match</span>
              )}
              {confirmPwd && confirmPwd === newPwd && (
                <span className="cp-hint cp-hint--success">Passwords match ✓</span>
              )}
            </div>


            <div className="cp-actions">
              <button className="cp-save-btn" onClick={handleSave} disabled={loading}>
                {loading ? "Saving..." : "Save New Password"}
              </button>
              <button
                className="cp-cancel-btn"
                onClick={() => navigate("/settings")}
                type="button"
              >
                Cancel
              </button>
            </div>
          </div>


          <div className="cp-footer">
            <LockSmallIcon />
            <span className="cp-footer-text">End-to-End Encrypted Session</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ChangePassword;
