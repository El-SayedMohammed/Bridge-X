
import { useNavigate } from 'react-router-dom';
import './Landing.css';


import imgCodeBg from '../../assets/images/code-bg.svg';
import imgIllustration from '../../assets/images/integration-illustration.svg';
import imgDashboard from '../../assets/images/dashboard-preview.svg';
import iconBriefcase from '../../assets/images/icon-briefcase.svg';
import iconNodes from '../../assets/images/icon-nodes.svg';
import iconRocket from '../../assets/images/icon-rocket.svg';
import iconPeople from '../../assets/images/icon-people.svg';
import iconBuilding from '../../assets/images/icon-building.svg';
import iconCheck from '../../assets/images/icon-check.svg';
import iconDoc from '../../assets/images/icon-doc.svg';
import iconChart from '../../assets/images/icon-chart.svg';
import iconHandshake from '../../assets/images/icon-handshake.svg';
import iconShield from '../../assets/images/icon-shield.svg';
import iconCircleCheck from '../../assets/images/icon-circle-check.svg';
import iconRedX from '../../assets/images/icon-red-x.svg';
import iconClock from '../../assets/images/icon-clock.svg';
import logoSvg from '../../assets/logo.svg';
import iconSocialX from '../../assets/images/icon-social-x.svg';
import iconSocialShare from '../../assets/images/icon-social-share.svg';
import iconSocialGlobe from '../../assets/images/icon-social-globe.svg';

