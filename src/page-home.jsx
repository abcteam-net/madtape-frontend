import React from 'react';
import { useNavigate } from 'react-router-dom';
import { db } from './firebase-config.js';
import { collection, addDoc } from 'firebase/firestore';
import { PlatformFooter } from './platform-nav.jsx';

const trackEvent = (eventName, eventData = {}) => {
  console.log(`[Analytics Event]: ${eventName}`, eventData);
  if (window.gtag) {
    window.gtag('event', eventName, eventData);
  }
};

export function HomePage({ user, onLogin }) {
  const navigate = useNavigate();

  // Waitlist form state
  const [waitlistData, setWaitlistData] = React.useState({
    name: '',
    email: '',
    role: 'viewer'
  });
  const [loading, setLoading] = React.useState(false);
  const [submitted, setSubmitted] = React.useState(false);
  const [error, setError] = React.useState('');

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setWaitlistData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleWaitlistSubmit = async (e) => {
    e.preventDefault();
    if (!waitlistData.name || !waitlistData.email) {
      setError('Please fill in both name and email.');
      return;
    }

    setLoading(true);
    setError('');

    try {
      const payload = {
        ...waitlistData,
        submittedAt: new Date().toISOString()
      };

      // 1. Send email via Web3Forms FIRST
      try {
        const web3Response = await fetch('https://api.web3forms.com/submit', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json', 'Accept': 'application/json' },
          body: JSON.stringify({
            access_key: 'cef30d3d-da23-423a-8631-f6b30af53ba8',
            subject: `[Madtape] New Waitlist Signup — ${waitlistData.name}`,
            from_name: 'Madtape Waitlist',
            replyto: waitlistData.email,
            name: waitlistData.name,
            email: waitlistData.email,
            role: waitlistData.role,
            message: `New waitlist signup:\n\nName: ${waitlistData.name}\nEmail: ${waitlistData.email}\nRole: ${waitlistData.role}\nTime: ${new Date().toLocaleString()}`
          })
        });
        const web3Data = await web3Response.json();
        if (!web3Data.success) console.warn('Web3Forms warning:', web3Data.message);
      } catch (emailErr) {
        console.warn('Email notification failed (non-blocking):', emailErr);
      }

      // 2. Save to Firebase with a 5s timeout, fall back to localStorage
      try {
        const firestoreTimeout = new Promise((_, reject) =>
          setTimeout(() => reject(new Error('Firestore timeout')), 5000)
        );
        await Promise.race([
          addDoc(collection(db, 'waitlist'), payload),
          firestoreTimeout
        ]);
      } catch (dbErr) {
        console.warn('Firestore unavailable, saving locally:', dbErr.message);
        const currentLocal = JSON.parse(localStorage.getItem('madtape_waitlist') || '[]');
        currentLocal.push(payload);
        localStorage.setItem('madtape_waitlist', JSON.stringify(currentLocal));
      }

      trackEvent('waitlist_submit', { role: waitlistData.role, source: 'homepage' });
      setSubmitted(true);
    } catch (err) {
      console.error('Waitlist submit error:', err);
      setError('An error occurred. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ paddingTop: 0, background: '#0a0a0a', color: '#ffffff' }}>
      
      {/* 1. HERO SECTION */}
      <section style={{
        minHeight: "100vh", 
        display: "flex", 
        flexDirection: "column", 
        justifyContent: "center",
        padding: "140px 56px 80px", 
        position: "relative", 
        overflow: "hidden",
        borderBottom: "1px solid rgba(255,255,255,0.06)"
      }}>
        {/* Ambient background glow */}
        <div style={{ position: "absolute", inset: 0, zIndex: 0, overflow: "hidden" }}>
          <div style={{
            position: "absolute", inset: 0,
            background: "linear-gradient(180deg, rgba(10,10,10,0.0) 0%, rgba(10,10,10,0.9) 80%, #0a0a0a 100%)",
            zIndex: 2,
          }} />
          <div style={{
            position: "absolute", inset: 0,
            background: "radial-gradient(ellipse at 80% 40%, rgba(229,9,20,0.12), transparent 60%)",
            zIndex: 1,
          }} />
        </div>

        <div style={{ position: "relative", zIndex: 3, maxWidth: 840, margin: "0 auto", width: "100%" }}>
          <div style={{ fontSize: 11, letterSpacing: "0.25em", textTransform: "uppercase", color: "var(--accent)", marginBottom: 24, fontWeight: 700 }}>
            ● PRE-LAUNCH ACCESS
          </div>
          
          <h1 style={{
            fontFamily: "'Bebas Neue', sans-serif", 
            fontWeight: 400,
            fontSize: "clamp(54px, 8vw, 110px)", 
            lineHeight: 0.9, 
            letterSpacing: "0.01em",
            color: "#fff", 
            marginBottom: 24,
            textTransform: "uppercase"
          }}>
            Madtape is the home of<br />
            <span style={{ color: "var(--accent)", fontFamily: "Impact, Haettenschweiler, 'Arial Narrow Bold', sans-serif" }}>short-form AI cinema.</span>
          </h1>
          
          <p style={{ fontSize: 20, lineHeight: 1.5, color: "var(--fg-dim)", maxWidth: "58ch", marginBottom: 40 }}>
            Watch cinematic AI films, follow emerging AI filmmakers, and submit your own short film.
          </p>

          <div style={{ display: "flex", gap: 14, flexWrap: "wrap", marginBottom: 56 }}>
            <button 
              onClick={() => {
                trackEvent('early_access_click', { source: 'hero_primary' });
                navigate("/watch");
              }} 
              style={{
                background: "var(--accent)", 
                color: "#fff", 
                padding: "16px 32px",
                fontSize: 15, 
                fontWeight: 700, 
                borderRadius: 4, 
                border: "none", 
                cursor: "pointer",
                transition: "background 0.2s"
              }}
              onMouseEnter={e => e.currentTarget.style.background = "#ff1f2f"}
              onMouseLeave={e => e.currentTarget.style.background = "var(--accent)"}
            >
              Watch Rootsapiens Trailer
            </button>
            
            <button 
              onClick={() => {
                trackEvent('early_access_click', { source: 'hero_secondary' });
                navigate("/early-access");
              }} 
              style={{
                background: "rgba(255,255,255,0.08)", 
                color: "#fff", 
                padding: "16px 32px",
                fontSize: 15, 
                fontWeight: 700, 
                borderRadius: 4, 
                border: "1px solid rgba(255,255,255,0.15)", 
                cursor: "pointer",
                transition: "background 0.2s"
              }}
              onMouseEnter={e => e.currentTarget.style.background = "rgba(255,255,255,0.15)"}
              onMouseLeave={e => e.currentTarget.style.background = "rgba(255,255,255,0.08)"}
            >
              Join Early Access
            </button>

            <button 
              onClick={() => {
                trackEvent('creator_program_click', { source: 'hero_third' });
                navigate("/submit");
              }} 
              style={{
                background: "none", 
                color: "#ccc", 
                padding: "16px 32px",
                fontSize: 15, 
                fontWeight: 600, 
                borderRadius: 4, 
                border: "1px solid rgba(255,255,255,0.08)", 
                cursor: "pointer",
                transition: "all 0.2s"
              }}
              onMouseEnter={e => { e.currentTarget.style.color = "#fff"; e.currentTarget.style.borderColor = "rgba(255,255,255,0.2)"; }}
              onMouseLeave={e => { e.currentTarget.style.color = "#ccc"; e.currentTarget.style.borderColor = "rgba(255,255,255,0.08)"; }}
            >
              Submit Your AI Short Film
            </button>
          </div>

          {/* Embedded YouTube Trailer directly in Hero */}
          <div style={{ marginTop: 24 }}>
            <div style={{ fontSize: 12, letterSpacing: "0.1em", textTransform: "uppercase", color: "#666", marginBottom: 12, fontWeight: 700 }}>
              Madtape Original No. 001 · Rootsapiens: Omega Valley · Season 1, Episode 1 Trailer
            </div>
            
            <div style={{ 
              position: "relative", 
              width: "100%", 
              aspectRatio: "16/9", 
              background: "#000", 
              borderRadius: 6, 
              overflow: "hidden", 
              border: "1px solid rgba(255,255,255,0.08)",
              boxShadow: "0 20px 40px rgba(0,0,0,0.8)"
            }}>
              <iframe
                src="https://www.youtube.com/embed/YuwL3zfhNtc"
                style={{ position: "absolute", inset: 0, width: "100%", height: "100%", border: "none" }}
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
                title="Rootsapiens Trailer"
              />
            </div>
            
            <p style={{ fontSize: 14, color: "#888", lineHeight: 1.5, marginTop: 16, maxWidth: "70ch" }}>
              On Omega Island, a forgotten mountain begins to change the village, the animals, and the people who get too close. Rootsapiens is the first Madtape Original and the proof-of-concept for AI-native short-form cinema.
            </p>
          </div>

        </div>
      </section>

      {/* 2. FEATURED ORIGINAL */}
      <section style={{ padding: "100px 56px", borderBottom: "1px solid rgba(255,255,255,0.06)", background: "#0d0d0d" }}>
        <div style={{ maxWidth: 840, margin: "0 auto" }}>
          <div style={{ fontSize: 11, letterSpacing: "0.2em", textTransform: "uppercase", color: "var(--accent)", marginBottom: 16, fontWeight: 700 }}>
            Featured Madtape Original
          </div>
          
          <h2 style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: 56, lineHeight: 1.0, marginBottom: 24, letterSpacing: "0.01em" }}>
            Rootsapiens: Omega Valley
          </h2>
          
          <p style={{ fontSize: 18, color: "var(--fg-dim)", lineHeight: 1.6, marginBottom: 32 }}>
            A cinematic AI-generated mystery series set on Omega Island, where disappearing animals, living roots, and a sealed mountain cave expose something older than the village itself.
          </p>

          <button 
            onClick={() => navigate("/watch")} 
            style={{
              background: "#fff", 
              color: "#000", 
              padding: "14px 28px",
              fontSize: 15, 
              fontWeight: 700, 
              borderRadius: 4, 
              border: "none", 
              cursor: "pointer",
              transition: "opacity 0.2s"
            }}
            onMouseEnter={e => e.currentTarget.style.opacity = 0.9}
            onMouseLeave={e => e.currentTarget.style.opacity = 1}
          >
            Watch Trailer
          </button>
        </div>
      </section>

      {/* 3. WHY MADTAPE EXISTS */}
      <section style={{ padding: "100px 56px", borderBottom: "1px solid rgba(255,255,255,0.06)" }}>
        <div style={{ maxWidth: 840, margin: "0 auto" }}>
          <div style={{ fontSize: 11, letterSpacing: "0.2em", textTransform: "uppercase", color: "var(--accent)", marginBottom: 16, fontWeight: 700 }}>
            The Wedge
          </div>
          
          <h2 style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: 56, lineHeight: 1.0, marginBottom: 24, letterSpacing: "0.01em" }}>
            AI films are being created everywhere. They have no real home yet.
          </h2>
          
          <p style={{ fontSize: 16, color: "var(--fg-dim)", lineHeight: 1.6 }}>
            AI video tools are exploding, but distribution is fragmented. Madtape gives short-form AI cinema a dedicated place to be discovered, curated, watched, and followed.
          </p>
        </div>
      </section>

      {/* 4. FOR VIEWERS */}
      <section style={{ padding: "100px 56px", borderBottom: "1px solid rgba(255,255,255,0.06)", background: "#0d0d0d" }}>
        <div style={{ maxWidth: 840, margin: "0 auto" }}>
          <div style={{ fontSize: 11, letterSpacing: "0.2em", textTransform: "uppercase", color: "var(--accent)", marginBottom: 16, fontWeight: 700 }}>
            For Viewers
          </div>
          
          <h2 style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: 56, lineHeight: 1.0, marginBottom: 32, letterSpacing: "0.01em" }}>
            Watch AI-native short films before they become a new industry.
          </h2>

          <div style={{ display: "grid", gap: 16, marginBottom: 40 }}>
            {[
              "Discover cinematic AI shorts.",
              "Follow new AI filmmakers.",
              "Watch original worlds built for short-form storytelling.",
              "Join early access before the public launch."
            ].map((bullet, idx) => (
              <div key={idx} style={{ display: "flex", gap: 12, alignItems: "center", fontSize: 16, color: "var(--fg-dim)" }}>
                <span style={{ color: "var(--accent)", fontWeight: "bold" }}>●</span>
                <span>{bullet}</span>
              </div>
            ))}
          </div>

          <button 
            onClick={() => navigate("/early-access")} 
            style={{
              background: "var(--accent)", 
              color: "#fff", 
              padding: "14px 28px",
              fontSize: 15, 
              fontWeight: 700, 
              borderRadius: 4, 
              border: "none", 
              cursor: "pointer",
              transition: "background 0.2s"
            }}
            onMouseEnter={e => e.currentTarget.style.background = "#ff1f2f"}
            onMouseLeave={e => e.currentTarget.style.background = "var(--accent)"}
          >
            Join Early Access
          </button>
        </div>
      </section>

      {/* 5. FOR CREATORS */}
      <section style={{ padding: "100px 56px", borderBottom: "1px solid rgba(255,255,255,0.06)" }}>
        <div style={{ maxWidth: 840, margin: "0 auto" }}>
          <div style={{ fontSize: 11, letterSpacing: "0.2em", textTransform: "uppercase", color: "var(--accent)", marginBottom: 16, fontWeight: 700 }}>
            For Creators
          </div>
          
          <h2 style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: 56, lineHeight: 1.0, marginBottom: 24, letterSpacing: "0.01em" }}>
            Submit your AI short film.
          </h2>

          <p style={{ fontSize: 18, color: "var(--fg-dim)", lineHeight: 1.6, marginBottom: 32 }}>
            We are selecting the first 100 AI filmmakers to feature in the Madtape early access launch.
          </p>

          <div style={{ display: "grid", gap: 16, marginBottom: 40 }}>
            {[
              "3 to 10 minutes for full AI short films.",
              "AI-generated or AI-assisted.",
              "Story-driven, not only visual experiments.",
              "Creator keeps ownership.",
              "Selected films may be featured in the early Madtape launch."
            ].map((req, idx) => (
              <div key={idx} style={{ display: "flex", gap: 12, alignItems: "center", fontSize: 16, color: "var(--fg-dim)" }}>
                <span style={{ color: "var(--accent)", fontWeight: "bold" }}>✔</span>
                <span>{req}</span>
              </div>
            ))}
          </div>

          <button 
            onClick={() => navigate("/submit")} 
            style={{
              background: "#fff", 
              color: "#000", 
              padding: "14px 28px",
              fontSize: 15, 
              fontWeight: 700, 
              borderRadius: 4, 
              border: "none", 
              cursor: "pointer",
              transition: "opacity 0.2s"
            }}
            onMouseEnter={e => e.currentTarget.style.opacity = 0.9}
            onMouseLeave={e => e.currentTarget.style.opacity = 1}
          >
            Submit Your Film
          </button>
        </div>
      </section>

      {/* 6. FIRST 100 AI FILMMAKERS CAMPAIGN */}
      <section style={{ padding: "100px 56px", borderBottom: "1px solid rgba(255,255,255,0.06)", background: "#0d0d0d" }}>
        <div style={{ maxWidth: 840, margin: "0 auto" }}>
          <div style={{ fontSize: 11, letterSpacing: "0.2em", textTransform: "uppercase", color: "var(--accent)", marginBottom: 16, fontWeight: 700 }}>
            Campaign Spotlight
          </div>
          
          <h2 style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: 56, lineHeight: 1.0, marginBottom: 24, letterSpacing: "0.01em" }}>
            We are selecting the first 100 AI filmmakers.
          </h2>

          <p style={{ fontSize: 16, color: "var(--fg-dim)", lineHeight: 1.6, marginBottom: 32 }}>
            Madtape is opening its early launch to filmmakers creating cinematic, story-driven AI shorts. Selected creators will be featured on the platform and may be included in future screenings, launch campaigns, and creator spotlights.
          </p>

          <button 
            onClick={() => navigate("/creator-program")} 
            style={{
              background: "rgba(255,255,255,0.08)", 
              color: "#fff", 
              padding: "14px 28px",
              fontSize: 15, 
              fontWeight: 700, 
              borderRadius: 4, 
              border: "1px solid rgba(255,255,255,0.15)", 
              cursor: "pointer",
              transition: "background 0.2s"
            }}
            onMouseEnter={e => e.currentTarget.style.background = "rgba(255,255,255,0.15)"}
            onMouseLeave={e => e.currentTarget.style.background = "rgba(255,255,255,0.08)"}
          >
            Apply as a Creator
          </button>
        </div>
      </section>

      {/* 6b. FIRST CREATOR SUBMISSIONS */}
      <section style={{ padding: "100px 56px", borderBottom: "1px solid rgba(255,255,255,0.06)" }}>
        <div style={{ maxWidth: 840, margin: "0 auto" }}>
          <div style={{ fontSize: 11, letterSpacing: "0.2em", textTransform: "uppercase", color: "var(--accent)", marginBottom: 16, fontWeight: 700 }}>
            Creator Selections
          </div>

          <h2 style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: 56, lineHeight: 1.0, marginBottom: 24, letterSpacing: "0.01em" }}>
            First Creator Submissions Are In
          </h2>

          <p style={{ fontSize: 16, color: "var(--fg-dim)", lineHeight: 1.6, marginBottom: 40 }}>
            Madtape has started receiving AI-native films and trailers from external creators. These early selections mark the beginning of our curated pre-launch catalog.
          </p>

          {/* Compact selection cards */}
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))", gap: 20, marginBottom: 40 }}>
            {[
              {
                id: "prompting-reality-trailer",
                title: "Prompting Reality — Trailer",
                creator: "Michal Moc",
                status: "Founding Trailer Selection",
                statusType: "trailer",
                runtime: "2m 19s",
                embedId: "mDqHvSYiFfs",
              },
              {
                id: "eyes-and-ears",
                title: "Eyes and Ears",
                creator: "Yoel Reina",
                status: "Early Selection",
                statusType: "full",
                runtime: "7m 27s",
                embedId: "21jHAuyGYdc",
              },
            ].map((film) => (
              <div
                key={film.id}
                style={{
                  background: "#111",
                  border: "1px solid rgba(255,255,255,0.07)",
                  borderRadius: 6,
                  overflow: "hidden",
                  transition: "border-color 0.2s, transform 0.2s",
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.borderColor = "rgba(255,255,255,0.15)";
                  e.currentTarget.style.transform = "translateY(-2px)";
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.borderColor = "rgba(255,255,255,0.07)";
                  e.currentTarget.style.transform = "translateY(0)";
                }}
              >
                {/* Thumbnail */}
                <div style={{ position: "relative", width: "100%", aspectRatio: "16/9", background: "#000" }}>
                  <img
                    src={`https://img.youtube.com/vi/${film.embedId}/maxresdefault.jpg`}
                    alt={`${film.title} thumbnail`}
                    style={{ width: "100%", height: "100%", objectFit: "cover", display: "block" }}
                    onError={(e) => {
                      e.currentTarget.src = `https://img.youtube.com/vi/${film.embedId}/hqdefault.jpg`;
                    }}
                  />
                  <div style={{
                    position: "absolute",
                    inset: 0,
                    background: "rgba(0,0,0,0.25)",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center"
                  }}>
                    <div style={{
                      width: 40,
                      height: 40,
                      background: "var(--accent)",
                      borderRadius: "50%",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      boxShadow: "0 2px 12px rgba(229,9,20,0.5)"
                    }}>
                      <svg width="14" height="14" viewBox="0 0 24 24" fill="white"><polygon points="8,5 19,12 8,19" /></svg>
                    </div>
                  </div>
                </div>

                {/* Card info */}
                <div style={{ padding: "16px 18px" }}>
                  <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 8, flexWrap: "wrap" }}>
                    <span style={{
                      fontSize: 9,
                      fontWeight: 700,
                      padding: "2px 8px",
                      background: film.statusType === "trailer" ? "rgba(229,9,20,0.12)" : "rgba(255,255,255,0.06)",
                      color: film.statusType === "trailer" ? "var(--accent)" : "#ccc",
                      border: `1px solid ${film.statusType === "trailer" ? "rgba(229,9,20,0.3)" : "rgba(255,255,255,0.1)"}`,
                      borderRadius: 3,
                      letterSpacing: "0.1em",
                      textTransform: "uppercase",
                    }}>{film.status}</span>
                    <span style={{ fontSize: 11, color: "#666" }}>{film.runtime}</span>
                  </div>
                  <div style={{ fontSize: 15, fontWeight: 700, color: "#fff", marginBottom: 4 }}>{film.title}</div>
                  <div style={{ fontSize: 12, color: "#777" }}>{film.creator}</div>
                </div>
              </div>
            ))}
          </div>

          <div style={{ display: "flex", gap: 14, flexWrap: "wrap" }}>
            <button
              onClick={() => navigate("/selections")}
              style={{
                background: "var(--accent)",
                color: "#fff",
                padding: "14px 28px",
                fontSize: 15,
                fontWeight: 700,
                borderRadius: 4,
                border: "none",
                cursor: "pointer",
                transition: "background 0.2s"
              }}
              onMouseEnter={(e) => e.currentTarget.style.background = "#ff1f2f"}
              onMouseLeave={(e) => e.currentTarget.style.background = "var(--accent)"}
            >
              View Madtape Selections
            </button>
            <button
              onClick={() => navigate("/submit")}
              style={{
                background: "none",
                color: "#ccc",
                padding: "14px 28px",
                fontSize: 15,
                fontWeight: 600,
                borderRadius: 4,
                border: "1px solid rgba(255,255,255,0.12)",
                cursor: "pointer",
                transition: "all 0.2s"
              }}
              onMouseEnter={(e) => { e.currentTarget.style.color = "#fff"; e.currentTarget.style.borderColor = "rgba(255,255,255,0.24)"; }}
              onMouseLeave={(e) => { e.currentTarget.style.color = "#ccc"; e.currentTarget.style.borderColor = "rgba(255,255,255,0.12)"; }}
            >
              Submit Your Film
            </button>
          </div>
        </div>
      </section>

      {/* 7. COMMUNITY / SCREENING */}
      <section style={{ padding: "100px 56px", borderBottom: "1px solid rgba(255,255,255,0.06)" }}>
        <div style={{ maxWidth: 840, margin: "0 auto" }}>
          <div style={{ fontSize: 11, letterSpacing: "0.2em", textTransform: "uppercase", color: "var(--accent)", marginBottom: 16, fontWeight: 700 }}>
            Madtape Screenings
          </div>
          
          <h2 style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: 56, lineHeight: 1.0, marginBottom: 24, letterSpacing: "0.01em" }}>
            Madtape Night 001
          </h2>

          <p style={{ fontSize: 16, color: "var(--fg-dim)", lineHeight: 1.6, marginBottom: 32 }}>
            A future online screening for AI short films, creator showcases, and the first public preview of the Madtape cinematic universe. (Coming Soon)
          </p>

          <button 
            onClick={() => navigate("/early-access")} 
            style={{
              background: "var(--accent)", 
              color: "#fff", 
              padding: "14px 28px",
              fontSize: 15, 
              fontWeight: 700, 
              borderRadius: 4, 
              border: "none", 
              cursor: "pointer",
              transition: "background 0.2s"
            }}
            onMouseEnter={e => e.currentTarget.style.background = "#ff1f2f"}
            onMouseLeave={e => e.currentTarget.style.background = "var(--accent)"}
          >
            Get Invited
          </button>
        </div>
      </section>

      {/* 8. WAITLIST */}
      <section style={{ padding: "100px 56px", background: "rgba(229, 9, 20, 0.02)" }}>
        <div style={{ maxWidth: 600, margin: "0 auto" }}>
          <div style={{ textAlign: "center", marginBottom: 32 }}>
            <div style={{ fontSize: 11, letterSpacing: "0.2em", textTransform: "uppercase", color: "var(--accent)", marginBottom: 12, fontWeight: 700 }}>
              Join Waitlist
            </div>
            <h2 style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: 56, lineHeight: 1.0, marginBottom: 16 }}>
              Get early access to Madtape.
            </h2>
          </div>

          {submitted ? (
            <div style={{ 
              background: "rgba(70, 211, 105, 0.08)", 
              border: "1px solid rgba(70, 211, 105, 0.3)", 
              borderRadius: 6, 
              padding: "32px 24px",
              textAlign: "center",
              animation: "fadeIn 400ms ease both"
            }}>
              <span style={{ fontSize: 36, display: "block", marginBottom: 12 }}>✉</span>
              <p style={{ fontSize: 15, lineHeight: 1.5, color: "#fff", fontWeight: 600 }}>
                You are on the early access list. We will notify you when the first Madtape screening opens.
              </p>
            </div>
          ) : (
            <form onSubmit={handleWaitlistSubmit} style={{ display: "flex", flexDirection: "column", gap: 16 }}>
              {error && (
                <div style={{ background: "rgba(229, 9, 20, 0.1)", border: "1px solid rgba(229, 9, 20, 0.3)", borderRadius: 4, padding: "10px 12px", color: "#ff4d4d", fontSize: 13 }}>
                  ⚠️ {error}
                </div>
              )}
              
              <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
                <label htmlFor="hp_name" style={{ fontSize: 11, color: "#aaa", fontWeight: 600 }}>Name</label>
                <input
                  type="text"
                  id="hp_name"
                  name="name"
                  value={waitlistData.name}
                  onChange={handleInputChange}
                  required
                  placeholder="John Doe"
                  style={{
                    background: "#141414",
                    border: "1px solid rgba(255,255,255,0.1)",
                    borderRadius: 4,
                    padding: "12px 14px",
                    color: "#fff",
                    outline: "none",
                    fontSize: 14
                  }}
                />
              </div>

              <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
                <label htmlFor="hp_email" style={{ fontSize: 11, color: "#aaa", fontWeight: 600 }}>Email</label>
                <input
                  type="email"
                  id="hp_email"
                  name="email"
                  value={waitlistData.email}
                  onChange={handleInputChange}
                  required
                  placeholder="john@example.com"
                  style={{
                    background: "#141414",
                    border: "1px solid rgba(255,255,255,0.1)",
                    borderRadius: 4,
                    padding: "12px 14px",
                    color: "#fff",
                    outline: "none",
                    fontSize: 14
                  }}
                />
              </div>

              <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
                <label htmlFor="hp_role" style={{ fontSize: 11, color: "#aaa", fontWeight: 600 }}>I am a...</label>
                <select
                  id="hp_role"
                  name="role"
                  value={waitlistData.role}
                  onChange={handleInputChange}
                  style={{
                    background: "#141414",
                    border: "1px solid rgba(255,255,255,0.1)",
                    borderRadius: 4,
                    padding: "12px 14px",
                    color: "#fff",
                    outline: "none",
                    fontSize: 14,
                    cursor: "pointer"
                  }}
                >
                  <option value="viewer">Viewer who wants to watch AI short films</option>
                  <option value="creator">AI Filmmaker who wants to submit films</option>
                  <option value="investor">Early Supporter / Investor / Accelerator</option>
                  <option value="press">Press / Media Representative</option>
                  <option value="other">Other</option>
                </select>
              </div>

              <button
                type="submit"
                disabled={loading}
                style={{
                  background: loading ? "#777" : "var(--accent)",
                  color: "#fff",
                  padding: "14px",
                  fontSize: 15,
                  fontWeight: 700,
                  borderRadius: 4,
                  border: "none",
                  cursor: loading ? "not-allowed" : "pointer",
                  marginTop: 8,
                  transition: "background 0.2s"
                }}
                onMouseEnter={e => { if(!loading) e.currentTarget.style.background = "#ff1f2f"; }}
                onMouseLeave={e => { if(!loading) e.currentTarget.style.background = "var(--accent)"; }}
              >
                {loading ? "Joining Waitlist..." : "Join Early Access"}
              </button>
            </form>
          )}
        </div>
      </section>

      <PlatformFooter />
    </div>
  );
}
window.HomePage = HomePage;
