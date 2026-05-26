// Madtape AI — updated Nav + Footer

function PlatformNav({ page, onNav, user, onLogin, onLogout }) {
  const [scrolled, setScrolled] = React.useState(false);
  React.useEffect(() => {
    const h = () => setScrolled(window.scrollY > 30);
    window.addEventListener("scroll", h);
    return () => window.removeEventListener("scroll", h);
  }, []);

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
    <nav style={{
      position: "fixed", top: 0, left: 0, right: 0, zIndex: 50,
      display: "flex", alignItems: "center", padding: "16px 56px", gap: 28,
      background: scrolled || !["home"].includes(page) ? "rgba(10,10,10,0.96)" : "linear-gradient(180deg, rgba(0,0,0,0.7), transparent)",
      backdropFilter: scrolled ? "blur(8px)" : "none",
      transition: "background 240ms",
      borderBottom: !["home"].includes(page) ? "1px solid rgba(255,255,255,0.07)" : "none",
    }}>
      <div
        style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: 28, color: "var(--accent)", cursor: "pointer", letterSpacing: "0.02em", flexShrink: 0 }}
        onClick={() => onNav("home")}
      >MADTAPE</div>
      <div style={{ display: "flex", gap: 4 }}>
        {links.map(([key, label]) => (
          <button key={key} onClick={() => onNav(key)} style={{
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
        <div style={{
          display: "flex", alignItems: "center", gap: 8,
          border: "1px solid rgba(255,255,255,0.1)", background: "rgba(0,0,0,0.4)",
          padding: "6px 12px", borderRadius: 4,
        }}>
          <span style={{ color: "#777", fontSize: 14 }}>⌕</span>
          <input placeholder="Search films, creators…" style={{
            background: "none", border: "none", outline: "none", color: "#fff",
            fontFamily: "inherit", fontSize: 13, width: 160,
          }} />
        </div>
        <button onClick={() => onNav("upload")} style={{
          background: "none", border: "1px solid rgba(255,255,255,0.2)",
          color: "#fff", padding: "7px 14px", borderRadius: 4,
          fontSize: 13, fontWeight: 600, cursor: "pointer",
          display: "flex", alignItems: "center", gap: 6,
        }}>↑ Upload</button>
        {user ? (
          <div style={{
            width: 34, height: 34, borderRadius: 4,
            background: "linear-gradient(135deg, #e50914, #8b0000)",
            display: "flex", alignItems: "center", justifyContent: "center",
            fontWeight: 700, fontSize: 14, cursor: "pointer",
          }} onClick={() => onNav("dashboard")} title="Dashboard">{user.name[0].toUpperCase()}</div>
        ) : (
          <button onClick={onLogin} style={{
            background: "var(--accent)", color: "#fff", padding: "7px 18px",
            borderRadius: 4, fontWeight: 700, fontSize: 13, border: "none", cursor: "pointer",
          }}>Sign In</button>
        )}
      </div>
    </nav>
  );
}

function PlatformFooter({ onNav }) {
  return (
    <footer style={{ padding: "60px 56px 40px", borderTop: "1px solid rgba(255,255,255,0.07)", background: "#0a0a0a" }}>
      <div style={{ display: "grid", gridTemplateColumns: "2fr 1fr 1fr 1fr 1fr", gap: 40, marginBottom: 48 }}>
        <div>
          <div style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: 42, color: "var(--accent)", marginBottom: 12 }}>MADTAPE</div>
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
              <a key={label} href="#" onClick={(e) => { e.preventDefault(); onNav && onNav(key); }}
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
        <span>Content Rules · Privacy · Terms</span>
      </div>
    </footer>
  );
}

window.PlatformNav = PlatformNav;
window.PlatformFooter = PlatformFooter;
