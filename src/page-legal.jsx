import React from 'react';
import { Link, useLocation } from 'react-router-dom';

// Shared Sidebar Layout for Legal Pages
function LegalLayout({ title, children }) {
  const location = useLocation();
  const currentPath = location.pathname;

  const links = [
    { path: "/rules", label: "Content Rules" },
    { path: "/privacy", label: "Privacy Policy" },
    { path: "/terms", label: "Terms of Service" },
    { path: "/cookie-policy", label: "Cookie Policy" },
    { path: "/dmca", label: "DMCA Policy" }
  ];

  return (
    <div style={{ paddingTop: 100, minHeight: "100vh", background: "#0a0a0a", color: "#fff" }}>
      <div style={{ maxWidth: 1100, margin: "0 auto", padding: "40px 24px 80px" }}>
        
        {/* Header Block */}
        <div style={{ marginBottom: 48, borderBottom: "1px solid rgba(255,255,255,0.06)", paddingBottom: 24 }}>
          <div style={{ fontSize: 10, letterSpacing: "0.2em", textTransform: "uppercase", color: "var(--accent)", marginBottom: 12, fontWeight: 700 }}>Compliance & Legal Center</div>
          <h1 style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: 64, lineHeight: 0.9, margin: 0, letterSpacing: "0.01em" }}>{title}</h1>
          <p style={{ color: "#777", fontSize: 13, marginTop: 8, marginBottom: 0 }}>Last updated: May 28, 2026</p>
        </div>

        {/* Content Columns */}
        <div style={{ display: "grid", gridTemplateColumns: "240px 1fr", gap: 60 }}>
          
          {/* Sidebar Nav */}
          <aside style={{ height: "fit-content", position: "sticky", top: 120 }}>
            <div style={{ display: "flex", flexDirection: "column", gap: 4 }}>
              {links.map(l => {
                const active = currentPath === l.path;
                return (
                  <Link
                    key={l.path}
                    to={l.path}
                    style={{
                      padding: "10px 14px",
                      borderRadius: 4,
                      fontSize: 13,
                      fontWeight: active ? 700 : 400,
                      color: active ? "#fff" : "#777",
                      background: active ? "rgba(255,255,255,0.04)" : "transparent",
                      borderLeft: active ? "3px solid var(--accent)" : "3px solid transparent",
                      textDecoration: "none",
                      transition: "all 150ms"
                    }}
                    onMouseEnter={e => {
                      if (!active) {
                        e.currentTarget.style.color = "#fff";
                        e.currentTarget.style.background = "rgba(255,255,255,0.02)";
                      }
                    }}
                    onMouseLeave={e => {
                      if (!active) {
                        e.currentTarget.style.color = "#777";
                        e.currentTarget.style.background = "transparent";
                      }
                    }}
                  >
                    {l.label}
                  </Link>
                );
              })}
            </div>
            
            <div style={{ marginTop: 40, padding: "16px", background: "rgba(255,255,255,0.02)", border: "1px solid rgba(255,255,255,0.06)", borderRadius: 6 }}>
              <div style={{ fontSize: 11, fontWeight: 700, color: "#fff", marginBottom: 6 }}>Need Assistance?</div>
              <p style={{ fontSize: 12, color: "#777", lineHeight: 1.5, margin: 0 }}>
                If you have questions regarding our legal documents, please contact us at <a href="mailto:legal@madtape.com" style={{ color: "var(--accent)", textDecoration: "none" }}>legal@madtape.com</a>.
              </p>
            </div>
          </aside>

          {/* Legal Text */}
          <article className="legal-article" style={{
            fontSize: 14, color: "#b3b3b3", lineHeight: 1.8,
            maxWidth: 720
          }}>
            {children}
          </article>
        </div>

      </div>
    </div>
  );
}

// Styling classes for paragraph blocks to avoid massive styling repetitions
const headingStyle = { color: "#fff", fontSize: 20, fontWeight: 700, marginTop: 32, marginBottom: 12 };
const textStyle = { marginBottom: 18 };
const listStyle = { paddingLeft: 20, marginBottom: 18, display: "flex", flexDirection: "column", gap: 8 };

