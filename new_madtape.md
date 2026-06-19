# Madtape Website Alignment Fix — Antigravity Implementation Brief

## Objective

Refactor the current Madtape website so it fully matches the latest business model and pitch direction:

> Madtape is the platform layer for AI-native short-form cinema: publishing, discovery, workflow transparency, creator support, and audience-backed validation.

AI generation must be treated as optional, secondary, and not publicly priced until real provider costs and margins are verified.

## Current Brutal Diagnosis

The current rebuild is technically stronger than the previous version, but the business model is still unsafe.

Good progress already made:

* Firebase backend added.
* Fake payment simulation removed.
* LocalStorage billing removed.
* Creator upload limits added.
* Workflow disclosure added to film detail pages.
* Tipping modal added with 95% creator / 5% platform split.
* Stripe is disabled in beta mode with safe fallback notices.

Critical remaining problems:

* The website/report still exposes fixed generation pricing: `$0.10 per 5-second video render`.
* Creator Pack and Studio Pack prices are still public: `$29 for 50 videos` and `$79 for 200 videos`.
* These prices are not safe because provider costs can exceed the selling price.
* Madness Credits were removed, but the business still needs a future-safe usage-pricing layer for optional generation.
* The site must not look like an AI video generator.
* The site must not lead with generation.
* The site must not imply crowdfunding, investment, or guaranteed creator income.
* SEO/meta copy must be updated to match the new positioning.

## Non-Negotiable Product Positioning

Madtape is not:

* An AI video generator
* A cheap compute provider
* A Runway/Pika/Seedance competitor
* A crowdfunding platform
* A generic streaming platform
* A platform for “film students” only
* A fake paid product during beta

Madtape is:

* A publishing home for AI-native cinema
* A curated short-form AI cinema discovery feed
* A workflow-transparent learning layer
* A creator support platform
* A way to validate which AI stories deserve longer production
* A platform where optional generation may come later, priced by real compute cost

## Required Copy Direction

Use this core statement everywhere:

> Madtape is the publishing, workflow, discovery, and creator-support layer for AI-native short-form cinema.

Use this support statement:

> Generation is optional. The platform is the core.

Use this business logic:

> Publishing plans are separate from compute. Optional generation must be priced by real provider cost, duration, model, resolution, and workflow type.

## Files / Areas to Audit

Search and update the following likely areas:

* `src/platform-data.jsx`
* `src/main.jsx`
* `src/page-profile-video.jsx`
* Upload page component
* Pricing page component
* Homepage / landing page component
* Support / tipping modal component
* Generation / tools component
* SEO meta in `index.html`
* Any route config or static data file
* Any pricing constants
* Any CTA constants
* Any beta/payment fallback copy

Run these searches across the codebase:

```bash
grep -R "\$0.10\|0.10\|Creator Pack\|Studio Pack\|Madness Credits\|credits\|unlimited generation\|Generate Now\|crowdfunding\|investment\|pure margin\|AI video generator\|film students\|streaming platform" -n src public index.html
```

Every unsafe match must be removed or rewritten.

## Fix 1 — Remove Unsafe Generation Pricing

Delete public references to:

* `$0.10 per 5-second render`
* `Creator Pack $29`
* `Studio Pack $79`
* `50 videos/month`
* `200 videos/month`
* `Seedance 2.0 API access`
* Any promise of fixed render cost
* Any implication that generation is currently buyable

Replace with:

> Optional generation tools are coming later. Pricing will depend on model, duration, resolution, workflow type, and real provider cost. Creators will see the estimated cost before rendering.

Use this copy for the generation section:

```md
### Optional Generation Toolkit

Generation is not the core product. Madtape may offer optional generation tools for creators who want to render, extend, upscale, retry, or test scenes inside the platform.

Generation will be priced by real compute usage. No unlimited compute. No hidden credit traps. No below-cost renders.
```

## Fix 2 — Replace Pricing Model With Three Clear Sections

The pricing page must be split into three sections.

### Section A — Publishing Plans

Use only publishing/upload limits here.

```md
## Creator Publishing Plans

### Free — $0/month
- Publish up to 5 films per month
- Public creator profile
- Workflow pages
- Community feed access

### Creator — $15/month
- Publish up to 20 films per month
- Basic analytics
- Creator badge
- Workflow library
- Priority visibility in selected areas

### Pro — $39/month
- Unlimited publishing uploads
- Advanced analytics
- Challenge priority
- Priority support
- Early access to creator-support tools
```

Important rule:

> “Unlimited” may only refer to publishing uploads. It must never refer to AI generation, rendering, compute, credits, or video generation.

### Section B — Direct Creator Support

```md
## Direct Creator Support

Supporters can directly support creators.

Creators receive 95% of the platform support split. Madtape takes a clearly disclosed 5% platform fee. Payment processing fees, refunds, taxes, and legal deductions may apply.

Payments are disabled during beta preview.
```

