# Madtape MVP Rebuild Plan  
## From Scammy Pricing to a Real Ethical Creator Platform

## Core Objective

Rebuild Madtape from a fake/fragile demo into a real MVP.

The current version must be treated as structurally unsafe because it relies on unrealistic pricing, fake payment simulation, LocalStorage subscription logic, and unclear creator value.

The new direction is:

> Madtape is a creator community platform for short-form AI cinema, not an overpriced generation tool.

The rebuild must focus on trust, transparency, real backend infrastructure, creator ownership, and simple monetization.

---

# 1. Business Model Pivot

## 1.1 New Honest Revenue Model

### A. Primary Revenue: Donations + 5% Platform Fee

Donation flow:

```text
Viewer donates $100
Madtape takes 5% = $5
Creator receives 95% = $95
```

This should be the main business model because it aligns Madtape with creators instead of exploiting them through inflated generation pricing.

---

## 1.2 Creator Subscription Plans

These plans are only for creators who want better publishing and analytics tools.

| Plan | Price | Features |
|---|---:|---|
| Free | $0/month | Upload 5 films/month, show workflow, community access |
| Creator | $15/month | Upload 20 films/month, analytics dashboard, Creator badge |
| Pro | $39/month | Unlimited uploads, priority in challenges, priority support |

Requirements:

- Remove inflated plans priced at $250-$800.
- Keep pricing simple and believable.
- Do not use complex credit math for basic publishing.
- The Free plan must be useful enough for real adoption.

---

## 1.3 Optional Generation Pricing

Generation should be optional, not the core platform promise.

| Plan | Price | Features |
|---|---:|---|
| Pay-as-you-go | $0.10 per 5-second video | No subscription required |
| Creator Pack | $29/month | 50 videos, 5 seconds each, 1080p |
| Studio Pack | $79/month | 200 videos, 5 seconds each, Seedance 2.0, API access |

Requirements:

- Generation must be separated from the creator community platform.
- Pricing must be transparent.
- No fake scarcity.
- No confusing credit system unless the backend supports real accounting.

---

# 2. Remove Scammy or Fake Features

## 2.1 Remove Immediately

Remove the following features completely:

1. `Madness Credits`
   - Replace with clear pricing.
   - No hidden conversion math.

2. `40-minute cooldown rule`
   - Replace with simple daily or monthly usage limits.

3. Fake payment simulator
   - Replace with real Stripe integration.
   - Keep Stripe disabled until launch, but the code must be production-ready.

4. LocalStorage-based subscriptions
   - Replace with Firebase or Supabase.
   - User plan, credits, uploads, and billing state must never be trusted from the browser.

5. Random or stolen YouTube links
   - Only allow creators to submit their own original work.
   - Add clear upload/link ownership confirmation.

---

## 2.2 Add Instead

Build the following real features:

1. Transparent donation system using Stripe Connect.
2. Real backend using Firebase or Supabase.
3. Workflow sharing for each film.
4. Challenges and prize system.
5. Creator analytics dashboard.
6. Real authentication.
7. Real database.
8. Real deployment environment.

---

# 3. Technical Architecture

## 3.1 Current Architecture to Replace

```text
Frontend: React 19 + Vite 8 + LocalStorage
Backend: None
Database: LocalStorage only
Payment: Fake simulator
Hosting: GitHub Pages
```

This is not acceptable for an MVP with accounts, payments, creator plans, or analytics.

---

## 3.2 Target Architecture

```text
Frontend: React 19 + Vite 8 + TailwindCSS or current CSS
Backend: Firebase or Supabase
Database: Firestore or PostgreSQL
Authentication: Firebase Auth or Supabase Auth
Payment: Stripe, disabled until launch
Storage: Firebase Storage or Supabase Storage
Hosting: Netlify or Vercel
```

Preferred first version:

```text
Frontend: React + Vite
Backend: Firebase
Database: Firestore
Auth: Firebase Auth
Storage: Firebase Storage
Payments: Stripe Checkout + Stripe Connect
Hosting: Netlify
```

---

# 4. Database Schema

Use this structure as the first MVP schema.

## 4.1 Users Collection

```text
users/
  uid: string
  email: string
  displayName: string
  plan: "free" | "creator" | "pro"
  stripeCustomerId: string | null
  stripeConnectAccountId: string | null
  createdAt: timestamp
  updatedAt: timestamp
```

