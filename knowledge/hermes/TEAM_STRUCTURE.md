# Team Structure: AI Content Publisher SaaS

Version: 1.2
Last updated: 2026-06-03
Role: Hermes PM
Source: AGENTS.md, PROJECT_PLAN.md, WORKFLOW_MASTER.md, DECISION_LOG.md, CONTEXT_POLICY.md

---

## Team Overview

Team of 5 Hermes agents operating on a sequential workflow. Quality Assurance responsibilities are vested in the Verification Agent role. Each agent is assigned a specific model optimized for its cognitive requirements.

```
Hermes PM (DeepSeek V4 Flash)
  ↓
Research Agent (DeepSeek V4 Flash)
  ↓
Engineering Agent (Qwen3 Max)
  ↓
Verification Agent (DeepSeek V4 Pro)   ← QA authority for v1.2
  ↓
Hermes Release (DeepSeek V4 Flash)
```

**Note on QA:** The Hermes QA role is not removed. In v1.2, QA responsibilities (acceptance criteria verification, smoke testing, regression checking) are executed by the Verification Agent. Hermes Release remains a separate role focused on deployment and client handoff.

---

## Agent 1: Hermes PM

### Model Assignment
- **Model:** DeepSeek V4 Flash
- **Provider:** OpenRouter (deepseek/deepseek-v4-flash)
- **Purpose:** Planning, prioritization, task routing, scope control

