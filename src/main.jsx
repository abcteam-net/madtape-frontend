import { BrowserRouter, Routes, Route, useNavigate, useParams, Link, useLocation } from 'react-router-dom';
import { RealAIFilmsPage } from './page-real-films.jsx';
import { TrailersPage } from './page-trailers.jsx';
import { ProfilePage, VideoDetailPage, CreatorsPage, LeaderboardPage } from './page-profile-video.jsx';
import { UploadPage, GeneratePage, PricingPage, DashboardPage } from './page-creator-tools.jsx';
import { ChallengesPage } from './page-challenges.jsx';
import { ExplorePage } from './page-explore.jsx';
import { HomePage } from './page-home.jsx';
import { SearchPage } from './page-search.jsx';
import { RulesPage, PrivacyPage, TermsPage, CookiePolicyPage, DMCAPage } from './page-legal.jsx';
import { PlatformNav } from './platform-nav.jsx';
import { VideoCard, CreatorCard, ChallengeCard } from './platform-cards.jsx';
import { CREATORS, VIDEOS, CHALLENGES, LEADERBOARD, PLATFORM_PLANS, CREDIT_COSTS } from './platform-data.jsx';
import ReactDOM from 'react-dom/client';
import React from 'react';
// Madtape AI — main app router

const { useState: useApp, useEffect: useAppFX } = React;

