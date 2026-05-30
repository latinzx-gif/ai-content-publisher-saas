# SaaS File Structure Audit

**Date:** Saturday, May 30, 2026
**Target:** AI Content Publisher SaaS
**Objective:** Evaluate current file and folder structure against scalable SaaS architecture best practices in preparation for Milestone 2.

## 1. Audit Checkpoints

### 1. Are routes organized clearly?
**Yes.** The Next.js App Router is well-utilized. The `(dashboard)` route group effectively isolates the core application from `/auth` and public routes, allowing for shared layouts and centralized middleware/context handling. 

### 2. Are server actions separated by domain?
**Yes, but flat.** Server actions are correctly split into domain-specific files (`auth.ts`, `drafts.ts`, `generate.ts`, `publish.ts`, `settings.ts`) inside `src/actions/`. This is perfectly adequate for Milestone 1. However, for a large-scale SaaS, maintaining a flat `/actions` directory can become cluttered.

### 3. Are components grouped by feature?
**Excellent.** Components are strictly grouped by domain (`auth/`, `dashboard/`, `drafts/`, `generate/`, `settings/`, `ui/`, `layout/`). This prevents a monolithic `components/` folder and makes finding feature-specific UI elements trivial.

### 4. Are configs centralized?
**Partially.** Navigation config is perfectly centralized in `src/config/navigation.ts`. However, Environment Variables lack a centralized, Zod-validated configuration file (e.g., `src/config/env.ts`), which is a SaaS best practice to catch missing secrets at boot time rather than runtime.

### 5. Are integrations isolated?
**Highly Isolated.** Third-party logic is exceptionally well-structured. The `PublishingAdapter` pattern in `src/lib/publishing/` abstracts Buffer away from the core application logic. `src/lib/openai/` is similarly decoupled.

### 6. Is Single Owner Mode cleanly separated?
**Yes.** The logic is neatly contained within `src/lib/owner-context.ts` and `src/lib/supabase/admin.ts`. It acts as an abstraction layer (`getDbClient`, `requireOwner`) that prevents the rest of the application from needing to know whether it is in single-user or multi-user mode.

### 7. Is the project ready for Milestone 2?
**Yes.** The foundation is highly modular, strongly typed, and secure. It is completely ready for the complexities of Milestone 2 (Scheduling, Multi-Platform, Analytics).

---

## 2. Current Structure Overview

```text
src/
├── actions/         # Flat domain actions
├── app/             # Next.js router (organized by route groups)
├── components/      # Grouped by feature/domain
├── config/          # Centralized static configs
├── hooks/           # Custom React hooks (empty/sparse)
├── lib/             # Core utilities and integrations
│   ├── buffer/
│   ├── encryption/
│   ├── openai/
│   ├── publishing/  # Adapter pattern implementation
│   └── supabase/
├── prompts/         # LLM Prompt registry
└── types/           # Global type definitions (dumping ground)
```

---

## 3. Recommended Structure (For Scalable SaaS / Milestone 2)

As the application grows, transitioning slightly towards a **Feature-Sliced Design (FSD)** or **Domain-Driven Directory** is recommended.

```text
src/
├── app/                    # Strictly routing and page entry points
├── components/
│   ├── ui/                 # Dumb, reusable shadcn components
│   └── layout/             # Global layouts (sidebar, navbar)
├── config/
│   ├── navigation.ts       
│   └── env.ts              # ADDED: Zod environment validation
├── features/               # ADDED: Domain-driven modules
│   ├── content-generation/ # (Actions, Components, Types, Prompts for AI)
│   ├── draft-management/   # (Actions, Components, Types for Drafts)
│   └── brand-identity/     # (Actions, Components for Profiles)
├── lib/                    # Cross-cutting infrastructure
│   ├── encryption/
│   ├── publishing/
│   └── supabase/
└── types/                  # Split into specific domain files
```

---

## 4. Missing Folders
*   `src/config/env.ts`: For strict environment variable validation.
*   `tests/` or `e2e/`: Currently, the project lacks a dedicated directory for unit (Vitest/Jest) or end-to-end (Playwright/Cypress) tests.
*   `src/features/` (Optional): To group Actions, Components, and Types by domain if the codebase doubles in size.

## 5. Files to Move Later
1.  **`src/types/index.ts`** -> Split into `src/types/database.ts`, `src/types/models.ts`, etc. Currently, it acts as a catch-all.
2.  **`src/lib/owner-context.ts`** -> Could be moved into a dedicated `src/lib/auth/` directory to group it with other identity management logic.
3.  **`src/prompts/`** -> If moving to a feature-driven architecture, `generate-posts.ts` should live closer to the Generation feature module.

## 6. Refactor Risk
**Low.** 
The current codebase relies heavily on the `src/*` alias (`@/`). Moving files primarily requires updating import paths, which modern IDEs and TypeScript handle automatically. There is no business logic rewrite required to achieve the recommended structure.

## 7. Priority Order (For Milestone 2 Preparation)
1.  **Low Effort / High Impact:** Create `src/config/env.ts` with Zod to validate `process.env` at runtime startup.
2.  **Low Effort:** Split `src/types/index.ts` into specific domain files.
3.  **Medium Effort (Optional):** Migrate `src/actions` and `src/components/*` into a `src/features/*` domain-driven structure before adding Analytics and Scheduling.
