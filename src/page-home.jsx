import React from 'react';
import { useNavigate } from 'react-router-dom';
import { VideoCard, CreatorCard } from './platform-cards.jsx';
import { PlatformFooter } from './platform-nav.jsx';

export function HomePage({ user, onLogin }) {
  const navigate = useNavigate();
  const videos = window.VIDEOS || [];
  const creators = window.CREATORS || [];
  const challenges = window.CHALLENGES || [];
  const openChallenge = challenges.find(c => c.status === "open") || challenges[0];

  return (
    <div style={{ paddingTop: 0, background: '#0a0a0a', color: '#ffffff' }}>
      
      {/* 1. HERO SECTION */}
      <section style={{
        minHeight: "90vh", display: "flex", flexDirection: "column", justifyContent: "center",
        padding: "120px 56px 80px", position: "relative", overflow: "hidden",
      }}>
        {/* Cinematic Background Grid */}
        <div style={{ position: "absolute", inset: 0, zIndex: 0, overflow: "hidden" }}>
          <div style={{
            position: "absolute", inset: 0,
            background: "linear-gradient(180deg, rgba(10,10,10,0.0) 0%, rgba(10,10,10,0.85) 60%, #0a0a0a 100%)",
            zIndex: 2,
          }} />
          <div style={{
            position: "absolute", inset: 0,
            background: "radial-gradient(ellipse at 75% 45%, rgba(229,9,20,0.1), transparent 60%)",
            zIndex: 1,
          }} />
          {/* Floating video thumbnails for high-end cinematic feel */}
          <div style={{ position: "absolute", right: 0, top: 0, bottom: 0, width: "50%", display: "grid", gridTemplateColumns: "1fr 1fr", gridTemplateRows: "1fr 1fr 1fr", gap: 4, opacity: 0.5, zIndex: 0 }}>
            {videos.slice(0, 6).map((v) => (
              <div key={v.id} style={{ position: "relative", overflow: "hidden", background: "#111" }}>
                {v.panel && <img src={v.panel} alt={v.title} style={{ position: "absolute", inset: 0, width: "100%", height: "100%", objectFit: "cover" }} />}
                <div style={{ position: "absolute", inset: 0, background: "linear-gradient(180deg, transparent 40%, rgba(0,0,0,0.8))" }} />
              </div>
            ))}
          </div>
        </div>

        <div style={{ position: "relative", zIndex: 3, maxWidth: 720 }}>
          <div style={{ fontSize: 11, letterSpacing: "0.25em", textTransform: "uppercase", color: "var(--accent)", marginBottom: 24, fontWeight: 700 }}>
            ● NOW OPEN · {openChallenge?.title || "CINEMA CHALLENGES"}
          </div>
          <h1 style={{
            fontFamily: "'Bebas Neue', sans-serif", fontWeight: 400,
            fontSize: "clamp(54px, 8vw, 110px)", lineHeight: 0.9, letterSpacing: "0.01em",
            color: "#fff", marginBottom: 28, textWrap: "balance",
          }}>
            The platform layer for<br />
            <span style={{ color: "var(--accent)" }}>AI-Native Cinema.</span>
          </h1>
          <p style={{ fontSize: 18, lineHeight: 1.5, color: "var(--fg-dim)", maxWidth: "54ch", marginBottom: 40 }}>
            Publish cinematic AI shorts, share the workflow behind them, build an audience, and receive direct creator support.
          </p>
          <div style={{ fontSize: 13, color: "#777", marginBottom: 28, fontStyle: "italic" }}>
            Built for AI-native filmmakers, cinematic storytellers, and experimental creators.
          </div>
          <div style={{ display: "flex", gap: 14, flexWrap: "wrap" }}>
            <button onClick={() => navigate("/upload")} style={{
              background: "#fff", color: "#000", padding: "14px 28px",
              fontSize: 15, fontWeight: 700, borderRadius: 4, border: "none", cursor: "pointer",
            }}>Publish Your Film</button>
            <button onClick={() => navigate("/explore")} style={{
              background: "rgba(109,109,110,0.4)", color: "#fff", padding: "14px 28px",
              fontSize: 15, fontWeight: 700, borderRadius: 4, border: "none", cursor: "pointer",
            }}>Explore AI Cinema</button>
          </div>
        </div>
      </section>

      {/* 2. THE PROBLEM SECTION */}
      <section style={{ padding: "100px 56px", borderTop: "1px solid #1a1a1a", background: "#0d0d0d" }}>
        <div style={{ maxWidth: 1000, margin: "0 auto" }}>
          <div style={{ fontSize: 11, letterSpacing: "0.2em", textTransform: "uppercase", color: "var(--accent)", marginBottom: 16, fontWeight: 700 }}>
            THE FRAGMENTED ECOSYSTEM
          </div>
          <h2 style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: 56, lineHeight: 1.0, marginBottom: 40, letterSpacing: "0.01em" }}>
            AI video is exploding. The ecosystem around it is fragmented.
          </h2>
          <p style={{ fontSize: 18, color: "var(--fg-dim)", marginBottom: 40 }}>
            Creators can generate stunning cinematic clips, but they still lack:
          </p>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))", gap: 20, marginBottom: 50 }}>
            {[
              { title: "A Dedicated Home", desc: "No central platform built for AI-native short films, pilots, episodes, and cinematic IP." },
              { title: "Audience Validation", desc: "No way to prove genuine audience interest and demand before spending resources on longer production." },
              { title: "Monetization Paths", desc: "Lack of direct backing beyond scattered ad platforms, tips, and external hubs." },
              { title: "Production Knowledge", desc: "No transparent library of real generation parameters and production workflow steps." }
            ].map((p, i) => (
              <div key={i} style={{ padding: 24, background: "#141414", border: "1px solid #222", borderRadius: 4 }}>
                <div style={{ fontSize: 18, fontWeight: 700, color: "#fff", marginBottom: 12 }}>{p.title}</div>
                <div style={{ fontSize: 14, color: "#888", lineHeight: 1.5 }}>{p.desc}</div>
              </div>
            ))}
          </div>
          <div style={{ fontSize: 20, fontWeight: 600, color: "#fff", borderLeft: "3px solid var(--accent)", paddingLeft: 16 }}>
            The problem is not making AI video. The problem is turning AI video into audience-tested stories.
          </div>
        </div>
      </section>

      {/* 3. PRODUCT LOOP SECTION */}
      <section style={{ padding: "100px 56px", borderTop: "1px solid #1a1a1a" }}>
        <div style={{ maxWidth: 1000, margin: "0 auto" }}>
          <div style={{ fontSize: 11, letterSpacing: "0.2em", textTransform: "uppercase", color: "var(--accent)", marginBottom: 16, fontWeight: 700 }}>
            THE LIFECYCLE
          </div>
          <h2 style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: 56, lineHeight: 1.0, marginBottom: 48, letterSpacing: "0.01em" }}>
            From AI clip to audience-tested IP.
          </h2>
          <div style={{ position: "relative" }}>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: 24 }}>
              {[
                { step: "01", title: "Publish Short", desc: "Creator publishes a cinematic short on the platform." },
                { step: "02", title: "Attach Workflow", desc: "Creator attaches detailed tool, cost, prompt, and version metadata." },
                { step: "03", title: "Discovery", desc: "Viewers discover the film in a curated, high-fidelity discovery feed." },
                { step: "04", title: "Learn & Follow", desc: "Viewers analyze production steps and follow their favorite creators." },
                { step: "05", title: "Direct Support", desc: "Audience backers support creators directly with direct backing." },
                { step: "06", title: "Validate IP", desc: "Validated projects transition to reward-based episode or pilot campaigns." },
                { step: "07", title: "Expand", desc: "Creators produce and publish next parts back into the Madtape feed." }
              ].map((s, i) => (
                <div key={i} style={{ padding: 20, background: "#111", border: "1px solid #1f1f1f", borderRadius: 4, position: "relative" }}>
                  <div style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: 48, color: "rgba(229,9,20,0.15)", marginBottom: 8 }}>{s.step}</div>
                  <div style={{ fontSize: 15, fontWeight: 700, color: "#fff", marginBottom: 8 }}>{s.title}</div>
                  <div style={{ fontSize: 12, color: "#888", lineHeight: 1.5 }}>{s.desc}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* 4. WORKFLOW TRANSPARENCY SECTION */}
      <section style={{ padding: "100px 56px", borderTop: "1px solid #1a1a1a", background: "#0d0d0d" }}>
        <div style={{ maxWidth: 1000, margin: "0 auto", display: "grid", gridTemplateColumns: "1fr 1fr", gap: 64, alignItems: "center" }}>
          <div>
            <div style={{ fontSize: 11, letterSpacing: "0.2em", textTransform: "uppercase", color: "var(--accent)", marginBottom: 16, fontWeight: 700 }}>
              PRODUCTION METADATA
            </div>
            <h2 style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: 56, lineHeight: 1.0, marginBottom: 24, letterSpacing: "0.01em" }}>
              Every film has a workflow.
            </h2>
            <p style={{ fontSize: 18, color: "#fff", fontWeight: 500, marginBottom: 20 }}>
              Madtape turns AI cinema from passive viewing into a transparent production knowledge layer.
            </p>
            <p style={{ fontSize: 14, color: "var(--fg-dim)", lineHeight: 1.6, marginBottom: 28 }}>
              Each published film can carry its production metadata: tools, models, prompts, steps, time, cost, versions, and creator notes. The more creators publish workflows, the stronger the learning network becomes.
            </p>
            <button onClick={() => navigate("/explore")} style={{
              background: "none", color: "#fff", padding: "12px 24px",
              fontSize: 14, fontWeight: 600, borderRadius: 4, border: "1px solid rgba(255,255,255,0.3)",
              cursor: "pointer",
            }}>View Published Workflows</button>
          </div>
          <div style={{ background: "#141414", border: "1px solid #222", padding: 32, borderRadius: 8 }}>
            <div style={{ fontSize: 12, color: "#777", textTransform: "uppercase", letterSpacing: "0.1em", marginBottom: 16 }}>Workflow Metadata HUD Preview</div>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16, fontSize: 13 }}>
              {[
                ["AI Model", "Seedance 2.0 (Dynamic)"],
                ["Total Renders", "45 scene attempts"],
                ["Generation Cost", "Estimated €4.50"],
                ["Tools Used", "Seedance, Kling, Luma"],
                ["Duration", "15 Seconds"],
                ["Creator Notes", "Custom camera pathing via prompt weights"]
              ].map(([k, v]) => (
                <div key={k} style={{ borderBottom: "1px solid #222", paddingBottom: 8 }}>
                  <div style={{ color: "#777", fontSize: 11, marginBottom: 4 }}>{k}</div>
                  <div style={{ color: "#fff", fontWeight: 600 }}>{v}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* 5. CREATOR SUPPORT SECTION */}
      <section style={{ padding: "100px 56px", borderTop: "1px solid #1a1a1a" }}>
        <div style={{ maxWidth: 1000, margin: "0 auto", display: "grid", gridTemplateColumns: "1fr 1fr", gap: 64, alignItems: "center" }}>
          <div>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
              {creators.slice(0, 4).map(c => (
                <CreatorCard key={c.id} creator={c} onOpen={() => navigate("/profile/" + c.id)} />
              ))}
            </div>
          </div>
          <div>
            <div style={{ fontSize: 11, letterSpacing: "0.2em", textTransform: "uppercase", color: "var(--accent)", marginBottom: 16, fontWeight: 700 }}>
              CREATOR REVENUE
            </div>
            <h2 style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: 56, lineHeight: 1.0, marginBottom: 24, letterSpacing: "0.01em" }}>
              Direct Creator Support.
            </h2>
            <p style={{ fontSize: 16, color: "var(--fg-dim)", lineHeight: 1.6, marginBottom: 24 }}>
              Supporters can directly back their favorite filmmakers on the platform. Madtape uses a community-first split to keep creators sustainable.
            </p>
            <div style={{ background: "#111", border: "1px solid #1f1f1f", padding: 24, borderRadius: 4, marginBottom: 24 }}>
              <div style={{ fontSize: 24, fontFamily: "'Bebas Neue', sans-serif", color: "#fff", marginBottom: 8 }}>95% / 5% Platform Fee Split</div>
              <div style={{ fontSize: 13, color: "#888", lineHeight: 1.5 }}>
                Creators receive 95% of the platform support split. Madtape takes a clearly disclosed 5% platform fee. Payment processing fees, refunds, taxes, and legal deductions may apply.
              </div>
            </div>
            <div style={{ fontSize: 12, color: "#777" }}>
              * Payments are currently disabled during the beta preview.
            </div>
          </div>
        </div>
      </section>

      {/* 6. PUBLISHING PLANS SECTION */}
      <section style={{ padding: "100px 56px", borderTop: "1px solid #1a1a1a", background: "#0d0d0d" }}>
        <div style={{ maxWidth: 1000, margin: "0 auto" }}>
          <div style={{ textAlign: "center", marginBottom: 48 }}>
            <div style={{ fontSize: 11, letterSpacing: "0.2em", textTransform: "uppercase", color: "var(--accent)", marginBottom: 16, fontWeight: 700 }}>
              MEMBERSHIPS
            </div>
            <h2 style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: 56, lineHeight: 1.0, marginBottom: 18, letterSpacing: "0.01em" }}>
              Creator Publishing Plans
            </h2>
            <p style={{ fontSize: 15, color: "#888" }}>
              Decoupling hosting and publishing from cloud compute costs.
            </p>
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))", gap: 24 }}>
            {[
              {
                title: "Free",
                price: "$0",
                features: ["Publish up to 5 films per month", "Public creator profile", "Workflow pages", "Community feed access"]
              },
              {
                title: "Creator",
                price: "$15",
                features: ["Publish up to 20 films per month", "Basic analytics", "Creator badge", "Workflow library", "Priority visibility in selected areas"]
              },
              {
                title: "Pro",
                price: "$39",
                popular: true,
                features: ["Unlimited publishing uploads", "Advanced analytics", "Challenge priority", "Priority support", "Early access to creator-support tools"]
              }
            ].map((plan, i) => (
              <div key={i} style={{
                padding: 32, background: "#141414", border: plan.popular ? "1px solid var(--accent)" : "1px solid #222",
                borderRadius: 8, display: "flex", flexDirection: "column", justifyContent: "space-between", position: "relative"
              }}>
                {plan.popular && (
                  <div style={{
                    position: "absolute", top: 12, right: 12, background: "var(--accent)", color: "#fff",
                    fontSize: 10, fontWeight: 700, padding: "2px 8px", borderRadius: 2, textTransform: "uppercase"
                  }}>Popular</div>
                )}
                <div>
                  <div style={{ fontSize: 20, fontWeight: 700, marginBottom: 8 }}>{plan.title}</div>
                  <div style={{ display: "flex", alignItems: "baseline", gap: 4, marginBottom: 24 }}>
                    <span style={{ fontSize: 36, fontFamily: "'Bebas Neue', sans-serif", color: "#fff" }}>{plan.price}</span>
                    <span style={{ fontSize: 12, color: "#777" }}>/month</span>
                  </div>
                  <ul style={{ paddingLeft: 0, listStyle: "none", display: "grid", gap: 10 }}>
                    {plan.features.map((f, fi) => (
                      <li key={fi} style={{ fontSize: 13, color: "#bbb", display: "flex", alignItems: "center", gap: 8 }}>
                        <span style={{ color: "var(--accent)" }}>✓</span> {f}
                      </li>
                    ))}
                  </ul>
                </div>
                <button onClick={() => navigate("/pricing")} style={{
                  width: "100%", padding: "10px 0", marginTop: 24, borderRadius: 4,
                  border: plan.popular ? "none" : "1px solid rgba(255,255,255,0.2)",
                  background: plan.popular ? "var(--accent)" : "none",
                  color: "#fff", fontWeight: 700, fontSize: 13, cursor: "pointer"
                }}>
                  View Pricing
                </button>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 7. OPTIONAL GENERATION SECTION */}
      <section style={{ padding: "100px 56px", borderTop: "1px solid #1a1a1a" }}>
        <div style={{ maxWidth: 800, margin: "0 auto", textAlign: "center" }}>
          <div style={{ fontSize: 11, letterSpacing: "0.2em", textTransform: "uppercase", color: "var(--accent)", marginBottom: 16, fontWeight: 700 }}>
            COMPUTE PLATFORM
          </div>
          <h2 style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: 56, lineHeight: 1.0, marginBottom: 24, letterSpacing: "0.01em" }}>
            Optional Generation Toolkit
          </h2>
          <p style={{ fontSize: 16, color: "#fff", fontWeight: 500, marginBottom: 18 }}>
            Generation is not the core product.
          </p>
          <p style={{ fontSize: 14, color: "var(--fg-dim)", lineHeight: 1.6, marginBottom: 24 }}>
            Madtape may offer optional generation tools for creators who want to render, extend, upscale, retry, or test scenes inside the platform. Generation will be priced by real compute usage. No unlimited compute. No hidden credit traps. No below-cost renders.
          </p>
          <div style={{ display: "inline-block", background: "rgba(229,9,20,0.06)", border: "1px solid rgba(229,9,20,0.2)", padding: "16px 24px", borderRadius: 4, fontSize: 13, color: "var(--accent)" }}>
            * Coming in future releases · Pricing will adapt to provider costs.
          </div>
        </div>
      </section>

      {/* 8. BETA / PAYMENT NOTICE */}
      <section style={{ padding: "80px 56px", borderTop: "1px solid #1a1a1a", background: "rgba(229,9,20,0.02)" }}>
        <div style={{ maxWidth: 800, margin: "0 auto", textAlign: "center" }}>
          <div style={{ fontSize: 18, fontWeight: 700, color: "#fff", marginBottom: 12 }}>Payments are coming soon</div>
          <p style={{ fontSize: 14, color: "var(--fg-dim)", lineHeight: 1.6, maxWidth: "60ch", margin: "0 auto" }}>
            Real Stripe Checkout transactions are disabled during this beta preview. You can explore the product, publish test content, and review workflows, but no real payment will be processed yet.
          </p>
        </div>
      </section>

      {/* 9. FINAL CTA SECTION */}
      <section style={{ padding: "100px 56px", textAlign: "center", borderTop: "1px solid #1a1a1a" }}>
        <div style={{ fontSize: 11, letterSpacing: "0.2em", textTransform: "uppercase", color: "var(--accent)", marginBottom: 16, fontWeight: 700 }}>
          JOIN THE FUTURE OF FILM
        </div>
        <h2 style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: 72, lineHeight: 0.95, marginBottom: 24, letterSpacing: "0.01em" }}>
          Together, let's shape<br />
          <span style={{ color: "var(--accent)" }}>the future of film.</span>
        </h2>
        <p style={{ fontSize: 16, color: "var(--fg-dim)", marginBottom: 36, maxWidth: "50ch", margin: "0 auto 36px", lineHeight: 1.55 }}>
          A unique opportunity for filmmakers to present their work, build a professional community, and share workflows.
        </p>
        <div style={{ display: "flex", gap: 14, justifyContent: "center", flexWrap: "wrap" }}>
          <button onClick={() => navigate("/upload")} style={{ background: "#fff", color: "#000", padding: "14px 32px", fontSize: 15, fontWeight: 700, borderRadius: 4, border: "none", cursor: "pointer" }}>
            Publish Your Film
          </button>
          <button onClick={() => navigate("/explore")} style={{ background: "rgba(109,109,110,0.4)", color: "#fff", padding: "14px 32px", fontSize: 15, fontWeight: 700, borderRadius: 4, border: "none", cursor: "pointer" }}>
            Explore AI Cinema
          </button>
        </div>
      </section>

      <PlatformFooter />
    </div>
  );
}
window.HomePage = HomePage;
