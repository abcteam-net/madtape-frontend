---

# Madtape.com — Full Developer Audit Report

**Date:** 28 May 2026  
**Site:** https://madtape.com  
**Hosting:** GitHub Pages (via Cloudflare CDN)  
**Stack:** Static GitHub Pages site, React 18 loaded via unpkg CDN, JSX compiled at runtime in-browser by Babel Standalone, single-page app with client-side routing only  

---

## 1. Executive Summary

Madtape.com is a well-conceived AI short-film streaming platform that is currently running as a **pre-production prototype presented as a live product**. The core React application loads and renders correctly via a single `index.html`, but the entire site is architecturally unfinished: every navigation destination, every footer link, and every sub-page URL resolves to a GitHub Pages 404. There are no real routes, no real backend, no payment processing, no actual video upload pipeline, no legal pages, no sitemap, no `<meta>` description, no canonical tags, no schema markup, no cookie consent, no password or OAuth-based sign-in, and no favicon. The search bar accepts text but does not filter or return results. The sign-in form is email-only with no observable server connection. The entire codebase is served as uncompiled JSX transpiled live in the browser using `@babel/standalone` and React development builds from `unpkg.com` — a configuration completely unsuitable for production. Statistics displayed on the homepage (16K films, 3.2K creators, 48+ countries) appear to be static/hardcoded placeholder values. The platform must not be presented as a live service until the issues below are resolved.

---

## 2. Critical Issues

**C1 — Every sub-page URL is a hard 404 (GitHub Pages)**  
Direct navigation to `/privacy`, `/terms`, `/pricing`, `/explore`, `/challenges`, `/leaderboard`, `/generate`, `/creators`, `/upload`, `/signin`, `/about`, `/contact`, `/content-rules`, `/sitemap.xml` all return a raw GitHub Pages 404 page. There is no `404.html` SPA redirect trick in place. Sharing any internal link, clicking Back in the browser, or bookmarking any view is broken. The URL never changes when navigating between sections — the entire app lives at `https://madtape.com/` only.

**C2 — Site served using React development builds and live JSX transpilation**  
`react.development.js`, `react-dom.development.js`, and `@babel/standalone` are loaded from `unpkg.com` CDN. The app's 15 `.jsx` files are fetched raw and compiled in the browser on every page load. This causes: significant CPU overhead for users, bloated build (~850KB of uncompiled React dev libraries), no tree-shaking, no code splitting, potential total failure if unpkg is unavailable, and exposes source code logic. This is a development-only setup and must be replaced with a bundled production build.

**C3 — No payment processing infrastructure**  
The Pricing page shows four paid plans (€9/mo, €29/mo, €79/mo, Custom) with CTAs ("Start Creating", "Become a Creator", "Go Pro", "Contact Us"). All paid plan buttons navigate to a "Sign In to Upload" blank screen. There is no Stripe, Paddle, LemonSqueezy, or any other payment processor loaded. No checkout flow exists. Subscriptions cannot be purchased.

**C4 — Auth form is non-functional**  
Sign-in modal collects email + optional display name but no password, no OAuth button (Google, GitHub), no magic link confirmation, no loading state, no error feedback, no success message. Submitting the form closes the modal silently. No network request is made. The authentication system has no backend integration.

**C5 — No video playback for user-uploaded AI films**  
Films in the Explore, Creator Profile, and Film Detail views show thumbnail images only. There are zero `<video>`, `<iframe>`, or `<embed>` elements in the DOM when a film detail page is open. Films do not play. The Trailers section embeds YouTube via iframe correctly, but that section is not user-uploaded content.

**C6 — robots.txt contains no crawl directives**  
The current `robots.txt` contains only copyright signal comments and no `User-agent` or `Disallow`/`Allow` directives. There is no `Sitemap:` reference. Search engines receive no guidance.

---

## 3. Missing Pages

All of the following referenced or expected pages return a GitHub Pages 404 when visited directly:

