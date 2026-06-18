import React from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { StatusPill, fmtNum } from './platform-cards.jsx';
import { PlatformFooter } from './platform-nav.jsx';
import { PLATFORM_PLANS, STRIPE_ENABLED } from './platform-data.jsx';
import { db } from './firebase-config.js';
import { collection, addDoc, query, where, getDocs, serverTimestamp } from 'firebase/firestore';

// ── COMMON MODERN STYLES ──
const inputStyle = {
  width: "100%",
  background: "#121212",
  border: "1px solid rgba(255,255,255,0.08)",
  borderRadius: 6,
  padding: "13px 16px",
  color: "#fff",
  fontFamily: "inherit",
  fontSize: 14,
  outline: "none",
  transition: "border-color 150ms ease, box-shadow 150ms ease",
};

const labelStyle = {
  fontSize: 11,
  letterSpacing: "0.15em",
  textTransform: "uppercase",
  color: "#888",
  marginBottom: 8,
  fontWeight: 700,
  display: "block"
};

const cardStyle = {
  background: "rgba(255,255,255,0.02)",
  backdropFilter: "blur(12px)",
  border: "1px solid rgba(255,255,255,0.08)",
  borderRadius: 8,
  padding: "32px 28px",
};

// ── UPLOAD PAGE ──────────────────────────────────────────────────────────────
export function UploadPage({ user, onLogin }) {
  const navigate = useNavigate();
  const [step, setStep] = React.useState(1);
  const [youtubeUrl, setYoutubeUrl] = React.useState("");
  const [youtubeId, setYoutubeId] = React.useState("");
  const [urlError, setUrlError] = React.useState("");
  const [submitting, setSubmitting] = React.useState(false);
  
  // Film details & workflow form
  const [form, setForm] = React.useState({
    title: "",
    desc: "",
    prompt: "",
    model: "",
    category: "",
    challenge: "",
    isPublic: true,
    ownsRights: false,
    tools: "", // comma separated
    steps: "", // block of text
    totalTime: "", // e.g. "6 hours"
    totalCost: "", // e.g. 5.50
    versions: "v1.0",
    creatorNotes: "",
    lessonsLearned: "",
    assetsUsed: "",
  });
  
  const [submitted, setSubmitted] = React.useState(false);

  const set = (k, v) => setForm(f => ({ ...f, [k]: v }));

  const parseYouTubeId = (url) => {
    if (!url) return "";
    const regExp = /(?:youtube\.com\/(?:[^\/]+\/.+\/|(?:v|e(?:mbed)?)\/|.*[?&]v=)|youtu\.be\/|youtube\.com\/shorts\/)([^"&?\/\s]{11})/i;
    const match = url.match(regExp);
    return match ? match[1] : "";
  };

  const handleSubmit = async () => {
    setSubmitting(true);
    const videoId = form.title.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "") || `user-video-${Date.now()}`;
    const toolsArray = form.tools.split(",").map(t => t.trim()).filter(Boolean);
    const stepsArray = form.steps.split("\n").map(s => s.trim()).filter(Boolean);
    const costNum = parseFloat(form.totalCost) || 0;

    const filmData = {
      title: form.title,
      description: form.desc,
      youtubeUrl: youtubeUrl || null,
      videoUrl: null,
      thumbnailUrl: `https://img.youtube.com/vi/${youtubeId}/maxresdefault.jpg`,
      creatorId: user.uid || user.id || "demo-user",
      challengeTag: form.challenge ? (window.CHALLENGES || []).find(c => c.id === form.challenge)?.title : null,
      prompt: form.prompt || "Not disclosed",
      model: form.model,
      category: form.category,
      workflow: {
        tools: toolsArray,
        steps: stepsArray,
        totalTime: form.totalTime || "unknown",
        totalCost: costNum,
        versions: form.versions || "v1.0",
        creatorNotes: form.creatorNotes || "",
        lessonsLearned: form.lessonsLearned || "",
        assetsUsed: form.assetsUsed || "",
      },
      views: 0,
      likes: 0,
      year: 2026,
      status: "published",
    };

    // Firebase Firestore Mode
    if (window.isFirebaseConfigured) {
      try {
        await addDoc(collection(db, "films"), {
          ...filmData,
          createdAt: serverTimestamp(),
          updatedAt: serverTimestamp()
        });
      } catch (err) {
        console.error("Firestore Upload Error:", err);
      }
    }

    // Always sync locally for simulated preview experience
    const newVideo = {
      id: videoId,
      ...filmData,
      creator: user.uid || user.id || "demo-user",
      panel: filmData.thumbnailUrl,
      youtubeId: youtubeId
    };

    if (window.VIDEOS) {
      window.VIDEOS = [newVideo, ...window.VIDEOS];
    }

    setSubmitting(false);
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
      <div style={{ fontSize: 60, color: "var(--good)" }}>✓</div>
      <div style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: 52, lineHeight: 0.9 }}>Film Published.</div>
      <p style={{ color: "#b3b3b3", fontSize: 16, maxWidth: "40ch" }}>Your film has been published to the community feed successfully.</p>
      <div style={{ display: "flex", gap: 12, marginTop: 16 }}>
        <button onClick={() => navigate("/dashboard")} style={{ background: "#fff", color: "#000", padding: "11px 22px", fontSize: 14, fontWeight: 700, borderRadius: 4, border: "none", cursor: "pointer" }}>View in Dashboard</button>
        <button onClick={() => {
          setStep(1); setYoutubeUrl(""); setYoutubeId(""); 
          setForm({ title: "", desc: "", prompt: "", model: "", category: "", challenge: "", isPublic: true, ownsRights: false, tools: "", steps: "", totalTime: "", totalCost: "", versions: "v1.0", creatorNotes: "", lessonsLearned: "", assetsUsed: "" }); 
          setSubmitted(false);
        }} style={{ background: "none", color: "#fff", padding: "11px 22px", fontSize: 14, fontWeight: 600, borderRadius: 4, border: "1px solid rgba(255,255,255,0.2)", cursor: "pointer" }}>Upload Another</button>
      </div>
    </div>
  );

  return (
    <div style={{ paddingTop: 80, minHeight: "100vh" }}>
      <div style={{ maxWidth: 760, margin: "0 auto", padding: "40px 24px 80px" }}>
        
        {/* Progress Tracker */}
        <div style={{ display: "flex", gap: 0, marginBottom: 48, borderBottom: "2px solid rgba(255,255,255,0.07)" }}>
          {[["1","Source & Rights"],["2","Details & Prompt"],["3","Production Workflow"],["4","Review"]].map(([n, l], i) => (
            <div key={n} style={{ padding: "10px 20px 12px", borderBottom: step === i+1 ? "2px solid var(--accent)" : "2px solid transparent", marginBottom: -2, cursor: step > i+1 ? "pointer" : "default", color: step === i+1 ? "#fff" : step > i+1 ? "#b3b3b3" : "#555" }} onClick={() => step > i+1 && setStep(i+1)}>
              <span style={{ fontSize: 11, letterSpacing: "0.1em" }}>{n}. {l}</span>
            </div>
          ))}
        </div>

        <h1 style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: 52, lineHeight: 0.9, marginBottom: 32, letterSpacing: "0.005em" }}>Upload Your AI Film</h1>

        {/* Step 1: Source and Rights */}
        {step === 1 && (
          <div style={{ display: "flex", flexDirection: "column", gap: 24 }}>
            <div style={{ ...cardStyle, display: "flex", flexDirection: "column", gap: 20 }}>
              <div>
                <label style={labelStyle}>YouTube Video URL *</label>
                <input
                  type="text"
                  style={inputStyle}
                  placeholder="e.g. https://www.youtube.com/watch?v=B-lfTmZp1DE"
                  value={youtubeUrl}
                  onChange={e => {
                    const val = e.target.value;
                    setYoutubeUrl(val);
                    const id = parseYouTubeId(val);
                    if (val && !id) {
                      setUrlError("Invalid YouTube URL. Please use a valid watch link, embed, shorts, or short youtu.be link.");
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
                  <div style={{ width: "100%", maxWidth: 360, aspectRatio: "16/9", borderRadius: 4, overflow: "hidden", position: "relative", border: "1px solid rgba(255,255,255,0.1)" }}>
                    <img
                      src={`https://img.youtube.com/vi/${youtubeId}/mqdefault.jpg`}
                      alt="YouTube Preview"
                      style={{ width: "100%", height: "100%", objectFit: "cover" }}
                    />
                  </div>
                </div>
              )}
            </div>

            <div style={{ padding: "18px", background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.08)", borderRadius: 4 }}>
              <label style={{ display: "flex", gap: 10, alignItems: "flex-start", cursor: "pointer", fontSize: 13, color: "#b3b3b3" }}>
                <input type="checkbox" checked={form.ownsRights} onChange={e => set("ownsRights", e.target.checked)} style={{ marginTop: 2, accentColor: "var(--accent)" }} />
                <span>I confirm I am the original creator of this AI film, and it complies with Madtape's Content Guidelines. No unauthorized likenesses or stolen works.</span>
              </label>
            </div>

            <button 
              onClick={() => setStep(2)} 
              disabled={!youtubeId || !form.ownsRights} 
              style={{ 
                alignSelf: "flex-start", 
                background: youtubeId && form.ownsRights ? "var(--accent)" : "#333", 
                color: "#fff", 
                padding: "12px 28px", 
                fontSize: 14, 
                fontWeight: 700, 
                borderRadius: 4, 
                border: "none", 
                cursor: youtubeId && form.ownsRights ? "pointer" : "not-allowed",
                transition: "background 150ms"
              }}
            >
              Continue →
            </button>
          </div>
        )}

        {/* Step 2: Metadata Details */}
        {step === 2 && (
          <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
            <div>
              <label style={labelStyle}>Film Title *</label>
              <input style={inputStyle} placeholder="Name your cinematic piece" value={form.title} onChange={e => set("title", e.target.value)} />
            </div>
            <div>
              <label style={labelStyle}>Film Description *</label>
              <textarea style={{ ...inputStyle, minHeight: 80, resize: "vertical" }} placeholder="Describe the mood, story, or message behind this generation" value={form.desc} onChange={e => set("desc", e.target.value)} />
            </div>
            <div>
              <label style={labelStyle}>Core Prompt (optional)</label>
              <textarea style={{ ...inputStyle, minHeight: 80, resize: "vertical" }} placeholder="Share the core text prompt used to render this video, if you choose to reveal it" value={form.prompt} onChange={e => set("prompt", e.target.value)} />
            </div>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
              <div>
                <label style={labelStyle}>Primary AI Model *</label>
                <select style={{ ...inputStyle, cursor: "pointer" }} value={form.model} onChange={e => set("model", e.target.value)}>
                  <option value="">Select AI model</option>
                  {["Seedance Fast", "Seedance 2.0", "Runway Gen-4", "Kling 2", "Veo 4", "Luma", "Pika 2", "Hailuo", "Other"].map(m => <option key={m} value={m}>{m}</option>)}
                </select>
              </div>
              <div>
                <label style={labelStyle}>Film Category *</label>
                <select style={{ ...inputStyle, cursor: "pointer" }} value={form.category} onChange={e => set("category", e.target.value)}>
                  <option value="">Select category</option>
                  {["Sci-Fi", "Horror", "Drama", "Action", "Fashion", "Experimental", "Documentary", "Animation", "Fantasy", "Comedy"].map(c => <option key={c} value={c}>{c}</option>)}
                </select>
              </div>
            </div>
            <div>
              <label style={labelStyle}>Submit to Challenge (optional)</label>
              <select style={{ ...inputStyle, cursor: "pointer" }} value={form.challenge} onChange={e => set("challenge", e.target.value)}>
                <option value="">No challenge entry</option>
                {(window.CHALLENGES || []).filter(c => c.status === "open").map(c => <option key={c.id} value={c.id}>{c.title}</option>)}
              </select>
            </div>
            <div style={{ display: "flex", gap: 12, marginTop: 10 }}>
              <button onClick={() => setStep(1)} style={{ background: "none", color: "#b3b3b3", padding: "12px 20px", fontSize: 14, borderRadius: 4, border: "1px solid rgba(255,255,255,0.15)", cursor: "pointer" }}>← Back</button>
              <button onClick={() => setStep(3)} disabled={!form.title || !form.desc || !form.model || !form.category} style={{ background: form.title && form.desc && form.model && form.category ? "var(--accent)" : "#333", color: "#fff", padding: "12px 28px", fontSize: 14, fontWeight: 700, borderRadius: 4, border: "none", cursor: "pointer" }}>Continue →</button>
            </div>
          </div>
        )}

        {/* Step 3: Workflow Details */}
        {step === 3 && (
          <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
            <p style={{ color: "#aaa", fontSize: 13, lineHeight: 1.5, marginBottom: 10 }}>
              Madtape is built on workflow transparency. Share details about how this film was compiled so other emerging filmmakers can learn from your process.
            </p>
            <div>
              <label style={labelStyle}>Tools Used * <span style={{ fontSize: 10, color: "#555", textTransform: "none" }}>(Comma-separated list)</span></label>
              <input style={inputStyle} placeholder="e.g. Midjourney, Seedance 2.0, ElevenLabs, Premiere Pro" value={form.tools} onChange={e => set("tools", e.target.value)} />
            </div>
            <div>
              <label style={labelStyle}>Production Steps * <span style={{ fontSize: 10, color: "#555", textTransform: "none" }}>(One step per line)</span></label>
              <textarea style={{ ...inputStyle, minHeight: 100, resize: "vertical" }} placeholder="Step 1: Generated keyframes in Midjourney&#10;Step 2: Rendered 5s clip using Seedance 2.0 image-to-video&#10;Step 3: Sound design and foley layout inside Adobe Audition" value={form.steps} onChange={e => set("steps", e.target.value)} />
            </div>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
              <div>
                <label style={labelStyle}>Production Time</label>
                <input style={inputStyle} placeholder="e.g. 4 hours" value={form.totalTime} onChange={e => set("totalTime", e.target.value)} />
              </div>
              <div>
                <label style={labelStyle}>Estimated Cost (USD)</label>
                <input type="number" step="0.5" style={inputStyle} placeholder="e.g. 4.50" value={form.totalCost} onChange={e => set("totalCost", e.target.value)} />
              </div>
            </div>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
              <div>
                <label style={labelStyle}>Workflow Version</label>
                <input style={inputStyle} placeholder="e.g. v1.0" value={form.versions} onChange={e => set("versions", e.target.value)} />
              </div>
              <div>
                <label style={labelStyle}>Assets Used (optional)</label>
                <input style={inputStyle} placeholder="e.g. Luma keyframes, reference images" value={form.assetsUsed} onChange={e => set("assetsUsed", e.target.value)} />
              </div>
            </div>
            <div>
              <label style={labelStyle}>Creator Notes (optional)</label>
              <textarea style={{ ...inputStyle, minHeight: 60, resize: "vertical" }} placeholder="Specify custom prompt weights, camera path settings, and parameters" value={form.creatorNotes} onChange={e => set("creatorNotes", e.target.value)} />
            </div>
            <div>
              <label style={labelStyle}>Lessons Learned (optional)</label>
              <textarea style={{ ...inputStyle, minHeight: 60, resize: "vertical" }} placeholder="What did you learn? What would you do differently next time?" value={form.lessonsLearned} onChange={e => set("lessonsLearned", e.target.value)} />
            </div>
            <div style={{ display: "flex", gap: 12, marginTop: 10 }}>
              <button onClick={() => setStep(2)} style={{ background: "none", color: "#b3b3b3", padding: "12px 20px", fontSize: 14, borderRadius: 4, border: "1px solid rgba(255,255,255,0.15)", cursor: "pointer" }}>← Back</button>
              <button onClick={() => setStep(4)} disabled={!form.tools.trim() || !form.steps.trim()} style={{ background: form.tools.trim() && form.steps.trim() ? "var(--accent)" : "#333", color: "#fff", padding: "12px 28px", fontSize: 14, fontWeight: 700, borderRadius: 4, border: "none", cursor: "pointer" }}>Review Submission →</button>
            </div>
          </div>
        )}

        {/* Step 4: Review */}
        {step === 4 && (
          <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
            <div style={{ ...cardStyle, padding: "24px", display: "flex", flexDirection: "column", gap: 16 }}>
              <h2 style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: 32, borderBottom: "1px solid rgba(255,255,255,0.08)", paddingBottom: 12 }}>{form.title}</h2>
              <div>
                <span style={{ ...labelStyle, display: "inline-block", marginRight: 10 }}>YouTube Link:</span>
                <span style={{ color: "#aaa" }}>{youtubeUrl}</span>
              </div>
              <div>
                <span style={{ ...labelStyle, display: "inline-block", marginRight: 10 }}>AI Model:</span>
                <span style={{ color: "#fff", fontWeight: 600 }}>{form.model}</span>
              </div>
              <div>
                <span style={{ ...labelStyle, display: "inline-block", marginRight: 10 }}>Category:</span>
                <span style={{ color: "#fff", fontWeight: 600 }}>{form.category}</span>
              </div>
              <div>
                <span style={{ ...labelStyle, display: "block", marginBottom: 4 }}>Workflow Tools:</span>
                <span style={{ color: "#aaa" }}>{form.tools}</span>
              </div>
            </div>
            <button 
              onClick={handleSubmit} 
              disabled={submitting}
              style={{ alignSelf: "flex-start", background: "var(--accent)", color: "#fff", padding: "14px 32px", fontSize: 15, fontWeight: 700, borderRadius: 4, border: "none", cursor: submitting ? "not-allowed" : "pointer" }}
            >
              {submitting ? "Publishing..." : "Publish Film"}
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

// ── GENERATE PAGE ─────────────────────────────────────────────────────────────
export function GeneratePage({ user, onLogin }) {
  const [showNotice, setShowNotice] = React.useState(false);

  return (
    <div style={{ paddingTop: 80, minHeight: "100vh", color: "#fff" }}>
      <div style={{ maxWidth: 860, margin: "0 auto", padding: "60px 24px 80px", textAlign: "center" }}>
        
        {/* Main Banner */}
        <div style={{ ...cardStyle, background: "rgba(229,9,20,0.03)", borderColor: "rgba(229,9,20,0.15)", padding: "48px 32px", marginBottom: 40 }}>
          <div style={{ fontSize: 32, marginBottom: 12 }}>⚡</div>
          <h1 style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: 56, lineHeight: 0.9, marginBottom: 16 }}>Optional Generation Toolkit</h1>
          <p style={{ fontSize: 16, color: "#b3b3b3", maxWidth: "60ch", margin: "0 auto 24px", lineHeight: 1.5 }}>
            Generation is not the core product. Madtape may offer optional generation tools for creators who want to render, extend, upscale, retry, or test scenes inside the platform.
          </p>
          <p style={{ fontSize: 14, color: "#888", maxWidth: "60ch", margin: "0 auto 24px" }}>
            Generation will be priced by real compute usage. No unlimited compute. No hidden credit traps. No below-cost renders.
          </p>
          <div style={{ display: "flex", gap: 10, justifyContent: "center" }}>
            <span style={{ padding: "6px 12px", background: "rgba(255,255,255,0.06)", border: "1px solid rgba(255,255,255,0.1)", borderRadius: 100, fontSize: 12, color: "#aaa" }}>📅 Planned Release: Month 4</span>
            <span style={{ padding: "6px 12px", background: "rgba(229,9,20,0.08)", border: "1px solid rgba(229,9,20,0.2)", borderRadius: 100, fontSize: 12, color: "var(--accent)" }}>● Compute-Based Pricing</span>
          </div>
        </div>

        <div style={{ ...cardStyle, maxWidth: 600, margin: "0 auto 40px", padding: 32 }}>
          <h3 style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: 28, marginBottom: 16 }}>Future Pricing Strategy</h3>
          <p style={{ fontSize: 13, color: "#aaa", lineHeight: 1.6, marginBottom: 20 }}>
            Optional generation tools are planned for future release. Generation pricing will depend on real provider cost, selected model, duration, resolution, workflow type, retries, and output quality. Madtape will not offer unlimited generation or below-cost rendering.
          </p>
          <button 
            onClick={() => setShowNotice(true)}
            style={{ width: "100%", background: "var(--accent)", color: "#fff", border: "none", padding: "12px", borderRadius: 4, fontWeight: 700, cursor: "pointer" }}
          >
            Get Notified on Release
          </button>
        </div>

        <p style={{ color: "#555", fontSize: 13 }}>
          For now, please compile your films locally and use the <Link to="/upload" style={{ color: "var(--accent)", textDecoration: "underline" }}>Upload Page</Link> to share workflows and compete in challenges!
        </p>

      </div>

      {/* Stripe-Disabled Modal Notification */}
      {showNotice && (
        <div style={{ position: "fixed", inset: 0, zIndex: 9999, background: "rgba(0,0,0,0.85)", display: "flex", alignItems: "center", justifyContent: "center" }}>
          <div style={{ ...cardStyle, width: 400, maxWidth: "90vw", display: "flex", flexDirection: "column", gap: 16 }}>
            <h3 style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: 32 }}>Coming Soon</h3>
            <p style={{ color: "#b3b3b3", fontSize: 14, lineHeight: 1.5 }}>
              Optional generation toolkit and Stripe integration are disabled during this beta preview. Real compute-based configurations will go live in a future launch.
            </p>
            <button 
              onClick={() => setShowNotice(false)} 
              style={{ background: "var(--accent)", color: "#fff", padding: "10px", borderRadius: 4, border: "none", cursor: "pointer", fontWeight: 700 }}
            >
              Understand
            </button>
          </div>
        </div>
      )}

    </div>
  );
}

