import { useState } from "react";
import "./JobOfferOverlay.css";
import closeIcon from "../../assets/images/close-icon.svg";

const CloseIcon = () => <img src={closeIcon} alt="Close" />;

const JOB_TYPES = ["Full-time", "Part-time", "Freelance"];
const WORK_TYPES = ["Remote", "On-site", "Hybrid"];

const JobOfferOverlay = ({ isOpen, onClose, developer, onSendOffer }) => {
  const [jobType, setJobType] = useState("Full-time");
  const [workType, setWorkType] = useState("Remote");
  const [jobTitle, setJobTitle] = useState("");
  const [salaryRange, setSalaryRange] = useState("");
  const [message, setMessage] = useState("");

  const getCompanyName = () => {
    try {
      const saved = localStorage.getItem("companyProfile");
      if (saved) {
        const parsed = JSON.parse(saved);
        if (parsed.companyName) return parsed.companyName;
      }
    } catch {}
    return "Bridge X Solutions";
  };

  const companyName = getCompanyName();

  if (!isOpen) return null;

  const handleBackdropClick = (e) => {
    if (e.target === e.currentTarget) onClose();
  };

  const handleSend = () => {
    if (!jobTitle.trim()) return;

    onSendOffer?.({
      title: jobTitle.trim(),
      description: message.trim() || `Offer for ${developer?.name ?? "developer"}`,
      salaryRange: salaryRange.trim() || "N/A",
      jobType: jobType.toLowerCase(),
      workType: workType.toLowerCase(),
      programmerId: developer?.id,
      candidateName: developer?.name ?? "Unknown"
    });

    setJobTitle("");
    setSalaryRange("");
    setMessage("");
    setJobType("Full-time");
    setWorkType("Remote");
    onClose();
  };

  return (
    <div className="joo-backdrop" onClick={handleBackdropClick}>
      <div className="joo-modal" role="dialog" aria-modal="true" aria-labelledby="joo-title">
        <div className="joo-header">
          <h2 className="joo-title" id="joo-title">Send Job Offer</h2>
          <button className="joo-close" onClick={onClose} aria-label="Close">
            <CloseIcon />
          </button>
        </div>

        <div className="joo-form">
          <div className="joo-row">
            <div className="joo-field">
              <label className="joo-label">Job Title</label>
              <input
                type="text"
                className="joo-input"
                placeholder="e.g. Senior Product Designer"
                value={jobTitle}
                onChange={(e) => setJobTitle(e.target.value)}
              />
            </div>
            <div className="joo-field">
              <label className="joo-label">Company Name</label>
              <input
                type="text"
                className="joo-input joo-input--prefilled"
                value={companyName}
                readOnly
              />
            </div>
          </div>

          <div className="joo-row">
            <div className="joo-field">
              <label className="joo-label">Job Type</label>
              <div className="joo-toggle-group">
                {JOB_TYPES.map((type) => (
                  <button
                    key={type}
                    className={`joo-toggle-btn ${jobType === type ? "joo-toggle-btn--active" : ""}`}
                    onClick={() => setJobType(type)}
                    type="button"
                  >
                    {type}
                  </button>
                ))}
              </div>
            </div>
            <div className="joo-field">
              <label className="joo-label">Salary Range</label>
              <input
                type="text"
                className="joo-input"
                placeholder="e.g. $120k - $150k"
                value={salaryRange}
                onChange={(e) => setSalaryRange(e.target.value)}
              />
            </div>
          </div>

          <div className="joo-field">
            <label className="joo-label">Work Type</label>
            <div className="joo-toggle-group joo-toggle-group--work">
              {WORK_TYPES.map((type) => (
                <button
                  key={type}
                  className={`joo-toggle-btn ${workType === type ? "joo-toggle-btn--active" : ""}`}
                  onClick={() => setWorkType(type)}
                  type="button"
                >
                  {type}
                </button>
              ))}
            </div>
          </div>

          <div className="joo-field">
            <label className="joo-label">Offer Message / Description</label>
            <textarea
              className="joo-textarea"
              placeholder="Introduce the role and why they are a great fit..."
              value={message}
              onChange={(e) => setMessage(e.target.value)}
            />
          </div>

          <div className="joo-footer">
            <button className="joo-btn-cancel" onClick={onClose} type="button">
              Cancel
            </button>
            <button
              className="joo-btn-send"
              type="button"
              onClick={handleSend}
              disabled={!jobTitle.trim()}
            >
              Send Offer
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default JobOfferOverlay;
