# Context Loading Policy: AI Content Publisher SaaS

Version: 1.1
Last updated: 2026-06-03
Role: Hermes PM
Applies to: All Hermes agents in this project

---

## Purpose

Reduce unnecessary token consumption. Prevent agents from reading the entire repository by default. Establish a context loading hierarchy that loads only what is needed for each agent role.

Every agent that reads files it does not need is burning tokens that could be used for reasoning, generation, or additional task iterations.

---

## Default Context Rules

### Mandatory Core Memory (ALL agents)

Every agent, regardless of role, MUST read these three files before performing any task:

| Order | File | Purpose |
| --- | --- | --- |
| 1 | PROJECT_STATE.md | Know what exists, what's in progress, what's deferred |
| 2 | TASK_QUEUE.md | Know current priorities and what blocks what |
| 3 | RELEASE_STATE.md | Know build status, deployment status, blockers, risks |

No agent may skip these. They are the minimum viable context.

### Default Prohibition

Unless their role explicitly permits it, agents MUST NOT read:

- docs/testing/* (test reports, verification reports)
- docs/deployment/* (deployment guides, environment audits)
- docs/client/* (client documentation)
- docs/audit/* (audit reports)
- docs/design/* (design reports)
- docs/implementation/* (implementation reports)
- docs/specs/* (specifications)
- docs/system/* (system reports)
- src/* (application source code)
- supabase/* (database migrations)

Reading these files requires role-based permission OR explicit PM authorization.

### The Principle

"If you don't need it to do your job, don't read it. If a summary file exists, read the summary, not the raw data."

---

## Token Budget Policy

### Purpose

Prevent runaway context loading. Reduce OpenRouter costs. Prevent unnecessary repository scans.

Every agent has a hard token ceiling and file-load ceiling. Exceeding the ceiling requires Hermes PM authorization. Agents must count files and estimate tokens as they load context.

### Token Budget Table

| Agent Role | Max Files | Max Tokens | Core Load | Extension Load |
| --- | --- | --- | --- | --- |
| Hermes PM | 4 | 10,000 | PROJECT_STATE, TASK_QUEUE, RELEASE_STATE, ROADMAP | — |
| Research Agent | 10 | 25,000 | Core 3 + external docs | Targeted evidence files |
| Engineering Agent | task-defined | 40,000 | Core 3 + AGENTS.md + ARCHITECTURE.md + WORKFLOW_MASTER.md | Task-specific src/ files only |
| Verification Agent | 5 evidence + 3 source | 25,000 | Core 3 | Evidence files + limited src/* |
| Hermes Release | 5 | 10,000 | Core 3 + docs/deployment/* + docs/client/* | — |
| Deep Audit | unlimited | 100,000 | All files | Full repository scan |

Files = individual file reads (read_file, search_files, etc.). Count each file once even if read multiple times.

Tokens = estimated total context window usage including file contents, system prompt, and conversation history.

---

### PM Agent Limits

**Maximum files:** 4
**Maximum tokens:** 10,000

**Allowed:**
- PROJECT_STATE.md
- TASK_QUEUE.md
- RELEASE_STATE.md
- ROADMAP.md

**Forbidden:**
- src/*
- docs/testing/*
- docs/deployment/*
- supabase/*

unless explicitly authorized by Hermes PM (self-authorization documented in DECISION_LOG.md).

**Rationale:** PM does not need source code or test reports to plan and prioritize. Summaries in RELEASE_STATE.md and PROJECT_STATE.md are sufficient. Delegation to Research Agent or Deep Audit authorization is the correct path for source-level detail.

---

### Research Agent Limits

**Maximum files:** 10
**Maximum tokens:** 25,000

**Load pattern:**
1. Core 3 (PROJECT_STATE, TASK_QUEUE, RELEASE_STATE)
2. External documentation (API docs, SDK repos) — counted toward file limit
3. Targeted evidence files (docs/testing/*, docs/deployment/*, docs/audit/*) — only directly relevant to the research question

**Output requirement:**
- MUST create summary reports.
- Other agents consume summaries only.
- Never pass raw research, raw test output, or raw deployment logs to other agents.

**File counting:** External URLs and API documentation count as "files" for budget purposes. Each unique document = 1 file.

**Example:**
  BAD: "Here are the 15 test reports I found." (violates max files + passes raw data)
  GOOD: "RQ1 resolved. gpt-image-1-mini costs $0.02/image, rate limit 5 images/min. Recommendation: use quality='low' for cost control. Confidence: HIGH. Sources: OpenAI docs, FINAL_SMOKE_TEST_REPORT.md."

---

### Engineering Agent Limits

**Maximum tokens:** 40,000
**Load pattern:** Load only task-related files.

**Never scan:**
- src/**
- supabase/**
- app/**

without a specific task directing the scan. General browsing of source directories is prohibited.

**Allowed load sequence:**
1. Core 3 (PROJECT_STATE, TASK_QUEUE, RELEASE_STATE)
2. AGENTS.md, ARCHITECTURE.md, WORKFLOW_MASTER.md
3. Specific files named in the task assignment
4. Files discovered as needed during implementation (and only those)

**Counting rule:** No hard file cap, but token ceiling is absolute. If loading 8 source files plus core + workflow exceeds 40K tokens, the agent must prioritize and escalate to PM for Deep Audit authorization.

**Context Policy compliance:** Never scan the entire repository. Load only task-relevant files.

---

### Verification Agent Limits

**Maximum evidence files:** 5
**Maximum source files:** 3
**Maximum tokens:** 25,000

**Load pattern:**
1. Core 3 (PROJECT_STATE, TASK_QUEUE, RELEASE_STATE)
2. Evidence files directly relevant to the claim (max 5)
3. Source files ONLY when verifying a specific code claim (max 3)
4. Live system output (terminal commands, HTTP requests, DB queries) — does not count toward file limit

**Output requirement:**
- Return only: VERIFIED / NOT VERIFIED / UNKNOWN
- With supporting evidence only
- Stop when sufficient evidence exists
- Do not continue searching after reaching a verdict

**No fishing:** Verification Agent may not run speculative commands or load speculative files. Each command and file must directly support the claim under verification.

---

### Release Agent Limits

**Maximum files:** 5
**Maximum tokens:** 10,000

**Load pattern:**
1. Core 3 (PROJECT_STATE, TASK_QUEUE, RELEASE_STATE)
2. docs/deployment/* (1-2 files)
3. docs/client/* (1-2 files)
4. DECISION_LOG.md (if needed for release notes)

**Rules:**
- Use summaries only.
- Never inspect source code.
- Trust Verification Agent sign-off. Do not re-verify.

---

### Deep Audit Mode

**Authorization:** Only Hermes PM may authorize.

**Required for:**
- Repository-wide scans
- Deployment audits
- Source code audits
- Migration audits

**Maximum tokens:** 100,000

**Must produce:** AUDIT_SUMMARY.md

**After completion:** Return to normal mode. Do not retain full repository context for subsequent tasks.

**Authorization is TEMPORARY** — expires after the audit task completes. Reversion to role-based permissions is mandatory.

**Use only for:**
- Architecture review after major refactor
- Security audit before production release
- Full codebase health check
- Migration verification (schema + code alignment)

**Do NOT use for:**
- "I'm curious what's in the docs folder"
- "Let me scan everything before starting"
- "I want to be thorough"

---

### Early Stop Rule

Agents must stop loading context when:

1. Sufficient evidence exists
2. Answer confidence > 90%
3. Acceptance criteria are met

More files does not equal better answers.

**Decision flow:**
```
Agent considers loading another file
  │
  ▼
Does current context answer the question?
  │
  ├── YES → STOP. Work with what you have.
  │
  └── NO → Is the missing info critical?
             │
             ├── YES → Load ONE more file. Re-evaluate.
             │
             └── NO → STOP. Flag UNKNOWN and escalate.
```

---

## Mode-Based Permissions

### Hermes PM Mode

Purpose: Planning, prioritization, task routing, decision making.

Allowed (always):
- PROJECT_STATE.md
- TASK_QUEUE.md
- RELEASE_STATE.md
- ROADMAP.md
- DECISION_LOG.md
- AGENT_ROLES.md
- TEAM_STRUCTURE.md
- CONTEXT_POLICY.md (this file)
- WORKFLOW_MASTER.md

Allowed (on explicit request only):
- Any file the PM deems necessary for a decision

Forbidden (never without Deep Audit authorization):
- docs/testing/*
- docs/deployment/*
- src/*
- supabase/*

PM does not need to read test reports or source code to plan and prioritize. The summaries in RELEASE_STATE.md and PROJECT_STATE.md are sufficient. If a decision requires source-level detail, delegate to Research Agent or authorize a temporary Deep Audit.

---

### Research Agent Mode

Purpose: Investigate unknowns, answer specific questions, produce reports.

Allowed (for active research tasks only):
- PROJECT_STATE.md (mandatory core)
- TASK_QUEUE.md (mandatory core)
- RELEASE_STATE.md (mandatory core)
- External documentation (API docs, SDK repos, library references)
- docs/testing/* (only files directly relevant to the research question)
- docs/deployment/* (only files directly relevant to the research question)
- docs/audit/* (only files directly relevant to the research question)

Forbidden:
- src/* (Research Agent does not read source code)
- supabase/* (Research Agent does not read migrations)
- Any file not directly relevant to the active research task

Output requirement: Research Agent MUST produce a summary report. It MUST NOT pass raw reports, raw test output, or raw deployment logs to other agents. The summary is the deliverable.

Example:
  BAD:  "Here are the 15 test reports I found." (wastes tokens)
  GOOD: "RQ1 resolved. gpt-image-1-mini costs $0.02/image, rate limit 5 images/min. Recommendation: use quality='low' for cost control. Confidence: HIGH. Sources: OpenAI docs, FINAL_SMOKE_TEST_REPORT.md."

---

### Verification Agent Mode

Purpose: Verify claims against live evidence. Bridge documentation-reality gap.

Allowed (for active verification tasks only):
- PROJECT_STATE.md (mandatory core)
- TASK_QUEUE.md (mandatory core)
- RELEASE_STATE.md (mandatory core)
- Evidence files directly relevant to the claim being verified (max 5)
- Source files ONLY when verifying a specific code claim (max 3)
- Build system (terminal access) — to run typecheck, build, lint
- Deployment URL (browser/HTTP access) — to verify deployment
- Supabase (database access) — to verify tables, RLS, data

Forbidden:
- src/* (Verification Agent does not read source code unless verifying a specific claim about code)
- Any file not directly relevant to the verification task
- Assumptions (forbidden outright — every verdict must cite evidence)
- Speculative file loading beyond the claim scope

Output requirement: Return ONLY one of three verdicts with evidence:

  VERIFIED:     claim confirmed with live evidence
                Example: "Typecheck: VERIFIED. Ran `npm run typecheck` at 2026-06-03 14:00 UTC. Exit code 0. No errors."
  
  NOT VERIFIED: claim could not be confirmed
                Example: "Vercel deployment: NOT VERIFIED. HTTP GET returned 404. REAL_DEPLOYMENT_REPORT.md claims deployment but URL does not respond."
  
  UNKNOWN:      claim cannot be tested with available access
                Example: "Buffer real API: UNKNOWN. No Buffer production credentials available to test."

Every verdict MUST cite:
- What was tested
- How it was tested (command, URL, query)
- When it was tested (timestamp)
- What the result was (exit code, HTTP status, response body excerpt)

Never output: "I think it works based on the documentation" or "Probably fine since it passed before."

---

### Engineering Agent Mode

Purpose: Implement features, fix bugs, refactor code.

Allowed (always):
- PROJECT_STATE.md (mandatory core)
- TASK_QUEUE.md (mandatory core)
- RELEASE_STATE.md (mandatory core)
- AGENTS.md (folder boundaries and merge rules)
- ARCHITECTURE.md (tech stack, patterns)
- WORKFLOW_MASTER.md (state machine)

Allowed (task-specific):
- src/* (only files within assigned agent's allowed folders per AGENTS.md)
- supabase/* (only for migration-related tasks)
- Research reports from Research Agent
- Bug reports from Verification Agent

Forbidden:
- docs/testing/* (QA's domain — don't pre-read and bias implementation)
- docs/deployment/* (Release Agent's domain)
- docs/client/* (unless implementing a client-facing feature)
- Files outside allowed folder boundaries (per AGENTS.md)
- Reading the entire src/* directory as a first step

Engineering Agent must NOT scan all files before starting work. Read only:
1. The three core files
2. The specific files named in the task assignment
3. Files discovered as needed during implementation (and only those)

---

### Hermes Release Mode

Purpose: Deploy, document, hand off.

Allowed (always):
- PROJECT_STATE.md (mandatory core)
- TASK_QUEUE.md (mandatory core)
- RELEASE_STATE.md (mandatory core)
- docs/deployment/*
- docs/client/*
- DECISION_LOG.md (release notes source)

Allowed (when deploying):
- Terminal access for deployment commands
- Vercel dashboard access

Forbidden:
- src/* (Release does not modify code)
- supabase/* (unless migration verification is needed)
- docs/testing/* (Verification Agent's verification is sufficient — Release trusts sign-off)

---

## Context Loading Order

Agents load context in levels. Stop loading once sufficient information is available for the task.

```
Level 1 — Core Memory (ALWAYS loaded, every agent)
  PROJECT_STATE.md        (~4 KB)
  TASK_QUEUE.md           (~7 KB)
  RELEASE_STATE.md        (~12 KB)
  ───────────────────────
  Level 1 total:          ~23 KB / ~6,000 tokens

Level 2 — Planning Context (PM, Engineering)
  ROADMAP.md              (~3 KB)
  DECISION_LOG.md         (~6 KB)
  ───────────────────────
  Levels 1+2 total:       ~32 KB / ~8,000 tokens

Level 3 — Workflow Context (Engineering)
  WORKFLOW_MASTER.md      (~3 KB)
  AGENTS.md               (~3 KB)
  ARCHITECTURE.md         (~3 KB)
  AGENT_ROLES.md          (~8 KB)
  TEAM_STRUCTURE.md       (~19 KB)
  ───────────────────────
  Levels 1-3 total:       ~68 KB / ~17,000 tokens

Level 4 — Evidence Files (Research, Verification)
  docs/testing/*          (varies, ~5-15 KB per report)
  docs/deployment/*       (varies, ~2-5 KB per report)
  docs/audit/*            (varies)
  ───────────────────────
  Per-file cost:          ~1,000-4,000 tokens each

Level 5 — Source Code (Engineering only, task-specific)
  src/*                   (~300-500 KB estimated, ~75 files)
  supabase/*              (varies)
  ───────────────────────
  Full src/ cost:         ~80,000-130,000 tokens estimated
```

### Loading Decision Flow

```
Agent starts task
  │
  ▼
Load Level 1 (Core Memory) — MANDATORY
  │
  ▼
Is sufficient context available?
  │
  ├── YES → STOP. Begin work.
  │
  └── NO → What's missing?
             │
             ├── Timeline/scope context → Load Level 2
             ├── Workflow/architecture → Load Level 3
             ├── Evidence needed         → Load Level 4 (specific files only, count toward budget)
             └── Code needed             → Load Level 5 (specific files only, count toward budget)
```

Never load Level 5 unless the task requires modifying or reading specific source files. Never load all of Level 4 — select only the specific evidence files needed.

---

## Token Savings Estimates

### Current Behavior (No Policy)

An unconstrained agent loading "everything relevant":
Levels 1-3 (all knowledge files):           ~17,000 tokens
docs/ (all 50+ files, selectively read):    ~30,000-50,000 tokens
src/ (all 75+ files, selectively read):     ~40,000-80,000 tokens
─────────────────────────────────────────────────────────
Estimated per-task context:                  ~87,000-147,000 tokens

### With Context Policy v1.0

PM planning task:
Level 1 (core) + Level 2 (planning):         ~8,000 tokens
─────────────────────────────────────────────────────────
Savings: ~91-95%

QA verification task:
Level 1 (core) + Level 3 (workflow):         ~17,000 tokens
+ 1-2 evidence files from Level 4:           ~3,000 tokens
─────────────────────────────────────────────────────────
Savings: ~77-86%

Engineering implementation task:
Levels 1-3 (full knowledge):                 ~17,000 tokens
+ task-specific source files (3-8 files):    ~7,000-18,000 tokens
─────────────────────────────────────────────────────────
Savings: ~60-72%

Research investigation task:
Level 1 (core):                               ~6,000 tokens
+ 2-5 evidence files:                         ~8,000-20,000 tokens
─────────────────────────────────────────────────────────
Savings: ~70-86%

### With Token Budget Policy v1.1 (Hard Ceilings)

| Task Type | v1.0 Soft Limit | v1.1 Hard Ceiling | Files Cap | Enforcement |
| --- | --- | --- | --- | --- |
| PM planning | ~10K | **10,000** | **4** | Hard stop |
| Research investigation | ~25K | **25,000** | **10** | Hard stop |
| Engineering implementation | ~35K | **40,000** | task-defined | Hard stop |
| Verification task | ~15K | **25,000** | **5 evidence + 3 source** | Hard stop |
| Release task | ~10K | **10,000** | **5** | Hard stop |
| Deep Audit | No limit | **100,000** | unlimited | PM authorized only |

### Aggregate Savings

Assuming 10 agent tasks per day across all roles:
  Without policy: ~1,000,000-1,500,000 tokens/day
  With v1.0 policy: ~150,000-300,000 tokens/day
  With v1.1 hard ceilings: ~130,000-240,000 tokens/day
  Additional v1.1 savings: ~15-25% beyond v1.0

These savings directly translate to:
- Faster agent responses (less context to process)
- More task iterations within context window
- Lower API costs for token-based billing
- Reduced risk of context-window overflow on complex tasks
- Predictable per-task cost (no runaway loading)

---

## Enforcement

### Agent Self-Enforcement

Agents are expected to follow this policy voluntarily. The policy is embedded in the project context. Violations waste tokens and degrade performance.

Agents must self-monitor:
- "How many files have I loaded?"
- "Am I near my token ceiling?"
- "Do I already have sufficient evidence?"

### PM Oversight

Hermes PM reviews agent behavior for compliance:
- Did the agent exceed its file cap?
- Did the agent exceed its token ceiling?
- Did the agent load Level 5 without needing code access?
- Did the agent read 10 test reports when 1 would suffice?
- Did the agent produce a summary or pass raw data?

Repeated violations → PM issues context budget warning for that agent role. Three warnings → agent model downgrade or task reassignment.

### Context Budget Violations

**Level 1 — Self-Correction:**
Agent detects it is near ceiling. Stops loading. Flags "INSUFFICIENT_CONTEXT" to PM with what is missing.

**Level 2 — PM Intervention:**
PM reviews the flag. Authorizes Deep Audit or redirects task. Documents exception in DECISION_LOG.md.

**Level 3 — Mandatory Reversion:**
Agent exceeded ceiling without authorization. PM forces stop-load. Agent must produce output with current context or escalate.

### Exception Protocol

Exceptions to this policy require:
1. Hermes PM explicit authorization
2. Documentation of the exception in DECISION_LOG.md with reason and expected token cost
3. Reversion to role-based permissions after the exception task completes

No self-authorized exceptions. An agent may not decide on its own that it needs more context.

---

## Summary

| Principle | Rule |
| --- | --- |
| Core mandatory | Every agent reads PROJECT_STATE + TASK_QUEUE + RELEASE_STATE first |
| Stop at sufficiency | Do not load Level N+1 if Level N has enough context |
| Role boundaries | Each role has explicit allowed/forbidden file access |
| Summarize, don't relay | Research produces summaries, never passes raw reports |
| Evidence, not assumptions | Verification cites live evidence, never trusts documentation |
| PM authorizes deep access | Only PM can authorize Deep Audit or cross-role file access |
| Temporary privilege | Deep Audit and exceptions revert after task completion |
| Token budget awareness | Every agent considers: "Do I need this file, or am I just curious?" |
| Hard ceilings | Max files and max tokens are not suggestions — they are stops |
| Early stop | Confidence > 90% or sufficient evidence = stop loading immediately |

---

## Changelog

| Version | Date | Changes |
| --- | --- | --- |
| 1.0 | 2026-06-03 | Initial context loading policy. 5-level hierarchy, role-based permissions, token savings estimates. |
| **1.1** | **2026-06-03** | **Added Token Budget Policy with hard file/token ceilings per role. Added Early Stop Rule. Added enforcement levels (self-correction, PM intervention, mandatory reversion). Added exception protocol. Updated savings estimates with v1.1 hard ceiling impact. Clarified that Verification Agent serves as the QA authority for v1.2.** |
