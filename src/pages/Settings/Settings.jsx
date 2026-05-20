import { useState } from "react";
import { useNavigate } from "react-router-dom";
import DashboardNav from "../../components/DashboardNav/DashboardNav";
import { deleteCompanyAccount, logoutUser, removeToken } from "../../services/api";
import "./Settings.css";

import shieldIcon from "../../assets/images/shield-icon.svg";
import alertCircleIcon from "../../assets/images/alert-circle-icon.svg";
import keyIcon from "../../assets/images/key-icon.svg";
import logoutIcon from "../../assets/images/logout-icon.svg";
import trashIcon from "../../assets/images/trash-icon.svg";

const ShieldIcon = () => <img src={shieldIcon} alt="Security" />;
const AlertCircleIcon = () => <img src={alertCircleIcon} alt="Danger" />;
const KeyIcon = () => <img src={keyIcon} alt="Change password" />;
const LogoutIcon = () => <img src={logoutIcon} alt="Sign out" />;
const TrashIcon = () => <img src={trashIcon} alt="Delete account" />;


const Settings = () => {
  const navigate = useNavigate();
  const [toast, setToast] = useState(null);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [showLogoutConfirm, setShowLogoutConfirm] = useState(false);
  const [loading, setLoading] = useState(false);

  const showToast = (msg, type = "info") => {
    setToast({ msg, type });
    setTimeout(() => setToast(null), 2500);
  };

  const handleDeleteAccount = async () => {
    setLoading(true);
    try {
      await deleteCompanyAccount();
      removeToken();
      localStorage.removeItem("companyProfile");
      setShowDeleteConfirm(false);
      navigate("/");
    } catch (err) {
      showToast(err.message || "Failed to delete account", "danger");
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = async () => {
    setLoading(true);
    try {
      await logoutUser();
      setShowLogoutConfirm(false);
      navigate("/login");
    } catch {
      
      removeToken();
      setShowLogoutConfirm(false);
      navigate("/login");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="cs-page">
      {toast && (
        <div className={`cs-toast${toast.type === "danger" ? " cs-toast--danger" : ""}`}>
          {toast.msg}
        </div>
      )}

      {showDeleteConfirm && (
        <div className="cs-modal-overlay">
          <div className="cs-modal">
            <h3 className="cs-modal-title">Delete Account</h3>
            <p className="cs-modal-body">
              Are you sure? This action cannot be undone and all your data will
              be permanently deleted.
            </p>
            <div className="cs-modal-actions">
              <button className="cs-modal-cancel" onClick={() => setShowDeleteConfirm(false)}>
                Cancel
              </button>
              <button
                className="cs-modal-confirm"
                onClick={handleDeleteAccount}
                disabled={loading}
              >
                {loading ? "Deleting..." : "Delete"}
              </button>
            </div>
          </div>
        </div>
      )}

      {showLogoutConfirm && (
        <div className="cs-modal-overlay">
          <div className="cs-modal">
            <h3 className="cs-modal-title">Sign Out</h3>
            <p className="cs-modal-body">
              Are you sure you want to sign out? You will need to enter your
              credentials to access your account again.
            </p>
            <div className="cs-modal-actions">
              <button className="cs-modal-cancel" onClick={() => setShowLogoutConfirm(false)}>
                Cancel
              </button>
              <button
                className="cs-modal-confirm"
                onClick={handleLogout}
                disabled={loading}
              >
                {loading ? "Logging Out..." : "Sign Out"}
              </button>
            </div>
          </div>
        </div>
      )}

      <DashboardNav />

      <div className="cs-content">
        <div className="cs-card">
          <div className="cs-card-header">
            <h1 className="cs-title">Company Settings</h1>
            <p className="cs-subtitle">
              Manage your organization's identity and security preferences.
            </p>
          </div>



          <div className="cs-section">
            <div className="cs-section-header">
              <span className="cs-section-icon"><ShieldIcon /></span>
              <h2 className="cs-section-title">Security</h2>
            </div>
            <div className="cs-security-row">
              <div className="cs-row-info">
                <div className="cs-row-label">Password Management</div>
                <div className="cs-row-desc">
                  Update your organization's administrative password.
                </div>
              </div>
              <button
                className="cs-change-pwd-btn"
                onClick={() => navigate("/change-password")}
              >
                <KeyIcon />
                Change password
              </button>
            </div>
          </div>

          <div className="cs-section cs-section--danger">
            <div className="cs-section-header">
              <span className="cs-section-icon"><AlertCircleIcon /></span>
              <h2 className="cs-section-title cs-section-title--danger">
                Danger Zone
              </h2>
            </div>

            <div className="cs-danger-row">
              <div className="cs-row-info">
                <div className="cs-danger-label">Sign Out</div>
                <div className="cs-danger-desc">
                  Safely end your current session across all devices.
                </div>
              </div>
              <button
                className="cs-danger-btn"
                onClick={() => setShowLogoutConfirm(true)}
              >
                <LogoutIcon />
                Logout
              </button>
            </div>

            <div className="cs-danger-row">
              <div className="cs-row-info">
                <div className="cs-danger-label">Delete Account</div>
                <div className="cs-danger-desc">
                  Once deleted, your account and data can't be recovered.
                </div>
              </div>
              <button
                className="cs-danger-btn"
                onClick={() => setShowDeleteConfirm(true)}
              >
                <TrashIcon />
                Delete
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Settings;
