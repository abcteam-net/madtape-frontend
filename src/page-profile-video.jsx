import React from 'react';
import { useNavigate, useParams, Link, useLocation } from 'react-router-dom';
import { CreatorCard, VideoGrid, fmtNum, shadeHex } from './platform-cards.jsx';
import { PlatformFooter } from './platform-nav.jsx';
// Madtape AI — Creator Profile + Video Detail + Leaderboard + Creators directory

const { useState: usePV } = React;

// ── CREATOR PROFILE ───────────────────────────────────────────────────────────
export function ProfilePage() {
  const navigate = useNavigate();
  const { creatorId = "kira-motion" } = useParams();
  const [tab, setTab] = usePV("films");
  const creator = (window.CREATORS || []).find(c => c.id === creatorId) || window.CREATORS[0];
  const films = (window.VIDEOS || []).filter(v => v.creator === creator.id);

  const badgeColors = { "Challenge Winner":"#e50914","Staff Pick":"#f5c518","Top 10 Weekly":"#46d369","Early Creator":"#5851db","Seedance Creator":"#C8956C","Visual Director":"#b3b3b3","Storyteller":"#9b51e0" };

  return (
    <div style={{ paddingTop: 80, minHeight: "100vh" }}>
      {/* Hero */}
      <div style={{ position: "relative", overflow: "hidden", borderBottom: "1px solid rgba(255,255,255,0.08)" }}>
        <div style={{ height: 200, background: `linear-gradient(135deg, ${creator.color} 0%, ${shadeHex(creator.color, -50)} 100%)`, position: "relative" }}>
          <div style={{ position: "absolute", inset: 0, backgroundImage: "repeating-linear-gradient(0deg, transparent 0, transparent 2px, rgba(0,0,0,0.15) 2px, rgba(0,0,0,0.15) 3px)", mixBlendMode: "overlay" }} />
          <div style={{ position: "absolute", inset: 0, background: "linear-gradient(180deg, transparent 30%, rgba(10,10,10,0.85))" }} />
        </div>
        <div style={{ padding: "0 56px 36px", marginTop: -56, position: "relative", zIndex: 2 }}>
          <div style={{ display: "flex", alignItems: "flex-end", gap: 24, marginBottom: 20 }}>
            <div style={{
              width: 96, height: 96, borderRadius: 8, flexShrink: 0,
              background: `linear-gradient(135deg, ${creator.color}, ${shadeHex(creator.color, -50)})`,
              display: "flex", alignItems: "center", justifyContent: "center",
              border: "3px solid #0a0a0a", overflow: "hidden",
            }}>
              <img src="/icons/profile.svg" alt="" style={{ width: "100%", height: "100%", objectFit: "cover" }} />
            </div>
            <div style={{ paddingBottom: 4 }}>
              <div style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: 40, lineHeight: 0.9, marginBottom: 4 }}>{creator.name}</div>
              <div style={{ fontSize: 14, color: "#777", marginBottom: 8 }}>{creator.handle} {creator.location && `· ${creator.location}`}</div>
              <div style={{ display: "flex", gap: 6, flexWrap: "wrap" }}>
                {creator.badges.map(b => (
                  <span key={b} style={{ fontSize: 9, padding: "3px 8px", background: `${badgeColors[b] || "#555"}22`, color: badgeColors[b] || "#777", border: `1px solid ${badgeColors[b] || "#555"}55`, borderRadius: 100, letterSpacing: "0.08em", textTransform: "uppercase", fontWeight: 700 }}>{b}</span>
                ))}
              </div>
            </div>
            <div style={{ marginLeft: "auto", display: "flex", gap: 10, alignItems: "center", paddingBottom: 8 }}>
              <button style={{ background: "#fff", color: "#000", padding: "9px 20px", fontSize: 13, fontWeight: 700, borderRadius: 4, border: "none", cursor: "pointer" }}>+ Follow</button>
              <button style={{ background: "none", color: "#fff", padding: "9px 16px", fontSize: 13, borderRadius: 4, border: "1px solid rgba(255,255,255,0.2)", cursor: "pointer" }}>Share</button>
            </div>
          </div>
          <p style={{ fontSize: 14, color: "#b3b3b3", maxWidth: "56ch", lineHeight: 1.5, marginBottom: 20 }}>{creator.bio}</p>
          {/* Stats row */}
          <div style={{ display: "flex", gap: 32, fontSize: 13 }}>
            {[["Views", fmtNum(creator.views)],["Likes", fmtNum(creator.likes)],["Films", creator.films],["Challenge Wins", creator.wins],["Plan", creator.plan]].map(([l, v]) => (
              <div key={l}><b style={{ color: "#fff", fontSize: 17 }}>{v}</b> <span style={{ color: "#555", fontSize: 12 }}>{l}</span></div>
            ))}
            <div style={{ marginLeft: 8, display: "flex", gap: 6, alignItems: "center" }}>
              {creator.tools.map(t => <span key={t} style={{ fontSize: 10, padding: "2px 7px", background: "rgba(255,255,255,0.07)", borderRadius: 2, color: "#b3b3b3", border: "1px solid rgba(255,255,255,0.08)" }}>{t}</span>)}
            </div>
          </div>
        </div>
        {/* Tabs */}
        <div style={{ display: "flex", gap: 0, borderTop: "1px solid rgba(255,255,255,0.07)", padding: "0 56px" }}>
          {["films","badges","about"].map(t => (
            <button key={t} onClick={() => setTab(t)} style={{ padding: "14px 20px", background: "none", border: "none", borderBottom: tab === t ? "2px solid var(--accent)" : "2px solid transparent", color: tab === t ? "#fff" : "#777", fontSize: 13, fontWeight: tab === t ? 600 : 400, cursor: "pointer", textTransform: "capitalize" }}>{t}</button>
          ))}
        </div>
      </div>

      <div style={{ padding: "36px 56px 80px" }}>
        {tab === "films" && (
          films.length ? <VideoGrid videos={films} onOpen={(id) => navigate("/video/" + id)} cols={4} /> : <div style={{ color: "#555", fontSize: 15 }}>No films published yet.</div>
        )}
        {tab === "badges" && (
          <div style={{ display: "flex", flexWrap: "wrap", gap: 12 }}>
            {creator.badges.map(b => (
              <div key={b} style={{ padding: "20px 24px", background: "rgba(255,255,255,0.04)", border: `1px solid ${badgeColors[b] || "#555"}44`, borderRadius: 6, display: "flex", gap: 14, alignItems: "center" }}>
                <div style={{ width: 44, height: 44, borderRadius: "50%", background: `${badgeColors[b] || "#555"}33`, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 20 }}>★</div>
                <div><div style={{ fontWeight: 700, marginBottom: 3 }}>{b}</div><div style={{ fontSize: 12, color: "#777" }}>Earned by {creator.name}</div></div>
              </div>
            ))}
          </div>
        )}
        {tab === "about" && (
          <div style={{ maxWidth: 540 }}>
            <div style={{ marginBottom: 24 }}>
              <div style={{ fontSize: 11, letterSpacing: "0.14em", textTransform: "uppercase", color: "#555", marginBottom: 10, fontWeight: 600 }}>Bio</div>
              <p style={{ fontSize: 15, color: "#b3b3b3", lineHeight: 1.6 }}>{creator.bio}</p>
            </div>
            <div>
              <div style={{ fontSize: 11, letterSpacing: "0.14em", textTransform: "uppercase", color: "#555", marginBottom: 10, fontWeight: 600 }}>Preferred Tools</div>
              <div style={{ display: "flex", gap: 8 }}>
                {creator.tools.map(t => <span key={t} style={{ padding: "6px 14px", background: "rgba(255,255,255,0.06)", borderRadius: 4, fontSize: 13, color: "#b3b3b3", border: "1px solid rgba(255,255,255,0.1)" }}>{t}</span>)}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

// ── VIDEO DETAIL ──────────────────────────────────────────────────────────────
export function VideoDetailPage() {
  const navigate = useNavigate();
  const { videoId } = useParams();
  const [liked, setLiked] = usePV(false);
  const [showTip, setShowTip] = usePV(false);
  const [playing, setPlaying] = usePV(false);
  
  const video = (window.VIDEOS || []).find(v => v.id === videoId) || window.VIDEOS[0];
  const creator = (window.CREATORS || []).find(c => c.id === video.creator);
  const related = (window.VIDEOS || []).filter(v => v.id !== video.id && v.category === video.category).slice(0, 4);

  React.useEffect(() => {
    setPlaying(false);
  }, [videoId]);

  return (
    <div style={{ paddingTop: 80, minHeight: "100vh" }}>
      <div style={{ display: "grid", gridTemplateColumns: "1fr 360px", minHeight: "calc(100vh - 80px)" }}>
        {/* Main col */}
        <div style={{ borderRight: "1px solid rgba(255,255,255,0.08)" }}>
          {/* Player */}
          <div style={{ aspectRatio: "21/9", position: "relative", background: "#0a0a0a", overflow: "hidden" }}>
            {playing && (video.youtubeId || video.id) ? (
              <iframe
                src={`https://www.youtube.com/embed/${video.youtubeId || "B-lfTmZp1DE"}?autoplay=1&modestbranding=1&rel=0`}
                style={{ position: "absolute", inset: 0, width: "100%", height: "100%", border: "none" }}
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
                title={video.title}
              />
            ) : (
              <>
                {video.panel && <img src={video.panel} alt={video.title} style={{ position: "absolute", inset: 0, width: "100%", height: "100%", objectFit: "cover", objectPosition: "center" }} />}
                <div style={{ position: "absolute", inset: 0, background: "radial-gradient(circle at 50% 50%, transparent 30%, rgba(0,0,0,0.55) 100%)" }} />
                <div style={{ position: "absolute", inset: 0, background: "linear-gradient(180deg, rgba(0,0,0,0.2) 0%, transparent 40%, rgba(0,0,0,0.6) 100%)" }} />
                {/* Play button */}
                <div onClick={() => setPlaying(true)} style={{ position: "absolute", top: "50%", left: "50%", transform: "translate(-50%,-50%)", width: 72, height: 72, borderRadius: "50%", border: "2px solid rgba(255,255,255,0.9)", display: "flex", alignItems: "center", justifyContent: "center", background: "rgba(0,0,0,0.3)", cursor: "pointer", zIndex: 10 }}>
                  <img src="/icons/play%20ai%20film.svg" alt="Play" style={{ width: 32, height: 32 }} />
                </div>
                {/* HUD */}
                <div style={{ position: "absolute", top: 14, right: 16, fontSize: 10, letterSpacing: "0.14em", color: "rgba(255,255,255,0.8)", display: "flex", alignItems: "center", gap: 8 }}>
                  <span style={{ width: 7, height: 7, borderRadius: "50%", background: "var(--accent)", display: "inline-block" }} />{video.duration} · {video.model.split(" ")[0]}
                </div>
                {video.challengeTag && <div style={{ position: "absolute", top: 14, left: 14, background: "var(--accent)", color: "#fff", fontSize: 9, fontWeight: 700, padding: "3px 8px", borderRadius: 2, letterSpacing: "0.1em" }}>{video.challengeTag}</div>}
                {/* Controls */}
                <div style={{ position: "absolute", bottom: 0, left: 0, right: 0, padding: "12px 18px", background: "linear-gradient(0deg, rgba(0,0,0,0.7), transparent)", display: "flex", alignItems: "center", gap: 12, fontSize: 11, color: "rgba(255,255,255,0.8)" }}>
                  <span>▶</span>
                  <div style={{ flex: 1, height: 2, background: "rgba(255,255,255,0.25)", borderRadius: 1, position: "relative" }}>
                    <div style={{ position: "absolute", left: 0, top: 0, height: "100%", width: "22%", background: "var(--accent)", borderRadius: 1 }} />
                  </div>
                  <span>{video.duration}</span>
                  <span>HD</span>
                  <span>⛶</span>
                </div>
              </>
            )}
          </div>

          {/* Title + actions */}
          <div style={{ padding: "24px 32px 0" }}>
            <h1 style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: 44, lineHeight: 0.9, marginBottom: 12, letterSpacing: "0.005em" }}>{video.title}</h1>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", paddingBottom: 20, borderBottom: "1px solid rgba(255,255,255,0.08)" }}>
              <div style={{ display: "flex", gap: 16, fontSize: 13, color: "#777" }}>
                <span>▶ {fmtNum(video.views)} views</span>
                <span>· {video.year}</span>
                <span>· {video.category}</span>
              </div>
              <div style={{ display: "flex", gap: 8 }}>
                {[
                  ["♥", liked ? "var(--accent)" : "#fff", () => setLiked(l => !l)],
                  ["💛 Tip", "#fff", () => setShowTip(true)],
                  ["＋ Save", "#fff", null],
                  ["↗ Share", "#fff", null]
                ].map(([l, c, fn]) => (
                  <button key={l} onClick={fn} style={{ background: "rgba(255,255,255,0.08)", border: "none", color: c, padding: "7px 14px", borderRadius: 4, fontSize: 13, cursor: "pointer", fontWeight: l.startsWith("♥") && liked ? 700 : 400 }}>
                    {l === "♥" ? `♥ ${fmtNum(video.likes + (liked ? 1 : 0))}` : l}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Creator row */}
          {creator && (
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "18px 32px", borderBottom: "1px solid rgba(255,255,255,0.08)" }}>
              <div style={{ display: "flex", gap: 14, alignItems: "center", cursor: "pointer" }} onClick={() => navigate("/profile/" + creator.id)}>
                <div style={{ width: 44, height: 44, borderRadius: "50%", background: `linear-gradient(135deg, ${creator.color}, ${shadeHex(creator.color, -40)})`, display: "flex", alignItems: "center", justifyContent: "center", overflow: "hidden" }}>
                  <img src="/icons/profile.svg" alt="" style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                </div>
                <div>
                  <div style={{ fontWeight: 700, fontSize: 15 }}>{creator.name}</div>
                  <div style={{ fontSize: 12, color: "#777" }}>{creator.handle} · {fmtNum(creator.views)} views</div>
                </div>
              </div>
              <button style={{ background: "rgba(255,255,255,0.08)", color: "#fff", padding: "8px 18px", fontSize: 13, fontWeight: 600, borderRadius: 4, border: "none", cursor: "pointer" }}>+ Follow</button>
            </div>
          )}

          {/* Prompt + Workflow Details */}
          <div style={{ padding: "0 32px" }}>
            {/* Prompt block */}
            <div style={{ padding: "24px 0", borderBottom: "1px solid rgba(255,255,255,0.08)" }}>
              <div style={{ fontSize: 11, letterSpacing: "0.14em", textTransform: "uppercase", color: "#555", marginBottom: 14, fontWeight: 600 }}>Prompt / Creation Notes</div>
              <div style={{ background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.08)", borderRadius: 4, padding: "16px 18px", fontSize: 13, color: "#b3b3b3", lineHeight: 1.6, fontStyle: "italic", marginBottom: 14 }}>"{video.prompt}"</div>
              <div style={{ display: "flex", gap: 12, fontSize: 12, color: "#777" }}>
                <span>Model: <b style={{ color: "#fff" }}>{video.model}</b></span>
                <span>· Duration: <b style={{ color: "#fff" }}>{video.duration}</b></span>
                <span>· Category: <b style={{ color: "#fff" }}>{video.category}</b></span>
              </div>
            </div>

            {/* Workflow block */}
            <div style={{ padding: "24px 0", borderBottom: "1px solid rgba(255,255,255,0.08)" }}>
              <div style={{ fontSize: 11, letterSpacing: "0.14em", textTransform: "uppercase", color: "#555", marginBottom: 14, fontWeight: 600 }}>Cinematic Workflow</div>
              <div style={{ display: "flex", flexWrap: "wrap", gap: 8, marginBottom: 16 }}>
                {(video.workflow?.tools || ["Midjourney v6", video.model.split(" ")[0] || "Seedance", "Adobe Premiere Pro", "ElevenLabs"]).map(tool => (
                  <span key={tool} style={{ background: "rgba(255,255,255,0.06)", border: "1px solid rgba(255,255,255,0.1)", borderRadius: 4, padding: "4px 8px", fontSize: 11, color: "#aaa" }}>{tool}</span>
                ))}
              </div>
              <div style={{ display: "flex", flexDirection: "column", gap: 8, marginBottom: 16 }}>
                {(video.workflow?.steps || [
                  "Generated keyframe concept prompts in Midjourney v6",
                  `Used ${video.model} to extrapolate and animate keyframes into a 5-second cinematic video`,
                  "Generated ambient sound effects and voiceovers in ElevenLabs",
                  "Edited clips, color graded to cinematic style, and mastered foley audio in Premiere Pro"
                ]).map((step, idx) => (
                  <div key={idx} style={{ display: "flex", gap: 10, fontSize: 13, color: "#b3b3b3", lineHeight: 1.5 }}>
                    <span style={{ color: "var(--accent)", fontWeight: 700 }}>{idx + 1}.</span>
                    <span>{step}</span>
                  </div>
                ))}
              </div>
              <div style={{ display: "flex", gap: 20, fontSize: 12, color: "#777" }}>
                <span>Production Time: <b style={{ color: "#fff" }}>{video.workflow?.totalTime || "5 hours"}</b></span>
                <span>· Est. Cost: <b style={{ color: "#fff" }}>${(video.workflow?.totalCost || 1.80).toFixed(2)} USD</b></span>
              </div>
            </div>
          </div>

          {/* Related */}
          {related.length > 0 && (
            <div style={{ padding: "28px 32px 60px" }}>
              <h3 style={{ fontSize: 18, fontWeight: 700, marginBottom: 20 }}>More like this</h3>
              <VideoGrid videos={related} onOpen={(id) => navigate("/video/" + id)} cols={2} />
            </div>
          )}
        </div>

        {/* Sidebar: queue */}
        <div style={{ padding: "20px 18px", overflowY: "auto" }}>
          <div style={{ fontSize: 12, fontWeight: 600, color: "#777", marginBottom: 14, letterSpacing: "0.1em", textTransform: "uppercase" }}>Up Next</div>
          {(window.VIDEOS || []).filter(v => v.id !== video.id).slice(0, 8).map(v => (
            <div key={v.id} onClick={() => navigate("/video/" + v.id)} style={{ display: "flex", gap: 10, padding: "8px 0", borderBottom: "1px solid rgba(255,255,255,0.05)", cursor: "pointer" }}>
              <div style={{ width: 100, aspectRatio: "16/9", borderRadius: 3, flexShrink: 0, overflow: "hidden", background: "#111", position: "relative" }}>
                {v.panel && <img src={v.panel} alt={v.title} style={{ position: "absolute", inset: 0, width: "100%", height: "100%", objectFit: "cover", objectPosition: "center" }} />}
                <div style={{ position: "absolute", inset: 0, background: "linear-gradient(180deg, transparent 50%, rgba(0,0,0,0.6))" }} />
                <div style={{ position: "absolute", bottom: 4, right: 5, background: "rgba(0,0,0,0.7)", color: "#fff", fontSize: 9, fontWeight: 700, padding: "1px 4px", borderRadius: 1 }}>{v.duration}</div>
              </div>
              <div style={{ minWidth: 0 }}>
                <div style={{ fontSize: 13, fontWeight: 600, color: "#fff", lineHeight: 1.2, marginBottom: 3, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{v.title}</div>
                <div style={{ fontSize: 11, color: "#777" }}>{(window.CREATORS || []).find(c => c.id === v.creator)?.handle}</div>
                <div style={{ fontSize: 11, color: "#555", marginTop: 2 }}>{fmtNum(v.views)} views</div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Tipping Modal */}
      {showTip && (
        <div style={{ position: "fixed", inset: 0, zIndex: 9999, background: "rgba(0,0,0,0.85)", display: "flex", alignItems: "center", justifyContent: "center", backdropFilter: "blur(6px)" }}>
          <div style={{ background: "#141414", border: "1px solid rgba(255,255,255,0.08)", borderRadius: 8, padding: "32px 28px", width: 420, maxWidth: "92vw", position: "relative" }}>
            <button 
              onClick={() => setShowTip(false)} 
              style={{ position: "absolute", top: 16, right: 18, background: "none", border: "none", color: "#555", fontSize: 20, cursor: "pointer" }}
            >
              ✕
            </button>
            <div style={{ color: "var(--accent)", fontSize: 10, letterSpacing: "0.15em", textTransform: "uppercase", fontWeight: 700, marginBottom: 8 }}>Support the Creator</div>
            <h3 style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: 32, marginBottom: 8 }}>Donate to {creator?.name || "Creator"}</h3>
            <p style={{ color: "#b3b3b3", fontSize: 12, lineHeight: 1.5, marginBottom: 20 }}>
              All donations (minus a flat 5% platform hosting fee) are processed securely and sent directly to the creator's account to fund their next cinematic AI film project.
            </p>
            
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 10, marginBottom: 20 }}>
              {["$5", "$10", "$25"].map(amt => (
                <button 
                  key={amt} 
                  onClick={() => alert("Payments are coming soon. Real Stripe Checkout donations are disabled during this beta preview. No money is deducted.")}
                  style={{ background: "rgba(255,255,255,0.06)", border: "1px solid rgba(255,255,255,0.1)", borderRadius: 4, padding: "10px", color: "#fff", fontWeight: 700, cursor: "pointer" }}
                >
                  {amt}
                </button>
              ))}
            </div>

            <button 
              onClick={() => setShowTip(false)}
              style={{ width: "100%", background: "var(--accent)", color: "#fff", padding: "12px", borderRadius: 4, border: "none", fontSize: 14, fontWeight: 700, cursor: "pointer" }}
            >
              Cancel
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

// ── CREATORS DIRECTORY ────────────────────────────────────────────────────────
export function CreatorsPage({ }) {
  const navigate = useNavigate();
  const creators = window.CREATORS || [];
  return (
    <div style={{ paddingTop: 80 }}>
      <div style={{ padding: "40px 56px 48px" }}>
        <div style={{ fontSize: 10, letterSpacing: "0.2em", textTransform: "uppercase", color: "var(--accent)", marginBottom: 14, fontWeight: 700 }}>Community</div>
        <h1 style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: 72, lineHeight: 0.88, marginBottom: 16, letterSpacing: "0.005em" }}>AI Filmmakers.</h1>
        <p style={{ fontSize: 16, color: "#b3b3b3", maxWidth: "50ch", marginBottom: 40 }}>Discover the creators building their identity on Madtape. Every profile shows their best work, challenge history, and generation tools.</p>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 12 }}>
          {creators.map(c => <CreatorCard key={c.id} creator={c} onOpen={() => navigate("/profile/" + c.id)} />)}
        </div>
      </div>
      <PlatformFooter />
    </div>
  );
}

// ── LEADERBOARD ───────────────────────────────────────────────────────────────
export function LeaderboardPage({ }) {
  const navigate = useNavigate();
  const [filter, setFilter] = usePV("weekly");
  const board = window.LEADERBOARD || [];
  const videos = window.VIDEOS || [];

  return (
    <div style={{ paddingTop: 80 }}>
      <div style={{ padding: "40px 56px 0" }}>
        <div style={{ fontSize: 10, letterSpacing: "0.2em", textTransform: "uppercase", color: "var(--accent)", marginBottom: 14, fontWeight: 700 }}>Rankings</div>
        <h1 style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: 72, lineHeight: 0.88, marginBottom: 28, letterSpacing: "0.005em" }}>Leaderboard.</h1>
        <div style={{ display: "flex", gap: 4, marginBottom: 32 }}>
          {[["weekly","Weekly Top Films"],["monthly","Monthly Top Creators"],["challenge","Challenge Winners"],["picks","Editor's Picks"]].map(([k, l]) => (
            <button key={k} onClick={() => setFilter(k)} style={{ padding: "7px 14px", borderRadius: 100, background: filter === k ? "#fff" : "rgba(255,255,255,0.07)", color: filter === k ? "#000" : "#b3b3b3", border: "none", cursor: "pointer", fontSize: 13, fontWeight: filter === k ? 700 : 400 }}>{l}</button>
          ))}
        </div>
        {/* Table header */}
        <div style={{ display: "grid", gridTemplateColumns: "48px 1fr 120px 100px 100px 80px", gap: 16, padding: "10px 16px", fontSize: 10, letterSpacing: "0.14em", textTransform: "uppercase", color: "#555", fontWeight: 600, borderBottom: "1px solid rgba(255,255,255,0.08)" }}>
          <span>#</span><span>Film</span><span>Creator</span><span>Views</span><span>Likes</span><span>Score</span>
        </div>
        {board.map((row, i) => {
          const v = videos.find(x => x.id === row.videoId);
          const c = v && (window.CREATORS || []).find(x => x.id === v.creator);
          if (!v) return null;
          return (
            <div key={i} onClick={() => navigate("/video/" + v.id)} style={{
              display: "grid", gridTemplateColumns: "48px 1fr 120px 100px 100px 80px",
              gap: 16, padding: "14px 16px", borderBottom: "1px solid rgba(255,255,255,0.06)",
              alignItems: "center", cursor: "pointer",
              background: i === 0 ? "rgba(229,9,20,0.05)" : "transparent",
            }}
              onMouseEnter={e => e.currentTarget.style.background = "rgba(255,255,255,0.04)"}
              onMouseLeave={e => e.currentTarget.style.background = i === 0 ? "rgba(229,9,20,0.05)" : "transparent"}
            >
              <div style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: row.rank <= 3 ? 28 : 20, color: row.rank === 1 ? "#f5c518" : row.rank === 2 ? "#b3b3b3" : row.rank === 3 ? "#C8956C" : "#555" }}>{row.rank}</div>
              <div style={{ display: "flex", gap: 12, alignItems: "center" }}>
                <div style={{ width: 80, aspectRatio: "16/9", borderRadius: 3, flexShrink: 0, overflow: "hidden", background: "#111", position: "relative" }}>
                  {v.panel && <img src={v.panel} alt={v.title} style={{ position: "absolute", inset: 0, width: "100%", height: "100%", objectFit: "cover", objectPosition: "center" }} />}
                  <div style={{ position: "absolute", inset: 0, background: "linear-gradient(180deg, transparent 50%, rgba(0,0,0,0.5))" }} />
                </div>
                <div>
                  <div style={{ fontWeight: 700, fontSize: 14 }}>{v.title}</div>
                  <div style={{ fontSize: 11, color: "#777", marginTop: 2 }}>{v.category} · {v.model.split(" ")[0]}</div>
                </div>
              </div>
              <div style={{ fontSize: 13, color: "#b3b3b3" }}>{c?.handle}</div>
              <div style={{ fontSize: 13, color: "#fff", fontVariantNumeric: "tabular-nums" }}>{fmtNum(v.views)}</div>
              <div style={{ fontSize: 13, color: "#fff", fontVariantNumeric: "tabular-nums" }}>{fmtNum(v.likes)}</div>
              <div style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: 22, color: row.rank <= 3 ? "var(--accent)" : "#fff" }}>{(row.score / 1000).toFixed(1)}k</div>
            </div>
          );
        })}
      </div>
      <div style={{ padding: "32px 56px 80px" }}>
        <div style={{ padding: "16px 20px", background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.07)", borderRadius: 4, fontSize: 12, color: "#555" }}>
          Scores are calculated from views + weighted likes + editor boost. Updated every hour. Challenge jury scores count separately.
        </div>
      </div>
      <PlatformFooter />
    </div>
  );
}

window.ProfilePage = ProfilePage;
window.VideoDetailPage = VideoDetailPage;
window.CreatorsPage = CreatorsPage;
window.LeaderboardPage = LeaderboardPage;
