# Madtape User-Ready Fix Plan

## Brutal Truth

Madtape is not user-ready yet. The audit shows launch-blocking failures: direct URLs break, the core video player has no actual video source, legal pages are inaccessible, footer/CTA links are dead, and several live-looking numbers/content blocks are placeholders.

Treat this as a **pre-launch repair sprint**, not polish work.

---

## Goal

Make Madtape safe, usable, and launch-ready without changing the existing UI/UX design direction.

Fix:

- Routing
- Playback
- Legal access
- Broken links
- Placeholder content
- Metadata
- Core user actions
- Backend/data connections
- Broken assets

---

## Non-Negotiable Rule

Do **not** redesign the UI.

Only fix:

- Functionality
- Routing
- Content wiring
- Metadata
- Legal pages
- Backend/data connections
- Broken assets

---

# Phase 1 — Launch Blockers

## 1. Fix SPA Direct-Route 404 Problem

### Problem

All direct URLs return GitHub Pages 404.

### Preferred Action

Deploy to a host that supports SPA rewrites, such as:

- Vercel
- Netlify
- Cloudflare Pages

For Vercel, add:

```json
{
  "rewrites": [
    {
      "source": "/(.*)",
      "destination": "/index.html"
    }
  ]
}
```

### Fallback Action if Staying on GitHub Pages

- Add `404.html`.
- Redirect unknown paths back into the React app.
- Preserve the original route.

### Acceptance Test

Open these directly in a new browser tab:

```txt
/explore
/challenges
/leaderboard
/creators
/pricing
/rules
/privacy
/terms
/cookie-policy
/dmca
/video/glass-hour
/video/last-train-eden
/profile/kira-motion
/trailers
/real-films
/generate
/upload
/search
```

Every route must load the correct page.

No GitHub Pages 404 should appear.

---

## 2. Fix Video Playback

### Problem

The video player UI exists, but no real video loads.

### Action

Create or update the film data model:

```ts
type Film = {
  slug: string;
  title: string;
  description: string;
  thumbnailUrl: string;
  videoUrl: string;
  duration: string;
  creatorId: string;
  uploadDate: string;
};
```

Then:

- Upload real videos to CDN/storage.
- Use Cloudflare R2, AWS S3 + CloudFront, Firebase Storage, or similar.
- Add `videoUrl` to every film.
- Bind the video player source to `film.videoUrl`.
- Add loading, error, and missing-video states.
- If videos are large, support HLS.

### Acceptance Test

- Clicking play starts playback.
- Progress bar reflects real duration.
- No black empty screen.
- If video is missing, show a clear error: `Video unavailable`.

---

## 3. Build Legal Pages

### Problem

The following routes are missing or inaccessible:

```txt
/privacy
/terms
/rules
/cookie-policy
/dmca
```

### Action

Create these routes and add real readable legal text.

Minimum content:

### Privacy Policy

Must explain:

- Data collected
- Firebase Auth usage
- Analytics
- Cookies
- User uploads
- Contact method

### Terms of Service

Must explain:

- Platform use
- Account rules
- Content ownership
- Prohibited content
- Liability limits

### Content Rules

Must explain:

- Accepted content
- Rejected content
- AI-generated media rules
- Moderation policy

### Cookie Policy

Must explain:

- Necessary cookies
- Analytics cookies
- Consent storage
- How to change consent

### DMCA Policy

Must explain:

- Takedown process
- Required information
- Counter-notice process
- Contact email

### Acceptance Test

- Footer legal links work.
- Cookie banner legal link works.
- Direct access works.
- Pages are readable without login.

---

## 4. Replace All `href="#"`

### Problem

Footer and homepage CTAs are fake links.

### Action

Replace these links:

```txt
Explore → /explore
Challenges → /challenges
Leaderboard → /leaderboard
Creators → /creators
Upload a Film → /upload
Generate with AI → /generate
Pricing & Credits → /pricing
This Week's Challenge → /challenges
Creator Directory → /creators
About → /about
Content Rules → /rules
Contact → /contact
Browse all → /explore
Submit Your Student Film → /upload
Join the Community → /creators or /signup
See This Week's Picks → /leaderboard or /explore?filter=staff-picks
Submit Your Entry → /upload or /challenges
Submit Your Trailer → /upload?type=trailer
```

### Acceptance Test

Search the codebase:

```bash
grep -R "href=\"#\"" src
```

Expected result: zero matches unless intentionally used for internal anchors.

---