| Page | Referenced From | Status |
|---|---|---|
| `/privacy` | Footer "Privacy" link | 404 |
| `/terms` | Footer "Terms" link | 404 |
| `/content-rules` | Footer "Content Rules" link + nav | 404 |
| `/about` | Footer "About" link | 404 |
| `/contact` | Footer "Contact" link | 404 |
| `/pricing` | Nav "Pricing" + footer | 404 (direct URL only) |
| `/explore` | Nav "Explore" + footer | 404 (direct URL only) |
| `/challenges` | Nav "Challenges" + footer | 404 (direct URL only) |
| `/leaderboard` | Nav "Leaderboard" + footer | 404 (direct URL only) |
| `/generate` | Nav "Generate" + footer | 404 (direct URL only) |
| `/creators` | Nav "Creators" + footer | 404 (direct URL only) |
| `/upload` | CTAs throughout | 404 (direct URL only) |
| `/signin` | Sign In button | 404 (direct URL only) |
| `/trailers` | Nav "Trailers" | 404 (direct URL only) |
| `/sitemap.xml` | Expected by crawlers | 404 |
| Cookie Policy | None | Entirely missing |
| DMCA / Copyright Policy | None | Entirely missing |
| Refund Policy | None | Entirely missing |
| AI-Generated Content Policy | Mentioned in "Content Rules" | Empty/404 |
| FAQ / Help | None | Entirely missing |
| Student Programme page | Homepage "Submit your student film →" links to `#` | Missing |
| 404 custom error page | Any broken URL | Returns raw GitHub 404 |

---

## 4. Missing Platform Functions

**Auth system:** No password field, no OAuth (Google/GitHub/Apple), no magic link confirmation, no session persistence, no sign-out flow, no account management.

**Video upload pipeline:** Upload button triggers sign-in modal; there is no file picker, no upload form, no drag-and-drop, no progress bar, no format validation, no file size limit display, no moderation queue UI for submitters.

**Video playback:** No `<video>` element, no streaming infrastructure, no CDN video delivery. Film thumbnails are images only. There is no actual playback for the platform's user-generated content.

**Search:** Search input exists in the navbar and accepts text but does not filter results, does not navigate, produces no dropdown or results page, and fires no network requests.

**Tipping ("💛 Tip"):** A Tip button is shown on every film card but clicking it has no observable function. No payment, no modal, no credits deduction system exists.

**Save ("+ Save"):** Save button on film detail view does nothing when clicked (no auth, no backend).

**Follow:** "+ Follow" button on Creator Profile does nothing when clicked (no auth, no backend).

**Share:** Share button exists on film detail but no share dialog, web share API, or copy-to-clipboard functionality is implemented.

**Challenge entry submission:** "Enter →" buttons on the Challenges page have no destination. "Submit Your Entry →" on the homepage has no destination.

**Leaderboard:** Displays static data. No live sorting, no pagination, no time-period switching (the tabs "Weekly/Monthly" exist in the DOM but toggle between hardcoded datasets — there is no API).

**Moderation queue:** Referenced in "How it works" (Step 02) but no creator-facing submission status or queue UI exists.

**Revenue share:** Listed as a feature on the Creator and Pro plans but no explanation, no dashboard, no payout mechanism, no minimum threshold, no tax documentation.

**Credit system:** Credits are described and shown in the Generate page UI, but no actual credit purchase, credit balance display, or deduction integration exists.

**Prompt disclosure archive:** Listed as a platform feature on the homepage but no page, section, or data structure for it exists.

**Badge system:** Badges appear on creator profiles (Challenge Winner, Staff Pick, etc.) but no logic for earning, displaying, or verifying badges is described or accessible.

---

## 5. Broken or Incomplete Flows

**Sign In / Register flow:**
- No password field — unclear if this is intentional (magic link) but no confirmation step, no email sent, no feedback given
- Email field has `type="text"` not `type="email"` — no native browser email validation
- No autocomplete attributes (`autocomplete="email"`)
- Modal has no `role="dialog"`, no `aria-modal`, no `aria-labelledby`, no `aria-describedby`
- ESC key does not close the modal (no keydown listener on Escape)
- Focus does not move into the modal when it opens (keyboard trap missing)
- Submitting the form closes it silently — no success confirmation, no error state

