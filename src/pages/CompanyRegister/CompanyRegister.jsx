import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { completeCompanyProfile } from "../../services/api";
import "../Register/Register.css";
import "./CompanyRegister.css";
import { getSocialIconAndName } from "../../utils/socialIcons";
import imagePlaceholder from "../../assets/images/image-placeholder.svg";
import plusIcon from "../../assets/images/plus.svg";
import removeIcon from "../../assets/images/remove.svg";
import websiteIcon from "../../assets/images/website.svg";

const COUNTRY_OPTIONS = [
  "Egypt", "Saudi Arabia", "United Arab Emirates", "Qatar", "Kuwait",
  "Jordan", "Lebanon", "Oman", "Bahrain", "United States",
  "United Kingdom", "Germany", "Canada", "Australia",
];

const INDUSTRY_OPTIONS = [
  "Technology", "Software Development", "Web Development", "Mobile App Development",
  "Artificial Intelligence", "Data Science", "Cloud Computing",
  "Cybersecurity", "IT Consulting", "Game Development",
  "Blockchain", "E-commerce", "Fintech",
];

function CompanyRegister() {
  
  const regData = JSON.parse(localStorage.getItem("registrationData") || "{}");

  const [formData, setFormData] = useState({
    companyName: regData.username || "",
    email: regData.email || "",
    aboutCompany: "",
    location: "",
    country: "",
    phoneNumber: "",
    crNumber: "",
    industry: "",
    website: "",
    socialLinks: [],
  });
  const [logoPreview, setLogoPreview] = useState(null);
  const [logoFile, setLogoFile] = useState(null);
  const [currentLink, setCurrentLink] = useState("");
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [apiError, setApiError] = useState("");
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    if (errors[e.target.name]) setErrors({ ...errors, [e.target.name]: "" });
  };

  const addSocialLink = () => {
    if (currentLink.trim()) {
      setFormData({ ...formData, socialLinks: [...formData.socialLinks, currentLink.trim()] });
      setCurrentLink("");
    }
  };

  const removeSocialLink = (index) => {
    setFormData({ ...formData, socialLinks: formData.socialLinks.filter((_, i) => i !== index) });
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setLogoFile(file);
      const reader = new FileReader();
      reader.onloadend = () => setLogoPreview(reader.result);
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    let newErrors = {};

    if (!formData.companyName.trim()) newErrors.companyName = "Company name is required";
    if (!formData.aboutCompany.trim()) newErrors.aboutCompany = "Company description is required";
    if (!formData.location.trim()) newErrors.location = "Location is required";
    if (!formData.country) newErrors.country = "Country is required";
    if (!formData.phoneNumber.trim()) newErrors.phoneNumber = "Phone number is required";
    if (!formData.crNumber.trim()) {
      newErrors.crNumber = "CR number is required";
    }
    if (!formData.industry) newErrors.industry = "Industry is required";

    if (Object.keys(newErrors).length > 0) { setErrors(newErrors); return; }

    setLoading(true);
    setApiError("");

    try {
      await completeCompanyProfile({
        userId: regData.userId,
        companyName: formData.companyName, phone: formData.phoneNumber,
        about: formData.aboutCompany, country: formData.country,
        location: formData.location, crNumber: formData.crNumber,
        industry: formData.industry,
        links: formData.socialLinks.filter((link) => link.trim() !== ""),
        logo: logoFile,
      });

      localStorage.setItem("companyProfile", JSON.stringify({
        companyName: formData.companyName, email: formData.email,
        aboutCompany: formData.aboutCompany, location: formData.location,
        country: formData.country, phoneNumber: formData.phoneNumber,
        crNumber: formData.crNumber, industry: formData.industry,
        website: formData.website,
        socialLinks: formData.socialLinks.filter((link) => link.trim() !== ""),
        logo: logoPreview,
      }));
      navigate("/login");
    } catch (err) {
      setApiError(err.message || "Failed to create profile");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="company-reg-page">
      <div className="bg-blur top-left"></div>
      <div className="bg-blur bottom-right"></div>

      <nav className="top-nav">
        <div className="nav-container">
          <Link to="/" className="nav-brand" style={{ textDecoration: "none" }}>Bridge X</Link>
          <div className="nav-auth-link">
            <Link to="/login" style={{ fontWeight: 600, color: "#09468C" }}>Sign In</Link>
          </div>
        </div>
      </nav>

      <div className="company-header-section">
        <h1>Complete Company Profile</h1>
        <p>Help us set up your company profile.</p>
      </div>

      <form className="company-reg-card" onSubmit={handleSubmit} noValidate>
        <div className="section-header">
          <div className="section-bar blue"></div>
          <h2 className="section-title">Company Details</h2>
        </div>

        <div className="logo-upload-area">
          <input type="file" id="logo-upload" accept="image/png, image/jpeg, image/svg+xml" style={{ display: "none" }} onChange={handleImageChange} />
          <label htmlFor="logo-upload" className="logo-upload-box" style={{ cursor: "pointer", overflow: "hidden", padding: logoPreview ? "0" : "", display: "flex", justifyContent: "center", alignItems: "center" }}>
            {logoPreview ? (
              <img src={logoPreview} alt="Logo preview" style={{ width: "100%", height: "100%", objectFit: "contain" }} />
            ) : (
              <>
                <img src={imagePlaceholder} alt="upload" style={{ width: "40px", height: "40px" }} />
                <div className="logo-upload-badge">
                  <img src={plusIcon} alt="add" style={{ width: "10px", height: "10px" }} />
                </div>
              </>
            )}
          </label>
          <div className="logo-upload-text"><h4>Upload Company Logo</h4><p>PNG, JPG or SVG. Max 5MB.</p></div>
        </div>

        <div className="form-grid">
          <div className="form-field">
            <label>COMPANY NAME</label>
            <input type="text" name="companyName" placeholder="e.g. Bridge X" value={formData.companyName} onChange={handleChange} style={errors.companyName ? { borderColor: "#E33629" } : {}} />
            {errors.companyName && <span className="error-text">{errors.companyName}</span>}
          </div>
        </div>

        <div className="form-grid">
          <div className="form-field">
            <label>ABOUT COMPANY</label>
            <textarea name="aboutCompany" placeholder="Describe your company's mission and services..." value={formData.aboutCompany} onChange={handleChange} style={errors.aboutCompany ? { borderColor: "#E33629" } : {}} />
            {errors.aboutCompany && <span className="error-text">{errors.aboutCompany}</span>}
          </div>
        </div>

        <div className="form-grid two-col">
          <div className="form-field">
            <label>LOCATION (CITY)</label>
            <input type="text" name="location" placeholder="e.g. San Francisco" value={formData.location} onChange={handleChange} style={errors.location ? { borderColor: "#E33629" } : {}} />
            {errors.location && <span className="error-text">{errors.location}</span>}
          </div>
          <div className="form-field">
            <label>COUNTRY</label>
            <select name="country" value={formData.country} onChange={handleChange} style={errors.country ? { borderColor: "#E33629" } : {}}>
              <option value="" disabled>Select Country</option>
              {COUNTRY_OPTIONS.map((c) => <option key={c} value={c}>{c}</option>)}
            </select>
            {errors.country && <span className="error-text">{errors.country}</span>}
          </div>
        </div>

        <div className="form-grid two-col">
          <div className="form-field">
            <label>PHONE NUMBER</label>
            <input type="tel" name="phoneNumber" placeholder="+1 (555) 000-0000" value={formData.phoneNumber} onChange={handleChange} style={errors.phoneNumber ? { borderColor: "#E33629" } : {}} />
            {errors.phoneNumber && <span className="error-text">{errors.phoneNumber}</span>}
          </div>
          <div className="form-field">
            <label>CR NUMBER</label>
            <input type="text" name="crNumber" placeholder="e.g. 91330206MA2K1XXX1X" value={formData.crNumber} onChange={handleChange} style={errors.crNumber ? { borderColor: "#E33629" } : {}} />
            {errors.crNumber && <span className="error-text">{errors.crNumber}</span>}
          </div>
        </div>

        <div className="form-grid">
          <div className="form-field">
            <label>INDUSTRY</label>
            <select name="industry" value={formData.industry} onChange={handleChange} style={errors.industry ? { borderColor: "#E33629" } : {}}>
              <option value="" disabled>Select Industry</option>
              {INDUSTRY_OPTIONS.map((ind) => <option key={ind} value={ind}>{ind}</option>)}
            </select>
            {errors.industry && <span className="error-text">{errors.industry}</span>}
          </div>
        </div>

        <div className="form-section-divider"></div>

        <div className="section-header">
          <div className="section-bar orange"></div>
          <h2 className="section-title">Social Links</h2>
        </div>

        <div className="social-chips" style={{ display: "flex", flexWrap: "wrap", gap: "8px", marginBottom: formData.socialLinks.length > 0 ? "16px" : "0" }}>
          {formData.socialLinks.map((link, index) => {
            const { name, icon } = getSocialIconAndName(link);
            return (
              <div className="social-chip active" key={index} style={{ cursor: "default", display: "flex", alignItems: "center", gap: "6px" }}>
                {icon}<span>{name}</span>
                <button type="button" onClick={() => removeSocialLink(index)} style={{ background: "none", border: "none", padding: "0", display: "flex", color: "currentColor", cursor: "pointer", marginLeft: "4px" }}>
                  <img src={removeIcon} alt="remove" style={{ width: "10px", height: "10px" }} />
                </button>
              </div>
            );
          })}
        </div>

        <div className="social-input-wrapper" style={{ position: "relative" }}>
          <img src={websiteIcon} className="social-input-icon" alt="link" style={{ width: "20px", height: "10px" }} />
          <input type="url" placeholder="e.g. https://linkedin.com/in/company" value={currentLink} onChange={(e) => setCurrentLink(e.target.value)} onKeyDown={(e) => { if (e.key === "Enter") { e.preventDefault(); addSocialLink(); } }} />
        </div>

        <button type="button" className="add-link-btn" onClick={addSocialLink} style={{ marginBottom: "16px" }}>
          <div className="add-link-circle"><img src={plusIcon} alt="add" style={{ width: "10px", height: "10px" }} /></div>
          <span className="add-link-text">+ Add Another Link</span>
        </button>

        {apiError && (
          <div className="error-message" style={{ textAlign: "center", marginBottom: "16px", background: "#FEF2F2", padding: "12px", borderRadius: "8px" }}>{apiError}</div>
        )}

        <div className="card-actions">
          <button type="button" className="btn-back" onClick={() => navigate(-1)}>Back</button>
          <button type="submit" className="btn-create-profile" disabled={loading} style={{ opacity: loading ? 0.7 : 1 }}>{loading ? "Creating..." : "Create Profile"}</button>
        </div>
      </form>

      <footer className="auth-footer">
        <div className="footer-container">
          <div className="footer-brand">
            <span className="brand-name">Bridge X</span>
            <span className="copyright">© 2026 Bridge X. Engineered for collaboration.</span>
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

export default CompanyRegister;
