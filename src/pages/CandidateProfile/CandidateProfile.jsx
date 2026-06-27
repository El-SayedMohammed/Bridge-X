import { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import "./CandidateProfile.css";
import DashboardNav from "../../components/DashboardNav/DashboardNav";
import JobOfferOverlay from "../../components/JobOfferOverlay/JobOfferOverlay";
import { getProgrammerDetails } from "../../services/api";

import envelopeIcon from "../../assets/images/envelope-icon.svg";
import personIcon from "../../assets/images/person-icon.svg";
import briefcaseIcon from "../../assets/images/briefcase-icon.svg";


const EnvelopeIcon = () => <img src={envelopeIcon} alt="Send offer" />;
const PersonIcon = () => <img src={personIcon} alt="Summary" />;
const BriefcaseIcon = () => <img src={briefcaseIcon} alt="Projects" />;


const StarRating = ({ rating }) => (
  <div className="star-rating">
    {[1, 2, 3, 4, 5].map((star) => (
      <span key={star} className={`star ${star <= Math.floor(rating || 0) ? "filled" : "empty"}`}>
        ★
      </span>
    ))}
  </div>
);

const CandidateProfile = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { developerList, currentIndex: initialIndex } = location.state || {};

  const list = developerList?.length > 0 ? developerList : [];
  const [idx, setIdx] = useState(initialIndex ?? 0);
  const baseCurrent = list[Math.min(idx, Math.max(0, list.length - 1))];
  const [showOffer, setShowOffer] = useState(false);
  const [detailsCache, setDetailsCache] = useState({});

  useEffect(() => {
    if (baseCurrent && baseCurrent.id && !detailsCache[baseCurrent.id]) {
      getProgrammerDetails(baseCurrent.id).then(res => {
        const prog = res.programmer || (res.data && res.data.programmer) || res.data || res;
        setDetailsCache(prev => ({ ...prev, [baseCurrent.id]: prog }));
      }).catch(() => {});
    }
  }, [baseCurrent, detailsCache]);

  const handlePrev = () => setIdx((i) => Math.max(0, i - 1));
  const handleNext = () => setIdx((i) => Math.min(list.length - 1, i + 1));

  if (!baseCurrent) {
    return (
      <div className="candidate-profile-page" style={{ display: "flex", justifyContent: "center", alignItems: "center", minHeight: "100vh" }}>
        <p style={{ fontSize: "18px", color: "#64748B" }}>No candidate selected. Please select a candidate from the Dashboard.</p>
      </div>
    );
  }

  const fetchedDetails = detailsCache[baseCurrent.id] || {};
  const current = { ...baseCurrent, ...fetchedDetails };
  
  let avatarLink = current.avatar_url || current.avatar || current.user?.avatar_url || current.user?.avatar || null;
  if (avatarLink && !avatarLink.startsWith('http') && !avatarLink.startsWith('data:') && !avatarLink.startsWith('blob:')) {
    if (!avatarLink.startsWith('/')) {
      if (avatarLink.startsWith('storage/')) {
        avatarLink = '/' + avatarLink;
      } else if (avatarLink.startsWith('avatars/') || avatarLink.startsWith('images/') || avatarLink.startsWith('users/')) {
        avatarLink = '/storage/' + avatarLink;
      } else {
        avatarLink = '/storage/avatars/' + avatarLink;
      }
    } else if (!avatarLink.startsWith('/storage/')) {
      avatarLink = '/storage' + avatarLink;
    }
    avatarLink = `https://teamwork2-main-opmxfq.free.laravel.cloud${avatarLink}`;
  } else if (avatarLink && avatarLink.startsWith('http://localhost')) {
    avatarLink = avatarLink.replace(/^http:\/\/localhost(:\d+)?/, 'https://teamwork2-main-opmxfq.free.laravel.cloud');
  } else if (avatarLink && avatarLink.startsWith('http://')) {
    avatarLink = avatarLink.replace('http://', 'https://');
  }
  current.avatar_url = avatarLink;
  
  current.projects = [];



  if ('projects' in fetchedDetails) {
    if (Array.isArray(fetchedDetails.projects) && fetchedDetails.projects.length > 0) {
      current.projects = fetchedDetails.projects.map(p => ({
        title: p.title || p.name || p.project_name,
        desc: p.description || p.desc || p.details,
        meta: p.meta || p.role || p.tech_stack,
        stars: p.stars || p.rating,
        review: p.review || p.feedback,
        reviewer: p.reviewer || p.client_name,
        status: p.status || p.project_status,
        image: p.image || p.cover || p.thumbnail || p.image_url
      }));
    } else {
      current.projects = [];
    }
  }


  const handleSendOffer = (offerData) => {

    navigate("/requests", {
      state: { 
        offerSent: true, 
        candidateName: offerData.candidateName,
        pendingOffer: {
          title: offerData.title,
          description: offerData.description,
          salaryRange: offerData.salaryRange,
          jobType: offerData.jobType,
          workType: offerData.workType,
          programmerId: offerData.programmerId
        }
      },
    });
  };

  return (
    <div className="candidate-profile-page">
      <JobOfferOverlay
        isOpen={showOffer}
        onClose={() => setShowOffer(false)}
        developer={current}
        onSendOffer={handleSendOffer}
      />

      <div className="blur-orb blur-orb--tr" />
      <div className="blur-orb blur-orb--ml" />

      <DashboardNav />

      <div className="profile-content">
        <div className="nav-arrows">
          <button className="arrow-btn" aria-label="Previous developer" onClick={handlePrev} disabled={idx === 0}>
            &#8249;
          </button>
          <button className="arrow-btn" aria-label="Next developer" onClick={handleNext} disabled={idx >= list.length - 1}>
            &#8250;
          </button>
        </div>

        <div className="profile-header-card">
          <div className="developer-profile">
            <div className="avatar-section">
              <div className="avatar-circle" style={{ background: current.avatarBg, position: "relative", overflow: "hidden" }}>
                <span className="avatar-initials" style={{ position: "absolute", top: 0, left: 0, right: 0, bottom: 0, display: "flex", alignItems: "center", justifyContent: "center" }}>
                  {current.initials}
                </span>
                {(current.avatar_url || current.avatar) && (
                  <img 
                    src={current.avatar_url || current.avatar} 
                    alt="" 
                    style={{ position: "relative", zIndex: 1, width: '100%', height: '100%', borderRadius: '50%', objectFit: 'cover' }} 
                    onError={(e) => { e.target.style.display = 'none'; }}
                  />
                )}
              </div>
              <div className="tier-badge">{current.tier}</div>
            </div>
            <div className="developer-info">
              <h1 className="developer-name">{current.name}</h1>
              <p className="developer-title">{current.role || current.track}</p>
              <div className="developer-rating">
                <span className="rating-star">★</span>
                <span className="rating-score">{current.rating || current.stars}</span>
                {current.rating_label && <span className="rating-label">{current.rating_label}</span>}
              </div>
            </div>
          </div>
          <button className="contact-btn" onClick={() => setShowOffer(true)}>
            <EnvelopeIcon />
            Send Job Offer
          </button>
        </div>

        <div className="profile-layout">
          <div className="main-column">
            { (current.summary || current.bio) && (
              <div className="card">
                <div className="card-header">
                  <span className="card-icon"><PersonIcon /></span>
                  <h2 className="card-title">Professional Summary</h2>
                </div>
                <p className="summary-text">{current.summary || current.bio}</p>
              </div>
            )}

            <div className="card">
              <div className="card-header">
                <span className="card-icon"><BriefcaseIcon /></span>
                <h2 className="card-title">Recent Projects</h2>
              </div>
              {current.projects && current.projects.length > 0 ? (
                current.projects.map((project, i) => (
                  <div key={i} className={`project-item${i === 0 ? " project-item--first" : ""}`}>
                    <div className="project-layout">
                      <div className={`project-accent-bar${i > 0 ? " project-accent-bar--gray" : ""}`} />
                      <div className="project-body">
                        {(project.image || project.cover || project.thumbnail || project.image_url) && (
                          <img 
                            src={project.image || project.cover || project.thumbnail || project.image_url} 
                            alt={project.title || "Project Image"} 
                            style={{ width: "100%", maxHeight: "250px", objectFit: "cover", borderRadius: "8px", marginBottom: "12px" }}
                          />
                        )}
                        <h3 className="project-title">{project.title || project.name || project.project_name || ""}</h3>
                        {(project.meta || project.role || project.tech_stack) && (
                          <p className="project-meta">{project.meta || project.role || project.tech_stack}</p>
                        )}
                        <p className="project-desc">{project.description || project.desc || project.details || ""}</p>
                        
                        {(project.stars || project.rating || project.review || project.feedback) && (
                          <div className="project-review">
                            {(project.stars || project.rating) && <StarRating rating={project.stars || project.rating} />}
                            <p className="review-text">
                              {project.review || project.feedback || ""} 
                              {(project.reviewer || project.client_name) ? ` - ${project.reviewer || project.client_name}` : ""}
                            </p>
                          </div>
                        )}
                      </div>
                      {(project.status || project.project_status) && (
                        <span className="status-badge completed">{project.status || project.project_status}</span>
                      )}
                    </div>
                  </div>
                ))
              ) : (
                <p className="no-projects-text" style={{ color: "#8898aa", fontSize: "14px", fontStyle: "italic", marginTop: "16px", padding: "8px 0" }}>
                  No recent projects registered by the candidate yet.
                </p>
              )}
            </div>
          </div>

          <div className="sidebar-column">
            <div className="card card--frameworks">
              <h3 className="sidebar-card-title sidebar-card-title--frameworks">
                Frameworks &amp; Tools
              </h3>
              <div className="tools-grid">
                {(current.tools && current.tools.length > 0 ? current.tools : (current.skills || [])).map((tool) => (
                  <span key={tool} className="tool-tag">{tool}</span>
                ))}
              </div>
            </div>


          </div>
        </div>
      </div>
    </div>
  );
};

export default CandidateProfile;