// ── PRICING PAGE ──────────────────────────────────────────────────────────────
export function PricingPage({ user, onLogin }) {
  const plans = window.PLATFORM_PLANS || PLATFORM_PLANS;
  const [showNotice, setShowNotice] = React.useState(false);

  return (
    <div style={{ paddingTop: 80, color: "#fff" }}>
      
      {/* Header */}
      <div style={{ padding: "60px 24px 0", textAlign: "center" }}>
        <h1 style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: 72, lineHeight: 0.88, marginBottom: 16 }}>Madtape Pricing</h1>
        <p style={{ fontSize: 16, color: "#b3b3b3", maxWidth: "56ch", margin: "0 auto 40px", lineHeight: 1.5 }}>
          Simple, honest pricing. Access publishing and analytics dashboards, share workflows, and support creators directly.
        </p>
      </div>

      {/* Section A: Creator Publishing Plans */}
      <div style={{ padding: "0 24px 60px" }}>
        <h2 style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: 40, marginBottom: 32, textAlign: "center" }}>Creator Publishing Plans</h2>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 24, maxWidth: 1000, margin: "0 auto" }}>
          {plans.map((p) => (
            <div key={p.id} style={{ ...cardStyle, display: "flex", flexDirection: "column", background: p.popular ? "rgba(229,9,20,0.04)" : "rgba(255,255,255,0.02)", border: p.popular ? "2px solid var(--accent)" : "1px solid rgba(255,255,255,0.08)", position: "relative" }}>
              {p.popular && <div style={{ position: "absolute", top: 0, left: 0, right: 0, height: 3, background: "var(--accent)" }} />}
              <div style={{ fontSize: 10, letterSpacing: "0.15em", textTransform: "uppercase", color: p.popular ? "var(--accent)" : "#555", marginBottom: 12, fontWeight: 700 }}>{p.popular ? "Recommended" : "Subscription Tier"}</div>
              <h3 style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: 36, marginBottom: 8 }}>{p.name}</h3>
              <div style={{ marginBottom: 20 }}>
                <span style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: 44 }}>${p.price}</span>
                <span style={{ fontSize: 13, color: "#777" }}> / month</span>
              </div>
              <div style={{ flex: 1, display: "flex", flexDirection: "column", gap: 10, marginBottom: 28 }}>
                {p.perks.map(perk => (
                  <div key={perk} style={{ display: "flex", gap: 8, fontSize: 12, color: "#b3b3b3" }}>
                    <span style={{ color: "var(--accent)" }}>✓</span> {perk}
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
                  if (!user) { onLogin(); } else { setShowNotice(true); }
                }}
                style={{ width: "100%", background: p.popular ? "var(--accent)" : "rgba(255,255,255,0.08)", color: "#fff", padding: "12px", fontSize: 14, fontWeight: 700, borderRadius: 4, border: "none", cursor: "pointer" }}
              >
                {user && user.plan === p.id ? "Current Plan" : p.cta}
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* Section B: Direct Creator Support */}
      <div style={{ padding: "60px 24px", background: "rgba(255,255,255,0.01)", borderTop: "1px solid rgba(255,255,255,0.05)", borderBottom: "1px solid rgba(255,255,255,0.05)" }}>
        <div style={{ maxWidth: 800, margin: "0 auto", textAlign: "center" }}>
          <h2 style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: 40, marginBottom: 16 }}>Direct Creator Support</h2>
          <p style={{ fontSize: 16, color: "#b3b3b3", lineHeight: 1.6, marginBottom: 24 }}>
            Supporters can directly support creators. Creators receive 95% of the platform support split. Madtape takes a clearly disclosed 5% platform fee. Payment processing fees, refunds, taxes, and legal deductions may apply.
          </p>
          <div style={{ display: "inline-block", background: "rgba(229,9,20,0.06)", border: "1px solid rgba(229,9,20,0.2)", padding: "12px 20px", borderRadius: 4, fontSize: 13, color: "var(--accent)" }}>
            * Payments are currently disabled during the beta preview.
          </div>
        </div>
      </div>

      {/* Section C: Optional Generation */}
      <div style={{ padding: "60px 24px", borderBottom: "1px solid rgba(255,255,255,0.05)" }}>
        <div style={{ maxWidth: 800, margin: "0 auto", textAlign: "center" }}>
          <h2 style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: 40, marginBottom: 16 }}>Optional Generation</h2>
          <p style={{ fontSize: 16, color: "#b3b3b3", lineHeight: 1.6, marginBottom: 24 }}>
            Optional generation tools are planned for future release. Generation pricing will depend on real provider cost, selected model, duration, resolution, workflow type, retries, and output quality. Madtape will not offer unlimited generation or below-cost rendering.
          </p>
          <div style={{ color: "#777", fontSize: 13 }}>
            No credit packages, pre-paid bundles, or hidden traps. Pay strictly for the GPU compute you use.
          </div>
        </div>
      </div>

      {/* FAQ Block */}
      <div style={{ padding: "60px 24px 80px", maxWidth: 800, margin: "0 auto" }}>
        <h2 style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: 40, marginBottom: 32, textAlign: "center" }}>Frequently Asked Questions</h2>
        <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
          {[
            {
              q: "Is Madtape an AI video generator?",
              a: "No. Madtape is a publishing and discovery platform for AI-native cinema. Optional generation tools may be added later, but the core product is publishing, workflow transparency, discovery, and creator support."
            },
            {
              q: "Why do films include workflows?",
              a: "Because AI-native cinema is also a learning ecosystem. Viewers and creators can understand how a film was made, what tools were used, how long it took, and what it cost."
            },
            {
              q: "How does creator support work?",
              a: "Supporters can directly support creators. Creators receive 95% of the platform support split, while Madtape takes a clearly disclosed 5% platform fee. Payment processing fees, refunds, taxes, and legal deductions may apply."
            },
            {
              q: "Is generation included in subscriptions?",
              a: "No. Publishing subscriptions are separate from compute. Optional generation tools will be priced separately based on real usage if enabled later."
            },
            {
              q: "Is this crowdfunding?",
              a: "Madtape may test reward-based audience support for creative projects. It is not equity investment, profit sharing, or financial crowdfunding."
            },
            {
              q: "Are payments live?",
              a: "No. Payments are disabled during beta preview. No real transaction is processed yet."
            }
          ].map((faq, i) => (
            <div key={i} style={{ background: "#111", border: "1px solid #1f1f1f", padding: 24, borderRadius: 6 }}>
              <h4 style={{ fontSize: 16, fontWeight: 700, marginBottom: 10, color: "#fff" }}>{faq.q}</h4>
              <p style={{ fontSize: 14, color: "#aaa", lineHeight: 1.5 }}>{faq.a}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Footer message */}
      <div style={{ background: "rgba(0,0,0,0.5)", borderTop: "1px solid rgba(255,255,255,0.06)", padding: "32px 56px", fontSize: 12, color: "#555", textAlign: "center", lineHeight: 1.6 }}>
        Madtape is a transparent creator platform for short-form AI cinema where filmmakers can publish work, share workflows, join challenges, receive support, and later access fair AI generation tools.
      </div>

      <PlatformFooter />

      {/* Stripe-Disabled Modal Notice */}
      {showNotice && (
        <div style={{ position: "fixed", inset: 0, zIndex: 9999, background: "rgba(0,0,0,0.85)", display: "flex", alignItems: "center", justifyContent: "center" }}>
          <div style={{ ...cardStyle, width: 400, maxWidth: "90vw", display: "flex", flexDirection: "column", gap: 16 }}>
            <h3 style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: 32 }}>Payments Coming Soon</h3>
            <p style={{ color: "#b3b3b3", fontSize: 14, lineHeight: 1.5 }}>
              Payments and subscription configurations are disabled during this beta preview. Real Stripe Checkout transactions will be enabled for public launch.
            </p>
            <button 
              onClick={() => setShowNotice(false)} 
              style={{ background: "var(--accent)", color: "#fff", padding: "10px", borderRadius: 4, border: "none", cursor: "pointer", fontWeight: 700 }}
            >
              Understand
            </button>
          </div>
        </div>
      )}

    </div>
  );
}

