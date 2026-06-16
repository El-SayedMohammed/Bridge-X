import { useState, useEffect } from "react";
import { getCompanyProfile, updateCompanyProfile } from "../../services/api";
import "./Profile.css";
import { getSocialIconAndName } from "../../utils/socialIcons";
import DashboardNav from "../../components/DashboardNav/DashboardNav";
import locationIcon from "../../assets/images/location-icon.svg";
import linkIcon from "../../assets/images/link-icon.svg";
import removeIcon from "../../assets/images/remove-icon.svg";
import addIcon from "../../assets/images/add-icon.svg";

const DEFAULT_PROFILE = {
  companyName: "",
  email: "",
  aboutCompany: "",
  location: "",
  country: "",
  phoneNumber: "",
  crNumber: "",
  website: "",
  industry: "",
  socialLinks: [],
};

function getInitialProfile() {
  const saved = localStorage.getItem("companyProfile");
  if (saved) return { ...DEFAULT_PROFILE, ...JSON.parse(saved) };
  return DEFAULT_PROFILE;
}

function getInitials(name) {
  if (!name) return "BX";
  const words = name.split(" ");
  if (words.length >= 2) return (words[0][0] + words[1][0]).toUpperCase();
  return name.substring(0, 2).toUpperCase();
}

const COUNTRY_OPTIONS = [
  "Egypt", "Saudi Arabia", "United Arab Emirates", "Qatar", "Kuwait",
  "Jordan", "Lebanon", "Oman", "Bahrain", "United States",
  "United Kingdom", "Germany", "Canada", "Australia",
];