// ── 1. CONTENT RULES PAGE ───────────────────────────────────────────────────
export function RulesPage() {
  return (
    <LegalLayout title="Content Rules & Guidelines">
      <p style={{ ...textStyle, fontSize: 16, color: "#fff" }}>
        Welcome to Madtape. We are dedicated to nurturing and showcasing the cutting-edge of AI short-form cinema. To ensure a safe, collaborative, and fair ecosystem for creators worldwide, all video submissions must strictly abide by our Content Rules.
      </p>

      <h3 style={headingStyle}>1. AI Composition & Authenticity</h3>
      <p style={textStyle}>
        Madtape is specifically built to champion AI-assisted filmmaking. To qualify for submission:
      </p>
      <ul style={listStyle}>
        <li>Your short film must utilize generative AI engines (text-to-video, image-to-video, style-transfer, or AI-upscaling) in its core creative pipeline.</li>
        <li>Submissions must be cinematic short-form media. Standard challenge submissions must be between 4 and 15 seconds. Feature films are handled independently.</li>
        <li>We encourage prompt transparency. Disclosing the generative tools and base prompts used is required for all active challenges.</li>
      </ul>

      <h3 style={headingStyle}>2. Strict Content Restrictions</h3>
      <p style={textStyle}>
        We maintain a zero-tolerance policy for harmful, illegal, or unethical content. Submissions must not contain:
      </p>
      <ul style={listStyle}>
        <li><b>Non-Consensual Representations (Deepfakes):</b> Creating or sharing realistic synthetic representations of real people (celebrities, public figures, or private citizens) without explicit consent is strictly banned.</li>
        <li><b>Intellectual Property Infringement:</b> The video must not infringe upon active copyrights. Do not upload directly copied movie clips, unaltered copyrighted soundtracks, or trademarks.</li>
        <li><b>Hate Speech & Harassment:</b> Content inciting violence, promoting hate groups, or containing explicit slurs targeted at protected attributes will result in immediate permanent account termination.</li>
        <li><b>Highly Explicit Content:</b> Excessively graphic violence, sexually explicit scenes, or depictions of illegal activities are strictly prohibited.</li>
      </ul>

      <h3 style={headingStyle}>3. Fair Challenge Rules</h3>
      <p style={textStyle}>
        Submitting your work to active Madtape challenges requires complying with specific guidelines:
      </p>
      <ul style={listStyle}>
        <li>You must submit original AI-generated drafts created primarily for the specific challenge themes.</li>
        <li>Disclosing the full generative models (e.g. Seedance, Runway, Kling) and generative text prompts is mandatory to ensure educational value.</li>
        <li>One submission per creator per plan limit is strictly enforced to prevent automated spamming.</li>
      </ul>

      <h3 style={headingStyle}>4. Violations & Policy Enforcement</h3>
      <p style={textStyle}>
        Any film flagrantly violating these policies will be immediately taken down, any earned rankings or contest credits will be voided, and repeat infringers will be permanently banned from accessing creator tools.
      </p>
    </LegalLayout>
  );
}

// ── 2. PRIVACY POLICY PAGE ──────────────────────────────────────────────────
export function PrivacyPage() {
  return (
    <LegalLayout title="Privacy Policy">
      <p style={{ ...textStyle, fontSize: 16, color: "#fff" }}>
        Madtape AI ("we", "us", "our") respects your privacy. This Privacy Policy details our practices concerning the collection, storage, use, and security of your personal data under global privacy laws including the General Data Protection Regulation (GDPR).
      </p>

      <h3 style={headingStyle}>1. Data We Collect</h3>
      <p style={textStyle}>
        We collect only minimal necessary metrics to operate our services:
      </p>
      <ul style={listStyle}>
        <li><b>Account Credentials:</b> Email addresses, display names, location coordinates, location data, location settings, Location details and optional profile photos gathered via Firebase Authentication (Email/Password or Google OAuth).</li>
        <li><b>Film Metadata:</b> Pasteboard text strings, title, models, prompting notes, and embedded YouTube Video URLs submitted when uploading.</li>
        <li><b>Transactional Data:</b> Secure Stripe Checkout tokens. We do <b>not</b> store or process actual cardholder accounts on our own database records; payment records are handled safely by Stripe.</li>
        <li><b>Tracking Cookies:</b> Consent-authorized browser identifiers to track authorization state, necessary variables, and Cloudflare Analytics beacons.</li>
      </ul>

      <h3 style={headingStyle}>2. How We Use Your Data</h3>
      <p style={textStyle}>
        Your data is processed strictly for the following purposes:
      </p>
      <ul style={listStyle}>
        <li>To synchronize and authorize your creator sessions dynamically.</li>
        <li>To manage and showcase your published short films and profile pages.</li>
        <li>To process premium Stripe subscription credits.</li>
        <li>To deliver challenge winnings and moderate in-memory submissions.</li>
      </ul>

      <h3 style={headingStyle}>3. Data Persistence & Deletion</h3>
      <p style={textStyle}>
        Under the GDPR, you have the right to request access to, export, or complete deletion of your personal account records. To request account deletion, please email <a href="mailto:privacy@madtape.com" style={{ color: "var(--accent)", textDecoration: "none" }}>privacy@madtape.com</a>. Upon verification, your email, location, profile credentials, and in-memory film submissions will be completely purged from our active files within 30 days.
      </p>

      <h3 style={headingStyle}>4. Information Security</h3>
      <p style={textStyle}>
        We enforce rigorous security protocols, including HTTPS-only encryptions, JWT authentications, and secure Firestore database sandboxes, to shield your personal records from unauthorized access.
      </p>
    </LegalLayout>
  );
}

