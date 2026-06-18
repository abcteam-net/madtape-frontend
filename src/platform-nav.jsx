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
    ["explore", "Explore"],
    ["trailers", "Trailers"],
    ["real-films", "AI Cinema"],
    ["challenges", "Challenges"],
    ["leaderboard", "Leaderboard"],
    ["generate", "Generate"],
    ["creators", "Creators"],
    ["pricing", "Pricing"],
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
      <div style={{ display: "flex", gap: 4 }}>
        {links.map(([key, label]) => (
          <button 
            key={key} 
            onClick={() => navigate(key === "home" ? "/" : "/" + key)} 
            aria-label={`Go to ${label}`}
            style={{
              background: page === key ? "rgba(255,255,255,0.08)" : "none",
              border: "none", cursor: "pointer", padding: "7px 12px", borderRadius: 4,
              fontSize: 13, color: page === key ? "#fff" : "#b3b3b3",
              fontWeight: page === key ? 600 : 400,
              transition: "color 120ms, background 120ms",
            }}
            onMouseEnter={e => { if (page !== key) e.currentTarget.style.color = "#fff"; }}
            onMouseLeave={e => { if (page !== key) e.currentTarget.style.color = "#b3b3b3"; }}
          >{label}</button>
        ))}
      </div>
      <div style={{ marginLeft: "auto", display: "flex", alignItems: "center", gap: 12 }}>
        <div 
          ref={searchRef}
          style={{
            position: "relative",
            display: "flex", alignItems: "center", gap: 8,
            border: "1px solid rgba(255,255,255,0.1)", background: "rgba(0,0,0,0.4)",
            padding: "6px 12px", borderRadius: 4,
          }}
        >
          <span style={{ color: "#777", fontSize: 14 }} aria-hidden="true">⌕</span>
          <input 
            placeholder="Search films, creators…" 
            value={searchQuery}
            onChange={e => { setSearchQuery(e.target.value); setDropdownOpen(true); }}
            onKeyDown={handleSearchSubmit}
            onFocus={() => setDropdownOpen(true)}
            aria-label="Search films and creators"
            style={{
              background: "none", border: "none", outline: "none", color: "#fff",
              fontFamily: "inherit", fontSize: 13, width: 160,
            }} 
          />
          {searchQuery && (
            <button 
              onClick={handleClearSearch}
              aria-label="Clear search input"
              style={{ background: "none", border: "none", color: "#777", cursor: "pointer", fontSize: 14, padding: 0 }}
            >
              ×
            </button>
          )}

          {/* Dropdown Overlay */}
          {dropdownOpen && searchQuery.trim() && (
            <div style={{
              position: "absolute", top: "100%", right: 0, marginTop: 8,
              width: 320, background: "#141414", border: "1px solid rgba(255,255,255,0.12)",
              borderRadius: 6, boxShadow: "0 12px 40px rgba(0,0,0,0.9)", zIndex: 100,
              padding: "16px", display: "flex", flexDirection: "column", gap: 16,
              maxHeight: 380, overflowY: "auto"
            }}>
              {matchingCreators.length === 0 && matchingVideos.length === 0 ? (
                <div style={{ color: "#777", fontSize: 13, textAlign: "center", padding: "10px 0" }}>
                  No results found for "{searchQuery}"
                </div>
              ) : (
                <>
                  {matchingCreators.length > 0 && (
                    <div>
                      <div style={{ fontSize: 10, letterSpacing: "0.12em", textTransform: "uppercase", color: "#555", fontWeight: 700, marginBottom: 8 }}>
                        Creators
                      </div>
                      <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                        {matchingCreators.map(c => (
                          <div 
                            key={c.id} 
                            onClick={() => { navigate(`/profile/${c.id}`); setDropdownOpen(false); }}
                            style={{ display: "flex", alignItems: "center", gap: 10, cursor: "pointer", padding: "6px", borderRadius: 4 }}
                            onMouseEnter={e => e.currentTarget.style.background = "rgba(255,255,255,0.04)"}
                            onMouseLeave={e => e.currentTarget.style.background = "transparent"}
                            role="link"
                            tabIndex={0}
                            onKeyDown={e => { if (e.key === 'Enter' || e.key === ' ') { navigate(`/profile/${c.id}`); setDropdownOpen(false); } }}
                          >
                            <div style={{
                              width: 24, height: 24, borderRadius: "50%", background: c.color,
                              display: "flex", alignItems: "center", justifyContent: "center",
                              overflow: "hidden"
                            }}>
                              <img src="/icons/profile.svg" alt="" style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                            </div>
                            <div style={{ minWidth: 0 }}>
                              <div style={{ fontSize: 13, fontWeight: 600, color: "#fff", textOverflow: "ellipsis", overflow: "hidden", whiteSpace: "nowrap" }}>{c.name}</div>
                              <div style={{ fontSize: 11, color: "#555" }}>{c.handle}</div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {matchingVideos.length > 0 && (
                    <div>
                      <div style={{ fontSize: 10, letterSpacing: "0.12em", textTransform: "uppercase", color: "#555", fontWeight: 700, marginBottom: 8 }}>
                        Films
                      </div>
                      <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                        {matchingVideos.map(v => (
                          <div 
                            key={v.id} 
                            onClick={() => { navigate(`/video/${v.id}`); setDropdownOpen(false); }}
                            style={{ display: "flex", gap: 8, cursor: "pointer", padding: "6px", borderRadius: 4 }}
                            onMouseEnter={e => e.currentTarget.style.background = "rgba(255,255,255,0.04)"}
                            onMouseLeave={e => e.currentTarget.style.background = "transparent"}
                            role="link"
                            tabIndex={0}
                            onKeyDown={e => { if (e.key === 'Enter' || e.key === ' ') { navigate(`/video/${v.id}`); setDropdownOpen(false); } }}
                          >
                            <div style={{ width: 44, aspectRatio: "16/9", background: "#222", borderRadius: 2, overflow: "hidden", flexShrink: 0, position: "relative" }}>
                              {v.panel && <img src={v.panel} alt="" style={{ width: "100%", height: "100%", objectFit: "cover" }} />}
                            </div>
                            <div style={{ minWidth: 0 }}>
                              <div style={{ fontSize: 13, fontWeight: 600, color: "#fff", textOverflow: "ellipsis", overflow: "hidden", whiteSpace: "nowrap" }}>{v.title}</div>
                              <div style={{ fontSize: 11, color: "#555" }}>{(window.CREATORS || []).find(c => c.id === v.creator)?.handle}</div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  <button 
                    onClick={() => { navigate(`/search?q=${encodeURIComponent(searchQuery.trim())}`); setDropdownOpen(false); }}
                    style={{
                      width: "100%", background: "rgba(255,255,255,0.05)", border: "none", color: "#fff",
                      fontSize: 12, fontWeight: 700, padding: "8px", borderRadius: 4, cursor: "pointer",
                      textAlign: "center", borderTop: "1px solid rgba(255,255,255,0.05)", marginTop: 4
                    }}
                    onMouseEnter={e => e.currentTarget.style.background = "rgba(255,255,255,0.08)"}
                    onMouseLeave={e => e.currentTarget.style.background = "rgba(255,255,255,0.05)"}
                  >
                    View all results →
                  </button>
                </>
              )}
            </div>
          )}
        </div>
        <button onClick={() => navigate("/upload")} aria-label="Upload film" style={{
          background: "none", border: "1px solid rgba(255,255,255,0.2)",
          color: "#fff", padding: "7px 14px", borderRadius: 4,
          fontSize: 13, fontWeight: 600, cursor: "pointer",
          display: "flex", alignItems: "center", gap: 6,
        }}>↑ Upload</button>
        {user ? (
          <div 
            style={{
              width: 34, height: 34, borderRadius: 4,
              background: "linear-gradient(135deg, #e50914, #8b0000)",
              display: "flex", alignItems: "center", justifyContent: "center",
              cursor: "pointer", overflow: "hidden",
            }} 
            onClick={() => navigate("/dashboard")} 
            role="link"
            tabIndex={0}
            aria-label="Dashboard"
            onKeyDown={e => { if (e.key === 'Enter' || e.key === ' ') navigate("/dashboard"); }}
            title="Dashboard"
          >
            <img src="/icons/profile.svg" alt="" style={{ width: "100%", height: "100%", objectFit: "cover" }} />
          </div>
        ) : (
          <button onClick={onLogin} aria-label="Sign In" style={{
            background: "var(--accent)", color: "#fff", padding: "7px 18px",
            borderRadius: 4, fontWeight: 700, fontSize: 13, border: "none", cursor: "pointer",
          }}>Sign In</button>
        )}
      </div>
    </nav>
  );
}

export function PlatformFooter() {
  const navigate = useNavigate();
  const location = useLocation();
  const page = location.pathname.slice(1) || "home";
  return (
    <footer style={{ padding: "60px 56px 40px", borderTop: "1px solid rgba(255,255,255,0.07)", background: "#0a0a0a" }}>
      <div style={{ display: "grid", gridTemplateColumns: "2fr 1fr 1fr 1fr 1fr", gap: 40, marginBottom: 48 }}>
        <div>
          <div style={{ marginBottom: 12, cursor: "pointer" }} onClick={() => navigate("/")}>
            <img src="/icons/Logo.svg" alt="MADTAPE" style={{ height: 42, display: "block" }} />
          </div>
          <p style={{ fontSize: 13, color: "#777", lineHeight: 1.6, maxWidth: "28ch" }}>
            An innovative streaming platform transforming film & media production. Dedicated to promoting film students and emerging talent worldwide.
          </p>
        </div>
        {[
          ["Platform", [["explore","Explore"], ["challenges","Challenges"], ["leaderboard","Leaderboard"], ["creators","Creators"]]],
          ["Create", [["upload","Upload a Film"], ["generate","Generate with AI"], ["pricing","Pricing & Credits"]]],
          ["Community", [["challenges","This Week's Challenge"], ["leaderboard","Leaderboard"], ["creators","Creator Directory"]]],
          ["Company", [["about","About"], ["rules","Content Rules"], ["about","Contact"]]],
        ].map(([heading, items]) => (
          <div key={heading}>
            <div style={{ fontSize: 10, letterSpacing: "0.16em", textTransform: "uppercase", color: "#555", marginBottom: 16, fontWeight: 600 }}>{heading}</div>
            {items.map(([key, label]) => (
              <a key={label} href="#" onClick={(e) => { e.preventDefault(); navigate(key === "home" ? "/" : "/" + key); }}
                style={{ display: "block", fontSize: 13, color: "#777", padding: "4px 0", textDecoration: "none" }}
                onMouseEnter={e => e.currentTarget.style.color = "#fff"}
                onMouseLeave={e => e.currentTarget.style.color = "#777"}
              >{label}</a>
            ))}
          </div>
        ))}
      </div>
      <div style={{ display: "flex", justifyContent: "space-between", fontSize: 11, color: "#444", borderTop: "1px solid rgba(255,255,255,0.06)", paddingTop: 24 }}>
        <span>© 2026 Madtape AI · Films generated by machines, curated by hand</span>
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