**Upload Your Film flow:**
- All Upload CTAs (nav button, homepage hero CTAs, footer link) trigger sign-in modal only
- After the modal closes, no upload interface is shown
- The flow terminates at an empty black screen titled "Sign In to Upload"

**Pricing → Checkout flow:**
- "Get Started Free" → sign-in modal → black screen
- "Start Creating", "Become a Creator", "Go Pro" → all go to "Sign In to Upload" blank screen
- No Stripe checkout session initiated
- No plan selection stored
- No upgrade path post sign-in

**Challenge Submission flow:**
- "Submit Your Entry →" / "Enter →" buttons have no target
- No entry form, no file picker, no challenge rules acknowledgement
- No confirmation of eligibility criteria

**Search flow:**
- Input is rendered and accepts characters
- No submit action (Enter, button) triggers any result
- No results dropdown or results page exists
- No loading state

**Footer links:** All 17 footer links use `href="#"` — none navigate anywhere.

---

## 6. Content Gaps

**Revenue share terms are completely undefined:** The platform promises "Revenue share on featured films" (Creator plan) and "Revenue share on all published films" (Pro plan) with zero explanation of percentages, calculation method, payment frequency, or minimum thresholds. This is a commercial promise with no supporting detail.

**Moderation process is vague:** "Submit for moderation review" is mentioned but there are no stated SLAs, rejection criteria, appeal process, or turnaround time.

**AI model count "4 AI models":** The stat is listed on the homepage but only Seedance, Kling, Veo, Runway, and Pika appear in the data — that is 5. The count appears outdated or incorrect.

**"Features 1h 45m minimum":** The upload instruction references feature-length film uploads, but the entire platform is branded as "short-form AI cinema" with 4–15 second shorts. Feature-length upload rules are unexplained and appear contradictory to the product.

**Student spotlight programme:** Mentioned prominently but has no dedicated page, no application form, no selection criteria, no past examples of spotlighted students.

**Creator badge criteria:** Badges (Challenge Winner, Staff Pick, Early Creator, Storyteller, Seedance Creator) are shown but no page or documentation explains how they are earned or what they mean.

**About page:** Linked in the footer but returns a 404. Company name, founding team, mission, physical location, and registered entity are entirely absent from the site.

**Contact:** Linked in footer but returns 404. No email address, support form, or response time commitment is published anywhere on the site.

**Stats appear hardcoded:** "16K+ Films Uploaded", "3.2K Emerging Creators", "48+ Countries", "4 AI Models" are static strings in the JSX source, not fetched from an API. They will go stale immediately and undermine credibility.

---

## 7. Legal / Compliance Gaps

**GDPR / Privacy:**
- No Privacy Policy page (link in footer returns 404)
- No cookie consent banner or consent management platform
- Cloudflare Analytics (`beacon.min.js`) is loaded and firing analytics without consent
- No data processing information for EU users
- Email collection in sign-in form with no privacy notice at point of collection
- No Data Protection Officer contact

**Terms of Service:**
- Footer "Terms" link returns 404
- No terms exist anywhere on the site

**Cookie Policy:**
- No cookie policy page
- No cookie banner
- No opt-out mechanism

**DMCA / Copyright:**
- No DMCA takedown policy
- No designated DMCA agent or contact
- Platform hosts and distributes user-submitted film content — DMCA safe harbor requires a registered agent and published takedown procedure (17 U.S.C. § 512)

**AI Content Rules:**
- "Content Rules" link in footer and nav returns 404
- Platform is centred on AI-generated content; the EU AI Act, emerging platform liability frameworks, and user trust all require clear published rules on prohibited AI content (deepfakes, non-consensual likeness, minors, etc.)