## 5. Fix Broken Thumbnails and Banners

### Problem

Several thumbnails and profile banners are missing.

### Action

Audit every image path in:

```txt
/video/*
/profile/*
/leaderboard
/explore
/search
/trailers
/real-films
```

Fix:

- Missing file paths
- Wrong relative paths
- Broken filenames
- Missing uploads
- Spaces in asset filenames

Rename:

```txt
panel 1-b5d859a2.png
```

to:

```txt
panel-1-b5d859a2.png
```

### Acceptance Test

- No broken image icons.
- No visible alt-text fallback caused by missing images.
- All thumbnails and banners render correctly.

---

# Phase 2 — Remove Fake or Empty Product Content

## 6. Fix AI Cinema Index

### Problem

`/real-films` says `0 FILMS`.

### Action

Either populate it with real data or hide it from navigation until ready.

Minimum viable data structure:

```ts
type RealFilm = {
  title: string;
  creator: string;
  year: number;
  runtime: string;
  category: string;
  modelUsed: string;
  sourceFestival: string;
  sourceUrl: string;
  thumbnailUrl: string;
};
```

Minimum content:

- 10 real entries
- 2–3 highlighted films
- Real thumbnails
- Real source links

### Acceptance Test

`/real-films` must not show `0 FILMS`.

---

## 7. Replace Fake Platform Stats

### Problem

The following stats look fake:

```txt
16K+ FILMS UPLOADED
3.2K EMERGING CREATORS
48+ COUNTRIES
4 AI MODELS
```

### Action

Choose one option.

### Option A — Real Counts

Fetch from Firestore/API:

```ts
{
  filmCount,
  creatorCount,
  countryCount,
  aiModelCount
}
```

### Option B — Pre-Launch Honest Labels

Replace with honest wording:

```txt
Early Access
Creator Beta
AI Film Challenges
Global Submissions Opening Soon
```

### Acceptance Test

Homepage must not claim fake numbers unless backed by real database counts.

---

## 8. Fix View and Like Counts

### Problem

View and like counts appear hardcoded.

### Action

Use real database fields:

```ts
views: number;
likes: number;
```

For new films, show:

```txt
0 views
0 likes
```

Do not show fake thousands.

### Acceptance Test

Counts update from database or are removed.

---

## 9. Fix Creator Profile Placeholders

### Problem

Profiles show initials and empty banners.

### Action

Use one of these:

- Real creator profile images
- Branded default avatar
- Clear “new creator” default state

For banners:

- Add default Madtape branded banner.
- Allow user-uploaded banner later.

### Acceptance Test

No creator profile should look accidentally unfinished.

---

# Phase 3 — Product Functionality

## 10. Auth-Gated Action Feedback

### Problem

Save, Follow, Like, and Tip silently do nothing.

### Action

For unauthenticated users:

```ts
onClick={() => {
  openAuthModal({
    message: "Sign in to save this film."
  });
}}
```

Apply to:

```txt
Save
Follow
Like
Tip
Upload
Generate
Submit Entry
Submit Trailer
```

### Acceptance Test

No button silently fails.

---

## 11. Decide What to Do with Tip Feature

### Problem

The Tip button has no backend.

### Action

Choose one option.

### Option A — Remove Tip

Remove Tip until payment backend exists.

### Option B — Implement Real Payment Flow

Build:

- Stripe Connect
- Creator payout account
- Tip amount modal
- Payment success/failure state
- Transaction record

### Acceptance Test

Tip either works fully or is removed.

No fake payment feature remains.

---

## 12. Fix Revenue-Share Claims

### Problem

Pricing says revenue share exists, but no mechanism is visible.

### Action

Choose one option.

### Option A — Remove Claims

Remove revenue-share claims from pricing and homepage.

### Option B — Build Revenue Share

Build:

```txt
Creator earnings dashboard
Payout settings
Revenue calculation rules
Transaction history
Terms explaining revenue share
```

### Acceptance Test

No monetization promise appears without a real feature behind it.

---

# Phase 4 — SEO and Metadata

## 13. Fix Page Metadata

### Problem

Meta description and OG description differ. Many pages reuse the same title.

### Action

Use React Helmet or equivalent.

Each route must set:

```txt
<title>
meta description
og:title
og:description
og:image
canonical
```

Suggested titles:

```txt
Home:
Madtape AI — The Home of Short-Form AI Cinema

Explore:
Explore AI Short Films — Madtape

Video:
Glass Hour — AI Short Film — Madtape

Creator:
Kira Motion — Creator Profile — Madtape

Pricing:
Pricing & Credits — Madtape

AI Cinema:
Real AI Cinema Index — Madtape
```