// ── 3. TERMS OF SERVICE PAGE ────────────────────────────────────────────────
export function TermsPage() {
  return (
    <LegalLayout title="Terms of Service">
      <p style={{ ...textStyle, fontSize: 16, color: "#fff" }}>
        These Terms of Service ("Terms") outline the legally binding agreement between you ("User", "Creator") and Madtape AI governing your use of our website, video player tools, creator dashboards, and challenge submissions.
      </p>

      <h3 style={headingStyle}>1. Eligibility & Access</h3>
      <p style={textStyle}>
        You must be at least 13 years old to register an account. By creating an account, you affirm that you possess the legal capacity to enter into this agreement. Account registration requires valid emails verified via Firebase Auth or Google OAuth integrations.
      </p>

      <h3 style={headingStyle}>2. Content Rights & Licensing</h3>
      <p style={textStyle}>
        Madtape's unique link-sharing streaming model ensures you retain maximum rights:
      </p>
      <ul style={listStyle}>
        <li><b>Ownership:</b> You retain complete intellectual property ownership of your prompts, creation notes, and underlying video file rights. We do <b>not</b> claim ownership over your creations.</li>
        <li><b>Distribution:</b> Because you stream videos by pasting YouTube URLs, video hosting and streaming bandwidth permissions are governed directly by your agreement with YouTube. You are responsible for ensuring your YouTube settings permit embedding on external websites.</li>
        <li><b>Platform License:</b> By publishing a film on Madtape, you grant us a worldwide, non-exclusive, royalty-free license to showcase your film, prompts, and thumbnail previews on our homepage feed, ranking grids, explore tab, and official newsletters.</li>
      </ul>

      <h3 style={headingStyle}>3. Stripe Billing & Credits</h3>
      <p style={textStyle}>
        Subscriptions to paid plans (Starter, Creator, Pro) are processed securely through Stripe Checkout.
      </p>
      <ul style={listStyle}>
        <li>Credits are allocated monthly based on your subscribed tier. Unused credits carry forward depending on plan settings.</li>
        <li>Subscriptions recur automatically unless cancelled in your billing portal. Cancellations take effect at the end of the billing cycle.</li>
        <li>Refunds for unused credit balances may be requested within 14 days of purchase by emailing billing support.</li>
      </ul>

      <h3 style={headingStyle}>4. Indemnification & Liability</h3>
      <p style={textStyle}>
        You agree to indemnify and hold Madtape harmless against any claims, losses, or legal liabilities arising from your video uploads or violations of third-party copyrights. Madtape is provided "as is" without warranty of uninterrupted service.
      </p>
    </LegalLayout>
  );
}

// ── 4. COOKIE POLICY PAGE ───────────────────────────────────────────────────
export function CookiePolicyPage() {
  return (
    <LegalLayout title="Cookie Policy">
      <p style={{ ...textStyle, fontSize: 16, color: "#fff" }}>
        This Cookie Policy explains what cookies are, how we utilize them, and how you can manage your preferences on our website.
      </p>

      <h3 style={headingStyle}>1. What are Cookies?</h3>
      <p style={textStyle}>
        Cookies are small text documents stored in your browser when you visit websites. They are widely used to maintain authorization states, log interactions, remember settings, and aggregate general usage metrics.
      </p>

      <h3 style={headingStyle}>2. Cookies We Deploy</h3>
      <p style={textStyle}>
        Our platform utilizes the following cookies:
      </p>
      <ul style={listStyle}>
        <li><b>Necessary First-Party Cookies:</b>
          <ul style={{ paddingLeft: 16, marginTop: 4, display: "flex", flexDirection: "column", gap: 4, color: "#888" }}>
            <li>`firebase:authUser:...` – Used by Firebase Authentication to securely remember your login session across reloads.</li>
            <li>`__madtape_user` – Remembers your profile metadata, active plan, and credit balance in local storage.</li>
            <li>`__madtape_cookie_consent` – Stores your cookie banner consent selection (Accept All / Declined).</li>
          </ul>
        </li>
        <li style={{ marginTop: 8 }}><b>Analytical Third-Party Cookies:</b>
          <ul style={{ paddingLeft: 16, marginTop: 4, display: "flex", flexDirection: "column", gap: 4, color: "#888" }}>
            <li>Cloudflare Web Analytics beacons – Aggregates completely anonymous site performance metrics, loading times, and click paths. <i>This is blocked by default until you grant consent in our banner.</i></li>
          </ul>
        </li>
        <li style={{ marginTop: 8 }}><b>Third-Party Integration Cookies:</b>
          <ul style={{ paddingLeft: 16, marginTop: 4, display: "flex", flexDirection: "column", gap: 4, color: "#888" }}>
            <li>Stripe Checkout Cookies – Used by Stripe to authenticate browser transactions and shield against card fraud.</li>
            <li>YouTube Player Cookies – Injected by embedded YouTube players on video pages to save player state settings, bandwidth metrics, and watch logs.</li>
          </ul>
        </li>
      </ul>

      <h3 style={headingStyle}>3. Managing Your Preferences</h3>
      <p style={textStyle}>
        You are in control. By default, all optional analytical beacons are blocked when you first visit the platform. You can update your choice at any time using our floating cookie toggle at the bottom of the page, or by manually purging your browser's site cookies.
      </p>
    </LegalLayout>
  );
}

