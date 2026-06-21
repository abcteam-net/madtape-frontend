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

export function SubmitPage() {
  const [formData, setFormData] = React.useState({
    creatorName: '',
    email: '',
    filmTitle: '',
    filmLink: '',
    runtime: '',
    toolsUsed: '',
    synopsis: '',
    ownsRights: false,
    permissionToFeature: false
  });

  const [loading, setLoading] = React.useState(false);
  const [submitted, setSubmitted] = React.useState(false);
  const [error, setError] = React.useState('');

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.creatorName || !formData.email || !formData.filmTitle || !formData.filmLink) {
      setError('Please fill in all required fields.');
      return;
    }
    if (!formData.ownsRights) {
      setError('You must confirm that you own or control the rights to the film.');
      return;
    }

    setLoading(true);
    setError('');

    try {
      const submissionPayload = {
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
            subject: `[Madtape] New Film Submission — ${formData.filmTitle}`,
            from_name: 'Madtape Film Submissions',
            replyto: formData.email,
            name: formData.creatorName,
            email: formData.email,
            film_title: formData.filmTitle,
            film_link: formData.filmLink,
            runtime: formData.runtime,
            tools_used: formData.toolsUsed,
            message: [
              `New film submission received:`,
              ``,
              `Creator: ${formData.creatorName}`,
              `Email: ${formData.email}`,
              `Film Title: ${formData.filmTitle}`,
              `Film Link: ${formData.filmLink}`,
              `Runtime: ${formData.runtime}`,
              `Tools Used: ${formData.toolsUsed}`,
              `Synopsis: ${formData.synopsis}`,
              `Owns Rights: ${formData.ownsRights ? 'Yes' : 'No'}`,
              `Permission to Feature: ${formData.permissionToFeature ? 'Yes' : 'No'}`,
              `Submitted At: ${new Date().toLocaleString()}`
            ].join('\n')
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
          addDoc(collection(db, 'submissions'), submissionPayload),
          firestoreTimeout
        ]);
      } catch (dbErr) {
        console.warn('Firestore unavailable, saving locally:', dbErr.message);
        const currentLocal = JSON.parse(localStorage.getItem('madtape_submissions') || '[]');
        currentLocal.push(submissionPayload);
        localStorage.setItem('madtape_submissions', JSON.stringify(currentLocal));
      }

      trackEvent('film_submit', { title: formData.filmTitle });
      setSubmitted(true);
    } catch (err) {
      console.error('Error saving submission:', err);
      setError('An error occurred. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ paddingTop: 80, minHeight: "100vh", background: "var(--bg)", color: "var(--fg)" }}>
      <div style={{ maxWidth: 700, margin: "0 auto", padding: "40px 24px 80px" }}>
        
        {submitted ? (
          <div style={{ 
            background: "rgba(70, 211, 105, 0.08)", 
            border: "1px solid rgba(70, 211, 105, 0.3)", 
            borderRadius: 6, 
            padding: "40px 32px",
            textAlign: "center",
            marginTop: 40,
            animation: "fadeIn 400ms ease both"
          }}>
            <span style={{ fontSize: 48, display: "block", marginBottom: 20 }}>🎬</span>
            <h2 style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: 42, color: "#fff", marginBottom: 16 }}>
              Submission Received
            </h2>
            <p style={{ fontSize: 16, lineHeight: 1.6, color: "var(--fg-dim)", maxWidth: "55ch", margin: "0 auto" }}>
              Submission received. We review films for story, cinematic quality, originality, and fit with Madtape’s early launch.
            </p>
            <button 
              onClick={() => setSubmitted(false)}
              style={{
                marginTop: 24,
                background: "rgba(255, 255, 255, 0.08)",
                border: "1px solid rgba(255, 255, 255, 0.15)",
                color: "#fff",
                padding: "10px 24px",
                borderRadius: 4,
                cursor: "pointer",
                fontWeight: 600,
                fontSize: 13
              }}
            >
              Submit Another Film
            </button>
          </div>
        ) : (
          <div>
            <div style={{ marginBottom: 32 }}>
              <div style={{ fontSize: 11, letterSpacing: "0.2em", textTransform: "uppercase", color: "var(--accent)", marginBottom: 8, fontWeight: 700 }}>
                Creator Funnel
              </div>
              <h1 style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: 56, lineHeight: 1.0, marginBottom: 16 }}>
                Submit Your AI Short Film
              </h1>
              <p style={{ fontSize: 15, color: "var(--fg-dim)", lineHeight: 1.6 }}>
                We are selecting the first 100 AI filmmakers to feature in the Madtape early access launch. Review our guidelines and submit your project below.
              </p>
            </div>

            {error && (
              <div style={{ 
                background: "rgba(229, 9, 20, 0.1)", 
                border: "1px solid rgba(229, 9, 20, 0.3)", 
                borderRadius: 4, 
                padding: "12px 16px", 
                color: "#ff4d4d", 
                fontSize: 14, 
                marginBottom: 24 
              }}>
                ⚠️ {error}
              </div>
            )}

            <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: 20 }}>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
                <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
                  <label htmlFor="creatorName" style={{ fontSize: 12, color: "#aaa", fontWeight: 600 }}>Creator Name *</label>
                  <input
                    type="text"
                    id="creatorName"
                    name="creatorName"
                    value={formData.creatorName}
                    onChange={handleChange}
                    required
                    style={{ 
                      background: "#141414", 
                      border: "1px solid rgba(255, 255, 255, 0.1)", 
                      borderRadius: 4, 
                      padding: 12, 
                      color: "#fff",
                      outline: "none"
                    }}
                  />
                </div>
                <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
                  <label htmlFor="email" style={{ fontSize: 12, color: "#aaa", fontWeight: 600 }}>Email Address *</label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    required
                    style={{ 
                      background: "#141414", 
                      border: "1px solid rgba(255, 255, 255, 0.1)", 
                      borderRadius: 4, 
                      padding: 12, 
                      color: "#fff",
                      outline: "none"
                    }}
                  />
                </div>
              </div>

              <div style={{ display: "grid", gridTemplateColumns: "2fr 1fr", gap: 16 }}>
                <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
                  <label htmlFor="filmTitle" style={{ fontSize: 12, color: "#aaa", fontWeight: 600 }}>Film Title *</label>
                  <input
                    type="text"
                    id="filmTitle"
                    name="filmTitle"
                    value={formData.filmTitle}
                    onChange={handleChange}
                    required
                    style={{ 
                      background: "#141414", 
                      border: "1px solid rgba(255, 255, 255, 0.1)", 
                      borderRadius: 4, 
                      padding: 12, 
                      color: "#fff",
                      outline: "none"
                    }}
                  />
                </div>
                <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
                  <label htmlFor="runtime" style={{ fontSize: 12, color: "#aaa", fontWeight: 600 }}>Runtime (e.g. 2m 15s) *</label>
                  <input
                    type="text"
                    id="runtime"
                    name="runtime"
                    value={formData.runtime}
                    onChange={handleChange}
                    placeholder="e.g. 1m 30s"
                    required
                    style={{ 
                      background: "#141414", 
                      border: "1px solid rgba(255, 255, 255, 0.1)", 
                      borderRadius: 4, 
                      padding: 12, 
                      color: "#fff",
                      outline: "none"
                    }}
                  />
                </div>
              </div>

              <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
                <label htmlFor="filmLink" style={{ fontSize: 12, color: "#aaa", fontWeight: 600 }}>Film Link (YouTube, Vimeo, Google Drive) *</label>
                <input
                  type="url"
                  id="filmLink"
                  name="filmLink"
                  value={formData.filmLink}
                  onChange={handleChange}
                  placeholder="https://"
                  required
                  style={{ 
                    background: "#141414", 
                    border: "1px solid rgba(255, 255, 255, 0.1)", 
                    borderRadius: 4, 
                    padding: 12, 
                    color: "#fff",
                    outline: "none"
                  }}
                />
              </div>

              <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
                <label htmlFor="toolsUsed" style={{ fontSize: 12, color: "#aaa", fontWeight: 600 }}>AI Tools & Models Used (e.g. Midjourney, Sora, Gen-3, Luma) *</label>
                <input
                  type="text"
                  id="toolsUsed"
                  name="toolsUsed"
                  value={formData.toolsUsed}
                  onChange={handleChange}
                  placeholder="e.g. Midjourney, Runway Gen-3, Suno"
                  required
                  style={{ 
                    background: "#141414", 
                    border: "1px solid rgba(255, 255, 255, 0.1)", 
                    borderRadius: 4, 
                    padding: 12, 
                    color: "#fff",
                    outline: "none"
                  }}
                />
              </div>

              <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
                <label htmlFor="synopsis" style={{ fontSize: 12, color: "#aaa", fontWeight: 600 }}>Short Synopsis *</label>
                <textarea
                  id="synopsis"
                  name="synopsis"
                  value={formData.synopsis}
                  onChange={handleChange}
                  rows={4}
                  required
                  style={{ 
                    background: "#141414", 
                    border: "1px solid rgba(255, 255, 255, 0.1)", 
                    borderRadius: 4, 
                    padding: 12, 
                    color: "#fff",
                    outline: "none",
                    resize: "vertical",
                    fontFamily: "inherit"
                  }}
                />
              </div>

              {/* Checkboxes with custom accent-color */}
              <div style={{ display: "flex", flexDirection: "column", gap: 12, marginTop: 8 }}>
                <label htmlFor="ownsRights" style={{ 
                  display: "flex", 
                  alignItems: "flex-start", 
                  gap: 10, 
                  fontSize: 13, 
                  color: "#ccc",
                  cursor: "pointer"
                }}>
                  <input
                    type="checkbox"
                    id="ownsRights"
                    name="ownsRights"
                    checked={formData.ownsRights}
                    onChange={handleChange}
                    style={{ 
                      accentColor: "var(--accent)", 
                      marginTop: 3, 
                      cursor: "pointer"
                    }}
                  />
                  <span>I confirm that I own or control all necessary rights to this film and its materials. *</span>
                </label>

                <label htmlFor="permissionToFeature" style={{ 
                  display: "flex", 
                  alignItems: "flex-start", 
                  gap: 10, 
                  fontSize: 13, 
                  color: "#ccc",
                  cursor: "pointer"
                }}>
                  <input
                    type="checkbox"
                    id="permissionToFeature"
                    name="permissionToFeature"
                    checked={formData.permissionToFeature}
                    onChange={handleChange}
                    style={{ 
                      accentColor: "var(--accent)", 
                      marginTop: 3, 
                      cursor: "pointer"
                    }}
                  />
                  <span>I grant Madtape permission to review and potentially feature this film during the early access launch program.</span>
                </label>
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
                  marginTop: 12,
                  transition: "background 0.2s"
                }}
                onMouseEnter={e => { if(!loading) e.currentTarget.style.background = "#ff1f2f"; }}
                onMouseLeave={e => { if(!loading) e.currentTarget.style.background = "var(--accent)"; }}
              >
                {loading ? "Submitting Film..." : "Submit Your Film"}
              </button>
            </form>
          </div>
        )}

      </div>
      <PlatformFooter />
    </div>
  );
}
