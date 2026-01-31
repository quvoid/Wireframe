# 🔗 DOM & Component Mapping Guide

This document explains how Wireframe components map to DOM elements and frontend framework components, including properties, events, and navigation behavior.

---

## Overview

Every wireframe component corresponds to real HTML elements and framework-specific components. This mapping enables:
- **Code generation** from wireframes
- **Accessibility compliance** via semantic HTML
- **Developer handoff** with clear component specifications

```
┌─────────────────────────────────────────────────────────────────┐
│  Wireframe Component                                            │
│  ┌─────────────────────────────────────────────────────────┐   │
│  │  Button: "Sign In"                                       │   │
│  └─────────────────────────────────────────────────────────┘   │
│                            │                                    │
│                            ▼                                    │
│  ┌─────────────────────────────────────────────────────────┐   │
│  │  HTML: <button type="submit">Sign In</button>            │   │
│  │  React: <Button variant="primary">Sign In</Button>       │   │
│  │  Vue: <BaseButton variant="primary">Sign In</BaseButton> │   │
│  └─────────────────────────────────────────────────────────┘   │
└─────────────────────────────────────────────────────────────────┘
```

---

## Component Mappings

### 1. Button

#### HTML Equivalent
```html
<!-- Primary Button -->
<button type="button" class="btn btn-primary">
  Click Me
</button>

<!-- Submit Button -->
<button type="submit" class="btn btn-primary">
  Submit
</button>

<!-- Link Button -->
<a href="/next-page" class="btn btn-secondary" role="button">
  Go to Page
</a>
```

#### Framework Components

| Framework | Component | Import |
|-----------|-----------|--------|
| React | `<Button />` | `import { Button } from '@/components/ui/button'` |
| Vue | `<BaseButton />` | `import BaseButton from '@/components/BaseButton.vue'` |
| Angular | `<app-button>` | `import { ButtonComponent }` |
| Svelte | `<Button />` | `import Button from '$lib/Button.svelte'` |

#### Common Properties

| Wireframe Property | HTML Attribute | React Prop | Description |
|--------------------|----------------|------------|-------------|
| `text` | Inner text | `children` | Button label |
| `variant` | `class` | `variant` | Visual style (primary, secondary, outline, ghost, danger) |
| `size` | `class` | `size` | Dimensions (small, medium, large) |
| `disabled` | `disabled` | `disabled` | Interaction state |
| `loading` | `aria-busy` | `loading` | Loading indicator |
| `icon` | N/A | `icon` | Icon component |
| `iconPosition` | N/A | `iconPosition` | Left or right of text |
| `fullWidth` | `class` | `fullWidth` | Spans container width |

#### Events

| Wireframe Event | DOM Event | React Handler | Vue Handler | Description |
|-----------------|-----------|---------------|-------------|-------------|
| `onClick` | `click` | `onClick` | `@click` | Primary interaction |
| `onHover` | `mouseenter` | `onMouseEnter` | `@mouseenter` | Hover state |
| `onFocus` | `focus` | `onFocus` | `@focus` | Keyboard focus |
| `onBlur` | `blur` | `onBlur` | `@blur` | Focus lost |

#### Navigation Behavior

When a button has a navigation action:

```javascript
// Wireframe Data
{
  "type": "button",
  "interactions": {
    "onClick": {
      "action": "navigate",
      "targetScreenId": "screen_dashboard"
    }
  }
}

// Generated React Code
import { useRouter } from 'next/navigation';

function LoginButton() {
  const router = useRouter();
  
  return (
    <Button onClick={() => router.push('/dashboard')}>
      Sign In
    </Button>
  );
}

// Generated Vue Code
<template>
  <BaseButton @click="$router.push('/dashboard')">
    Sign In
  </BaseButton>
</template>
```

---

### 2. Text Input

#### HTML Equivalent
```html
<!-- Basic Text Input -->
<div class="form-group">
  <label for="email">Email</label>
  <input 
    type="email" 
    id="email" 
    name="email"
    placeholder="you@example.com"
    class="form-control"
    required
  />
  <span class="helper-text">We'll never share your email</span>
</div>

<!-- Password Input -->
<div class="form-group">
  <label for="password">Password</label>
  <input 
    type="password" 
    id="password" 
    name="password"
    class="form-control"
    minlength="8"
  />
</div>
```

#### Framework Components

