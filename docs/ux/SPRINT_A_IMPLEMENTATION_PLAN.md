# Sprint A — UX Transformation Plan

**Goal:** Increase SaaS Maturity Score from **4.1/10 → 7.0/10** (projected **7.1/10**)
**Constraint:** Frontend-only. No backend, database, or API changes.
**Scope:** 6 key focus areas. No code implementation. Design first.

---

## Executive Summary

The AI Content Publisher SaaS platform currently functions as a collection of disjointed pages rather than a coherent, intuitive workflow. While technically functional, the user experience does not effectively guide professional service providers (law firms, accounting firms, insurance agencies, real estate agencies, etc.) through the core value cycle: **Configure → Generate → Review → Approve → Schedule/Publish**. 

Sprint A focuses exclusively on upgrading the visual hierarchy, workflow coherence, system status visibility, and language normalization (standardizing all user-facing copy to English while supporting multi-lingual content samples) without changing any database schemas, backend actions, or API interfaces. By introducing a central SaaS dashboard, a guided multi-step content generation wizard, a sequential onboarding checklist, reusable status/metric cards, and actionable empty states, this sprint moves the product from a developer-focused tool to a premium, business-focused SaaS experience.

---

## Priority Order

To maximize momentum and validate design patterns early, execution should proceed in the following order:

1. **Foundation & Navigation (A2)**: Group pages into a logical hierarchy so users immediately understand the layout framework.
2. **Design Standards: Status Cards & Empty States (A5 & A6)**: Establish the reusable components that will populate all subsequent pages.
3. **Onboarding Experience (A4)**: Create the first-touch journey for new users, giving them a structured setup path.
4. **Dashboard Home (A1)**: Connect all state variables to a central command center representing the heartbeat of the application.
5. **Generate Wizard (A3)**: Revamp the complex creation workflow into a low-cognitive-load, guided stepper.

---

## Quick Wins

- **Language Normalization**: Convert all mixed Thai/English UI labels and system badges to standard English to instantly raise the platform's professional appeal.
- **Breadcrumb & Header Cleanup**: Remove developer-centric "Milestone" badges and simplify the top navbar.
- **Logo Link Redirection**: Point the sidebar logo to the Dashboard homepage (`/`) instead of the generation page (`/generate`) to reinforce a standard home base.
- **Dismissible Setup Banner**: Add a lightweight, cookie- or localStorage-persisted warning banner that guides users directly to missing settings.

---

## Screen Architecture

```
                                  [App Shell]
                                       │
                ┌──────────────────────┴──────────────────────┐
          [Sidebar Nav]                                 [Top Navbar]
                │                                             │
      ┌─────────┼─────────┐                           ┌───────┴───────┐
  [Overview] [Content] [Configure]                 [Title]       [User Menu]
      │         │         │
  Dashboard  Create    Brand Profile
             Review    Integrations
             Calendar
```

---

## Detailed Focus Area Specifications

### A1. Dashboard Home

#### 1. UX Objective
Create a true SaaS command center. Transform a passive screen into an actionable dashboard where professional service providers can answer three questions within 5 seconds of loading: *"Is my system fully operational?"*, *"Where does my content stand in the publishing pipeline?"*, and *"What should I do next?"*

#### 2. Layout Specification
- **Section A (Top - Full Width)**: Conditional dismissible `<SetupBanner>` indicating setup completion status (visible if brand, OpenAI, or Buffer are missing).
- **Section B (Header)**: Clear page header with action title ("Dashboard") and subtitle ("Welcome back. Here's your content status.")
- **Section C (Connection Status Row)**: 3-column responsive grid on desktop (`grid-cols-1 md:grid-cols-3`) displaying connection status cards (Brand Profile, OpenAI API, Buffer).
- **Section D (Workflow Pipeline - Full Width)**: A progress stepper mapping the workflow lifecycle (`Configure` → `Generate` → `Review` → `Approve` → `Schedule` → `Publish`).
- **Section E (Metrics - 3-Column Grid)**: Elevated cards showing numeric totals for `Drafts` (clickable to review), `Approved` (clickable to schedule/publish), and `Published` (read-only count).
- **Section F (Activity Feed - Full Width)**: A list showing the last 5 activities logged in `workflow_logs`.