---

## 4.2 Films Collection

```text
films/
  filmId: string
  creatorId: string
  title: string
  description: string
  youtubeUrl: string | null
  videoUrl: string | null
  thumbnailUrl: string
  workflow:
    tools: string[]
    steps: string[]
    totalTime: string
    totalCost: number
  createdAt: timestamp
  updatedAt: timestamp
  views: number
  likes: number
  status: "draft" | "published" | "removed"
```

---

## 4.3 Donations Collection

```text
donations/
  donationId: string
  filmId: string
  donorId: string | null
  creatorId: string
  amount: number
  platformFee: number
  netAmount: number
  stripePaymentId: string
  status: "pending" | "completed" | "failed" | "refunded"
  createdAt: timestamp
```

---

## 4.4 Challenges Collection

```text
challenges/
  challengeId: string
  title: string
  description: string
  startDate: timestamp
  endDate: timestamp
  prize: string
  submissions: number
  isActive: boolean
  createdAt: timestamp
```

---

## 4.5 Submissions Collection

```text
submissions/
  submissionId: string
  challengeId: string
  filmId: string
  creatorId: string
  votes: number
  createdAt: timestamp
```

---

# 5. Implementation Plan

## Phase 1: Planning and Setup

### Tasks

- Create Firebase project.
- Create Stripe account.
- Create Netlify or Vercel deployment.
- Design database schema.
- Write migration plan from current fake/local system.
- Identify all LocalStorage subscription/payment logic.
- Identify all fake payment simulator code.
- Identify all pricing pages and components that mention old plans.

### Deliverables

- Firebase project ready.
- Stripe account ready.
- Hosting project ready.
- Database schema documented.
- Migration plan documented.
- List of code files that must be deleted or replaced.

---

# 6. Backend Build

## 6.1 Firebase Setup

Create a Firebase config file.

```js
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";

const firebaseConfig = {
  apiKey: "YOUR_API_KEY",
  authDomain: "madtape.firebaseapp.com",
  projectId: "madtape",
  storageBucket: "madtape.appspot.com",
  messagingSenderId: "YOUR_SENDER_ID",
  appId: "YOUR_APP_ID"
};

const app = initializeApp(firebaseConfig);

export const auth = getAuth(app);
export const db = getFirestore(app);
export const storage = getStorage(app);
```

Do not hardcode production secrets in frontend code.

---

## 6.2 Authentication

Implement:

- Sign up with email and password.
- Sign in.
- Sign out.
- Auth context.
- Protected routes.
- Creator dashboard only for authenticated users.
- Upload page only for authenticated users.

Example functions:

```js
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut
} from "firebase/auth";

import { auth } from "./firebase-config";

export const signUp = async (email, password) => {
  return createUserWithEmailAndPassword(auth, email, password);
};

export const signIn = async (email, password) => {
  return signInWithEmailAndPassword(auth, email, password);
};

export const logOut = async () => {
  return signOut(auth);
};
```

---

## 6.3 Firestore Security Rules

Create secure rules.

Minimum rules:

```js
rules_version = "2";

service cloud.firestore {
  match /databases/{database}/documents {

    match /users/{userId} {
      allow read: if true;
      allow create: if request.auth != null && request.auth.uid == userId;
      allow update, delete: if request.auth != null && request.auth.uid == userId;
    }

    match /films/{filmId} {
      allow read: if true;
      allow create: if request.auth != null
        && request.auth.uid == request.resource.data.creatorId;

      allow update, delete: if request.auth != null
        && request.auth.uid == resource.data.creatorId;
    }

    match /donations/{donationId} {
      allow create: if false;
      allow read: if request.auth != null
        && (
          request.auth.uid == resource.data.donorId ||
          request.auth.uid == resource.data.creatorId
        );
    }

    match /challenges/{challengeId} {
      allow read: if true;
      allow write: if false;
    }

    match /submissions/{submissionId} {
      allow read: if true;
      allow create: if request.auth != null
        && request.auth.uid == request.resource.data.creatorId;
    }
  }
}
```

Important correction:

Do not allow users to directly create donation records from the frontend. Donations must be created by a trusted backend function after Stripe confirms payment.

---

# 7. Stripe Integration

## 7.1 Stripe Status

Stripe must be integrated but disabled until launch.

