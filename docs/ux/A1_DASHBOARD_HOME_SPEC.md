# Sprint A1: Dashboard Home Specification

**Role:** Senior SaaS Product Designer & UX Architect  
**Scope:** Dashboard Home (`/`) Command Center Only  
**Output:** `docs/ux/A1_DASHBOARD_HOME_SPEC.md`  

---

## 1. Dashboard UX Objective

The primary objective of the Dashboard Home is to transition the application from a series of isolated screens into a unified, workflow-driven command center. By mimicking the UX maturity of platforms like Jasper, Buffer, and Notion, the dashboard ensures high clarity and fast decision-making for business users (such as law firms, accounting firms, and real estate offices) who are not technical developers.

### Understood Within 5 Seconds
- **System Health:** Are my integrations connected and is my brand identity active? (OpenAI + Buffer + Brand Profile).
- **Workflow State:** Where is my content currently backlogged? (e.g., "I have 8 drafts waiting for review").
- **Next Action:** A single, prominent, context-aware call-to-action (e.g., "Generate your first posts" or "Review 8 pending drafts").

### Prioritized Actions
1. **Primary Action:** Review and approve pending drafts (the typical daily recurring action).
2. **Secondary Action:** Initiate a new generation batch.
3. **Tertiary Action:** Fix broken or missing connections (API keys/Profile setups).

### Communicated Business Value
- The dashboard changes the narrative from *"Here are your technical pages"* to *"Here is your automated marketing department, showing active output, system readiness, and calendar pipeline metrics."*

---

## 2. Dashboard Layout Specification

The dashboard layout is designed desktop-first using a clean sidebar shell and a main content viewport structured with a clear vertical rhythm.

```
┌────────────────────────────────────────────────────────────────────────┐
│  SIDEBAR   │  TOP SECTION: Welcome, Account Status & Brand Health     │
│  (240px)   ├──────────────────────────────────────────────────────────┤
│            │  WORKFLOW SECTION: Visual Pipeline Stepper               │
│  Overview  │  [Config] ──> [Gen] ──> [Review] ──> [Approve] ...       │
│  Content   ├──────────────────────────────────────────────────────────┤
│  Config    │  KPI SECTION: 4-Column Grid                              │
│            │  ┌──────────┐ ┌──────────┐ ┌──────────┐ ┌──────────┐     │
│            │  │Generated │ │ Pending  │ │Scheduled │ │Published │     │
│            │  └──────────┘ └──────────┘ └──────────┘ └──────────┘     │
│            ├──────────────────────────────────────────────────────────┤
│            │  MAIN CONTENT GRID (2-Columns: 2/3 and 1/3 layout)      │
│            │  ┌──────────────────────────────┐┌──────────────────────┐│
│            │  │ SYSTEM HEALTH & ACTIONS      ││ RECENT ACTIVITY      ││
│            │  │ - Connect OpenAI             ││ - 10:00 AM: Gen PDPA ││
│            │  │ - Complete Brand Profile     ││ - Yesterday: Pub 3x ││
│            │  │ [Quick Actions Buttons]      ││                      ││
│            │  └──────────────────────────────┘└──────────────────────┘│
└────────────┴──────────────────────────────────────────────────────────┘
```

### Layout Sections (Top to Bottom)

#### A. Top Section (Welcome & Identity Banner)
- **Welcome Area:** Personalized greeting (e.g., *"Hello, [User Email]"*) with a dynamic greeting message reflecting active status (e.g., *"Your automated content engine is ready."*).
- **Account & Brand Health Badge:** A unified pill badge showing active workspace status (e.g., `Brand Active: [Brand Name]` or `Action Needed: Incomplete Profile` in amber).

#### B. Visual Workflow Pipeline Section
- Horizontal progress flow mapping the core 6-step lifecycle:
  `Configure` ──> `Generate` ──> `Review` ──> `Approve` ──> `Schedule` ──> `Publish`
- **Visual indicators:** Completed stages (emerald green with checkmarks), Current bottleneck/next step (pulsing blue highlight ring), and Future stages (subtle grey).

