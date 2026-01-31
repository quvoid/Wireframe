# 🎯 Wireframe Canvas System Design

This document explains the conceptual design of the Wireframe canvas system, including how users interact with screens, components, and navigation flows.

---

## Overview

The canvas is the heart of Wireframe. It's where users visually construct their application's interface by drawing screens, placing components, and connecting navigation flows.

```
┌─────────────────────────────────────────────────────────────────────┐
│  Toolbar                                                            │
├──────────┬──────────────────────────────────────────────────┬───────┤
│          │                                                  │       │
│  Screen  │              CANVAS AREA                         │ Props │
│  Panel   │                                                  │ Panel │
│          │     ┌─────────────┐     ┌─────────────┐         │       │
│  ───────►│     │   Screen    │────▶│   Screen    │         │       │
│          │     │     1       │     │     2       │         │       │
│          │     └─────────────┘     └─────────────┘         │       │
│          │                                                  │       │
│          │                                                  │       │
├──────────┴──────────────────────────────────────────────────┴───────┤
│  Component Library / Status Bar                                     │
└─────────────────────────────────────────────────────────────────────┘
```

---

## How Users Draw Screens

### Creating a New Screen

1. **Quick Add** - Click the "+" button in the Screen Panel or use `Ctrl+N`
2. **Menu Add** - File → New Screen
3. **Duplicate** - Right-click existing screen → Duplicate

### Screen Creation Flow

```
User Action          System Response
─────────────        ───────────────
Click "+ Screen" ──► Prompt for device preset
                         │
Select "iPhone 14" ──────┤
                         ▼
                    Create screen with:
                    - Default name: "Screen [n]"
                    - Preset dimensions: 393×852
                    - Empty component list
                    - Unique screen ID
                         │
                         ▼
                    Screen appears in:
                    - Canvas (centered)
                    - Screen Panel (thumbnail)
```

### Screen Properties

| Property | Description | User Control |
|----------|-------------|--------------|
| Name | Display name | Editable text |
| Device Preset | Template sizing | Dropdown select |
| Width | Pixel width | Number input |
| Height | Pixel height | Number input |
| Background | Fill color | Color picker |
| Status Bar | Show/hide device UI | Toggle |

---

## How Components Are Dragged and Resized

### Adding Components to Canvas

#### Method 1: Drag from Library
```
Component Library          Canvas
┌─────────────────┐       ┌─────────────────┐
│ [Button]        │       │                 │
│ [Input]    ────────────►│    [Button]     │
│ [Card]          │ drag  │                 │
└─────────────────┘       └─────────────────┘
```

#### Method 2: Click-to-Place
1. Click component in library (becomes "armed")
2. Click position on canvas
3. Component placed at click location

#### Method 3: Keyboard Shortcut
| Shortcut | Component |
|----------|-----------|
| `B` | Button |
| `T` | Text Input |
| `C` | Card |
| `N` | Navbar |
| `I` | Image |

### Component Handles & Resizing

When a component is selected, it displays interactive handles:

```
        ●───────────────────●
        │                   │
        │     COMPONENT     │
        │                   │
        ●───────────────────●
        
● = Resize handles (drag to resize)
```

#### Handle Types

| Handle Position | Action | Behavior |
|-----------------|--------|----------|
| Corners (4) | Proportional resize | Maintains aspect ratio with Shift |
| Edges (4) | Directional resize | Stretches in one axis |
| Center | Move | Drags entire component |
| Rotation (top) | Rotate | Rotates component (optional) |

### Resize Constraints

| Constraint | Description |
|------------|-------------|
| **Min Size** | Components have minimum dimensions |
| **Max Size** | Cannot exceed screen boundaries |
| **Snap to Grid** | Sizes snap to 8px grid by default |
| **Aspect Lock** | Hold Shift to maintain ratio |

### Multi-Select Operations

```
Select multiple ──► Drag selection box OR Shift+Click each
       │
       ▼
Align options appear:
┌─────────────────────────────────┐
│ ≡ Left  │ ≡ Center  │ ≡ Right  │
│ ≡ Top   │ ≡ Middle  │ ≡ Bottom │
│ ⟺ Distribute H  │ ⇅ Distribute V │
└─────────────────────────────────┘
```

---

## How Arrows/Links Represent Navigation

### Navigation Concept

Navigation links connect components to screens, defining how users move through the application.