### Section C — Optional Generation

```md
## Optional Generation

Optional generation tools are planned for future release.

Generation pricing will depend on real provider cost, selected model, duration, resolution, workflow type, retries, and output quality. Madtape will not offer unlimited generation or below-cost rendering.
```

No fixed prices.

No packs.

No credit bundles.

No fake checkout.

## Fix 3 — Update Homepage Hero

Current homepage must not lead with generation.

Replace hero with:

```md
# The platform layer for AI-native short-form cinema.

Publish cinematic AI shorts, share the workflow behind them, build an audience, and receive direct creator support.

[Publish Your Film] [Explore AI Cinema]
```

Small line:

```md
Built for AI-native filmmakers, cinematic storytellers, and experimental creators.
```

Do not use:

* Generate now
* Start creating for free
* AI video generator
* Unlimited video
* Cheapest AI video
* One-click AI movies

## Fix 4 — Update Homepage Section Order

Homepage must follow this order:

1. Hero
2. Problem
3. Product loop
4. Workflow transparency
5. Creator support
6. Publishing plans
7. Optional generation
8. Beta/payment notice
9. Final CTA

Do not put generation before publishing, workflow, or discovery.

## Fix 5 — Problem Section Copy

Use:

```md
## AI video is exploding. The ecosystem around it is fragmented.

Creators can generate cinematic clips, but they still lack:

- A dedicated home for AI-native short films
- A way to prove audience demand before spending more on production
- A platform built for pilots, episodes, and cinematic IP
- A monetization path beyond scattered ads, tips, subscriptions, and external platforms
- A way to learn from real production workflows

The problem is not making AI video. The problem is turning AI video into audience-tested stories.
```

## Fix 6 — Product Loop Copy

Use:

```md
## From AI clip to audience-tested IP

1. Creator publishes a cinematic short.
2. Creator attaches workflow metadata.
3. Viewers discover the film in a curated feed.
4. Viewers learn from the workflow and follow the creator.
5. Supporters directly support creators.
6. Validated projects can later become reward-based episode or pilot campaigns.
7. Creators publish back into Madtape.
```

## Fix 7 — Workflow Transparency Must Become the Moat

Make workflow pages visually central.

Workflow fields should include:

* Tools used
* Models used
* Prompts, if creator chooses to reveal them
* Production steps
* Production time
* Estimated production cost
* Assets used
* Versions
* Creator notes
* Lessons learned
* Final output

Use this headline:

```md
## Every film has a workflow.

Madtape turns AI cinema from passive viewing into a transparent production knowledge layer.
```

Use this moat copy:

```md
Each published film can carry its production metadata: tools, steps, time, cost, versions, and creator notes. The more creators publish workflows, the stronger the learning network becomes.
```

Do not use:

* Uncopyable
* Secret sauce
* Only platform
* Guaranteed moat

## Fix 8 — Tipping / Support Modal Copy

Current 95/5 split is good, but must include processing and beta disclaimers.

Replace modal copy with:

```md
Support this creator directly.

Creators receive 95% of the platform support split. Madtape takes a clearly disclosed 5% platform fee. Payment processing fees, refunds, taxes, and legal deductions may apply.

Payments are disabled during beta preview. No real transaction will be processed yet.
```

Button states:

* If beta payments disabled: `Payments Coming Soon`
* If Stripe enabled later: `Support Creator`

Do not show fake balances.

Do not simulate successful tips.

Do not say “pure margin.”

## Fix 9 — Campaign Language Must Be Legally Safer

Remove or avoid:

* Crowdfunding
* Invest
* Investment
* Back this project for returns
* Profit sharing
* Equity
* Funding guarantee

Use:

```md
Reward-based audience support
Audience-backed production
Project support pages
Early access
Perks
Creator challenge pools
```

Campaign copy:

```md
When a short proves audience demand, creators may launch reward-based support pages for longer episodes, pilots, or series concepts.

This is not equity investment, profit sharing, or financial crowdfunding.
```

## Fix 10 — SEO / Meta Update

Update `index.html` and any SEO metadata.

Use:

```html
<title>Madtape — AI-Native Short-Form Cinema</title>
<meta name="description" content="Madtape is the publishing, workflow, discovery, and creator-support layer for AI-native short-form cinema. Publish cinematic AI shorts, share workflows, build an audience, and support creators." />
<meta property="og:title" content="Madtape — The Platform Layer for AI-Native Cinema" />
<meta property="og:description" content="Publish, discover, learn from, and support AI-native cinematic shorts and episodes through workflow-transparent creator pages." />
```

Remove old meta concepts:

* Film students
* Emerging talent only
* Generic streaming platform
* Transforming film and media production
* Upload your AI...
* AI generator-first wording

## Fix 11 — Navigation

Use this nav order:

```md
Explore
Publish
Workflows
Creators
Pricing
About
```

Optional later:

```md
Generate
Challenges
Campaigns
```

