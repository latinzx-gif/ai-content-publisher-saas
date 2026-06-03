# Project State: AI Content Publisher SaaS

Last updated: 2026-06-03
Source: PROJECT_PLAN.md, ARCHITECTURE.md, AGENTS.md, WORKFLOW_MASTER.md

## Project Identity

| Field | Value |
| --- | --- |
| Name | AI Content Publisher SaaS |
| Type | AI content generation + social publishing platform |
| Target Users | Creators and brands producing persona-aligned social media content |
| Business Model | BYOK (Bring Your Own Key) — users supply own OpenAI + Buffer keys |

## Current Timeline

| Milestone | Status | Original Target |
| --- | --- | --- |
| V1.0 (MVP) | **RELEASED** | June 5, 2026 |
| V1.1 | **PLANNING** | Post-V1.0 |

Per PROJECT_PLAN.md 8-Day Timeline:
- Days 1-6: Foundation, Auth, Settings, Generation, Drafts, Publishing — COMPLETE
- Day 7: End-to-End Testing, Bug Squashing, QA — COMPLETE
- Day 8: Documentation Finalization & Production Deployment — COMPLETE

## Current Scope (V1.0 Delivered)

Per V1_1_EXECUTION_PLAN.md:

### Completed
- Generate Text (OpenAI, 4 languages, URL scraping)
- Platform / Format / Word Count metadata
- Draft Review UI
- Text Approval (draft → text_approved)
- Buffer/Facebook Publishing (mock mode)

### In Progress
- Generate 1-3 image options (OpenAI gpt-image-1-mini) — server actions exist, UNTESTED
- Select image — server action exists, UNTESTED
- Approve Creative — server action exists, UNTESTED
- Basic Calendar visibility — static mock UI only

### Hold / Phase 2
- Campaign Factory Backend
- 30-day planner
- Queue workers
- Multi-platform publishing (direct IG, LinkedIn, etc.)
- Google Drive integration
- Obsidian integration
- Analytics and reporting

## Architecture Snapshot

| Component | Technology | Status |
| --- | --- | --- |
| Frontend | Next.js 15 (App Router), RSC, Tailwind, shadcn/ui | IMPLEMENTED |
| Backend | Next.js Server Actions | IMPLEMENTED |
| Database | Supabase (PostgreSQL + RLS) | IMPLEMENTED |
| Auth | Supabase Auth | IMPLEMENTED |
| Encryption | AES-256-GCM (decrypt-on-server only) | IMPLEMENTED |
| AI Generation | OpenAI GPT-4o (text), gpt-image-1-mini (images) | TEXT: VERIFIED, IMAGE: UNTESTED |
| Publishing | Buffer API (adapter pattern) | MOCK MODE ONLY |
| i18n | TH/EN (language-provider) | IMPLEMENTED |
| App Mode | single_owner (APP_MODE=single_owner) | IMPLEMENTED |

## Agent Team (from AGENTS.md)

| Agent | Role | Status |
| --- | --- | --- |
| Agent 0 | Technical Lead | Active |
| Agent 1 | Foundation (Auth, Supabase, UI shell) | Deliverables complete |
| Agent 2 | Settings (API keys, encryption, brand profile) | Deliverables complete |
| Agent 3 | AI Generation (OpenAI integration) | Text complete, images in progress |
| Agent 4 | Draft Workflow (edit, approve, review) | Deliverables complete |
| Agent 5 | Publishing (Buffer integration) | Mock mode complete |

## Database Tables

Per ARCHITECTURE.md Section 3:
- profiles — user identity
- brands — tone, personality, image_rules, content_rules
- integrations — encrypted API keys (provider + encrypted_value)
- content_posts — generated posts with status and metadata
- workflow_logs — audit trail

## Post Lifecycle State Machine

Per WORKFLOW_MASTER.md Section 3:
```
draft → text_approved → images_pending → images_ready → creative_approved → scheduled → published → failed
```
Text-only bypass: text_approved → published (creative_status = 'not_required')

## Known Unknowns

| Item | Detail |
| --- | --- |
| Image pipeline reliability | Server actions written but zero end-to-end tests with real OpenAI image generation |
| OpenAI image cost/latency | gpt-image-1-mini costs and response times UNKNOWN |
| Buffer real API behavior | Only mock mode tested |
| Calendar backend | No server actions for calendar data — UI is 100% static |
| Production deployment status | No evidence of Vercel deploy or production Supabase config |
| CI/CD pipeline | UNKNOWN — no CI config files observed |