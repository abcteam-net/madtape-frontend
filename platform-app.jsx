// Madtape AI — main app router

const { useState: useApp, useEffect: useAppFX } = React;

function LoginModal({ onClose, onLogin }) {
  const [email, setEmail] = React.useState("");
  const [name, setName] = React.useState("");
  const submit = (e) => {
    e.preventDefault();
    onLogin({ name: name || email.split("@")[0] || "creator", email, balance: 28, plan: "creator" });
  };
  return (
    <div onClick={onClose} style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.85)", zIndex: 200, display: "flex", alignItems: "center", justifyContent: "center" }}>
      <div onClick={e => e.stopPropagation()} style={{ background: "#141414", border: "1px solid rgba(255,255,255,0.1)", borderRadius: 6, padding: "48px 48px 40px", width: 400, maxWidth: "92vw", position: "relative" }}>
        <span onClick={onClose} style={{ position: "absolute", top: 16, right: 18, cursor: "pointer", color: "#777", fontSize: 22 }}>×</span>
        <div style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: 36, marginBottom: 28 }}>Sign In</div>
        <form onSubmit={submit} style={{ display: "flex", flexDirection: "column", gap: 12 }}>
          <input placeholder="Email" value={email} onChange={e => setEmail(e.target.value)} style={{ background: "#2a2a2a", border: "1px solid rgba(255,255,255,0.1)", borderRadius: 4, padding: "13px 14px", color: "#fff", fontFamily: "inherit", fontSize: 14, outline: "none" }} />
          <input placeholder="Display name (optional)" value={name} onChange={e => setName(e.target.value)} style={{ background: "#2a2a2a", border: "1px solid rgba(255,255,255,0.1)", borderRadius: 4, padding: "13px 14px", color: "#fff", fontFamily: "inherit", fontSize: 14, outline: "none" }} />
          <button type="submit" style={{ background: "var(--accent)", color: "#fff", padding: "13px", fontSize: 15, fontWeight: 700, borderRadius: 4, border: "none", cursor: "pointer", marginTop: 6 }}>Sign In / Register</button>
        </form>
        <div style={{ fontSize: 12, color: "#555", marginTop: 16, textAlign: "center" }}>No credit card required to start uploading.</div>
      </div>
    </div>
  );
}

function PlatformApp() {
  const [page, setPage] = React.useState("home");
  const [param, setParam] = React.useState(null); // videoId, creatorId, challengeId
  const [user, setUser] = React.useState(null);
  const [showLogin, setShowLogin] = React.useState(false);

  // Scroll to top on page change
  useAppFX(() => { window.scrollTo(0, 0); }, [page, param]);

  const navigate = (key) => {
    if (key.startsWith("video:")) { setPage("video"); setParam(key.slice(6)); }
    else if (key.startsWith("profile:")) { setPage("profile"); setParam(key.slice(8)); }
    else if (key.startsWith("challenge:")) { setPage("challenges"); setParam(key.slice(10)); }
    else { setPage(key); setParam(null); }
  };

  const login = () => setShowLogin(true);
  const handleLogin = (u) => {
    setUser(u);
    setShowLogin(false);
    window.__madtapeUser = u;
  };
  const logout = () => { setUser(null); window.__madtapeUser = null; };
  window.__madtapeLogin = login;

  const navProps = { page, onNav: navigate, user, onLogin: login, onLogout: logout };

  return (
    <div style={{ minHeight: "100vh", background: "var(--bg)", color: "var(--fg)" }}>
      <PlatformNav {...navProps} />

      {page === "home" && <HomePage onNav={navigate} user={user} onLogin={login} />}
      {page === "trailers" && <TrailersPage onNav={navigate} />}
      {page === "real-films" && <RealAIFilmsPage onNav={navigate} />}
      {page === "explore" && <ExplorePage onNav={navigate} />}
      {page === "challenges" && <ChallengesPage onNav={navigate} />}
      {page === "leaderboard" && <LeaderboardPage onNav={navigate} />}
      {page === "creators" && <CreatorsPage onNav={navigate} />}
      {page === "upload" && <UploadPage onNav={navigate} user={user} onLogin={login} />}
      {page === "generate" && <GeneratePage onNav={navigate} user={user} onLogin={login} />}
      {page === "pricing" && <PricingPage onNav={navigate} />}
      {page === "dashboard" && <DashboardPage user={user} onNav={navigate} onLogin={login} />}
      {page === "video" && param && <VideoDetailPage videoId={param} onNav={navigate} />}
      {page === "profile" && <ProfilePage creatorId={param || "kira-motion"} onNav={navigate} />}

      {showLogin && <LoginModal onClose={() => setShowLogin(false)} onLogin={handleLogin} />}
    </div>
  );
}

ReactDOM.createRoot(document.getElementById("root")).render(<PlatformApp />);
