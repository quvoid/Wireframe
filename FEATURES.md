# 🎨 Wireframe - Core Features

This document defines the core features of the Wireframe application in detail.

---

## 1. Canvas-Based Wireframe Drawing

### Overview
The canvas is the central workspace where users visually create and arrange wireframe elements. It provides an infinite or bounded drawing surface with zoom, pan, and grid-snapping capabilities.

### Key Capabilities
| Capability | Description |
|------------|-------------|
| **Infinite Canvas** | Zoom in/out and pan across a large drawing area |
| **Grid Snapping** | Elements snap to an invisible grid for alignment |
| **Zoom Controls** | Zoom levels from 25% to 400% with fit-to-screen option |
| **Pan Navigation** | Hold spacebar + drag or use scroll wheel to navigate |
| **Multi-Select** | Click and drag to select multiple elements |
| **Undo/Redo** | Full history stack for all canvas operations |

### Interaction Model
- **Click** - Select element
- **Double-click** - Edit element properties/text
- **Drag** - Move element or create selection box
- **Ctrl+Scroll** - Zoom in/out
- **Spacebar+Drag** - Pan canvas

---

## 2. Device Presets (Mobile, Tablet, Web)

### Overview
Wireframe supports multiple device presets to help users design for different screen sizes. Each preset defines canvas dimensions and display characteristics.

### Available Presets

| Device | Preset Name | Dimensions (px) | Aspect Ratio |
|--------|-------------|-----------------|--------------|
| 📱 Mobile | iPhone SE | 375 × 667 | 9:16 |
| 📱 Mobile | iPhone 14 Pro | 393 × 852 | ~9:19.5 |
| 📱 Mobile | Android Standard | 360 × 800 | 9:20 |
| 📲 Tablet | iPad | 768 × 1024 | 3:4 |
| 📲 Tablet | iPad Pro 12.9" | 1024 × 1366 | 3:4 |
| 📲 Tablet | Android Tablet | 800 × 1280 | 5:8 |
| 🖥️ Web | Desktop HD | 1280 × 720 | 16:9 |
| 🖥️ Web | Desktop Full HD | 1920 × 1080 | 16:9 |
| 🖥️ Web | Laptop | 1366 × 768 | ~16:9 |
| 🖥️ Web | Custom | User-defined | User-defined |

### Preset Behavior
- Selecting a preset immediately resizes the active screen's canvas
- Users can switch presets at any time
- Custom dimensions allow for non-standard layouts
- Each screen in a project can have a different device preset

---

## 3. Screen-to-Screen Navigation Mapping

### Overview
Navigation mapping allows users to define how screens connect to each other, representing user flows and journeys through the application.

### Connection Types

| Type | Visual | Use Case |
|------|--------|----------|
| **Tap/Click** | Solid arrow → | Button clicks, link taps |
| **Swipe** | Curved arrow ↷ | Gesture-based navigation |
| **Conditional** | Dashed arrow ⇢ | Logic-based routing |
| **Modal** | Arrow with box □→ | Overlay/popup screens |
| **Back** | Reverse arrow ← | Return navigation |

### Creating Connections
1. Select a component (e.g., button)
2. Click the "Connect" handle or use keyboard shortcut
3. Drag the arrow to the target screen
4. Connection is established with default "tap" action

### Flow Visualization
- **Flow View Mode** - Zooms out to show all screens with connection lines
- **Highlight Path** - Click a component to highlight all connected screens
- **Orphan Detection** - Screens with no connections are flagged

---

## 4. UI Components Library

### Overview
A comprehensive library of pre-built UI components that users can drag onto the canvas. Components are low-fidelity by design to focus on structure over aesthetics.

### Core Components

#### Navigation & Layout
| Component | Description | Properties |
|-----------|-------------|------------|
| **Navbar** | Top navigation bar | Title, left button, right button, style |
| **Tab Bar** | Bottom tab navigation | Tabs array, active index |
| **Sidebar** | Side navigation menu | Items array, collapsed state |
| **Header** | Section header | Title, subtitle, action |
| **Footer** | Page footer | Links, copyright text |

