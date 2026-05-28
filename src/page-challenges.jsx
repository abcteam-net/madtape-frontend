import React from 'react';
import { useNavigate, useParams, Link, useLocation } from 'react-router-dom';
import { ChallengeCard, VideoGrid } from './platform-cards.jsx';
import { PlatformFooter } from './platform-nav.jsx';
// Madtape AI — Challenges page + detail

const { useState: useCh } = React;

export function ChallengesPage({ }) {
  const navigate = useNavigate();
  const [selected, setSelected] = useCh(null);
  const challenges = window.CHALLENGES || [];

  if (selected) {
    const ch = challenges.find(c => c.id === selected);
    return ch ? <ChallengeDetail challenge={ch} onBack={() => setSelected(null)} /> : null;
  }

  const open = challenges.filter(c => c.status === "open" || c.status === "closing");
  const active = challenges.filter(c => c.status === "voting" || c.status === "judging");
  const closed = challenges.filter(c => c.status === "closed");
  const statusColors = { open:"#46d369", closing:"#f5c518", voting:"#5851db", closed:"#555", judging:"#C8956C" };

  return (
    <div style={{ paddingTop: 80 }}>
      <div style={{ padding: "40px 56px 0" }}>
        <div style={{ fontSize: 10, letterSpacing: "0.2em", textTransform: "uppercase", color: "var(--accent)", marginBottom: 14, fontWeight: 700 }}>Creative competitions</div>
        <h1 style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: 72, lineHeight: 0.88, letterSpacing: "0.005em", marginBottom: 16 }}>Challenges.</h1>
        <p style={{ fontSize: 16, color: "#b3b3b3", maxWidth: "52ch", marginBottom: 48 }}>
          Weekly themes. Real prizes. Submit your 15-second AI film, earn votes, and compete for visibility, badges, and creator recognition.
        </p>
      </div>

      {/* Open challenges */}
      {open.length > 0 && (
        <div style={{ padding: "0 56px 48px" }}>
          <div style={{ fontSize: 11, letterSpacing: "0.16em", textTransform: "uppercase", color: "#777", marginBottom: 20, fontWeight: 600 }}>Open Now</div>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(2, 1fr)", gap: 16 }}>
            {open.map(ch => (
              <div key={ch.id} onClick={() => setSelected(ch.id)} style={{
                background: "rgba(255,255,255,0.04)", border: `1px solid rgba(255,255,255,0.08)`,
                borderRadius: 8, overflow: "hidden", cursor: "pointer",
                display: "grid", gridTemplateColumns: "4px 1fr",
                transition: "border-color 180ms",
              }}
                onMouseEnter={e => e.currentTarget.style.borderColor = "rgba(229,9,20,0.4)"}
                onMouseLeave={e => e.currentTarget.style.borderColor = "rgba(255,255,255,0.08)"}
              >
                <div style={{ background: ch.color }} />
                <div style={{ padding: "28px 28px 24px" }}>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 12 }}>
                    <span style={{ fontSize: 10, fontWeight: 700, letterSpacing: "0.16em", textTransform: "uppercase", color: statusColors[ch.status], display: "flex", alignItems: "center", gap: 6 }}>
                      <span style={{ width: 6, height: 6, borderRadius: "50%", background: statusColors[ch.status], display: "inline-block" }} />
                      {ch.status === "closing" ? "CLOSING SOON" : ch.status.toUpperCase()}
                    </span>
                    <span style={{ fontSize: 12, color: "#777" }}>{ch.daysLeft > 0 ? `${ch.daysLeft}d left` : "Deadline passed"}</span>
                  </div>
                  <div style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: 38, lineHeight: 0.95, color: "#fff", marginBottom: 10 }}>{ch.title}</div>
                  <p style={{ fontSize: 14, color: "#b3b3b3", lineHeight: 1.45, marginBottom: 20 }}>{ch.brief}</p>
                  <div style={{ display: "flex", gap: 24, fontSize: 13, color: "#777", paddingTop: 16, borderTop: "1px solid rgba(255,255,255,0.07)" }}>
                    <span><b style={{ color: "#fff" }}>{ch.entries}</b> entries</span>
                    <span>🏆 {ch.prize.split("·")[0]}</span>
                    <span style={{ marginLeft: "auto", color: "var(--accent)", fontWeight: 600 }}>Enter →</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Voting/Judging */}
      {active.length > 0 && (
        <div style={{ padding: "0 56px 48px", borderTop: "1px solid rgba(255,255,255,0.07)" }}>
          <div style={{ fontSize: 11, letterSpacing: "0.16em", textTransform: "uppercase", color: "#777", marginBottom: 20, fontWeight: 600, marginTop: 40 }}>Voting & Judging</div>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 14 }}>
            {active.map(ch => <ChallengeCard key={ch.id} challenge={ch} onOpen={() => setSelected(ch.id)} />)}
          </div>
        </div>
      )}

      {/* Closed */}
      {closed.length > 0 && (
        <div style={{ padding: "0 56px 80px", borderTop: "1px solid rgba(255,255,255,0.07)" }}>
          <div style={{ fontSize: 11, letterSpacing: "0.16em", textTransform: "uppercase", color: "#555", marginBottom: 20, fontWeight: 600, marginTop: 40 }}>Past Challenges</div>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 14 }}>
            {closed.map(ch => <ChallengeCard key={ch.id} challenge={ch} onOpen={() => setSelected(ch.id)} />)}
          </div>
        </div>
      )}

      {/* Rules strip */}
      <div style={{ margin: "0 56px 80px", padding: "28px 32px", background: "rgba(0,0,0,0.4)", border: "1px solid rgba(255,255,255,0.08)", borderRadius: 6 }}>
        <div style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: 24, marginBottom: 12, color: "#fff" }}>Challenge Rules</div>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 16, fontSize: 13, color: "#777" }}>
          <div>· 4–15 seconds, 16:9 widescreen preferred</div>
          <div>· Must be AI-generated or AI-assisted</div>
          <div>· Prompt disclosure required</div>
          <div>· No stolen copyrighted footage</div>
          <div>· One submission per creator (Free/Starter)</div>
          <div>· No hateful, sexual, or illegal content</div>
        </div>
      </div>
      <PlatformFooter />
    </div>
  );
}