Use:

```js
export const STRIPE_ENABLED = false;
```

When disabled:

- Payment buttons remain visible.
- Clicking shows: `Payments are coming soon.`
- No fake payment success screen.
- No fake subscription upgrade.
- No fake donation record.

---

## 7.2 Subscription Products

Create Stripe products:

```js
const products = [
  {
    name: "Creator Plan",
    price: 1500,
    interval: "month",
    description: "20 films/month + analytics dashboard + Creator badge"
  },
  {
    name: "Pro Plan",
    price: 3900,
    interval: "month",
    description: "Unlimited uploads + priority support + advanced analytics"
  }
];
```

---

## 7.3 Checkout Session

Use backend functions only.

Do not create payment sessions directly from the frontend.

Required backend endpoints:

```text
POST /api/create-checkout-session
POST /api/create-donation-session
POST /api/stripe-webhook
```

The webhook must update:

- User plan after successful subscription.
- Donation status after successful donation.
- Creator net amount.
- Stripe payment ID.
- Failed or canceled payment status.

---

## 7.4 Donations

Donation fee logic:

```text
platformFee = amount * 0.05
netAmount = amount - platformFee
```

Requirements:

- Use Stripe Connect before real creator payouts.
- Do not claim creators can receive money until Stripe Connect onboarding is implemented.
- Store donation records only after payment confirmation.

---

# 8. Frontend Rebuild

## 8.1 Remove LocalStorage Logic

Delete all code like:

```js
localStorage.setItem("userPlan", plan);
localStorage.setItem("credits", credits);
localStorage.getItem("userPlan");
localStorage.getItem("credits");
```

Replace with authenticated backend state.

Example:

```js
import { doc, setDoc } from "firebase/firestore";
import { db } from "./firebase-config";

export const updateUserPlan = async (userId, plan) => {
  await setDoc(
    doc(db, "users", userId),
    { plan, updatedAt: new Date() },
    { merge: true }
  );
};
```

---

## 8.2 Auth Context

Build a global `AuthContext`.

Requirements:

- Track Firebase user.
- Load user profile from Firestore.
- Provide `user`, `userData`, and `loading`.
- Protect routes.

---

## 8.3 Upload Page

Build a real upload page.

Fields:

- Film title.
- Description.
- YouTube URL or uploaded video URL.
- Thumbnail URL.
- Tools used.
- Workflow steps.
- Total production time.
- Total production cost.

Validation:

- Title is required.
- Description is required.
- Either YouTube URL or uploaded video is required.
- User must confirm they own the work.
- Workflow must not be empty.

---

## 8.4 Pricing Page

Replace old pricing with:

### Creator Platform Plans

| Plan | Price |
|---|---:|
| Free | $0/month |
| Creator | $15/month |
| Pro | $39/month |

### Optional Generation Packs

| Pack | Price |
|---|---:|
| Pay-as-you-go | $0.10/video |
| Creator Pack | $29/month |
| Studio Pack | $79/month |

Requirements:

- Remove all manipulative pricing language.
- Remove fake discounts.
- Remove fake urgency.
- Remove confusing credits.
- Show clear limits.

---

## 8.5 Donation Button

Build donation UI.

Default buttons:

```text
$5
$10
$25
Custom amount
```

When Stripe is disabled:

```text
Payments are coming soon.
```

When Stripe is enabled:

- Create donation session.
- Redirect to Stripe Checkout.
- Confirm via webhook.
- Update donation records.

---

# 9. New MVP Features

## 9.1 Workflow Sharing

Each film page must display:

- Tools used.
- Steps.
- Time spent.
- Estimated cost.
- Creator notes.

Purpose:

Madtape should become a learning and discovery platform, not only a video gallery.

---

## 9.2 Challenges

Build challenge pages.

Challenge fields:

- Title.
- Description.
- Start date.
- End date.
- Prize.
- Active/inactive status.
- Submission count.

User flow:

1. Creator opens challenge.
2. Creator submits an existing film.
3. Submission appears in challenge page.
4. Users can view submissions.

Voting can be added later. Do not build fake voting if it is not secured.

---

## 9.3 Creator Dashboard

Dashboard must show:

- Total films.
- Total views.
- Total likes.
- Total donations.
- Active plan.
- Upload limit.
- Remaining uploads this month.