### Acceptance Test

Inspect page source or browser head after route change.

Metadata must update per route.

---

## 14. Fix `robots.txt` and `SearchAction` Conflict

### Problem

JSON-LD points to `/search`, but `robots.txt` blocks `/search`.

### Action

Choose one option.

### Option A

- Allow `/search`.
- Keep `SearchAction`.

### Option B

- Keep `/search` blocked.
- Remove `SearchAction`.

Best choice: allow `/search` only if search results are useful and clean.

### Acceptance Test

`robots.txt` and JSON-LD do not contradict each other.

---

## 15. Add Structured Data

### Action

Add:

- `VideoObject` schema on video pages.
- `Person` schema on creator pages.
- `BreadcrumbList` schema for navigation.

### Acceptance Test

Validate using Google Rich Results Test.

---

## 16. Add Sitemap `<lastmod>`

### Action

Update sitemap entries for:

```txt
/video/*
/profile/*
/real-films
/trailers
```

Include:

```xml
<lastmod>2026-05-28</lastmod>
```

Or use dynamic update dates from the database.

### Acceptance Test

Sitemap validates and includes last modified dates.

---

# Phase 5 — Security, Compliance, and Reliability

## 17. Add Custom 404 Page

### Action

Create a branded 404 page with:

```txt
Page not found
Return Home
Explore Films
Search Madtape
```

### Acceptance Test

Invalid URLs show a Madtape 404 page, not GitHub Pages branding.

---

## 18. Add Security Headers After Migration

### Action

If hosted on Vercel, Netlify, or Cloudflare, add:

```txt
Content-Security-Policy
X-Frame-Options
Referrer-Policy
Permissions-Policy
X-Content-Type-Options
```

### Acceptance Test

Security headers appear in browser/network response.

---

## 19. Review Firebase Security

### Action

- Enable Firebase App Check.
- Review Firestore rules.
- Prevent unauthenticated writes.
- Rate-limit auth-sensitive actions.
- Validate upload permissions.

### Acceptance Test

Unauthenticated users cannot write protected data.

---

## 20. Cookie Consent Control

### Problem

Consent is stored, but the user must be able to change it later.

### Action

- Confirm floating cookie icon reopens preferences.
- If not, implement it.
- Add `Cookie Settings` link in footer.

### Acceptance Test

User can change consent without clearing browser storage.

---

# Final QA Checklist

The site is user-ready only when all items pass.

```txt
[ ] All direct URLs work.
[ ] No GitHub Pages 404 appears.
[ ] Videos actually play.
[ ] No href="#" remains.
[ ] Legal pages exist and are readable.
[ ] Cookie policy link works.
[ ] Footer links work.
[ ] Homepage CTAs work.
[ ] Broken thumbnails fixed.
[ ] AI Cinema page has real content or is hidden.
[ ] Fake platform stats removed or connected to real data.
[ ] View/like counts are real or removed.
[ ] Save/Follow/Tip/Like show auth feedback.
[ ] Tip feature is either fully working or removed.
[ ] Revenue-share claims are backed by a real mechanism or removed.
[ ] Page titles and meta descriptions are route-specific.
[ ] robots.txt and JSON-LD do not conflict.
[ ] Sitemap includes lastmod for dynamic pages.
[ ] Custom 404 exists.
[ ] Firebase rules and App Check reviewed.
[ ] Cookie settings can be reopened.
```

---

# Sprint Order

## Day 1 — Critical

```txt
Routing
Legal pages
Cookie policy link
Footer links
Homepage CTAs
Custom 404
```

## Day 2 — Core Product

```txt
Video storage
Video playback
Broken thumbnails
Upload/generate gating
Auth modal feedback
```

## Day 3 — Credibility

```txt
Remove fake stats
Fix likes/views
Populate or hide AI Cinema
Fix creator placeholders
Fix trailer submission
```

## Day 4 — SEO and Security

```txt
Metadata
Canonical tags
Schema
robots.txt
sitemap
Security headers
Firebase rules
```

---

# Instruction to the AI Agent

Work in this order.

Do not start SEO polish before routing, legal pages, links, and video playback are fixed.

Do not preserve fake numbers.

Do not leave silent buttons.

Do not keep live navigation pointing to empty or broken pages.

The product is user-ready only when the final QA checklist passes.
