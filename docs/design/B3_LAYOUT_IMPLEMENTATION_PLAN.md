# Premium UX Sprint B3.1 — Content Creation Studio Layout Skeleton Plan

This plan details the implementation strategy for transitioning the `/generate` page into a high-density, multi-pane **Content Creation Studio** layout skeleton.

---

## 1. Layout Architecture (Three-Pane Grid)

The desktop layout will utilize a full-width, screen-height flex container (`h-screen overflow-hidden`) with a grid distribution:

- **Left Panel (22% width)**: Control Deck. Soft background color (`bg-slate-50/50 dark:bg-slate-900/40`), sticky HUD widgets.
- **Center Panel (48% width)**: Command Composer. Clean white workspace backdrop, dense interactive selectors, and the main action console.
- **Right Panel (30% width)**: Expectation Hub. Platform mockup visualizer and KPI scoring meters.

---

## 2. Component Hierarchy

```
[Studio Layout Skeleton] (flex h-screen overflow-hidden w-full)
 ├── [Pane A: Control Deck (22%)] (border-r overflow-y-auto px-4 py-6 space-y-5)
 │    ├── [Brand Guidelines HUD] (Card: Insight) - Shows company persona & guidelines
 │    ├── [Active Integrations] (Card: Action) - Mini pills for linked API vaults
 │    ├── [Content Templates] (Card: Secondary) - Multi-button recipe quick selector
 │    └── [Recent Topics / Angles] (Card: Secondary) - List of past successful context tracks
 │
 ├── [Pane B: Command Composer (48%)] (flex-1 flex flex-col h-full border-r overflow-y-auto px-6 py-6 space-y-6)
 │    ├── [Studio Header] - Title, active profile subtitle, and workspace toggle
 │    ├── [Topic Builder] (Card: Primary) - High-density text input + key phrase extraction
 │    ├── [Context Grid Configurator] - 2x2 density selector:
 │    │    ├── [Audience Selector] - Targeted segment dropdown
 │    │    ├── [Tone Selector] - Language register dropdown
 │    │    ├── [Style Selector] - Aesthetic personality dropdown
 │    │    └── [Post Volume & Objective] - Output count & goal toggle
 │    └── [Composer Main CTA] - Full-width "Generate Content" button
 │
 └── [Pane C: Expectation Hub (30%)] (overflow-y-auto px-5 py-6 space-y-6 bg-slate-50/20)
      ├── [Live Platform Preview Tabs] - Feeds for LinkedIn, Twitter, and Buffer
      ├── [Content Score HUD] (Card: Insight) - Performance meters (Hook, Readability, CTA)
      ├── [AI Operational Status HUD] - Smooth visual status checks replacing technical logs
      └── [Metadata Metrics] (Card: Secondary) - Output expectation tags (word counts, tag count)
```

---

## 3. Wireframes

### Desktop Wireframe

```
+-----------------------------------------------------------------------------------------------------------------------+
|                                           CONTENT CREATION STUDIO (Header)                                            |
+------------------------------+---------------------------------------------------------+------------------------------+
| LEFT PANEL: CONTROL (22%)    | CENTER PANEL: COMMAND COMPOSER (48%)                    | RIGHT PANEL: EXPECTATION(30%)|
|                              |                                                         |                              |
| [BRAND GUIDELINES HUD]       | (Studio Header) Active: Legal Persona                   | [PLATFORM PREVIEW TABS]      |
| * Tone: Educational          |                                                         | [ LinkedIn ] [ Twitter ]     |
| * Persona: Authoritative     | Topic Track:                                            | +--------------------------+ |
|                              | +-----------------------------------------------------+ | | Brand Account            | |
| [ACTIVE INTEGRATIONS]        | | Enter topic guidelines...                           | | Sponsored                | |
| [OpenAI: Ready] [Buffer: OK] | +-----------------------------------------------------+ | |                          | |
|                              |                                                         | | (Interactive Preview     | |
| [TEMPLATES & ANGLES]         | Context Configuration:                                  | |  Placeholder)            | |
| [⚡ Checklist] [⚡ Tip Guide] | +--------------------------+--------------------------+ | +--------------------------+ |
| [⚡ Case Study] [⚡ Q&A]     | | Audience: Business Owners| Tone: Expert Professional|                              |
|                              | +--------------------------+--------------------------+ | [CONTENT SCORE METERS]       |
| [RECENT TRACKS]              | | Style: Modern            | Volume: 5 Posts          | * Hook:        [======   ] 7.2 |
| * PDPA Thai updates          | +--------------------------+--------------------------+ | * Readability: [======== ] 8.4 |
| * Employee severance tips    |                                                         | * Engagement:  [=====    ] 5.0 |
|                              | Objective: Brand Awareness                              | * CTA:         [=======  ] 7.0 |
|                              |                                                         |                              |
|                              | +-----------------------------------------------------+ | [AI SYNTHESIS LOG]           |
|                              | | (Sparkles) Generate Content                         | | [✓] Understanding Context  |
|                              | +-----------------------------------------------------+ | [✓] Generating Hooks         |
+------------------------------+---------------------------------------------------------+------------------------------+
```

