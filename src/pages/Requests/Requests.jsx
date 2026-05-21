/* eslint-disable react-hooks/set-state-in-effect */

import { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import DashboardNav from "../../components/DashboardNav/DashboardNav";
import { getJobOffers, sendJobOffer } from "../../services/api";
import "./Requests.css";

import checkIcon from "../../assets/images/check-icon.svg";

const Requests = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [showSuccessToast, setShowSuccessToast] = useState(false);
  const [successCandidate, setSuccessCandidate] = useState("");

  const [candidates, setCandidates] = useState([]);
  const [page, setPage] = useState(1);
  const [hasNextPage, setHasNextPage] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [refreshTrigger, setRefreshTrigger] = useState(0);
  const [newOfferId, setNewOfferId] = useState(null);


  useEffect(() => {
    let cancelled = false;
    setLoading(true);
    setError(null);

    const loadPageOffers = async () => {
      try {
        const res = await getJobOffers(page);
        if (cancelled) return;

        const list = res?.jopOffers || res?.jop_offers || res?.jobOffers || res?.job_offers || res?.data || res || [];
        const offers = Array.isArray(list) ? list : [];


        setHasNextPage(offers.length > 0);

        const mapped = offers.map((offer) => {
          if (!offer || typeof offer !== "object") return null;
          const programmer = offer.programmer || {};
          const name = String(
            programmer.user_name || 
            programmer.user?.full_name || 
            programmer.user?.name || 
            programmer.full_name || 
            programmer.name || 
            offer.programmer_name || 
            "Unknown Candidate"
          );
          const nameParts = name.split(" ").filter(Boolean);
          const initials = nameParts.length > 1 
            ? `${nameParts[0][0]}${nameParts[1][0]}`.toUpperCase()
            : name.substring(0, 2).toUpperCase();

          let skillsArr = [];
          if (Array.isArray(programmer.skills)) {
            skillsArr = programmer.skills;
          } else if (typeof programmer.skills === "string") {
            try {
              skillsArr = JSON.parse(programmer.skills);
            } catch {
              skillsArr = [programmer.skills];
            }
          }
          if ((!skillsArr || skillsArr.length === 0) && Array.isArray(programmer.programmer_skills)) {
            skillsArr = programmer.programmer_skills;
          }
          if (!skillsArr || skillsArr.length === 0) {
            skillsArr = ["General"];
          }
          const finalSkills = skillsArr.map(s => typeof s === "object" ? s?.name || "Skill" : String(s)).slice(0, 3);

          return {
            id: offer.id,
            programmer_id: programmer.id || offer.programmer_id,
            name: name,
            role: programmer.tracks || programmer.track || programmer.role || "Developer",
            initials,
            avatarBg: "linear-gradient(135deg, #38bdf8, #6366f1)", 
            skills: finalSkills,
            jobOffer: offer.title || "Job Offer",
            jobType: (offer.job_type || "FULL-TIME").toUpperCase(),
            salaryMin: offer.salary_range || "—",
            salaryMax: offer.work_type || "Remote", 
          };
        }).filter(Boolean);

        setCandidates(mapped);
        setLoading(false);
      } catch (err) {
        if (!cancelled) {

          setError(err.message || "Failed to fetch job offers");
          setLoading(false);
        }
      }
    };

    loadPageOffers();

    return () => { cancelled = true; };
  }, [page, refreshTrigger]);


  useEffect(() => {
    if (location.state?.pendingOffer) {
      const offer = location.state.pendingOffer;
      const sentLockKey = `sent_lock_${offer.programmerId}_${offer.title}`;

      if (sessionStorage.getItem(sentLockKey)) {
        window.history.replaceState({}, document.title);
        return;
      }

      const sendOfferBackground = async () => {
        try {
          sessionStorage.setItem(sentLockKey, "true");
          const res = await sendJobOffer(offer);
          
          setSuccessCandidate(location.state.candidateName || "");
          setShowSuccessToast(true);
          
          const newId = res?.jopOffer?.id || res?.jop_offer?.id || res?.jobOffer?.id || res?.job_offer?.id || res?.data?.id || res?.id;
          if (newId) {
            setNewOfferId(Number(newId));
            setTimeout(() => {
              setNewOfferId(null);
            }, 8000);
          }

          setTimeout(() => {
            setShowSuccessToast(false);
          }, 4000);

          window.history.replaceState({}, document.title);
          setRefreshTrigger((prev) => prev + 1);
        } catch (err) {
          setError(err.message || "Failed to send job offer");
          window.history.replaceState({}, document.title);
        }
      };

      sendOfferBackground();
    }
  }, [location.state]);

  const handlePrev = () => setPage((p) => Math.max(1, p - 1));
  const handleNext = () => setPage((p) => (hasNextPage ? p + 1 : p));

  const handleViewProfile = (c) => {
    const initials = c.initials || c.name.split(" ").map((n) => n[0]).join("").toUpperCase();
    const devObj = {
      id: c.programmer_id || c.id,
      name: c.name,
      role: c.role,
      initials,
      avatarBg: c.avatarBg || "linear-gradient(135deg, #38bdf8, #6366f1)",
      tier: "SENIOR • GOLD",
      rating: 0,
      summary: "",
      projects: [],
      tools: c.skills || ["General"],
      completedTasks: 0,
      completionRate: 100,
    };
    navigate("/candidate-profile", {
      state: { developerList: [devObj], currentIndex: 0 },
    });
  };

  return (
    <div className="or-page">
      <DashboardNav />

      <div className="or-content">
        <div className="or-header-row" style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "32px", flexWrap: "wrap", gap: "16px" }}>
          <h1 className="or-page-title" style={{ marginBottom: 0 }}>Offer Requests</h1>
        </div>

        {error && (
          <div className="or-error-banner" style={{ background: "#FEF2F2", color: "#DC2626", padding: "16px", borderRadius: "8px", marginBottom: "24px", border: "1px solid #FCA5A5" }}>
            <strong>Error loading sent offers:</strong> {error}
            <br/>
            <small>Please check if you are logged in or if the backend server is running correctly.</small>
          </div>
        )}

        <div className="or-layout">
          <div className="or-table-wrapper">
            <div className="or-table-header">
              <div className="or-col-candidate">Candidate</div>
              <div className="or-col-skills">Skills</div>
              <div className="or-col-offer">Job Offer</div>
              <div className="or-col-salary">Salary</div>
            </div>

            <div className={`or-table-body${loading ? " or-table-body--loading" : ""}`}>
              {candidates.map((c, i) => {
                const isNew = c.id === newOfferId;
                return (
                  <div
                    key={c.id}
                    className={`or-row${i < candidates.length - 1 ? " or-row--bordered" : ""}${isNew ? " or-row--new" : ""}`}
                  >
                    <div className="or-col-candidate" onClick={() => handleViewProfile(c)}>
                      <div className="or-avatar" style={{ background: c.avatarBg }}>
                        {c.initials}
                      </div>
                      <div className="or-candidate-info">
                        <span className="or-candidate-name">
                          {c.name}
                          {isNew && <span className="or-new-badge">NEW</span>}
                        </span>
                        <span className="or-candidate-role">{c.role}</span>
                      </div>
                    </div>

                    <div className="or-col-skills">
                      {c.skills.map((s) => (
                        <span key={s} className="or-skill-tag">{s}</span>
                      ))}
                    </div>

                    <div className="or-col-offer">
                      <span className="or-job-title">{c.jobOffer}</span>
                      <span className="or-job-type">{c.jobType}</span>
                    </div>

                    <div className="or-col-salary">
                      <span>{c.salaryMin}</span>
                      <span className="or-salary-sep">-</span>
                      <span>{c.salaryMax}</span>
                    </div>
                  </div>
                );
              })}
              
              {!loading && candidates.length === 0 && (
                <div style={{ textAlign: "center", padding: "40px 20px", color: "#64748B", fontSize: "15px" }}>
                  No offer requests found.
                </div>
              )}
            </div>

            {(page > 1 || hasNextPage) && (
              <div className="or-pagination">
                <span className="or-pagination-info">
                  Page {page}
                </span>
                <div className="or-pagination-btns">
                  <button className="or-page-btn" onClick={handlePrev} disabled={page === 1 || loading}>
                    Previous
                  </button>
                  <button className="or-page-btn" onClick={handleNext} disabled={!hasNextPage || loading}>
                    Next
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {showSuccessToast && (
        <div className="or-toast">
          <div className="or-toast-icon">
            <img src={checkIcon} alt="Success" style={{ width: 20, height: 20 }} />
          </div>
          <div className="or-toast-content">
            <h4 className="or-toast-title">Offer Sent Successfully!</h4>
            <p className="or-toast-desc">
              Your job offer has been delivered to {successCandidate}.
            </p>
          </div>
          <button
            className="or-toast-close"
            onClick={() => setShowSuccessToast(false)}
            aria-label="Close success message"
          >
            &times;
          </button>
        </div>
      )}
    </div>
  );
};

export default Requests;
