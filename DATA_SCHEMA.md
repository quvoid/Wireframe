# 📐 Wireframe Data Schema

This document defines the complete internal data schema for the Wireframe application. All data is represented as JSON structures designed to support UI reconstruction, DOM mapping, and AI-powered recommendations.

---

## Schema Overview

```
┌─────────────────────────────────────────────────────────────────┐
│                         PROJECT                                 │
├─────────────────────────────────────────────────────────────────┤
│  ┌─────────────┐  ┌─────────────┐  ┌─────────────┐             │
│  │   Screen    │  │   Screen    │  │   Screen    │  ...        │
│  │  ┌───────┐  │  │  ┌───────┐  │  │  ┌───────┐  │             │
│  │  │ Comp  │  │  │  │ Comp  │  │  │  │ Comp  │  │             │
│  │  └───────┘  │  │  └───────┘  │  │  └───────┘  │             │
│  │  ┌───────┐  │  │  ┌───────┐  │  │             │             │
│  │  │ Comp  │  │  │  │ Comp  │  │  │             │             │
│  │  └───────┘  │  │  └───────┘  │  │             │             │
│  └─────────────┘  └─────────────┘  └─────────────┘             │
│         │                │                │                     │
│         └───── Navigation Links ─────────┘                     │
│                                                                 │
│  ┌─────────────────────────────────────────────────────────┐   │
│  │                    App Intent                            │   │
│  └─────────────────────────────────────────────────────────┘   │
│                                                                 │
│  ┌─────────────────────────────────────────────────────────┐   │
│  │                    Metadata                              │   │
│  └─────────────────────────────────────────────────────────┘   │
└─────────────────────────────────────────────────────────────────┘
```

---

## 1. Project Schema

The root container for all wireframe data.

```json
{
  "id": "proj_8f3a2b1c",
  "name": "My E-Commerce App",
  "description": "Mobile shopping application for fashion retail",
  "version": "1.0.0",
  "schemaVersion": "1.0",
  
  "screens": [],
  "navigationLinks": [],
  "appIntent": {},
  
  "settings": {
    "defaultDevicePreset": "iphone-14-pro",
    "gridSize": 8,
    "snapToGrid": true,
    "showGrid": true,
    "theme": "light"
  },
  
  "metadata": {
    "createdAt": "2026-02-01T00:00:00Z",
    "updatedAt": "2026-02-01T01:00:00Z",
    "createdBy": "user_abc123",
    "lastEditedBy": "user_abc123",
    "tags": ["e-commerce", "mobile", "fashion"]
  },
  
  "exportHistory": [
    {
      "exportedAt": "2026-02-01T01:30:00Z",
      "format": "json",
      "version": "1.0.0"
    }
  ]
}
```

### Project Fields

| Field | Type | Description |
|-------|------|-------------|
| `id` | string | Unique project identifier |
| `name` | string | Human-readable project name |
| `description` | string | Project description |
| `version` | string | Project version (semver) |
| `schemaVersion` | string | Data schema version for migrations |
| `screens` | array | Collection of Screen objects |
| `navigationLinks` | array | Collection of NavigationLink objects |
| `appIntent` | object | User's application intent/context |
| `settings` | object | Project-wide settings |
| `metadata` | object | Timestamps and authorship |
| `exportHistory` | array | Record of exports |

---

## 2. Screen Schema

Represents a single screen/page in the wireframe.

```json
{
  "id": "screen_a1b2c3d4",
  "name": "Login Screen",
  "slug": "login",
  
  "device": {
    "preset": "iphone-14-pro",
    "type": "mobile",
    "orientation": "portrait",
    "dimensions": {
      "width": 393,
      "height": 852
    }
  },
  
  "canvas": {
    "background": {
      "type": "solid",
      "color": "#FFFFFF"
    },
    "padding": {
      "top": 0,
      "right": 0,
      "bottom": 0,
      "left": 0
    }
  },
  
  "components": [],
  
  "layout": {
    "type": "absolute",
    "guides": [
      { "type": "vertical", "position": 196 },
      { "type": "horizontal", "position": 426 }
    ]
  },
  
  "metadata": {
    "order": 0,
    "isStartScreen": true,
    "createdAt": "2026-02-01T00:00:00Z",
    "updatedAt": "2026-02-01T01:00:00Z",
    "notes": "Initial login screen with email/password auth"
  }
}
```