Do not put Generate first.

## Fix 12 — CTA Rules

Allowed CTAs:

* Publish Your Film
* Explore AI Cinema
* Share Your Workflow
* View Workflows
* Support a Creator
* Join the Beta

Avoid:

* Generate Now
* Start Creating for Free
* Buy Credits
* Purchase Pack
* Get Funded
* Launch Campaign
* Unlimited Video

## Fix 13 — Beta Payment Rules

Because `STRIPE_ENABLED = false`, all paid CTAs must be honest.

Behavior:

* Paid plan button opens beta notice.
* Tip button opens beta notice.
* Optional generation button opens coming-soon notice.
* No fake checkout.
* No fake subscription success.
* No fake wallet.
* No fake credit balance.
* No simulated render purchase.

Suggested beta notice:

```md
Payments are coming soon.

Real Stripe Checkout transactions are disabled during this beta preview. You can explore the product, publish test content, and review workflows, but no real payment will be processed yet.
```

## Fix 14 — Optional Generation Internal Data Model

Do not reintroduce public credit packs.

But prepare future-safe internal structure:

```js
const generationConfig = {
  enabled: false,
  publicPricingVisible: false,
  pricingMode: "dynamic_provider_cost",
  message: "Optional generation is coming later. Pricing will depend on model, duration, resolution, workflow type, and provider cost."
}
```

Future generation pricing must support:

* model
* provider
* duration
* resolution
* workflow type
* base provider cost
* margin buffer
* estimated user price
* retry policy
* failed generation policy

No public release until cost data is verified.

## Fix 15 — Domain / Deployment Consistency

The product must consistently point to:

```md
https://madtape.com/
```

Audit and remove stale deployment references from public-facing UI.

GitHub Pages may be used only as deployment infrastructure if needed, but the public canonical URL must be `madtape.com`.

Check:

* `homepage` field in `package.json`
* Vite base path
* GitHub Pages routing
* CNAME file
* canonical meta tag
* sitemap
* Open Graph URL
* Twitter card URL
* footer links
* share URLs

## Fix 16 — Required Public FAQ

Add these FAQs.

### Is Madtape an AI video generator?

No. Madtape is a publishing and discovery platform for AI-native cinema. Optional generation tools may be added later, but the core product is publishing, workflow transparency, discovery, and creator support.

### Why do films include workflows?

Because AI-native cinema is also a learning ecosystem. Viewers and creators can understand how a film was made, what tools were used, how long it took, and what it cost.

### How does creator support work?

Supporters can directly support creators. Creators receive 95% of the platform support split, while Madtape takes a clearly disclosed 5% platform fee. Payment processing fees, refunds, taxes, and legal deductions may apply.

### Is generation included in subscriptions?

No. Publishing subscriptions are separate from compute. Optional generation tools will be priced separately based on real usage if enabled later.

### Is this crowdfunding?

Madtape may test reward-based audience support for creative projects. It is not equity investment, profit sharing, or financial crowdfunding.

### Are payments live?

No. Payments are disabled during beta preview. No real transaction is processed yet.

## Fix 17 — Remove Unsafe Claims

Remove all public text matching these ideas:

* `$0.10/video`
* `Creator Pack`
* `Studio Pack`
* `50 videos`
* `200 videos`
* `unlimited generation`
* `buy credits`
* `Madness Credits`
* `pure margin`
* `guaranteed income`
* `guaranteed funding`
* `crowdfunding platform`
* `investment`
* `equity`
* `profit sharing`
* `only platform`
* `uncopyable`
* `best AI video platform`
* `cheapest AI generation`

## Fix 18 — Build and Verification

After changes:

```bash
npm run build
```

Then run:

```bash
grep -R "\$0.10\|Creator Pack\|Studio Pack\|Madness Credits\|Buy Credits\|unlimited generation\|pure margin\|crowdfunding\|investment\|guaranteed funding\|AI video generator\|film students" -n src public index.html docs
```

Expected result:

No unsafe public-facing matches.

## Acceptance Criteria

The website is acceptable only if:

* It no longer looks like a generic AI video generator.
* Homepage leads with publishing, workflow, discovery, and creator support.
* Generation is clearly optional and secondary.
* No public fixed generation price remains.
* No generation pack pricing remains.
* No fake payment or fake credit state remains.
* Pricing separates publishing subscriptions from creator support and optional generation.
* Tipping copy includes platform fee, processing/tax disclaimer, and beta payment state.
* Workflow transparency is visibly central.
* Campaign language is reward-based and not investment/crowdfunding language.
* SEO metadata matches the new positioning.
* Public canonical URL is `madtape.com`.
* The website can be shown to Start it @KBC without obvious unit-economics contradictions.

## Final Direction

The final site must communicate one clear idea:

> Madtape is not another AI generation tool. It is building the publishing, workflow, discovery, and creator-support layer for AI-native cinema.