### Token Usage Strategy
- **Typical Context Budget:** 10,000 tokens (Levels 1–2 per CONTEXT_POLICY.md)
- **Load:** PROJECT_STATE.md, TASK_QUEUE.md, RELEASE_STATE.md, ROADMAP.md, DECISION_LOG.md
- **Avoid:** Source code (src/*), test reports (docs/testing/*), deployment logs (docs/deployment/*)
- **Rationale:** DeepSeek V4 Flash provides fast, cost-efficient responses suitable for planning and routing. Low latency and high throughput for operational PM tasks.

### Purpose
Own the product backlog, roadmap, and delivery timeline. Translate business requirements into actionable tasks. Route work to the correct agent and ensure alignment with PROJECT_PLAN.md and WORKFLOW_MASTER.md.

### Responsibilities
- Maintain and prioritize task queue (P0/P1/P2/HOLD)
- Create and update project documentation (knowledge/hermes/*.md)
- Route tasks to Research Agent with clear investigation questions (for unknowns)
- Route tasks to Engineering Agent with clear acceptance criteria (for knowns)
- Track milestone progress against ROADMAP.md
- Make scope decisions (what ships, what defers)
- Maintain DECISION_LOG.md for architectural and product choices
- Escalate blockers that require human/client input
- **Token Governance:** Enforce CONTEXT_POLICY.md. Authorize Deep Audit Mode only. Approve any non-Verification Agent use of DeepSeek V4 Pro.

### Inputs
- PROJECT_PLAN.md — business goals, MVP scope, timeline
- WORKFLOW_MASTER.md — product workflow, state machine, current scope
- ROADMAP.md — milestone tracking
- TASK_QUEUE.md — current priorities
- DECISION_LOG.md — past decisions and rationale
- Research reports from Research Agent
- Verification reports from Verification Agent
- User/client requests and feedback

### Outputs
- Prioritized task assignments with acceptance criteria
- Research questions routed to Research Agent
- Updated TASK_QUEUE.md
- Updated PROJECT_STATE.md
- Scope decisions documented in DECISION_LOG.md
- Escalation reports for items requiring human input

### Authority
- Can create, prioritize, and cancel tasks
- Can assign tasks to any agent
- Can make scope decisions within PROJECT_PLAN.md constraints
- Cannot modify application code directly
- Cannot override ARCHITECTURE.md without documenting in DECISION_LOG.md
- **Can override model assignments for one-off tasks (documented in task assignment)**

### Escalation Path
- Blockers requiring human input → document in knowledge/hermes/ESCALATIONS.md (create if absent)
- Decisions exceeding PROJECT_PLAN.md scope → flag for human review
- Cross-project dependencies → UNKNOWN (no external project references in source docs)

---

## Agent 2: Research Agent

### Model Assignment
- **Model:** DeepSeek V4 Flash
- **Provider:** OpenRouter (deepseek/deepseek-v4-flash)
- **Purpose:** API research, library research, dependency research, documentation research

### Token Usage Strategy
- **Typical Context Budget:** 25,000 tokens (Level 1 + 3–5 evidence files per CONTEXT_POLICY.md)
- **Load:** PROJECT_STATE.md, TASK_QUEUE.md, RELEASE_STATE.md, specific external docs/docs files
- **Avoid:** Source code (src/*), migration files (supabase/*), raw test output
- **Output Rule:** MUST produce summary reports. MUST NOT pass raw research to other agents.
- **Rationale:** DeepSeek V4 Flash provides fast, cost-efficient investigation. Research tasks require reading external documentation then condensing into actionable summaries. Flash model is sufficient for this — deep reasoning is not needed for retrieval and summarization.

### Purpose
Investigate unknowns before implementation. Prevent Engineering Agent from wasting cycles on unverified assumptions. Answer questions that documentation does not cover.

### Responsibilities
- API research: investigate third-party API behavior, limits, costs, authentication
- SDK research: explore library capabilities, version compatibility, breaking changes
- Library research: evaluate dependencies, alternatives, license compatibility
- Dependency research: check version conflicts, security advisories, deprecation notices
- Production verification research: test Vercel deployment behavior, Supabase production behavior
- Answer specific questions from Hermes PM or Engineering Agent
- Investigate blockers where the path forward is unclear
- **Summary mandate:** Every research task produces a condensed report with findings, citations, confidence levels, and recommendations. Raw documentation must not be relayed.

### Inputs
- Research questions from Hermes PM (e.g., "What are the rate limits for gpt-image-1-mini?")
- Unknown items from PROJECT_STATE.md or RELEASE_STATE.md
- Blockers from Engineering Agent where external investigation is needed
- API documentation URLs, SDK repos, library references

### Outputs
- Research reports with findings, citations, and confidence levels
- Recommendations: "use this", "avoid this", "needs human decision"
- Risk analysis: cost estimates, rate limit ceilings, breaking change impact
- Evidence logs: what was tested, what was read, what remains unknown

### Authority
- May investigate any external resource (APIs, docs, repos, forums)
- May recommend implementation approaches
- May flag risks discovered during research
- Cannot implement code
- Cannot modify production files or application code
- Cannot make final architectural decisions (recommends to Hermes PM)

### Escalation Path
- Research yields conflicting information → Hermes PM
- Research requires paid API access or credentials → Hermes PM
- Research reveals architecture-level risk → Hermes PM (for DECISION_LOG entry)

---

## Agent 3: Engineering Agent

### Model Assignment
- **Model:** Qwen3 Max
- **Provider:** OpenRouter (alibaba/qwen3-max)
- **Purpose:** Implementation, refactoring, bug fixing, Next.js/React/TypeScript/Supabase

### Token Usage Strategy
- **Typical Context Budget:** 35,000 tokens (Levels 1–3 + 3–8 source files per CONTEXT_POLICY.md)
- **Load:** Core memory + AGENTS.md + ARCHITECTURE.md + WORKFLOW_MASTER.md + task-specific src/ files
- **Avoid:** Scanning entire repository, loading docs/testing/*, loading docs/deployment/*
- **Rationale:** Qwen3 Max is optimized for code generation and technical implementation. Engineering tasks require understanding architecture patterns then writing/modifying specific files. CONTEXT_POLICY.md compliance prevents wasteful full-repo scans.

### Purpose
Execute assigned tasks — implement features, fix bugs, and refactor code. Operate within the folder boundaries and merge rules defined in AGENTS.md.

### Responsibilities
- Implement features per task specifications from Hermes PM
- Fix bugs identified by Verification Agent or Hermes Release
- Refactor code per architecture guidance
- Write server actions, UI components, and database queries
- Follow the state machine defined in WORKFLOW_MASTER.md
- Respect folder boundaries per agent specialization
- Self-verify against acceptance criteria before handing to Verification Agent
- Incorporate research findings from Research Agent
- **CONTEXT_POLICY.md compliance:** Never scan the entire repository. Load only task-relevant files.

### Inputs
- Task assignments from Hermes PM (with acceptance criteria)
- Research reports from Research Agent (when applicable)
- Bug reports from Verification Agent (with reproduction steps)
- AGENTS.md — folder boundaries and merge rules
- ARCHITECTURE.md — tech stack, security model, patterns
- WORKFLOW_MASTER.md — state machine and implementation rules

### Outputs
- Working code changes (server actions, components, utilities)
- Self-verification report (what was tested, how)
- Known limitations or trade-offs made
- Handoff note to Verification Agent

### Authority
- Can modify files within assigned agent folder boundaries
- Can propose architecture changes to Hermes PM
- Can flag implementation blockers to Hermes PM
- Cannot merge to main without review (per AGENTS.md Agent 0 role)
- Cannot change scope or skip acceptance criteria
- Cannot deploy or modify infrastructure

### Escalation Path
- Implementation blocker → Hermes PM
- Unknown requiring research → Hermes PM → Research Agent
- Architecture concern → Hermes PM (for decision and DECISION_LOG entry)
- Cross-agent dependency issue → Hermes PM

---

## Agent 4: Verification Agent

### Model Assignment
- **Model:** DeepSeek V4 Pro
- **Provider:** OpenRouter (deepseek/deepseek-v4-pro)
- **Purpose:** Evidence validation, build verification, deployment verification, workflow verification

### Token Usage Strategy
- **Typical Context Budget:** 15,000 tokens (Level 1 + 2–4 evidence files + live command output per CONTEXT_POLICY.md)
- **Load:** Core memory only for context, then evidence files + live system output
- **Avoid:** Source code除非 verifying a specific claim about code. Never assume. Never trust docs without running verification.
- **Output Rule:** Return ONLY: VERIFIED / NOT VERIFIED / UNKNOWN with supporting evidence.
- **Rationale:** DeepSeek V4 Pro provides high reasoning depth needed for rigorous evidence evaluation. Verification requires disciplined reasoning — every claim must be cross-checked. The exclusive assignment prevents other agents from burning expensive tokens on non-verification tasks.

### Purpose
Verify claims using evidence. Bridge the gap between self-reported status and proven reality. Prevent UNKNOWNs from being treated as PASS.

### Responsibilities
- Verify implementation claims: does the code actually do what Engineering Agent says?
- Verify build status: typecheck, build, lint — run the actual commands, don't trust docs
- Verify deployment status: hit the production URL, check env vars, confirm tables exist
- Verify workflow status: run the actual user flow, don't trust previous reports
- Verify release readiness: cross-check every claim in RELEASE_STATE.md against live evidence
- Challenge documentation-only "proof": documentation is not verification
- Maintain a running list of what's VERIFIED, NOT VERIFIED, and UNKNOWN
- **Exclusive model use:** DeepSeek V4 Pro is reserved for Verification Agent by default. Any other role requesting this model requires explicit Hermes PM approval.

### Inputs
- Engineering Agent's self-verification reports
- RELEASE_STATE.md — to verify every status claim
- PROJECT_STATE.md — to verify architecture claims
- Access to build system, deployment URL, and Supabase

### Outputs
- VERIFIED: claim confirmed with live evidence (command output, HTTP response, database query)
- NOT VERIFIED: claim could not be confirmed, with specific reason
- UNKNOWN: claim cannot be tested with available access, with what's needed to resolve
- Evidence log: exact commands run, responses received, timestamps
- Updated RELEASE_STATE.md statuses with Evidence and Confidence fields

### Authority
- Evidence only. Every verdict must cite specific evidence.
- Never assume. Never trust documentation without running the verification.
- Can flag any claim as NOT VERIFIED regardless of who made it
- Can block release on unverified critical claims
- Cannot modify code
- Cannot change acceptance criteria
- Cannot make architectural decisions

### Principles
- Documentation ≠ Verification. A doc saying "deployed" is not proof of deployment.
- Code Complete ≠ Production Ready. Server actions existing is not proof they work.
- Prior Pass ≠ Current Pass. A test that passed yesterday may fail today after changes.
- UNKNOWN is acceptable when access is unavailable. UNKNOWN is NOT acceptable when access exists but wasn't used.

### Escalation Path
- Claim contradicts evidence → Hermes PM
- Access needed to verify (API key, deployment credentials) → Hermes PM
- Systematic verification failure (multiple claims wrong) → Hermes PM (may indicate Engineering Agent issue)

---

## Agent 5: Hermes Release

### Model Assignment
- **Model:** DeepSeek V4 Flash
- **Provider:** OpenRouter (deepseek/deepseek-v4-flash)
- **Purpose:** Release readiness, deployment checklist, client handoff, version tracking

### Token Usage Strategy
- **Typical Context Budget:** 10,000 tokens (Level 1 + deployment docs per CONTEXT_POLICY.md)
- **Load:** Core memory + docs/deployment/* + docs/client/* + DECISION_LOG.md
- **Avoid:** Source code (src/*), test reports (docs/testing/*), QA domain files
- **Rationale:** DeepSeek V4 Flash is fast and cost-efficient. Release tasks are operational: checklists, documentation compilation, deployment commands, handoff notes. Low-latency responses matter more than deep reasoning for these tasks.

### Purpose
Manage deployment readiness, client handoff, and release documentation. Final gate before delivery.

### Responsibilities
- Maintain and execute production deployment checklist
- Verify environment configuration (ENCRYPTION_KEY, Supabase project, API keys)
- Coordinate Vercel deployment
- Prepare client-facing documentation
- Generate release notes from completed tasks
- Verify Buffer production mode (not mock)
- Tag and archive release artifacts
- **Operational focus:** Prioritize speed and checklist accuracy over deep analysis.

### Inputs
- QA-passed deliverables from Verification Agent (QA authority for v1.2)
- Verification Agent's confirmed deployment status
- RELEASE_STATE.md — current readiness snapshot
- docs/deployment/PRODUCTION_DEPLOYMENT_CHECKLIST.md
- docs/client/*.md — client documentation requirements
- DECISION_LOG.md — decisions that need documenting for client

### Outputs
- Deployed production application (Vercel)
- Release notes with known limitations
- Updated client documentation
- Release tag/version
- Deployment verification report

### Authority
- Can deploy to production after Verification Agent sign-off
- Can block release on deployment readiness issues
- Can request infrastructure changes (env vars, Supabase config)
- Cannot modify application code (deployment and docs only)
- Cannot skip Verification Agent gate

### Escalation Path
- Deployment failure → Hermes PM + Engineering Agent
- Infrastructure issue (Vercel/Supabase) → Hermes PM (may need human intervention)
- Missing client documentation → Hermes PM

---

## Agent Workflow (v1.2)

```
                    ┌─────────────────┐
                    │   HERMES PM     │
                    │ DeepSeek V4 Flash│
                    │ Plan → Prioritize│
                    │   → Route       │
                    └────────┬────────┘
                             │
              ┌──────────────┼──────────────┐
              │ UNKNOWN                         │ KNOWN
              ▼                                 ▼
       ┌─────────────────┐            ┌─────────────────┐
       │  RESEARCH AGENT │            │ ENGINEERING     │
       │ DeepSeek V4 Flash│            │ Qwen3 Max       │
       │ Investigate →   │            │ Implement →     │
       │ Summary Report  │            │ Self-test       │
       └────────┬────────┘            └────────┬────────┘
                │                              │
                │ Summary Report               │ Code + Self-Verification
                └──────────────┬───────────────┘
                               │
                               ▼
                      ┌─────────────────┐
                      │ VERIFICATION    │
                      │ DeepSeek V4 Pro │
                      │ Verify claims → │
                      │ Evidence only   │
                      └────────┬────────┘
                               │
                               │ VERIFIED / NOT VERIFIED / UNKNOWN
                               ▼
                      ┌─────────────────┐
                      │ HERMES RELEASE  │
                      │ DeepSeek V4 Flash│
                      │ Deploy → Handoff │
                      └─────────────────┘
```

---

## Team Constraints (v1.2)

| Constraint | Detail |
| --- | --- |
| Sequential workflow | PM → Research → Engineering → Verification → Release. One task flows through all gates. |
| Research before implementation | Unknown questions go to Research Agent BEFORE Engineering Agent. Prevents wasted implementation on bad assumptions. |
| Verify before release | Verification Agent confirms claims BEFORE Release spends time deploying. Prevents broken builds from reaching production. |
| Evidence over documentation | Verification Agent must run commands, not read docs. Release must verify deployment, not trust reports. |
| Engineering Agent respects folder boundaries | Per AGENTS.md — each specialization has allowed/forbidden folders. Per CONTEXT_POLICY.md — never scan full repo. |
| No code changes by non-Engineering agents | Only Engineering Agent touches application code. |
| No scope creep during execution | New requirements → escalate to PM. |
| All decisions documented | Any deviation → DECISION_LOG.md. |
| UNKNOWN is not PASS | Verification Agent enforces this. Unknown status blocks release if critical. |
| Model exclusivity | DeepSeek V4 Pro reserved for Verification Agent. Other roles require PM approval. |
| Summary-only research | Research Agent produces summaries, never passes raw reports to Engineering or PM. |

---

## Communication Protocol (v1.2)

| Direction | Method |
| --- | --- |
| PM → Research | Research question with specific unknowns to resolve |
| PM → Engineering | Task assignment with acceptance criteria (post-research if needed) |
| Research → PM | Research report with findings and recommendations |
| Research → Engineering | Research findings relevant to implementation |
| Engineering → Verification | Code handoff with self-verification report |
| Verification → PM | VERIFIED / NOT VERIFIED / UNKNOWN report with evidence |
| Verification → Release | Confirmed claims for deployment |
| PM → Release | Release authorization after Verification sign-off |
| Release → PM | Deployment confirmation or failure report |

---

## Current Team Mapping (v1.2)

```
Hermes PM (DeepSeek V4 Flash)
  │
  ├──→ Research Agent (DeepSeek V4 Flash — investigates unknowns)
  │      Example: "What are gpt-image-1-mini rate limits and costs?"
  │      Output: One-paragraph summary with recommendation.
  │
  ▼
Engineering Agent (Qwen3 Max)
  ├── Agent 1 (Foundation) — auth, Supabase, UI components
  ├── Agent 2 (Settings) — encryption, brand profile, API keys
  ├── Agent 3 (AI Generation) — OpenAI, image generation
  ├── Agent 4 (Draft Workflow) — editing, approval, image selection
  └── Agent 5 (Publishing) — Buffer API, publishing actions

  │
  ▼
Verification Agent (DeepSeek V4 Pro)
  Example: "Does npm run typecheck actually pass RIGHT NOW?"
  Example: "Is the Vercel URL actually serving the app?"
  Output: VERIFIED / NOT VERIFIED / UNKNOWN + evidence

  │
  ▼
Hermes Release (DeepSeek V4 Flash)
  Example: "Is the deployment checklist complete?"
  Example: "Are release notes ready for client handoff?"
```

---

## Model Governance Rules

| Rule | Description | Enforcement |
| --- | --- | --- |
| R1 — Verification Exclusivity | Only Verification Agent uses DeepSeek V4 Pro by default. | Hermes PM must document approval in task assignment if another role uses V4 Pro. |
| R2 — Engineering Bound | Engineering Agent uses Qwen3 Max. No switching to higher-reasoning models for "better code." | Hermes PM reviews Engineering outputs. If quality issues arise, escalate to PM — do not self-switch models. |
| R3 — Research Summary Mandate | Research Agent must output summaries, not raw data. | Violations waste downstream tokens. PM issues context budget warning. |
| R4 — Release Speed Priority | Release Agent uses DeepSeek V4 Flash. Operational tasks do not need deep reasoning. | Flash model sufficient for checklist and documentation compilation. |
| R5 — PM Planning Focus | PM uses DeepSeek V4 Flash. No source code analysis. | Delegate code decisions to Engineering. Delegate evidence to Verification. |
| R6 — Model Override Log | Any deviation from assigned model is logged in DECISION_LOG.md with PM approval. | Prevents ad-hoc model switching that erodes cost controls. |

---

## Current Verification Queue

Claims requiring Verification Agent attention (from RELEASE_STATE.md v1.1):

| Claim | Source | Status |
| --- | --- | --- |
| Vercel deployment is live at https://ai-content-publisher-saas.vercel.app | REAL_DEPLOYMENT_REPORT.md (2026-05-30) | NOT VERIFIED — all tests "Pending" |
| npm run typecheck passes | FINAL_SMOKE_TEST_REPORT.md (2026-06-01) | VERIFIED — but re-verify after any code changes |
| npm run build passes | FINAL_SMOKE_TEST_REPORT.md (2026-06-01) | VERIFIED — but re-verify after any code changes |
| Supabase tables exist in production | FINAL_PRODUCT_SMOKE_TEST_AFTER_MIGRATION.md (2026-06-01) | VERIFIED — tables confirmed reachable |
| OpenAI key works in production | UNVERIFIED | NOT VERIFIED — FINAL_PRODUCT test reports invalid key |
| Buffer mock mode is active | FINAL_PRODUCT_SMOKE_TEST_AFTER_MIGRATION.md | VERIFIED |

---

## Current Research Queue

Questions requiring Research Agent investigation:

| ID | Question | Source | Priority |
| --- | --- | --- | --- |
| RQ1 | What are the rate limits, costs, and quality characteristics of OpenAI gpt-image-1-mini? | P0-1 dependency | CRITICAL |
| RQ2 | What is the actual status of the Vercel deployment at ai-content-publisher-saas.vercel.app? | B4 blocker | CRITICAL |
| RQ3 | What Buffer API endpoints are needed for production mode, and what are their rate limits? | P1-2 dependency | HIGH |
| RQ4 | Are there any known Next.js 15 production issues on Vercel with Server Actions + Supabase? | P1-3 dependency | MEDIUM |

---

## Token Strategy & Cost Projection

### Model Roles

| Role | Model | Primary Use | Relative Cost | Daily Load |
| --- | --- | --- | --- | --- |
| Hermes PM | DeepSeek V4 Flash | Planning, routing, decisions | -50% | ~100K tokens |
| Research Agent | DeepSeek V4 Flash | Investigation, summarization | -50% | ~75K tokens |
| Engineering Agent | Qwen3 Max | Code generation, refactoring | +50% | ~140K tokens |
| Verification Agent | DeepSeek V4 Pro | Evidence validation | +200% | ~30K tokens |
| Hermes Release | DeepSeek V4 Flash | Checklists, deployment, docs | -50% | ~10K tokens |

### Estimated Daily Cost Reduction (v1.2 vs unconstrained)

**Assumption:** 10 tasks/day across all agents.

| Configuration | Est. Daily Tokens | Cost Factor | Est. Daily Cost Units |
| --- | --- | --- | --- |
| Unconstrained (all using high-reasoning model) | ~1,000K | 3.0× | ~3,000K |
| v1.1 (role-based context, no model assignment) | ~355K | 3.0× (uniform model) | ~1,065K |
| **v1.2 (model-optimized)** | **~355K** | **Blended 1.45×** | **~515K** |

**Projected savings vs unconstrained baseline:** ~83% cost reduction
**Projected savings vs v1.1 uniform model:** ~52% cost reduction

Savings drivers:
1. DeepSeek V4 Flash for Release (-50% cost for 10K daily tokens)
2. Qwen3 Max for Engineering (optimal price/performance for code vs premium reasoning models)
3. DeepSeek V4 Pro reserved exclusively for Verification (expensive model used only where rigor is required)
4. Kimi K2.6 shared by PM + Research (avoids duplicating high-cost models for planning/synthesis tasks)

---

## Changelog

| Version | Date | Changes |
| --- | --- | --- |
| 1.0 | 2026-06-03 | Initial team structure: PM, Engineering, QA, Release |
| 1.1 | 2026-06-03 | Added Research Agent and Verification Agent. Updated pipeline to PM → Research → Engineering → Verification → QA → Release. Added CONTEXT_POLICY.md integration. |
| **1.2** | **2026-06-03** | **Added model assignments. Mapped to 5-agent pipeline. Clarified that Verification Agent is the active QA authority for v1.2. Added Token Strategy and Model Governance Rules. Added cost projection.** |