// ── DASHBOARD ─────────────────────────────────────────────────────────────────
export function DashboardPage({ user, onLogin }) {
  const navigate = useNavigate();
  const [showNotice, setShowNotice] = React.useState(false);
  const [films, setFilms] = React.useState([]);
  const [loading, setLoading] = React.useState(true);

  React.useEffect(() => {
    const fetchFilms = async () => {
      setLoading(true);
      if (window.isFirebaseConfigured && user) {
        try {
          const q = query(collection(db, "films"), where("creatorId", "==", user.uid));
          const querySnapshot = await getDocs(q);
          const docs = [];
          querySnapshot.forEach((doc) => {
            docs.push({ id: doc.id, ...doc.data() });
          });
          setFilms(docs);
        } catch (err) {
          console.error("Firestore fetch error:", err);
          // fallback to window
          const localFilms = (window.VIDEOS || []).filter(v => v.creator === user.uid || v.creator === user.id);
          setFilms(localFilms);
        }
      } else if (user) {
        const localFilms = (window.VIDEOS || []).filter(v => v.creator === user.uid || v.creator === user.id);
        setFilms(localFilms);
      }
      setLoading(false);
    };

    fetchFilms();
  }, [user]);

  if (!user) return (
    <div style={{ paddingTop: 80, minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center", flexDirection: "column", gap: 16 }}>
      <div style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: 48 }}>Dashboard</div>
      <p style={{ color: "#b3b3b3" }}>Sign in to access your creator dashboard.</p>
      <button onClick={onLogin} style={{ background: "var(--accent)", color: "#fff", padding: "11px 24px", fontSize: 14, fontWeight: 700, borderRadius: 4, border: "none", cursor: "pointer" }}>Sign In</button>
    </div>
  );

  const planDetails = (PLATFORM_PLANS).find(p => p.id === user.plan) || PLATFORM_PLANS[0];
  
  // Stored real values only, no fakes
  const totalViews = films.reduce((acc, curr) => acc + (curr.views || 0), 0);
  const totalLikes = films.reduce((acc, curr) => acc + (curr.likes || 0), 0);
  const totalDonations = 0; // Donations only populated through real backend webhook transactions

  const stats = [
    { l: "Total Views", v: fmtNum(totalViews) },
    { l: "Total Likes", v: fmtNum(totalLikes) },
    { l: "Total Donations", v: `$${totalDonations.toFixed(2)}` },
    { l: "Films Uploaded", v: String(films.length) }
  ];

  return (
    <div style={{ paddingTop: 80, minHeight: "100vh" }}>
      <div style={{ padding: "40px 56px 60px" }}>
        
        {/* Welcome row */}
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end", marginBottom: 40 }}>
          <div>
            <div style={{ fontSize: 13, color: "#777", marginBottom: 6 }}>Welcome back,</div>
            <h1 style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: 52, lineHeight: 0.9, letterSpacing: "0.005em" }}>{user.name}</h1>
          </div>
          <div style={{ display: "flex", gap: 10 }}>
            <button onClick={() => navigate("/upload")} style={{ background: "var(--accent)", color: "#fff", padding: "10px 20px", fontSize: 13, fontWeight: 700, borderRadius: 4, border: "none", cursor: "pointer" }}>↑ Upload Film</button>
            <button onClick={() => navigate("/generate")} style={{ background: "rgba(255,255,255,0.08)", color: "#fff", padding: "10px 20px", fontSize: 13, fontWeight: 600, borderRadius: 4, border: "1px solid rgba(255,255,255,0.1)", cursor: "pointer" }}>⚡ AI Video Gen</button>
          </div>
        </div>

        {/* Analytics stats */}
        <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 20, marginBottom: 40 }}>
          {stats.map((s) => (
            <div key={s.l} style={{ ...cardStyle, padding: "20px 24px" }}>
              <div style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: 40, color: "#fff", lineHeight: 1, marginBottom: 4 }}>{s.v}</div>
              <div style={{ fontSize: 11, color: "#555", letterSpacing: "0.1em", textTransform: "uppercase" }}>{s.l}</div>
            </div>
          ))}
        </div>

        {/* Dynamic content splits */}
        <div style={{ display: "grid", gridTemplateColumns: "2fr 1fr", gap: 40 }}>
          
          {/* Left: Creator's films list */}
          <div>
            <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 18 }}>
              <h3 style={{ fontSize: 18, fontWeight: 700 }}>Your Published Films</h3>
            </div>
            
            {loading ? (
              <p style={{ color: "#555" }}>Loading films list...</p>
            ) : films.length === 0 ? (
              <div style={{ ...cardStyle, padding: "40px", textAlign: "center", color: "#777" }}>
                You haven't uploaded any films yet. Share your first creation!
              </div>
            ) : (
              <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
                {films.map(v => (
                  <div key={v.id} style={{ display: "flex", gap: 16, alignItems: "center", padding: "12px", border: "1px solid rgba(255,255,255,0.05)", borderRadius: 6, background: "rgba(255,255,255,0.01)" }}>
                    <div style={{ width: 80, aspectRatio: "16/9", flexShrink: 0, borderRadius: 4, overflow: "hidden", background: "#111", position: "relative" }}>
                      <img src={v.thumbnailUrl || v.panel} alt="" style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                    </div>
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <div style={{ fontWeight: 600, fontSize: 14, marginBottom: 3, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{v.title}</div>
                      <div style={{ display: "flex", gap: 10, fontSize: 11, color: "#777" }}>
                        <span>▶ {fmtNum(v.views)} views</span>
                        <span>♥ {fmtNum(v.likes)} likes</span>
                      </div>
                    </div>
                    <StatusPill status={v.status || "published"} />
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Right: Plan Status & Stripe Connect */}
          <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
            
            {/* Plan Card */}
            <div style={{ ...cardStyle, padding: "24px" }}>
              <span style={{ fontSize: 10, color: "#555", textTransform: "uppercase", letterSpacing: "0.1em", fontWeight: 700 }}>Active Publishing Plan</span>
              <div style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: 44, color: "#fff", lineHeight: 1, marginTop: 4 }}>{planDetails.name}</div>
              <p style={{ fontSize: 12, color: "#777", marginTop: 8, lineHeight: 1.5 }}>
                Monthly Fee: ${planDetails.price}/mo<br />
                {planDetails.id === "free" && "Upgrade to upload more films and access detailed analytics dashboards."}
                {planDetails.id === "creator" && "You have access to detailed creator metrics dashboards."}
                {planDetails.id === "pro" && "You have priority indexing in challenges and 24/7 technical support."}
              </p>
              <button 
                onClick={() => navigate("/pricing")}
                style={{ width: "100%", background: "var(--accent)", color: "#fff", padding: "10px", fontSize: 13, fontWeight: 700, borderRadius: 4, border: "none", cursor: "pointer", marginTop: 20 }}
              >
                Manage Plan
              </button>
            </div>

            {/* Stripe Connect Card */}
            <div style={{ ...cardStyle, padding: "24px" }}>
              <span style={{ fontSize: 10, color: "#555", textTransform: "uppercase", letterSpacing: "0.1em", fontWeight: 700 }}>Audience Support (Stripe Connect)</span>
              <h4 style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: 32, color: "#fff", lineHeight: 1, marginTop: 4 }}>Get Paid Directly</h4>
              <p style={{ fontSize: 12, color: "#777", marginTop: 8, lineHeight: 1.4 }}>
                Set up your Stripe Connect account to receive donations and reward-based support from viewers. We take a flat 5% platform fee to host your content; you keep 95% of your funding.
              </p>
              <button 
                onClick={() => setShowNotice(true)}
                style={{ width: "100%", background: "rgba(255,255,255,0.08)", color: "#fff", padding: "10px", fontSize: 13, fontWeight: 700, borderRadius: 4, border: "none", cursor: "pointer", marginTop: 20 }}
              >
                Connect Stripe
              </button>
            </div>

          </div>

        </div>
      </div>

      {/* Stripe Connect Notice Modal */}
      {showNotice && (
        <div style={{ position: "fixed", inset: 0, zIndex: 9999, background: "rgba(0,0,0,0.85)", display: "flex", alignItems: "center", justifyContent: "center" }}>
          <div style={{ ...cardStyle, width: 400, maxWidth: "90vw", display: "flex", flexDirection: "column", gap: 16 }}>
            <h3 style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: 32 }}>Stripe Connect Onboarding</h3>
            <p style={{ color: "#b3b3b3", fontSize: 14, lineHeight: 1.5 }}>
              Stripe Connect onboarding is disabled in this beta version. It will be enabled for public registration upon the main launch.
            </p>
            <button 
              onClick={() => setShowNotice(false)} 
              style={{ background: "var(--accent)", color: "#fff", padding: "10px", borderRadius: 4, border: "none", cursor: "pointer", fontWeight: 700 }}
            >
              Understand
            </button>
          </div>
        </div>
      )}

    </div>
  );
}

// Bind to window object
if (typeof window !== "undefined") {
  window.UploadPage = UploadPage;
  window.GeneratePage = GeneratePage;
  window.PricingPage = PricingPage;
  window.DashboardPage = DashboardPage;
}