#### C. KPI Metrics Grid Section
A responsive 4-column metric card deck:
1. **Generated Posts:** Cumulative lifetime generation count.
2. **Approved Posts:** Count of posts approved and ready for scheduling.
3. **Scheduled Posts:** Queue size inside the Buffer publication scheduler.
4. **Published Posts:** Lifetime posts successfully pushed to social channels.

#### D. Two-Column Workspace Core
- **Left Column (2/3 Width): System Health & Quick Actions**
  - Grid of status cards reflecting OpenAI connection health, Buffer setup, and Brand Profile.
  - Interactive Action Panel containing primary workflow buttons: `Create Content`, `Review Drafts`, `View Publishing Queue`.
- **Right Column (1/3 Width): Recent Activity Log**
  - Vertical chronological log of the latest 5 workflow activities tracked from `workflow_logs` (e.g., *"5 drafts created on PDPA Compliance"* or *"Post approved: Tax Law Guide"*).

---

## 3. Component Inventory

A suite of highly cohesive, atomic components to populate the layout:

| Component Name | Description | Key Props / States |
|---|---|---|
| `<MetricCard>` | Interactive stat display with large numerals and hover micro-animations. | `value`, `label`, `trendDescription`, `href` |
| `<WorkflowStepper>` | Horizontal pipeline tracker visualizing the 6 workflow phases. | `currentStepIndex`, `completedSteps` |
| `<StatusBadge>` | Lightweight visual pills denoting active status. | `variant: "success" \| "warning" \| "error" \| "info"`, `label` |
| `<ConnectionCard>` | Status card detailing configuration integrations health. | `providerName`, `status: "connected" \| "disconnected" \| "error"`, `href` |
| `<ActivityItem>` | Line item in the activity feed showing activity type and time. | `actionType`, `timestamp`, `details` |
| `<ActionShortcutCard>` | Clickable callout tile triggering immediate workflow routing. | `title`, `description`, `icon`, `primaryCTA`, `href` |
| `<EmptyStateCard>` | Beautiful graphic card with centered explanation and CTA. | `icon`, `title`, `message`, `ctaLabel`, `ctaHref` |

---

## 4. Wireframes

### A. Desktop Wireframe (1200px+)
```
+-----------------------------------------------------------------------------+
| [R] AI Publisher        Search...                         [Avatar] User V   |
+-----------------------------------------------------------------------------+
| Overview         |  Welcome back!                                           |
| - Dashboard      |  Your automated publishing hub is fully configured.       |
|                  |                                                          |
| Content          |  Workflow Status:                                        |
| - Create         |  [Configure: OK] -> [Generate: OK] -> (Review: 8 Drafts) |
| - Review (8)     |                                                          |
| - Calendar       |  +-------------+ +-------------+ +-------------+         |
|                  |  | 42 Generated| | 8 Drafts    | | 12 Published|         |
| Configure        |  | [View All]  | | [Review]    | | [View Logs] |         |
| - Profile        |  +-------------+ +-------------+ +-------------+         |
| - Integrations   |                                                          |
|                  |  +---------------------------+ +-----------------------+ |
|                  |  | System Connections        | | Recent Activity       | |
|                  |  |                           | |                       | |
|                  |  | [V] Brand: Law Firm  [Ed] | | * Gen: PDPA Compliance| |
|                  |  | [V] OpenAI: Connected[Ed] | |   10 mins ago         | |
|                  |  | [!] Buffer: Set Up   [Cn] | | * Approved: Tax law   | |
|                  |  +---------------------------+ |   Yesterday           | |
|                  |  | Quick Actions             | | * Connected OpenAI    | |
|                  |  | [Create Content] [Review] | |   2 days ago          | |
|                  |  +---------------------------+ +-----------------------+ |
+------------------+----------------------------------------------------------+
```

### B. Tablet Wireframe (768px - 1024px)
- Sidebar collapses into a slim vertical bar (`64px`) displaying icons only.
- Two-column workspace core reflows into a single stacked column (Recent Activity moves below System Connections).
- KPI Cards adapt to a `grid-cols-2` layout.

