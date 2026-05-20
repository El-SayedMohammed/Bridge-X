/* eslint-disable react-hooks/set-state-in-effect */

import { useState, useMemo, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import DashboardNav from "../../components/DashboardNav/DashboardNav";
import { getProgrammers } from "../../services/api";
import "./Dashboard.css";

import searchIcon from "../../assets/images/search-icon.svg";
import chevronDownIcon from "../../assets/images/chevron-down-icon.svg";
import closeIcon from "../../assets/images/close-icon.svg";
import starIcon from "../../assets/images/star-icon.svg";
import prevIcon from "../../assets/images/prev-icon.svg";
import nextIcon from "../../assets/images/next-icon.svg";

const SearchIcon = () => <img src={searchIcon} alt="Search" />;
const ChevronDownIcon = () => <img src={chevronDownIcon} alt="Toggle" />;
const CloseIcon = () => <img src={closeIcon} alt="Remove" />;
const StarIcon = () => <img src={starIcon} alt="Rating" />;
const PrevIcon = () => <img src={prevIcon} alt="Previous" />;
const NextIcon = () => <img src={nextIcon} alt="Next" />;



const AVATAR_GRADIENTS = [
  "linear-gradient(135deg,#38bdf8,#6366f1)",
  "linear-gradient(135deg,#f9a8d4,#f472b6)",
  "linear-gradient(135deg,#64748b,#334155)",
  "linear-gradient(135deg,#34d399,#059669)",
  "linear-gradient(135deg,#f97316,#c2410c)",
  "linear-gradient(135deg,#8b5cf6,#6d28d9)",
];

const ITEMS_PER_PAGE = 6;


const fetchDevelopers = async (params) => {
  try {
    const { page, search, category, skill: filterSkill, level, rating } = params;

    const track = category !== "All" ? category : undefined;
    const experienceLevel = level !== "All" ? level.toLowerCase() : undefined;
    const stars = rating !== "All" ? rating : undefined;

    const searchQuery = search ? search.trim() : "";
    const skill = filterSkill && filterSkill !== "All" ? filterSkill : undefined;

    const response = await getProgrammers({ page, track, skill, stars, experienceLevel });
    const list = response?.programmers || response?.data?.data || response?.data || [];
    const totalCount = response?.pagination?.meta?.total || response?.total || list.length;

    let developers = list.map((dev, i) => {
      const name = dev.full_name || dev.name || `User ${dev.id || i}`;
      const nameParts = name.split(" ").filter(Boolean);
      const initials = nameParts.length > 1 
        ? `${nameParts[0][0]}${nameParts[1][0]}`.toUpperCase()
        : name.substring(0, 2).toUpperCase();
        
      const poolIdx = (dev.id || i) % AVATAR_GRADIENTS.length;

      let skillsArr = [];
      if (Array.isArray(dev.skills)) {
        skillsArr = dev.skills;
      } else if (typeof dev.skills === "string") {
        try {
          skillsArr = JSON.parse(dev.skills);
        } catch {
          skillsArr = [dev.skills];
        }
      }
      if ((!skillsArr || skillsArr.length === 0) && Array.isArray(dev.programmer_skills)) {
        skillsArr = dev.programmer_skills;
      }
      if (!skillsArr || skillsArr.length === 0) {
        skillsArr = ["General"];
      }
      const finalSkills = skillsArr.map(s => typeof s === "object" ? s?.name || "Skill" : String(s));

      const rawLevel = String(dev.experience_level !== null && dev.experience_level !== undefined ? dev.experience_level : (dev.level !== null && dev.level !== undefined ? dev.level : "Junior"));
      const levelVal = rawLevel.length > 0 ? (rawLevel.charAt(0).toUpperCase() + rawLevel.slice(1).toLowerCase()) : "Junior";

      return {
        ...dev, 
        id: dev.id,
        name: name,
        initials: initials,
        avatarBg: AVATAR_GRADIENTS[poolIdx],
        role: dev.tracks || dev.track || dev.role || "Developer",
        category: dev.category || dev.tracks || dev.track || "Development",
        skills: finalSkills.slice(0, 3),
        allSkills: finalSkills,
        rating: (dev.stars !== null && dev.stars !== undefined && dev.stars !== "") ? Number(dev.stars) : ((dev.rating !== null && dev.rating !== undefined && dev.rating !== "") ? Number(dev.rating) : 0),
        level: levelVal,
        bio: dev.bio || dev.about || "",
        summary: dev.summary || dev.bio || dev.about || "",
        projects: (() => {
          const rawProjects = dev.projects || dev.portfolios || dev.portfolio || [];
          if (!Array.isArray(rawProjects)) return [];
          return rawProjects.map(p => ({
            title: p.title || p.name || p.project_name || p.projectName || "Untitled Project",
            desc: p.desc || p.description || p.details || p.about || "No description provided.",
            meta: p.meta || p.role || p.tech_stack || p.techStack || p.category || "Project",
            stars: p.stars || p.rating || 5,
            review: p.review || p.feedback || "",
            reviewer: p.reviewer || p.client_name || p.clientName || "",
            status: p.status || "Completed"
          }));
        })(),
        tools: dev.tools && dev.tools.length > 0 ? dev.tools : finalSkills.slice(0, 3),
        completedTasks: dev.completedTasks || dev.completed_tasks || 0,
        completionRate: dev.completionRate || dev.completion_rate || 100,
        tier: rawLevel.toUpperCase()
      };
    });


    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      developers = developers.filter(dev => 
        dev.name.toLowerCase().includes(q) || 
        dev.allSkills.some(s => s.toLowerCase().includes(q)) ||
        dev.role.toLowerCase().includes(q) ||
        dev.category.toLowerCase().includes(q)
      );
    }

    const totalPagesFromBackend = response?.pagination?.last_page || response?.meta?.last_page || response?.last_page || response?.lastPage || Math.ceil(totalCount / (response?.per_page || response?.meta?.per_page || 10));

    return { 
      developers, 
      totalPages: totalPagesFromBackend || 1,
      hasNextPage: developers.length > 0, 
      error: null 
    };
  } catch (error) {

    return { developers: [], total: 0, error: error.message || "Failed to fetch developers" };
  }
};