function LoginModal({ onClose, onLogin }) {
  const [isRegister, setIsRegister] = React.useState(false);
  const [email, setEmail] = React.useState("");
  const [password, setPassword] = React.useState("");
  const [name, setName] = React.useState("");
  const [error, setError] = React.useState(null);
  const [loading, setLoading] = React.useState(false);

  const emailInputRef = React.useRef(null);
  const modalRef = React.useRef(null);

  React.useEffect(() => {
    emailInputRef.current?.focus();
    const handleKeyDown = (e) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [onClose]);

  const handleTabKey = (e) => {
    if (e.key !== 'Tab') return;
    const focusable = modalRef.current?.querySelectorAll('button, [href], input, select, textarea, [tabindex="0"]');
    if (!focusable || focusable.length === 0) return;
    const first = focusable[0];
    const last = focusable[focusable.length - 1];
    if (e.shiftKey) {
      if (document.activeElement === first) {
        last.focus();
        e.preventDefault();
      }
    } else {
      if (document.activeElement === last) {
        first.focus();
        e.preventDefault();
      }
    }
  };

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
    <div onKeyDown={handleTabKey} onClick={onClose} style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.85)", zIndex: 200, display: "flex", alignItems: "center", justifyContent: "center" }}>
      <div 
        ref={modalRef}
        onClick={e => e.stopPropagation()} 
        role="dialog"
        aria-modal="true"
        aria-labelledby="modal-title"
        style={{ background: "#141414", border: "1px solid rgba(255,255,255,0.1)", borderRadius: 6, padding: "40px", width: 420, maxWidth: "92vw", position: "relative" }}
      >
        <button 
          onClick={onClose} 
          style={{ position: "absolute", top: 16, right: 18, cursor: "pointer", color: "#777", fontSize: 22, background: "none", border: "none" }} 
          aria-label="Close modal"
          title="Close"
        >×</button>
        
        {/* Banner Alert for Demo Mode */}
        {!window.isFirebaseConfigured && (
          <div style={{ background: "rgba(245, 197, 24, 0.1)", border: "1px solid rgba(245, 197, 24, 0.3)", borderRadius: 4, padding: "12px", color: "#f5c518", fontSize: 12, marginBottom: 20, lineHeight: "1.4" }}>
            ⚠️ <strong>Running in Demo Mode</strong> (Firebase configuration is not set). You can type any email/name below to log in instantly.
          </div>
        )}

        <div id="modal-title" style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: 36, marginBottom: 20 }}>
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
              autoComplete="name"
              style={{ background: "#2a2a2a", border: "1px solid rgba(255,255,255,0.1)", borderRadius: 4, padding: "13px 14px", color: "#fff", fontFamily: "inherit", fontSize: 14, outline: "none" }} 
            />
          )}
          <input 
            ref={emailInputRef}
            type="email"
            placeholder="Email Address" 
            value={email} 
            onChange={e => setEmail(e.target.value)} 
            disabled={loading}
            autoComplete="email"
            style={{ background: "#2a2a2a", border: "1px solid rgba(255,255,255,0.1)", borderRadius: 4, padding: "13px 14px", color: "#fff", fontFamily: "inherit", fontSize: 14, outline: "none" }} 
          />
          {window.isFirebaseConfigured && (
            <input 
              type="password"
              placeholder="Password (min 6 characters)" 
              value={password} 
              onChange={e => setPassword(e.target.value)} 
              disabled={loading}
              autoComplete={isRegister ? "new-password" : "current-password"}
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
            type="button"
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

window.CREATORS = CREATORS;
window.VIDEOS = VIDEOS;
window.CHALLENGES = CHALLENGES;
window.LEADERBOARD = LEADERBOARD;
window.PLATFORM_PLANS = PLATFORM_PLANS;
window.CREDIT_COSTS = CREDIT_COSTS;

function PlatformApp() {
  const [user, setUser] = React.useState(() => {
    const saved = localStorage.getItem("__madtape_user");
    return saved ? JSON.parse(saved) : null;
  });
  const [showLogin, setShowLogin] = React.useState(false);
  const location = useLocation();

  const [consent, setConsent] = React.useState(() => localStorage.getItem("__madtape_cookie_consent"));
  const [showBanner, setShowBanner] = React.useState(false);

  // Scroll to top on page change
  React.useEffect(() => {
    window.scrollTo(0, 0);
  }, [location.pathname]);

  // Dynamic Page Title, Metadata & Google Structured Schema Manager
  React.useEffect(() => {
    const path = location.pathname;
    let title = "Madtape AI — The Home of Short-Form AI Cinema";
    let desc = "Discover, stream, and generate cinematic short-form AI films. The premier global hub for emerging AI filmmakers, cinematic challenges, and latent space explorations.";
    let schema = null;

    // Remove any previously injected dynamic schema tags
    const oldSchema = document.getElementById("dynamic-schema");
    if (oldSchema) oldSchema.remove();

    if (path === "/") {
      title = "Madtape AI — The Home of Short-Form AI Cinema";
      desc = "Stream the best 15-second cinematic AI films. Join creators, upload projects, and compete in standard generative challenge pools.";
      schema = {
        "@context": "https://schema.org",
        "@type": "WebSite",
        "name": "Madtape AI",
        "url": "https://madtape.com",
        "description": desc,
        "potentialAction": {
          "@type": "SearchAction",
          "target": "https://madtape.com/search?q={search_term_string}",
          "query-input": "required name=search_term_string"
        }
      };
    } else if (path === "/explore") {
      title = "Explore Short-Form AI Films — Madtape";
      desc = "Filter, browse, and discover cinematic AI films across Sci-Fi, Horror, Action, Drama, and Experimental categories.";
    } else if (path === "/challenges") {
      title = "Active AI Film Challenges — Madtape";
      desc = "Submit your cinematic short-form creations to our active AI film contests. Compete for cash prizes, creator badges, and global homepage spotlights.";
    } else if (path === "/leaderboard") {
      title = "AI Filmmaker Leaderboard — Madtape";
      desc = "Discover top-rated generative AI creators, weekly video ratings, and contest jury scores calculated dynamically.";
    } else if (path === "/creators") {
      title = "AI Filmmaker Directory — Madtape";
      desc = "Connect with global generative AI directors, cinemaphotographers, prompt engineers, and visual designers showcasing their craft on Madtape.";
    } else if (path === "/pricing") {
      title = "Pricing & Credit Plans — Madtape";
      desc = "Explore our Starter, Creator, and Pro subscription plans. Get credits to generate high-fidelity cinematic AI videos securely through Stripe Checkout.";
    } else if (path === "/dashboard") {
      title = "Creator Dashboard — Madtape";
      desc = "Manage your published AI films, review draft submissions, track analytics views and likes, and check your credit balance limits.";
    } else if (path.startsWith("/video/")) {
      const vidId = path.split("/video/")[1];
      const video = (window.VIDEOS || []).find(v => v.id === vidId);
      if (video) {
        title = `${video.title} — AI Short Film — Madtape`;
        desc = `Watch "${video.title}" generated using ${video.model} in the ${video.category} category. Prompt: "${video.prompt}"`;
        
        schema = {
          "@context": "https://schema.org",
          "@type": "VideoObject",
          "name": video.title,
          "description": video.prompt,
          "thumbnailUrl": [
            video.panel.startsWith("http") ? video.panel : `https://madtape.com/${video.panel}`,
            `https://img.youtube.com/vi/${video.youtubeId}/maxresdefault.jpg`
          ],
          "uploadDate": "2026-01-01T00:00:00Z",
          "duration": "PT0M15S",
          "embedUrl": `https://www.youtube.com/embed/${video.youtubeId}`,
          "interactionStatistic": {
            "@type": "InteractionCounter",
            "interactionType": { "@type": "WatchAction" },
            "userInteractionCount": video.views
          }
        };
      }
    } else if (path.startsWith("/profile/")) {
      const creatorId = path.split("/profile/")[1];
      const creator = (window.CREATORS || []).find(c => c.id === creatorId);
      if (creator) {
        title = `${creator.name} (${creator.handle}) — AI Creator Profile — Madtape`;
        desc = `View ${creator.films} cinematic AI films created by ${creator.name} using ${creator.tools.join(", ")}. Bio: ${creator.bio}`;
        
        schema = {
          "@context": "https://schema.org",
          "@type": "ProfilePage",
          "mainEntity": {
            "@type": "Person",
            "name": creator.name,
            "alternateName": creator.handle,
            "description": creator.bio,
            "address": {
              "@type": "PostalAddress",
              "addressLocality": creator.location
            }
          }
        };
      }
    }

    // Set page title and canonical URL dynamically
    document.title = title;
    
    const metaDesc = document.querySelector('meta[name="description"]');
    if (metaDesc) metaDesc.setAttribute("content", desc);
    
    let canonical = document.querySelector('link[rel="canonical"]');
    if (!canonical) {
      canonical = document.createElement("link");
      canonical.setAttribute("rel", "canonical");
      document.head.appendChild(canonical);
    }
    canonical.setAttribute("href", `https://madtape.com${path}`);

    // Update Open Graph tags dynamically
    document.querySelector('meta[property="og:title"]')?.setAttribute("content", title);
    document.querySelector('meta[property="og:description"]')?.setAttribute("content", desc);
    document.querySelector('meta[property="og:url"]')?.setAttribute("content", `https://madtape.com${path}`);
    document.querySelector('meta[name="twitter:title"]')?.setAttribute("content", title);
    document.querySelector('meta[name="twitter:description"]')?.setAttribute("content", desc);

    // Inject rich schema JSON-LD tag into head
    if (schema) {
      const script = document.createElement("script");
      script.id = "dynamic-schema";
      script.type = "application/ld+json";
      script.text = JSON.stringify(schema);
      document.head.appendChild(script);
    }
  }, [location.pathname]);

  React.useEffect(() => {
    if (consent === "accepted") {
      if (!document.getElementById("cloudflare-beacon")) {
        const script = document.createElement("script");
        script.id = "cloudflare-beacon";
        script.src = "https://static.cloudflareinsights.com/beacon.min.js";
        script.defer = true;
        script.setAttribute("data-cf-beacon", '{"token": "madtape-analytics-token-2026"}');
        document.head.appendChild(script);
        console.log("Cloudflare analytics loaded upon consent.");
      }
    } else {
      const existing = document.getElementById("cloudflare-beacon");
      if (existing) {
        existing.remove();
        console.log("Cloudflare analytics unloaded.");
      }
    }
  }, [consent]);

  const handleConsentChange = (level) => {
    setConsent(level);
  };

  const handleSetUser = (updated) => {
    setUser(updated);
    if (updated) {
      window.__madtapeUser = updated;
      localStorage.setItem("__madtape_user", JSON.stringify(updated));
      localStorage.setItem(`__madtape_plan_${updated.uid}`, updated.plan);
      localStorage.setItem(`__madtape_balance_${updated.uid}`, String(updated.balance));
    } else {
      window.__madtapeUser = null;
      localStorage.removeItem("__madtape_user");
    }
  };

  // Real Firebase Auth state synchronization
  useAppFX(() => {
    if (window.isFirebaseConfigured) {
      const unsubscribe = firebase.auth().onAuthStateChanged((fbUser) => {
        if (fbUser) {
          const uid = fbUser.uid;
          const savedPlan = localStorage.getItem(`__madtape_plan_${uid}`) || "free";
          const savedBalance = localStorage.getItem(`__madtape_balance_${uid}`) || "0";
          const u = {
            uid: uid,
            name: fbUser.displayName || fbUser.email.split("@")[0] || "creator",
            email: fbUser.email,
            photoURL: fbUser.photoURL,
            balance: parseInt(savedBalance),
            plan: savedPlan
          };
          setUser(u);
          window.__madtapeUser = u;
          localStorage.setItem("__madtape_user", JSON.stringify(u));
          setShowLogin(false);
        } else {
          setUser(null);
          window.__madtapeUser = null;
          localStorage.removeItem("__madtape_user");
        }
      });
      return () => unsubscribe();
    }
  }, []);

  const login = () => setShowLogin(true);
  const handleLogin = (u) => {
    const uid = u.uid || "demo-user";
    const savedPlan = localStorage.getItem(`__madtape_plan_${uid}`) || "free";
    const savedBalance = localStorage.getItem(`__madtape_balance_${uid}`) || "0";
    const updatedUser = {
      ...u,
      uid,
      plan: savedPlan,
      balance: parseInt(savedBalance)
    };
    handleSetUser(updatedUser);
    setShowLogin(false);
  };
  const logout = () => {
    if (window.isFirebaseConfigured) {
      firebase.auth().signOut().then(() => {
        handleSetUser(null);
      }).catch(err => {
        console.error("Firebase logout failed:", err);
      });
    } else {
      handleSetUser(null);
    }
  };
  window.__madtapeLogin = login;



  return (
    <div style={{ minHeight: "100vh", background: "var(--bg)", color: "var(--fg)" }}>
      <a href="#main-content" className="skip-link">Skip to main content</a>
      <PlatformNav user={user} onLogin={login} onLogout={logout} />

      <main id="main-content">
        <Routes>
          <Route path="/" element={<HomePage user={user} onLogin={login} />} />
          <Route path="/trailers" element={<TrailersPage />} />
          <Route path="/real-films" element={<RealAIFilmsPage />} />
          <Route path="/explore" element={<ExplorePage />} />
          <Route path="/challenges" element={<ChallengesPage />} />
          <Route path="/leaderboard" element={<LeaderboardPage />} />
          <Route path="/creators" element={<CreatorsPage />} />
          <Route path="/upload" element={<UploadPage user={user} onLogin={login} />} />
          <Route path="/generate" element={<GeneratePage user={user} onLogin={login} />} />
          <Route path="/pricing" element={<PricingPage user={user} onLogin={login} setUser={handleSetUser} />} />
          <Route path="/dashboard" element={<DashboardPage user={user} onLogin={login} />} />
          <Route path="/video/:videoId" element={<VideoDetailPage />} />
          <Route path="/profile/:creatorId" element={<ProfilePage />} />
          <Route path="/profile" element={<ProfilePage />} />
          <Route path="/search" element={<SearchPage />} />
          <Route path="/rules" element={<RulesPage />} />
          <Route path="/privacy" element={<PrivacyPage />} />
          <Route path="/terms" element={<TermsPage />} />
          <Route path="/cookie-policy" element={<CookiePolicyPage />} />
          <Route path="/dmca" element={<DMCAPage />} />
        </Routes>
      </main>

      {showLogin && <LoginModal onClose={() => setShowLogin(false)} onLogin={handleLogin} />}

      <CookieBanner forceOpen={showBanner} onClose={() => setShowBanner(false)} onConsentChange={handleConsentChange} />

      {!showBanner && (
        <button 
          onClick={() => setShowBanner(true)}
          title="Cookie Settings"
          style={{
            position: "fixed", bottom: 20, right: 20,
            width: 40, height: 40, borderRadius: "50%",
            background: "rgba(255,255,255,0.06)", border: "1px solid rgba(255,255,255,0.1)",
            color: "#fff", display: "flex", alignItems: "center", justifyContent: "center",
            cursor: "pointer", zIndex: 9998, backdropFilter: "blur(6px)",
            transition: "all 150ms",
            fontSize: 16
          }}
          onMouseEnter={e => { e.currentTarget.style.background = "var(--accent)"; e.currentTarget.style.transform = "scale(1.1)"; }}
          onMouseLeave={e => { e.currentTarget.style.background = "rgba(255,255,255,0.06)"; e.currentTarget.style.transform = "scale(1)"; }}
        >
          🍪
        </button>
      )}
    </div>
  );
}

function CookieBanner({ forceOpen, onClose, onConsentChange }) {
  const [visible, setVisible] = React.useState(false);

  React.useEffect(() => {
    if (forceOpen) {
      setVisible(true);
    } else {
      const saved = localStorage.getItem("__madtape_cookie_consent");
      if (!saved) {
        const timer = setTimeout(() => setVisible(true), 1200);
        return () => clearTimeout(timer);
      }
    }
  }, [forceOpen]);

  const handleConsent = (level) => {
    localStorage.setItem("__madtape_cookie_consent", level);
    setVisible(false);
    if (onConsentChange) onConsentChange(level);
    if (onClose) onClose();
  };

  if (!visible) return null;

  return (
    <div style={{
      position: "fixed", bottom: 24, left: 24, right: 24, zIndex: 9999,
      display: "flex", justifyContent: "center",
      animation: "fadeIn 350ms cubic-bezier(.2,.8,.2,1) both"
    }}>
      <div style={{
        width: "100%", maxWidth: 860,
        background: "rgba(20, 20, 20, 0.85)", backdropFilter: "blur(16px)",
        border: "1px solid rgba(255,255,255,0.08)", borderRadius: 8,
        padding: "20px 24px", display: "flex", alignItems: "center", justifyContent: "space-between",
        gap: 24, boxShadow: "0 12px 32px rgba(0,0,0,0.5)",
        flexWrap: "wrap"
      }}>
        <div style={{ flex: 1, minWidth: 280 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 8, color: "#fff", fontWeight: 700, fontSize: 14, marginBottom: 4 }}>
            <span>🍪 Cookie Settings</span>
          </div>
          <p style={{ color: "#aaa", fontSize: 12, lineHeight: 1.5, margin: 0, textAlign: "left" }}>
            We use necessary cookies for Firebase authentication sessions and secure transactions. We also use optional analytical cookies (Cloudflare Web Analytics) to aggregate performance metrics. You can read our full <Link to="/cookie-policy" style={{ color: "var(--accent)", textDecoration: "underline" }}>Cookie Policy</Link> to learn more.
          </p>
        </div>

        <div style={{ display: "flex", gap: 10, flexShrink: 0 }}>
          <button 
            onClick={() => handleConsent("declined")}
            style={{ background: "none", color: "#777", border: "1px solid rgba(255,255,255,0.1)", borderRadius: 4, padding: "8px 16px", fontSize: 12, fontWeight: 500, cursor: "pointer", transition: "color 150ms" }}
            onMouseEnter={e => e.currentTarget.style.color = "#fff"}
            onMouseLeave={e => e.currentTarget.style.color = "#777"}
          >
            Decline All
          </button>
          <button 
            onClick={() => handleConsent("necessary")}
            style={{ background: "rgba(255,255,255,0.05)", color: "#fff", border: "1px solid rgba(255,255,255,0.15)", borderRadius: 4, padding: "8px 16px", fontSize: 12, fontWeight: 600, cursor: "pointer", transition: "background 150ms" }}
            onMouseEnter={e => e.currentTarget.style.background = "rgba(255,255,255,0.1)"}
            onMouseLeave={e => e.currentTarget.style.background = "rgba(255,255,255,0.05)"}
          >
            Necessary Only
          </button>
          <button 
            onClick={() => handleConsent("accepted")}
            style={{ background: "var(--accent)", color: "#fff", border: "none", borderRadius: 4, padding: "8px 18px", fontSize: 12, fontWeight: 700, cursor: "pointer", transition: "background 150ms" }}
            onMouseEnter={e => e.currentTarget.style.background = "#ff1f2f"}
            onMouseLeave={e => e.currentTarget.style.background = "var(--accent)"}
          >
            Accept All
          </button>
        </div>
      </div>
    </div>
  );
}

ReactDOM.createRoot(document.getElementById("root")).render(<BrowserRouter><PlatformApp /></BrowserRouter>);