#### 3. Component Specification
- **`<SetupBanner>`**: Container `bg-indigo-50 border border-indigo-100 p-4 rounded-xl flex items-center justify-between`. Includes a small progress indicator ("Setup Progress: 2/3 steps") and a direct button linking to the next incomplete setup step.
- **`<WorkflowStepper>`**: Horizontal layout. Done steps show emerald green checks; the active current step displays a pulsing indigo ring; future steps are greyed out.
- **`<ActivityFeed>`**: List rendering timestamps dynamically ("2 hours ago", "Yesterday"). If empty, it renders an inline description and helper link.

#### 4. Wireframe
![Dashboard Home](/Users/jakarinosk/.gemini/antigravity/brain/1fe54f42-693c-42ff-b2e1-3ac1041a76f7/sprint_a_dashboard_1780135173907.png)

#### 5. Acceptance Criteria
- [ ] Shows a personalized welcome message in English: "Welcome back. Here's your content status."
- [ ] Setup Banner renders if and only if any of the three core integrations (Brand, OpenAI, Buffer) is missing.
- [ ] Setup Banner CTA correctly links directly to the first incomplete configuration page.
- [ ] Setup Banner can be dismissed, and the dismissed state is stored in localStorage.
- [ ] Shows exactly 3 connection status cards mapping to Brand Profile, OpenAI API, and Buffer connection states.
- [ ] Workflow pipeline displays a 6-step progress stepper with clear, responsive labels.
- [ ] Pulsing ring animations highlight the active, incomplete workflow stage.
- [ ] Metrics grid displays real-time counts for Drafts, Approved, and Published posts, each linking to their respective action pages.

#### 6. Estimated Effort
- 1.5 Days (Creating layout container, conditional sub-panels, and hooking up activity feed query).

#### 7. UX Impact
- **High**: Establishes a sense of place and structure immediately upon entering the app. Relieves user anxiety by showing system health transparently.

#### 8. Business Impact
- **High**: Increases feature adoption rates and guides users to complete setups, reducing activation drop-off.

---

### A2. Navigation Architecture

#### 1. UX Objective
Reorganize the sidebar navigation to align with standard business workflows rather than developer file structures. Group items logically, support collapse/expand states, and clean up navbar clutter.

#### 2. Layout Specification
- **Width**: `w-60` (240px) when expanded; `w-16` (64px) when collapsed.
- **Header**: Logo and application name (`AI Publisher`) pointing to Dashboard root (`/`).
- **Section Headers**: Visual dividers with uppercase labels and light typography: `OVERVIEW`, `CONTENT`, `CONFIGURE`.
- **User Account Menu**: Positioned at the bottom of the sidebar. Replaces the old navbar logout button, housing the user's avatar, email address, and a "Sign Out" action.

#### 3. Component Specification
- **`<Sidebar>`**: Standard container containing navigation lists. Supports smooth active states using a custom background accent (`bg-indigo-50 text-indigo-600` on active states).
- **`<SectionHeader>`**: Renders as `text-[10px] font-bold uppercase tracking-[0.2em] text-slate-400 px-4 pt-6 pb-2`.
- **`<UserMenuDropdown>`**: Popover component housing user account information and trigger for logging out of the Supabase session.

#### 4. Wireframe
![Navigation Architecture](/Users/jakarinosk/.gemini/antigravity/brain/1fe54f42-693c-42ff-b2e1-3ac1041a76f7/sprint_a_navigation_1780135190934.png)

#### 5. Acceptance Criteria
- [ ] Sidebar logo points to the Dashboard homepage (`/`) instead of `/generate`.
- [ ] Developer badge ("Milestone 1") is fully removed from all navigation components.
- [ ] Navigation is structured into three distinct headers: OVERVIEW, CONTENT, and CONFIGURE.
- [ ] Under OVERVIEW, only the "Dashboard" link is present.
- [ ] Under CONTENT, "Create Content", "Review & Approve", and "Content Calendar" items are present.
- [ ] Under CONFIGURE, "Brand Profile" and "Integrations" items are present.
- [ ] User profile avatar and email are moved to the bottom of the sidebar.
- [ ] "Sign Out" button resides in a dropdown on the user avatar, removing it entirely from the top navbar.

