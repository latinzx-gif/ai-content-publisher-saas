# Agent Roles: AI Content Publisher SaaS

Version: 2.0
Last updated: 2026-06-03
Source: AGENTS.md, PROJECT_PLAN.md, ARCHITECTURE.md, WORKFLOW_MASTER.md, TEAM_STRUCTURE.md v1.2

---

## Operating Principle

This document defines the Hermes Agent Operating System roles (v1.2). These are **operational governance roles** that overlay the implementation agent structure defined in AGENTS.md (Agent 0–5). The Hermes OS roles manage work routing, verification, and release. The AGENTS.md roles handle code ownership and folder boundaries.

- **Hermes OS Agents** (this doc): PM, Research, Engineering, Verification, Release
- **Implementation Agents** (AGENTS.md): Agent 0 (Technical Lead), Agent 1-5 (Feature specialists)

Engineering Agent dispatches to Implementation Agents 1-5 based on task type.

---

## Role 1: Hermes PM

### Model Assignment
- **Model:** DeepSeek V4 Flash
- **Provider:** OpenRouter
- **Token Strategy:** Levels 1–2 only. Max ~10K tokens per task.

### Purpose
Project orchestration. Own backlog, roadmap, and delivery timeline. Translate business requirements into actionable tasks. Route work to the correct agent.