**Refund Policy:**
- No refund or cancellation policy
- EU Consumer Rights Directive mandates a 14-day cooling-off period for digital subscriptions sold to EU consumers
- Platform uses Euro pricing, suggesting EU user base

**Payment/VAT Compliance:**
- No VAT registration or invoicing shown
- No EU VAT ID
- Subscription prices shown without VAT clarity (gross or net?)

**Age verification:**
- No minimum age stated
- COPPA (US) and similar laws require age-gating for platforms collecting data from minors

**robots.txt AI scraping notices only:**
- The current `robots.txt` has legally-styled AI content signals but no actual crawl directives. This is not a valid `robots.txt` from a technical standpoint — no search bot will respect it.

---

## 8. SEO Gaps

| Element | Status |
|---|---|
| `<title>` tag | Present and well-written |
| `<meta name="description">` | **Missing** |
| Open Graph tags (`og:title`, `og:description`, `og:image`, `og:url`) | **All missing** |
| Twitter Card tags | **All missing** |
| Canonical `<link rel="canonical">` | **Missing** |
| `sitemap.xml` | **404 — missing** |
| `robots.txt` (valid with directives) | **Missing directives** |
| Structured data / JSON-LD | **None** |
| `hreflang` | **Missing** |
| Favicon | **Missing** |
| `<html lang="en">` | Present ✓ |
| `<h1>` tag | Present (one per page ✓) |
| `<h2>` tags | Present ✓ |
| `<main>` landmark element | **Missing** — all content is in `<div>` elements |
| Page title updates on navigation | **No** — title stays "Madtape AI — The Home of Short-Form AI Cinema" regardless of current view |
| Individual film pages indexable | **No** — no unique URLs, all views live at `/` |
| Creator profile pages indexable | **No** — no unique URLs |
| Direct URL access to sub-pages | **All 404** |
| Internal links with real `href` values | **None** — all footer links are `href="#"`, all nav items are `<button>` elements |
| Preload / resource hints | **Missing** |
| Image `alt` text | Present on visible images ✓ |

The entire site is a JavaScript-rendered SPA with no server-side rendering, no unique URLs for any content, no sitemap, no meta description, and no structured data. Search engines can only index the homepage and will see a minimal page with a single H1. All film, creator, and challenge content is invisible to crawlers.

---

## 9. Technical / Backend Gaps

**Architecture — production-readiness:**
- React development builds from `unpkg.com` CDN (must be replaced with production builds from a proper build pipeline — Vite, webpack, or Create React App)
- `@babel/standalone` transpiling 15 `.jsx` source files live in the browser on every page load (~500ms JS execution overhead before any rendering)
- No build step, no bundling, no minification, no tree-shaking, no code splitting
- All source code (JSX) is publicly readable — application logic, data structures, and content are fully exposed
- No SPA routing solution (React Router, etc.) — navigation uses in-memory state only; back button, deep links, and shared URLs all break

**GitHub Pages limitations:**
- GitHub Pages does not support server-side redirects, API routes, or dynamic routing
- A `404.html` redirect hack is not implemented (would enable SPA routing as a workaround)
- For a production platform with auth, payments, and video hosting, GitHub Pages is not a suitable host

**Missing security headers:**
- No `Content-Security-Policy`
- No `X-Frame-Options`
- No `X-Content-Type-Options`
- No `Strict-Transport-Security` (HSTS)
- No `Referrer-Policy`
- No `Permissions-Policy`
(Cloudflare is in use — these can be set via Cloudflare Workers or Transform Rules)

**No API / backend:**
- No authentication service (Firebase Auth, Supabase, Auth0, custom JWT, etc.)
- No database
- No video upload/storage backend (S3, Cloudflare R2, Bunny.net, etc.)
- No video transcoding pipeline
- No payment backend
- No email service (transactional emails, magic links, notifications)

**No error handling:**
- No custom 404 page
- No error boundary in the React application
- No loading/skeleton states for async operations
- Sign-in form has no validation, no error display, no loading state

