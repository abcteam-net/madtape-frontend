// Madtape AI — main app router

const { useState: useApp, useEffect: useAppFX } = React;

function LoginModal({ onClose, onLogin }) {
  const [isRegister, setIsRegister] = React.useState(false);
  const [email, setEmail] = React.useState("");
  const [password, setPassword] = React.useState("");
  const [name, setName] = React.useState("");
  const [error, setError] = React.useState(null);
  const [loading, setLoading] = React.useState(false);

  const submit = async (e) => {
    e.preventDefault();
    if (!email) {
      setError("Please enter your email.");
      return;
    }

    if (!window.isFirebaseConfigured) {
      // Demo Mode login fallback
      onLogin({
        uid: "demo-user",
        name: name || email.split("@")[0] || "demo-creator",
        email,
        balance: 28,
        plan: "creator"
      });
      return;
    }

    // Firebase Auth flow
    if (!password) {
      setError("Please enter a password.");
      return;
    }
    if (password.length < 6) {
      setError("Password must be at least 6 characters.");
      return;
    }

    setLoading(true);
    setError(null);
    try {
      if (isRegister) {
        // Sign Up
        const userCredential = await firebase.auth().createUserWithEmailAndPassword(email, password);
        const fbUser = userCredential.user;
        if (name) {
          await fbUser.updateProfile({ displayName: name });
        }
        // State listener in PlatformApp will automatically update state and close modal
      } else {
        // Sign In
        await firebase.auth().signInWithEmailAndPassword(email, password);
        // State listener in PlatformApp will automatically update state and close modal
      }
    } catch (err) {
      console.error(err);
      setError(err.message || "An authentication error occurred.");
      setLoading(false);
    }
  };

  const handleGoogleSignIn = async () => {
    if (!window.isFirebaseConfigured) {
      // Demo Mode login fallback
      onLogin({
        uid: "google-demo-user",
        name: "Google Explorer",
        email: "explorer@google.com",
        photoURL: "",
        balance: 28,
        plan: "creator"
      });
      return;
    }

    setLoading(true);
    setError(null);
    try {
      const provider = new firebase.auth.GoogleAuthProvider();
      await firebase.auth().signInWithPopup(provider);
      // State listener in PlatformApp will automatically update state and close modal
    } catch (err) {
      console.error(err);
      setError(err.message || "Google Sign-In failed.");
      setLoading(false);
    }
  };

  return (
    <div onClick={onClose} style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.85)", zIndex: 200, display: "flex", alignItems: "center", justifyContent: "center" }}>
      <div onClick={e => e.stopPropagation()} style={{ background: "#141414", border: "1px solid rgba(255,255,255,0.1)", borderRadius: 6, padding: "40px", width: 420, maxWidth: "92vw", position: "relative" }}>
        <span onClick={onClose} style={{ position: "absolute", top: 16, right: 18, cursor: "pointer", color: "#777", fontSize: 22 }} title="Close">×</span>
        
        {/* Banner Alert for Demo Mode */}
        {!window.isFirebaseConfigured && (
          <div style={{ background: "rgba(245, 197, 24, 0.1)", border: "1px solid rgba(245, 197, 24, 0.3)", borderRadius: 4, padding: "12px", color: "#f5c518", fontSize: 12, marginBottom: 20, lineHeight: "1.4" }}>
            ⚠️ <strong>Running in Demo Mode</strong> (Firebase configuration is not set). You can type any email/name below to log in instantly.
          </div>
        )}

        <div style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: 36, marginBottom: 20 }}>
          {isRegister ? "Create Account" : "Sign In"}
        </div>

        {error && (
          <div style={{ background: "rgba(229, 9, 20, 0.1)", border: "1px solid rgba(229, 9, 20, 0.3)", borderRadius: 4, padding: "10px 12px", color: "#ff4d4d", fontSize: 13, marginBottom: 16 }}>
            {error}
          </div>
        )}

        <form onSubmit={submit} style={{ display: "flex", flexDirection: "column", gap: 12 }}>
          {isRegister && (
            <input 
              placeholder="Display Name (optional)" 
              value={name} 
              onChange={e => setName(e.target.value)} 
              disabled={loading}
              style={{ background: "#2a2a2a", border: "1px solid rgba(255,255,255,0.1)", borderRadius: 4, padding: "13px 14px", color: "#fff", fontFamily: "inherit", fontSize: 14, outline: "none" }} 
            />
          )}
          <input 
            type="email"
            placeholder="Email Address" 
            value={email} 
            onChange={e => setEmail(e.target.value)} 
            disabled={loading}
            style={{ background: "#2a2a2a", border: "1px solid rgba(255,255,255,0.1)", borderRadius: 4, padding: "13px 14px", color: "#fff", fontFamily: "inherit", fontSize: 14, outline: "none" }} 
          />
          {window.isFirebaseConfigured && (
            <input 
              type="password"
              placeholder="Password (min 6 characters)" 
              value={password} 
              onChange={e => setPassword(e.target.value)} 
              disabled={loading}
              style={{ background: "#2a2a2a", border: "1px solid rgba(255,255,255,0.1)", borderRadius: 4, padding: "13px 14px", color: "#fff", fontFamily: "inherit", fontSize: 14, outline: "none" }} 
            />
          )}
          
          <button 
            type="submit" 
            disabled={loading}
            style={{ 
              background: loading ? "#777" : "var(--accent)", 
              color: "#fff", 
              padding: "13px", 
              fontSize: 15, 
              fontWeight: 700, 
              borderRadius: 4, 
              border: "none", 
              cursor: loading ? "not-allowed" : "pointer", 
              marginTop: 6,
              transition: "background 150ms"
            }}
          >
            {loading ? "Processing..." : isRegister ? "Sign Up" : "Sign In"}
          </button>
        </form>

        <div style={{ display: "flex", alignItems: "center", gap: 12, margin: "20px 0", color: "#555" }}>
          <div style={{ flex: 1, height: 1, background: "rgba(255,255,255,0.07)" }}></div>
          <span style={{ fontSize: 12 }}>OR</span>
          <div style={{ flex: 1, height: 1, background: "rgba(255,255,255,0.07)" }}></div>
        </div>

        {/* Beautiful Google Login Button */}
        <button 
          onClick={handleGoogleSignIn}
          disabled={loading}
          style={{
            background: "#ffffff",
            color: "#000000",
            padding: "13px",
            fontSize: 15,
            fontWeight: 700,
            borderRadius: 4,
            border: "none",
            cursor: loading ? "not-allowed" : "pointer",
            width: "100%",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            gap: "10px",
            transition: "opacity 150ms",
          }}
          onMouseEnter={e => { e.currentTarget.style.opacity = "0.9"; }}
          onMouseLeave={e => { e.currentTarget.style.opacity = "1"; }}
        >
          <svg width="18" height="18" viewBox="0 0 18 18" style={{ display: "block" }}>
            <path fill="#4285F4" d="M17.64 9.2c0-.63-.06-1.25-.16-1.84H9v3.47h4.84c-.21 1.12-.84 2.07-1.79 2.7v2.24h2.9c1.7-1.57 2.69-3.88 2.69-6.57z"/>
            <path fill="#34A853" d="M9 18c2.43 0 4.47-.8 5.96-2.18l-2.9-2.24c-.8.54-1.84.87-3.06.87-2.35 0-4.34-1.58-5.05-3.72H.91v2.3C2.39 15.98 5.43 18 9 18z"/>
            <path fill="#FBBC05" d="M3.95 10.73A5.4 5.4 0 0 1 3.6 9c0-.6.1-1.19.25-1.73V4.97H.91A8.99 8.99 0 0 0 0 9c0 1.47.36 2.87.99 4.1l2.96-2.37z"/>
            <path fill="#EA4335" d="M9 3.58c1.32 0 2.5.45 3.44 1.35L15 2.1C13.46.67 11.42 0 9 0 5.43 0 2.39 2.02.91 4.97l2.96 2.37C4.66 5.16 6.65 3.58 9 3.58z"/>
          </svg>
          Continue with Google
        </button>

        <div style={{ textAlign: "center", marginTop: 24, fontSize: 13 }}>
          <span style={{ color: "#777" }}>
            {isRegister ? "Already have an account?" : "New to Madtape?"}
          </span>
          <button 
            onClick={() => { setIsRegister(!isRegister); setError(null); }}
            style={{ background: "none", border: "none", color: "var(--accent)", fontWeight: 700, marginLeft: 6, cursor: "pointer" }}
          >
            {isRegister ? "Sign In" : "Create one now"}
          </button>
        </div>
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

  // Real Firebase Auth state synchronization
  useAppFX(() => {
    if (window.isFirebaseConfigured) {
      const unsubscribe = firebase.auth().onAuthStateChanged((fbUser) => {
        if (fbUser) {
          const u = {
            uid: fbUser.uid,
            name: fbUser.displayName || fbUser.email.split("@")[0] || "creator",
            email: fbUser.email,
            photoURL: fbUser.photoURL,
            balance: 28,
            plan: "creator"
          };
          setUser(u);
          window.__madtapeUser = u;
          setShowLogin(false);
        } else {
          setUser(null);
          window.__madtapeUser = null;
        }
      });
      return () => unsubscribe();
    }
  }, []);

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
  const logout = () => {
    if (window.isFirebaseConfigured) {
      firebase.auth().signOut().then(() => {
        setUser(null);
        window.__madtapeUser = null;
      }).catch(err => {
        console.error("Firebase logout failed:", err);
      });
    } else {
      setUser(null);
      window.__madtapeUser = null;
    }
  };
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
