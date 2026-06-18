import React from 'react';
import { useNavigate } from 'react-router-dom';
import { StatusPill, fmtNum } from './platform-cards.jsx';
import { PlatformFooter } from './platform-nav.jsx';
import { 
  PLATFORM_PLANS, 
  calculateCreditsToCharge, 
  getLowestEffectiveCreditValue, 
  PROVIDER_COSTS,
  CREATOR_PLANS,
  MADNESS_PACKS 
} from './platform-data.jsx';

const { useState: useUG } = React;

// ── UPLOAD PAGE ──────────────────────────────────────────────────────────────
export function UploadPage({ user, onLogin }) {
  const navigate = useNavigate();
  const [step, setStep] = useUG(1);
  const [youtubeUrl, setYoutubeUrl] = useUG("");
  const [youtubeId, setYoutubeId] = useUG("");
  const [urlError, setUrlError] = useUG("");
  const [form, setForm] = useUG({
    title: "", desc: "", prompt: "", model: "", category: "", challenge: "", isPublic: true, ownsRights: false,
  });
  const [submitted, setSubmitted] = useUG(false);

  const set = (k, v) => setForm(f => ({ ...f, [k]: v }));

  const parseYouTubeId = (url) => {
    if (!url) return "";
    const regExp = /(?:youtube\.com\/(?:[^\/]+\/.+\/|(?:v|e(?:mbed)?)\/|.*[?&]v=)|youtu\.be\/|youtube\.com\/shorts\/)([^"&?\/\s]{11})/i;
    const match = url.match(regExp);
    return match ? match[1] : "";
  };

  const handleSubmit = () => {
    const videoId = form.title.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "") || `user-video-${Date.now()}`;
    const newVideo = {
      id: videoId,
      title: form.title,
      creator: user.id || user.uid || "kira-motion",
      duration: "00:15",
      model: form.model,
      category: form.category,
      views: 0,
      likes: 0,
      color: "#2C3E6B",
      panel: `https://img.youtube.com/vi/${youtubeId}/maxresdefault.jpg`,
      challengeTag: form.challenge ? (window.CHALLENGES || []).find(c => c.id === form.challenge)?.title : null,
      status: "published",
      prompt: form.prompt,
      year: 2026,
      featured: false,
      youtubeId: youtubeId
    };

    if (window.VIDEOS) {
      window.VIDEOS = [newVideo, ...window.VIDEOS];
    }
    setSubmitted(true);
  };

  if (!user) return (
    <div style={{ paddingTop: 80, minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center", flexDirection: "column", gap: 20 }}>
      <div style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: 48, lineHeight: 0.9 }}>Sign in to upload.</div>
      <p style={{ color: "#b3b3b3", fontSize: 16 }}>Create a free account to share your AI films.</p>
      <button onClick={onLogin} style={{ background: "var(--accent)", color: "#fff", padding: "12px 28px", fontSize: 15, fontWeight: 700, borderRadius: 4, border: "none", cursor: "pointer" }}>Sign In / Register</button>
    </div>
  );

  if (submitted) return (
    <div style={{ paddingTop: 80, minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center", flexDirection: "column", gap: 16, textAlign: "center" }}>
      <div style={{ fontSize: 60 }}>✓</div>
      <div style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: 52, lineHeight: 0.9 }}>Film Submitted.</div>
      <p style={{ color: "#b3b3b3", fontSize: 16, maxWidth: "40ch" }}>Your film is under review. We'll notify you when it's approved. Most reviews complete within 24 hours.</p>
      <StatusPill status="under-review" />
      <div style={{ display: "flex", gap: 12, marginTop: 16 }}>
        <button onClick={() => navigate("/dashboard")} style={{ background: "#fff", color: "#000", padding: "11px 22px", fontSize: 14, fontWeight: 700, borderRadius: 4, border: "none", cursor: "pointer" }}>View in Dashboard</button>
        <button onClick={() => { setStep(1); setYoutubeUrl(""); setYoutubeId(""); setForm({ title:"",desc:"",prompt:"",model:"",category:"",challenge:"",isPublic:true,ownsRights:false }); setSubmitted(false); }} style={{ background: "none", color: "#fff", padding: "11px 22px", fontSize: 14, fontWeight: 600, borderRadius: 4, border: "1px solid rgba(255,255,255,0.2)", cursor: "pointer" }}>Upload Another</button>
      </div>
    </div>
  );

  const inputStyle = { width: "100%", background: "#1f1f1f", border: "1px solid rgba(255,255,255,0.1)", borderRadius: 4, padding: "12px 14px", color: "#fff", fontFamily: "inherit", fontSize: 14, outline: "none" };
  const labelStyle = { fontSize: 11, letterSpacing: "0.12em", textTransform: "uppercase", color: "#777", marginBottom: 8, fontWeight: 600, display: "block" };

  return (
    <div style={{ paddingTop: 80, minHeight: "100vh" }}>
      <div style={{ maxWidth: 760, margin: "0 auto", padding: "40px 24px 80px" }}>
        {/* Progress */}
        <div style={{ display: "flex", gap: 0, marginBottom: 48, borderBottom: "2px solid rgba(255,255,255,0.07)" }}>
          {[["1","File"],["2","Details"],["3","Review"]].map(([n, l], i) => (
            <div key={n} style={{ padding: "10px 20px 12px", borderBottom: step === i+1 ? "2px solid var(--accent)" : "2px solid transparent", marginBottom: -2, cursor: step > i+1 ? "pointer" : "default", color: step === i+1 ? "#fff" : step > i+1 ? "#b3b3b3" : "#555" }} onClick={() => step > i+1 && setStep(i+1)}>
              <span style={{ fontSize: 11, letterSpacing: "0.1em" }}>{n}. {l}</span>
            </div>
          ))}
        </div>

        <h1 style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: 52, lineHeight: 0.9, marginBottom: 32, letterSpacing: "0.005em" }}>Upload Your AI Film</h1>

        {/* Step 1: YouTube URL */}
        {step === 1 && (
          <div style={{ display: "flex", flexDirection: "column", gap: 24 }}>
            <div style={{
              border: "1px solid rgba(255,255,255,0.1)", borderRadius: 6,
              padding: "40px 30px", background: "rgba(255,255,255,0.02)",
              display: "flex", flexDirection: "column", gap: 20
            }}>
              <div>
                <label style={labelStyle}>YouTube Video URL *</label>
                <input
                  type="text"
                  style={{ ...inputStyle, fontSize: 15 }}
                  placeholder="e.g. https://www.youtube.com/watch?v=B-lfTmZp1DE"
                  value={youtubeUrl}
                  onChange={e => {
                    const val = e.target.value;
                    setYoutubeUrl(val);
                    const id = parseYouTubeId(val);
                    if (val && !id) {
                      setUrlError("Invalid YouTube URL. Make sure it is a valid watch link, shorts link, embed link, or short youtu.be link.");
                      setYoutubeId("");
                    } else {
                      setUrlError("");
                      setYoutubeId(id);
                    }
                  }}
                />
                {urlError && <div style={{ color: "var(--accent)", fontSize: 12, marginTop: 6, fontWeight: 500 }}>{urlError}</div>}
              </div>

              {youtubeId && (
                <div style={{ animation: "fadeIn 200ms ease-out" }}>
                  <label style={labelStyle}>Live Video Preview</label>
                  <div style={{
                    width: "100%",
                    maxWidth: 360,
                    aspectRatio: "16/9",
                    borderRadius: 4,
                    overflow: "hidden",
                    position: "relative",
                    border: "1px solid rgba(255,255,255,0.1)",
                    boxShadow: "0 8px 24px rgba(0,0,0,0.5)"
                  }}>
                    <img
                      src={`https://img.youtube.com/vi/${youtubeId}/mqdefault.jpg`}
                      alt="YouTube Preview"
                      style={{ width: "100%", height: "100%", objectFit: "cover" }}
                      onError={(e) => {
                        e.target.src = `https://img.youtube.com/vi/${youtubeId}/0.jpg`;
                      }}
                    />
                    <div style={{
                      position: "absolute",
                      bottom: 8,
                      right: 8,
                      background: "rgba(0,0,0,0.8)",
                      color: "#fff",
                      fontSize: 10,
                      padding: "3px 6px",
                      borderRadius: 2,
                      fontWeight: 600,
                      letterSpacing: "0.05em"
                    }}>
                      ID: {youtubeId}
                    </div>
                  </div>
                </div>
              )}
            </div>

            <div style={{ padding: "16px 20px", background: "rgba(245,197,24,0.07)", border: "1px solid rgba(245,197,24,0.2)", borderRadius: 4, fontSize: 13, color: "#b3b3b3" }}>
              <b style={{ color: "#f5c518" }}>Platform rules: </b> Short films must be 4–15 seconds. Features must be ≥ 1h 45m. All content must be AI-generated or AI-assisted.
            </div>
            <button 
              onClick={() => setStep(2)} 
              disabled={!youtubeId} 
              style={{ 
                alignSelf: "flex-start", 
                background: youtubeId ? "var(--accent)" : "#333", 
                color: "#fff", 
                padding: "12px 28px", 
                fontSize: 14, 
                fontWeight: 700, 
                borderRadius: 4, 
                border: "none", 
                cursor: youtubeId ? "pointer" : "not-allowed",
                transition: "background 150ms"
              }}
            >
              Continue →
            </button>
          </div>
        )}

        {/* Step 2: Details */}
        {step === 2 && (
          <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
            <div>
              <label style={labelStyle}>Title *</label>
              <input style={inputStyle} placeholder="Name your film" value={form.title} onChange={e => set("title", e.target.value)} />
            </div>
            <div>
              <label style={labelStyle}>Short description</label>
              <textarea style={{ ...inputStyle, minHeight: 80, resize: "vertical" }} placeholder="What is this film about?" value={form.desc} onChange={e => set("desc", e.target.value)} />
            </div>
            <div>
              <label style={labelStyle}>Prompt used *</label>
              <textarea style={{ ...inputStyle, minHeight: 100, resize: "vertical" }} placeholder="Share the full prompt you used. This is required for challenge submissions and adds educational value to the community." value={form.prompt} onChange={e => set("prompt", e.target.value)} />
            </div>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
              <div>
                <label style={labelStyle}>AI Model used *</label>
                <select style={{ ...inputStyle, cursor: "pointer" }} value={form.model} onChange={e => set("model", e.target.value)}>
                  <option value="">Select model</option>
                  {["Seedance 2.0","Runway Gen-4","Kling 2","Veo 4","Hailuo","Pika 2","Luma","Other"].map(m => <option key={m} value={m}>{m}</option>)}
                </select>
              </div>
              <div>
                <label style={labelStyle}>Category *</label>
                <select style={{ ...inputStyle, cursor: "pointer" }} value={form.category} onChange={e => set("category", e.target.value)}>
                  <option value="">Select category</option>
                  {["Sci-Fi","Horror","Drama","Action","Fashion","Experimental","Documentary","Animation","Music Video","Comedy","Fantasy","Other"].map(c => <option key={c} value={c}>{c}</option>)}
                </select>
              </div>
            </div>
            <div>
              <label style={labelStyle}>Submit to a Challenge (optional)</label>
              <select style={{ ...inputStyle, cursor: "pointer" }} value={form.challenge} onChange={e => set("challenge", e.target.value)}>
                <option value="">No challenge submission</option>
                {(window.CHALLENGES || []).filter(c => c.status === "open" || c.status === "closing").map(c => <option key={c.id} value={c.id}>{c.title} · {c.daysLeft}d left</option>)}
              </select>
            </div>
            <div style={{ display: "flex", flexDirection: "column", gap: 12, padding: "18px", background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.08)", borderRadius: 4 }}>
              <label style={{ display: "flex", gap: 10, alignItems: "flex-start", cursor: "pointer", fontSize: 13, color: "#b3b3b3" }}>
                <input type="checkbox" checked={form.ownsRights} onChange={e => set("ownsRights", e.target.checked)} style={{ marginTop: 2, accentColor: "var(--accent)" }} />
                <span>I confirm I have the rights to share this content, and it complies with Madtape's content rules. I understand that prompt disclosure is required for challenge submissions.</span>
              </label>
              <label style={{ display: "flex", gap: 10, alignItems: "center", cursor: "pointer", fontSize: 13, color: "#b3b3b3" }}>
                <input type="checkbox" checked={form.isPublic} onChange={e => set("isPublic", e.target.checked)} style={{ accentColor: "var(--accent)" }} />
                <span>Publish publicly (uncheck to save as private draft)</span>
              </label>
            </div>
            <div style={{ display: "flex", gap: 12 }}>
              <button onClick={() => setStep(1)} style={{ background: "none", color: "#b3b3b3", padding: "12px 20px", fontSize: 14, borderRadius: 4, border: "1px solid rgba(255,255,255,0.15)", cursor: "pointer" }}>← Back</button>
              <button onClick={() => setStep(3)} disabled={!form.title || !form.model || !form.category || !form.ownsRights} style={{ background: form.title && form.model && form.category && form.ownsRights ? "var(--accent)" : "#333", color: "#fff", padding: "12px 28px", fontSize: 14, fontWeight: 700, borderRadius: 4, border: "none", cursor: "pointer" }}>Review & Submit →</button>
            </div>
          </div>
        )}

        {/* Step 3: Review */}
        {step === 3 && (
          <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
            <div style={{ background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.1)", borderRadius: 6, overflow: "hidden" }}>
              <div style={{ padding: "20px 24px", borderBottom: "1px solid rgba(255,255,255,0.07)" }}>
                <div style={{ fontSize: 11, color: "#777", marginBottom: 4 }}>FILM</div>
                <div style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: 32 }}>{form.title || "Untitled"}</div>
              </div>
              {[["YouTube URL", youtubeUrl],["YouTube ID", youtubeId],["Model", form.model],["Category", form.category],["Challenge", form.challenge ? (window.CHALLENGES||[]).find(c=>c.id===form.challenge)?.title : "None"],["Visibility", form.isPublic ? "Public" : "Private draft"]].map(([k,v]) => (
                <div key={k} style={{ display: "flex", justifyContent: "space-between", padding: "12px 24px", borderBottom: "1px solid rgba(255,255,255,0.05)", fontSize: 13 }}>
                  <span style={{ color: "#777" }}>{k}</span>
                  <span style={{ color: "#fff", textOverflow: "ellipsis", overflow: "hidden", whiteSpace: "nowrap", maxWidth: "70%" }} title={v}>{v || "—"}</span>
                </div>
              ))}
            </div>
            <div style={{ padding: "14px 18px", background: "rgba(70,211,105,0.07)", border: "1px solid rgba(70,211,105,0.2)", borderRadius: 4, fontSize: 13, color: "#b3b3b3" }}>
              <b style={{ color: "#46d369" }}>What happens next: </b> Your film enters manual review. We aim to approve within 24 hours. You'll receive a notification when it's live.
            </div>
            <div style={{ display: "flex", gap: 12 }}>
              <button onClick={() => setStep(2)} style={{ background: "none", color: "#b3b3b3", padding: "12px 20px", fontSize: 14, borderRadius: 4, border: "1px solid rgba(255,255,255,0.15)", cursor: "pointer" }}>← Edit</button>
              <button onClick={handleSubmit} style={{ background: "var(--accent)", color: "#fff", padding: "12px 28px", fontSize: 14, fontWeight: 700, borderRadius: 4, border: "none", cursor: "pointer" }}>Submit for Review</button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

// ── GENERATE PAGE ─────────────────────────────────────────────────────────────
export function GeneratePage({ user, onLogin, setUser }) {
  const navigate = useNavigate();
  const [mode, setMode] = React.useState("text");
  const [prompt, setPrompt] = React.useState("");
  const [duration, setDuration] = React.useState("5");
  const [res, setRes] = React.useState("720p");
  const [model, setModel] = React.useState("Fast");
  const [style, setStyle] = React.useState("cinematic");
  const [generating, setGenerating] = React.useState(false);
  const [done, setDone] = React.useState(false);

  const getCooldownTime = () => {
    if (!user) return 0;
    return parseInt(localStorage.getItem(`__madtape_cooldown_until_${user.uid}`) || "0");
  };

  const getDailyUsed = () => {
    if (!user) return 0;
    return parseInt(localStorage.getItem(`__madtape_daily_used_${user.uid}`) || "0");
  };

  const getMonthlyUsed = () => {
    if (!user) return 0;
    return parseInt(localStorage.getItem(`__madtape_monthly_used_${user.uid}`) || "0");
  };

  const [cooldownTime, setCooldownTime] = React.useState(getCooldownTime());
  const [timeLeft, setTimeLeft] = React.useState(0);

  React.useEffect(() => {
    const updateTime = () => {
      const remaining = Math.max(0, Math.ceil((getCooldownTime() - Date.now()) / 1000));
      setTimeLeft(remaining);
    };
    updateTime();
    const interval = setInterval(updateTime, 1000);
    return () => clearInterval(interval);
  }, [user, cooldownTime]);

  const activeCooldown = timeLeft > 0;
  const minutesLeft = Math.ceil(timeLeft / 60);

  const planDetails = user ? (window.CREATOR_PLANS || CREATOR_PLANS).find(p => p.id === user.plan) : null;
  const isIncluded = 
    user && 
    user.plan && 
    user.plan !== "free" &&
    mode === "text" &&
    res === "720p" &&
    duration === "5" &&
    model === "Fast";

  const dailyUsed = getDailyUsed();
  const monthlyUsed = getMonthlyUsed();
  
  const withinDaily = planDetails ? dailyUsed < planDetails.dailyLimit : false;
  const withinMonthly = planDetails ? monthlyUsed < planDetails.monthlyCap : false;
  
  const isFreeGeneration = isIncluded && withinDaily && withinMonthly;

  const creditsCost = calculateCreditsToCharge(mode, res, model) || 0;
  const finalCost = isFreeGeneration ? 0 : creditsCost;

  const hasEnoughCredits = user ? (user.balance >= finalCost) : false;

  const go = () => {
    if (!user) { onLogin(); return; }
    if (activeCooldown) return;
    if (!hasEnoughCredits && !isFreeGeneration) return;

    setGenerating(true);
    setTimeout(() => {
      setGenerating(false);
      setDone(true);

      const now = Date.now();
      const newCooldown = now + 40 * 60 * 1000;
      localStorage.setItem(`__madtape_cooldown_until_${user.uid}`, String(newCooldown));
      setCooldownTime(newCooldown);

      if (isFreeGeneration) {
        const newDaily = dailyUsed + 1;
        const newMonthly = monthlyUsed + 1;
        localStorage.setItem(`__madtape_daily_used_${user.uid}`, String(newDaily));
        localStorage.setItem(`__madtape_monthly_used_${user.uid}`, String(newMonthly));
      } else {
        const newBalance = user.balance - finalCost;
        const updatedUser = { ...user, balance: newBalance };
        setUser(updatedUser);
      }

      // Add to simulated video database
      const videoId = prompt.toLowerCase().replace(/[^a-z0-9]+/g, "-").slice(0, 24) || `ai-video-${Date.now()}`;
      const newVideo = {
        id: videoId,
        title: prompt.split(" ").slice(0, 3).join(" ") || "AI Film",
        creator: user.uid,
        duration: `00:0${duration}`,
        model: model === "Fast" ? "Seedance Fast" : "Seedance 2.0",
        category: style.charAt(0).toUpperCase() + style.slice(1),
        views: 0,
        likes: 0,
        color: "#1f1f1f",
        panel: "uploads/panel 1.png",
        status: "published",
        prompt: prompt,
        year: 2026,
        featured: false,
        youtubeId: "B-lfTmZp1DE"
      };
      if (window.VIDEOS) {
        window.VIDEOS = [newVideo, ...window.VIDEOS];
      }
    }, 2800);
  };

  const minutesString = timeLeft > 60 ? `${minutesLeft} minutes` : `${timeLeft} seconds`;

  return (
    <div style={{ paddingTop: 80, minHeight: "100vh" }}>
      <div style={{ maxWidth: 860, margin: "0 auto", padding: "40px 24px 80px" }}>
        <div style={{ fontSize: 10, letterSpacing: "0.2em", textTransform: "uppercase", color: "var(--accent)", marginBottom: 14, fontWeight: 700 }}>Powered by Seedance · Credit-based</div>
        <h1 style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: 56, lineHeight: 0.9, marginBottom: 8, letterSpacing: "0.005em" }}>Generate an AI Film</h1>
        <p style={{ fontSize: 15, color: "#777", marginBottom: 36 }}>Turn prompts into cinematic AI videos. Subscriptions include Fast 720p 5s outputs; premium features use Madness Credits.</p>

        {!user && (
          <div style={{ padding: "24px", background: "rgba(229,9,20,0.07)", border: "1px solid rgba(229,9,20,0.25)", borderRadius: 6, marginBottom: 32, display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <span style={{ fontSize: 14, color: "#b3b3b3" }}>Sign in to generate. Free account requires buying credit packs or subscribing to a Creator plan.</span>
            <button onClick={onLogin} style={{ background: "var(--accent)", color: "#fff", padding: "9px 20px", fontSize: 13, fontWeight: 700, borderRadius: 4, border: "none", cursor: "pointer", flexShrink: 0 }}>Sign In</button>
          </div>
        )}

        {/* Mode tabs */}
        <div style={{ display: "flex", gap: 4, marginBottom: 28, background: "rgba(255,255,255,0.04)", padding: 4, borderRadius: 6, width: "fit-content" }}>
          {[["text","Text → Video"],["image","Image → Video"],["frame","Start / End Frame"]].map(([k, l]) => (
            <button key={k} onClick={() => setMode(k)} style={{ padding: "8px 16px", borderRadius: 4, border: "none", background: mode === k ? "#fff" : "none", color: mode === k ? "#000" : "#b3b3b3", fontWeight: mode === k ? 700 : 400, fontSize: 13, cursor: "pointer" }}>{l}</button>
          ))}
        </div>

        {activeCooldown ? (
          <div style={{ padding: "40px", background: "rgba(245,197,24,0.06)", border: "1px solid rgba(245,197,24,0.18)", borderRadius: 6, textAlign: "center", marginBottom: 40 }}>
            <div style={{ fontSize: 48, marginBottom: 16 }}>⏳</div>
            <h2 style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: 36, color: "#fff", marginBottom: 12 }}>Cooldown Active</h2>
            <p style={{ fontSize: 16, color: "#b3b3b3", maxWidth: "52ch", margin: "0 auto 20px", lineHeight: 1.5 }}>
              Cooldown active. Your next generation will be available in {minutesString}.
            </p>
            <div style={{ fontSize: 13, color: "#777" }}>
              Every generation starts a 40-minute cooldown. Use this time to share your work, update your campaign, or invite your audience to support the project.
            </div>
          </div>
        ) : (
          <div style={{ display: "grid", gridTemplateColumns: "1fr 280px", gap: 24 }}>
            {/* Main form */}
            <div style={{ display: "flex", flexDirection: "column", gap: 18 }}>
              <div>
                <label style={{ fontSize: 11, letterSpacing: "0.12em", textTransform: "uppercase", color: "#777", marginBottom: 8, fontWeight: 600, display: "block" }}>Prompt *</label>
                <textarea
                  style={{ width: "100%", background: "#1f1f1f", border: "1px solid rgba(255,255,255,0.1)", borderRadius: 4, padding: "14px", color: "#fff", fontFamily: "inherit", fontSize: 14, outline: "none", minHeight: 140, resize: "vertical", lineHeight: 1.5 }}
                  placeholder="A cinematic widescreen shot of a lone scientist walking through a sterile underground white corridor, cool ring lights overhead, slow dolly-in camera movement, subtle tension, realistic lighting, premium sci-fi atmosphere."
                  value={prompt} onChange={e => setPrompt(e.target.value)}
                />
              </div>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr 1fr", gap: 12 }}>
                {[
                  ["Model", ["Fast", "Seedance 2.0"], model, setModel],
                  ["Duration", ["5", "15"], duration, setDuration],
                  ["Resolution", ["480p", "720p", "1080p"], res, setRes],
                  ["Style", ["cinematic", "realistic", "anime", "fashion", "horror", "documentary"], style, setStyle],
                ].map(([label, opts, val, setter]) => (
                  <div key={label}>
                    <label style={{ fontSize: 11, letterSpacing: "0.12em", textTransform: "uppercase", color: "#777", marginBottom: 8, fontWeight: 600, display: "block" }}>{label}</label>
                    <select style={{ width: "100%", background: "#1f1f1f", border: "1px solid rgba(255,255,255,0.1)", borderRadius: 4, padding: "10px 12px", color: "#fff", fontFamily: "inherit", fontSize: 13, outline: "none", cursor: "pointer" }} value={val} onChange={e => setter(e.target.value)}>
                      {opts.map(o => <option key={o} value={o}>{o === "5" ? "5s" : o === "15" ? "15s" : o}</option>)}
                    </select>
                  </div>
                ))}
              </div>

              {/* Confirmation text */}
              {user && (
                <div style={{ padding: "14px 16px", background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.08)", borderRadius: 4, fontSize: 13, color: "#b3b3b3" }}>
                  {isFreeGeneration ? (
                    <span style={{ color: "#46d369" }}>✓ This generation is included in your {planDetails?.name} plan. It will use 0 Madness Credits.</span>
                  ) : (
                    <span>This generation will use <strong>{finalCost} Madness Credits</strong> and start a 40-minute cooldown.</span>
                  )}
                </div>
              )}

              {done ? (
                <div style={{ padding: "20px", background: "rgba(70,211,105,0.08)", border: "1px solid rgba(70,211,105,0.25)", borderRadius: 6, display: "flex", flexDirection: "column", gap: 12 }}>
                  <div style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: 28, color: "#46d369" }}>✓ Generation Complete</div>
                  <p style={{ fontSize: 13, color: "#b3b3b3" }}>Your film has been saved to drafts. Add metadata and submit for review.</p>
                  <div style={{ display: "flex", gap: 10 }}>
                    <button onClick={() => navigate("/upload")} style={{ background: "var(--accent)", color: "#fff", padding: "10px 20px", fontSize: 13, fontWeight: 700, borderRadius: 4, border: "none", cursor: "pointer" }}>Add Details & Publish</button>
                    <button onClick={() => setDone(false)} style={{ background: "none", color: "#b3b3b3", padding: "10px 16px", fontSize: 13, borderRadius: 4, border: "1px solid rgba(255,255,255,0.15)", cursor: "pointer" }}>Generate Another</button>
                  </div>
                </div>
              ) : (
                <button 
                  onClick={go} 
                  disabled={!prompt || generating || !user || (!isFreeGeneration && !hasEnoughCredits)} 
                  style={{ 
                    background: prompt && user && !generating && (isFreeGeneration || hasEnoughCredits) ? "var(--accent)" : "#2a2a2a", 
                    color: "#fff", padding: "14px", fontSize: 15, fontWeight: 700, borderRadius: 4, border: "none", 
                    cursor: prompt && user && !generating && (isFreeGeneration || hasEnoughCredits) ? "pointer" : "not-allowed", 
                    display: "flex", alignItems: "center", justifyContent: "center", gap: 10 
                  }}
                >
                  {generating ? (
                    <span>Generating… {duration}s video in {res}</span>
                  ) : !hasEnoughCredits && !isFreeGeneration && user ? (
                    <span>Insufficient Madness Credits</span>
                  ) : (
                    <span>Generate · {finalCost} Credit{finalCost !== 1 ? "s" : ""}</span>
                  )}
                </button>
              )}
            </div>

            {/* Sidebar: cost + info */}
            <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
              <div style={{ background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.08)", borderRadius: 6, padding: "20px 18px" }}>
                <div style={{ fontSize: 11, letterSpacing: "0.14em", textTransform: "uppercase", color: "#555", marginBottom: 14, fontWeight: 600 }}>Cost estimate</div>
                <div style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: 44, color: "#fff", lineHeight: 1, marginBottom: 4 }}>
                  {finalCost} <span style={{ fontSize: 20, color: "#777" }}>Credits</span>
                </div>
                <div style={{ fontSize: 12, color: "#777", marginBottom: 16 }}>for {duration}s · {res} · {model}</div>
                <div style={{ fontSize: 11, color: "#555", borderTop: "1px solid rgba(255,255,255,0.06)", paddingTop: 10, lineHeight: 1.4 }}>
                  Madness Credits are internal production credits used only inside Madtape to create and process AI cinematic content.
                </div>
              </div>
              <div style={{ padding: "14px 16px", background: "rgba(245,197,24,0.06)", border: "1px solid rgba(245,197,24,0.15)", borderRadius: 4, fontSize: 12, color: "#b3b3b3", lineHeight: 1.5 }}>
                <b style={{ color: "#f5c518" }}>Anti-Abuse Cooldown: </b>
                Every generation starts a 40-minute cooldown. Use this time to share your work, update your campaign, or invite your audience to support the project.
              </div>
              <button onClick={() => navigate("/pricing")} style={{ background: "none", color: "#b3b3b3", padding: "10px", fontSize: 12, borderRadius: 4, border: "1px solid rgba(255,255,255,0.1)", cursor: "pointer" }}>View pricing & credit plans →</button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

// ── STRIPE CHECKOUT MODAL ──────────────────────────────────────────────────
export function StripeCheckoutModal({ item, type, user, onClose, onPaymentSuccess }) {
  const [cardNumber, setCardNumber] = React.useState("");
  const [expiry, setExpiry] = React.useState("");
  const [cvc, setCvc] = React.useState("");
  const [name, setName] = React.useState("");
  const [processing, setProcessing] = React.useState(false);
  const [success, setSuccess] = React.useState(false);
  const [error, setError] = React.useState("");

  const formatCardNumber = (value) => {
    const v = value.replace(/\s+/g, "").replace(/[^0-9]/gi, "");
    const matches = v.match(/\d{4,16}/g);
    const match = (matches && matches[0]) || "";
    const parts = [];

    for (let i = 0, len = match.length; i < len; i += 4) {
      parts.push(match.substring(i, i + 4));
    }

    return parts.length > 0 ? parts.join(" ") : v;
  };

  const formatExpiry = (value) => {
    const v = value.replace(/\s+/g, "").replace(/[^0-9]/gi, "");
    if (v.length >= 2) {
      return v.substring(0, 2) + "/" + v.substring(2, 4);
    }
    return v;
  };

  const handlePay = (e) => {
    e.preventDefault();
    if (cardNumber.replace(/\s/g, "").length < 16) {
      setError("Please enter a valid 16-digit card number.");
      return;
    }
    if (expiry.length < 5) {
      setError("Please enter a valid expiry date (MM/YY).");
      return;
    }
    if (cvc.length < 3) {
      setError("Please enter a valid 3-digit CVC.");
      return;
    }
    if (!name.trim()) {
      setError("Please enter the cardholder's name.");
      return;
    }

    setError("");
    setProcessing(true);

    setTimeout(() => {
      const cleanCard = cardNumber.replace(/\s/g, "");
      if (cleanCard === "4242424242424242") {
        setProcessing(false);
        setSuccess(true);
        setTimeout(() => {
          onPaymentSuccess();
        }, 1500);
      } else {
        setProcessing(false);
        setError("Your card was declined. Please try using Stripe's standard test card: 4242 4242 4242 4242.");
      }
    }, 2200);
  };

  React.useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [onClose]);

  const inputStyle = { width: "100%", background: "#1f1f1f", border: "1px solid rgba(255,255,255,0.08)", borderRadius: 4, padding: "12px 14px", color: "#fff", fontFamily: "inherit", fontSize: 14, outline: "none" };
  const titleText = type === "plan" ? `Subscribe to ${item.name}` : `Buy ${item.name} Credits`;
  const priceText = type === "plan" ? `€${item.price}/mo` : `€${item.price}`;

  return (
    <div style={{
      position: "fixed", inset: 0, zIndex: 9999,
      display: "flex", alignItems: "center", justifyContent: "center",
      background: "rgba(0, 0, 0, 0.85)", backdropFilter: "blur(8px)"
    }}>
      <div 
        role="dialog"
        aria-modal="true"
        aria-labelledby="checkout-title"
        style={{
          width: "100%", maxWidth: 440,
          background: "#141414", border: "1px solid rgba(255,255,255,0.08)",
          borderRadius: 8, padding: "32px 28px", color: "#fff",
          boxShadow: "0 20px 40px rgba(0,0,0,0.6)",
          position: "relative",
          animation: "fadeIn 250ms cubic-bezier(.2,.8,.2,1)"
        }}
      >
        <button 
          onClick={onClose}
          aria-label="Close Checkout"
          style={{
            position: "absolute", top: 18, right: 18,
            background: "none", border: "none", color: "#555",
            fontSize: 20, cursor: "pointer", transition: "color 150ms"
          }}
          onMouseEnter={e => e.currentTarget.style.color = "#fff"}
          onMouseLeave={e => e.currentTarget.style.color = "#555"}
        >
          ✕
        </button>

        {success ? (
          <div style={{ display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", padding: "40px 0", textAlign: "center", gap: 16 }}>
            <div style={{ fontSize: 64, color: "var(--good)", animation: "pulse 1.5s infinite" }}>✓</div>
            <h2 id="checkout-title" style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: 36, letterSpacing: "0.02em", margin: 0 }}>Payment Successful!</h2>
            <p style={{ color: "#b3b3b3", fontSize: 14, margin: 0 }}>
              {type === "plan" ? `Welcome to the ${item.name} plan. Upgrading account...` : `Successfully added ${item.credits} Madness Credits to wallet.`}
            </p>
          </div>
        ) : (
          <form onSubmit={handlePay} style={{ display: "flex", flexDirection: "column", gap: 20 }}>
            <div>
              <div style={{ display: "flex", alignItems: "center", gap: 8, color: "var(--accent)", fontSize: 10, letterSpacing: "0.15em", textTransform: "uppercase", fontWeight: 700, fontStyle: "normal", marginBottom: 6 }}>
                <span style={{ width: 6, height: 6, borderRadius: "50%", background: "var(--accent)" }} />
                Secure Stripe Checkout
              </div>
              <h2 id="checkout-title" style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: 40, lineHeight: 1, letterSpacing: "0.01em", margin: 0 }}>{titleText}</h2>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", borderBottom: "1px solid rgba(255,255,255,0.06)", paddingBottom: 16, marginTop: 8 }}>
                <span style={{ fontSize: 13, color: "#777" }}>{type === "plan" ? "Billed monthly" : "One-time purchase"}</span>
                <span style={{ fontSize: 24, fontWeight: 800, fontFamily: "'Bebas Neue', sans-serif" }}>{priceText}</span>
              </div>
            </div>

            {error && (
              <div style={{ padding: "10px 14px", background: "rgba(229,9,20,0.08)", border: "1px solid rgba(229,9,20,0.2)", borderRadius: 4, fontSize: 12, color: "#f87171", lineHeight: 1.5 }}>
                {error}
              </div>
            )}

            <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
              <div>
                <label style={{ fontSize: 10, letterSpacing: "0.08em", textTransform: "uppercase", color: "#555", fontWeight: 700, marginBottom: 6, display: "block" }}>Card Number</label>
                <div style={{ position: "relative" }}>
                  <input
                    type="text"
                    required
                    maxLength={19}
                    placeholder="4242 4242 4242 4242"
                    style={{ ...inputStyle, fontFamily: "monospace", fontSize: 15, paddingRight: 40 }}
                    value={cardNumber}
                    onChange={e => setCardNumber(formatCardNumber(e.target.value))}
                  />
                  <div style={{ position: "absolute", right: 12, top: "50%", transform: "translateY(-50%)", fontSize: 18, color: "#555" }}>💳</div>
                </div>
              </div>

              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
                <div>
                  <label style={{ fontSize: 10, letterSpacing: "0.08em", textTransform: "uppercase", color: "#555", fontWeight: 700, marginBottom: 6, display: "block" }}>Expiry Date</label>
                  <input
                    type="text"
                    required
                    maxLength={5}
                    placeholder="MM/YY"
                    style={{ ...inputStyle, fontFamily: "monospace", fontSize: 15, textAlign: "center" }}
                    value={expiry}
                    onChange={e => setExpiry(formatExpiry(e.target.value))}
                  />
                </div>
                <div>
                  <label style={{ fontSize: 10, letterSpacing: "0.08em", textTransform: "uppercase", color: "#555", fontWeight: 700, marginBottom: 6, display: "block" }}>CVC</label>
                  <input
                    type="password"
                    required
                    maxLength={3}
                    placeholder="•••"
                    style={{ ...inputStyle, fontFamily: "monospace", fontSize: 15, textAlign: "center" }}
                    value={cvc}
                    onChange={e => setCvc(e.target.value.replace(/[^0-9]/g, ""))}
                  />
                </div>
              </div>

              <div>
                <label style={{ fontSize: 10, letterSpacing: "0.08em", textTransform: "uppercase", color: "#555", fontWeight: 700, marginBottom: 6, display: "block" }}>Cardholder Name</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Kira Hoffmann"
                  style={{ ...inputStyle, fontSize: 14 }}
                  value={name}
                  onChange={e => setName(e.target.value)}
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={processing}
              style={{
                width: "100%", background: processing ? "#333" : "var(--accent)", color: "#fff",
                padding: "14px", borderRadius: 4, border: "none", fontSize: 14, fontWeight: 700,
                cursor: processing ? "not-allowed" : "pointer",
                display: "flex", alignItems: "center", justifyContent: "center", gap: 10,
                transition: "background 150ms", marginTop: 8
              }}
            >
              {processing ? (
                <>
                  <span className="generating" style={{ marginRight: -10 }} />
                  Processing payment...
                </>
              ) : (
                `Pay ${priceText}`
              )}
            </button>

            <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 6, fontSize: 11, color: "#555", textAlign: "center" }}>
              <span>🔒 Encrypted checkout. Billed by Madtape.</span>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}

// ── PRICING PAGE ──────────────────────────────────────────────────────────────
export function PricingPage({ user, onLogin, setUser }) {
  const navigate = useNavigate();
  const plans = window.PLATFORM_PLANS || PLATFORM_PLANS;
  const creditPacks = window.MADNESS_PACKS || MADNESS_PACKS;
  
  const [selectedPlan, setSelectedPlan] = React.useState(null);
  const [selectedPack, setSelectedPack] = React.useState(null);

  return (
    <div style={{ paddingTop: 80, color: "#fff" }}>
      {/* Dynamic public header */}
      <div style={{ padding: "60px 56px 0", textAlign: "center" }}>
        <h1 style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: 72, lineHeight: 0.88, marginBottom: 16, letterSpacing: "0.005em" }}>Madtape Pricing</h1>
        <p style={{ fontSize: 16, color: "#b3b3b3", maxWidth: "56ch", margin: "0 auto 40px", lineHeight: 1.5 }}>
          Create cinematic AI films with Madness Credits, creator plans, and clear usage limits.
        </p>
        <p style={{ fontSize: 14, color: "#777", maxWidth: "60ch", margin: "0 auto 56px" }}>
          Madtape gives AI filmmakers two ways to create:<br />
          1. Buy Madness Credits and pay only when you generate.<br />
          2. Subscribe to a Creator Plan for a monthly Fast 720p generation allowance.<br />
          Every generation starts a 40-minute cooldown.
        </p>
      </div>

      {/* Credit packs section */}
      <div style={{ padding: "0 56px 60px" }}>
        <h2 style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: 36, marginBottom: 10, textAlign: "center" }}>Madness Credit Packs</h2>
        <p style={{ fontSize: 14, color: "#777", textAlign: "center", marginBottom: 32 }}>
          Madness Credits are Madtape's internal production credits. Use them to generate, regenerate, and process cinematic AI content. They are not cryptocurrency, not financial instruments, not tradable assets, and do not provide ownership or revenue rights.
        </p>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 16, maxWidth: 1000, margin: "0 auto" }}>
          {creditPacks.map((pack) => {
            const rate = (pack.price / pack.credits).toFixed(4);
            return (
              <div key={pack.id} style={{ background: "rgba(255,255,255,0.02)", border: "1px solid rgba(255,255,255,0.08)", borderRadius: 6, padding: "24px 20px", textAlign: "center" }}>
                <div style={{ fontSize: 11, color: "var(--accent)", letterSpacing: "0.15em", textTransform: "uppercase", fontWeight: 700, marginBottom: 8 }}>{pack.name} Pack</div>
                <div style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: 44, color: "#fff", lineHeight: 1, marginBottom: 4 }}>{pack.credits.toLocaleString()} <span style={{ fontSize: 18, color: "#777" }}>Credits</span></div>
                <div style={{ fontSize: 24, fontWeight: 700, fontFamily: "'Bebas Neue', sans-serif", color: "#fff", marginBottom: 12 }}>${pack.price}</div>
                <div style={{ fontSize: 11, color: "#555", marginBottom: 20 }}>Effective Rate: ${rate} / credit</div>
                <button 
                  onClick={() => {
                    if (!user) { onLogin(); } else { setSelectedPack(pack); }
                  }}
                  style={{ width: "100%", background: "var(--accent)", color: "#fff", padding: "10px", fontSize: 13, fontWeight: 700, borderRadius: 4, border: "none", cursor: "pointer" }}
                >
                  Buy Credits
                </button>
              </div>
            );
          })}
        </div>
        <p style={{ fontSize: 12, color: "#444", textAlign: "center", marginTop: 16 }}>
          Madness Credits start at $0.01 per credit. Larger packs include bonus credits.
        </p>
      </div>

      {/* Pricing Tables */}
      <div style={{ padding: "0 56px 60px", maxWidth: 900, margin: "0 auto" }}>
        <h2 style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: 36, marginBottom: 24, textAlign: "center" }}>Generation Costs</h2>

        {/* Text-to-video table */}
        <h3 style={{ fontSize: 18, fontWeight: 700, marginBottom: 14 }}>Text-to-Video <span style={{ fontSize: 13, color: "#555", fontWeight: 400 }}>(5-second output, 16:9)</span></h3>
        <table style={{ width: "100%", borderCollapse: "collapse", marginBottom: 40, background: "rgba(255,255,255,0.02)", border: "1px solid rgba(255,255,255,0.08)", borderRadius: 6 }}>
          <thead>
            <tr style={{ borderBottom: "1px solid rgba(255,255,255,0.08)", textAlign: "left", fontSize: 11, color: "#555", letterSpacing: "0.08em" }}>
              <th style={{ padding: "12px 16px" }}>Resolution</th>
              <th style={{ padding: "12px 16px" }}>Fast Model</th>
              <th style={{ padding: "12px 16px" }}>Seedance 2.0</th>
            </tr>
          </thead>
          <tbody>
            <tr style={{ borderBottom: "1px solid rgba(255,255,255,0.05)", fontSize: 13 }}>
              <td style={{ padding: "12px 16px", fontWeight: 600 }}>480p</td>
              <td style={{ padding: "12px 16px" }}>{calculateCreditsToCharge("text", "480p", "Fast")} Credits</td>
              <td style={{ padding: "12px 16px" }}>{calculateCreditsToCharge("text", "480p", "Seedance 2.0")} Credits</td>
            </tr>
            <tr style={{ borderBottom: "1px solid rgba(255,255,255,0.05)", fontSize: 13 }}>
              <td style={{ padding: "12px 16px", fontWeight: 600 }}>720p</td>
              <td style={{ padding: "12px 16px" }}>{calculateCreditsToCharge("text", "720p", "Fast")} Credits</td>
              <td style={{ padding: "12px 16px" }}>{calculateCreditsToCharge("text", "720p", "Seedance 2.0")} Credits</td>
            </tr>
            <tr style={{ fontSize: 13 }}>
              <td style={{ padding: "12px 16px", fontWeight: 600 }}>1080p</td>
              <td style={{ padding: "12px 16px", color: "#444" }}>Not available</td>
              <td style={{ padding: "12px 16px" }}>{calculateCreditsToCharge("text", "1080p", "Seedance 2.0")} Credits</td>
            </tr>
          </tbody>
        </table>

        {/* Video-to-video table */}
        <h3 style={{ fontSize: 18, fontWeight: 700, marginBottom: 14 }}>Video-to-Video <span style={{ fontSize: 13, color: "#555", fontWeight: 400 }}>(Up to 15-second maximum input)</span></h3>
        <table style={{ width: "100%", borderCollapse: "collapse", marginBottom: 20, background: "rgba(255,255,255,0.02)", border: "1px solid rgba(255,255,255,0.08)", borderRadius: 6 }}>
          <thead>
            <tr style={{ borderBottom: "1px solid rgba(255,255,255,0.08)", textAlign: "left", fontSize: 11, color: "#555", letterSpacing: "0.08em" }}>
              <th style={{ padding: "12px 16px" }}>Resolution</th>
              <th style={{ padding: "12px 16px" }}>Fast Model</th>
              <th style={{ padding: "12px 16px" }}>Seedance 2.0</th>
            </tr>
          </thead>
          <tbody>
            <tr style={{ borderBottom: "1px solid rgba(255,255,255,0.05)", fontSize: 13 }}>
              <td style={{ padding: "12px 16px", fontWeight: 600 }}>480p</td>
              <td style={{ padding: "12px 16px" }}>{calculateCreditsToCharge("video", "480p", "Fast")} Credits</td>
              <td style={{ padding: "12px 16px" }}>{calculateCreditsToCharge("video", "480p", "Seedance 2.0")} Credits</td>
            </tr>
            <tr style={{ borderBottom: "1px solid rgba(255,255,255,0.05)", fontSize: 13 }}>
              <td style={{ padding: "12px 16px", fontWeight: 600 }}>720p</td>
              <td style={{ padding: "12px 16px" }}>{calculateCreditsToCharge("video", "720p", "Fast")} Credits</td>
              <td style={{ padding: "12px 16px" }}>{calculateCreditsToCharge("video", "720p", "Seedance 2.0")} Credits</td>
            </tr>
            <tr style={{ fontSize: 13 }}>
              <td style={{ padding: "12px 16px", fontWeight: 600 }}>1080p</td>
              <td style={{ padding: "12px 16px", color: "#444" }}>Not available</td>
              <td style={{ padding: "12px 16px" }}>{calculateCreditsToCharge("video", "1080p", "Seedance 2.0")} Credits</td>
            </tr>
          </tbody>
        </table>
        <p style={{ fontSize: 11, color: "#555", marginBottom: 40, lineHeight: 1.4 }}>
          Video-to-video pricing is calculated using the maximum supported input length. Final cost may change if provider pricing changes.
        </p>

        {/* Other actions table */}
        <h3 style={{ fontSize: 18, fontWeight: 700, marginBottom: 14 }}>Other Actions</h3>
        <table style={{ width: "100%", borderCollapse: "collapse", background: "rgba(255,255,255,0.02)", border: "1px solid rgba(255,255,255,0.08)", borderRadius: 6, marginBottom: 60 }}>
          <thead>
            <tr style={{ borderBottom: "1px solid rgba(255,255,255,0.08)", textAlign: "left", fontSize: 11, color: "#555", letterSpacing: "0.08em" }}>
              <th style={{ padding: "12px 16px" }}>Action</th>
              <th style={{ padding: "12px 16px" }}>Madness Cost</th>
            </tr>
          </thead>
          <tbody>
            <tr style={{ borderBottom: "1px solid rgba(255,255,255,0.05)", fontSize: 13 }}>
              <td style={{ padding: "12px 16px", fontWeight: 600 }}>Regenerate</td>
              <td style={{ padding: "12px 16px" }}>Same as the underlying generation</td>
            </tr>
            <tr style={{ borderBottom: "1px solid rgba(255,255,255,0.05)", fontSize: 13 }}>
              <td style={{ padding: "12px 16px", fontWeight: 600 }}>Upscale</td>
              <td style={{ padding: "12px 16px", color: "#777", fontStyle: "italic" }}>Coming soon</td>
            </tr>
            <tr style={{ fontSize: 13 }}>
              <td style={{ padding: "12px 16px", fontWeight: 600 }}>Extend</td>
              <td style={{ padding: "12px 16px", color: "#777", fontStyle: "italic" }}>Coming soon</td>
            </tr>
          </tbody>
        </table>
      </div>

      {/* Creator Subscription Plans */}
      <div style={{ padding: "60px 56px", background: "rgba(255,255,255,0.01)", borderTop: "1px solid rgba(255,255,255,0.06)", borderBottom: "1px solid rgba(255,255,255,0.06)" }}>
        <h2 style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: 48, marginBottom: 12, textAlign: "center" }}>Creator Plans</h2>
        <p style={{ fontSize: 15, color: "#aaa", maxWidth: "62ch", margin: "0 auto 40px", textAlign: "center", lineHeight: 1.5 }}>
          Creator plans include a monthly allowance of Fast 720p, 5-second text-to-video generations. Premium models, video input, longer videos, upscaling, extension, and extra generations use Madness Credits.
        </p>

        <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 24, maxWidth: 1000, margin: "0 auto" }}>
          {plans.map((p) => (
            <div key={p.id} style={{ display: "flex", flexDirection: "column", background: p.popular ? "rgba(229,9,20,0.05)" : "rgba(255,255,255,0.02)", border: p.popular ? "2px solid var(--accent)" : "1px solid rgba(255,255,255,0.08)", borderRadius: 8, padding: "28px 20px", position: "relative" }}>
              {p.popular && <div style={{ position: "absolute", top: 0, left: 0, right: 0, height: 3, background: "var(--accent)" }} />}
              <div style={{ fontSize: 10, letterSpacing: "0.15em", textTransform: "uppercase", color: p.popular ? "var(--accent)" : "#555", marginBottom: 12, fontWeight: 700 }}>{p.popular ? "Popular Choice" : "Subscription plan"}</div>
              <h3 style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: 32, marginBottom: 8 }}>{p.name}</h3>
              <div style={{ marginBottom: 20 }}>
                <span style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: 44 }}>${p.price}</span>
                <span style={{ fontSize: 13, color: "#777" }}> / month</span>
              </div>
              <div style={{ flex: 1, display: "flex", flexDirection: "column", gap: 8, marginBottom: 28 }}>
                {p.perks.map(perk => (
                  <div key={perk} style={{ display: "flex", gap: 8, fontSize: 12, color: "#b3b3b3" }}>
                    <span style={{ color: "#46d369" }}>✓</span> {perk}
                  </div>
                ))}
                {p.limits.map(lim => (
                  <div key={lim} style={{ display: "flex", gap: 8, fontSize: 12, color: "#555" }}>
                    <span>–</span> {lim}
                  </div>
                ))}
              </div>
              <button 
                onClick={() => {
                  if (!user) { onLogin(); } else { setSelectedPlan(p); }
                }}
                style={{ width: "100%", background: p.popular ? "var(--accent)" : "rgba(255,255,255,0.08)", color: "#fff", padding: "12px", fontSize: 14, fontWeight: 700, borderRadius: 4, border: "none", cursor: "pointer" }}
              >
                {user && user.plan === p.id ? "Current Subscription" : p.cta}
              </button>
            </div>
          ))}
        </div>
        <p style={{ fontSize: 12, color: "#555", textAlign: "center", marginTop: 20 }}>
          Included generations reset each billing period and do not roll over.
        </p>
      </div>

      {/* Info Sections */}
      <div style={{ padding: "60px 56px 80px", maxWidth: 800, margin: "0 auto", display: "grid", gridTemplateColumns: "1fr 1fr", gap: 40 }}>
        <div>
          <h3 style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: 24, marginBottom: 14, color: "#fff" }}>What Uses Madness Credits?</h3>
          <ul style={{ paddingLeft: 18, fontSize: 13, color: "#b3b3b3", display: "flex", flexDirection: "column", gap: 10, lineHeight: 1.5 }}>
            <li>Generating content without an active creator plan</li>
            <li>Exceeding daily included generation limits</li>
            <li>Exceeding monthly included plan caps</li>
            <li>Selecting the premium <strong>Seedance 2.0</strong> model</li>
            <li>Using video-to-video source inputs</li>
            <li>Generating at high resolution (1080p)</li>
            <li>Choosing outputs longer than 5 seconds</li>
            <li>Regenerating premium generations</li>
            <li>Using future upscale or extension tools</li>
          </ul>
        </div>
        <div>
          <h3 style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: 24, marginBottom: 14, color: "#fff" }}>Cooldown & Safeguards</h3>
          <p style={{ fontSize: 13, color: "#b3b3b3", lineHeight: 1.6, marginBottom: 16 }}>
            Every generation starts a strict 40-minute cooldown. During cooldown, you can still upload films, edit your channel/profile, update campaigns, reply to comments, and watch cinematic creations.
          </p>
          <p style={{ fontSize: 13, color: "#777", lineHeight: 1.6 }}>
            We implement this cooldown to prevent bulk generation scripts, encourage thoughtful curation, and safeguard platform resources. It applies globally across all creator plans and devices.
          </p>
        </div>
      </div>

      {/* Core Positioning footer */}
      <div style={{ background: "rgba(0,0,0,0.5)", borderTop: "1px solid rgba(255,255,255,0.06)", padding: "32px 56px", fontSize: 12, color: "#555", textAlign: "center", lineHeight: 1.6 }}>
        Madtape lets AI filmmakers create cinematic content with Madness Credits, subscribe for monthly Fast 720p generation allowances, fund new projects through their audience, and distribute AI films through creator channels where viewers can watch with ads or subscribe for ad-free access.
      </div>

      <PlatformFooter />

      {selectedPlan && (
        <StripeCheckoutModal 
          item={selectedPlan}
          type="plan"
          user={user}
          onClose={() => setSelectedPlan(null)} 
          onPaymentSuccess={() => {
            const updated = {
              ...user,
              plan: selectedPlan.id
            };
            // Reset daily/monthly used
            localStorage.setItem(`__madtape_daily_used_${user.uid}`, "0");
            localStorage.setItem(`__madtape_monthly_used_${user.uid}`, "0");
            setUser(updated);
            setSelectedPlan(null);
            navigate("/dashboard");
          }}
        />
      )}

      {selectedPack && (
        <StripeCheckoutModal 
          item={selectedPack}
          type="pack"
          user={user}
          onClose={() => setSelectedPack(null)} 
          onPaymentSuccess={() => {
            const updated = {
              ...user,
              balance: (user.balance || 0) + selectedPack.credits
            };
            setUser(updated);
            setSelectedPack(null);
            navigate("/dashboard");
          }}
        />
      )}
    </div>
  );
}