**Analytics:**
- Cloudflare Web Analytics beacon is loaded ✓ (but fires without cookie consent)
- No Google Analytics / GA4
- No event tracking (CTA clicks, sign-in attempts, video plays, challenge submissions)

**Accessibility blockers:**
- No `<main>` element (WCAG 2.1 landmark requirement)
- No skip navigation link
- Zero `aria-label` attributes
- Zero `role` attributes
- Modal dialog missing `role="dialog"`, `aria-modal`, `aria-labelledby` — not accessible to screen readers
- Focus does not move to modal on open
- Escape key does not close modal
- All navigation items are `<button>` elements, not `<a>` tags — browser history, keyboard navigation, and "open in new tab" all broken
- No `<nav>` landmark wrapping the navigation
- No `autocomplete` attributes on form inputs
- Email field uses `type="text"` instead of `type="email"`

**Performance:**
- No `<link rel="preload">` for critical resources
- No font-display swap strategy
- Babel transpilation adds ~500ms JavaScript execution on cold load
- No lazy loading strategy for page components

**Mobile:**
- Viewport meta tag is correct ✓
- No mobile-specific testing was observed to fail catastrophically — the SPA renders responsively
- However, no touch-specific interaction testing was possible

---

## 10. Prioritized Action List

### Critical (Block launch)
1. Replace React dev builds + Babel Standalone with a production Vite/webpack build
2. Implement a real backend (Supabase, Firebase, or custom) with auth, database, storage
3. Implement SPA routing (React Router) with GitHub Pages `404.html` redirect or migrate to Vercel/Netlify/Cloudflare Pages
4. Connect a payment processor (Stripe) to the pricing CTA buttons
5. Build real authentication (magic link or OAuth)
6. Build real video upload + playback pipeline
7. Publish Privacy Policy, Terms of Service, Cookie Policy, DMCA Policy
8. Add cookie consent banner and block analytics until consent is given
9. Fix `robots.txt` to include proper `User-agent` / `Disallow` / `Sitemap` directives

### High (Required before public traffic)
10. Add `<meta name="description">` to the homepage
11. Add Open Graph + Twitter Card tags
12. Add `<link rel="canonical">`
13. Create and publish `sitemap.xml`
14. Enable unique, shareable URLs for every view (films, creators, challenges)
15. Implement page title updates on route changes
16. Fix all footer links from `href="#"` to real URLs
17. Change nav items from `<button>` to `<a>` elements with real hrefs
18. Make search functional (filter/search API)
19. Build About, Contact, Content Rules pages
20. Add favicon and PWA manifest
21. Implement Tip, Save, Follow, Share functions
22. Add `Content-Security-Policy` and other security headers via Cloudflare

### Medium (Required soon after launch)
23. Add JSON-LD schema (WebSite, VideoObject, Organization, BreadcrumbList)
24. Add `<main>`, `<nav>`, `<footer>` ARIA landmarks
25. Fix modal accessibility (role, aria-modal, focus trap, Escape key)
26. Fix email input `type="text"` → `type="email"`
27. Add `autocomplete` attributes to auth inputs
28. Add skip navigation link
29. Add loading/skeleton states for async content
30. Replace hardcoded stats with live API values
31. Add error boundary and user-facing error states
32. Build student programme page
33. Add custom 404 page

### Low (Pre-growth)
34. Add `hreflang` if multi-language support is planned
35. Add `<link rel="preload">` for critical JS/CSS
36. Add event tracking (analytics) for all key interactions
37. Implement lazy loading for page components
38. Document badge earning criteria
39. Document revenue share percentages and payout process
40. Add FAQ / Help Centre
41. Add age verification / minimum age statement

---

## 11. Developer Tickets

---

**TICKET-001**  
**Issue:** React development builds loaded from unpkg.com CDN; JSX compiled in browser at runtime  
**Location:** `index.html` — `<script>` tags loading `react.development.js`, `react-dom.development.js`, `@babel/standalone`, and 15 `.jsx` files  
**Expected Fix:** Create a production build pipeline using Vite or webpack. Bundle, minify, tree-shake, and hash all JS assets. Use `react.production.min.js`. Pre-compile all JSX. Remove `@babel/standalone` entirely.  
**Priority:** Critical  
**Acceptance Criteria:** `window.React.__SECRET_INTERNALS_DO_NOT_USE_OR_YOU_WILL_BE_FIRED` does not exist on production. No `.jsx` files served to the browser. Lighthouse Performance score ≥ 85.