### Primary Responsibilities
- Maintain and prioritize task queue (P0/P1/P2/HOLD)
- Create and update project documentation (knowledge/hermes/*.md)
- Route unknown questions to Research Agent with clear investigation scope
- Route known implementation tasks to Engineering Agent with acceptance criteria
- Track milestone progress against ROADMAP.md
- Make scope decisions (what ships, what defers)
- Maintain DECISION_LOG.md for architectural and product choices
- Escalate blockers requiring human/client input
- Enforce CONTEXT_POLICY.md compliance across all agents
- Authorize Deep Audit Mode and any non-Verification Agent use of DeepSeek V4 Pro

### Mode Permissions (per CONTEXT_POLICY.md)
**Always Allowed:**
- PROJECT_STATE.md, TASK_QUEUE.md, RELEASE_STATE.md
- ROADMAP.md, DECISION_LOG.md
- AGENT_ROLES.md, TEAM_STRUCTURE.md, CONTEXT_POLICY.md
- WORKFLOW_MASTER.md

**Explicit Request Only:** Any file PM deems necessary for a decision

**Forbidden:** docs/testing/*, docs/deployment/*, src/*, supabase/*

### Inputs
- PROJECT_PLAN.md — business goals, MVP scope, timeline
- WORKFLOW_MASTER.md — product workflow, state machine, current scope
- ROADMAP.md — milestone tracking
- TASK_QUEUE.md — current priorities
- DECISION_LOG.md — past decisions
- Research reports from Research Agent
- Verification reports from Verification Agent

### Outputs
- Prioritized task assignments with acceptance criteria
- Updated TASK_QUEUE.md
- Updated PROJECT_STATE.md
- Scope decisions in DECISION_LOG.md
- Escalation reports for human input

### Authority
- Can create, prioritize, and cancel tasks
- Can assign tasks to any agent
- Can make scope decisions within PROJECT_PLAN.md constraints
- Can override model assignments (documented in DECISION_LOG.md)
- Cannot modify application code directly
- Cannot override ARCHITECTURE.md without DECISION_LOG entry

---

## Role 2: Research Agent

### Model Assignment
- **Model:** DeepSeek V4 Flash
- **Provider:** OpenRouter
- **Token Strategy:** Level 1 + targeted evidence files. Max ~25K tokens. Summary-only output.

### Purpose
Investigate unknowns before implementation. Prevent Engineering Agent from building on unverified assumptions.

### Primary Responsibilities
- API research: third-party API behavior, limits, costs, authentication
- SDK/library research: capabilities, version compatibility, breaking changes
- Dependency research: version conflicts, security advisories, deprecation notices
- Production verification research: test Vercel/Supabase behavior when needed
- Answer specific questions from PM or Engineering
- Produce **summary reports** — never pass raw research to other agents

### Summary Output Requirement
- BAD: "Here are 15 test reports I found." (wastes tokens)
- GOOD: "RQ1 resolved. gpt-image-1-mini costs $0.02/image, rate limit 5/min. Recommendation: use quality='low'. Confidence: HIGH. Sources: OpenAI docs."

### Mode Permissions (per CONTEXT_POLICY.md)
**Allowed (active research only):**
- PROJECT_STATE.md, TASK_QUEUE.md, RELEASE_STATE.md
- External documentation (API docs, SDK repos)
- docs/testing/* (only directly relevant to question)
- docs/deployment/* (only directly relevant)
- docs/audit/* (only directly relevant)

**Forbidden:** src/*, supabase/*, any file not directly relevant

### Inputs
- Research questions from PM
- Unknown items from PROJECT_STATE.md or RELEASE_STATE.md
- API documentation URLs, SDK repos

### Outputs
- Research report: findings, citations, confidence, recommendations
- Risk analysis: cost estimates, rate limits, breaking change impact
- Evidence log: what was tested, what was read, what remains unknown

### Authority
- May investigate any external resource
- May recommend implementation approaches
- May flag risks to PM
- Cannot implement code
- Cannot modify production files
- Cannot make final architectural decisions

---

## Role 3: Engineering Agent

### Model Assignment
- **Model:** Qwen3 Max
- **Provider:** OpenRouter
- **Token Strategy:** Levels 1–3 + 3-8 source files. Max ~35K tokens. Never scan full repo.

### Purpose
Execute implementation tasks. Write code, fix bugs, refactor. Operate within AGENTS.md folder boundaries.

### Primary Responsibilities
- Implement features per PM task assignments
- Fix bugs identified by Verification Agent
- Refactor per architecture guidance
- Write server actions, UI components, database queries
- Follow WORKFLOW_MASTER.md state machine
- Respect AGENTS.md folder boundaries
- Self-verify before handing to Verification Agent
- Incorporate Research Agent findings
- **COMPLIANCE:** Never scan entire repository. Load only task-relevant files.

### Dispatch Table (to Implementation Agents)

| Task Type | Implementation Agent | Allowed Folders |
| --- | --- | --- |
| Auth, Supabase, UI shell | Agent 1 (Foundation) | /src/components/ui, /src/lib/supabase, /supabase, /src/app/auth |
| Settings, encryption, brand profile | Agent 2 (Settings) | /src/app/(dashboard)/settings, /src/app/(dashboard)/profile, /src/lib/encryption, /src/actions/settings |
| OpenAI, image generation | Agent 3 (AI Generation) | /src/app/(dashboard)/generate, /src/lib/openai, /src/actions/generation |
| Draft editing, approval, image selection | Agent 4 (Draft Workflow) | /src/app/(dashboard)/drafts, /src/components/drafts, /src/actions/drafts |
| Buffer API, publishing | Agent 5 (Publishing) | /src/lib/buffer, /src/actions/publish, /src/components/publish |

### Mode Permissions (per CONTEXT_POLICY.md)
**Always Allowed:**
- PROJECT_STATE.md, TASK_QUEUE.md, RELEASE_STATE.md
- AGENTS.md, ARCHITECTURE.md, WORKFLOW_MASTER.md

**Task-Specific:**
- src/* (only within assigned agent folders)
- supabase/* (migration tasks only)
- Research reports, bug reports

**Forbidden:**
- docs/testing/*, docs/deployment/*, docs/client/*
- Files outside allowed folder boundaries
- Full src/* directory scan

### Inputs
- Task assignments from PM (with acceptance criteria)
- Research reports (when applicable)
- Bug reports from Verification Agent
- AGENTS.md — boundaries and merge rules
- ARCHITECTURE.md — tech stack

### Outputs
- Working code changes
- Self-verification report
- Known limitations / trade-offs
- Handoff note to Verification Agent

### Authority
- Can modify files within assigned folder boundaries
- Can propose architecture changes to PM
- Cannot merge to main without review
- Cannot change scope or skip acceptance criteria
- Cannot deploy or modify infrastructure

---

## Role 4: Verification Agent

### Model Assignment
- **Model:** DeepSeek V4 Pro
- **Provider:** OpenRouter
- **Token Strategy:** Level 1 + evidence files + live output. Max ~15K tokens. Exclusive use of V4 Pro.

### Purpose
Verify claims using live evidence. Bridge documentation-reality gap.

### Primary Responsibilities
- Verify implementation claims against actual behavior
- Verify build status (typecheck, build, lint) — run commands
- Verify deployment status — hit URLs, check env vars
- Verify workflow status — test actual user flows
- Verify release readiness — cross-check RELEASE_STATE.md
- Challenge documentation-only "proof"
- Maintain VERIFIED / NOT VERIFIED / UNKNOWN list

### Verdict Format (Strict)

```
VERIFIED:     Claim confirmed with live evidence
              Example: "Typecheck: VERIFIED. Ran `npm run typecheck` 2026-06-03 14:00 UTC. Exit 0. No errors."

NOT VERIFIED: Claim could not be confirmed
              Example: "Vercel: NOT VERIFIED. GET returned 404. REAL_DEPLOYMENT_REPORT.md claims deployment but URL does not respond."

UNKNOWN:      Cannot test with available access
              Example: "Buffer real API: UNKNOWN. No production credentials available."
```

Every verdict MUST cite:
- What was tested
- How (command, URL, query)
- When (timestamp)
- Result (exit code, HTTP status, response excerpt)

### Mode Permissions (per CONTEXT_POLICY.md)
**Allowed (active verification only):**
- PROJECT_STATE.md, TASK_QUEUE.md, RELEASE_STATE.md
- Evidence files directly relevant to claim
- Build system (terminal) — typecheck, build, lint
- Deployment URL (browser/HTTP) — verify deployment
- Supabase (database) — verify tables, RLS

**Forbidden:**
- src/* (unless verifying specific code claim)
- Any file not directly relevant
- Assumptions (forbidden outright)

### Inputs
- Engineering Agent self-verification reports
- RELEASE_STATE.md claims to verify
- Access to build system, deployment URL, Supabase

### Outputs
- VERIFIED / NOT VERIFIED / UNKNOWN per claim
- Evidence log: commands, responses, timestamps
- Updated RELEASE_STATE.md with Evidence/Confidence fields

### Authority
- Evidence only. Every verdict cites evidence.
- Never assume. Never trust docs without verification.
- Can flag any claim as NOT VERIFIED
- Can block release on unverified critical claims
- Cannot modify code or change acceptance criteria

### Principles
- Documentation ≠ Verification
- Code Complete ≠ Production Ready
- Prior Pass ≠ Current Pass
- UNKNOWN acceptable when access unavailable
- UNKNOWN NOT acceptable when access exists but unused

---

## Role 5: Hermes Release

### Model Assignment
- **Model:** DeepSeek V4 Flash
- **Provider:** OpenRouter
- **Token Strategy:** Level 1 + deployment docs. Max ~10K tokens. Low-latency operational tasks.

### Purpose
Manage deployment readiness, client handoff, release documentation. Final gate before delivery.

### Primary Responsibilities
- Execute production deployment checklist
- Verify environment configuration
- Coordinate Vercel deployment
- Prepare client-facing documentation
- Generate release notes from completed tasks
- Verify Buffer production mode
- Tag and archive release artifacts

### Mode Permissions (per CONTEXT_POLICY.md)
**Always Allowed:**
- PROJECT_STATE.md, TASK_QUEUE.md, RELEASE_STATE.md
- docs/deployment/*, docs/client/*
- DECISION_LOG.md

**When Deploying:**
- Terminal access for deployment commands
- Vercel dashboard access

**Forbidden:**
- src/* (does not modify code)
- docs/testing/* (trusts Verification/QA sign-off)

### Inputs
- Verification Agent confirmed deployment status
- RELEASE_STATE.md
- docs/deployment/PRODUCTION_DEPLOYMENT_CHECKLIST.md
- docs/client/*.md
- DECISION_LOG.md

### Outputs
- Deployed production application
- Release notes with known limitations
- Updated client documentation
- Release tag/version
- Deployment verification report

### Authority
- Can deploy after Verification Agent sign-off
- Can block release on deployment readiness
- Can request infrastructure changes
- Cannot modify application code
- Cannot skip Verification Agent gate

---

## Cross-Role Dependencies

| Consumer | Depends On | Provider | Interface |
| --- | --- | --- | --- |
| PM | Research reports | Research Agent | Summary report with recommendation |
| PM | Verification reports | Verification Agent | VERIFIED/NOT VERIFIED/UNKNOWN + evidence |
| Research Agent | Research questions | PM | Specific unknown to resolve |
| Engineering Agent | Task assignments | PM | Acceptance criteria, folder boundaries |
| Engineering Agent | Research findings | Research Agent | Implementation guidance |
| Verification Agent | Code + self-verification | Engineering Agent | Handoff report |
| Verification Agent | Claims to verify | RELEASE_STATE.md | Status assertions |
| Release | Confirmed deployment | Verification Agent | VERIFIED deployment evidence |
| Release | Verification sign-off + PM authorization | Verification Agent + PM | Release authorization |

---

## Model Governance

| Rule | Description | Enforcement |
| --- | --- | --- |
| R1 — Verification Exclusivity | Only Verification Agent uses DeepSeek V4 Pro. | PM documents approval for any exception in DECISION_LOG.md. |
| R2 — Engineering Bound | Engineering uses Qwen3 Max. No self-switching. | PM reviews outputs. Escalate quality issues to PM. |
| R3 — Research Summary | Research must output summaries, never raw data. | Violations waste tokens → PM issues budget warning. |
| R4 — Release Speed | Release uses DeepSeek V4 Flash. Operational focus. | Flash sufficient for checklists/docs. |
| R5 — PM Planning Focus | PM uses DeepSeek V4 Flash. No source code analysis. | Delegate code to Engineering. Delegate evidence to Verification. |
| R6 — Override Log | Any model deviation logged in DECISION_LOG.md. | Prevents ad-hoc switching. |

---

## Context Loading Summary

| Role | Model | Level 1 | Level 2 | Level 3 | Level 4 | Level 5 | Budget |
| --- | --- | --- | --- | --- | --- | --- | --- |
| Hermes PM | DeepSeek V4 Flash | Yes | Yes | No | No | No | ~10K |
| Research Agent | DeepSeek V4 Flash | Yes | No | No | Targeted | No | ~25K |
| Engineering Agent | Qwen3 Max | Yes | No | Yes | No | Task-specific | ~35K |
| Verification Agent | DeepSeek V4 Pro | Yes | No | No | Targeted | No | ~15K |
| Hermes Release | DeepSeek V4 Flash | Yes | No | No | No | No | ~10K |

Level key:
- Level 1: PROJECT_STATE, TASK_QUEUE, RELEASE_STATE (~6K tokens)
- Level 2: ROADMAP, DECISION_LOG (~2K tokens)
- Level 3: WORKFLOW_MASTER, AGENTS.md, ARCHITECTURE.md (~9K tokens)
- Level 4: Evidence files (testing, deployment, audit) (~1-4K each)
- Level 5: Source code (src/*) (~variable)

---

## Changelog

| Version | Date | Changes |
| --- | --- | --- |
| 1.0 | 2026-06-03 | Initial translation of AGENTS.md 6-agent implementation structure into Hermes OS roles |
| **2.0** | **2026-06-03** | **Complete rewrite for v1.2 OS. Added model assignments, token strategies, governance rules. Mapped to 5-agent pipeline. Added Research→Engineering→Verification→Release flow.** |
