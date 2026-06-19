import React from 'react';
import { useNavigate } from 'react-router-dom';
import { PlatformFooter } from './platform-nav.jsx';

const trackEvent = (eventName, eventData = {}) => {
  console.log(`[Analytics Event]: ${eventName}`, eventData);
  if (window.gtag) {
    window.gtag('event', eventName, eventData);
  }
};

export function CreatorProgramPage() {
  const navigate = useNavigate();

  const handleApplyClick = () => {
    trackEvent('creator_program_click', { action: 'apply_now' });
    navigate('/submit');
  };

  return (
    <div style={{ paddingTop: 80, minHeight: "100vh", background: "var(--bg)", color: "var(--fg)" }}>
      {/* Hero section */}
      <section style={{ 
        padding: "80px 56px 60px", 
        borderBottom: "1px solid rgba(255,255,255,0.08)",
        background: "radial-gradient(circle at 80% 50%, rgba(229,9,20,0.08), transparent 50%)"
      }}>
        <div style={{ maxWidth: 800, margin: "0 auto" }}>
          <div style={{ fontSize: 11, letterSpacing: "0.25em", textTransform: "uppercase", color: "var(--accent)", marginBottom: 16, fontWeight: 700 }}>
            Creator Campaign
          </div>
          <h1 style={{ 
            fontFamily: "'Bebas Neue', sans-serif", 
            fontSize: "clamp(48px, 7vw, 90px)", 
            lineHeight: 0.9, 
            letterSpacing: "0.01em",
            marginBottom: 24
          }}>
            The First 100 AI Filmmakers.
          </h1>
          <p style={{ fontSize: 20, lineHeight: 1.6, color: "var(--fg-dim)", fontWeight: 400, marginBottom: 32 }}>
            Madtape is building the first curated home for short-form AI cinema. The Creator Program gives early AI filmmakers a place to be discovered before the category becomes crowded.
          </p>
          <button 
            onClick={handleApplyClick}
            style={{
              background: "var(--accent)",
              color: "#fff",
              padding: "16px 36px",
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
            Apply as a Creator
          </button>
        </div>
      </section>

      {/* Main Info Columns */}
      <div style={{ maxWidth: 900, margin: "0 auto", padding: "60px 24px 80px", display: "flex", flexDirection: "column", gap: 48 }}>
        
        {/* Sections Grid */}
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))", gap: 32 }}>
          
          <div style={{ padding: 24, background: "var(--bg-1)", border: "1px solid rgba(255,255,255,0.05)", borderRadius: 6 }}>
            <h3 style={{ fontSize: 18, fontWeight: 700, color: "#fff", marginBottom: 12 }}>What We Look For</h3>
            <ul style={{ paddingLeft: 18, color: "var(--fg-dim)", fontSize: 14, display: "flex", flexDirection: "column", gap: 10, lineHeight: 1.5 }}>
              <li><strong>Cinematic Focus:</strong> Story-driven AI films, not just simple visual loop experiments.</li>
              <li><strong>Runtime:</strong> Completed shorts ranging from 30 seconds to 3 minutes.</li>
              <li><strong>Technical Execution:</strong> High fidelity generation, clean prompt rendering, and cohesive style structure.</li>
            </ul>
          </div>

          <div style={{ padding: 24, background: "var(--bg-1)", border: "1px solid rgba(255,255,255,0.05)", borderRadius: 6 }}>
            <h3 style={{ fontSize: 18, fontWeight: 700, color: "#fff", marginBottom: 12 }}>What Selected Creators Get</h3>
            <ul style={{ paddingLeft: 18, color: "var(--fg-dim)", fontSize: 14, display: "flex", flexDirection: "column", gap: 10, lineHeight: 1.5 }}>
              <li><strong>Platform Spotlight:</strong> Frontpage curation and creator profile showcases during early access.</li>
              <li><strong>Discovery Loop:</strong> Share your tools and workflows to build an audience.</li>
              <li><strong>Screening Invites:</strong> Early access previews and filmmaker network inclusion.</li>
            </ul>
          </div>

        </div>

        {/* Rights and ownership */}
        <section style={{ 
          background: "rgba(255,255,255,0.02)", 
          border: "1px solid rgba(255,255,255,0.05)", 
          borderRadius: 6, 
          padding: 32 
        }}>
          <h3 style={{ fontSize: 20, fontWeight: 700, color: "#fff", marginBottom: 12 }}>Rights and Ownership</h3>
          <p style={{ fontSize: 14, color: "var(--fg-dim)", lineHeight: 1.6, marginBottom: 16 }}>
            At Madtape, we believe filmmakers should hold the rights to their work. <strong>You retain 100% ownership</strong> of any film you submit. 
          </p>
          <p style={{ fontSize: 14, color: "var(--fg-dim)", lineHeight: 1.6 }}>
            We only request a non-exclusive license to showcase your film and trailer on our platform and in early promotional previews for Madtape launch events. We will never sell your work or imply that Madtape owns your original IP.
          </p>
        </section>

        {/* Submission requirements */}
        <section>
          <h3 style={{ fontSize: 20, fontWeight: 700, color: "#fff", marginBottom: 16 }}>Submission Requirements</h3>
          <div style={{ display: "grid", gap: 12 }}>
            {[
              "Duration: 30 seconds to 3 minutes maximum.",
              "Tech: AI-generated or AI-assisted (all generative tools allowed).",
              "Intent: Must be story-driven (contain narrative, tone, characters, or concept flow).",
              "Ownership: You must own or control all necessary distribution rights for submission materials.",
              "Workflow: Selected creators will be invited to list the tools, models, and notes behind their creation."
            ].map((req, i) => (
              <div key={i} style={{ display: "flex", gap: 12, alignItems: "center", fontSize: 14, color: "var(--fg-dim)" }}>
                <span style={{ color: "var(--accent)", fontWeight: "bold" }}>✔</span>
                <span>{req}</span>
              </div>
            ))}
          </div>
        </section>

        {/* Action CTA */}
        <div style={{ 
          textAlign: "center", 
          borderTop: "1px solid rgba(255,255,255,0.08)", 
          paddingTop: 48,
          marginTop: 16 
        }}>
          <h2 style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: 42, color: "#fff", marginBottom: 16 }}>
            Ready to shape the future of AI cinema?
          </h2>
          <p style={{ fontSize: 15, color: "var(--fg-dim)", marginBottom: 28, maxWidth: "50ch", margin: "0 auto 28px" }}>
            Submit your film today. Applications are evaluated on story flow, technical integration, and overall cinematic design.
          </p>
          <button 
            onClick={handleApplyClick}
            style={{
              background: "var(--accent)",
              color: "#fff",
              padding: "14px 32px",
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
            Submit Your Film
          </button>
        </div>

      </div>
      <PlatformFooter />
    </div>
  );
}