#### 6. Estimated Effort
- 1.0 Day (Re-architecting `navigation.ts`, adjusting sidebar components, removing the old navbar elements).

#### 7. UX Impact
- **High**: Provides an intuitive map of the system, reducing cognitive load when traversing between different workspace sections.

#### 8. Business Impact
- **Medium**: Decreases workflow completion time and guides the user smoothly through the creation-to-publication cycle.

---

### A3. Generate Wizard

#### 1. UX Objective
Reduce form-filling fatigue by replacing a single long form with a 5-step guided wizard. This keeps user actions bite-sized and increases visual control over settings.

#### 2. Layout Specification
- **Header**: Wizard progress bar showing active step name and percentage complete.
- **Step Panels (Centered - max-w-2xl)**:
  - *Step 1: Topic*: Grid of clickable preset topic cards (e.g., Employment Law, Tax & Accounting) alongside a "Custom Topic" input.
  - *Step 2: Tone*: Visual options for tone (e.g., Professional, Friendly) displaying inline sample text previews.
  - *Step 3: Target Audience*: Text input with suggesting chips (e.g., "SME Owners", "Legal Pros").
  - *Step 4: Options*: Choice selectors for post count (5 vs 10), model type (GPT-4o), and language.
  - *Step 5: Review*: Summary card displaying all configuration details prior to final action trigger.

#### 3. Component Specification
- **`<TopicPresetCard>`**: Interactive button displaying Lucide icons, titles, and descriptions. Uses `border-2 hover:border-indigo-500` transitions.
- **`<TonePreviewCard>`**: Interactive panel containing realistic tone copy examples (e.g., *"Hey! Let's break down these rules..."* for Friendly).
- **`<AudienceSuggestionChip>`**: Badge `bg-slate-100 hover:bg-indigo-50` that inserts text values directly into the target input on click.

#### 4. Wireframe
![Generate Wizard](/Users/jakarinosk/.gemini/antigravity/brain/1fe54f42-693c-42ff-b2e1-3ac1041a76f7/sprint_a_generate_wizard_1780135209707.png)

#### 5. Acceptance Criteria
- [ ] The generation page is rendered as a clean, sequential 5-step wizard.
- [ ] Users can navigate back and forth between steps without losing previously entered form data.
- [ ] Presets are displayed as interactive cards rather than a default HTML dropdown.
- [ ] Selecting "Custom Topic" reveals a text input block to type customized themes.
- [ ] Tone selection displays preview copy snippets to illustrate what the output voice sounds like.
- [ ] Audience step includes interactive suggestions chips that populate the input upon click.
- [ ] Review step presents a unified summary checklist of all configuration properties before execution.
- [ ] The wizard calls the existing `generatePosts()` Server Action using the approved payload schema.

#### 6. Estimated Effort
- 2.0 Days (Form segmentation, UI state management, preserving data during back/forward transitions).

#### 7. UX Impact
- **High**: Dramatically reduces the psychological barrier to creating posts by hiding unnecessary complexity until needed.

#### 8. Business Impact
- **High**: Drives up successful content generation rates and lowers user drop-offs.

---

### A4. Onboarding Experience

#### 1. UX Objective
Welcome first-time users with a clean, 5-step setup checklist that visually guides them through configuring their workspace, generating content, and publishing a post.

#### 2. Layout Specification
- **Target Condition**: Rendered when there is no brand profile, no integrations connected, and no content posts generated.
- **Layout**: Centered card (`max-w-2xl mx-auto`) taking over the main content area of the Dashboard.
- **Components**:
  - Welcome title and clear value proposition.
  - Progress bar showing absolute completion ("0 of 5 steps completed").
  - Stacked checklist cards representing the 5 key milestone tasks.
  - "Skip onboarding" link allowing advanced users to proceed straight to the raw dashboard view.

