import React from 'react';
import { useNavigate } from 'react-router-dom';
import { PlatformFooter } from './platform-nav.jsx';

const trackEvent = (eventName, eventData = {}) => {
  console.log(`[Analytics Event]: ${eventName}`, eventData);
  if (window.gtag) {
    window.gtag('event', eventName, eventData);
  }
};

export function AboutPage() {
  const navigate = useNavigate();

  return (
    <div style={{ paddingTop: 80, minHeight: "100vh", background: "var(--bg)", color: "var(--fg)" }}>
      
      {/* 1. HERO SECTION */}
      <section style={{
        padding: "100px 56px 80px",
        background: "radial-gradient(circle at 10% 30%, rgba(229,9,20,0.1), transparent 50%)",
        borderBottom: "1px solid rgba(255,255,255,0.06)",
        textAlign: "center"
      }}>
        <div style={{ maxWidth: 800, margin: "0 auto" }}>
          <div style={{ fontSize: 11, letterSpacing: "0.25em", textTransform: "uppercase", color: "var(--accent)", marginBottom: 16, fontWeight: 700 }}>
            Curated Launchpad
          </div>
          <h1 style={{
            fontFamily: "'Bebas Neue', sans-serif",
            fontSize: "clamp(54px, 8vw, 100px)",
            lineHeight: 0.9,
            letterSpacing: "0.01em",
            marginBottom: 24,
            color: "#fff"
          }}>
            About Madtape
          </h1>
          <p style={{ fontSize: 20, lineHeight: 1.6, color: "var(--fg-dim)", marginBottom: 36, maxWidth: "55ch", margin: "0 auto 36px" }}>
            Madtape is building the home of short-form AI cinema: a curated place to discover, watch, submit, and follow cinematic AI films.
          </p>
          <div style={{ display: "flex", gap: 14, justifyContent: "center", flexWrap: "wrap" }}>
            <button
              onClick={() => {
                trackEvent('early_access_click', { source: 'about_hero' });
                navigate('/early-access');
              }}
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
            <button
              onClick={() => {
                trackEvent('creator_program_click', { source: 'about_hero' });
                navigate('/submit');
              }}
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
              Submit Your Film
            </button>
          </div>
        </div>
      </section>

      {/* Main content flow */}
      <div style={{ maxWidth: 840, margin: "0 auto", padding: "80px 24px" }}>
        
        {/* 2. MISSION SECTION */}
        <section style={{ marginBottom: 80 }}>
          <h2 style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: 42, letterSpacing: "0.02em", color: "#fff", marginBottom: 20 }}>
            Our Mission
          </h2>
          <p style={{ fontSize: 16, lineHeight: 1.7, color: "var(--fg-dim)", marginBottom: 16 }}>
            Madtape exists to give AI-native films a real home.
          </p>
          <p style={{ fontSize: 16, lineHeight: 1.7, color: "var(--fg-dim)", marginBottom: 16 }}>
            AI video tools are evolving fast, but distribution is still fragmented. Creators are publishing cinematic experiments across social feeds, Discord servers, YouTube links, and scattered portfolios. Madtape brings this new category into one focused destination: short-form AI cinema.
          </p>
          <p style={{ fontSize: 16, lineHeight: 1.7, color: "var(--fg-dim)" }}>
            We start with curated films, creator submissions, and original worlds. Then we grow into a platform where AI filmmakers can be discovered, followed, supported, and funded.
          </p>
        </section>

        {/* 3. WHY NOW SECTION */}
        <section style={{ marginBottom: 80, borderTop: "1px solid rgba(255,255,255,0.06)", paddingTop: 60 }}>
          <h2 style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: 42, letterSpacing: "0.02em", color: "#fff", marginBottom: 20 }}>
            Why Now
          </h2>
          <p style={{ fontSize: 16, lineHeight: 1.7, color: "var(--fg-dim)", marginBottom: 16 }}>
            A new generation of filmmakers is emerging. They are not waiting for studios, crews, or traditional pipelines. They are using AI tools, cinematic thinking, and world-building to create stories at a speed the industry has never seen before.
          </p>
          <p style={{ fontSize: 16, lineHeight: 1.7, color: "var(--fg-dim)", marginBottom: 16 }}>
            But the category is still missing structure.
          </p>
          <p style={{ fontSize: 16, lineHeight: 1.7, color: "var(--fg-dim)" }}>
            There is no dedicated place where AI short films are curated as cinema, not just content. Madtape is built to become that place.
          </p>
        </section>

        {/* 4. WHAT WE ARE BUILDING SECTION */}
        <section style={{ marginBottom: 80, borderTop: "1px solid rgba(255,255,255,0.06)", paddingTop: 60 }}>
          <h2 style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: 42, letterSpacing: "0.02em", color: "#fff", marginBottom: 32 }}>
            What Madtape Is Building
          </h2>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(250px, 1fr))", gap: 24 }}>
            {[
              {
                title: "A Home for AI Short Films",
                desc: "A curated destination for cinematic AI-native shorts, trailers, micro-episodes, and experimental story worlds."
              },
              {
                title: "A Launchpad for AI Filmmakers",
                desc: "A place where emerging creators can submit their work, build visibility, and be discovered early."
              },
              {
                title: "A Path Toward AI Cinema Funding",
                desc: "Madtape starts with discovery and community. The long-term direction is creator monetization, funding tools, and AI-assisted production workflows."
              }
            ].map((card, idx) => (
              <div 
                key={idx} 
                style={{ 
                  background: "var(--bg-1)", 
                  border: "1px solid rgba(255,255,255,0.05)", 
                  borderRadius: 6, 
                  padding: 24,
                  transition: "transform 0.2s, border-color 0.2s",
                  cursor: "default"
                }}
                onMouseEnter={e => { e.currentTarget.style.borderColor = "var(--accent)"; e.currentTarget.style.transform = "translateY(-4px)"; }}
                onMouseLeave={e => { e.currentTarget.style.borderColor = "rgba(255,255,255,0.05)"; e.currentTarget.style.transform = "translateY(0)"; }}
              >
                <div style={{ fontSize: 13, color: "var(--accent)", fontWeight: 700, marginBottom: 8 }}>
                  0{idx + 1}
                </div>
                <h3 style={{ fontSize: 18, color: "#fff", fontWeight: 700, marginBottom: 12 }}>
                  {card.title}
                </h3>
                <p style={{ fontSize: 13, color: "var(--fg-dim)", lineHeight: 1.5 }}>
                  {card.desc}
                </p>
              </div>
            ))}
          </div>
        </section>

        {/* 5. FLAGSHIP ORIGINAL SECTION */}
        <section style={{ marginBottom: 80, borderTop: "1px solid rgba(255,255,255,0.06)", paddingTop: 60 }}>
          <h2 style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: 42, letterSpacing: "0.02em", color: "#fff", marginBottom: 20 }}>
            Starting With Rootsapiens: Omega Valley
          </h2>
          <p style={{ fontSize: 16, lineHeight: 1.7, color: "var(--fg-dim)", marginBottom: 24 }}>
            Rootsapiens: Omega Valley is the first Madtape Original and the proof-of-concept for the platform. It introduces a cinematic AI-generated mystery world set on Omega Island, where disappearing animals, living roots, and a sealed mountain cave expose something older than the village itself.
          </p>

          <div style={{ 
            position: "relative", 
            width: "100%", 
            aspectRatio: "16/9", 
            background: "#000", 
            borderRadius: 6, 
            overflow: "hidden", 
            border: "1px solid rgba(255,255,255,0.08)",
            boxShadow: "0 12px 30px rgba(0,0,0,0.6)",
            marginBottom: 24
          }}>
            <iframe
              src="https://www.youtube.com/embed/YuwL3zfhNtc"
              style={{ width: "100%", height: "100%", border: "none" }}
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
              title="Rootsapiens Trailer"
            />
          </div>

          <button
            onClick={() => navigate('/watch')}
            style={{
              background: "var(--accent)",
              color: "#fff",
              padding: "12px 24px",
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
            Watch Rootsapiens Trailer
          </button>
        </section>

        {/* 6. PRINCIPLES SECTION */}
        <section style={{ marginBottom: 80, borderTop: "1px solid rgba(255,255,255,0.06)", paddingTop: 60 }}>
          <h2 style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: 42, letterSpacing: "0.02em", color: "#fff", marginBottom: 32 }}>
            What We Believe
          </h2>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 32 }}>
            {[
              {
                title: "Story First",
                desc: "AI visuals are not enough. Madtape prioritizes films with atmosphere, structure, characters, tension, and cinematic intent."
              },
              {
                title: "Creators Keep Ownership",
                desc: "Submitting a film to Madtape does not transfer ownership. Creators keep their rights."
              },
              {
                title: "Curated, Not Random",
                desc: "Madtape is not a dump for every AI clip. It is a curated space for short-form AI cinema."
              },
              {
                title: "Build the Audience Before the Platform",
                desc: "Madtape starts by proving demand through viewers, creators, screenings, and original films before expanding into larger platform features."
              }
            ].map((p, idx) => (
              <div key={idx} style={{ paddingBottom: 16 }}>
                <h4 style={{ fontSize: 16, fontWeight: 700, color: "#fff", marginBottom: 8 }}>
                  {p.title}
                </h4>
                <p style={{ fontSize: 13, color: "var(--fg-dim)", lineHeight: 1.5 }}>
                  {p.desc}
                </p>
              </div>
            ))}
          </div>
        </section>

        {/* 7. FINAL CTA SECTION */}
        <section style={{ 
          borderTop: "1px solid rgba(255,255,255,0.06)", 
          paddingTop: 60,
          textAlign: "center"
        }}>
          <h2 style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: 48, color: "#fff", marginBottom: 16 }}>
            Join the early Madtape launch.
          </h2>
          <p style={{ fontSize: 15, color: "var(--fg-dim)", marginBottom: 28, maxWidth: "50ch", margin: "0 auto 28px" }}>
            Watch the first Madtape Original, submit your AI short film, or join the early access list before the public launch.
          </p>
          <div style={{ display: "flex", gap: 14, justifyContent: "center", flexWrap: "wrap" }}>
            <button
              onClick={() => navigate('/early-access')}
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
            <button
              onClick={() => navigate('/submit')}
              style={{
                background: "rgba(255,255,255,0.08)",
                color: "#fff",
                padding: "14px 28px",
                fontSize: 14,
                fontWeight: 700,
                borderRadius: 4,
                border: "1px solid rgba(255,255,255,0.15)",
                cursor: "pointer",
                transition: "background 0.2s"
              }}
              onMouseEnter={e => e.currentTarget.style.background = "rgba(255,255,255,0.15)"}
              onMouseLeave={e => e.currentTarget.style.background = "rgba(255,255,255,0.08)"}
            >
              Submit Your Film
            </button>
            <button
              onClick={() => navigate('/watch')}
              style={{
                background: "none",
                color: "#ccc",
                padding: "14px 28px",
                fontSize: 14,
                fontWeight: 600,
                borderRadius: 4,
                border: "1px solid rgba(255,255,255,0.08)",
                cursor: "pointer",
                transition: "all 0.2s"
              }}
              onMouseEnter={e => { e.currentTarget.style.color = "#fff"; e.currentTarget.style.borderColor = "rgba(255,255,255,0.2)"; }}
              onMouseLeave={e => { e.currentTarget.style.color = "#ccc"; e.currentTarget.style.borderColor = "rgba(255,255,255,0.08)"; }}
            >
              Watch Trailer
            </button>
          </div>
        </section>

      </div>
      <PlatformFooter />
    </div>
  );
}
