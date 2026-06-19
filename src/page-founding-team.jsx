import React from 'react';
import { useNavigate } from 'react-router-dom';
import { PlatformFooter } from './platform-nav.jsx';

const trackEvent = (eventName, eventData = {}) => {
  console.log(`[Analytics Event]: ${eventName}`, eventData);
  if (window.gtag) {
    window.gtag('event', eventName, eventData);
  }
};

export function FoundingTeamPage() {
  const navigate = useNavigate();

  const founders = [
    {
      name: "Nadeem Issaid",
      role: "Founder, Product & Strategy Lead",
      bio: "Nadeem Issaid is a UX and digital transformation leader with 18+ years of experience building user-centered digital products, services, and communication systems across technology, government, healthcare, finance, media, and creative industries. His background combines product strategy, UX leadership, information architecture, AI-driven design, stakeholder management, and visual storytelling. At Madtape, he leads the product vision, platform strategy, creator experience, and the development of Rootsapiens: Omega Valley as the first Madtape Original.",
      strengths: [
        "Product strategy",
        "UX leadership",
        "Digital transformation",
        "AI-driven design",
        "Storytelling and creative direction",
        "Stakeholder and program leadership"
      ],
      links: [
        { label: "Website", url: "http://www.nadeem.be" },
        { label: "LinkedIn", url: "https://www.linkedin.com/in/nadeemissaid" }
      ],
      initials: "NI"
    },
    {
      name: "Hamza Ayyash Abu",
      role: "Co-Founder, AI Creative Director",
      bio: "Hamza Ayyash Abu is a creative AI technologist and creative director with 15+ years of experience shaping visual identities, cinematic branding, public-space interventions, and AI-driven creative workflows. A KASK MA alumnus, his work connects semiotics, counter-memory, institutional critique, film identity, and generative media. He has led visual identity work for the Palestine Film Institute across international film contexts including Cannes, Berlinale, IDFA, and TIFF, and builds advanced AI creative pipelines using tools such as ComfyUI, LoRA training, ControlNet, Ollama, and projection-mapping systems. At Madtape, he leads the cinematic identity, AI visual language, creative systems, and filmmaker-facing artistic direction.",
      strengths: [
        "AI creative direction",
        "Cinematic branding",
        "Generative AI workflows",
        "Visual identity systems",
        "Film and festival design",
        "Public-space and projection-based media"
      ],
      links: [
        { label: "Website", url: "http://mz7el.com" }
      ],
      initials: "HA"
    },
    {
      name: "Anas Dadi",
      role: "Co-Founder, Cloud & Infrastructure Lead",
      bio: "Anas Dadi is a DevSecOps and SRE engineer with a strong background in cloud architecture, big data, automation, Kubernetes, infrastructure security, and scalable platform operations. His experience includes multi-cloud infrastructure across AWS, Azure, IBM Cloud, and GCP, with deep work in CI/CD pipelines, Terraform, Ansible, Kubernetes orchestration, observability, monitoring, secrets management, and security best practices. At Madtape, he leads the technical infrastructure needed to support a scalable, secure, and reliable AI cinema platform.",
      strengths: [
        "Cloud architecture",
        "DevSecOps and SRE",
        "Kubernetes and orchestration",
        "Infrastructure as Code",
        "CI/CD automation",
        "Monitoring, security, and platform reliability"
      ],
      links: [
        { label: "Website", url: "http://dadianas.com" },
        { label: "GitHub", url: "https://github.com/DadiAnas" },
        { label: "LinkedIn", url: "https://www.linkedin.com/in/dadianas" }
      ],
      initials: "AD"
    }
  ];

  return (
    <div style={{ paddingTop: 80, minHeight: "100vh", background: "var(--bg)", color: "var(--fg)" }}>
      
      {/* 1. HERO SECTION */}
      <section style={{
        padding: "100px 56px 80px",
        background: "radial-gradient(circle at 90% 20%, rgba(229,9,20,0.1), transparent 50%)",
        borderBottom: "1px solid rgba(255,255,255,0.06)",
        textAlign: "center"
      }}>
        <div style={{ maxWidth: 800, margin: "0 auto" }}>
          <div style={{ fontSize: 11, letterSpacing: "0.25em", textTransform: "uppercase", color: "var(--accent)", marginBottom: 16, fontWeight: 700 }}>
            The Founders
          </div>
          <h1 style={{
            fontFamily: "'Bebas Neue', sans-serif",
            fontSize: "clamp(54px, 8vw, 100px)",
            lineHeight: 0.9,
            letterSpacing: "0.01em",
            marginBottom: 24,
            color: "#fff"
          }}>
            Founding Team
          </h1>
          <p style={{ fontSize: 20, lineHeight: 1.6, color: "var(--fg-dim)", marginBottom: 36, maxWidth: "58ch", margin: "0 auto 36px" }}>
            Madtape is built by a founding team combining product strategy, AI-driven creative direction, cinematic world-building, cloud infrastructure, and digital transformation.
          </p>
          <button
            onClick={() => {
              trackEvent('early_access_click', { source: 'founding_team_hero' });
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
        </div>
      </section>

      {/* Main Container */}
      <div style={{ maxWidth: 1000, margin: "0 auto", padding: "80px 24px" }}>
        
        {/* 2. TEAM CARDS SECTION */}
        <section style={{ marginBottom: 80 }}>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))", gap: 32 }}>
            {founders.map((founder, idx) => (
              <div 
                key={idx}
                style={{
                  background: "var(--bg-1)",
                  border: "1px solid rgba(255,255,255,0.06)",
                  borderRadius: 6,
                  padding: 32,
                  display: "flex",
                  flexDirection: "column",
                  justifyContent: "space-between",
                  transition: "transform 0.20s, border-color 0.20s, box-shadow 0.20s",
                  cursor: "default"
                }}
                onMouseEnter={e => { 
                  e.currentTarget.style.borderColor = "var(--accent)"; 
                  e.currentTarget.style.transform = "translateY(-6px)"; 
                  e.currentTarget.style.boxShadow = "0 10px 30px rgba(229, 9, 20, 0.05)";
                }}
                onMouseLeave={e => { 
                  e.currentTarget.style.borderColor = "rgba(255,255,255,0.06)"; 
                  e.currentTarget.style.transform = "translateY(0)"; 
                  e.currentTarget.style.boxShadow = "none";
                }}
              >
                <div>
                  {/* Initials profile placeholder */}
                  <div style={{
                    width: 56,
                    height: 56,
                    borderRadius: "50%",
                    background: "rgba(229, 9, 20, 0.1)",
                    border: "1px solid rgba(229, 9, 20, 0.3)",
                    color: "var(--accent)",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    fontSize: 20,
                    fontWeight: 700,
                    marginBottom: 20,
                    fontFamily: "'Bebas Neue', sans-serif",
                    letterSpacing: "0.05em"
                  }}>
                    {founder.initials}
                  </div>

                  <h3 style={{ fontSize: 22, fontWeight: 700, color: "#fff", marginBottom: 4 }}>
                    {founder.name}
                  </h3>
                  <div style={{ fontSize: 13, color: "var(--accent)", fontWeight: 600, marginBottom: 20 }}>
                    {founder.role}
                  </div>
                  
                  <p style={{ fontSize: 13, color: "var(--fg-dim)", lineHeight: 1.6, marginBottom: 24 }}>
                    {founder.bio}
                  </p>

                  <div style={{ marginBottom: 24 }}>
                    <div style={{ fontSize: 11, textTransform: "uppercase", letterSpacing: "0.1em", color: "#555", fontWeight: 700, marginBottom: 10 }}>
                      Key Strengths
                    </div>
                    <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
                      {founder.strengths.map((str, sIdx) => (
                        <span 
                          key={sIdx}
                          style={{
                            fontSize: 11,
                            padding: "4px 10px",
                            background: "rgba(255,255,255,0.04)",
                            border: "1px solid rgba(255,255,255,0.08)",
                            borderRadius: 4,
                            color: "#aaa"
                          }}
                        >
                          {str}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Profile Links */}
                <div style={{ display: "flex", gap: 12, borderTop: "1px solid rgba(255,255,255,0.05)", paddingTop: 20 }}>
                  {founder.links.map((link, lIdx) => (
                    <a 
                      key={lIdx}
                      href={link.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      style={{
                        fontSize: 12,
                        color: "#888",
                        fontWeight: 600,
                        transition: "color 0.2s"
                      }}
                      onMouseEnter={e => e.currentTarget.style.color = "#fff"}
                      onMouseLeave={e => e.currentTarget.style.color = "#888"}
                    >
                      {link.label} ↗
                    </a>
                  ))}
                </div>

              </div>
            ))}
          </div>
        </section>

        {/* 3. WHY THIS TEAM FITS MADTAPE */}
        <section style={{ marginBottom: 80, borderTop: "1px solid rgba(255,255,255,0.06)", paddingTop: 60 }}>
          <h2 style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: 42, letterSpacing: "0.02em", color: "#fff", marginBottom: 24 }}>
            Why This Team Fits Madtape
          </h2>
          <p style={{ fontSize: 16, lineHeight: 1.7, color: "var(--fg-dim)", marginBottom: 20 }}>
            Madtape sits at the intersection of cinema, AI, product design, creator distribution, and scalable technology. The founding team reflects that intersection.
          </p>
          <div style={{ display: "grid", gap: 16, color: "var(--fg-dim)", fontSize: 15, lineHeight: 1.6 }}>
            <div>
              <strong style={{ color: "#fff" }}>Nadeem</strong> brings product vision, UX strategy, digital transformation, and founder-led storytelling.
            </div>
            <div>
              <strong style={{ color: "#fff" }}>Hamza</strong> brings AI creative direction, cinematic identity, generative media research, and film-world credibility.
            </div>
            <div>
              <strong style={{ color: "#fff" }}>Anas</strong> brings the infrastructure, cloud, DevSecOps, and platform reliability required to scale the product beyond a landing page.
            </div>
          </div>
          <p style={{ fontSize: 15, lineHeight: 1.6, color: "var(--fg-dim)", marginTop: 24 }}>
            Together, the team covers the three foundations Madtape needs at this stage:
          </p>
          <ul style={{ paddingLeft: 18, fontSize: 15, color: "var(--fg-dim)", lineHeight: 1.7, marginTop: 12 }}>
            <li>Product and market direction</li>
            <li>Cinematic AI identity and creator credibility</li>
            <li>Scalable technical infrastructure</li>
          </ul>
        </section>

        {/* 4. TEAM PHILOSOPHY SECTION */}
        <section style={{ marginBottom: 80, borderTop: "1px solid rgba(255,255,255,0.06)", paddingTop: 60 }}>
          <h2 style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: 42, letterSpacing: "0.02em", color: "#fff", marginBottom: 20 }}>
            Built Like a Studio. Designed Like a Platform.
          </h2>
          <p style={{ fontSize: 16, lineHeight: 1.7, color: "var(--fg-dim)", marginBottom: 16 }}>
            Madtape is not only a website for AI films. It is being built as a hybrid between a film studio, a curated festival, and a technology platform.
          </p>
          <p style={{ fontSize: 16, lineHeight: 1.7, color: "var(--fg-dim)", marginBottom: 16 }}>
            The first stage is traction: viewers, creators, submissions, screenings, and original films.
          </p>
          <p style={{ fontSize: 16, lineHeight: 1.7, color: "var(--fg-dim)" }}>
            The next stage is platform: creator profiles, film discovery, funding tools, monetization, and AI-assisted production workflows.
          </p>
        </section>

        {/* 5. FINAL CTA SECTION */}
        <section style={{ 
          borderTop: "1px solid rgba(255,255,255,0.06)", 
          paddingTop: 60,
          textAlign: "center"
        }}>
          <h2 style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: 48, color: "#fff", marginBottom: 16 }}>
            Help shape the first home for short-form AI cinema.
          </h2>
          <div style={{ display: "flex", gap: 14, justifyContent: "center", flexWrap: "wrap", marginTop: 24 }}>
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
              Watch Rootsapiens Trailer
            </button>
          </div>
        </section>

      </div>
      <PlatformFooter />
    </div>
  );
}