### Device Presets Reference

| Preset ID | Type | Dimensions | Description |
|-----------|------|------------|-------------|
| `iphone-se` | mobile | 375×667 | iPhone SE |
| `iphone-14` | mobile | 390×844 | iPhone 14 |
| `iphone-14-pro` | mobile | 393×852 | iPhone 14 Pro |
| `iphone-14-pro-max` | mobile | 430×932 | iPhone 14 Pro Max |
| `android-small` | mobile | 360×640 | Android compact |
| `android-standard` | mobile | 360×800 | Android standard |
| `android-large` | mobile | 412×915 | Android large |
| `ipad` | tablet | 768×1024 | iPad |
| `ipad-pro-11` | tablet | 834×1194 | iPad Pro 11" |
| `ipad-pro-13` | tablet | 1024×1366 | iPad Pro 12.9" |
| `android-tablet` | tablet | 800×1280 | Android tablet |
| `desktop-hd` | web | 1280×720 | Desktop HD |
| `desktop-fhd` | web | 1920×1080 | Desktop Full HD |
| `laptop` | web | 1366×768 | Laptop |
| `custom` | custom | user-defined | Custom dimensions |

---

## 3. Component Schema

Represents a UI component placed on a screen.

```json
{
  "id": "comp_x1y2z3w4",
  "type": "button",
  "name": "Login Button",
  
  "position": {
    "x": 50,
    "y": 720,
    "zIndex": 10
  },
  
  "size": {
    "width": 293,
    "height": 48,
    "minWidth": 80,
    "minHeight": 32,
    "maxWidth": null,
    "maxHeight": null
  },
  
  "transform": {
    "rotation": 0,
    "scaleX": 1,
    "scaleY": 1,
    "opacity": 1
  },
  
  "properties": {
    "text": "Sign In",
    "variant": "primary",
    "size": "large",
    "disabled": false,
    "loading": false,
    "icon": null,
    "iconPosition": "left"
  },
  
  "style": {
    "backgroundColor": "#007AFF",
    "textColor": "#FFFFFF",
    "borderRadius": 8,
    "borderWidth": 0,
    "borderColor": null,
    "shadow": "medium"
  },
  
  "domMapping": {
    "element": "button",
    "semanticRole": "button",
    "attributes": {
      "type": "submit",
      "aria-label": "Sign in to your account"
    },
    "cssClasses": ["btn", "btn-primary", "btn-lg"],
    "reactComponent": "Button",
    "vueComponent": "BaseButton"
  },
  
  "interactions": {
    "onClick": {
      "action": "navigate",
      "targetScreenId": "screen_d4e5f6g7"
    },
    "onHover": null,
    "onFocus": null
  },
  
  "constraints": {
    "locked": false,
    "hidden": false,
    "responsive": {
      "mode": "fixed",
      "anchor": "center"
    }
  },
  
  "parentId": "comp_form123",
  "children": [],
  
  "metadata": {
    "createdAt": "2026-02-01T00:00:00Z",
    "updatedAt": "2026-02-01T01:00:00Z",
    "notes": ""
  }
}
```

### Component Types Catalog

```json
{
  "componentTypes": {
    "navigation": [
      "navbar",
      "tabBar",
      "sidebar",
      "breadcrumb",
      "pagination"
    ],
    "layout": [
      "container",
      "card",
      "section",
      "divider",
      "spacer",
      "grid",
      "stack"
    ],
    "input": [
      "textInput",
      "textArea",
      "button",
      "checkbox",
      "radio",
      "toggle",
      "dropdown",
      "slider",
      "datePicker",
      "fileUpload",
      "searchBar"
    ],
    "display": [
      "text",
      "heading",
      "paragraph",
      "image",
      "avatar",
      "icon",
      "badge",
      "tag",
      "list",
      "table"
    ],
    "feedback": [
      "modal",
      "toast",
      "alert",
      "tooltip",
      "loader",
      "progressBar",
      "skeleton"
    ],
    "media": [
      "imageGallery",
      "videoPlayer",
      "audioPlayer",
      "carousel",
      "map"
    ]
  }
}
```

### Component Properties by Type

