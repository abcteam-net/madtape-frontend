import React from 'react';
import { useNavigate, useParams, Link, useLocation } from 'react-router-dom';
import { VideoCard, CreatorCard } from './platform-cards.jsx';
import { PlatformFooter } from './platform-nav.jsx';
// Madtape AI — Homepage

export function HomePage({ user, onLogin }) {
  const navigate = useNavigate();
  const videos = window.VIDEOS || [];
  const challenges = window.CHALLENGES || [];
  const openChallenge = challenges.find(c => c.status === "open") || challenges[0];

  return (
    <div style={{ paddingTop: 0 }}>
      {/* ── HERO ── */}
      <section style={{
        minHeight: "100vh", display: "flex", flexDirection: "column", justifyContent: "center",
        padding: "120px 56px 80px", position: "relative", overflow: "hidden",
      }}>
        {/* Cinematic bg grid */}
        <div style={{ position: "absolute", inset: 0, zIndex: 0, overflow: "hidden" }}>
          <div style={{
            position: "absolute", inset: 0,
            background: "linear-gradient(180deg, rgba(10,10,10,0.0) 0%, rgba(10,10,10,0.85) 60%, #0a0a0a 100%)",
            zIndex: 2,
          }} />
          <div style={{
            position: "absolute", inset: 0,
            background: "radial-gradient(ellipse at 70% 40%, rgba(229,9,20,0.08), transparent 60%)",
            zIndex: 1,
          }} />
          {/* Floating video thumbnails */}
          <div style={{ position: "absolute", right: 0, top: 0, bottom: 0, width: "52%", display: "grid", gridTemplateColumns: "1fr 1fr", gridTemplateRows: "1fr 1fr 1fr", gap: 3, opacity: 0.6, zIndex: 0 }}>
            {videos.slice(0, 6).map((v, i) => (
              <div key={v.id} style={{ position: "relative", overflow: "hidden", background: "#111" }}>
                {v.panel && <img src={v.panel} alt={v.title} style={{ position: "absolute", inset: 0, width: "100%", height: "100%", objectFit: "cover", objectPosition: "center" }} />}
                <div style={{ position: "absolute", inset: 0, background: "linear-gradient(180deg, transparent 50%, rgba(0,0,0,0.75))" }} />
                <div style={{ position: "absolute", bottom: 8, left: 10, fontFamily: "'Bebas Neue', sans-serif", fontSize: 14, color: "rgba(255,255,255,0.9)", letterSpacing: "0.01em" }}>{v.title}</div>
              </div>
            ))}
          </div>
        </div>

        <div style={{ position: "relative", zIndex: 3, maxWidth: 680 }}>
          <div style={{ fontSize: 11, letterSpacing: "0.2em", textTransform: "uppercase", color: "var(--accent)", marginBottom: 20, fontWeight: 700 }}>
            ● Now Open · {openChallenge?.title}
          </div>
          <h1 style={{
            fontFamily: "'Bebas Neue', sans-serif", fontWeight: 400,
            fontSize: "clamp(64px, 9vw, 136px)", lineHeight: 0.88, letterSpacing: "0.005em",
            color: "#fff", marginBottom: 28, textWrap: "balance",
          }}>
            Transforming<br /><span style={{ color: "var(--accent)" }}>film & media</span><br />production.
          </h1>
          <p style={{ fontSize: 18, lineHeight: 1.5, color: "#b3b3b3", maxWidth: "52ch", marginBottom: 36 }}>
            Madtape is an innovative streaming platform dedicated to promoting film students and emerging talent. Upload your AI film, join creative challenges, and get discovered by a community shaping the future of cinema.
          </p>
          <div style={{ display: "flex", gap: 12, flexWrap: "wrap" }}>
            <button onClick={() => navigate("/upload")} style={{
              background: "#fff", color: "#000", padding: "14px 28px",
              fontSize: 15, fontWeight: 700, borderRadius: 4, border: "none", cursor: "pointer",
              display: "flex", alignItems: "center", gap: 8,
            }}>↑ Upload Your Film</button>
            <button onClick={() => navigate("/explore")} style={{
              background: "rgba(109,109,110,0.6)", color: "#fff", padding: "14px 28px",
              fontSize: 15, fontWeight: 700, borderRadius: 4, border: "none", cursor: "pointer",
            }}>ⓘ Explore AI Films</button>
            <button onClick={() => navigate("/challenges")} style={{
              background: "none", color: "#fff", padding: "14px 28px",
              fontSize: 15, fontWeight: 600, borderRadius: 4, border: "1px solid rgba(255,255,255,0.25)", cursor: "pointer",
            }}>This Week's Challenge →</button>
          </div>
          <div style={{ display: "flex", gap: 32, marginTop: 48, paddingTop: 32, borderTop: "1px solid rgba(255,255,255,0.1)" }}>
            {[["16K+","Films uploaded"],["3.2K","Emerging creators"],["48+","Countries"],["4","AI models"]].map(([v, l]) => (
              <div key={l}>
                <div style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: 36, lineHeight: 1, color: "#fff" }}>{v}</div>
                <div style={{ fontSize: 11, color: "#777", marginTop: 4, letterSpacing: "0.08em", textTransform: "uppercase" }}>{l}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── FEATURED FILMS RAIL ── */}
      <section style={{ padding: "0 0 60px" }}>
        <div style={{ padding: "0 56px", marginBottom: 20, display: "flex", justifyContent: "space-between", alignItems: "baseline" }}>
          <h2 style={{ fontSize: 22, fontWeight: 700 }}>Featured AI Films</h2>
          <a href="#" onClick={(e) => { e.preventDefault(); navigate("/explore"); }} style={{ fontSize: 13, color: "#b3b3b3", textDecoration: "none" }}>Browse all →</a>
        </div>
        <div style={{ display: "flex", gap: 8, padding: "20px 56px 40px", overflowX: "auto", scrollbarWidth: "none" }}>
          {videos.filter(v => v.featured).map(v => (
            <VideoCard key={v.id} video={v} onOpen={() => navigate("/video/" + v.id)} size="md" />
          ))}
        </div>
      </section>

      {/* ── CHALLENGE CALLOUT ── */}
      {openChallenge && (
        <section style={{ padding: "60px 56px", background: "rgba(229,9,20,0.04)", borderTop: "1px solid rgba(229,9,20,0.12)", borderBottom: "1px solid rgba(229,9,20,0.12)" }}>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 64, alignItems: "center" }}>
            <div>
              <div style={{ fontSize: 10, letterSpacing: "0.2em", textTransform: "uppercase", color: "var(--accent)", fontWeight: 700, marginBottom: 14, display: "flex", alignItems: "center", gap: 8 }}>
                <span style={{ width: 6, height: 6, borderRadius: "50%", background: "var(--accent)", display: "inline-block", animation: "pulse 1.6s infinite" }} />
                This Week's Challenge · {openChallenge.daysLeft} days left
              </div>
              <h2 style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: 64, lineHeight: 0.9, marginBottom: 18, letterSpacing: "0.005em" }}>{openChallenge.title}</h2>
              <p style={{ fontSize: 16, color: "#b3b3b3", lineHeight: 1.5, maxWidth: "44ch", marginBottom: 28 }}>{openChallenge.brief}</p>
              <div style={{ display: "flex", gap: 16, fontSize: 13, color: "#777", marginBottom: 28 }}>
                <span>🏆 {openChallenge.prize.split("·")[0]}</span>
                <span>· {openChallenge.entries} entries</span>
                <span>· {openChallenge.maxDuration} max</span>
              </div>
              <button onClick={() => navigate("/challenges")} style={{
                background: "var(--accent)", color: "#fff", padding: "12px 24px",
                fontSize: 14, fontWeight: 700, borderRadius: 4, border: "none", cursor: "pointer",
              }}>Submit Your Entry →</button>
            </div>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8 }}>
              {(window.VIDEOS || []).filter(v => v.challengeTag).slice(0, 4).map(v => (
                <div key={v.id} onClick={() => navigate("/video/" + v.id)} style={{ aspectRatio: "16/9", borderRadius: 4, overflow: "hidden", cursor: "pointer", position: "relative", background: "#111" }}>
                  {v.panel && <img src={v.panel} alt={v.title} style={{ position: "absolute", inset: 0, width: "100%", height: "100%", objectFit: "cover", objectPosition: "center" }} />}
                  <div style={{ position: "absolute", inset: 0, background: "linear-gradient(180deg, transparent 50%, rgba(0,0,0,0.7))" }} />
                  <div style={{ position: "absolute", bottom: 6, left: 8, right: 8, fontSize: 11, fontWeight: 600, color: "#fff", lineHeight: 1.1 }}>{v.title}</div>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* ── HOW IT WORKS ── */}
      <section style={{ padding: "80px 56px" }}>
        <div style={{ textAlign: "center", marginBottom: 56 }}>
          <div style={{ fontSize: 10, letterSpacing: "0.2em", textTransform: "uppercase", color: "var(--accent)", marginBottom: 12, fontWeight: 700 }}>From prompt to premiere</div>
          <h2 style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: 64, lineHeight: 0.9, letterSpacing: "0.005em" }}>How it works.</h2>
        </div>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 0, borderTop: "1px solid rgba(255,255,255,0.08)", borderLeft: "1px solid rgba(255,255,255,0.08)" }}>
          {[
            { n:"01", t:"Upload", d:"Upload your 15-second AI film in widescreen format. Shorts must be 4–15 seconds. Features 1h 45m minimum." },
            { n:"02", t:"Publish", d:"Add title, prompt, model used, category, and creator credits. Submit for moderation review." },
            { n:"03", t:"Compete", d:"Join weekly challenges and rank by views, likes, jury picks, and originality." },
            { n:"04", t:"Get Discovered", d:"Build your creator profile and gain visibility through featured collections and leaderboards." },
          ].map((s) => (
            <div key={s.n} style={{
              borderRight: "1px solid rgba(255,255,255,0.08)",
              borderBottom: "1px solid rgba(255,255,255,0.08)",
              padding: "36px 32px",
            }}>
              <div style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: 80, lineHeight: 1, color: "rgba(229,9,20,0.18)", marginBottom: 12 }}>{s.n}</div>
              <div style={{ fontSize: 22, fontWeight: 700, marginBottom: 10 }}>{s.t}</div>
              <div style={{ fontSize: 14, color: "#777", lineHeight: 1.55 }}>{s.d}</div>
            </div>
          ))}
        </div>
      </section>

      {/* ── EMERGING TALENT SECTION ── */}
      <section style={{ padding: "60px 56px 80px", borderTop: "1px solid rgba(255,255,255,0.07)", borderBottom: "1px solid rgba(255,255,255,0.07)" }}>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 0, border: "1px solid rgba(255,255,255,0.08)", borderRadius: 8, overflow: "hidden" }}>
          {[
            { icon: "🎓", title: "Film Students", body: "Madtape is built for students in film, media, and creative technology programs. Publish your thesis film, short, or experiment — and build a real professional portfolio.", cta: "Submit your student film" },
            { icon: "🌍", title: "Cultural Exchange", body: "We believe cinema is a universal language. Madtape connects filmmakers across 48+ countries, creating a living archive of global AI-assisted creative expression.", cta: "Join the community" },
            { icon: "⭐", title: "Emerging Talent", body: "Every week, Madtape editors spotlight breakthrough work. If you're early in your filmmaking career, this is the stage — your first film could be the one that gets you discovered.", cta: "See this week's picks" },
          ].map((item, i) => (
            <div key={item.title} style={{ padding: "36px 32px", borderRight: i < 2 ? "1px solid rgba(255,255,255,0.08)" : "none", background: "rgba(255,255,255,0.02)" }}>
              <div style={{ fontSize: 32, marginBottom: 18 }}>{item.icon}</div>
              <div style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: 30, lineHeight: 1, marginBottom: 12, letterSpacing: "0.005em" }}>{item.title}</div>
              <p style={{ fontSize: 14, color: "#b3b3b3", lineHeight: 1.6, marginBottom: 20 }}>{item.body}</p>
              <a href="#" onClick={(e) => { e.preventDefault(); navigate("/explore"); }} style={{ fontSize: 12, color: "var(--accent)", letterSpacing: "0.08em", textTransform: "uppercase", fontWeight: 700 }}>{item.cta} →</a>
            </div>
          ))}
        </div>
      </section>

      {/* ── CREATOR BENEFITS ── */}
      <section style={{ padding: "60px 56px 80px", borderTop: "1px solid rgba(255,255,255,0.07)" }}>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 80, alignItems: "center" }}>
          <div>
            <div style={{ fontSize: 10, letterSpacing: "0.2em", textTransform: "uppercase", color: "#777", marginBottom: 14, fontWeight: 600 }}>For filmmakers at every stage</div>
            <h2 style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: 64, lineHeight: 0.9, marginBottom: 24, letterSpacing: "0.005em" }}>A stage for emerging talent.</h2>
            <p style={{ fontSize: 16, color: "#b3b3b3", lineHeight: 1.55, marginBottom: 32 }}>
              Madtape gives every filmmaker a profile, portfolio, challenge history, and a public archive of their best work. A unique opportunity to present your films, grow professionally, and connect with a global creative community.
            </p>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
              {["Creator profile + badge system","Weekly creative challenges","Revenue share on featured films","Prompt disclosure archive","Global leaderboard","Student spotlight programme"].map(b => (
                <div key={b} style={{ display: "flex", alignItems: "flex-start", gap: 8, fontSize: 13, color: "#b3b3b3" }}>
                  <span style={{ color: "#46d369", flexShrink: 0, marginTop: 1 }}>✓</span>{b}
                </div>
              ))}
            </div>
            <button onClick={() => navigate("/upload")} style={{
              background: "none", color: "#fff", padding: "12px 24px",
              fontSize: 13, fontWeight: 600, borderRadius: 4, border: "1px solid rgba(255,255,255,0.3)",
              cursor: "pointer", marginTop: 32,
            }}>Start uploading free →</button>
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10 }}>
            {(window.CREATORS || []).slice(0, 4).map(c => (
              <CreatorCard key={c.id} creator={c} onOpen={() => navigate("/profile/" + c.id)} />
            ))}
          </div>
        </div>
      </section>

      {/* ── PRICING PREVIEW ── */}
      <section style={{ padding: "60px 56px 80px", background: "rgba(0,0,0,0.4)", borderTop: "1px solid rgba(255,255,255,0.07)" }}>
        <div style={{ textAlign: "center", marginBottom: 48 }}>
          <h2 style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: 56, lineHeight: 0.9, marginBottom: 14, letterSpacing: "0.005em" }}>Generate with Seedance. Publish on Madtape.</h2>
          <p style={{ fontSize: 16, color: "#b3b3b3", maxWidth: "52ch", margin: "0 auto 28px" }}>Use credits to create short cinematic AI videos directly inside the platform. Generation is controlled, transparent, and designed for serious creators.</p>
          <div style={{ display: "flex", gap: 24, justifyContent: "center", fontSize: 13, color: "#777", marginBottom: 40 }}>
            {[["Free","Upload only"],["€9/mo","10 credits"],["€29/mo","40 credits"],["€79/mo","120 credits"]].map(([p, c]) => (
              <div key={p} style={{ textAlign: "center" }}>
                <div style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: 28, color: "#fff" }}>{p}</div>
                <div style={{ fontSize: 11, color: "#777", marginTop: 2 }}>{c}</div>
              </div>
            ))}
          </div>
          <button onClick={() => navigate("/pricing")} style={{
            background: "var(--accent)", color: "#fff", padding: "12px 28px",
            fontSize: 14, fontWeight: 700, borderRadius: 4, border: "none", cursor: "pointer",
          }}>See full pricing →</button>
        </div>
      </section>

      {/* ── FINAL CTA ── */}
      <section style={{ padding: "80px 56px", textAlign: "center", borderTop: "1px solid rgba(255,255,255,0.07)" }}>
        <div style={{ fontSize: 10, letterSpacing: "0.2em", textTransform: "uppercase", color: "var(--accent)", marginBottom: 16, fontWeight: 700 }}>Join the future of film</div>
        <h2 style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: 80, lineHeight: 0.9, marginBottom: 20, letterSpacing: "0.005em" }}>
          Together, let's shape<br /><span style={{ color: "var(--accent)" }}>the future of film.</span>
        </h2>
        <p style={{ fontSize: 17, color: "#b3b3b3", marginBottom: 36, maxWidth: "48ch", margin: "0 auto 36px" }}>A unique opportunity for filmmakers to present their work, build a professional community, and support student growth. This week's challenge closes in {openChallenge?.daysLeft} days.</p>
        <div style={{ display: "flex", gap: 12, justifyContent: "center" }}>
          <button onClick={() => navigate("/upload")} style={{ background: "#fff", color: "#000", padding: "14px 32px", fontSize: 15, fontWeight: 700, borderRadius: 4, border: "none", cursor: "pointer" }}>↑ Upload Your Film</button>
          <button onClick={() => navigate("/explore")} style={{ background: "rgba(109,109,110,0.5)", color: "#fff", padding: "14px 32px", fontSize: 15, fontWeight: 700, borderRadius: 4, border: "none", cursor: "pointer" }}>Explore Films</button>
        </div>
      </section>

      <PlatformFooter />
    </div>
  );
}
window.HomePage = HomePage;