#### Input Elements
| Component | Description | Properties |
|-----------|-------------|------------|
| **Text Input** | Single-line input field | Label, placeholder, type |
| **Text Area** | Multi-line input | Label, rows, placeholder |
| **Button** | Clickable button | Text, variant, size |
| **Checkbox** | Boolean toggle | Label, checked state |
| **Radio Group** | Single selection | Options array, selected |
| **Dropdown** | Select from options | Options, placeholder |
| **Toggle** | On/off switch | Label, state |

#### Display Elements
| Component | Description | Properties |
|-----------|-------------|------------|
| **Card** | Content container | Title, content, actions |
| **Image** | Image placeholder | Alt text, aspect ratio |
| **Avatar** | User avatar | Size, shape |
| **Badge** | Status indicator | Text, color |
| **List** | List container | Items array, style |
| **Table** | Data table | Columns, rows |

#### Feedback & Overlay
| Component | Description | Properties |
|-----------|-------------|------------|
| **Modal** | Dialog overlay | Title, content, actions |
| **Toast** | Notification | Message, type, duration |
| **Loader** | Loading indicator | Size, style |
| **Progress** | Progress bar | Value, max, label |

### Component Customization
- **Resize** - Drag corner handles
- **Edit Text** - Double-click to edit inline text
- **Properties Panel** - Right sidebar for detailed configuration
- **Copy/Paste** - Duplicate components across screens

---

## 5. DOM/Component Mapping

### Overview
Each wireframe component maps to a corresponding DOM element or framework component structure. This helps developers understand how the visual design translates to code.

### Mapping Approach

| Wireframe Component | DOM Element | React Component | Vue Component |
|---------------------|-------------|-----------------|---------------|
| Navbar | `<nav>` | `<Navbar />` | `<NavBar />` |
| Button | `<button>` | `<Button />` | `<BaseButton />` |
| Text Input | `<input type="text">` | `<TextField />` | `<TextInput />` |
| Card | `<article>` or `<div>` | `<Card />` | `<CardComponent />` |
| Image | `<img>` | `<Image />` | `<AppImage />` |
| List | `<ul>` / `<ol>` | `<List />` | `<ListComponent />` |

### Component Tree View
- **Tree Panel** - Shows hierarchical structure of all components
- **Parent-Child Relationships** - Visualize nesting
- **Accessibility Tags** - Suggested ARIA roles and labels
- **Semantic HTML** - Recommendations for semantic elements

### Export as Component Tree
```
Screen: Login
├── Navbar
│   ├── Logo [img]
│   └── Title [h1]
├── Form [form]
│   ├── Email Input [input:email]
│   ├── Password Input [input:password]
│   └── Submit Button [button:submit]
└── Footer
    └── Links [nav]
```

---

## 6. App Intent Input (Type of App)

### Overview
Users describe what kind of application they're building. This context is essential for the AI to provide relevant architecture recommendations.

### Input Categories

#### 1. Application Type
| Type | Examples |
|------|----------|
| E-commerce | Online store, marketplace |
| Social | Social network, community platform |
| SaaS | B2B tools, productivity apps |
| Content | Blog, news, media streaming |
| Fintech | Banking, payments, trading |
| Education | LMS, course platform, tutoring |
| Healthcare | Telemedicine, health tracking |
| Logistics | Delivery, fleet management |
| IoT | Smart home, device management |

#### 2. Scale & Users
| Question | Options |
|----------|---------|
| Expected users | < 1K, 1K-10K, 10K-100K, 100K-1M, 1M+ |
| Geographic scope | Local, Regional, National, Global |
| User types | B2C, B2B, B2B2C, Internal |

#### 3. Features & Requirements
| Category | Options |
|----------|---------|
| Authentication | Email/password, OAuth, SSO, 2FA, Biometric |
| Real-time | Chat, notifications, live updates |
| Payments | One-time, subscriptions, marketplace |
| Media | Image upload, video, audio, documents |
| Offline | Required, nice-to-have, not needed |

#### 4. Technical Preferences
| Category | Options |
|----------|---------|
| Platform | Web-only, mobile-first, cross-platform, native |
| Team expertise | Frontend, backend, full-stack, DevOps |
| Budget | Bootstrap, startup, enterprise |
| Timeline | MVP (1-3 mo), V1 (3-6 mo), Full (6+ mo) |