### Tablet Wireframe

```
+-----------------------------------------------------------------------------------------------------------------------+
|                                           CONTENT CREATION STUDIO                                                     |
+--------------------------------------------------------+--------------------------------------------------------------+
| LEFT HALF: CONFIGURATION (40%)                         | RIGHT HALF: PREVIEW & ACTIONS (60%)                          |
|                                                        |                                                              |
| [Brand Context & Settings HUD]                         | [Preview Mock Feed]                                          |
| * Tone: Educational | Audience: Tech Founders          | +----------------------------------------------------------+ |
|                                                        | | LinkedIn Card Mock View                                  | |
| Topic Parameter:                                       | +----------------------------------------------------------+ |
| +----------------------------------------------------+ |                                                              |
| | Topic details...                                   | | [CONTENT METRIC RATINGS]                                   |
| +----------------------------------------------------+ | * Hook Score: 8.5/10                                        |
|                                                        | * Readability: High                                          |
| [⚡ Synthesize Content ]                                |                                                              |
|                                                        | Actions: [ Approve ] [ Queue to Buffer ]                     |
+--------------------------------------------------------+--------------------------------------------------------------+
```

### Mobile Wireframe

```
+----------------------------------------+
|        CONTENT CREATION STUDIO         |
+----------------------------------------+
| Active Topic Target:                   |
| [PDPA Thai updates 2026               ]|
+----------------------------------------+
| Selected recipe: ⚡ tip Guide          |
+----------------------------------------+
|                                        |
| [ Composer Parameters Grid ]           |
| * Tone: Educational  * Volume: 5       |
|                                        |
+----------------------------------------+
| [⚡ Sparkles: Synthesize Content ]      |
+----------------------------------------+
| [ Settings ]  | [ Editor ]  | [Preview] |
+----------------------------------------+
```

---

## 4. Design Decisions & Visual Hierarchy

To achieve a premium SaaS aesthetic:
- **Card Hierarchy**:
  - **Primary Card (Center panel inputs)**: Light border, flat background, focus states with colored ring outlines.
  - **Secondary Card (Templates/integrations)**: Compact padding, subtle icons, interactive hover translations.
  - **Insight Card (Brand guidelines/Content Score)**: HSL colored indicators, custom visual meters, highlights.
- **Micro-Animations**: Hover animations on templates, active pulse on AI processing status, smooth preview tab transitions.

---

## 5. Implementation Plan Details

### 5.1 Layout Architecture & Viewports
We will use full screen height flexboxes and grids with absolute scrolling containers.

### 5.2 Component Hierarchy
As outlined in Section 2, components will divide left utility columns, center composer forms, and right preview columns.

### 5.3 Design Decisions
Dense, modern widgets with customized card colors (light/dark themed) to replace the centered form.

### 5.4 Reusable Components
- `VisualScoreProgress`: Custom progress meters for visual metric scores (0-10) with progress bars.
- `AIProcessHUD`: List showing status checklist elements for the operational pipeline.

### 5.5 Risks
ESLint unused variable rule checks; resolved by importing components properly and using type references.

### 5.6 Estimated Effort
- UI Skeleton Assembly: 4 hours.
- Visual Polish & Responsive grid collapse: 3 hours.
- Total: 7 hours.

---

## 6. Project Setup & Files

### Files to Create
- `src/components/generate/studio-layout.tsx` (Contains structural 3-pane flex grid wrapper)
- `src/components/generate/control-deck.tsx` (Contains Left Panel components)
- `src/components/generate/command-composer.tsx` (Contains Center Panel selectors)
- `src/components/generate/expectation-hub.tsx` (Contains Right Panel mocks & metrics)

### Files to Modify
- `src/app/(dashboard)/generate/page.tsx` (Swap out the simple form rendering for `StudioLayout`)

### Strategy
Implement layouts as pure functional view components returning structural HTML/CSS. Mock all variables and trigger callbacks.

### Acceptance Criteria
1. Prevent vertical browser page-scrolling using `h-screen overflow-hidden`.
2. Exact pane widths: Left (22%), Center (48%), Right (30%).
3. Renders 4 content metrics: Hook Strength, Readability, Engagement, CTA Strength.
4. Renders AI status list checks without developer/technical logs.
5. Desktop view automatically shifts to stacked columns on tablets and mobile screens.
