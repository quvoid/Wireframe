# 📋 App Intent Questionnaire Design

This document defines the questionnaire system that captures user intent, explaining why each question matters and what architectural decisions depend on the answers.

---

## Overview

The App Intent Questionnaire is a structured interview that gathers context about the application being built. This information, combined with wireframe data, feeds into the AI recommendation engine.

```
┌─────────────────────────────────────────────────────────────────┐
│                    QUESTIONNAIRE FLOW                           │
├─────────────────────────────────────────────────────────────────┤
│                                                                 │
│   ┌─────────┐   ┌─────────┐   ┌─────────┐   ┌─────────┐        │
│   │  App    │──▶│Platform │──▶│  Scale  │──▶│Real-time│        │
│   │  Type   │   │         │   │         │   │  Needs  │        │
│   └─────────┘   └─────────┘   └─────────┘   └─────────┘        │
│        │                                          │             │
│        │    ┌─────────┐   ┌─────────┐            │             │
│        └───▶│  Auth   │──▶│  Data   │◀───────────┘             │
│             │  Needs  │   │Sensitiv.│                          │
│             └─────────┘   └─────────┘                          │
│                                │                                │
│                                ▼                                │
│                    ┌───────────────────┐                       │
│                    │  AI Recommender   │                       │
│                    └───────────────────┘                       │
│                                                                 │
└─────────────────────────────────────────────────────────────────┘
```

---

## Question 1: Type of App

### Question
> **What type of application are you building?**

### Options

| Category | Options | Icon |
|----------|---------|------|
| **Commerce** | E-commerce, Marketplace, Subscription | 🛒 |
| **Social** | Social Network, Community, Dating, Forum | 👥 |
| **Productivity** | SaaS, Project Management, CRM, Analytics | 📊 |
| **Content** | Blog, News, Media Streaming, Podcast | 📰 |
| **Finance** | Banking, Payments, Trading, Crypto, Fintech | 💰 |
| **Education** | LMS, Courses, Tutoring, Quiz Platform | 📚 |
| **Healthcare** | Telemedicine, Fitness, Mental Health | 🏥 |
| **Logistics** | Delivery, Fleet Management, Warehouse | 🚚 |
| **Portfolio** | Personal Site, Agency, Showcase | 🎨 |
| **Internal** | Admin Dashboard, Internal Tool | 🔧 |
| **Other** | Custom description | ✏️ |

### Why It Matters

| App Type | Architectural Impact |
|----------|---------------------|
| **E-commerce** | Requires inventory management, payment processing, order tracking, SKU handling |
| **Fintech** | Demands highest security, audit logging, regulatory compliance (PCI-DSS, SOC2) |
| **Social** | Needs real-time feeds, notifications, media storage, graph relationships |
| **SaaS** | Requires multi-tenancy, subscription billing, usage metering |
| **Healthcare** | Must be HIPAA compliant, encrypted storage, audit trails |
| **Portfolio** | Simple static or JAMstack architecture, minimal backend |

### Decisions Influenced

| Decision Area | How App Type Affects It |
|---------------|------------------------|
| **Database** | Fintech → Strong ACID (PostgreSQL); Social → Graph DB (Neo4j); E-commerce → Hybrid |
| **Security** | Fintech/Healthcare → Maximum encryption, compliance modules |
| **Scalability** | Social/Marketplace → Horizontal scaling; Portfolio → CDN suffices |
| **Features** | Determines which core modules are recommended (payments, chat, etc.) |

---

## Question 2: Platform

### Question
> **Which platforms will your app target?**

### Options

| Option | Description | Multi-select |
|--------|-------------|--------------|
| **Web Only** | Browser-based application | Single |
| **Mobile Only** | iOS and/or Android native | Single |
| **Web + Mobile** | Both web and mobile apps | Single |
| **PWA** | Progressive Web App with offline support | Addon |
| **Desktop** | Electron or native desktop | Addon |

### Sub-questions (if Mobile)

| Question | Options |
|----------|---------|
| **Target OS** | iOS only, Android only, Both |
| **Approach** | Native, Cross-platform (React Native, Flutter), Hybrid |

### Why It Matters

| Platform Choice | Architectural Impact |
|-----------------|---------------------|
| **Web Only** | Simplest stack; focus on responsive design |
| **Mobile Only** | Need mobile-optimized APIs, push notifications, app store deployment |
| **Web + Mobile** | API-first design mandatory; shared backend, separate frontends |
| **PWA** | Service workers, caching strategies, offline-first data sync |

### Decisions Influenced

| Decision Area | How Platform Affects It |
|---------------|------------------------|
| **Frontend** | Web → Next.js/Nuxt; Mobile → React Native/Flutter; Both → Shared API |
| **Backend** | Mobile needs optimized endpoints (GraphQL good for mobile) |
| **Auth** | Mobile needs OAuth flows, biometric support |
| **Storage** | Mobile needs offline sync (SQLite, WatermelonDB) |
| **Push** | Mobile → FCM/APNs; Web → Web Push API |