// ── DASHBOARD ─────────────────────────────────────────────────────────────────
export function DashboardPage({ user, onLogin, setUser }) {
  const navigate = useNavigate();
  const [isAdminOpen, setIsAdminOpen] = React.useState(false);
  const [adminMargin, setAdminMargin] = React.useState(() => window.targetGrossMargin || 0.50);
  const [adminBasicCap, setAdminBasicCap] = React.useState(() => {
    const plan = (window.CREATOR_PLANS || CREATOR_PLANS).find(p => p.id === "basic");
    return plan ? plan.monthlyCap : 180;
  });
  const [adminProCap, setAdminProCap] = React.useState(() => {
    const plan = (window.CREATOR_PLANS || CREATOR_PLANS).find(p => p.id === "pro");
    return plan ? plan.monthlyCap : 390;
  });
  const [adminStudioCap, setAdminStudioCap] = React.useState(() => {
    const plan = (window.CREATOR_PLANS || CREATOR_PLANS).find(p => p.id === "studio");
    return plan ? plan.monthlyCap : 630;
  });
  const [adminStudioPackRate, setAdminStudioPackRate] = React.useState(11750); // standard is 11750

  if (!user) return (
    <div style={{ paddingTop: 80, minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center", flexDirection: "column", gap: 16 }}>
      <div style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: 48 }}>Dashboard</div>
      <p style={{ color: "#b3b3b3" }}>Sign in to access your creator dashboard.</p>
      <button onClick={onLogin} style={{ background: "var(--accent)", color: "#fff", padding: "11px 24px", fontSize: 14, fontWeight: 700, borderRadius: 4, border: "none", cursor: "pointer" }}>Sign In</button>
    </div>
  );

  const myVideos = (window.VIDEOS || []).filter(v => v.creator === user.uid || v.creator === user.id);
  const displayVideos = myVideos.length > 0 ? myVideos : (window.VIDEOS || []).slice(0, 4);

  const getCooldownTime = () => parseInt(localStorage.getItem(`__madtape_cooldown_until_${user.uid}`) || "0");
  const getDailyUsed = () => parseInt(localStorage.getItem(`__madtape_daily_used_${user.uid}`) || "0");
  const getMonthlyUsed = () => parseInt(localStorage.getItem(`__madtape_monthly_used_${user.uid}`) || "0");

  const [cooldownTime, setCooldownTime] = React.useState(getCooldownTime());
  const [timeLeft, setTimeLeft] = React.useState(0);

  React.useEffect(() => {
    const updateTime = () => {
      const remaining = Math.max(0, Math.ceil((getCooldownTime() - Date.now()) / 1000));
      setTimeLeft(remaining);
    };
    updateTime();
    const interval = setInterval(updateTime, 1000);
    return () => clearInterval(interval);
  }, [user]);

  const activeCooldown = timeLeft > 0;
  const minutesLeft = Math.ceil(timeLeft / 60);

  const planDetails = (window.CREATOR_PLANS || CREATOR_PLANS).find(p => p.id === user.plan);
  const planName = planDetails ? planDetails.name : "Free plan";
  const balanceVal = user.balance !== undefined ? user.balance : 0;

  // Save admin edits
  const saveAdminSettings = () => {
    window.targetGrossMargin = adminMargin;
    
    const basicPlan = (window.CREATOR_PLANS || CREATOR_PLANS).find(p => p.id === "basic");
    if (basicPlan) basicPlan.monthlyCap = adminBasicCap;
    
    const proPlan = (window.CREATOR_PLANS || CREATOR_PLANS).find(p => p.id === "pro");
    if (proPlan) proPlan.monthlyCap = adminProCap;
    
    const studioPlan = (window.CREATOR_PLANS || CREATOR_PLANS).find(p => p.id === "studio");
    if (studioPlan) studioPlan.monthlyCap = adminStudioCap;

    const studioPack = (window.MADNESS_PACKS || MADNESS_PACKS).find(p => p.id === "studio");
    if (studioPack) studioPack.credits = adminStudioPackRate;

    // Trigger update of state locally if needed
    setIsAdminOpen(false);
  };

  // Warnings derivations
  const lowestEffectiveVal = Math.min(...(window.MADNESS_PACKS || MADNESS_PACKS).map(p => p.id === "studio" ? { ...p, credits: adminStudioPackRate } : p).map(p => p.price / p.credits));
  const showsPackWarning = lowestEffectiveVal < 0.0085;

  const basicCapSafe = Math.floor((250 * (1 - adminMargin)) / 0.60);
  const proCapSafe = Math.floor((500 * (1 - adminMargin)) / 0.60);
  const studioCapSafe = Math.floor((800 * (1 - adminMargin)) / 0.60);

  const showsPlanWarning = 
    adminBasicCap > basicCapSafe || 
    adminProCap > proCapSafe || 
    adminStudioCap > studioCapSafe;

  const stats = [
    { l: "Total Views", v: "24.8K" }, { l: "Total Likes", v: "3.2K" },
    { l: "Films", v: String(myVideos.length || 7) }, { l: "Daily Used", v: `${getDailyUsed()} / ${planDetails ? planDetails.dailyLimit : 0}` },
    { l: "Madness balance", v: String(balanceVal) }, { l: "Monthly Used", v: `${getMonthlyUsed()} / ${planDetails ? planDetails.monthlyCap : 0}` },
  ];

  return (
    <div style={{ paddingTop: 80, minHeight: "100vh" }}>
      <div style={{ padding: "40px 56px 60px" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end", marginBottom: 40 }}>
          <div>
            <div style={{ fontSize: 13, color: "#777", marginBottom: 6 }}>Welcome back,</div>
            <h1 style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: 52, lineHeight: 0.9, letterSpacing: "0.005em" }}>{user.name}</h1>
          </div>
          <div style={{ display: "flex", gap: 10 }}>
            {/* Admin trigger */}
            <button onClick={() => setIsAdminOpen(true)} style={{ background: "rgba(255,255,255,0.06)", color: "#fff", padding: "10px 20px", fontSize: 13, fontWeight: 600, borderRadius: 4, border: "1px solid rgba(255,255,255,0.1)", cursor: "pointer" }}>⚙ Admin Controls</button>
            <button onClick={() => navigate("/upload")} style={{ background: "var(--accent)", color: "#fff", padding: "10px 20px", fontSize: 13, fontWeight: 700, borderRadius: 4, border: "none", cursor: "pointer" }}>↑ Upload Film</button>
            <button onClick={() => navigate("/generate")} style={{ background: "rgba(255,255,255,0.08)", color: "#fff", padding: "10px 20px", fontSize: 13, fontWeight: 600, borderRadius: 4, border: "1px solid rgba(255,255,255,0.1)", cursor: "pointer" }}>⚡ Generate</button>
          </div>
        </div>

        {/* Cooldown Alert bar */}
        {activeCooldown && (
          <div style={{ background: "rgba(245,197,24,0.12)", border: "1px solid rgba(245,197,24,0.3)", borderRadius: 6, padding: "14px 20px", color: "#f5c518", fontSize: 13, marginBottom: 24 }}>
            ⏳ Cooldown active. Your next generation will be available in {timeLeft} seconds.
          </div>
        )}

        {/* Stats */}
        <div style={{ display: "grid", gridTemplateColumns: "repeat(6, 1fr)", gap: 0, border: "1px solid rgba(255,255,255,0.08)", borderRadius: 8, overflow: "hidden", marginBottom: 40 }}>
          {stats.map((s, i) => (
            <div key={s.l} style={{ padding: "20px 18px", borderRight: i < stats.length-1 ? "1px solid rgba(255,255,255,0.07)" : "none", background: "rgba(255,255,255,0.02)" }}>
              <div style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: 36, color: "#fff", lineHeight: 1, marginBottom: 4 }}>{s.v}</div>
              <div style={{ fontSize: 11, color: "#555", letterSpacing: "0.1em", textTransform: "uppercase" }}>{s.l}</div>
            </div>
          ))}
        </div>

        {/* Film queue */}
        <div style={{ display: "grid", gridTemplateColumns: "2fr 1fr", gap: 40 }}>
          <div>
            <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 18 }}>
              <h3 style={{ fontSize: 18, fontWeight: 700 }}>Your Films</h3>
              <a href="#" onClick={(e) => { e.preventDefault(); navigate("/explore"); }} style={{ fontSize: 12, color: "#777", textDecoration: "none" }}>View all</a>
            </div>
            {displayVideos.map(v => (
              <div key={v.id} style={{ display: "flex", gap: 12, alignItems: "center", padding: "12px 0", borderBottom: "1px solid rgba(255,255,255,0.06)" }}>
                <div style={{ width: 80, aspectRatio: "16/9", flexShrink: 0, borderRadius: 3, overflow: "hidden", background: "#111", position: "relative" }}>
                  {v.panel && <img src={v.panel} alt={v.title} style={{ position: "absolute", inset: 0, width: "100%", height: "100%", objectFit: "cover", objectPosition: "center" }} />}
                  <div style={{ position: "absolute", inset: 0, background: "linear-gradient(180deg, transparent 50%, rgba(0,0,0,0.5))" }} />
                </div>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ fontWeight: 600, fontSize: 14, marginBottom: 3, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{v.title}</div>
                  <div style={{ display: "flex", gap: 10, fontSize: 11, color: "#777" }}>
                    <span>▶ {fmtNum(v.views)}</span><span>♥ {fmtNum(v.likes)}</span>
                  </div>
                </div>
                <StatusPill status="published" />
              </div>
            ))}
          </div>
          <div>
            <h3 style={{ fontSize: 18, fontWeight: 700, marginBottom: 18 }}>Subscription status</h3>
            <div style={{ padding: "24px", background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.08)", borderRadius: 6, marginBottom: 14 }}>
              <div style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: 44, color: "#fff", lineHeight: 1 }}>{planName}</div>
              <div style={{ fontSize: 12, color: "#777", marginTop: 4, marginBottom: 20 }}>daily limit: {planDetails ? planDetails.dailyLimit : 0} gens/day · monthly cap: {planDetails ? planDetails.monthlyCap : 0} gens/mo</div>
              
              <div style={{ display: "flex", justifyContent: "space-between", fontSize: 11, color: "#555", marginBottom: 6 }}>
                <span>Daily allowance used</span>
                <span>{getDailyUsed()} / {planDetails ? planDetails.dailyLimit : 0}</span>
              </div>
              <div style={{ height: 4, background: "rgba(255,255,255,0.08)", borderRadius: 2, marginBottom: 16 }}>
                <div style={{ height: "100%", width: `${planDetails ? (getDailyUsed() / planDetails.dailyLimit) * 100 : 0}%`, background: "var(--accent)", borderRadius: 2 }} />
              </div>
              
              <div style={{ display: "flex", justifyContent: "space-between", fontSize: 11, color: "#555", marginBottom: 6 }}>
                <span>Monthly allowance used</span>
                <span>{getMonthlyUsed()} / {planDetails ? planDetails.monthlyCap : 0}</span>
              </div>
              <div style={{ height: 4, background: "rgba(255,255,255,0.08)", borderRadius: 2 }}>
                <div style={{ height: "100%", width: `${planDetails ? (getMonthlyUsed() / planDetails.monthlyCap) * 100 : 0}%`, background: "#46d369", borderRadius: 2 }} />
              </div>
            </div>
            <button onClick={() => navigate("/pricing")} style={{ width: "100%", background: "rgba(255,255,255,0.06)", color: "#fff", padding: "11px", fontSize: 13, fontWeight: 600, borderRadius: 4, border: "1px solid rgba(255,255,255,0.1)", cursor: "pointer" }}>Upgrade / Buy credits →</button>
          </div>
        </div>
      </div>

      {/* Admin control panel Modal */}
      {isAdminOpen && (
        <div style={{ position: "fixed", inset: 0, zIndex: 9999, background: "rgba(0,0,0,0.85)", display: "flex", alignItems: "center", justifyContent: "center" }}>
          <div style={{ background: "#141414", border: "1px solid rgba(255,255,255,0.1)", borderRadius: 6, padding: "32px", width: 500, maxWidth: "90vw", maxHeight: "90vh", overflowY: "auto" }}>
            <h2 style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: 36, marginBottom: 18 }}>⚙ Admin Pricing Control Panel</h2>

            {/* Warnings block */}
            {showsPackWarning && (
              <div style={{ background: "rgba(229,9,20,0.1)", border: "1px solid rgba(229,9,20,0.3)", borderRadius: 4, padding: "12px", color: "#f87171", fontSize: 12, marginBottom: 14 }}>
                <strong>Warning:</strong> This pack lowers the effective value of Madness Credits. Generation prices must be recalculated to protect margin.
              </div>
            )}
            {showsPlanWarning && (
              <div style={{ background: "rgba(245,197,24,0.1)", border: "1px solid rgba(245,197,24,0.3)", borderRadius: 4, padding: "12px", color: "#f5c518", fontSize: 12, marginBottom: 14 }}>
                <strong>Warning:</strong> This plan may fall below the target gross margin if creators use the full monthly allowance.
              </div>
            )}

            <div style={{ display: "flex", flexDirection: "column", gap: 16, marginBottom: 24 }}>
              <div>
                <label style={{ fontSize: 11, color: "#777", textTransform: "uppercase", display: "block", marginBottom: 6 }}>Target Gross Margin</label>
                <input 
                  type="number" 
                  step="0.05" 
                  min="0.1" 
                  max="0.9" 
                  value={adminMargin} 
                  onChange={e => setAdminMargin(parseFloat(e.target.value))} 
                  style={{ width: "100%", background: "#222", border: "1px solid rgba(255,255,255,0.1)", borderRadius: 4, padding: "10px", color: "#fff" }} 
                />
              </div>

              <div>
                <label style={{ fontSize: 11, color: "#777", textTransform: "uppercase", display: "block", marginBottom: 6 }}>Studio Pack Credits Allowance (Standard is 11,750)</label>
                <input 
                  type="number" 
                  value={adminStudioPackRate} 
                  onChange={e => setAdminStudioPackRate(parseInt(e.target.value) || 0)} 
                  style={{ width: "100%", background: "#222", border: "1px solid rgba(255,255,255,0.1)", borderRadius: 4, padding: "10px", color: "#fff" }} 
                />
                <span style={{ fontSize: 11, color: "#555" }}>Setting this too high lowers effective credit value (below $0.0085).</span>
              </div>

              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 12 }}>
                <div>
                  <label style={{ fontSize: 10, color: "#777", textTransform: "uppercase", display: "block", marginBottom: 6 }}>Basic Cap (mo)</label>
                  <input 
                    type="number" 
                    value={adminBasicCap} 
                    onChange={e => setAdminBasicCap(parseInt(e.target.value) || 0)} 
                    style={{ width: "100%", background: "#222", border: "1px solid rgba(255,255,255,0.1)", borderRadius: 4, padding: "10px", color: "#fff" }} 
                  />
                  <span style={{ fontSize: 9, color: "#555" }}>Max safe: {basicCapSafe}</span>
                </div>
                <div>
                  <label style={{ fontSize: 10, color: "#777", textTransform: "uppercase", display: "block", marginBottom: 6 }}>Pro Cap (mo)</label>
                  <input 
                    type="number" 
                    value={adminProCap} 
                    onChange={e => setAdminProCap(parseInt(e.target.value) || 0)} 
                    style={{ width: "100%", background: "#222", border: "1px solid rgba(255,255,255,0.1)", borderRadius: 4, padding: "10px", color: "#fff" }} 
                  />
                  <span style={{ fontSize: 9, color: "#555" }}>Max safe: {proCapSafe}</span>
                </div>
                <div>
                  <label style={{ fontSize: 10, color: "#777", textTransform: "uppercase", display: "block", marginBottom: 6 }}>Studio Cap (mo)</label>
                  <input 
                    type="number" 
                    value={adminStudioCap} 
                    onChange={e => setAdminStudioCap(parseInt(e.target.value) || 0)} 
                    style={{ width: "100%", background: "#222", border: "1px solid rgba(255,255,255,0.1)", borderRadius: 4, padding: "10px", color: "#fff" }} 
                  />
                  <span style={{ fontSize: 9, color: "#555" }}>Max safe: {studioCapSafe}</span>
                </div>
              </div>
            </div>

            <div style={{ display: "flex", gap: 12 }}>
              <button onClick={() => setIsAdminOpen(false)} style={{ flex: 1, background: "none", color: "#777", border: "1px solid rgba(255,255,255,0.1)", padding: "10px", borderRadius: 4, cursor: "pointer" }}>Cancel</button>
              <button onClick={saveAdminSettings} style={{ flex: 1, background: "var(--accent)", color: "#fff", padding: "10px", borderRadius: 4, border: "none", cursor: "pointer", fontWeight: 700 }}>Apply Settings</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

window.UploadPage = UploadPage;
window.GeneratePage = GeneratePage;
window.PricingPage = PricingPage;
window.DashboardPage = DashboardPage;
