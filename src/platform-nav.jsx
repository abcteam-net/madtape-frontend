import React from 'react';
import { useNavigate, useParams, Link, useLocation } from 'react-router-dom';
// Madtape AI — updated Nav + Footer

export function PlatformNav({ user, onLogin, onLogout }) {
  const navigate = useNavigate();
  const location = useLocation();
  const page = location.pathname.slice(1) || "home";
  const [scrolled, setScrolled] = React.useState(false);
  
  const [searchQuery, setSearchQuery] = React.useState("");
  const [dropdownOpen, setDropdownOpen] = React.useState(false);
  const searchRef = React.useRef(null);

  React.useEffect(() => {
    const h = () => setScrolled(window.scrollY > 30);
    window.addEventListener("scroll", h);
    return () => window.removeEventListener("scroll", h);
  }, []);

  // Click outside to close search dropdown
  React.useEffect(() => {
    const handleClickOutside = (e) => {
      if (searchRef.current && !searchRef.current.contains(e.target)) {
        setDropdownOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const matchingVideos = React.useMemo(() => {
    if (!searchQuery.trim()) return [];
    const q = searchQuery.toLowerCase();
    return (window.VIDEOS || []).filter(v => 
      v.title.toLowerCase().includes(q) || 
      v.category.toLowerCase().includes(q) ||
      v.model.toLowerCase().includes(q)
    ).slice(0, 5);
  }, [searchQuery]);

  const matchingCreators = React.useMemo(() => {
    if (!searchQuery.trim()) return [];
    const q = searchQuery.toLowerCase();
    return (window.CREATORS || []).filter(c => 
      c.name.toLowerCase().includes(q) || 
      c.handle.toLowerCase().includes(q)
    ).slice(0, 3);
  }, [searchQuery]);

  const handleSearchSubmit = (e) => {
    if (e.key === "Enter" && searchQuery.trim()) {
      navigate(`/search?q=${encodeURIComponent(searchQuery.trim())}`);
      setDropdownOpen(false);
    }
  };

  const handleClearSearch = () => {
    setSearchQuery("");
    setDropdownOpen(false);
  };

  const links = [
    ["selections", "Selections"],
    ["watch", "Watch"],
    ["submit", "Submit Film"],
    ["creator-program", "Creator Program"],
    ["about", "About"],
    ["founding-team", "Founding Team"],
    ["early-access", "Early Access"],
  ];

  return (
    <nav 
      aria-label="Main navigation"
      style={{
        position: "fixed", top: 0, left: 0, right: 0, zIndex: 50,
        display: "flex", alignItems: "center", padding: "16px 56px", gap: 28,
        background: scrolled || !["home"].includes(page) ? "rgba(10,10,10,0.96)" : "linear-gradient(180deg, rgba(0,0,0,0.7), transparent)",
        backdropFilter: scrolled ? "blur(8px)" : "none",
        transition: "background 240ms",
        borderBottom: !["home"].includes(page) ? "1px solid rgba(255,255,255,0.07)" : "none",
      }}
    >
      <div
        style={{ cursor: "pointer", flexShrink: 0 }}
        onClick={() => navigate("/")}
        role="link"
        tabIndex={0}
        aria-label="Madtape Home"
        onKeyDown={e => { if (e.key === 'Enter' || e.key === ' ') navigate("/"); }}
      >
        <img src="/icons/Logo.svg" alt="MADTAPE" style={{ height: 28, display: "block" }} />
      </div>
      
      {/* Navigation Links */}
      <div style={{ display: "flex", gap: 8, marginLeft: "auto" }}>
        {links.map(([key, label]) => {
          const isActive = page === key;
          return (
            <button 
              key={key} 
              onClick={() => navigate("/" + key)} 
              aria-label={`Go to ${label}`}
              style={{
                background: isActive ? "rgba(229, 9, 20, 0.1)" : "none",
                border: "none", 
                cursor: "pointer", 
                padding: "8px 16px", 
                borderRadius: 4,
                fontSize: 13, 
                color: isActive ? "var(--accent)" : "#b3b3b3",
                fontWeight: isActive ? 700 : 500,
                transition: "color 120ms, background 120ms",
              }}
              onMouseEnter={e => { if (!isActive) e.currentTarget.style.color = "#fff"; }}
              onMouseLeave={e => { if (!isActive) e.currentTarget.style.color = "#b3b3b3"; }}
            >{label}</button>
          );
        })}
      </div>
    </nav>
  );
}

export function PlatformFooter() {
  const navigate = useNavigate();
  return (
    <footer style={{ padding: "60px 56px 40px", borderTop: "1px solid rgba(255,255,255,0.07)", background: "#0a0a0a" }}>
      <div style={{ display: "flex", justifyContent: "space-between", flexWrap: "wrap", gap: 40, marginBottom: 48 }}>
        <div>
          <div style={{ marginBottom: 12, cursor: "pointer" }} onClick={() => navigate("/")}>
            <img src="/icons/Logo.svg" alt="MADTAPE" style={{ height: 36, display: "block" }} />
          </div>
          <p style={{ fontSize: 13, color: "#777", lineHeight: 1.6, maxWidth: "32ch" }}>
            The home of short-form AI cinema. Curating the best in cinematic storytelling and emerging filmmaker talent.
          </p>
        </div>
        <div style={{ display: "flex", gap: 24, flexWrap: "wrap" }}>
          {[
            ["selections", "Selections"],
            ["about", "About"],
            ["founding-team", "Founding Team"],
            ["submit", "Submit Film"],
            ["creator-program", "Creator Program"],
            ["early-access", "Early Access"],
            ["early-access", "Contact"]
          ].map(([key, label]) => (
            <a 
              key={label} 
              href="#" 
              onClick={(e) => { e.preventDefault(); navigate("/" + key); }}
              style={{ fontSize: 13, color: "#777", fontWeight: 600, textDecoration: "none" }}
              onMouseEnter={e => e.currentTarget.style.color = "#fff"}
              onMouseLeave={e => e.currentTarget.style.color = "#777"}
            >
              {label}
            </a>
          ))}
        </div>
      </div>
      <div style={{ display: "flex", justifyContent: "space-between", fontSize: 11, color: "#444", borderTop: "1px solid rgba(255,255,255,0.06)", paddingTop: 24, flexWrap: "wrap", gap: 16 }}>
        <span>© 2026 Madtape AI · Curated short-form cinema</span>
        <span style={{ display: "flex", gap: 12 }}>
          {[
            ["/rules", "Content Rules"],
            ["/privacy", "Privacy Policy"],
            ["/terms", "Terms of Service"],
            ["/cookie-policy", "Cookie Policy"],
            ["/dmca", "DMCA Policy"]
          ].map(([path, label], idx, arr) => (
            <React.Fragment key={path}>
              <Link 
                to={path} 
                style={{ color: "#444", textDecoration: "none", transition: "color 150ms" }}
                onMouseEnter={e => e.currentTarget.style.color = "#fff"}
                onMouseLeave={e => e.currentTarget.style.color = "#444"}
              >
                {label}
              </Link>
              {idx < arr.length - 1 && <span style={{ color: "#222" }}>·</span>}
            </React.Fragment>
          ))}
        </span>
      </div>
    </footer>
  );
}

window.PlatformNav = PlatformNav;
window.PlatformFooter = PlatformFooter;
