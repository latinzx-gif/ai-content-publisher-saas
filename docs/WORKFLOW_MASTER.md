# AI Content Publisher SaaS: Master Workflow

This document is the single source of truth for the product workflow, state machine, and implementation rules. All agents must read this file before implementing workflow-related changes.

## 1. Product Purpose

This system is an **AI Content Production Workflow**, not merely a text generator. Its primary purpose is to move content from the initial idea stage through generation, review, creative approval, and final publishing in a structured and predictable manner.

## 2. V1 Delivery Workflow

The end-to-end user and data flow for the V1 delivery is as follows:

**Brand Setup** → **Generate Text** → **Review Text** → **Approve Text** → **Generate Images** → **Select Image** → **Approve Creative** → **Publish Now / Schedule** → **Calendar** → **Buffer/Facebook**

## 3. Post Lifecycle State Machine

A `content_post` must progress through the following statuses. Do not bypass this lifecycle.

`draft` → `text_approved` → `images_pending` → `images_ready` → `creative_approved` → `scheduled` → `published` → `failed`

*A post can also be marked `rejected` from the `draft` or `text_approved` states.*

## 4. Current June 5 Scope

### Completed

* Generate Text
* Platform / Format / Word Count metadata
* Draft Review
* Text Approval
* Publish via Buffer/Facebook

### In Progress

* Generate 1-3 image options
* Select image
* Approve Creative
* Basic Calendar visibility

## 5. Hold / Phase 2

The following items **must not** be implemented for the June 5 delivery. They are on hold for Phase 2.

- [ ] Campaign Factory Backend
- [ ] 30-day planner
- [ ] Queue workers
- [ ] Multi-platform publishing (direct to IG, LI, etc.)
- [ ] Google Drive integration
- [ ] Obsidian integration
- [ ] Analytics and reporting

## 6. Implementation Rules

- Do not bypass the lifecycle state machine. A post's status must progress sequentially.
- Do not publish a post before `creative_approved` status, unless it is explicitly marked as `text_only` format.
- Prefer storing new attributes in the `content_posts.metadata` JSONB column for the June 5 delivery.
- Avoid creating new database migrations unless absolutely required and approved.
- Do not scan all documentation files (`*.md`) unless explicitly asked.
- Always read this file (`docs/WORKFLOW_MASTER.md`) before implementing workflow-related changes.
- **Workflow Definition ≠ Implementation Complete**: Features listed in the workflow represent the target workflow. Only items marked COMPLETE in Section 8 should be considered fully implemented.

## 7. Agent Instruction

All agents must treat `docs/WORKFLOW_MASTER.md` as the product workflow authority. Its rules and definitions supersede any previous instructions or conventions.

## 8. Current Implementation Status

**Generate Text**
Status: COMPLETE

**Platform / Format Metadata**
Status: COMPLETE

**Draft Review**
Status: COMPLETE

**Text Approval**
Status: COMPLETE

**Buffer/Facebook Publishing**
Status: COMPLETE

**Image Generation**
Status: IN PROGRESS

**Image Selection**
Status: IN PROGRESS

**Creative Review**
Status: IN PROGRESS

**Calendar Visibility**
Status: IN PROGRESS

**Campaign Factory**
Status: PHASE 2

**30-Day Planner**
Status: PHASE 2

**Queue Workers**
Status: PHASE 2

**Multi-Platform Publishing**
Status: PHASE 2
