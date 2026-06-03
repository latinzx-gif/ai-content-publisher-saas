# Decision Log: AI Content Publisher SaaS

Last updated: 2026-06-03
Source: PROJECT_PLAN.md, ARCHITECTURE.md, AGENTS.md, WORKFLOW_MASTER.md

---

## D001 — BYOK Model (Bring Your Own Key)

Date: Early planning (per ARCHITECTURE.md)
Decision: Users supply their own OpenAI and Buffer API keys. The platform encrypts and stores them; never proxies through a shared key.
Rationale: Reduces platform cost, avoids rate-limit contention, shifts API liability to users.
Impact:
- AES-256-GCM encryption required for all stored keys
- Decryption must happen server-side only, never in client state
- Users must have valid keys to use any AI or publishing features

---

## D002 — Server Actions Only (No API Routes)

Date: Early planning (per ARCHITECTURE.md)
Decision: All mutations and external API calls happen exclusively through Next.js Server Actions. No REST API routes for business logic.
Rationale: Simplifies auth (cookie-based), reduces attack surface, keeps secrets server-side.
Impact:
- No /api/ endpoints for generation or publishing
- Client components only handle form state and optimistic UI
- All OpenAI and Buffer calls originate from server context

---

## D003 — Supabase + RLS for Data Isolation

Date: Early planning (per ARCHITECTURE.md)
Decision: Supabase (PostgreSQL) with Row Level Security on every table. Triggers auto-populate profiles on signup.
Rationale: Strong tenant isolation without application-level filtering.
Impact:
- Every table query implicitly scoped to authenticated user
- No cross-user data leakage possible at database level
- Single-owner mode (APP_MODE=single_owner) simplifies initial deployment

---

## D004 — AES-256-GCM Encryption Format

Date: Early planning (per ARCHITECTURE.md Section 4)
Decision: API keys stored as `iv:authTag:ciphertext` using AES-256-GCM authenticated encryption.
Rationale: Industry standard for secret storage. Authenticated encryption prevents tampering.
Impact:
- ENCRYPTION_KEY must be set in environment
- Decryption is server-action-only by convention
- Keys never serialized to client-side state

---

## D005 — 6-Agent Development Team Structure

Date: Early planning (per AGENTS.md)
Decision: Split development into 6 specialized agents (Technical Lead, Foundation, Settings, AI Generation, Draft Workflow, Publishing) with strict folder boundaries.
Rationale: Parallel development, clear ownership, no merge conflicts from overlapping file access.
Impact:
- Each agent has allowed/forbidden folders
- Agent 0 (Technical Lead) controls main branch and approves PRs
- Merge rules enforced per agent (tests required, connection verification, etc.)

---

## D006 — Post Lifecycle State Machine

Date: Per WORKFLOW_MASTER.md
Decision: Posts must progress through a strict sequential state machine. No skipping states.
States: draft → text_approved → images_pending → images_ready → creative_approved → scheduled → published → failed
Exception: text_only format bypasses image states (text_approved → published directly).
Rationale: Predictable workflow, clear gates for approval, audit trail.
Impact:
- Every status transition is enforced in server actions
- workflow_logs table records every action
- Cannot publish before creative_approved (unless text_only)

---

## D007 — June 5 Scope Freeze

Date: Per WORKFLOW_MASTER.md Section 4-5
Decision: For June 5 delivery, only complete: text pipeline, image pipeline, basic calendar. Everything else is Phase 2.
Rationale: Realistic scope for remaining timeline.
Items explicitly deferred:
- Campaign Factory Backend
- 30-day planner
- Queue workers
- Multi-platform publishing (direct IG, LI, YT)
- Google Drive integration
- Obsidian integration
- Analytics and reporting

---

## D008 — Publishing Adapter Pattern

Date: Per ARCHITECTURE.md Section 5 and publishing/index.ts
Decision: Use a Strategy/Adapter pattern for publishing. Buffer is the primary adapter; Facebook, Instagram, LinkedIn are placeholders.
Rationale: Easy to add new platforms without changing publishing workflow.
Current state:
- Buffer: Implemented (mock mode)
- Facebook: PlaceholderAdapter ("not implemented yet")
- Instagram: PlaceholderAdapter ("not implemented yet")
- LinkedIn: PlaceholderAdapter ("not implemented yet")

---

## D009 — Single Owner Mode

Date: Per codebase (owner-context.ts)
Decision: First deployment uses APP_MODE=single_owner. One user, no multi-tenancy complexity.
Rationale: Simplifies initial delivery. Multi-user can be added later.
Impact:
- requireOwner() returns the single authorized user
- UI does not show user switching or team features
- Database still has user_id columns for future multi-tenancy

---

## D010 — Metadata in JSONB Column

Date: Per WORKFLOW_MASTER.md Section 6
Decision: Store new attributes in content_posts.metadata JSONB column for June 5 delivery. Avoid new migrations unless absolutely required.
Rationale: Speed — schema changes require migration testing and risk breaking existing data.
Impact:
- All post attributes (title, caption, hashtags, platform, image data, etc.) live in metadata
- Schema evolution deferred to Phase 2

---

## D011 — i18n: Thai Primary, English Secondary

Date: Per codebase (language-provider.tsx, generate.ts)
Decision: Support TH and EN languages. Generation supports TH, EN, CN, JP but UI only shows TH/EN.
Rationale: Primary market is Thai legal/content creators. English for international reach.
Impact:
- All UI strings have TH/EN mappings
- Content generation supports 4 languages
- Calendar and Asset Composer mocks include TH/EN translations

---

## Pending Decisions (No Record Found)

| ID | Question | Status |
| --- | --- | --- |
| PD01 | Real Buffer credentials: when to switch from mock to production? | UNKNOWN |
| PD02 | Vercel deployment configuration (project name, domain, env vars)? | UNKNOWN |
| PD03 | OpenAI image model choice: gpt-image-1-mini confirmed or experimental? | UNKNOWN |
| PD04 | Calendar scheduling: store schedules in content_posts or new table? | UNKNOWN |
| PD05 | Client handoff process and documentation requirements? | UNKNOWN |

---

## D006 — Model Assignment Reconfiguration (v1.3)

**Date:** 2026-06-03  
**Decision:** Reassigned models across Hermes OS agents per user request:

| Role | Previous Model | New Model | Rationale |
| --- | --- | --- | --- |
| Hermes PM | Kimi K2.6 | DeepSeek V4 Flash | PM tasks are operational (planning, routing) — flash model is fast and cost-efficient. Deep reasoning not needed. |
| Research Agent | Kimi K2.6 | DeepSeek V4 Flash | Research is retrieval + summarization. Flash model sufficient — deep reasoning adds cost without benefit. |
| Engineering Agent | Qwen3 Max | Qwen3 Max *(unchanged)* | Code generation requires higher reasoning capability. No change. |
| Verification Agent | DeepSeek V4 Pro | DeepSeek V4 Pro *(unchanged)* | Evidence validation requires highest reasoning depth. No change. |
| Release Agent | DeepSeek V4 Flash | DeepSeek V4 Flash *(unchanged)* | Already on flash. No change. |

**Cost impact:** Two roles moved from standard-cost Kimi K2.6 to low-cost DeepSeek V4 Flash. Estimated additional daily savings of ~25-30% on PM + Research token consumption vs previous configuration.  
**Files updated:** `TEAM_STRUCTURE.md`, `AGENT_ROLES.md`
| PD06 | Monitoring/error tracking (Sentry, Logtail, etc.)? | UNKNOWN |