---

## Question 3: Scale

### Question
> **What scale do you anticipate for your application?**

### Options

| Scale | Expected Users | Concurrent | Description |
|-------|---------------|------------|-------------|
| **Small** | < 1,000 | < 100 | Personal project, MVP |
| **Medium** | 1K - 100K | 100 - 5K | Startup, growing business |
| **Large** | 100K - 1M | 5K - 50K | Established product |
| **Enterprise** | 1M+ | 50K+ | Large-scale platform |

### Sub-questions

| Question | Options |
|----------|---------|
| **Geographic Scope** | Local, Regional, National, Global |
| **Growth Expectation** | Stable, Moderate, Rapid scaling |
| **Peak Traffic** | Steady, Time-based peaks, Spikes |

### Why It Matters

| Scale | Architectural Impact |
|-------|---------------------|
| **Small** | Monolith is fine; simple deployment |
| **Medium** | Need load balancing; consider caching |
| **Large** | Microservices beneficial; CDN essential |
| **Enterprise** | Multi-region; complex caching; message queues |

### Decisions Influenced

| Decision Area | How Scale Affects It |
|---------------|---------------------|
| **Architecture** | Small → Monolith; Large → Microservices/Serverless |
| **Database** | Small → Single instance; Large → Read replicas, sharding |
| **Hosting** | Small → Shared/serverless; Large → Kubernetes |
| **Caching** | Medium+ → Redis/Memcached essential |
| **CDN** | Medium+ → CloudFront/Cloudflare |

---

## Question 4: Real-Time Needs

### Question
> **Does your app require real-time features?**

### Options

| Feature | Description | Examples |
|---------|-------------|----------|
| **None** | Standard request/response | Blog, portfolio |
| **Notifications** | Push updates to users | Order status |
| **Live Updates** | Real-time data refresh | Dashboards |
| **Chat** | Two-way communication | Support, messaging |
| **Collaboration** | Multi-user editing | Docs, whiteboards |
| **Streaming** | Live audio/video | Video calls |

### Decisions Influenced

| Decision Area | How Real-Time Affects It |
|---------------|-------------------------|
| **Backend** | Need WebSocket support; event-driven |
| **Database** | Real-time databases (Supabase, Firebase) |
| **Services** | Pusher, Ably, Socket.io |
| **Cost** | Real-time increases hosting costs |

---

## Question 5: Authentication Needs

### Question
> **What authentication methods does your app require?**

### Options

| Method | Complexity |
|--------|------------|
| **None** | None |
| **Email/Password** | Low |
| **Magic Link** | Low |
| **Social OAuth** | Medium |
| **Phone/SMS** | Medium |
| **SSO/SAML** | High |
| **2FA/MFA** | Medium |
| **Biometric** | Medium |

### Decisions Influenced

| Decision Area | How Auth Affects It |
|---------------|---------------------|
| **Auth Provider** | None → Skip; Basic → Clerk/Auth0; SSO → Enterprise |
| **Database** | Need user tables, session storage |
| **Security** | Token handling, refresh logic |

---

## Question 6: Data Sensitivity

### Question
> **How sensitive is the data your app handles?**

### Options

| Level | Description | Examples |
|-------|-------------|----------|
| **Public** | No sensitive data | Blog |
| **Personal** | Basic user info | Profiles |
| **Private** | Confidential data | Messages |
| **Financial** | Payment/banking | Transactions |
| **Health** | Medical info | Patient records |
| **Regulated** | Legal/Gov data | Compliance data |

### Decisions Influenced

| Decision Area | How Sensitivity Affects It |
|---------------|---------------------------|
| **Database** | Encryption at rest; field encryption |
| **Hosting** | Compliant providers (GovCloud) |
| **Logging** | Audit trails; sanitize logs |
| **Backup** | Encrypted backups; retention rules |

---

## Output: Structured Intent Object

This JSON object is generated from the questionnaire responses:

```json
{
  "appType": {
    "primary": "fintech",
    "secondary": ["payments"],
    "confidence": 0.95
  },
  "platform": {
    "primary": "web+mobile",
    "web": true,
    "mobile": { "ios": true, "android": true },
    "pwa": false
  },
  "scale": {
    "tier": "medium",
    "expectedUsers": "10k-100k",
    "geography": "national"
  },
  "realtime": {
    "required": true,
    "features": ["notifications", "live-updates"]
  },
  "authentication": {
    "required": true,
    "methods": ["email", "google", "2fa"]
  },
  "dataSensitivity": {
    "level": "financial",
    "compliance": ["pci-dss", "gdpr"]
  }
}
```

---

<p align="center">
  <strong>Wireframe</strong> - App Intent Questionnaire
</p>
