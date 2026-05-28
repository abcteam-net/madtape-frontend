import React from 'react';
import { useNavigate, useParams, Link, useLocation } from 'react-router-dom';
import { PlatformFooter } from './platform-nav.jsx';
// Madtape AI — Trailers page with embedded YouTube player

const TRAILERS = [
  {
    id: "echo-hunter-trailer",
    title: "Echo Hunter",
    creator: "Arcana Labs / Kavan the Kid",
    year: 2025,
    runtime: "30m",
    category: "Sci-Fi Thriller",
    ytId: "B-lfTmZp1DE",
    badge: "MADTAPE PICK",
    badgeColor: "var(--accent)",
    desc: "A 30-minute SAG-AFTRA AI film. A clone hunter in a dystopian future begins to remember a life he never lived. Directed by Kavan the Kid. Stars Breckin Meyer.",
  },
  {
    id: "air-head-trailer",
    title: "Air Head",
    creator: "Shy Kids / OpenAI Sora",
    year: 2024,
    runtime: "9m",
    category: "Surreal Comedy",
    ytId: "9oryIMNVtto",
    badge: "LANDMARK",
    badgeColor: "#46d369",
    desc: "One of the first short films made with OpenAI's Sora. A man with a balloon for a head navigates daily life with surreal charm.",
  },
  {
    id: "thank-you-trailer",
    title: "Thank You for Not Answering",
    creator: "Paul Trillo / Runway Gen-2",
    year: 2023,
    runtime: "3m",
    category: "Experimental Drama",
    ytId: "1TlY7jkyqz4",
    badge: "RUNWAY FEST",
    badgeColor: "#5851db",
    desc: "A man leaves a voicemail for someone from his past and is flooded with fading memories. 400+ clips generated with Runway Gen-2.",
  },
  {
    id: "the-frost-trailer",
    title: "The Frost",
    creator: "Waymark Creative Labs",
    year: 2024,
    runtime: "12m",
    category: "Sci-Fi Horror",
    ytId: "r4vXj9wuMts",
    badge: "OFFICIAL TRAILER",
    badgeColor: "#bae6fd",
    desc: "An expedition team in Antarctica follows a mysterious signal up a treacherous mountain. Fully AI-generated horror by Waymark.",
  },
  {
    id: "the-frost-full",
    title: "The Frost (Complete Film)",
    creator: "Waymark Creative Labs",
    year: 2024,
    runtime: "12m",
    category: "Sci-Fi Horror",
    ytId: "DNyxZi9Gp_4",
    badge: "FULL FILM",
    badgeColor: "#38bdf8",
    desc: "Complete feature-length version of The Frost. Watch the full AI-generated sci-fi horror film from Waymark.",
  },
  {
    id: "outworld-trailer",
    title: "The Outworld",
    creator: "Independent / 100% AI",
    year: 2023,
    runtime: "Feature",
    category: "Sci-Fi",
    ytId: "s1AXccDlm6A",
    badge: "100% AI",
    badgeColor: "#fb923c",
    desc: "One of the first 100% AI-generated feature-length films. An ambitious early experiment in fully synthetic cinema.",
  },
  {
    id: "ai-trailers-2024",
    title: "Best AI Film Trailers 2024",
    creator: "Various / Competition",
    year: 2024,
    runtime: "Compilation",
    category: "Compilation",
    ytId: "A-HwiKVdTog",
    badge: "COMPETITION",
    badgeColor: "#f5c518",
    desc: "Top 9 trailers from the 2024 AI Film Trailer Competition. Nearly 400 submissions from creators worldwide. A state-of-the-art showcase.",
  },
  {
    id: "ai-doc-trailer",
    title: "The AI Doc",
    creator: "Academy Award filmmakers",
    year: 2025,
    runtime: "Feature",
    category: "Documentary",
    ytId: "xkPbV3IRe4Y",
    badge: "IN THEATERS",
    badgeColor: "#c084fc",
    desc: "\"The most urgent film of our time.\" An Academy Award-winning documentary exploring the dawn of artificial intelligence and its impact on humanity.",
  },
];