---

**TICKET-002**  
**Issue:** All sub-pages return GitHub Pages 404 when accessed directly  
**Location:** GitHub Pages hosting, `index.html`, no router configured  
**Expected Fix:** Either (a) add a `404.html` in the repo root that redirects to `/?/path` and parse in `index.html`, or preferably (b) migrate to Vercel/Netlify/Cloudflare Pages and implement React Router with `BrowserRouter`. Every section must have a unique, shareable URL (`/explore`, `/challenges`, `/pricing`, `/creators`, `/film/:id`, `/creator/:username`).  
**Priority:** Critical  
**Acceptance Criteria:** Navigating directly to `https://madtape.com/explore` loads the Explore view. Pressing Back in browser navigates correctly. Sharing a film link opens that film.

---

**TICKET-003**  
**Issue:** No authentication backend — sign-in form does nothing  
**Location:** Sign-in modal (`page-home.jsx`), all authenticated actions  
**Expected Fix:** Integrate an auth provider (Supabase Auth, Firebase Auth, or Auth0). Implement: email magic link OR email+password. Add `type="email"` to email input. Add `autocomplete="email"`. Show loading state on submit. Show success (check your email) or error states. Persist session in localStorage/cookie.  
**Priority:** Critical  
**Acceptance Criteria:** User submits email → receives magic link or confirmation. Session persists across page reload. Authenticated state shown in nav (avatar/username replacing "Sign In").

---

**TICKET-004**  
**Issue:** No payment processing — all paid plan CTAs navigate to "Sign In to Upload" blank screen  
**Location:** Pricing page — "Start Creating", "Become a Creator", "Go Pro" buttons  
**Expected Fix:** Integrate Stripe (or Paddle). On CTA click: (1) if not signed in → sign-in modal → post-auth redirect to checkout; (2) if signed in → Stripe Checkout Session for the selected plan. Webhook handler for `checkout.session.completed` to assign plan to user account.  
**Priority:** Critical  
**Acceptance Criteria:** Clicking "Become a Creator" opens a Stripe checkout for the €29/mo Creator plan. Successful payment updates user's plan. Failed payment shows error message.

---

**TICKET-005**  
**Issue:** Privacy Policy, Terms of Service, Cookie Policy, DMCA Policy pages return 404  
**Location:** Footer links (`/privacy`, `/terms`); `/content-rules`, `/dmca` missing entirely  
**Expected Fix:** Create real, legally compliant pages at these routes. At minimum: Privacy Policy (GDPR-compliant, covers email collection, analytics, user content), Terms of Service (platform rules, content ownership, liability), Cookie Policy (lists all cookies including Cloudflare Analytics), DMCA Policy (designated agent, takedown procedure). Add Cookie Consent banner blocking analytics scripts until consent is granted.  
**Priority:** Critical  
**Acceptance Criteria:** All four legal pages accessible at their URLs. Cookie banner appears on first visit for EU users. Analytics script is not loaded until consent is given.

---

**TICKET-006**  
**Issue:** `robots.txt` has no crawl directives or `Sitemap` reference  
**Location:** `https://madtape.com/robots.txt`  
**Expected Fix:** Replace contents with:
```
User-agent: *
Allow: /
Sitemap: https://madtape.com/sitemap.xml
```
Add the existing AI-content signal comments after the standard directives.  
**Priority:** Critical  
**Acceptance Criteria:** `robots.txt` passes Google Search Console validation. Sitemap URL is referenced.

---