#### Button
```json
{
  "type": "button",
  "properties": {
    "text": "string",
    "variant": "primary | secondary | outline | ghost | danger",
    "size": "small | medium | large",
    "disabled": "boolean",
    "loading": "boolean",
    "icon": "string | null",
    "iconPosition": "left | right",
    "fullWidth": "boolean"
  }
}
```

#### Text Input
```json
{
  "type": "textInput",
  "properties": {
    "label": "string",
    "placeholder": "string",
    "value": "string",
    "inputType": "text | email | password | number | tel | url",
    "required": "boolean",
    "disabled": "boolean",
    "error": "string | null",
    "helperText": "string | null",
    "maxLength": "number | null",
    "prefix": "string | null",
    "suffix": "string | null"
  }
}
```

#### Card
```json
{
  "type": "card",
  "properties": {
    "title": "string | null",
    "subtitle": "string | null",
    "image": "string | null",
    "imagePosition": "top | left | right | background",
    "actions": "array",
    "elevated": "boolean",
    "clickable": "boolean"
  }
}
```

#### Navbar
```json
{
  "type": "navbar",
  "properties": {
    "title": "string",
    "showBackButton": "boolean",
    "leftAction": "object | null",
    "rightActions": "array",
    "transparent": "boolean",
    "sticky": "boolean"
  }
}
```

---

## 4. Navigation Links Schema

Represents connections between screens via components.

```json
{
  "id": "nav_m1n2o3p4",
  
  "source": {
    "screenId": "screen_a1b2c3d4",
    "componentId": "comp_x1y2z3w4",
    "anchor": "right"
  },
  
  "target": {
    "screenId": "screen_d4e5f6g7",
    "anchor": "left"
  },
  
  "action": {
    "type": "tap",
    "gesture": null,
    "condition": null
  },
  
  "transition": {
    "type": "push",
    "direction": "left",
    "duration": 300,
    "easing": "ease-in-out"
  },
  
  "visual": {
    "pathType": "curved",
    "color": "#007AFF",
    "strokeWidth": 2,
    "dashPattern": null,
    "label": null,
    "labelPosition": "middle"
  },
  
  "metadata": {
    "createdAt": "2026-02-01T00:00:00Z",
    "notes": "User taps login to go to dashboard"
  }
}
```

### Action Types

| Type | Description | Use Case |
|------|-------------|----------|
| `tap` | Single tap/click | Button clicks, link taps |
| `doubleTap` | Double tap | Quick actions, zoom |
| `longPress` | Press and hold | Context menus |
| `swipe` | Swipe gesture | Navigation, dismissal |
| `drag` | Drag gesture | Reordering, moving |
| `conditional` | Logic-based | Form validation, auth state |
| `timer` | Auto-navigate | Splash screens, slideshows |

### Transition Types

| Type | Description |
|------|-------------|
| `push` | Slide in from direction |
| `pop` | Slide out to direction |
| `modal` | Slide up as overlay |
| `fade` | Cross-fade |
| `none` | Instant switch |
| `custom` | User-defined animation |

---

## 5. App Intent Schema

Captures user's description of their application for AI recommendations.

```json
{
  "appType": {
    "primary": "e-commerce",
    "secondary": ["marketplace", "retail"],
    "description": "A mobile shopping app for boutique fashion brands"
  },
  
  "platform": {
    "primary": "mobile",
    "targets": ["ios", "android"],
    "responsive": true,
    "pwa": false
  },
  
  "scale": {
    "expectedUsers": "10k-100k",
    "geography": "national",
    "concurrentUsers": "1k-5k",
    "growthExpectation": "high"
  },
  
  "userTypes": {
    "model": "B2C",
    "roles": [
      {
        "name": "customer",
        "description": "End user shopping for products",
        "primary": true
      },
      {
        "name": "vendor",
        "description": "Brand selling products",
        "primary": false
      }
    ]
  },
  
  "features": {
    "authentication": {
      "required": true,
      "methods": ["email", "google", "apple"],
      "twoFactor": false,
      "sso": false
    },
    "payments": {
      "required": true,
      "type": "one-time",
      "providers": ["stripe"],
      "currencies": ["USD", "EUR"]
    },
    "realtime": {
      "required": true,
      "features": ["notifications", "order-tracking"]
    },
    "media": {
      "required": true,
      "types": ["images"],
      "userUpload": false,
      "cdn": true
    },
    "search": {
      "required": true,
      "type": "full-text",
      "filters": true,
      "suggestions": true
    },
    "offline": {
      "required": false
    },
    "analytics": {
      "required": true,
      "tracking": ["pageviews", "events", "conversions"]
    },
    "localization": {
      "required": true,
      "languages": ["en", "es", "fr"]
    }
  },
  
  "technical": {
    "teamExpertise": ["frontend", "backend"],
    "preferredLanguages": ["typescript", "python"],
    "existingInfrastructure": [],
    "budget": "startup",
    "timeline": "mvp"
  },
  
  "constraints": {
    "compliance": ["gdpr"],
    "hosting": "cloud",
    "vendor": "no-preference"
  },
  
  "metadata": {
    "completedAt": "2026-02-01T01:00:00Z",
    "confidence": 0.85
  }
}
```