| Framework | Component | Import |
|-----------|-----------|--------|
| React | `<TextField />` | `import { TextField } from '@/components/ui/textfield'` |
| Vue | `<TextInput />` | `import TextInput from '@/components/TextInput.vue'` |
| Angular | `<mat-form-field>` | `import { MatInputModule }` |
| Svelte | `<Input />` | `import Input from '$lib/Input.svelte'` |

#### Common Properties

| Wireframe Property | HTML Attribute | React Prop | Description |
|--------------------|----------------|------------|-------------|
| `label` | `<label>` text | `label` | Field label |
| `placeholder` | `placeholder` | `placeholder` | Hint text |
| `value` | `value` | `value` | Current value |
| `inputType` | `type` | `type` | text, email, password, number, tel, url |
| `required` | `required` | `required` | Validation |
| `disabled` | `disabled` | `disabled` | Interaction state |
| `error` | `aria-invalid` | `error` | Error message |
| `helperText` | N/A | `helperText` | Guidance text |
| `maxLength` | `maxlength` | `maxLength` | Character limit |
| `prefix` | N/A | `prefix` | Before input (e.g., "$") |
| `suffix` | N/A | `suffix` | After input (e.g., ".com") |

#### Events

| Wireframe Event | DOM Event | React Handler | Vue Handler | Description |
|-----------------|-----------|---------------|-------------|-------------|
| `onChange` | `input` | `onChange` | `@input` / `v-model` | Value changed |
| `onFocus` | `focus` | `onFocus` | `@focus` | Field focused |
| `onBlur` | `blur` | `onBlur` | `@blur` | Field unfocused |
| `onSubmit` | `keydown.enter` | `onKeyDown` | `@keydown.enter` | Enter pressed |

#### Navigation Behavior

Inputs typically don't navigate directly, but can trigger navigation on form submit:

```javascript
// Wireframe Data
{
  "type": "form",
  "children": [
    { "type": "textInput", "properties": { "inputType": "email" } },
    { "type": "textInput", "properties": { "inputType": "password" } },
    { 
      "type": "button",
      "interactions": {
        "onClick": {
          "action": "submit",
          "onSuccess": { "action": "navigate", "targetScreenId": "screen_dashboard" }
        }
      }
    }
  ]
}

// Generated React Code
function LoginForm() {
  const router = useRouter();

  const handleSubmit = async (e) => {
    e.preventDefault();
    const result = await login(formData);
    if (result.success) {
      router.push('/dashboard');
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <TextField type="email" label="Email" onChange={...} />
      <TextField type="password" label="Password" onChange={...} />
      <Button type="submit">Sign In</Button>
    </form>
  );
}
```

---

### 3. Card

#### HTML Equivalent
```html
<article class="card">
  <img src="product.jpg" alt="Product" class="card-image" />
  <div class="card-body">
    <h3 class="card-title">Product Name</h3>
    <p class="card-subtitle">$99.00</p>
    <p class="card-content">
      Product description goes here with details.
    </p>
    <div class="card-actions">
      <button class="btn btn-primary">Add to Cart</button>
      <button class="btn btn-outline">View Details</button>
    </div>
  </div>
</article>
```

#### Framework Components

| Framework | Component | Import |
|-----------|-----------|--------|
| React | `<Card />` | `import { Card, CardHeader, CardContent } from '@/components/ui/card'` |
| Vue | `<CardComponent />` | `import Card from '@/components/Card.vue'` |
| Angular | `<mat-card>` | `import { MatCardModule }` |
| Svelte | `<Card />` | `import Card from '$lib/Card.svelte'` |

#### Common Properties

| Wireframe Property | HTML Attribute | React Prop | Description |
|--------------------|----------------|------------|-------------|
| `title` | `<h3>` text | `title` | Card heading |
| `subtitle` | `<p>` text | `subtitle` | Secondary heading |
| `content` | `<p>` text | `children` | Body content |
| `image` | `<img src>` | `image` | Header image URL |
| `imagePosition` | N/A | `imagePosition` | top, left, right, background |
| `actions` | `<div>` buttons | `actions` | Action buttons array |
| `elevated` | `class` | `elevated` | Shadow effect |
| `clickable` | `role="button"` | `clickable` | Entire card is interactive |

#### Events

| Wireframe Event | DOM Event | React Handler | Vue Handler | Description |
|-----------------|-----------|---------------|-------------|-------------|
| `onClick` | `click` | `onClick` | `@click` | Card clicked (if clickable) |
| `onHover` | `mouseenter` | `onMouseEnter` | `@mouseenter` | Mouse over card |

#### Navigation Behavior

Cards often navigate to detail pages:

```javascript
// Wireframe Data
{
  "type": "card",
  "properties": {
    "title": "Product Name",
    "clickable": true
  },
  "interactions": {
    "onClick": {
      "action": "navigate",
      "targetScreenId": "screen_product_detail",
      "params": { "productId": "{{id}}" }
    }
  }
}

// Generated React Code
function ProductCard({ product }) {
  const router = useRouter();

  return (
    <Card 
      onClick={() => router.push(`/products/${product.id}`)}
      className="cursor-pointer hover:shadow-lg transition"
    >
      <CardHeader>
        <img src={product.image} alt={product.name} />
      </CardHeader>
      <CardContent>
        <h3>{product.name}</h3>
        <p>${product.price}</p>
      </CardContent>
    </Card>
  );
}
```

---

### 4. Navbar

#### HTML Equivalent
```html
<nav class="navbar" role="navigation" aria-label="Main navigation">
  <div class="navbar-brand">
    <a href="/" class="navbar-logo">
      <img src="logo.svg" alt="Logo" />
    </a>
    <span class="navbar-title">App Name</span>
  </div>
  
  <button class="navbar-back" aria-label="Go back">
    <svg><!-- Back icon --></svg>
  </button>
  
  <div class="navbar-actions">
    <button class="navbar-action" aria-label="Search">
      <svg><!-- Search icon --></svg>
    </button>
    <button class="navbar-action" aria-label="Menu">
      <svg><!-- Menu icon --></svg>
    </button>
  </div>
</nav>
```

#### Framework Components

| Framework | Component | Import |
|-----------|-----------|--------|
| React | `<Navbar />` | `import { Navbar } from '@/components/ui/navbar'` |
| Vue | `<NavBar />` | `import NavBar from '@/components/NavBar.vue'` |
| Angular | `<mat-toolbar>` | `import { MatToolbarModule }` |
| Svelte | `<Navbar />` | `import Navbar from '$lib/Navbar.svelte'` |

#### Common Properties

| Wireframe Property | HTML Attribute | React Prop | Description |
|--------------------|----------------|------------|-------------|
| `title` | `<span>` text | `title` | Page/app title |
| `showBackButton` | N/A | `showBack` | Display back arrow |
| `leftAction` | `<button>` | `leftAction` | Left icon/action |
| `rightActions` | `<button[]>` | `rightActions` | Right icons/actions |
| `transparent` | `class` | `transparent` | See-through background |
| `sticky` | `position: sticky` | `sticky` | Sticks to top on scroll |
| `elevated` | `class` | `elevated` | Drop shadow |

#### Events

| Wireframe Event | DOM Event | React Handler | Vue Handler | Description |
|-----------------|-----------|---------------|-------------|-------------|
| `onBackClick` | `click` | `onBack` | `@back` | Back button pressed |
| `onTitleClick` | `click` | `onTitleClick` | `@title-click` | Title tapped |
| `onActionClick` | `click` | `onAction` | `@action` | Action button pressed |

#### Navigation Behavior

Navbar back buttons use browser/router history:

```javascript
// Wireframe Data
{
  "type": "navbar",
  "properties": {
    "title": "Product Details",
    "showBackButton": true
  },
  "interactions": {
    "onBackClick": {
      "action": "back"
    },
    "rightActions": [
      {
        "icon": "share",
        "action": "modal",
        "targetScreenId": "screen_share_modal"
      }
    ]
  }
}

// Generated React Code
function ProductNavbar() {
  const router = useRouter();

  return (
    <Navbar
      title="Product Details"
      onBack={() => router.back()}
      rightActions={[
        { icon: <ShareIcon />, onClick: () => setShareModalOpen(true) }
      ]}
    />
  );
}
```

---

## Navigation Arrow → Routing Logic

### Conceptual Flow

```
┌─────────────────┐                    ┌─────────────────┐
│   Login Screen  │                    │    Dashboard    │
│                 │   Navigation       │                 │
│  ┌───────────┐  │      Arrow         │                 │
│  │  Button   │══════════════════════▶│                 │
│  └───────────┘  │                    │                 │
└─────────────────┘                    └─────────────────┘
        │                                      │
        │                                      │
        ▼                                      ▼
   /login (route)                    /dashboard (route)
```

### Arrow Data Structure

```json
{
  "id": "nav_001",
  "source": {
    "screenId": "screen_login",
    "componentId": "comp_login_btn"
  },
  "target": {
    "screenId": "screen_dashboard"
  },
  "action": {
    "type": "tap",
    "condition": null
  },
  "transition": {
    "type": "push",
    "direction": "left"
  }
}
```