**TICKET-007**  
**Issue:** `sitemap.xml` returns 404  
**Location:** `https://madtape.com/sitemap.xml`  
**Expected Fix:** Generate and serve a valid XML sitemap including all static and dynamic page URLs (homepage, explore, challenges, leaderboard, generate, creators, pricing, about, contact, privacy, terms, content-rules, individual film pages, creator profile pages).  
**Priority:** High  
**Acceptance Criteria:** `https://madtape.com/sitemap.xml` returns valid XML. Submitted to Google Search Console without errors.

---

**TICKET-008**  
**Issue:** Missing `<meta name="description">`, Open Graph tags, Twitter Card tags, canonical tag  
**Location:** `<head>` section of `index.html`  
**Expected Fix:** Add the following to `<head>`:
- `<meta name="description" content="...">`
- `<meta property="og:title">`, `og:description`, `og:image`, `og:url`, `og:type`
- `<meta name="twitter:card">`, `twitter:title`, `twitter:description`, `twitter:image`
- `<link rel="canonical" href="https://madtape.com/">`
- For SPA pages: update all meta tags dynamically on route change using React Helmet or equivalent
**Priority:** High  
**Acceptance Criteria:** Homepage passes Open Graph validator. Each unique route updates `<title>`, `<meta name="description">`, and `<link rel="canonical">` dynamically.

---

**TICKET-009**  
**Issue:** No video playback for user-uploaded AI films  
**Location:** Film detail view (`page-profile-video.jsx`), Explore page film cards  
**Expected Fix:** Implement video hosting and delivery. Options: Cloudflare Stream, Mux, Bunny.net, or direct S3/R2 with HLS. Render a `<video>` element with controls, poster image, `playsinline`, `preload="metadata"`. Handle buffering, errors, and autoplay policies.  
**Priority:** Critical  
**Acceptance Criteria:** Clicking a film card opens the film detail page and plays the video. Video loads within 3 seconds on a standard connection.

---

**TICKET-010**  
**Issue:** All footer links use `href="#"` — none navigate to real destinations  
**Location:** `<footer>` / `contentinfo` region — 17 links  
**Expected Fix:** Replace all `href="#"` with real absolute or relative paths. For links to pages not yet built, add an in-progress placeholder page rather than `#`.  
**Priority:** High  
**Acceptance Criteria:** Every footer link navigates to its stated destination without a 404.

---

**TICKET-011**  
**Issue:** Navigation items are `<button>` elements, not `<a>` links  
**Location:** `platform-nav.jsx` — Explore, Trailers, AI Cinema, Challenges, Leaderboard, Generate, Creators, Pricing buttons  
**Expected Fix:** Replace all nav `<button>` elements with `<a href="/path">` elements (or `<Link>` from React Router). This enables: right-click → open in new tab, keyboard navigation, browser history, correct ARIA semantics, and crawler link discovery.  
**Priority:** High  
**Acceptance Criteria:** All nav items render as `<a>` elements with real hrefs in the DOM. Right-clicking any nav item offers "Open in new tab".

---

**TICKET-012**  
**Issue:** Sign-in modal is not accessible  
**Location:** Sign-in modal overlay  
**Expected Fix:** Add `role="dialog"` and `aria-modal="true"` to the modal container. Add `aria-labelledby` pointing to the "Sign In" heading. Move focus into the modal on open (focus first input). Trap focus within modal while open. Close on Escape keydown. Restore focus to the trigger element on close. Add `aria-live="polite"` region for error/success messages.  
**Priority:** Medium  
**Acceptance Criteria:** Screen reader announces modal title on open. Tab key cycles only within modal. Escape key closes modal. Focus returns to trigger button.

---

**TICKET-013**  
**Issue:** Search input does not function  
**Location:** Nav search bar — `<input placeholder="Search films, creators…">`  
**Expected Fix:** Implement search: on input change (debounced 300ms) query a search API or filter in-memory data. Show a dropdown of results (films and creators). On Enter or result click, navigate to a `/search?q=` results page. Add a clear button. Show "no results" state.  
**Priority:** High  
**Acceptance Criteria:** Typing in the search bar shows filtered results within 500ms. Clicking a result navigates to the relevant film or creator page.