function ChallengeDetail({ challenge: ch, onBack}) {
  const navigate = useNavigate();
  const entries = (window.VIDEOS || []).filter(v => v.challengeTag);
  const statusColors = { open:"#46d369", closing:"#f5c518", voting:"#5851db", closed:"#555" };

  return (
    <div style={{ paddingTop: 80 }}>
      {/* Hero */}
      <div style={{ position: "relative", padding: "60px 56px 48px", borderBottom: "1px solid rgba(255,255,255,0.08)", overflow: "hidden" }}>
        <div style={{ position: "absolute", inset: 0, background: `linear-gradient(135deg, ${ch.color}22, transparent 60%)`, zIndex: 0 }} />
        <div style={{ position: "absolute", left: 0, top: 0, bottom: 0, width: 6, background: ch.color }} />
        <div style={{ position: "relative", zIndex: 1 }}>
          <button onClick={onBack} style={{ background: "none", border: "none", color: "#777", fontSize: 13, cursor: "pointer", marginBottom: 20, display: "flex", alignItems: "center", gap: 6 }}>← Challenges</button>
          <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 16 }}>
            <span style={{ fontSize: 10, fontWeight: 700, letterSpacing: "0.16em", textTransform: "uppercase", color: statusColors[ch.status], display: "flex", alignItems: "center", gap: 6 }}>
              <span style={{ width: 7, height: 7, borderRadius: "50%", background: statusColors[ch.status], display: "inline-block" }} />
              {ch.status === "closing" ? "CLOSING SOON" : ch.status.toUpperCase()}
            </span>
            {ch.sponsor && <span style={{ fontSize: 11, color: "#777" }}>Sponsored by {ch.sponsor}</span>}
          </div>
          <h1 style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: 80, lineHeight: 0.88, letterSpacing: "0.005em", marginBottom: 20 }}>{ch.title}</h1>
          <p style={{ fontSize: 17, color: "#b3b3b3", maxWidth: "56ch", lineHeight: 1.5, marginBottom: 32 }}>{ch.brief}</p>
          <div style={{ display: "flex", gap: 12 }}>
            {(ch.status === "open" || ch.status === "closing") && (
              <button onClick={() => navigate("/upload")} style={{ background: "var(--accent)", color: "#fff", padding: "12px 24px", fontSize: 14, fontWeight: 700, borderRadius: 4, border: "none", cursor: "pointer" }}>Submit Your Entry →</button>
            )}
            <div style={{ display: "flex", gap: 24, alignItems: "center", fontSize: 13, color: "#777" }}>
              <span><b style={{ color: "#fff" }}>{ch.entries}</b> entries</span>
              <span><b style={{ color: "#fff" }}>{ch.daysLeft > 0 ? ch.daysLeft + "d" : "Closed"}</b> {ch.daysLeft > 0 ? "remaining" : ""}</span>
              <span>🏆 {ch.prize}</span>
            </div>
          </div>
        </div>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "2fr 1fr", gap: 0 }}>
        {/* Entries */}
        <div style={{ padding: "40px 56px 60px", borderRight: "1px solid rgba(255,255,255,0.07)" }}>
          <h3 style={{ fontSize: 18, fontWeight: 700, marginBottom: 24 }}>Entries · {ch.entries}</h3>
          <VideoGrid videos={entries} onOpen={(id) => navigate("/video/" + id)} cols={2} />
        </div>

        {/* Sidebar */}
        <div style={{ padding: "40px 36px 60px" }}>
          {/* Rules */}
          <div style={{ marginBottom: 36 }}>
            <div style={{ fontSize: 12, letterSpacing: "0.14em", textTransform: "uppercase", color: "#555", marginBottom: 14, fontWeight: 600 }}>Rules</div>
            {ch.rules.map((r, i) => (
              <div key={i} style={{ display: "flex", gap: 8, fontSize: 13, color: "#b3b3b3", padding: "6px 0", borderBottom: "1px solid rgba(255,255,255,0.05)" }}>
                <span style={{ color: "var(--accent)", flexShrink: 0 }}>·</span>{r}
              </div>
            ))}
          </div>
          {/* Criteria */}
          <div style={{ marginBottom: 36 }}>
            <div style={{ fontSize: 12, letterSpacing: "0.14em", textTransform: "uppercase", color: "#555", marginBottom: 14, fontWeight: 600 }}>Judging Criteria</div>
            {ch.criteria.map((c, i) => (
              <div key={i} style={{ display: "flex", justifyContent: "space-between", fontSize: 13, color: "#b3b3b3", padding: "6px 0", borderBottom: "1px solid rgba(255,255,255,0.05)" }}>
                <span>{c}</span>
                <span style={{ fontSize: 11, color: "#555" }}>✓</span>
              </div>
            ))}
          </div>
          {/* Prize */}
          <div style={{ padding: "20px", background: "rgba(229,9,20,0.07)", border: "1px solid rgba(229,9,20,0.2)", borderRadius: 6 }}>
            <div style={{ fontSize: 10, letterSpacing: "0.16em", textTransform: "uppercase", color: "var(--accent)", marginBottom: 10, fontWeight: 700 }}>Prize</div>
            <div style={{ fontSize: 15, color: "#fff", lineHeight: 1.4 }}>{ch.prize}</div>
          </div>
        </div>
      </div>
      <PlatformFooter />
    </div>
  );
}

window.ChallengesPage = ChallengesPage;
window.ChallengeDetail = ChallengeDetail;
