import React from 'react';
import { useNavigate } from 'react-router-dom';
import { PlatformFooter } from './platform-nav.jsx';

// Simple tracking helper
const trackEvent = (eventName, eventData = {}) => {
  console.log(`[Analytics Event]: ${eventName}`, eventData);
  if (window.gtag) {
    window.gtag('event', eventName, eventData);
  }
};

const COMING_SOON_FILMS = [
  {
    id: "omega-valley-2",
    title: "Rootsapiens: Episode 2",
    creator: "Madtape Studio",
    model: "Sora / Gen-3",
    description: "The seal on the mountain cave begins to crack as the village elders make a desperate pact."
  },
  {
    id: "echo-hunter",
    title: "Echo Hunter",
    creator: "Kavan the Kid",
    model: "Midjourney + Runway",
    description: "A clone hunter in a dystopian future begins to remember a life he never lived."
  },
  {
    id: "sub-latent",
    title: "Sub-Latent Space",
    creator: "Arcana Labs",
    model: "Kling + Luma",
    description: "Deep-sea exploration team encounters a anomalies in the ocean's deepest trench."
  }
];

export function WatchPage() {
  const navigate = useNavigate();
  const [playing, setPlaying] = React.useState(false);

  const handlePlayClick = () => {
    setPlaying(true);
    trackEvent('trailer_play_click', { film: 'Rootsapiens: Omega Valley' });
  };

  return (
    <div style={{ paddingTop: 80, minHeight: "100vh", background: "var(--bg)", color: "var(--fg)" }}>
      {/* Header */}
      <div style={{ padding: "40px 56px 24px", borderBottom: "1px solid rgba(255,255,255,0.08)" }}>
        <div style={{ fontSize: 11, letterSpacing: "0.25em", textTransform: "uppercase", color: "var(--accent)", marginBottom: 8, fontWeight: 700 }}>
          Madtape Original No. 001
        </div>
        <h1 style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: "clamp(48px, 6vw, 80px)", lineHeight: 0.9, letterSpacing: "0.01em" }}>
          Rootsapiens: Omega Valley
        </h1>
      </div>

      <div style={{ maxWidth: 1200, margin: "0 auto", padding: "40px 24px 80px", display: "flex", flexDirection: "column", gap: 48 }}>
        
        {/* Main Trailer Player Section */}
        <section style={{ display: "grid", gridTemplateColumns: "1fr", gap: 32 }}>
          <div style={{ 
            position: "relative", 
            width: "100%", 
            aspectRatio: "16/9", 
            background: "#000", 
            borderRadius: 8, 
            overflow: "hidden", 
            boxShadow: "0 20px 50px rgba(0,0,0,0.8)",
            border: "1px solid rgba(255,255,255,0.08)"
          }}>
            <iframe
              src={`https://www.youtube.com/embed/YuwL3zfhNtc?autoplay=1&enablejsapi=1`}
              style={{ position: "absolute", inset: 0, width: "100%", height: "100%", border: "none" }}
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
              title="Rootsapiens: Omega Valley S1 E1 Trailer"
              onLoad={handlePlayClick}
            />
          </div>

          <div style={{ display: "flex", flexDirection: "column", gap: 20, padding: "10px 0" }}>
            <div style={{ display: "flex", flexWrap: "wrap", gap: 12, alignItems: "center" }}>
              <span style={{ 
                fontSize: 10, 
                fontWeight: 700, 
                padding: "4px 10px", 
                background: "rgba(229, 9, 20, 0.15)", 
                color: "var(--accent)", 
                border: "1px solid rgba(229, 9, 20, 0.3)", 
                borderRadius: 4, 
                letterSpacing: "0.1em",
                textTransform: "uppercase"
              }}>
                Season 1, Episode 1 Trailer
              </span>
              <span style={{ fontSize: 13, color: "var(--fg-dim)" }}>
                AI-Native Short-Form Cinema · Concept Proof
              </span>
            </div>

            <p style={{ fontSize: 18, lineHeight: 1.6, color: "var(--fg-dim)", maxWidth: "80ch" }}>
              On Omega Island, a forgotten mountain begins to change the village, the animals, and the people who get too close. Rootsapiens is the first Madtape Original and the proof-of-concept for AI-native short-form cinema.
            </p>

            <div style={{ display: "flex", gap: 16, marginTop: 10 }}>
              <button 
                onClick={() => {
                  trackEvent('early_access_click', { source: 'watch_featured' });
                  navigate('/early-access');
                }}
                style={{ 
                  background: "var(--accent)", 
                  color: "#fff", 
                  padding: "14px 28px", 
                  fontSize: 14, 
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
          </div>
        </section>

        {/* Coming Soon Grid */}
        <section style={{ borderTop: "1px solid rgba(255,255,255,0.08)", paddingTop: 48 }}>
          <h2 style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: 36, letterSpacing: "0.02em", marginBottom: 24 }}>
            Coming Soon to Madtape
          </h2>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))", gap: 24 }}>
            {COMING_SOON_FILMS.map(film => (
              <div 
                key={film.id} 
                style={{ 
                  background: "var(--bg-1)", 
                  border: "1px solid rgba(255,255,255,0.05)", 
                  borderRadius: 6, 
                  padding: 24,
                  display: "flex",
                  flexDirection: "column",
                  justifyContent: "space-between",
                  position: "relative",
                  overflow: "hidden"
                }}
              >
                <div style={{
                  position: "absolute",
                  top: 12,
                  right: 12,
                  fontSize: 9,
                  fontWeight: 700,
                  padding: "2px 8px",
                  background: "rgba(255, 255, 255, 0.08)",
                  borderRadius: 4,
                  color: "#aaa",
                  letterSpacing: "0.05em",
                  textTransform: "uppercase"
                }}>
                  Coming Soon
                </div>

                <div>
                  <div style={{ fontSize: 13, color: "var(--accent)", fontWeight: 600, marginBottom: 4 }}>
                    {film.model}
                  </div>
                  <h3 style={{ fontSize: 20, fontWeight: 700, color: "#fff", marginBottom: 8, fontFamily: "'Inter', sans-serif" }}>
                    {film.title}
                  </h3>
                  <div style={{ fontSize: 12, color: "#777", marginBottom: 12 }}>
                    by {film.creator}
                  </div>
                  <p style={{ fontSize: 13, color: "var(--fg-dim)", lineHeight: 1.5, marginBottom: 20 }}>
                    {film.description}
                  </p>
                </div>

                <button 
                  onClick={() => navigate('/early-access')}
                  style={{
                    width: "100%",
                    background: "rgba(255, 255, 255, 0.05)",
                    border: "1px solid rgba(255, 255, 255, 0.1)",
                    color: "#fff",
                    padding: "10px",
                    borderRadius: 4,
                    fontSize: 12,
                    fontWeight: 600,
                    cursor: "pointer",
                    transition: "all 0.2s"
                  }}
                  onMouseEnter={e => { e.currentTarget.style.background = "rgba(255, 255, 255, 0.1)"; }}
                  onMouseLeave={e => { e.currentTarget.style.background = "rgba(255, 255, 255, 0.05)"; }}
                >
                  Get Notified
                </button>
              </div>
            ))}
          </div>
        </section>

      </div>
      <PlatformFooter />
    </div>
  );
}