#### 3. Component Specification
- **`<OnboardingChecklist>`**: Sequential container. Locked steps display a lock icon (`KeyRound` / `Lock`) and are set to `opacity-50 pointer-events-none`. Active steps display interactive hover styles and action button labels.
- **The 5 Setup Steps**:
  1. *Configure Brand Profile*: Describe business voice and details. (Links to `/profile`)
  2. *Connect OpenAI API Key*: Supply an API key to enable generation. (Links to `/settings`)
  3. *Connect Buffer API*: Hook up Buffer to allow direct publishing. (Links to `/settings`)
  4. *Generate First Content*: Kick off the generation wizard. (Links to `/generate`)
  5. *Publish First Post*: Send approved content to social channels. (Links to `/drafts`)

#### 4. Wireframe
![Onboarding Experience](/Users/jakarinosk/.gemini/antigravity/brain/1fe54f42-693c-42ff-b2e1-3ac1041a76f7/sprint_a_onboarding_1780135226572.png)

#### 5. Acceptance Criteria
- [ ] Onboarding view displays when the user has 0 brands, 0 keys, and 0 posts.
- [ ] Progress tracker correctly displays the absolute count of completed steps out of 5.
- [ ] Step 1 (Brand Profile) is unlocked by default on first load.
- [ ] Step 2 (OpenAI API) is unlocked only after a brand profile is created.
- [ ] Step 3 (Buffer Connection) is unlocked only after Step 2 is completed.
- [ ] Step 4 (Generate First Content) is unlocked only after integrations are configured.
- [ ] Step 5 (Publish First Post) is unlocked only after a batch of drafts is generated.
- [ ] Clicking "Skip onboarding" sets a persistent flag in localStorage, rendering the normal dashboard layout.

#### 6. Estimated Effort
- 1.5 Days (Onboarding state check logic, step styling, localStorage persistence handler).

#### 7. UX Impact
- **Very High**: Converts a cold start (blank dashboard) into an interactive tutorial.

#### 8. Business Impact
- **Very High**: Improves Day 1 user retention and accelerates time-to-first-value (Aha! moment).

---

### A5. Status Cards

#### 1. UX Objective
Standardize status indication across all screens with a robust, responsive status card component system. These cards must immediately convey if a channel is healthy, disconnected, or experiencing issues.

#### 2. Layout Specification
- **Dimensions**: Flexible responsive grid panels.
- **Card Body**: Elevated container `bg-white p-4 rounded-xl flex items-center border border-slate-100 hover:shadow-md transition-all`.
- **Layout Flow**: Left border indicator → Left icon frame → Central content (Title, status message, connection details) → Right CTA action button.

#### 3. Component Specification
- **`<StatusCard>`**: Takes `variant` prop (`connected` | `disconnected` | `configured` | `error`), title, subtitle, icon, link href, and secondary action details.
  - *Connected*: Emerald green border (`border-l-4 border-emerald-500`), green icon backdrop, displaying "Connected" with details.
  - *Disconnected*: Gray border, gray icon backdrop, displaying "Not configured" with a CTA button.
  - *Error*: Crimson red border (`border-l-4 border-rose-500`), red icon backdrop, displaying error details and a "Retry" CTA.
  - *Configured*: Emerald green border with "Edit" helper link.

#### 4. Wireframe
![Status Cards](/Users/jakarinosk/.gemini/antigravity/brain/1fe54f42-693c-42ff-b2e1-3ac1041a76f7/sprint_a_status_cards_1780135241916.png)

#### 5. Acceptance Criteria
- [ ] Status card handles all 4 primary variants (connected, disconnected, configured, error) with corresponding styling tokens.
- [ ] Entire card element is clickable and navigates to the associated configuration route.
- [ ] Active CTAs (like "Connect Now" or "Edit") appear only in their appropriate states.
- [ ] Handles optional timestamps to showcase freshness (e.g. "Last sync 5 mins ago").
- [ ] Metrics card variants support elevated sizing, large typography, and translation hover animations.
- [ ] Uses flexbox with appropriate padding and standard spacing (`gap-4`, `p-4`) on mobile screens.
- [ ] Integrations panel in Settings successfully renders these reusable status elements.
- [ ] Uses English labels and descriptions by default across all variants.

#### 6. Estimated Effort
- 1.0 Day (Creating status card and metrics card components, documenting design tokens).

#### 7. UX Impact
- **Medium**: Brings layout cohesion to the app and makes settings pages feel consistent and reliable.