### App Type Categories

```json
{
  "appTypes": {
    "e-commerce": ["marketplace", "retail", "subscription-box", "digital-products"],
    "social": ["social-network", "community", "dating", "forum"],
    "saas": ["productivity", "crm", "project-management", "analytics"],
    "content": ["blog", "news", "streaming", "podcast"],
    "fintech": ["banking", "payments", "trading", "crypto"],
    "education": ["lms", "courses", "tutoring", "quiz"],
    "healthcare": ["telemedicine", "fitness", "mental-health", "pharmacy"],
    "logistics": ["delivery", "fleet", "warehouse", "shipping"],
    "iot": ["smart-home", "wearables", "industrial"],
    "gaming": ["casual", "multiplayer", "esports"]
  }
}
```

---

## 6. Metadata Schema

Standard metadata structure used across all entities.

```json
{
  "metadata": {
    "createdAt": "2026-02-01T00:00:00Z",
    "updatedAt": "2026-02-01T01:00:00Z",
    "createdBy": "user_abc123",
    "lastEditedBy": "user_abc123",
    "version": 1,
    "notes": "Optional notes about this entity",
    "tags": ["tag1", "tag2"],
    "custom": {}
  }
}
```

---

## 7. AI Recommendation Output Schema

Structure for AI-generated recommendations.

```json
{
  "id": "rec_r1s2t3u4",
  "projectId": "proj_8f3a2b1c",
  "generatedAt": "2026-02-01T02:00:00Z",
  
  "summary": {
    "title": "E-Commerce Mobile App Architecture",
    "overview": "Recommended stack optimized for mobile-first...",
    "confidence": 0.92
  },
  
  "architecture": {
    "pattern": "serverless",
    "reasoning": "Given the variable traffic patterns and MVP timeline...",
    "alternatives": [
      {
        "pattern": "modular-monolith",
        "reasoning": "If team prefers simpler deployment..."
      }
    ]
  },
  
  "backend": {
    "primary": {
      "framework": "next.js-api-routes",
      "language": "typescript",
      "runtime": "nodejs-20"
    },
    "alternatives": ["fastify", "express", "nestjs"]
  },
  
  "database": {
    "primary": {
      "type": "postgresql",
      "provider": "supabase",
      "reasoning": "Relational data model fits e-commerce..."
    },
    "cache": {
      "type": "redis",
      "provider": "upstash"
    },
    "search": {
      "type": "elasticsearch",
      "provider": "algolia"
    }
  },
  
  "cloud": {
    "hosting": {
      "provider": "vercel",
      "reasoning": "Optimal for Next.js with edge functions..."
    },
    "storage": {
      "provider": "cloudinary",
      "reasoning": "Image optimization for product photos..."
    },
    "cdn": {
      "provider": "cloudflare"
    }
  },
  
  "services": {
    "auth": {
      "provider": "clerk",
      "features": ["social-login", "magic-link"]
    },
    "payments": {
      "provider": "stripe",
      "features": ["checkout", "subscriptions"]
    },
    "email": {
      "provider": "resend"
    },
    "push": {
      "provider": "firebase-fcm"
    }
  },
  
  "frontend": {
    "framework": "next-js-14",
    "styling": "tailwind-css",
    "stateManagement": "zustand",
    "mobile": {
      "approach": "react-native",
      "alternative": "pwa"
    }
  },
  
  "devops": {
    "ci": "github-actions",
    "monitoring": "sentry",
    "logging": "axiom"
  },
  
  "prerequisites": [
    {
      "category": "accounts",
      "items": ["Vercel account", "Supabase project", "Stripe account"]
    },
    {
      "category": "tools",
      "items": ["Node.js 20+", "pnpm", "VS Code"]
    }
  ],
  
  "roadmap": {
    "phase1": {
      "name": "MVP",
      "duration": "4-6 weeks",
      "features": ["Auth", "Product listing", "Basic checkout"]
    },
    "phase2": {
      "name": "V1",
      "duration": "4 weeks",
      "features": ["Search", "Reviews", "Order tracking"]
    }
  },
  
  "estimatedCosts": {
    "monthly": {
      "minimum": 0,
      "expected": 50,
      "maximum": 200
    },
    "breakdown": [
      { "service": "Vercel", "tier": "hobby", "cost": 0 },
      { "service": "Supabase", "tier": "free", "cost": 0 },
      { "service": "Cloudinary", "tier": "free", "cost": 0 }
    ]
  }
}
```

