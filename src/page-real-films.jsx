import React from 'react';
import { useNavigate, useParams, Link, useLocation } from 'react-router-dom';
import { PlatformFooter } from './platform-nav.jsx';
// Madtape AI — Real AI Cinema page

export function RealAIFilmsPage({ }) {
  const navigate = useNavigate();
  const films = window.REAL_AI_FILMS || [];
  const featured = films.filter(f => f.featured);
  const all = films;

  return (
    <div style={{ paddingTop: 80, minHeight: "100vh" }}>
      {/* Header */}
      <div style={{ padding: "40px 56px 48px", borderBottom: "1px solid rgba(255,255,255,0.08)" }}>
        <div style={{ fontSize: 10, letterSpacing: "0.2em", textTransform: "uppercase", color: "var(--accent)", marginBottom: 14, fontWeight: 700 }}>
          Verified · Sourced from WAIFF, Runway Film Festival & Community
        </div>
        <h1 style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: 72, lineHeight: 0.88, letterSpacing: "0.005em", marginBottom: 16 }}>
          Real AI Cinema.
        </h1>
        <p style={{ fontSize: 16, color: "#b3b3b3", maxWidth: "56ch", lineHeight: 1.5 }}>
          A curated index of notable AI-generated films — with creator credits, source festival, and links to the original work. These are real productions, not demos.
        </p>
      </div>

      {/* Featured row */}
      <div style={{ padding: "40px 56px 0" }}>
        <div style={{ fontSize: 11, letterSpacing: "0.16em", textTransform: "uppercase", color: "#555", marginBottom: 20, fontWeight: 600 }}>
          Highlighted Films
        </div>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 16, marginBottom: 60 }}>
          {featured.slice(0, 6).map(film => (
            <RealFilmCard key={film.id} film={film} />
          ))}
        </div>
      </div>

      {/* Full index table */}
      <div style={{ padding: "0 56px 80px", borderTop: "1px solid rgba(255,255,255,0.07)" }}>
        <div style={{ fontSize: 11, letterSpacing: "0.16em", textTransform: "uppercase", color: "#555", marginBottom: 0, fontWeight: 600, paddingTop: 40, paddingBottom: 16 }}>
          Full Index · {all.length} films
        </div>
        {/* Table header */}
        <div style={{
          display: "grid", gridTemplateColumns: "60px 100px 1.4fr 0.8fr 0.7fr 0.6fr 80px 120px",
          gap: 12, padding: "10px 16px",
          fontSize: 10, letterSpacing: "0.14em", textTransform: "uppercase", color: "#444",
          fontWeight: 600, borderBottom: "1px solid rgba(255,255,255,0.08)"
        }}>
          <span>No.</span><span>Thumb</span><span>Title & Creator</span><span>Category</span>
          <span>Model</span><span>Runtime</span><span>Year</span><span>Source</span>
        </div>
        {all.map((film, i) => (
          <div key={film.id} style={{
            display: "grid", gridTemplateColumns: "60px 100px 1.4fr 0.8fr 0.7fr 0.6fr 80px 120px",
            gap: 12, padding: "12px 16px", borderBottom: "1px solid rgba(255,255,255,0.05)",
            alignItems: "center",
          }}
            onMouseEnter={e => e.currentTarget.style.background = "rgba(255,255,255,0.03)"}
            onMouseLeave={e => e.currentTarget.style.background = "transparent"}
          >
            <div style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: 18, color: i < 3 ? "var(--accent)" : "#444" }}>{film.no}</div>
            <div style={{ aspectRatio: "16/9", borderRadius: 3, overflow: "hidden", position: "relative", background: "#111" }}>
              {film.panel && <img src={film.panel} alt={film.title} style={{ position: "absolute", inset: 0, width: "100%", height: "100%", objectFit: "cover", objectPosition: "center" }} />}
              <div style={{ position: "absolute", inset: 0, background: "linear-gradient(180deg, transparent 40%, rgba(0,0,0,0.6))" }} />
            </div>
            <div>
              <div style={{ fontWeight: 700, fontSize: 14, color: "#fff", marginBottom: 3, lineHeight: 1.2 }}>{film.title}</div>
              <a href={film.creatorLink} target="_blank" rel="noopener noreferrer" style={{
                fontSize: 12, color: "var(--accent)", textDecoration: "none",
                display: "inline-flex", alignItems: "center", gap: 4,
              }}
                onMouseEnter={e => e.currentTarget.style.textDecoration = "underline"}
                onMouseLeave={e => e.currentTarget.style.textDecoration = "none"}
              >↗ {film.creator}</a>
            </div>
            <div style={{ fontSize: 12, color: "#b3b3b3" }}>{film.category}</div>
            <div style={{ fontSize: 11, color: "#777", background: "rgba(255,255,255,0.05)", padding: "2px 7px", borderRadius: 2, display: "inline-block" }}>{film.model.split(" /")[0]}</div>
            <div style={{ fontSize: 12, color: "#b3b3b3" }}>{film.runtime}</div>
            <div style={{ fontSize: 12, color: "#b3b3b3" }}>{film.year}</div>
            <div style={{ fontSize: 11, color: "#555", lineHeight: 1.3 }}>{film.source.split("/")[0]}</div>
          </div>
        ))}
      </div>

      {/* Source note */}
      <div style={{ margin: "0 56px 80px", padding: "20px 24px", background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.07)", borderRadius: 6, fontSize: 13, color: "#555", lineHeight: 1.6 }}>
        <b style={{ color: "#b3b3b3" }}>Sources — </b>
        World AI Film Festival (WAIFF) Nice 2025 · Runway AI Film Festival 2023–2025 ·
        Arcana Labs · Shy Kids · Paul Trillo · Theoretically Media · BestAIFilms.com ·
        ComputerCity. Creator links go to YouTube search pages.
        To submit a real AI film to this index, use the Upload page.
      </div>

      <PlatformFooter />
    </div>
  );
}