window.TRAILERS = TRAILERS;

export function TrailersPage({ }) {
  const navigate = useNavigate();
  const [active, setActive] = React.useState(TRAILERS[0]);
  const [playing, setPlaying] = React.useState(false);

  return (
    <div style={{ paddingTop: 80, minHeight: "100vh", background: "var(--bg)" }}>
      {/* Header */}
      <div style={{ padding: "36px 56px 28px", borderBottom: "1px solid rgba(255,255,255,0.08)" }}>
        <div style={{ fontSize: 10, letterSpacing: "0.2em", textTransform: "uppercase", color: "var(--accent)", marginBottom: 12, fontWeight: 700 }}>
          YouTube · Official trailers & full films
        </div>
        <h1 style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: 64, lineHeight: 0.88, letterSpacing: "0.005em" }}>Trailers.</h1>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "1fr 380px", minHeight: "calc(100vh - 180px)" }}>
        {/* Main player */}
        <div style={{ borderRight: "1px solid rgba(255,255,255,0.08)" }}>
          {/* YouTube embed */}
          <div style={{ position: "relative", background: "#000", aspectRatio: "16/9" }}>
            <iframe
              key={active.ytId + (playing ? "_play" : "")}
              src={`https://www.youtube.com/embed/${active.ytId}${playing ? "?autoplay=1" : ""}`}
              style={{ position: "absolute", inset: 0, width: "100%", height: "100%", border: "none" }}
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
              title={active.title}
            />
          </div>

          {/* Film info below player */}
          <div style={{ padding: "24px 32px 32px" }}>
            <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", marginBottom: 14 }}>
              <div>
                <div style={{ display: "flex", gap: 10, alignItems: "center", marginBottom: 8 }}>
                  <span style={{ fontSize: 10, fontWeight: 700, padding: "3px 8px", background: active.badgeColor + "22", color: active.badgeColor, border: `1px solid ${active.badgeColor}55`, borderRadius: 2, letterSpacing: "0.1em" }}>
                    {active.badge}
                  </span>
                  <span style={{ fontSize: 12, color: "#777" }}>{active.category} · {active.runtime} · {active.year}</span>
                </div>
                <h2 style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: 42, lineHeight: 0.92, letterSpacing: "0.005em", marginBottom: 6 }}>{active.title}</h2>
                <div style={{ fontSize: 13, color: "#b3b3b3", marginBottom: 14 }}>{active.creator}</div>
              </div>
              <div style={{ display: "flex", gap: 8, marginTop: 4 }}>
                <button
                  onClick={() => setPlaying(true)}
                  style={{ background: "#fff", color: "#000", padding: "9px 20px", fontSize: 13, fontWeight: 700, borderRadius: 4, border: "none", cursor: "pointer", display: "flex", alignItems: "center", gap: 6 }}
                >▶ Play</button>
                <a
                  href={`https://www.youtube.com/watch?v=${active.ytId}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  style={{ background: "rgba(255,255,255,0.08)", color: "#fff", padding: "9px 16px", fontSize: 13, fontWeight: 600, borderRadius: 4, border: "1px solid rgba(255,255,255,0.1)", cursor: "pointer", display: "flex", alignItems: "center", gap: 6, textDecoration: "none" }}
                >↗ YouTube</a>
              </div>
            </div>
            <p style={{ fontSize: 14, color: "#b3b3b3", lineHeight: 1.6, maxWidth: "64ch", borderTop: "1px solid rgba(255,255,255,0.07)", paddingTop: 16 }}>{active.desc}</p>

            {/* Festival context */}
            <div style={{ marginTop: 24, padding: "16px 18px", background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.07)", borderRadius: 4, fontSize: 12, color: "#777", lineHeight: 1.6 }}>
              <b style={{ color: "#b3b3b3" }}>About Runway AI Film Festival 2025 — </b>
              Over 6,000 submissions. Grand Prix: <i>Total Pixel Space</i> by Jacob Adler. Jury: Gaspar Noé, Harmony Korine, Jane Rosenthal. Screened at Lincoln Center and IMAX theaters in 10 US cities.
            </div>
          </div>
        </div>

        {/* Sidebar queue */}
        <div style={{ overflowY: "auto", background: "var(--bg-1)" }}>
          <div style={{ padding: "16px 18px 8px", fontSize: 11, letterSpacing: "0.14em", textTransform: "uppercase", color: "#555", fontWeight: 600, borderBottom: "1px solid rgba(255,255,255,0.07)" }}>
            {TRAILERS.length} Films · Click to load
          </div>
          {TRAILERS.map((t, i) => (
            <div
              key={t.id}
              onClick={() => { setActive(t); setPlaying(false); }}
              style={{
                display: "flex", gap: 12, padding: "12px 16px",
                borderBottom: "1px solid rgba(255,255,255,0.05)",
                cursor: "pointer",
                background: active.id === t.id ? "rgba(229,9,20,0.08)" : "transparent",
                borderLeft: active.id === t.id ? "3px solid var(--accent)" : "3px solid transparent",
                transition: "background 120ms",
              }}
              onMouseEnter={e => { if (active.id !== t.id) e.currentTarget.style.background = "rgba(255,255,255,0.04)"; }}
              onMouseLeave={e => { if (active.id !== t.id) e.currentTarget.style.background = "transparent"; }}
            >
              {/* Thumbnail */}
              <div style={{ width: 110, aspectRatio: "16/9", flexShrink: 0, borderRadius: 3, overflow: "hidden", position: "relative", background: "#111" }}>
                <img
                  src={`https://img.youtube.com/vi/${t.ytId}/mqdefault.jpg`}
                  alt={t.title}
                  style={{ position: "absolute", inset: 0, width: "100%", height: "100%", objectFit: "cover" }}
                />
                {active.id === t.id && (
                  <div style={{ position: "absolute", inset: 0, background: "rgba(229,9,20,0.35)", display: "flex", alignItems: "center", justifyContent: "center" }}>
                    <span style={{ color: "#fff", fontSize: 16 }}>▶</span>
                  </div>
                )}
              </div>
              {/* Meta */}
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ fontWeight: 700, fontSize: 13, color: active.id === t.id ? "#fff" : "#e0e0e0", lineHeight: 1.2, marginBottom: 3, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{t.title}</div>
                <div style={{ fontSize: 11, color: "#777", marginBottom: 4, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{t.creator}</div>
                <div style={{ display: "flex", gap: 6, alignItems: "center" }}>
                  <span style={{ fontSize: 9, padding: "2px 6px", background: t.badgeColor + "22", color: t.badgeColor, border: `1px solid ${t.badgeColor}44`, borderRadius: 2, fontWeight: 700, letterSpacing: "0.08em", whiteSpace: "nowrap" }}>{t.badge}</span>
                  <span style={{ fontSize: 10, color: "#555" }}>{t.runtime}</span>
                </div>
              </div>
            </div>
          ))}

          {/* Submit CTA */}
          <div style={{ padding: "20px 16px", borderTop: "1px solid rgba(255,255,255,0.07)", marginTop: 8 }}>
            <div style={{ fontSize: 12, color: "#b3b3b3", marginBottom: 10, lineHeight: 1.5 }}>
              Have an AI film trailer? Submit it to be featured here.
            </div>
            <button
              onClick={() => navigate("/upload")}
              style={{ width: "100%", background: "var(--accent)", color: "#fff", padding: "10px", fontSize: 13, fontWeight: 700, borderRadius: 4, border: "none", cursor: "pointer" }}
            >↑ Submit Your Trailer</button>
          </div>
        </div>
      </div>

      <PlatformFooter />
    </div>
  );
}

window.TrailersPage = TrailersPage;