Do not fake analytics. If real tracking is not implemented, show only real stored values.

---

# 10. Testing Requirements

## 10.1 QA Testing

Test:

- Sign up.
- Sign in.
- Sign out.
- Protected routes.
- Upload film.
- Edit film.
- Delete film.
- View film.
- View workflow.
- Submit film to challenge.
- View dashboard.
- Pricing page.
- Disabled payment state.

---

## 10.2 Security Testing

Check:

- Users cannot edit other users’ profiles.
- Users cannot edit other creators’ films.
- Users cannot fake plans from browser.
- Users cannot create fake donation records.
- Users cannot bypass upload limits.
- Firestore rules reject unauthorized writes.
- XSS protection exists for descriptions and workflow fields.

---

## 10.3 Performance Testing

Targets:

```text
Lighthouse score: 90+
Initial load: under 3 seconds
Bundle size: under 500KB if possible
Mobile responsive: required
```

---

# 11. Beta Launch

## Beta Scope

Invite only 50 creators.

Beta goals:

- Test upload flow.
- Test creator profiles.
- Test workflow sharing.
- Test challenge submission.
- Collect feedback.
- Fix critical bugs.

Do not launch payments during beta unless Stripe Connect and webhooks are fully tested.

---

# 12. Public Launch Plan

## Week 13-14

- Enable Stripe only after successful testing.
- Add at least 10 educational posts or workflow examples.
- Build email list.
- Prepare press release.
- Prepare Product Hunt assets.
- Prepare LinkedIn and Reddit launch posts.

## Week 15-16

- Launch publicly.
- Launch first challenge.
- Offer a real prize only if budget exists.
- Contact film schools and AI creator communities.
- Track activation and retention.

---

# 13. Expansion Plan

## Month 4: Generation Tools

- Integrate Seedance 2.0 API.
- Add fair generation pricing.
- Add upscale.
- Add extend.
- Add generation history.
- Add cost tracking.

Do not launch generation unless unit economics are verified.

---

## Month 5: Video Hosting

Move beyond YouTube links.

Options:

- Vimeo Pro.
- AWS S3.
- Cloudflare Stream.
- Firebase Storage only for small files.

Requirement:

Video hosting costs must be calculated before launch.

---

## Month 6: Marketplace Features

Add only after creator activity exists.

Possible features:

- Prompt marketplace.
- Asset marketplace.
- Job board.
- Paid workflow templates.
- Creator services.

Do not build marketplace features before there is supply and demand.

---

# 14. Brutal Implementation Priorities

The agent must follow this order:

1. Remove fake payment and fake subscription logic.
2. Remove LocalStorage as a source of truth.
3. Add authentication.
4. Add real database.
5. Add film upload and workflow sharing.
6. Add creator dashboard with real data only.
7. Add pricing page with honest plans.
8. Add Stripe in disabled mode.
9. Add donation flow only when backend and webhook exist.
10. Add challenges.
11. Test security.
12. Deploy beta.

Do not waste time polishing the UI before fixing the business model, backend, and trust problems.

---

# 15. Definition of Done

The MVP is done only when:

- Users can create accounts.
- Users can log in and log out.
- Creators can upload films.
- Films are stored in a real database.
- Workflows are visible on film pages.
- Creator plans are stored in the backend.
- LocalStorage is not used for subscriptions, credits, or payments.
- Fake payment simulator is removed.
- Stripe code exists but is disabled safely.
- Pricing is simple and transparent.
- Creator dashboard shows real data.
- Security rules prevent basic abuse.
- The app is deployed on Netlify or Vercel.
- Beta users can test the platform without touching fake payment logic.

---

# 16. Non-Negotiable Rules

- Do not fake payments.
- Do not fake subscriptions.
- Do not fake analytics.
- Do not use LocalStorage as business logic.
- Do not use stolen or random YouTube content.
- Do not claim creators can earn money before payouts are technically implemented.
- Do not add inflated AI generation pricing.
- Do not build a credit system unless the backend can track it securely.
- Do not launch publicly before authentication, database, and security rules are working.

---

# Final Product Direction

Madtape should become:

```text
A transparent creator platform for short-form AI cinema where filmmakers can publish work, share workflows, join challenges, receive support, and later access fair AI generation tools.
```

Not:

```text
An overpriced AI video generator with fake payments, fake credits, fake scarcity, and no backend.
```