### Translation to Routing Logic

#### Step 1: Screen → Route Mapping

| Screen ID | Screen Name | Generated Route |
|-----------|-------------|-----------------|
| `screen_login` | Login | `/login` |
| `screen_signup` | Sign Up | `/signup` |
| `screen_dashboard` | Dashboard | `/dashboard` |
| `screen_product_detail` | Product Detail | `/products/[id]` |
| `screen_settings` | Settings | `/settings` |

#### Step 2: Action Type → Router Method

| Action Type | React Router | Next.js | Vue Router |
|-------------|--------------|---------|------------|
| `tap` (push) | `navigate('/path')` | `router.push('/path')` | `$router.push('/path')` |
| `back` | `navigate(-1)` | `router.back()` | `$router.back()` |
| `replace` | `navigate('/path', { replace: true })` | `router.replace('/path')` | `$router.replace('/path')` |
| `modal` | State-based | State-based | State-based |

#### Step 3: Generated Route Configuration

```javascript
// Next.js App Router Structure
app/
├── (auth)/
│   ├── login/
│   │   └── page.tsx      // screen_login
│   └── signup/
│       └── page.tsx      // screen_signup
├── dashboard/
│   └── page.tsx          // screen_dashboard
├── products/
│   └── [id]/
│       └── page.tsx      // screen_product_detail
└── settings/
    └── page.tsx          // screen_settings
```

#### Step 4: Generated Navigation Code

```javascript
// routes.config.js (generated from wireframe)
export const routes = {
  login: '/login',
  signup: '/signup',
  dashboard: '/dashboard',
  productDetail: (id) => `/products/${id}`,
  settings: '/settings',
};

// Navigation hook (generated)
import { useRouter } from 'next/navigation';
import { routes } from '@/config/routes';

export function useNavigation() {
  const router = useRouter();

  return {
    goToLogin: () => router.push(routes.login),
    goToDashboard: () => router.push(routes.dashboard),
    goToProduct: (id) => router.push(routes.productDetail(id)),
    goBack: () => router.back(),
    replace: (path) => router.replace(path),
  };
}
```

### Conditional Navigation

When arrows have conditions:

```json
{
  "action": {
    "type": "tap",
    "condition": {
      "type": "auth",
      "operator": "isAuthenticated",
      "onTrue": { "targetScreenId": "screen_dashboard" },
      "onFalse": { "targetScreenId": "screen_login" }
    }
  }
}
```

Translates to:

```javascript
function ProtectedButton({ targetRoute }) {
  const { isAuthenticated } = useAuth();
  const router = useRouter();

  const handleClick = () => {
    if (isAuthenticated) {
      router.push('/dashboard');
    } else {
      router.push('/login');
    }
  };

  return <Button onClick={handleClick}>Continue</Button>;
}
```

---

## Complete Mapping Reference

| Wireframe Component | HTML Element | Semantic Role | React | Vue |
|---------------------|--------------|---------------|-------|-----|
| `button` | `<button>` | button | `<Button />` | `<BaseButton />` |
| `textInput` | `<input>` | textbox | `<TextField />` | `<TextInput />` |
| `textArea` | `<textarea>` | textbox | `<TextArea />` | `<TextArea />` |
| `checkbox` | `<input type="checkbox">` | checkbox | `<Checkbox />` | `<Checkbox />` |
| `radio` | `<input type="radio">` | radio | `<RadioGroup />` | `<RadioGroup />` |
| `toggle` | `<input type="checkbox">` | switch | `<Switch />` | `<Toggle />` |
| `dropdown` | `<select>` | listbox | `<Select />` | `<Dropdown />` |
| `card` | `<article>` | article | `<Card />` | `<Card />` |
| `navbar` | `<nav>` | navigation | `<Navbar />` | `<NavBar />` |
| `tabBar` | `<nav>` | tablist | `<TabBar />` | `<TabBar />` |
| `list` | `<ul>` / `<ol>` | list | `<List />` | `<List />` |
| `image` | `<img>` | img | `<Image />` | `<AppImage />` |
| `modal` | `<dialog>` | dialog | `<Modal />` | `<Modal />` |
| `text` | `<p>` | paragraph | `<Text />` | `<Text />` |
| `heading` | `<h1>`-`<h6>` | heading | `<Heading />` | `<Heading />` |

---

<p align="center">
  <strong>Wireframe</strong> - DOM Mapping Guide
</p>