// ── 5. DMCA POLICY PAGE ─────────────────────────────────────────────────────
export function DMCAPage() {
  return (
    <LegalLayout title="DMCA Copyright Policy">
      <p style={{ ...textStyle, fontSize: 16, color: "#fff" }}>
        Madtape AI respect intellectual property rights. In accordance with the Digital Millennium Copyright Act (DMCA), we have designated a copyright agent to receive and process takedown notices regarding copyrighted works hosted on our platform.
      </p>

      <h3 style={headingStyle}>1. How to File a DMCA Takedown Notice</h3>
      <p style={textStyle}>
        If you are a copyright owner or an authorized agent and believe that content hosted on Madtape infringes upon your copyright, you may submit a formal notification by emailing our designated copyright agent at:
      </p>
      <p style={{ ...textStyle, background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.08)", padding: 14, borderRadius: 4, fontFamily: "monospace", color: "#fff", display: "inline-block" }}>
        <b>Email:</b> copyright@madtape.com<br />
        <b>Attn:</b> Copyright Designated Agent (DMCA Team)
      </p>
      <p style={textStyle}>
        Your notification must include the following details:
      </p>
      <ul style={listStyle}>
        <li>A physical or electronic signature of the copyright owner or person authorized to act on their behalf.</li>
        <li>Specific identification of the copyrighted work claimed to have been infringed (e.g. copyright registration numbers or link to original work).</li>
        <li>Specific identification of the infringing material on Madtape that you request to be removed, including links (`https://madtape.com/video/example`) to ensure we can locate it.</li>
        <li>Your contact details: physical address, phone number, and email.</li>
        <li>A statement that you have a "good faith belief that use of the material in the manner complained of is not authorized by the copyright owner, its agent, or the law."</li>
        <li>A statement that "the information in the notification is accurate, and under penalty of perjury, that the complaining party is authorized to act on behalf of the owner."</li>
      </ul>

      <h3 style={headingStyle}>2. Standard Counter-Notification Procedure</h3>
      <p style={textStyle}>
        If your uploaded short film was taken down due to a copyright notice and you believe this was done in error (e.g., you possess the legal license, fair-use rights, or the work is public domain), you may submit a Counter-Notification containing:
      </p>
      <ul style={listStyle}>
        <li>Your physical or electronic signature.</li>
        <li>Identification of the material that was removed and the URL location prior to removal.</li>
        <li>A statement under penalty of perjury that you have a "good faith belief that the material was removed or disabled as a result of mistake or misidentification."</li>
        <li>Your name, address, telephone number, and email.</li>
        <li>A statement consenting to the jurisdiction of the Federal District Court for the judicial district in which your address is located (or California if located outside the US).</li>
      </ul>

      <h3 style={headingStyle}>3. Repeat Infringers Account Termination</h3>
      <p style={textStyle}>
        In compliance with federal guidelines, we enforce a strict repeat-infringer policy. Creator accounts receiving two or more valid copyright takedown notices will be subject to permanent termination, banning them from publishing work or utilizing generation credits.
      </p>
    </LegalLayout>
  );
}

// Global register mappings to verify compilation
window.RulesPage = RulesPage;
window.PrivacyPage = PrivacyPage;
window.TermsPage = TermsPage;
window.CookiePolicyPage = CookiePolicyPage;
window.DMCAPage = DMCAPage;