```
+----+------------------------------------------------------------------------+
|[R] | Welcome back!                                         [Avatar] User V  |
+----+------------------------------------------------------------------------+
|(D) | Workflow Status: [Config] -> [Gen] -> (Review: 8 Drafts)              |
|    |                                                                        |
|(*) | +-----------------------+  +-----------------------+                   |
|(R) | | 42 Generated          |  | 8 Drafts              |                   |
|    | +-----------------------+  +-----------------------+                   |
|    | +-----------------------+  +-----------------------+                   |
|    | | 12 Published          |  | 3 Scheduled           |                   |
|    | +-----------------------+  +-----------------------+                   |
|    |                                                                        |
|    | +--------------------------------------------------------------------+ |
|    | | System Connections                                                 | |
|    | | [V] Brand: Law Firm | [V] OpenAI: OK | [!] Buffer: Not Connected   | |
|    | +--------------------------------------------------------------------+ |
|    | +--------------------------------------------------------------------+ |
|    | | Recent Activity                                                    | |
|    | | * Gen: PDPA Compliance (10m ago)                                   | |
|    | +--------------------------------------------------------------------+ |
+----+------------------------------------------------------------------------+
```

### C. Mobile Wireframe (320px - 480px)
- Navigation sidebar collapses into a top burger-menu navbar toggle.
- Metrics stack vertically in 1 column.
- Workflow pipeline collapses into a text badge representation: `Current Step: Review (8 Drafts)`.
- Cards occupy 100% of horizontal screen width with standard `p-4` padding.

```
+----------------------------------------------------+
| [=] [R] AI Publisher                     [Avatar]  |
+----------------------------------------------------+
| Welcome back!                                      |
|                                                    |
| Pipeline: (3/6) Review Drafts                      |
|                                                    |
| +------------------------------------------------+ |
| | 8 Drafts pending review                        | |
| | [Start Reviewing ->]                           | |
| +------------------------------------------------+ |
|                                                    |
| +------------------------------------------------+ |
| | OpenAI: Connected                              | |
| +------------------------------------------------+ |
| | Buffer: Action Required                        | |
| +------------------------------------------------+ |
|                                                    |
| [Create Content +]                                 |
+----------------------------------------------------+
```

---

## 5. Empty State Behavior

To prevent dead ends and maintain high SaaS maturity, dashboard sections and sub-routes display structured empty states when configurations or data are missing.

### State A: No Content Generated
- **Context:** User has set up connections but hasn't created posts.
- **Message:** `"Your Content Feed is Quiet"`
- **Explanation:** `"You have connected your brand profile and AI keys. Let's create your first batch of automated social media drafts."`
- **CTA Button:** `[ ✨ Generate Content ]` (routes to `/generate`)

### State B: OpenAI Not Connected
- **Context:** OpenAI API key is missing or invalid.
- **Message:** `"AI Power Engine Offline"`
- **Explanation:** `"We need your OpenAI API key to craft customized posts that fit your brand voice."`
- **CTA Button:** `[ 🔑 Connect OpenAI API ]` (routes to `/settings`)

### State C: Buffer Not Connected
- **Context:** Platform not linked to Buffer.
- **Message:** `"Publishing Pipeline Disconnected"`
- **Explanation:** `"Connect your Buffer workspace to schedule and publish approved posts directly to LinkedIn, Facebook, and Twitter."`
- **CTA Button:** `[ 🔗 Link Buffer Account ]` (routes to `/settings`)

### State D: Brand Profile Incomplete
- **Context:** Brand description, industry, or target audience details are missing.
- **Message:** `"Tell Us About Your Brand First"`
- **Explanation:** `"To generate content that accurately reflects your business, we need some details about your industry, audience, and guidelines."`
- **CTA Button:** `[ 👤 Set Up Brand Profile ]` (routes to `/profile`)

---

## 6. First-Time User Experience (FTUE)

For a brand new user, the standard dashboard metrics and activity lists are hidden and replaced with an **Onboarding Checklist** view. This maintains focus and prevents user overwhelm.