function RealFilmCard({ film }) {
  return (
    <div style={{
      background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.07)",
      borderRadius: 6, overflow: "hidden",
      transition: "border-color 180ms, background 180ms",
    }}
      onMouseEnter={e => { e.currentTarget.style.borderColor = "rgba(229,9,20,0.35)"; e.currentTarget.style.background = "rgba(255,255,255,0.05)"; }}
      onMouseLeave={e => { e.currentTarget.style.borderColor = "rgba(255,255,255,0.07)"; e.currentTarget.style.background = "rgba(255,255,255,0.03)"; }}
    >
      {/* Thumbnail */}
      <div style={{ aspectRatio: "16/9", position: "relative", background: "#111", overflow: "hidden" }}>
        {film.panel && <img src={film.panel} alt={film.title} style={{ position: "absolute", inset: 0, width: "100%", height: "100%", objectFit: "cover", objectPosition: "center" }} />}
        <div style={{ position: "absolute", inset: 0, background: "linear-gradient(180deg, transparent 40%, rgba(0,0,0,0.8))" }} />
        <div style={{ position: "absolute", top: 8, left: 10, fontSize: 9, fontWeight: 700, letterSpacing: "0.14em", color: "rgba(255,255,255,0.8)", background: "rgba(0,0,0,0.5)", padding: "2px 7px", borderRadius: 2 }}>{film.no}</div>
        <div style={{ position: "absolute", top: 8, right: 10, fontSize: 9, fontWeight: 700, letterSpacing: "0.1em", textTransform: "uppercase", color: "#fff", background: "var(--accent)", padding: "2px 6px", borderRadius: 2 }}>{film.runtime}</div>
        <div style={{ position: "absolute", bottom: 8, left: 10, right: 10 }}>
          <div style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: 20, lineHeight: 1, color: "#fff", marginBottom: 2 }}>{film.title}</div>
          <div style={{ fontSize: 11, color: "rgba(255,255,255,0.65)" }}>{film.year} · {film.category}</div>
        </div>
      </div>
      {/* Meta */}
      <div style={{ padding: "16px 16px 14px" }}>
        <p style={{ fontSize: 12, color: "#b3b3b3", lineHeight: 1.5, marginBottom: 12, display: "-webkit-box", WebkitLineClamp: 3, WebkitBoxOrient: "vertical", overflow: "hidden" }}>{film.brief}</p>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <a href={film.creatorLink} target="_blank" rel="noopener noreferrer"
            style={{ fontSize: 11, color: "var(--accent)", fontWeight: 700, textDecoration: "none", display: "flex", alignItems: "center", gap: 4 }}
            onMouseEnter={e => e.currentTarget.style.textDecoration = "underline"}
            onMouseLeave={e => e.currentTarget.style.textDecoration = "none"}
          >↗ {film.creator.length > 24 ? film.creator.slice(0, 22) + "…" : film.creator}</a>
          <span style={{ fontSize: 10, color: "#555", background: "rgba(255,255,255,0.05)", padding: "2px 7px", borderRadius: 2 }}>{film.model.split(" /")[0]}</span>
        </div>
        <div style={{ marginTop: 10, fontSize: 10, color: "#444", letterSpacing: "0.08em" }}>Source: {film.source}</div>
      </div>
    </div>
  );
}

window.RealAIFilmsPage = RealAIFilmsPage;
window.RealFilmCard = RealFilmCard;
