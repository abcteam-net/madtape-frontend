// Madtape AI — card components

const { useState: useStateC } = React;

function shadeHex(hex, amt) {
  const n = parseInt(hex.slice(1), 16);
  let r = (n >> 16) + amt; r = Math.max(0, Math.min(255, r));
  let g = ((n >> 8) & 0xff) + amt; g = Math.max(0, Math.min(255, g));
  let b = (n & 0xff) + amt; b = Math.max(0, Math.min(255, b));
  return "#" + ((r << 16) | (g << 8) | b).toString(16).padStart(6, "0");
}

function fmtNum(n) {
  if (n >= 1000) return (n / 1000).toFixed(1).replace(".0", "") + "K";
  return String(n);
}

// ── VIDEO CARD ──────────────────────────────────────────────────────────────
function VideoCard({ video, onOpen, size = "md" }) {
  const [hovered, setHovered] = useStateC(false);
  const [showTip, setShowTip] = useStateC(false);
  const creator = (window.CREATORS || []).find(c => c.id === video.creator);
  const widths = { sm: 220, md: 320, lg: 420 };
  const w = widths[size] || 320;

  return (
    <div
      style={{ width: w, flexShrink: 0, cursor: "pointer", position: "relative" }}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      onClick={() => onOpen && onOpen(video.id)}
    >
      {/* Thumbnail */}
      <div style={{
        width: "100%", aspectRatio: "16/9", position: "relative",
        borderRadius: 4, overflow: "hidden", background: "#111",
        transform: hovered ? "scale(1.04)" : "scale(1)",
        transition: "transform 280ms cubic-bezier(.2,.8,.2,1)",
        boxShadow: hovered ? "0 12px 40px rgba(0,0,0,0.7)" : "none",
      }}>
        {/* Panel image */}
        {video.panel && (
          <img src={video.panel} alt={video.title} style={{
            position: "absolute", inset: 0, width: "100%", height: "100%",
            objectFit: "cover", objectPosition: "center",
          }} />
        )}
        <div style={{
          position: "absolute", inset: 0,
          backgroundImage: "repeating-linear-gradient(0deg, transparent 0, transparent 2px, rgba(0,0,0,0.15) 2px, rgba(0,0,0,0.15) 3px)",
          mixBlendMode: "overlay",
        }} />
        <div style={{
          position: "absolute", inset: 0,
          background: "linear-gradient(180deg, transparent 40%, rgba(0,0,0,0.75))",
        }} />
        {/* Duration pill */}
        <div style={{
          position: "absolute", bottom: 8, right: 8,
          background: "rgba(0,0,0,0.75)", color: "#fff",
          fontSize: 11, fontWeight: 700, padding: "2px 6px", borderRadius: 2,
        }}>{video.duration}</div>
        {/* Tip button — always visible */}
        <div onClick={(e) => { e.stopPropagation(); setShowTip(true); }} style={{
          position: "absolute", bottom: 8, left: 8,
          background: "rgba(0,0,0,0.75)", color: "#f5c518",
          fontSize: 11, fontWeight: 700, padding: "2px 8px", borderRadius: 2,
          cursor: "pointer", display: "flex", alignItems: "center", gap: 4,
          transition: "background 120ms",
          zIndex: 3,
        }}
          onMouseEnter={e => e.currentTarget.style.background = "rgba(229,9,20,0.85)"}
          onMouseLeave={e => e.currentTarget.style.background = "rgba(0,0,0,0.75)"}
        >💛 Tip</div>
        {/* Challenge badge */}
        {video.challengeTag && (
          <div style={{
            position: "absolute", top: 8, left: 8,
            background: "var(--accent)", color: "#fff",
            fontSize: 9, fontWeight: 700, padding: "3px 7px",
            textTransform: "uppercase", letterSpacing: "0.1em", borderRadius: 2,
          }}>{video.challengeTag}</div>
        )}
        {/* Play overlay */}
        {hovered && (
          <div style={{
            position: "absolute", inset: 0,
            display: "flex", alignItems: "center", justifyContent: "center",
          }}>
            <div style={{
              width: 48, height: 48, borderRadius: "50%",
              border: "2px solid rgba(255,255,255,0.9)",
              background: "rgba(0,0,0,0.4)",
              display: "flex", alignItems: "center", justifyContent: "center",
              color: "#fff", fontSize: 16, paddingLeft: 3,
            }}>▶</div>
          </div>
        )}
      </div>
      {/* Tip modal */}
      {showTip && <TipModal video={video} user={window.__madtapeUser} onLogin={() => { setShowTip(false); window.__madtapeLogin && window.__madtapeLogin(); }} onClose={() => setShowTip(false)} />}

      {/* Metadata */}
      <div style={{ padding: "10px 0 4px", display: "flex", flexDirection: "column", gap: 4 }}>
        <div style={{ fontWeight: 700, fontSize: 14, color: "#fff", lineHeight: 1.2, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>
          {video.title}
        </div>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <span style={{ fontSize: 12, color: "#b3b3b3" }}>{creator ? creator.handle : "@creator"}</span>
          <span style={{ fontSize: 11, color: "#777", background: "rgba(255,255,255,0.07)", padding: "1px 6px", borderRadius: 2 }}>{video.model.split(" ")[0]}</span>
        </div>
        <div style={{ display: "flex", gap: 12, fontSize: 11, color: "#777" }}>
          <span>▶ {fmtNum(video.views)}</span>
          <span>♥ {fmtNum(video.likes)}</span>
          <span style={{ marginLeft: "auto", color: "#555" }}>{video.category}</span>
        </div>
      </div>
    </div>
  );
}

function VideoGrid({ videos, onOpen, cols = 4 }) {
  const [tipVideo, setTipVideo] = useStateC(null);
  return (
    <div style={{ display: "grid", gridTemplateColumns: `repeat(${cols}, 1fr)`, gap: 24 }}>
      {tipVideo && <TipModal video={tipVideo} user={window.__madtapeUser} onLogin={() => { setTipVideo(null); window.__madtapeLogin && window.__madtapeLogin(); }} onClose={() => setTipVideo(null)} />}
      {videos.map(v => (
        <div key={v.id} style={{ cursor: "pointer" }}>
          <div onClick={() => onOpen && onOpen(v.id)} style={{
            width: "100%", aspectRatio: "16/9", position: "relative",
            borderRadius: 4, overflow: "hidden", background: "#111", marginBottom: 10,
          }}>
              {v.panel && <img src={v.panel} alt={v.title} style={{ position: "absolute", inset: 0, width: "100%", height: "100%", objectFit: "cover", objectPosition: "center" }} />}
            <div style={{ position: "absolute", inset: 0, background: "linear-gradient(180deg, transparent 50%, rgba(0,0,0,0.7))" }} />
            {v.challengeTag && (
              <div style={{ position: "absolute", top: 8, left: 8, background: "var(--accent)", color: "#fff", fontSize: 9, fontWeight: 700, padding: "2px 6px", textTransform: "uppercase", letterSpacing: "0.1em", borderRadius: 2 }}>{v.challengeTag}</div>
            )}
            <div style={{ position: "absolute", bottom: 8, right: 8, background: "rgba(0,0,0,0.75)", color: "#fff", fontSize: 11, fontWeight: 700, padding: "2px 6px", borderRadius: 2 }}>{v.duration}</div>
            <div onClick={(e) => { e.stopPropagation(); setTipVideo(v); }} style={{
              position: "absolute", bottom: 8, left: 8,
              background: "rgba(0,0,0,0.75)", color: "#f5c518",
              fontSize: 11, fontWeight: 700, padding: "2px 8px", borderRadius: 2,
              cursor: "pointer", zIndex: 3,
            }}
              onMouseEnter={e => e.currentTarget.style.background = "rgba(229,9,20,0.85)"}
              onMouseLeave={e => e.currentTarget.style.background = "rgba(0,0,0,0.75)"}
            >💛 Tip</div>
          </div>
          <div onClick={() => onOpen && onOpen(v.id)}>
            <div style={{ fontWeight: 700, fontSize: 14, color: "#fff", marginBottom: 4, lineHeight: 1.2 }}>{v.title}</div>
            <div style={{ display: "flex", justifyContent: "space-between", fontSize: 12, color: "#b3b3b3", marginBottom: 3 }}>
              <span>{(window.CREATORS || []).find(c => c.id === v.creator)?.handle || "@creator"}</span>
              <span style={{ color: "#666" }}>{v.model ? v.model.split(" ")[0] : ""}</span>
            </div>
            <div style={{ display: "flex", gap: 12, fontSize: 11, color: "#777" }}>
              <span>▶ {fmtNum(v.views)}</span>
              <span>♥ {fmtNum(v.likes)}</span>
              <span style={{ marginLeft: "auto" }}>{v.category}</span>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}

// ── CHALLENGE CARD ────────────────────────────────────────────────────────────
function ChallengeCard({ challenge, onOpen }) {
  const statusColors = { open: "#46d369", closing: "#f5c518", voting: "#5851db", closed: "#777", judging: "#C8956C" };
  const statusLabels = { open: "OPEN", closing: "CLOSING SOON", voting: "VOTING NOW", closed: "CLOSED", judging: "JUDGING" };

  return (
    <div onClick={() => onOpen && onOpen(challenge.id)} style={{
      background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.08)",
      borderRadius: 6, overflow: "hidden", cursor: "pointer",
      transition: "border-color 200ms, background 200ms",
    }}
      onMouseEnter={e => { e.currentTarget.style.borderColor = "rgba(229,9,20,0.4)"; e.currentTarget.style.background = "rgba(255,255,255,0.06)"; }}
      onMouseLeave={e => { e.currentTarget.style.borderColor = "rgba(255,255,255,0.08)"; e.currentTarget.style.background = "rgba(255,255,255,0.04)"; }}
    >
      {/* Colour bar */}
      <div style={{ height: 4, background: challenge.color }} />
      <div style={{ padding: "20px 20px 18px" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 12 }}>
          <div style={{
            fontSize: 10, fontWeight: 700, letterSpacing: "0.16em", textTransform: "uppercase",
            color: statusColors[challenge.status] || "#777",
            display: "flex", alignItems: "center", gap: 6,
          }}>
            {challenge.status === "open" || challenge.status === "closing" ? <span style={{ width: 6, height: 6, borderRadius: "50%", background: statusColors[challenge.status], display: "inline-block" }} /> : null}
            {statusLabels[challenge.status] || challenge.status}
          </div>
          {challenge.daysLeft > 0 && <span style={{ fontSize: 11, color: "#777" }}>{challenge.daysLeft}d left</span>}
        </div>
        <div style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: 28, lineHeight: 1, marginBottom: 8, color: "#fff" }}>{challenge.title}</div>
        <div style={{ fontSize: 13, color: "#b3b3b3", lineHeight: 1.45, marginBottom: 16, display: "-webkit-box", WebkitLineClamp: 2, WebkitBoxOrient: "vertical", overflow: "hidden" }}>{challenge.brief}</div>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", fontSize: 12, color: "#777", paddingTop: 14, borderTop: "1px solid rgba(255,255,255,0.07)" }}>
          <span><b style={{ color: "#fff" }}>{challenge.entries}</b> entries</span>
          <span style={{ color: "#b3b3b3", fontSize: 11 }}>{challenge.prize.split("·")[0].trim()}</span>
        </div>
      </div>
    </div>
  );
}

// ── CREATOR CARD ─────────────────────────────────────────────────────────────
function CreatorCard({ creator, onOpen }) {
  return (
    <div onClick={() => onOpen && onOpen(creator.id)} style={{
      background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.07)",
      borderRadius: 6, padding: "20px 18px", cursor: "pointer", textAlign: "center",
      transition: "border-color 200ms, background 200ms",
    }}
      onMouseEnter={e => { e.currentTarget.style.borderColor = "rgba(255,255,255,0.15)"; e.currentTarget.style.background = "rgba(255,255,255,0.07)"; }}
      onMouseLeave={e => { e.currentTarget.style.borderColor = "rgba(255,255,255,0.07)"; e.currentTarget.style.background = "rgba(255,255,255,0.04)"; }}
    >
      <div style={{
        width: 60, height: 60, borderRadius: "50%", margin: "0 auto 12px",
        background: `linear-gradient(135deg, ${creator.color}, ${shadeHex(creator.color, -40)})`,
        display: "flex", alignItems: "center", justifyContent: "center",
        fontSize: 22, fontWeight: 700, color: "#fff",
        fontFamily: "'Bebas Neue', sans-serif",
      }}>{creator.name[0]}</div>
      <div style={{ fontWeight: 700, fontSize: 15, color: "#fff", marginBottom: 2 }}>{creator.name}</div>
      <div style={{ fontSize: 12, color: "#777", marginBottom: 10 }}>{creator.handle}</div>
      <div style={{ display: "flex", justifyContent: "center", gap: 6, flexWrap: "wrap", marginBottom: 10 }}>
        {creator.badges.slice(0, 2).map(b => (
          <span key={b} style={{ fontSize: 9, padding: "2px 7px", background: "rgba(229,9,20,0.15)", color: "var(--accent)", border: "1px solid rgba(229,9,20,0.3)", borderRadius: 100, letterSpacing: "0.08em", textTransform: "uppercase" }}>{b}</span>
        ))}
      </div>
      <div style={{ display: "flex", justifyContent: "center", gap: 16, fontSize: 12, color: "#b3b3b3" }}>
        <span><b style={{ color: "#fff" }}>{fmtNum(creator.views)}</b> views</span>
        <span><b style={{ color: "#fff" }}>{creator.films}</b> films</span>
      </div>
    </div>
  );
}

// ── STATUS PILL ───────────────────────────────────────────────────────────────
function StatusPill({ status }) {
  const map = {
    published: { bg: "rgba(70,211,105,0.15)", color: "#46d369", label: "Published" },
    "under-review": { bg: "rgba(245,197,24,0.15)", color: "#f5c518", label: "Under Review" },
    draft: { bg: "rgba(255,255,255,0.08)", color: "#b3b3b3", label: "Draft" },
    rejected: { bg: "rgba(229,9,20,0.15)", color: "var(--accent)", label: "Rejected" },
    approved: { bg: "rgba(70,211,105,0.15)", color: "#46d369", label: "Approved" },
  };
  const s = map[status] || { bg: "rgba(255,255,255,0.08)", color: "#777", label: status };
  return (
    <span style={{ fontSize: 10, padding: "3px 9px", borderRadius: 100, background: s.bg, color: s.color, fontWeight: 700, letterSpacing: "0.1em", textTransform: "uppercase" }}>{s.label}</span>
  );
}

// ── TIP MODAL ────────────────────────────────────────────────────────────────
function TipModal({ video, user, onLogin, onClose }) {
  const [amt, setAmt] = useStateC(5);
  const [custom, setCustom] = useStateC("");
  const [sent, setSent] = useStateC(false);
  const creator = (window.CREATORS || []).find(c => c.id === video.creator);
  const amounts = [1, 5, 10, 20];
  const final = custom ? parseInt(custom) || 0 : amt;

  // Revenue split: 50% creator, 10% backers, 40% Madtape
  const toCreator = (final * 0.50).toFixed(2);
  const toBackers = (final * 0.10).toFixed(2);
  const toMadtape = (final * 0.40).toFixed(2);

  const send = () => {
    if (!user) { onClose(); onLogin(); return; }
    if (final <= 0) return;
    setSent(true);
  };

  return (
    <div onClick={onClose} style={{
      position: "fixed", inset: 0, background: "rgba(0,0,0,0.88)",
      zIndex: 300, display: "flex", alignItems: "center", justifyContent: "center",
    }}>
      <div onClick={e => e.stopPropagation()} style={{
        background: "#141414", border: "1px solid rgba(255,255,255,0.1)",
        borderRadius: 8, width: 400, maxWidth: "92vw",
        overflow: "hidden", position: "relative",
      }}>
        {/* Accent top bar */}
        <div style={{ height: 3, background: "var(--accent)" }} />

        {/* Poster mini-header */}
        <div style={{ position: "relative", height: 100, overflow: "hidden", background: "#111" }}>
          {video.panel && <img src={video.panel} alt={video.title} style={{ position: "absolute", inset: 0, width: "100%", height: "100%", objectFit: "cover", objectPosition: "center", opacity: 0.5 }} />}
          <div style={{ position: "absolute", inset: 0, background: "linear-gradient(180deg, transparent, rgba(20,20,20,0.95))" }} />
          <div style={{ position: "absolute", bottom: 12, left: 16, right: 16 }}>
            <div style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: 22, color: "#fff", lineHeight: 1 }}>{video.title}</div>
            <div style={{ fontSize: 11, color: "#b3b3b3", marginTop: 3 }}>by {creator?.name || "Creator"}</div>
          </div>
          <span onClick={onClose} style={{ position: "absolute", top: 10, right: 14, cursor: "pointer", color: "#777", fontSize: 20, zIndex: 1 }}>×</span>
        </div>

        <div style={{ padding: "22px 24px 24px" }}>
          {sent ? (
            <div style={{ textAlign: "center", padding: "16px 0" }}>
              <div style={{ fontSize: 44, marginBottom: 12 }}>💛</div>
              <div style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: 32, marginBottom: 8 }}>Thank you!</div>
              <p style={{ fontSize: 13, color: "#b3b3b3", lineHeight: 1.5, marginBottom: 18 }}>
                €{final} sent. <b style={{ color: "#fff" }}>€{toCreator}</b> goes to {creator?.name || "the creator"}, <b style={{ color: "#fff" }}>€{toBackers}</b> to backers, <b style={{ color: "#fff" }}>€{toMadtape}</b> to Madtape.
              </p>
              <button onClick={onClose} style={{ background: "var(--accent)", color: "#fff", padding: "10px 28px", fontSize: 14, fontWeight: 700, borderRadius: 4, border: "none", cursor: "pointer" }}>Done</button>
            </div>
          ) : (
            <>
              <div style={{ fontSize: 13, color: "#b3b3b3", marginBottom: 18, lineHeight: 1.5 }}>
                Love this film? Send a tip directly to the creator. Split automatically on payment.
              </div>

              {/* Amount buttons */}
              <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 8, marginBottom: 14 }}>
                {amounts.map(a => (
                  <button key={a} onClick={() => { setAmt(a); setCustom(""); }} style={{
                    padding: "12px 0", borderRadius: 4,
                    background: (custom === "" && amt === a) ? "var(--accent)" : "rgba(255,255,255,0.06)",
                    border: "1px solid " + ((custom === "" && amt === a) ? "var(--accent)" : "rgba(255,255,255,0.1)"),
                    color: "#fff", fontFamily: "'Bebas Neue', sans-serif", fontSize: 22,
                    cursor: "pointer", transition: "all 120ms",
                  }}>€{a}</button>
                ))}
              </div>

              {/* Custom amount */}
              <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 18 }}>
                <div style={{ flex: 1, display: "flex", alignItems: "center", border: "1px solid rgba(255,255,255,0.12)", borderRadius: 4, background: "rgba(255,255,255,0.04)", padding: "0 12px", height: 44 }}>
                  <span style={{ color: "#555", fontSize: 16, marginRight: 6 }}>€</span>
                  <input type="number" min="1" max="500" placeholder="Other amount"
                    value={custom} onChange={e => setCustom(e.target.value)}
                    style={{ flex: 1, background: "none", border: "none", outline: "none", color: "#fff", fontFamily: "'Bebas Neue', sans-serif", fontSize: 20 }} />
                </div>
              </div>

              {/* Split breakdown */}
              <div style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.07)", borderRadius: 4, padding: "12px 14px", marginBottom: 18 }}>
                <div style={{ fontSize: 10, letterSpacing: "0.14em", textTransform: "uppercase", color: "#555", marginBottom: 10, fontWeight: 600 }}>How €{final || "—"} is split</div>
                {[
                  ["50%", `→ ${creator?.name || "Creator"}`, toCreator, "#46d369"],
                  ["10%", "→ Film backers (pro-rata)", toBackers, "#f5c518"],
                  ["40%", "→ Madtape HQ", toMadtape, "#b3b3b3"],
                ].map(([pct, label, val, color]) => (
                  <div key={pct} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "5px 0", borderBottom: "1px solid rgba(255,255,255,0.05)" }}>
                    <div style={{ display: "flex", gap: 8, fontSize: 12 }}>
                      <span style={{ color, fontWeight: 700, width: 32 }}>{pct}</span>
                      <span style={{ color: "#b3b3b3" }}>{label}</span>
                    </div>
                    <span style={{ color: "#fff", fontFamily: "'Bebas Neue', sans-serif", fontSize: 18 }}>€{final ? val : "—"}</span>
                  </div>
                ))}
              </div>

              <button onClick={send} disabled={final <= 0} style={{
                width: "100%", background: final > 0 ? "var(--accent)" : "#2a2a2a",
                color: "#fff", padding: "13px", fontSize: 15, fontWeight: 700,
                borderRadius: 4, border: "none", cursor: final > 0 ? "pointer" : "not-allowed",
                display: "flex", alignItems: "center", justifyContent: "center", gap: 8,
              }}>
                💛 {user ? `Send €${final || "—"} to ${creator?.name?.split(" ")[0] || "Creator"}` : "Sign in to tip"}
              </button>
              <div style={{ fontSize: 11, color: "#444", textAlign: "center", marginTop: 10 }}>
                Processed securely · No card stored · Cancel anytime
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}

window.TipModal = TipModal;
window.VideoGrid = VideoGrid;
window.ChallengeCard = ChallengeCard;
window.CreatorCard = CreatorCard;
window.StatusPill = StatusPill;
window.fmtNum = fmtNum;
window.shadeHex = shadeHex;
