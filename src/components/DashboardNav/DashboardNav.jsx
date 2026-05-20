import { Link, useLocation } from "react-router-dom";
import { useState } from "react";
import "./DashboardNav.css";
import menuIcon from "../../assets/images/menu-icon.svg";
import closeMenuIcon from "../../assets/images/close-menu-icon.svg";

function DashboardNav({ logo, initials }) {
  const location = useLocation();
  const currentPath = location.pathname;
  const [isMobileOpen, setIsMobileOpen] = useState(false);

  const getInitials = (name) => {
    if (!name) return "BX";
    const words = name.split(" ");
    if (words.length >= 2) return (words[0][0] + words[1][0]).toUpperCase();
    return name.substring(0, 2).toUpperCase();
  };

  const saved = localStorage.getItem("companyProfile");
  const profile = saved ? JSON.parse(saved) : null;

  const displayLogo = logo || profile?.logo;
  const displayInitials =
    initials || (profile?.companyName ? getInitials(profile.companyName) : "BX");

  const toggleMobileMenu = () => {
    setIsMobileOpen(!isMobileOpen);
  };

  return (
    <nav className="dashboard-nav">
      <div className="dashboard-nav-inner">
        <div className="nav-left">
          <span className="nav-logo">BridgeX</span>
          <div className={`nav-links ${isMobileOpen ? "open" : ""}`}>
            <Link to="/dashboard" className={currentPath === "/dashboard" ? "active" : ""} onClick={() => setIsMobileOpen(false)}>
              Dashboard
            </Link>
            <Link to="/requests" className={currentPath === "/requests" ? "active" : ""} onClick={() => setIsMobileOpen(false)}>
              Requests
            </Link>
            <Link to="/settings" className={currentPath === "/settings" ? "active" : ""} onClick={() => setIsMobileOpen(false)}>
              Settings
            </Link>
            <Link to="/profile" className={currentPath === "/profile" ? "active" : ""} onClick={() => setIsMobileOpen(false)}>
              Profile
            </Link>
          </div>
        </div>

        <div className="nav-right">
          <Link to="/profile" className="nav-avatar" style={{ overflow: "hidden", textDecoration: "none" }}>
            {displayLogo ? (
              <img
                src={displayLogo}
                alt="BX"
                style={{ width: "100%", height: "100%", objectFit: "cover" }}
              />
            ) : (
              displayInitials
            )}
          </Link>
          <button className="mobile-menu-btn" onClick={toggleMobileMenu}>
            <img src={isMobileOpen ? closeMenuIcon : menuIcon} alt="Menu" />
          </button>
        </div>
      </div>
    </nav>
  );
}

export default DashboardNav;