---

## 7. AI-Based Tech Stack Recommendations

### Overview
Based on wireframes, navigation flows, and app intent, the AI engine analyzes the requirements and recommends an optimal technology stack.

### Recommendation Categories

#### Backend Architecture
| Pattern | When Recommended |
|---------|------------------|
| **Monolith** | Small teams, MVPs, simple apps |
| **Microservices** | Large scale, multiple teams, complex domains |
| **Serverless** | Event-driven, variable traffic, cost-optimization |
| **Modular Monolith** | Growing apps, future microservices path |

#### Database Solutions
| Type | Options | When Recommended |
|------|---------|------------------|
| **Relational** | PostgreSQL, MySQL | Structured data, transactions, ACID |
| **Document** | MongoDB, Firestore | Flexible schema, rapid iteration |
| **Graph** | Neo4j, Neptune | Social networks, recommendations |
| **Key-Value** | Redis, DynamoDB | Caching, sessions, high-speed reads |
| **Time-Series** | InfluxDB, TimescaleDB | IoT, analytics, monitoring |

#### Cloud Services
| Category | Options |
|----------|---------|
| **Compute** | AWS EC2/Lambda, GCP Cloud Run, Vercel, Railway |
| **Storage** | S3, Cloud Storage, Cloudinary |
| **CDN** | CloudFront, Cloudflare, Fastly |
| **Auth** | Auth0, Firebase Auth, Clerk, Supabase Auth |
| **Messaging** | SQS, Pub/Sub, RabbitMQ |

#### Frontend Frameworks
| Type | Options |
|------|---------|
| **React Ecosystem** | Next.js, Remix, Vite + React |
| **Vue Ecosystem** | Nuxt.js, Vue + Vite |
| **Mobile** | React Native, Flutter, Swift, Kotlin |
| **Full-Stack** | Next.js, Nuxt.js, SvelteKit |

### Recommendation Output Format
```
📊 Architecture Recommendation for [Project Name]

🏗️ Backend
   └── Serverless (AWS Lambda + API Gateway)
   
🗄️ Database
   ├── Primary: PostgreSQL (Supabase)
   └── Cache: Redis (Upstash)
   
☁️ Cloud Services
   ├── Hosting: Vercel
   ├── Storage: Cloudinary
   ├── Auth: Clerk
   └── Email: Resend
   
📱 Frontend
   └── Next.js 14 (App Router)

💡 Reasoning: [AI explanation of why these choices fit]
```

---

## 8. Export Options

### Overview
Export your wireframe project in various formats for development handoff, documentation, or further processing.

### Export Formats

#### 1. JSON Export (Full Project)
Complete project data including all screens, components, navigation, and metadata.
```json
{
  "projectId": "...",
  "screens": [...],
  "navigation": [...],
  "componentTree": {...},
  "metadata": {...}
}
```

#### 2. Component Tree Export
Hierarchical structure of all components across screens.
```json
{
  "screens": [
    {
      "id": "screen-1",
      "name": "Login",
      "components": [
        { "type": "navbar", "children": [...] },
        { "type": "form", "children": [...] }
      ]
    }
  ]
}
```

#### 3. Navigation Flow Export
Just the navigation connections and flow data.
```json
{
  "flows": [
    {
      "from": { "screen": "login", "component": "submit-btn" },
      "to": { "screen": "dashboard" },
      "action": "click"
    }
  ]
}
```

#### 4. Architecture Report (PDF/Markdown)
AI-generated recommendations in a shareable document format.
- Executive summary
- Architecture diagrams
- Technology stack breakdown
- Implementation roadmap
- Cost estimates

#### 5. Image Export (PNG/SVG)
- Individual screen exports
- Full flow diagram
- Presentation-ready visuals

---

## Feature Roadmap

| Phase | Features |
|-------|----------|
| **MVP** | Canvas, components, device presets, basic navigation |
| **V1** | AI recommendations, DOM mapping, JSON export |
| **V2** | Collaboration, version history, templates |
| **V3** | Code generation, integrations, team features |

---

<p align="center">
  <strong>Wireframe</strong> - From Vision to Architecture
</p>