function Profile() {
  const [isEditing, setIsEditing] = useState(false);
  const [profileData, setProfileData] = useState(getInitialProfile);
  const [editData, setEditData] = useState({});
  const [saving, setSaving] = useState(false);
  const [saveError, setSaveError] = useState("");
  const [isAddingSocial, setIsAddingSocial] = useState(false);
  const [tempSocialLink, setTempSocialLink] = useState("");
  const [logoPreview, setLogoPreview] = useState(null);
  const [logoFile, setLogoFile] = useState(null);

  useEffect(() => {
    getCompanyProfile()
      .then((data) => {
        if (!data) return;
        const api = data.data || data;
        const mapped = {
          companyName: api.company_name || api.companyName || profileData.companyName,
          email: api.email || profileData.email,
          aboutCompany: api.about || api.aboutCompany || profileData.aboutCompany,
          location: api.location || profileData.location,
          country: api.country || profileData.country,
          phoneNumber: api.phone || api.phoneNumber || profileData.phoneNumber,
          crNumber: api.cr_number || api.crNumber || profileData.crNumber,
          website: api.website || profileData.website,
          industry: api.industry || profileData.industry,
          socialLinks: api.links || api.socialLinks || profileData.socialLinks,
          logo: api.logo || profileData.logo || null,
        };
        setProfileData(mapped);
        localStorage.setItem("companyProfile", JSON.stringify(mapped));
      })
      .catch(() => {});
    
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const startEdit = () => { setEditData({ ...profileData }); setLogoPreview(profileData.logo || null); setIsEditing(true); };
  const cancelEdit = () => { setIsEditing(false); setLogoFile(null); };

  const saveEdit = async () => {
    setSaving(true); setSaveError("");
    try {
      await updateCompanyProfile({ companyName: editData.companyName, phone: editData.phoneNumber, about: editData.aboutCompany, country: editData.country, location: editData.location, crNumber: editData.crNumber, industry: editData.industry, links: editData.socialLinks || [], logo: logoFile });
      const finalProfile = { ...editData, logo: logoPreview || profileData.logo };
      setProfileData(finalProfile);
      localStorage.setItem("companyProfile", JSON.stringify(finalProfile));
      setIsEditing(false);
    } catch (err) { setSaveError(err.message || "Failed to save changes"); }
    finally { setSaving(false); }
  };

  const handleEditChange = (e) => { setEditData({ ...editData, [e.target.name]: e.target.value }); };
  const initials = getInitials(profileData.companyName);

  const socialPresenceLinks = [];
  const websiteLinks = [];
  if (profileData.socialLinks && profileData.socialLinks.length > 0) {
    profileData.socialLinks.forEach((link) => {
      const { name, icon } = getSocialIconAndName(link);
      if (name === "Website") websiteLinks.push(link);
      else socialPresenceLinks.push({ link, name, icon });
    });
  }

  let finalWebsite = profileData.website;
  if (!finalWebsite || finalWebsite === "null" || String(finalWebsite).trim() === "") {
    finalWebsite = websiteLinks.length > 0 ? websiteLinks[0] : "";
  }
  const displayWebsite = String(finalWebsite || "").trim();
  const showWebsiteLink = displayWebsite.length > 0 && displayWebsite !== "null" && displayWebsite !== "http://" && displayWebsite !== "https://";

  return (
    <div className="profile-page">
      <div className="bg-container">
        <div className="bg-blur one"></div>
        <div className="bg-blur two"></div>
        <div className="bg-blur three"></div>
      </div>
      <DashboardNav logo={profileData.logo} initials={initials} />

      {!isEditing && (
        <div className="profile-card-view">
          <div className="view-content-container">
            <div className="view-header">
              <div className="view-avatar-bg">
                {profileData.logo ? (<img src={profileData.logo} alt="Logo" className="view-avatar-img" />) : (<div className="view-avatar-img">{initials}</div>)}
              </div>
              <div className="view-info-container">
                <h2>{profileData.companyName}</h2>
                <div className="view-location">
                  <img src={locationIcon} alt="Location" style={{ width: "9.33px", height: "11.67px" }} />
                  <span>{profileData.location}, {profileData.country}</span>
                  <div className="view-location-dot"></div>
                </div>
              </div>
              <button className="view-btn-edit" onClick={startEdit}>Edit Profile</button>
            </div>

            <div className="view-split-layout">
              <div className="view-about-section">
                <h3>About {profileData.companyName}</h3>
                {profileData.aboutCompany ? profileData.aboutCompany.split("\n\n").map((para, i) => <p key={i}>{para}</p>) : <p>No description provided yet.</p>}
              </div>

              <div className="view-bottom-row">
                <div className="view-social-section">
                  <h3>Social Presence</h3>
                  <div className="view-social-grid">
                    {socialPresenceLinks.length > 0 ? (
                      socialPresenceLinks.map(({ link, name, icon }, index) => (
                        <button className="view-social-btn" key={index} onClick={() => { window.open(link.startsWith("http") ? link : "https://" + link, "_blank"); }}>
                          <span style={{ display: "flex", width: "16.67px", height: "16.67px", color: "#0D3C98" }}>{icon}</span>
                          <span>{name}</span>
                        </button>
                      ))
                    ) : (<p style={{ margin: 0, color: "#434652" }}>No social links added yet.</p>)}
                  </div>
                </div>

                <div className="view-details-card">
                  <h3>Company Details</h3>
                  <div className="view-details-list">
                    <div className="view-detail-item"><p className="view-detail-label">PHONE NUMBER</p><p className="view-detail-value">{profileData.phoneNumber || "—"}</p></div>
                    <div className="view-detail-item"><p className="view-detail-label">CR NUMBER</p><p className="view-detail-value view-detail-value-large">{profileData.crNumber || "—"}</p></div>
                    <div className="view-detail-item">
                      <p className="view-detail-label">WEBSITE</p>
                      {showWebsiteLink ? (
                        <a href={displayWebsite.startsWith("http") ? displayWebsite : `https://${displayWebsite}`} target="_blank" rel="noreferrer" className="view-detail-link">{displayWebsite.replace(/^https?:\/\//, "")}</a>
                      ) : (<p className="view-detail-value">—</p>)}
                    </div>
                    <div className="view-detail-item"><p className="view-detail-label">HQ LOCATION</p><p className="view-detail-value view-detail-value-large">{profileData.location}, {profileData.country}</p></div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {isEditing && (
        <div className="profile-card-edit">
          <div className="edit-header"><h2>Company Profile</h2><p>Update your organization&apos;s public information and identity.</p></div>

          <div className="edit-form-container">
            <div className="edit-logo-upload">
              <input type="file" id="edit-logo-upload" accept="image/png, image/jpeg, image/svg+xml" style={{ display: "none" }} onChange={(e) => { const file = e.target.files[0]; if (file) { setLogoFile(file); const reader = new FileReader(); reader.onloadend = () => setLogoPreview(reader.result); reader.readAsDataURL(file); } }} />
              <div className="edit-logo-box">{logoPreview ? <img src={logoPreview} alt="Logo" /> : <div className="placeholder">{getInitials(editData.companyName)}</div>}</div>
              <div className="edit-logo-text"><h4>Company Logo</h4><p>PNG or JPG, max 5MB. 400x400px recommended.</p><label htmlFor="edit-logo-upload" className="edit-logo-btn">Upload New</label></div>
            </div>

            <div className="edit-grid-1">
              <div className="edit-field company-name"><label>COMPANY NAME</label><input type="text" name="companyName" value={editData.companyName || ""} onChange={handleEditChange} /></div>
              <div className="edit-field cr-number"><label>CR NUMBER</label><input type="text" name="crNumber" maxLength="10" value={editData.crNumber || ""} onChange={(e) => { const val = e.target.value.replace(/\D/g, "").slice(0, 10); setEditData({ ...editData, crNumber: val }); }} /></div>
            </div>

            <div className="edit-grid-about edit-field"><label>ABOUT COMPANY</label><textarea name="aboutCompany" value={editData.aboutCompany || ""} onChange={handleEditChange} /></div>

            <div className="edit-grid-2">
              <div className="edit-field country"><label>COUNTRY</label><select name="country" value={editData.country || ""} onChange={handleEditChange}>{COUNTRY_OPTIONS.map((c) => <option key={c} value={c}>{c}</option>)}</select></div>
              <div className="edit-field location"><label>LOCATION</label><input type="text" name="location" value={editData.location || ""} onChange={handleEditChange} /></div>
              <div className="edit-field phone"><label>PHONE NUMBER</label><input type="tel" name="phoneNumber" value={editData.phoneNumber || ""} onChange={handleEditChange} /></div>
              <div className="edit-field website"><label>WEBSITE</label><input type="url" name="website" value={editData.website || ""} onChange={handleEditChange} /></div>
            </div>

            <div className="edit-social-section">
              <h3>Social Presence</h3>
              <div className="edit-social-chips">
                {editData.socialLinks && editData.socialLinks.map((link, index) => (
                  <div className="edit-social-chip" key={index}>
                    <img src={linkIcon} alt="Link" /><span>{link}</span>
                    <button type="button" className="remove-btn" onClick={() => { const newLinks = editData.socialLinks.filter((_, i) => i !== index); setEditData({ ...editData, socialLinks: newLinks }); }}><img src={removeIcon} alt="Remove" /></button>
                  </div>
                ))}
                {isAddingSocial ? (
                  <input type="text" className="edit-add-link-input" autoFocus placeholder="Paste link here..." value={tempSocialLink} onChange={(e) => setTempSocialLink(e.target.value)} onKeyDown={(e) => { if (e.key === "Enter") { e.preventDefault(); if (tempSocialLink.trim()) { setEditData({ ...editData, socialLinks: [...(editData.socialLinks || []), tempSocialLink.trim()] }); setTempSocialLink(""); setIsAddingSocial(false); } } else if (e.key === "Escape") { setIsAddingSocial(false); setTempSocialLink(""); } }} onBlur={() => { if (!tempSocialLink.trim()) setIsAddingSocial(false); }} />
                ) : (
                  <button type="button" className="edit-add-link-btn" onClick={() => setIsAddingSocial(true)}><img src={addIcon} alt="Add" /><span>Add Link</span></button>
                )}
              </div>
            </div>
          </div>

          <div className="edit-footer-actions">
            <button type="button" className="edit-btn-discard" onClick={cancelEdit}>Discard Changes</button>
            <button type="button" className="edit-btn-save" onClick={saveEdit} disabled={saving} style={{ opacity: saving ? 0.7 : 1 }}>{saving ? "Saving..." : "Save Changes"}</button>
          </div>
          {saveError && <div style={{ position: "absolute", bottom: "30px", left: "91px", color: "#dc2626" }}>{saveError}</div>}
        </div>
      )}
    </div>
  );
}

export default Profile;