```
┌────────────────────────────────────────────────────────┐
│ 🚀 Get Started with AI Publisher                       │
│ Complete these 5 setup steps to publish your first post│
│                                                        │
│ Progress: [████████░░░░░░░░░░] 40% Complete             │
│                                                        │
│ [✓] 1. Create Brand Profile                            │
│     Tell AI about your company voice and audience.     │
│                                                        │
│ [▶] 2. Connect OpenAI                                  │
│     Provide an API key to enable post generation.       │
│     [Connect Key ->]                                   │
│                                                        │
│ [🔒] 3. Connect Buffer                                  │
│     Unlock social scheduling capabilities.             │
│                                                        │
│ [🔒] 4. Generate First Content                          │
│                                                        │
│ [🔒] 5. Publish First Post                             │
└────────────────────────────────────────────────────────┘
```

### Checklist Progression Flow
1. **Create Brand Profile:** Unlocked initially. Completing it updates progress to 20% and unlocks Step 2.
2. **Connect OpenAI:** Unlocks after Step 1. Completing it updates progress to 40% and unlocks Step 3.
3. **Connect Buffer:** Unlocks after Step 2. Completing it updates progress to 60% and unlocks Step 4.
4. **Generate First Content:** Unlocks after Step 3. Directs user to the Generate Wizard. Generation completion updates progress to 80% and unlocks Step 5.
5. **Publish First Post:** Unlocks after Step 4. Triggers when the user successfully approves and publishes a post to Buffer. Hits 100% and permanently closes the onboarding checklist banner.

---

## 7. Acceptance Criteria

Success metrics that determine if the implementation matches design objectives:

- [ ] **Time-to-Context:** Users must be able to state whether the platform is ready to generate content within 5 seconds of loading the dashboard.
- [ ] **Next-Action Clarity:** Users with active drafts can locate the "Review Drafts" CTA on the dashboard with zero scrolls.
- [ ] **One-Click Creation:** The "Create Content" page is accessible via a single click from anywhere on the dashboard.
- [ ] **Onboarding Lock Gates:** The onboarding checklist locks future steps sequentially to prevent users from executing AI generations before configuring keys or brand rules.
- [ ] **Integration Status Realism:** Disconnected API keys display a warning state on the dashboard status cards, showing the connection status in real-time.
- [ ] **Responsiveness:** Cards must dynamically wrap and stack without breaking container widths or overlapping text labels on screens down to 320px wide.
- [ ] **Language Standard:** 100% of copy rendered on the Dashboard is normalized in English.

---

## 8. Implementation Notes

Technical layout hierarchy and standards for engineers building the dashboard home:

### Recommended React Component Hierarchy
```
Layout (App Shell / Sidebar Wrapper)
  └── Page (src/app/page.tsx - Server Component fetching Brand, Keys, and Post Stats)
        ├── SetupBanner (Conditional display based on setup status)
        ├── WelcomeHeader (Dynamic user greeting & Brand Status Badge)
        ├── WorkflowStepper (Horizontal workflow stages tracker)
        ├── MetricDeck (4-column responsive grid layout)
        └── WorkspaceBody (2-column layout on desktop)
              ├── LeftPane
              │     ├── ConnectionsGrid (StatusCards for integrations)
              │     └── QuickActionsPanel (Interactive route buttons)
              └── RightPane (ActivityFeed card fetching workflow logs)
```

### Responsive CSS Variables & Breakpoints
- **Mobile breakpoint:** `< 768px` (Stacks sidebar into drawer, metrics into a 1-column list).
- **Tablet breakpoint:** `768px - 1024px` (Sidebar collapses to `w-16`, main content shifts to simple stacked column grids).
- **Desktop breakpoint:** `> 1024px` (Full 240px sidebar, 4-column metrics, 2-column main viewport grid).
- **Grid classes:** Use CSS Grid variables: `grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6`.

### Accessibility (a11y)
- **Contrast Ratios:** Ensure status indicators (emerald green, amber orange, crimson red) meet a minimum of 4.5:1 contrast against white backgrounds.
- **Screen Readers:** Add `aria-current="step"` on active workflow stepper components. Status checkmarks must include screen-reader-only labels (e.g., `<span className="sr-only">Connected</span>`).
- **Keyboard Navigation:** All dashboard actions, metric buttons, and status card link blocks must be tab-navigable (`tabIndex={0}`) and triggerable using `Enter` or `Space` key actions.