---

**TICKET-014**  
**Issue:** No favicon  
**Location:** `<head>` — no `<link rel="icon">` present  
**Expected Fix:** Add `favicon.ico` in the site root and `<link rel="icon" href="/favicon.ico">` in `<head>`. Also add Apple Touch Icon and web manifest for PWA compatibility.  
**Priority:** High  
**Acceptance Criteria:** Browser tab shows the Madtape logo as favicon. No favicon 404 in network requests.

---

**TICKET-015**  
**Issue:** Security headers missing  
**Location:** HTTP response headers from GitHub Pages / Cloudflare  
**Expected Fix:** Configure the following via Cloudflare Transform Rules or Workers:
- `Content-Security-Policy: default-src 'self'; script-src 'self' static.cloudflareinsights.com; frame-src youtube.com www.youtube.com; ...`
- `X-Frame-Options: SAMEORIGIN`
- `X-Content-Type-Options: nosniff`
- `Referrer-Policy: strict-origin-when-cross-origin`
- `Permissions-Policy: geolocation=(), microphone=(), camera=()`
**Priority:** Medium  
**Acceptance Criteria:** Mozilla Observatory score ≥ B. CSP header blocks unauthorized script execution.

---

**TICKET-016**  
**Issue:** Page `<title>` does not update on navigation, no ARIA landmarks  
**Location:** `platform-app.jsx`, `index.html`  
**Expected Fix:** (1) Use React Helmet / `document.title` updates on each route render. (2) Wrap nav in `<nav aria-label="Main navigation">`. (3) Wrap main content in `<main id="main-content">`. (4) Add `<a href="#main-content" class="skip-link">Skip to content</a>` as first element in `<body>`.  
**Priority:** Medium  
**Acceptance Criteria:** `document.title` changes to match the current page/view. Screen reader announces page changes. Skip link is reachable by Tab key.

---

**TICKET-017**  
**Issue:** JSON-LD structured data entirely absent  
**Location:** `<head>` / page templates  
**Expected Fix:** Add `application/ld+json` scripts:
- Homepage: `WebSite` schema with `SearchAction`
- Organization: company details
- Film pages: `VideoObject` schema (name, description, thumbnailUrl, uploadDate, duration, contentUrl)
- Creator profiles: `Person` schema
- Pricing: `PriceSpecification`
**Priority:** Medium  
**Acceptance Criteria:** Schema.org validator returns no errors for homepage and film page schemas. Rich results test shows eligible rich result types.

---

**TICKET-018**  
**Issue:** Email input uses `type="text"` instead of `type="email"`; no autocomplete attributes  
**Location:** Sign-in modal email input  
**Expected Fix:** Change `type="text"` to `type="email"`. Add `autocomplete="email"` to email input. Add `autocomplete="username"` to display name input.  
**Priority:** Medium  
**Acceptance Criteria:** Browser shows email keyboard on mobile. Browser offers to autofill email. Invalid email format shows native browser validation error.

---

**TICKET-019**  
**Issue:** Hardcoded platform statistics (16K+ films, 3.2K creators, etc.)  
**Location:** Homepage hero statistics section  
**Expected Fix:** Replace static strings with values fetched from an API endpoint (e.g. `/api/stats`). Cache with a 1-hour TTL. Show skeleton loaders while fetching.  
**Priority:** Medium  
**Acceptance Criteria:** Stat values are fetched from an API on page load. Values update without a code deployment when real data changes.

---

**TICKET-020**  
**Issue:** About, Contact, Content Rules pages missing  
**Location:** Footer links, referenced throughout site  
**Expected Fix:** Build `/about` (company info, team, mission), `/contact` (form or email address, response time), `/content-rules` (prohibited content, AI-specific rules, enforcement process). All must be real pages with content, not empty shells.  
**Priority:** High  
**Acceptance Criteria:** All three pages return 200 with substantive content. Pages are included in `sitemap.xml`. Footer links navigate correctly.