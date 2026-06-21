import React from 'react';
import { db } from './firebase-config.js';
import { collection, addDoc } from 'firebase/firestore';
import { PlatformFooter } from './platform-nav.jsx';

const trackEvent = (eventName, eventData = {}) => {
  console.log(`[Analytics Event]: ${eventName}`, eventData);
  if (window.gtag) {
    window.gtag('event', eventName, eventData);
  }
};

export function EarlyAccessPage() {
  const [formData, setFormData] = React.useState({
    name: '',
    email: '',
    role: 'viewer'
  });
  const [loading, setLoading] = React.useState(false);
  const [submitted, setSubmitted] = React.useState(false);
  const [error, setError] = React.useState('');

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.name || !formData.email) {
      setError('Please enter both your name and email.');
      return;
    }

    setLoading(true);
    setError('');

    try {
      const waitlistPayload = {
        ...formData,
        submittedAt: new Date().toISOString()
      };

      // 1. Send email via Web3Forms FIRST — always fires regardless of Firebase state
      try {
        const web3Response = await fetch('https://api.web3forms.com/submit', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json', 'Accept': 'application/json' },
          body: JSON.stringify({
            access_key: import.meta.env.VITE_WEB3FORMS_KEY || 'f9b499af-50ba-4dd9-a586-11b04e042ae2',
            subject: `[Madtape] New Early Access Signup — ${formData.name}`,
            from_name: 'Madtape Waitlist',
            replyto: formData.email,
            name: formData.name,
            email: formData.email,
            role: formData.role,
            message: `New early access signup received:\n\nName: ${formData.name}\nEmail: ${formData.email}\nRole: ${formData.role}\nTime: ${new Date().toLocaleString()}`
          })
        });
        const web3Data = await web3Response.json();
        if (!web3Data.success) {
          console.warn('Web3Forms warning:', web3Data.message);
        }
      } catch (emailErr) {
        console.warn('Email notification failed (non-blocking):', emailErr);
      }

      // 2. Save to Firebase with a 5s timeout, fall back to localStorage if it fails
      try {
        const firestoreTimeout = new Promise((_, reject) =>
          setTimeout(() => reject(new Error('Firestore timeout')), 5000)
        );
        await Promise.race([
          addDoc(collection(db, 'waitlist'), waitlistPayload),
          firestoreTimeout
        ]);
      } catch (dbErr) {
        console.warn('Firestore unavailable, saving locally:', dbErr.message);
        const currentLocal = JSON.parse(localStorage.getItem('madtape_waitlist') || '[]');
        currentLocal.push(waitlistPayload);
        localStorage.setItem('madtape_waitlist', JSON.stringify(currentLocal));
      }

      trackEvent('waitlist_submit', { role: formData.role });
      setSubmitted(true);
    } catch (err) {
      console.error('Error saving waitlist:', err);
      setError('An error occurred. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ paddingTop: 80, minHeight: "100vh", background: "var(--bg)", color: "var(--fg)", display: "flex", flexDirection: "column" }}>
      <div style={{ 
        flex: 1, 
        maxWidth: 600, 
        margin: "0 auto", 
        padding: "60px 24px 80px", 
        display: "flex", 
        flexDirection: "column", 
        gap: 36,
        justifyContent: "center"
      }}>
        
        {submitted ? (
          <div style={{ 
            background: "rgba(70, 211, 105, 0.08)", 
            border: "1px solid rgba(70, 211, 105, 0.3)", 
            borderRadius: 6, 
            padding: "40px 32px",
            textAlign: "center",
            animation: "fadeIn 400ms ease both"
          }}>
            <span style={{ fontSize: 40, display: "block", marginBottom: 16 }}>✉</span>
            <h2 style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: 36, color: "#fff", marginBottom: 12 }}>
              You are on the list.
            </h2>
            <p style={{ fontSize: 15, lineHeight: 1.5, color: "var(--fg-dim)" }}>
              You are on the early access list. We will notify you when the first Madtape screening opens.
            </p>
          </div>
        ) : (
          <div style={{ display: "flex", flexDirection: "column", gap: 32 }}>
            
            {/* Minimal Header & Desc */}
            <div style={{ textAlign: "center" }}>
              <div style={{ fontSize: 10, letterSpacing: "0.2em", textTransform: "uppercase", color: "var(--accent)", marginBottom: 8, fontWeight: 700 }}>
                Waitlist Signup
              </div>
              <h1 style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: 48, lineHeight: 1.0, marginBottom: 16 }}>
                Get early access to Madtape.
              </h1>
              <p style={{ fontSize: 14, color: "var(--fg-dim)", lineHeight: 1.5, maxWidth: "45ch", margin: "0 auto" }}>
                Be the first to watch new short-form AI films, vote on upcoming episodes, and connect with emerging generative directors.
              </p>
            </div>

            {/* Trailer embed */}
            <div style={{ 
              width: "100%", 
              aspectRatio: "16/9", 
              background: "#000", 
              borderRadius: 6, 
              overflow: "hidden", 
              border: "1px solid rgba(255, 255, 255, 0.08)",
              boxShadow: "0 12px 30px rgba(0,0,0,0.6)"
            }}>
              <iframe
                src="https://www.youtube.com/embed/YuwL3zfhNtc"
                style={{ width: "100%", height: "100%", border: "none" }}
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
                title="Rootsapiens Trailer"
              />
            </div>

            {/* Error banner */}
            {error && (
              <div style={{ 
                background: "rgba(229, 9, 20, 0.1)", 
                border: "1px solid rgba(229, 9, 20, 0.3)", 
                borderRadius: 4, 
                padding: "10px 12px", 
                color: "#ff4d4d", 
                fontSize: 13 
              }}>
                ⚠️ {error}
              </div>
            )}

            {/* Distraction-free waitlist form */}
            <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: 16 }}>
              <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
                <label htmlFor="name" style={{ fontSize: 11, color: "#aaa", fontWeight: 600 }}>Your Name</label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  required
                  placeholder="John Doe"
                  style={{
                    background: "#141414",
                    border: "1px solid rgba(255,255,255,0.1)",
                    borderRadius: 4,
                    padding: "12px 14px",
                    color: "#fff",
                    outline: "none",
                    fontSize: 14
                  }}
                />
              </div>

              <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
                <label htmlFor="email" style={{ fontSize: 11, color: "#aaa", fontWeight: 600 }}>Email Address</label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  required
                  placeholder="john@example.com"
                  style={{
                    background: "#141414",
                    border: "1px solid rgba(255,255,255,0.1)",
                    borderRadius: 4,
                    padding: "12px 14px",
                    color: "#fff",
                    outline: "none",
                    fontSize: 14
                  }}
                />
              </div>

              <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
                <label htmlFor="role" style={{ fontSize: 11, color: "#aaa", fontWeight: 600 }}>I am a...</label>
                <select
                  id="role"
                  name="role"
                  value={formData.role}
                  onChange={handleChange}
                  style={{
                    background: "#141414",
                    border: "1px solid rgba(255,255,255,0.1)",
                    borderRadius: 4,
                    padding: "12px 14px",
                    color: "#fff",
                    outline: "none",
                    fontSize: 14,
                    cursor: "pointer"
                  }}
                >
                  <option value="viewer">Viewer who wants to watch AI short films</option>
                  <option value="creator">AI Filmmaker who wants to submit films</option>
                  <option value="investor">Early Supporter / Investor / Accelerator</option>
                  <option value="press">Press / Media Representative</option>
                  <option value="other">Other</option>
                </select>
              </div>

              <button
                type="submit"
                disabled={loading}
                style={{
                  background: loading ? "#777" : "var(--accent)",
                  color: "#fff",
                  padding: "14px",
                  fontSize: 15,
                  fontWeight: 700,
                  borderRadius: 4,
                  border: "none",
                  cursor: loading ? "not-allowed" : "pointer",
                  marginTop: 8,
                  transition: "background 0.2s"
                }}
                onMouseEnter={e => { if (!loading) e.currentTarget.style.background = "#ff1f2f"; }}
                onMouseLeave={e => { if (!loading) e.currentTarget.style.background = "var(--accent)"; }}
              >
                {loading ? "Joining..." : "Join Early Access"}
              </button>
            </form>

          </div>
        )}

      </div>
      <PlatformFooter />
    </div>
  );
}