#### 8. Business Impact
- **Low**: Speeds up frontend development for subsequent features and decreases UI bugs.

---

### A6. Empty States

#### 1. UX Objective
Ensure that no empty table or list appears as a dead end. Every page without data must show a beautiful, contextual illustration or icon, explain why there is no content, and provide a clear call to action to create it.

#### 2. Layout Specification
- **Alignment**: Centered both vertically and horizontally in the content area (`py-12 flex flex-col items-center justify-center text-center`).
- **Icons**: Large, soft-colored backdrop rings (`bg-slate-50 w-16 h-16 rounded-2xl flex items-center justify-center mb-4`).
- **Typography**: Clean title (`text-slate-800 font-bold mb-1`), detailed explanatory description (`max-w-md text-slate-500 text-sm mb-6`).
- **CTAs**: Primary action button (e.g. "Create Content") stacked above a secondary text link (e.g. "View setup guide").

#### 3. Component Specification
- **`<EmptyState>`**: Reusable component taking props: `icon`, `title`, `description`, `action` (label, href), and `secondaryAction` (label, href). Includes a `variant` prop supporting `default` and `setup-required` (showing amber border warnings when key settings are missing).

#### 4. Wireframe
![Empty States](/Users/jakarinosk/.gemini/antigravity/brain/1fe54f42-693c-42ff-b2e1-3ac1041a76f7/sprint_a_empty_states_1780135257331.png)

#### 5. Acceptance Criteria
- [ ] Reusable `<EmptyState>` component is created and imported into target views.
- [ ] Generate Page displays an empty state if no OpenAI API key is detected, directing users to Settings.
- [ ] Drafts Page displays "Your Review Queue is Empty" with a CTA to generate content when post count is 0.
- [ ] Empty state showcases English headers but provides localized sample prompts (e.g. "ยังไม่มีคอนเทนต์" to illustrate preview layouts).
- [ ] Calendar page shows a modern "Calendar Coming Soon" empty state instead of plain text.
- [ ] Dashboard shows a customized "No Content Generated Yet" card set when all metrics are 0.
- [ ] Primary buttons in empty states use consistent color formatting (`bg-indigo-600`).
- [ ] Supports micro-animations (e.g. `animate-in fade-in slide-in-from-bottom-4 duration-300`).

#### 6. Estimated Effort
- 1.0 Day (Enhancing `<EmptyState>` component, applying it across the 4 layout files).

#### 7. UX Impact
- **High**: Prevents user confusion when navigating to brand new or clean accounts.

#### 8. Business Impact
- **Medium**: Decreases churn by offering immediate, contextual guidance on what to do next.

---

## Implementation Roadmap

```
Week 1: Day 1-2                 Day 3-4                 Day 5-6                 Day 7
┌───────────────────────┐       ┌───────────────────────┐       ┌───────────────────────┐       ┌─────────────┐
│ FOUNDATION            │ ───>  │ COMPONENTS            │ ───>  │ PAGES                 │ ───>  │ VALIDATION  │
│ - Language Normalization      │ - StatusCard & Metrics        │ - Onboarding take-over│       │ - QA Checklist
│ - Navigation IA Rebuild       │ - EmptyState Upgrade          │ - Wizard Integration  │       │ - Visual Test
│ - Sidebar Re-layout   │       │ - Workflow Steppers   │       │ - Dashboard Rebuild   │       │ - Approval  │
└───────────────────────┘       └───────────────────────┘       └───────────────────────┘       └─────────────┘
```

### Sprint Summary Checklist
- [ ] All Thai text in navigation items, system buttons, status states, and headers is translated to English.
- [ ] The sidebar is divided into OVERVIEW, CONTENT, and CONFIGURE.
- [ ] User profile metadata and logging out are handled inside a popover footer in the sidebar.
- [ ] Reusable `StatusCard` and `EmptyState` components support all specified layout variants.
- [ ] The dashboard homepage adapts dynamically, showing Onboarding if empty and metrics if populated.
- [ ] The 5-step onboarding checklist accurately locks and unlocks steps sequentially.
- [ ] The 5-step content generation wizard provides card preset selections, preview texts, and a final summary page.
- [ ] Existing server actions and database constraints remain untouched.
