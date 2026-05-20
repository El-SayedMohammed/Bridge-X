import { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./Onboarding.css";

import networkStyle from "../../assets/images/step1.svg";
import engineBackground from "../../assets/images/step2.svg";
import profileMockup from "../../assets/images/step3.svg";

import iconGrid from "../../assets/images/icon-grid.svg";
import iconCheckLarge from "../../assets/images/icon-check-lg.svg";
import iconCheckSmall from "../../assets/images/icon-check-sm.svg";
import iconBulb from "../../assets/images/icon-bulb.svg";
import iconShield from "../../assets/images/icon-shield.svg";
import iconChat from "../../assets/images/icon-chat.svg";
import iconSecure from "../../assets/images/icon-secure.svg";
import arrowRightIcon from "../../assets/images/arrow-right.svg";

const steps = [
  {
    badge: "STEP 1 OF 3",
    title: "Find the Right Talent Faster",
    desc: "Discover skilled developers, designers, and collaborators based on real project experience — not just CVs.",
    features: [
      { icon: "grid", text: "Real project-based profiles" },
      { icon: "check", text: "Verified skills and contributions" },
      { icon: "bulb", text: "AI-powered talent discovery" },
    ],
  },
  {
    badge: "STEP 2 OF 3",
    title: "AI-Powered Matching",
    desc: "Our AI matches you with candidates based on skills, performance, and real project data.",
    features: [
      {
        icon: "check-sm",
        text: "Data-driven matching",
        sub: "Analyze 50+ vector points from project histories and code contributions.",
      },
      {
        icon: "check-sm",
        text: "Performance scores",
        sub: "Verified output quality metrics based on objective delivery benchmarks.",
      },
    ],
  },
  {
    badge: "STEP 3 OF 3",
    title: "Hire with Confidence",
    desc: "View verified profiles, project history, and feedback before reaching out.",
    features: [
      {
        icon: "lock",
        text: "Verified Project History",
        sub: "Every past engagement is authenticated by our team for accuracy.",
      },
      {
        icon: "chat",
        text: "Peer Feedback",
        sub: "Honest ratings and detailed reviews from previous project stakeholders.",
      },
      {
        icon: "shield",
        text: "Secure Collaboration",
        sub: "Smart contracts ensure payment only when project milestones are met.",
      },
    ],
  },
];

const ICON_MAP = {
  grid: iconGrid,
  check: iconCheckLarge,
  "check-sm": iconCheckSmall,
  bulb: iconBulb,
  shield: iconShield,
  chat: iconChat,
  lock: iconSecure,
};

function FeatureIcon({ type }) {
  const src = ICON_MAP[type];
  if (!src) return null;
  return <img src={src} alt={type} className="feature-icon-img" />;
}

function Onboarding() {
  const [step, setStep] = useState(0);
  const navigate = useNavigate();

  const illustrations = [networkStyle, engineBackground, profileMockup];

  const handleNext = () => {
    if (step < 2) {
      setStep(step + 1);
    } else {
      navigate("/login");
    }
  };

  const handleSkip = () => {
    navigate("/login");
  };

  const current = steps[step];

  return (
    <div className={`onboarding step-${step}`}>
      <div className="onboarding-container">
        <div className="onboarding-left">
          <span className="step-badge">{current.badge}</span>

          <div className="left-content">
            <h1 className="onboarding-title">{current.title}</h1>
            <p className="onboarding-desc">{current.desc}</p>
          </div>

          <div className="features-list">
            {current.features.map((f, i) => (
              <div className="feature-item" key={i}>
                <div
                  className={`feature-icon-wrap ${step === 0 ? "icon-square" : "icon-round"}`}
                >
                  <FeatureIcon type={f.icon} />
                </div>
                <div className="feature-text">
                  <span className="feature-label">{f.text}</span>
                  {f.sub && <span className="feature-sub">{f.sub}</span>}
                </div>
              </div>
            ))}
          </div>

          <div className="onboarding-actions">
            <button className="btn-next" onClick={handleNext}>
              <span>Next</span>
              <img src={arrowRightIcon} alt="Next" />
            </button>
            <button className="btn-skip" onClick={handleSkip}>
              Skip
            </button>
          </div>
        </div>

        <div className="onboarding-right">
          <div className="illustration-wrapper">
            <img
              src={illustrations[step]}
              alt={`Step ${step + 1}`}
              className="illustration-main"
            />
          </div>
        </div>
      </div>
    </div>
  );
}

export default Onboarding;
