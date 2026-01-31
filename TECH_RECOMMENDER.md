# 🧠 AI Recommendation Engine Logic

This document explains how the Wireframe AI combines user answers with wireframe data to generate architectural recommendations. It uses a hybrid approach of rule-based logic for strong requirements and AI reasoning for edge cases.

---

## Architecture Overview

```
┌─────────────────┐    ┌─────────────────┐
│  Questionnaire  │    │   Wireframe     │
│      Data       │    │     Data        │
└────────┬────────┘    └────────┬────────┘
         │                      │
         ▼                      ▼
┌────────────────────────────────────────┐
│           CONTEXT AGGREGATOR           │
└────────────────────┬───────────────────┘
                     │
                     ▼
┌────────────────────────────────────────┐
│           RULE-BASED ENGINE            │
│  (Hard constraints & Best Practices)   │
└────────────────────┬───────────────────┘
                     │
                     ▼
┌────────────────────────────────────────┐
│            LLM REASONING               │
│      (Nuance, edge cases, "Why")      │
└────────────────────┬───────────────────┘
                     │
                     ▼
             RECOMMENDATION JSON
```

---

## 1. Input Data Combination

The engine accepts two primary inputs:

### A. Intent Profile (from Questionnaire)
- App Type (e.g., "Fintech")
- Scale (e.g., "1M+ users")
- Constraints (e.g., "Must be HIPAA compliant")

### B. Structural Signals (from Wireframes)
- **Component Analysis**: "Contains CreditCardInput" → Payment gateway needed.
- **Screen Count**: "50+ screens" → Router complexity, code splitting needed.
- **Navigation Depth**: "Deep nested flows" → State management complexity.
- **Media Elements**: "VideoPlayer component found" → Streaming infrastructure needed.

---

## 2. Rule-Based Logic (The "Hard" Rules)

Certain combinations trigger definitive architectural choices based on industry best practices.

### 🏗️ Application Type Rules

| Signal | Recommendation | Reasoning |
|--------|----------------|-----------|
| **Fintech** | **DB**: PostgreSQL (ACID) <br> **Auth**: MFA Enforced | Financial data requires strict consistency and security. |
| **Social** | **DB**: Neo4j or Graph-capable SQL <br> **Cache**: Redis | Relationship-heavy data and high-read feeds require caching. |
| **E-commerce** | **Search**: Algolia / Elasticsearch <br> **Payment**: Stripe | Product search and reliable payment processing are critical. |
| **Simple Portfolio** | **Host**: Vercel/Netlify <br> **CMS**: Headless (Sanity/Strapi) | Static site generation (SSG) is best for performance and cost. |

### 📈 Scale Rules

| Signal | Recommendation | Reasoning |
|--------|----------------|-----------|
| **Start-up / MVP** | **Backend**: Serverless (Lambda/Vercel) | Low initial cost, scales to zero, less devops. |
| **Enterprise (1M+)** | **Backend**: Kubernetes / Containers | Cost efficiency at scale, deeper control. |
| **Global Audience** | **CDN**: Edge functionality (Cloudflare) | Latency reduction is critical for global users. |

### ⚡ Feature Rules

| Signal | Recommendation | Reasoning |
|--------|----------------|-----------|
| **Real-time Chat** | **Service**: WebSocket / managed (Pusher/Ably) | Polling is inefficient; persistent connections required. |
| **Video Streaming** | **Service**: Mux / AWS IVS | Custom video encoding is complex; offload to specialized API. |
| **Complex State** | **State**: Redux / Zustand | Deep wireframe nesting indicates complex data flow. |

---

## 3. AI-Enhanced Reasoning (Edge Cases)

The LLM is used to resolve conflicts and explain *why* a choice was made.

### Conflict Resolution Example
> **User Input**: "I want a simple MVP blog"
> **Wireframe Data**: "Contains 'Live Video Auction' component"

**Rule Engine**: Conflict. Blog = Static, Auction = Real-time.
**AI Reasoning**: "The user describes it as a blog, but wireframes show auction features. Recommend a hybrid approach: Next.js (good for blog SEO) combined with a real-time service (Supabase Realtime) for the auction component."

### "Why" Generation
The AI generates human-readable explanations:
> "We recommended **Supabase** because you asked for a 'Mobile MVP' with 'Social features'. Supabase provides Auth and Realtime out of the box, saving you weeks of backend setup compared to building a custom Express server."

---

## 4. Stack Matrix Recommendations

For each app type, here are the baseline recommendations the system starts with:

### 🛍️ E-Commerce
- **Frontend**: Next.js (for SEO)
- **Backend**: Node.js / Serverless
- **Database**: PostgreSQL (Prisma ORM)
- **CMS**: Shopify Headless / Sanity
- **Payments**: Stripe

### 💬 Social Network
- **Frontend**: React Native (Mobile first) or Omni-channel
- **Backend**: Node.js / Go
- **Database**: PostgreSQL + Redis (Caching is huge)
- **Real-time**: Socket.io / Pusher
- **Storage**: S3 / Cloudinary (User media)

### 📊 SaaS (B2B)
- **Frontend**: React / Vue
- **Backend**: NestJS (Structured monolith)
- **Database**: PostgreSQL (Multi-tenancy support)
- **Auth**: Clerk / Auth0 (Enterprise SSO needed)
- **Email**: Resend / SendGrid

### 🎨 Portfolio / Content
- **Frontend**: Astro / Next.js
- **Backend**: None (Static) or Headless CMS
- **Database**: None needed (Content in CMS)
- **Hosting**: Vercel / Netlify

---

## 5. Output Format

The final recommendation is output as a structured JSON object (see `DATA_SCHEMA.md`) and a readable Markdown report.

```markdown
# 🚀 Recommended Tech Stack: [Project Name]

## 🏗️ Core Architecture
**Microservices vs Monolith**: Modular Monolith
> Explanation: Your team size (small) doesn't justify microservices yet, but your diverse feature set benefits from modular separation.

## 🛠️ Stack Selection
- **Frontend**: Next.js 14
- **Database**: Supabase (PostgreSQL)
- **Auth**: Clerk

## ⚠️ Critical Considerations
- You selected "Healthcare" but didn't check "HIPAA". **Warning**: Ensure your chosen hosting provider signs a BAA.
```

---

<p align="center">
  <strong>Wireframe</strong> - Recommendation Engine Logic
</p>