```
┌─────────────────┐                    ┌─────────────────┐
│   Login Screen  │                    │    Dashboard    │
│                 │                    │                 │
│  ┌───────────┐  │   Click Action     │                 │
│  │  Login    │══════════════════════►│                 │
│  │  Button   │  │                    │                 │
│  └───────────┘  │                    │                 │
└─────────────────┘                    └─────────────────┘
```

### Creating Navigation Links

#### Method 1: Component Context Menu
1. Right-click a component (e.g., Button)
2. Select "Link to Screen..."
3. Click target screen
4. Arrow appears connecting them

#### Method 2: Drag Handle
1. Select component
2. A "link" handle (○) appears on the right edge
3. Drag from handle to target screen
4. Release to create link

#### Method 3: Properties Panel
1. Select component
2. In Properties Panel → Navigation section
3. Select target screen from dropdown
4. Choose action type

### Arrow Visualization

| Arrow Style | Meaning | Visual |
|-------------|---------|--------|
| Solid line | Direct navigation | ───────► |
| Dashed line | Conditional | - - - - ► |
| Curved line | Gesture/swipe | ╭─────────╮ |
| Bidirectional | Two-way nav | ◄─────────► |
| With icon | Modal/overlay | ───□───► |

### Arrow Properties

| Property | Options |
|----------|---------|
| Action Type | tap, swipe, long-press, conditional |
| Condition | (for conditional) expression or label |
| Animation | push, modal, fade, slide |
| Label | Optional text on arrow |

### Flow View Mode

A special view mode that:
- Zooms out to show all screens
- Emphasizes navigation arrows
- Dims component details
- Enables flow-focused editing

```
Flow View Toggle: [🔀]

Normal View              Flow View
┌───┐ ┌───┐             ┌───┐───────►┌───┐
│ □ │ │ □ │             │   │        │   │
│ □ │ │ □ │     ──►     │   │◄───────│   │
│ □ │ │ □ │             │   │───────►│   │
└───┘ └───┘             └───┘        └───┘
Full detail             Simplified + arrows
```

---

## How Screens Are Selected and Edited

### Selection States

| State | Visual Indicator | Interaction |
|-------|------------------|-------------|
| Unselected | No border | Click to select |
| Hover | Light highlight | Shows it's interactive |
| Selected | Blue border + handles | Can edit/move |
| Active (editing) | Darker border | Currently editing components |

### Screen Selection Modes

#### Canvas Mode
- Click screen to select
- Double-click to enter and edit components
- Escape to exit screen editing

#### Thumbnail Mode (Screen Panel)
- Single-click to select and focus
- Double-click to rename
- Drag to reorder

### Editing Workflow

```
Canvas (zoomed out)     Screen Selected         Editing Screen
┌───┐ ┌───┐ ┌───┐      ┌─────────────────┐     ┌─────────────────┐
│   │ │   │ │   │      │ ═══════════════ │     │                 │
│   │ │   │ │   │  ──► │ ║   Selected  ║ │ ──► │  [Edit Mode]    │
│   │ │   │ │   │      │ ═══════════════ │     │  Components     │
└───┘ └───┘ └───┘      └─────────────────┘     │  editable here  │
                        Selection border        └─────────────────┘
Click screen           Shows resize handles     Double-click enters
```

### Screen Actions

| Action | Trigger | Result |
|--------|---------|--------|
| Rename | Double-click name | Inline edit |
| Duplicate | `Ctrl+D` or right-click | Creates copy |
| Delete | `Delete` key or right-click | Removes screen |
| Reorder | Drag in panel | Changes sequence |
| Group | Multi-select + Group | Creates screen group |

---

## How Device Presets Change Canvas Size

### Preset Selection Flow

```
┌──────────────────────────────────────────────────────────────┐
│  Device Preset Dropdown                                       │
│  ┌────────────────────────────────────────────────────────┐  │
│  │  📱 Mobile                                    ▼        │  │
│  ├────────────────────────────────────────────────────────┤  │
│  │  📱 iPhone SE (375 × 667)                              │  │
│  │  📱 iPhone 14 Pro (393 × 852)                    ✓     │  │
│  │  📱 Android Standard (360 × 800)                       │  │
│  │  ────────────────────────────────────────────────────  │  │
│  │  📲 iPad (768 × 1024)                                  │  │
│  │  📲 iPad Pro (1024 × 1366)                             │  │
│  │  ────────────────────────────────────────────────────  │  │
│  │  🖥️ Desktop HD (1280 × 720)                            │  │
│  │  🖥️ Full HD (1920 × 1080)                              │  │
│  │  ────────────────────────────────────────────────────  │  │
│  │  ✏️ Custom...                                          │  │
│  └────────────────────────────────────────────────────────┘  │
└──────────────────────────────────────────────────────────────┘
```