---

## Complete Project Example

A minimal but complete example combining all schemas:

```json
{
  "id": "proj_example",
  "name": "Login Flow Example",
  "version": "1.0.0",
  "schemaVersion": "1.0",
  
  "screens": [
    {
      "id": "screen_login",
      "name": "Login",
      "device": {
        "preset": "iphone-14-pro",
        "type": "mobile",
        "dimensions": { "width": 393, "height": 852 }
      },
      "components": [
        {
          "id": "comp_email",
          "type": "textInput",
          "position": { "x": 20, "y": 200 },
          "size": { "width": 353, "height": 48 },
          "properties": {
            "label": "Email",
            "placeholder": "you@example.com",
            "inputType": "email"
          },
          "domMapping": {
            "element": "input",
            "attributes": { "type": "email" }
          }
        },
        {
          "id": "comp_password",
          "type": "textInput",
          "position": { "x": 20, "y": 280 },
          "size": { "width": 353, "height": 48 },
          "properties": {
            "label": "Password",
            "inputType": "password"
          },
          "domMapping": {
            "element": "input",
            "attributes": { "type": "password" }
          }
        },
        {
          "id": "comp_login_btn",
          "type": "button",
          "position": { "x": 20, "y": 380 },
          "size": { "width": 353, "height": 48 },
          "properties": {
            "text": "Sign In",
            "variant": "primary"
          },
          "domMapping": {
            "element": "button",
            "attributes": { "type": "submit" }
          },
          "interactions": {
            "onClick": {
              "action": "navigate",
              "targetScreenId": "screen_dashboard"
            }
          }
        }
      ]
    },
    {
      "id": "screen_dashboard",
      "name": "Dashboard",
      "device": {
        "preset": "iphone-14-pro",
        "type": "mobile",
        "dimensions": { "width": 393, "height": 852 }
      },
      "components": [
        {
          "id": "comp_navbar",
          "type": "navbar",
          "position": { "x": 0, "y": 0 },
          "size": { "width": 393, "height": 56 },
          "properties": {
            "title": "Dashboard"
          },
          "domMapping": {
            "element": "nav",
            "semanticRole": "navigation"
          }
        }
      ]
    }
  ],
  
  "navigationLinks": [
    {
      "id": "nav_login_to_dash",
      "source": {
        "screenId": "screen_login",
        "componentId": "comp_login_btn"
      },
      "target": {
        "screenId": "screen_dashboard"
      },
      "action": { "type": "tap" },
      "transition": { "type": "push" }
    }
  ],
  
  "appIntent": {
    "appType": { "primary": "saas" },
    "platform": { "primary": "mobile" }
  },
  
  "metadata": {
    "createdAt": "2026-02-01T00:00:00Z"
  }
}
```

---

## Schema Capabilities Summary

| Capability | Supported By |
|------------|--------------|
| **Reconstruct UI** | Screen + Component schemas with position, size, properties |
| **Map DOM Elements** | `domMapping` field on every component |
| **Define Navigation** | NavigationLink schema with source/target/action |
| **Feed AI Engine** | AppIntent schema with app type, features, constraints |
| **Export/Import** | JSON serializable, versioned schema |
| **Version Control** | Metadata with timestamps, version numbers |

---

<p align="center">
  <strong>Wireframe</strong> - Data Schema v1.0
</p>