const FilterDropdown = ({ label, options, selected, onSelect }) => {
  const [open, setOpen] = useState(false);
  const displayed = selected === "All" ? label : selected;

  return (
    <div className="db-dropdown">
      <button className="db-dropdown-btn" onClick={() => setOpen((o) => !o)}>
        {displayed}
        <ChevronDownIcon />
      </button>
      {open && (
        <div className="db-dropdown-menu">
          {options.map((opt) => (
            <div
              key={opt}
              className={`db-dropdown-item ${selected === opt ? "active" : ""}`}
              onClick={() => { onSelect(opt); setOpen(false); }}
            >
              {opt}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

const Pagination = ({ page, totalPages, onChange }) => {
  const pages = [];
  if (totalPages <= 7) {
    for (let i = 1; i <= totalPages; i++) pages.push(i);
  } else {
    pages.push(1, 2, 3);
    if (page > 4) pages.push("…");
    if (page > 3 && page < totalPages - 2) pages.push(page);
    if (page < totalPages - 3) pages.push("…");
    pages.push(totalPages);
  }

  return (
    <div className="db-pagination">
      <button className="db-page-arrow" onClick={() => onChange(Math.max(1, page - 1))} disabled={page === 1}>
        <PrevIcon />
      </button>
      {pages.map((p, i) =>
        p === "…" ? (
          <span key={`ellipsis-${i}`} className="db-page-ellipsis">…</span>
        ) : (
          <button key={p} className={`db-page-btn ${page === p ? "active" : ""}`} onClick={() => onChange(p)}>
            {p}
          </button>
        ),
      )}
      <button className="db-page-arrow" onClick={() => onChange(Math.min(totalPages, page + 1))} disabled={page >= totalPages}>
        <NextIcon />
      </button>
    </div>
  );
};

const DashboardPage = () => {
  const navigate = useNavigate();
  const [developers, setDevelopers] = useState([]);
  const [totalPages, setTotalPages] = useState(1);
  const [hasNextPage, setHasNextPage] = useState(false);
  const [loading, setLoading]       = useState(false);
  const [error, setError]           = useState(null);
  const [page, setPage]             = useState(1);
  const [search, setSearch]         = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [filters, setFilters]       = useState({ category: "All", skill: "All", level: "All", rating: "All" });

  const activeChips = useMemo(
    () => Object.entries(filters).filter(([, v]) => v !== "All").map(([k, v]) => ({ key: k, value: v })),
    [filters],
  );


  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(search);
    }, 150);
    return () => clearTimeout(timer);
  }, [search]);


  useEffect(() => {
    let cancelled = false;
    setLoading(true);
    setError(null);

    fetchDevelopers({ page, search: debouncedSearch, ...filters }).then((data) => {
      if (!cancelled) {
        setDevelopers(data.developers);
        setTotalPages(data.totalPages || 1);
        setHasNextPage(data.hasNextPage);
        if (data.error) setError(data.error);
        setLoading(false);
      }
    });

    return () => {
      cancelled = true;
    };
  }, [page, debouncedSearch, filters]);

  const handleSearch = (e) => { setSearch(e.target.value); setPage(1); };
  const handleFilter = (key, value) => { setFilters((f) => ({ ...f, [key]: value })); setPage(1); };
  const removeChip   = (key) => handleFilter(key, "All");
  const clearAll     = () => { setFilters({ category: "All", skill: "All", level: "All", rating: "All" }); setPage(1); };

  const handleViewProfile = (dev) => {
    const globalIdx = developers.findIndex((d) => d.id === dev.id);
    navigate("/candidate-profile", { state: { developerList: developers, currentIndex: globalIdx } });
  };

  return (
    <div className="db-page">
      <DashboardNav />

      <div className="db-main">
        {error && (
          <div className="db-error-banner" style={{ background: "#FEF2F2", color: "#DC2626", padding: "16px", borderRadius: "8px", margin: "0 24px 24px 24px", border: "1px solid #FCA5A5", zIndex: 10, position: "relative" }}>
            <strong>Error loading developers:</strong> {error}
            <br/>
            <small>If you see "Unauthenticated", please Log Out and Log In again from the Settings or /login page.</small>
          </div>
        )}

        <div className="db-hero">
          <div className="db-hero-blur-tr" />
          <div className="db-hero-blur-bl" />
          <div className="db-hero-content">
            <h1 className="db-hero-title">Find the right talent for your team</h1>
            <p className="db-hero-subtitle">
              Search developers based on skills, experience, and performance
              across our curated network of global experts.
            </p>
          </div>
        </div>

        <div className="db-search-section">
          <div className="db-search-wrapper">
            <span className="db-search-icon"><SearchIcon /></span>
            <input
              className="db-search-input"
              type="text"
              placeholder="Search by name or skill (React, Vue, Node...)"
              value={search}
              onChange={handleSearch}
            />
          </div>

          <div className="db-filter-bar">
            <span className="db-filter-label">Filters:</span>
            <FilterDropdown label="Track" options={["All", "Frontend Developer", "Backend Developer", "Full Stack Developer", "Mobile Developer", "UI/UX Designer", "DevOps Engineer", "Data Scientist", "Cyber Security Specialist", "AI / ML Engineer", "QA Engineer", "Game Developer"]} selected={filters.category} onSelect={(v) => handleFilter("category", v)} />
            <FilterDropdown label="Level" options={["All", "Beginner", "Junior", "Senior"]} selected={filters.level} onSelect={(v) => handleFilter("level", v)} />
            <FilterDropdown label="Rating" options={["All", "1", "2", "3", "4", "5"]} selected={filters.rating} onSelect={(v) => handleFilter("rating", v)} />

            {activeChips.length > 0 && (
              <>
                <div className="db-filter-divider" />
                <div className="db-chips">
                  {activeChips.map((chip) => (
                    <span key={chip.key} className="db-chip">
                      {chip.value}
                      <button className="db-chip-remove" onClick={() => removeChip(chip.key)} aria-label="Remove filter">
                        <CloseIcon />
                      </button>
                    </span>
                  ))}
                  <button className="db-clear-all" onClick={clearAll}>Clear all</button>
                </div>
              </>
            )}
          </div>
        </div>

        <div className={`db-grid ${loading ? "db-grid--loading" : ""}`}>
          {developers.map((dev, index) => (
            <div key={dev.id} className="db-card" style={{ animationDelay: `${0.17 + index * 0.055}s` }}>
              <div className="db-card-header">
                <div className="db-card-identity">
                  <div className="db-card-avatar" style={{ background: dev.avatarBg }}>
                    {dev.initials}
                  </div>
                  <div>
                    <h3 className="db-card-name">{dev.name}</h3>
                    <p className="db-card-role">{dev.role}</p>
                  </div>
                </div>
                <div className="db-rating-badge">
                  <StarIcon />
                  <span>{dev.rating}</span>
                </div>
              </div>

              <div className="db-card-skills">
                {dev.skills.map((s) => (
                  <span key={s} className="db-skill-tag">{s}</span>
                ))}
              </div>

              <p className="db-card-bio">{dev.bio}</p>

              <button className="db-view-profile-btn" onClick={() => handleViewProfile(dev)}>
                View Profile
              </button>
            </div>
          ))}
        </div>

        {(totalPages > 1 || page > 1 || hasNextPage) && (
          <Pagination page={page} totalPages={Math.max(totalPages, page + (hasNextPage ? 1 : 0))} onChange={(p) => setPage(p)} />
        )}
      </div>
    </div>
  );
};

export default DashboardPage;
