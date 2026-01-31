# 📤 Export System Design

This document details the export capabilities of Wireframe, describing the supported formats and their downstream applications for code generation, documentation, and system design.

---

## Supported Export Formats

Wireframe supports four primary export types, each serving a distinct phase of the development lifecycle.

### 1. JSON Project Schema (`project.wireframe.json`)
The complete, lossless representation of the entire project state.

**Why it's needed:**
- **Save/Load:** Native file format for the application.
- **Interoperability:** Base format for external tools or custom parsers.
- **Backups:** Full state preservation including undo history (optional).

**Structure Snippet:**
```json
{
  "meta": { "version": "1.0", "exportedAt": "2026-02-01..." },
  "screens": [ ... ],
  "navigation": [ ... ],
  "intent": { ... }
}
```

### 2. Frontend Component Tree (`components.tree.json`)
A hierarchical, specialized view of the UI, stripped of visual coordinates and focused on structure.

**Why it's needed:**
- **Scaffolding:** Direct input for code generators (e.g., "Create React App" scripts).
- **Component Analysis:** identifying reusable components vs one-offs.
- **Design Systems:** extracting color palettes and typography usage.

**Structure Snippet:**
```json
{
  "screens": [
    {
      "name": "Login",
      "route": "/login",
      "root": {
        "type": "Form",
        "children": [
          { "type": "Input", "props": { "label": "Email" } },
          { "type": "Button", "props": { "label": "Submit" } }
        ]
      }
    }
  ]
}
```

### 3. Navigation Flow Graph (`flow.graph.json`)
A directed graph representation of screen connections and user journeys.

**Why it's needed:**
- **Routing Logic:** generating `react-router` or `next.config.js` files.
- **Flow Validation:** automated checks for dead-end screens or isolated loops.
- **Testing:** scaffolding integration tests (e.g., Cypress) that follow user paths.

**Structure Snippet:**
```json
{
  "nodes": [ "login", "dashboard" ],
  "edges": [
    { "from": "login", "to": "dashboard", "trigger": "submit_success" }
  ]
}
```

### 4. Architecture Summary (`system.design.md`)
A human-readable markdown report summarizing the recommended tech stack and architectural decisions.

**Why it's needed:**
- **Documentation:** Instant `README.md` or wiki page for the new repo.
- **Team Alignment:** Artifact for architectural review meetings.
- **Onboarding:** Quick context for new developers joining the project.

---

## Downstream Applications

How these exports drive the development process:

### 🏭 Code Generation

The **Component Tree** and **Navigation Flow** exports provide the structured data necessary to scaffold a working codebase.

*   **Scaffolder Script:** A CLI tool (`wireframe-cli generate`) can read `components.tree.json` to create directory structures:
    ```
    /src
      /components
        Button.tsx
        Input.tsx
      /screens
        LoginScreen.tsx
          (imports Button, Input)
    ```
*   **Router Generator:** Reads `flow.graph.json` to generate routing configuration:
    ```javascript
    // generated-routes.js
    export const routes = [
      { path: '/login', component: LoginScreen },
      { path: '/dashboard', component: DashboardScreen }
    ];
    ```

### 📚 Documentation Generation

The **Architecture Summary** and **Project Schema** combine to create comprehensive project docs.

*   **Live Docs:** Static site generators (like Docusaurus) can parse `project.wireframe.json` to render live, interactive diagrams of the system flows.
*   **API Contracts:** If the wireframe includes data binding (future feature), exports could scaffold Open API (Swagger) specs.

### 🏛️ System Design & Collaboration

The **Architecture Summary** acts as a "Request for Comment" (RFC) document.

*   **Review Process:** Teams can diff `system.design.md` versions to track how architectural requirements change over time.
*   **Cost Estimation:** The recommended cloud services list allows for quick calculator inputs to estimate monthly infrastructure costs.

---

## Integration Workflow

```
[ Wireframe App ]
       │
       ├── (1) Saves "project.wireframe.json" ──> [ Source Control / Repo ]
       │
       ├── (2) Exports "components.tree.json" ──> [ Code Scaffolder CLI ] ──> [ React/Vue Project ]
       │                                                                            │
       └── (3) Exports "system.design.md" ────> [ Project Wiki / README ]           │
                                                                                    │
[ Developer ] <─────────────────────────────────────────────────────────────────────┘
(Fills in logic, styles, and backend implementation)
```

---

<p align="center">
  <strong>Wireframe</strong> - Export System Design
</p>