const Landing = () => {
  const navigate = useNavigate();

  return (
    <div className="landing-page">

      <nav className="navbar">
        <div className="nav-container">
          <div className="nav-logo">BridgeX</div>
          <div className="nav-links">
            <a href="#home" className="active">Home</a>
            <a href="#companies">For Companies</a>
            <a href="#how-it-works">How It Works</a>
            <a href="#features">Features</a>
            <a href="#pricing">Pricing</a>
          </div>
          <div className="nav-actions">
            <span className="login-link" style={{cursor: 'pointer'}} onClick={() => navigate('/splash')}>Log In</span>
            <button className="landing-btn-primary" onClick={() => navigate('/splash')}>Join BridgeX</button>
          </div>
        </div>
      </nav>


      <section id="home" className="hero-section">
        <div className="hero-glow"></div>
        <div className="hero-glow-2"></div>
        <div className="hero-container">
          <div className="hero-content">
            <h1><span className="hero-title-top">Where Talent Meets</span><br /><span className="text-muted-blue">Real Opportunities</span></h1>
            <p>
              BridgeX connects developers with companies through real-world projects, 
              mentorship, and meaningful collaboration. Build your career with impact.
            </p>
            <button className="landing-btn-primary btn-large" onClick={() => navigate('/splash')}>
              <img src={iconBuilding} alt="Company" className="btn-icon" /> Join as Company
            </button>
            <div className="trust-stats">
              <div className="stat-item">
                <div className="stat-icon purple-bg">
                  <img src={iconPeople} alt="Developers" />
                </div>
                <div className="stat-text">
                  <span className="stat-value">20K+</span>
                  <span className="stat-label">Developers</span>
                </div>
              </div>
              <div className="stat-item">
                <div className="stat-icon blue-bg">
                  <img src={iconBuilding} alt="Companies" />
                </div>
                <div className="stat-text">
                  <span className="stat-value">1.5K+</span>
                  <span className="stat-label">Companies</span>
                </div>
              </div>
              <div className="stat-item">
                <div className="stat-icon red-bg">
                  <img src={iconCheck} alt="Projects" />
                </div>
                <div className="stat-text">
                  <span className="stat-value">10K+</span>
                  <span className="stat-label">Projects Done</span>
                </div>
              </div>
            </div>
          </div>
          <div className="hero-visual">
             <img src={imgDashboard} alt="Dashboard Preview" className="dashboard-img" />
          </div>
        </div>
      </section>


      <div id="features" className="value-prop-wrapper">
        <section className="value-prop-section">
          <div className="value-prop-grid">
          <div className="vp-card dark-blue vp-has-image">
            <div className="vp-content">
              <h2>Verified Profiles Based<br/>on Output, Not Promises</h2>
              <p>Every engineer on BridgeX is manually vetted through live sandbox environments that mirror real-world production stress.</p>
            </div>
            <img src={imgCodeBg} alt="Code Verification" className="vp-bg-img" />
          </div>
          <div className="vp-card light-blue">
            <h2>Performance<br/>Insights</h2>
            <p>Deep analytics on problem-solving speed, code maintainability, and communication clarity.</p>
          </div>
          <div className="vp-card light-gray">
            <h2>AI Matching Engine</h2>
            <p>Matches candidates based on your specific tech stack and project architectural complexity.</p>
            <div className="tags">
              <span className="tag">React</span>
              <span className="tag">Node.js</span>
              <span className="tag">AWS</span>
              <span className="tag">Python</span>
              <span className="tag">Kubernetes</span>
            </div>
          </div>
          <div className="vp-card gradient-blue vp-has-image">
             <div className="vp-content">
               <h2>Seamless Integration</h2>
               <p>Bridge X connects directly with your existing HR tools and project management software.</p>
             </div>
             <img src={imgIllustration} alt="Seamless Integration" className="vp-bg-img-right" />
          </div>
        </div>
        </section>
      </div>


      <section id="how-it-works" className="steps-section">
        <div className="steps-header">
          <span className="badge">HOW IT WORKS</span>
          <h2>Precision Hiring in 6 Steps</h2>
          <p>We bypass the traditional interview fatigue by focusing on concrete output and verified delivery metrics.</p>
        </div>
        <div className="steps-grid">
          <div className="step-card">
            <div className="step-icon"><img src={iconDoc} alt="icon" /></div>
            <h3>Skill Assessment</h3>
            <p>Candidates undertake real-world coding projects tailored to your tech stack and business needs.</p>
            <span className="step-number">01</span>
          </div>
          <div className="step-card">
            <div className="step-icon"><img src={iconChart} alt="icon" /></div>
            <h3>Deep Performance Analysis</h3>
            <p>Our AI engine analyzes code quality, architecture, and efficiency to generate a comprehensive trust report.</p>
            <span className="step-number">02</span>
          </div>
          <div className="step-card">
            <div className="step-icon"><img src={iconHandshake} alt="icon" /></div>
            <h3>Direct Verified Match</h3>
            <p>Skip the first 5 interviews. Meet only the top 1% who have already proven they can do the job.</p>
            <span className="step-number">03</span>
          </div>
          <div className="step-card">
            <div className="step-icon"><img src={iconNodes} alt="icon" /></div>
            <h3>Smart Matching</h3>
            <p>AI-powered matching based on skills, performance, and team compatibility.</p>
            <span className="step-number">04</span>
          </div>
          <div className="step-card">
            <div className="step-icon"><img src={iconBriefcase} alt="icon" /></div>
            <h3>Real Experience</h3>
            <p>Developer profiles showcase real projects and verified collaboration history.</p>
            <span className="step-number">05</span>
          </div>
          <div className="step-card">
            <div className="step-icon"><img src={iconRocket} alt="icon" /></div>
            <h3>Faster Hiring</h3>
            <p>Hire qualified talent faster with trusted recommendations and insights.</p>
            <span className="step-number">06</span>
          </div>
        </div>
      </section>


      <section id="companies" className="comparison-section">
        <h2>Traditional vs Bridge X</h2>
        <div className="comparison-container">
          <div className="comparison-col old-way">
            <h3 className="bad-heading"><img src={iconClock} alt="Old Way" style={{marginRight: '12px'}} /> The Old Way</h3>
            <ul>
              <li><img src={iconRedX} alt="X" className="x-mark-img" style={{marginRight: '16px'}} /> Static resumes with unverified claims</li>
              <li><img src={iconRedX} alt="X" className="x-mark-img" style={{marginRight: '16px'}} /> 45-day average hiring cycle</li>
              <li><img src={iconRedX} alt="X" className="x-mark-img" style={{marginRight: '16px'}} /> Expensive technical screening rounds</li>
              <li><img src={iconRedX} alt="X" className="x-mark-img" style={{marginRight: '16px'}} /> 30% failure rate for new hires</li>
            </ul>
          </div>
          <div className="comparison-col bridge-way">
            <h3 className="good-heading"><img src={iconShield} alt="Bridge X Way" style={{marginRight: '12px'}} /> The Bridge X Way</h3>
            <ul>
              <li><img src={iconCircleCheck} alt="Check" className="check-mark-img" style={{marginRight: '16px'}} /> Data-backed project performance</li>
              <li><img src={iconCircleCheck} alt="Check" className="check-mark-img" style={{marginRight: '16px'}} /> 7-day average hiring cycle</li>
              <li><img src={iconCircleCheck} alt="Check" className="check-mark-img" style={{marginRight: '16px'}} /> Zero engineering time wasted on vetting</li>
              <li><img src={iconCircleCheck} alt="Check" className="check-mark-img" style={{marginRight: '16px'}} /> 95% hiring retention rate</li>
            </ul>
          </div>
        </div>
        <div className="comparison-logo">
          <img src={logoSvg} alt="BridgeX Compare" style={{opacity: 0.15, width: 60, marginTop: 40}} />
        </div>
      </section>


      <section id="pricing" className="cta-section">
        <div className="cta-container">
          <h2>Ready to build your<br/>dream team?</h2>
          <p>Join hundreds of high-growth companies hiring the top 1% of AI talent<br/>through performance-first vetting.</p>
          <button className="btn-secondary" onClick={() => navigate('/splash')}>Get Started</button>
        </div>
      </section>


      <footer className="footer landing-footer">
        <div className="landing-footer-container">
          <div className="footer-brand">
            <h3 style={{color: '#00244E', fontSize: '24px', fontWeight: 'bold', marginBottom: '16px'}}>BridgeX</h3>
            <p>Connecting talent with<br/>opportunity through real-world<br/>collaboration and skill building.</p>
            <div className="social-links" style={{marginTop: '24px'}}>
              <a href="#" className="social-icon" style={{color: '#1B1B1B', display: 'flex', alignItems: 'center', justifyContent: 'center'}}>
                <img src={iconSocialX} alt="X" style={{width: '20px', height: '20px'}} />
              </a>
              <a href="#" className="social-icon" style={{color: '#1B1B1B', display: 'flex', alignItems: 'center', justifyContent: 'center'}}>
                <img src={iconSocialShare} alt="Share" style={{width: '20px', height: '20px'}} />
              </a>
              <a href="#" className="social-icon" style={{color: '#1B1B1B', display: 'flex', alignItems: 'center', justifyContent: 'center'}}>
                <img src={iconSocialGlobe} alt="Website" style={{width: '20px', height: '20px'}} />
              </a>
            </div>
          </div>
          <div className="footer-links">
            <div className="link-group">
              <h4>Platform</h4>
              <a href="#">For Developers</a>
              <a href="#">For Companies</a>
              <a href="#">How It Works</a>
              <a href="#">Pricing</a>
            </div>
            <div className="link-group">
              <h4>Company</h4>
              <a href="#">About Us</a>
              <a href="#">Blog</a>
              <a href="#">Careers</a>
              <a href="#">Contact Us</a>
            </div>
            <div className="link-group">
              <h4>Resources</h4>
              <a href="#">Help Center</a>
              <a href="#">Privacy Policy</a>
              <a href="#">Terms of Service</a>
            </div>
          </div>
        </div>
        <div className="footer-bottom-wrapper" style={{width: '100%', borderTop: '1px solid #C3C6D2', display: 'flex', justifyContent: 'center'}}>
          <div className="footer-bottom" style={{width: '100%', maxWidth: '100%', display: 'flex', justifyContent: 'space-between', padding: '16px 40px', color: '#434750', fontSize: '14px', boxSizing: 'border-box'}}>
            <p style={{margin: 0}}>© 2025 BridgeX. All rights reserved.</p>
            <p style={{margin: 0}}>Built with precision for the tech ecosystem.</p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Landing;
