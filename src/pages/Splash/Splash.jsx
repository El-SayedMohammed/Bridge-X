import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import logo from "../../assets/logo.svg";
import "./Splash.css";

function Splash() {
  const navigate = useNavigate();

  useEffect(() => {
    const timer = setTimeout(() => {
      navigate("/onboarding");
    }, 4000);

    return () => clearTimeout(timer);
  }, [navigate]);

  return (
    <div className="splash-container">
      <div className="splash-content">
        <div className="splash-logo-wrapper">
          <img src={logo} alt="Bridge X Logo" className="splash-logo" />
        </div>

        <h1 className="splash-title">Bridge X</h1>

        <p className="splash-tagline">
          Connect <span>•</span> Collaborate <span>•</span> Bridge
        </p>

        <div className="splash-footer">
          <div className="footer-line"></div>
          <span className="footer-code">&lt;/&gt;</span>
        </div>
      </div>
    </div>
  );
}

export default Splash;