### What Happens When Preset Changes

| Step | Action |
|------|--------|
| 1 | User selects new preset |
| 2 | System calculates new dimensions |
| 3 | Screen canvas resizes with animation |
| 4 | Components reflow (if responsive mode enabled) |
| 5 | Out-of-bounds components flagged |
| 6 | Viewport adjusts to fit new size |

### Component Behavior on Resize

| Mode | Behavior |
|------|----------|
| **Fixed** | Components maintain exact position/size (may go out of bounds) |
| **Responsive** | Components scale proportionally |
| **Anchored** | Components maintain distance from specified edge |

### Visual Feedback for Out-of-Bounds

```
┌─────────────────────┐
│                     │
│  Screen Area        │
│                     │
├─────────────────────┼─ ─ ─ ─ ─ ─ ─ ─ ┐
│                     │                 
│   [Button] ⚠️       │  ← Component partially outside
│                     │                 
└─────────────────────┘─ ─ ─ ─ ─ ─ ─ ─ ┘
                        Overflow zone (grayed/hatched)
```

---

## Data Model: Screens and Components

### Screen Object

```json
{
  "id": "screen_a1b2c3",
  "name": "Login Screen",
  "devicePreset": "iphone-14-pro",
  "dimensions": {
    "width": 393,
    "height": 852
  },
  "background": {
    "type": "solid",
    "color": "#FFFFFF"
  },
  "components": [
    { "...component objects..." }
  ],
  "metadata": {
    "createdAt": "2026-02-01T00:00:00Z",
    "updatedAt": "2026-02-01T01:00:00Z",
    "order": 0
  }
}
```

### Component Object

```json
{
  "id": "comp_x1y2z3",
  "type": "button",
  "label": "Login",
  "position": {
    "x": 50,
    "y": 400
  },
  "size": {
    "width": 293,
    "height": 48
  },
  "properties": {
    "variant": "primary",
    "text": "Sign In",
    "disabled": false
  },
  "navigation": {
    "targetScreenId": "screen_d4e5f6",
    "action": "tap",
    "transition": "push"
  },
  "domMapping": {
    "element": "button",
    "attributes": {
      "type": "submit"
    },
    "ariaRole": "button"
  },
  "children": [],
  "parentId": null
}
```

### Navigation Link Object

```json
{
  "id": "nav_m1n2o3",
  "sourceScreenId": "screen_a1b2c3",
  "sourceComponentId": "comp_x1y2z3",
  "targetScreenId": "screen_d4e5f6",
  "action": {
    "type": "tap",
    "transition": "push",
    "condition": null
  },
  "visual": {
    "pathType": "curved",
    "label": null
  }
}
```

---

## Interaction Summary

```
┌─────────────────────────────────────────────────────────────────┐
│                    USER INTERACTION MAP                         │
├─────────────────────────────────────────────────────────────────┤
│                                                                 │
│   CREATE          MANIPULATE         CONNECT         CONFIGURE │
│   ──────          ──────────         ───────         ───────── │
│   + Screen        Drag/Move          Draw Arrow      Properties │
│   + Component     Resize             Link Dialog     Preset     │
│   + Group         Rotate             Flow View       Export     │
│   Duplicate       Align              Path Edit       Settings   │
│                                                                 │
│   ────────────────────────────────────────────────────────────  │
│                                                                 │
│   KEYBOARD SHORTCUTS                                            │
│   ──────────────────                                            │
│   Ctrl+N    New Screen       Ctrl+C/V  Copy/Paste              │
│   Ctrl+D    Duplicate        Ctrl+Z    Undo                    │
│   Delete    Remove           Ctrl+Y    Redo                    │
│   Escape    Deselect         Ctrl+S    Save                    │
│   B/T/C/N   Quick components Ctrl+E    Export                  │
│                                                                 │
└─────────────────────────────────────────────────────────────────┘
```

---

<p align="center">
  <strong>Wireframe</strong> - Canvas System Design
</p>
