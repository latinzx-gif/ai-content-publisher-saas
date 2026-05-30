# Gemini Agents: Roles & Responsibilities

## Agent 0: Technical Lead / Orchestrator
* **Responsibilities:** high-level planning, architectural integrity, task delegation, and cross-agent coordination. Reviews all "Implementation Reports".
* **Allowed Folders:** `*`
* **Forbidden Folders:** None.
* **Required Output:** Updated `TASK_BOARD.md`, architectural decisions, and final Go/No-Go recommendations.
* **Completion Checklist:** [ ] All planning files exist. [ ] Epics are balanced. [ ] Security model is validated.

## Agent 1: Foundation Agent
* **Responsibilities:** Project scaffolding, UI library integration, Supabase setup, and Authentication.
* **Allowed Folders:** `/src/app/auth`, `/src/lib/supabase`, `/supabase`, `/src/components/ui`
* **Forbidden Folders:** `/src/lib/openai`, `/src/lib/buffer`
* **Required Output:** Working auth system, database schema, and base layout.
* **Completion Checklist:** [ ] `npm run build` succeeds. [ ] Signup/Login works. [ ] DB tables created with RLS.

## Agent 2: Settings Agent
* **Responsibilities:** Secure API key management and Brand Profile forms.
* **Allowed Folders:** `/src/app/(dashboard)/settings`, `/src/app/(dashboard)/profile`, `/src/lib/encryption`, `/src/actions/settings.ts`
* **Forbidden Folders:** `/src/lib/openai`, `/src/lib/buffer`
* **Required Output:** Encryption/Decryption service, API key storage UI.
* **Completion Checklist:** [ ] API keys stored as ciphertexts. [ ] Decryption only occurs on server.

## Agent 3: AI Generation Agent
* **Responsibilities:** OpenAI integration, prompt engineering, and the generation UI.
* **Allowed Folders:** `/src/app/(dashboard)/generate`, `/src/lib/openai`, `/src/actions/generate.ts`
* **Forbidden Folders:** `/src/lib/buffer`, `/src/lib/encryption` (use as consumer only)
* **Required Output:** Working generation flow producing JSON-structured posts.
* **Completion Checklist:** [ ] Prompt follows Brand Profile. [ ] JSON parsing is resilient.

## Agent 4: Draft Workflow Agent
* **Responsibilities:** The preview, edit, and approval interface for generated posts.
* **Allowed Folders:** `/src/app/(dashboard)/drafts`, `/src/components/drafts`, `/src/actions/drafts.ts`
* **Forbidden Folders:** `/src/lib/openai`, `/src/lib/buffer`
* **Required Output:** Editable grid/list of posts with status indicators.
* **Completion Checklist:** [ ] Posts can be edited and saved. [ ] UI reflects 'draft' vs 'approved' status.

## Agent 5: Publishing Agent
* **Responsibilities:** Buffer API integration and the "Send to Buffer" action.
* **Allowed Folders:** `/src/lib/buffer`, `/src/actions/publish.ts`, `/src/components/publish`
* **Forbidden Folders:** `/src/lib/openai`, `/src/app/auth`
* **Required Output:** Service that pushes text to Buffer and updates post status.
* **Completion Checklist:** [ ] Buffer ID stored in DB. [ ] Error states (invalid key, etc.) handled.

## Agent 6: QA / Documentation Agent
* **Responsibilities:** Final testing, type checking, and documentation verification.
* **Allowed Folders:** `/docs`, `/tests`, `README.md`
* **Forbidden Folders:** None (Read-only for production code)
* **Required Output:** Comprehensive "Final Delivery Report" and updated README.
* **Completion Checklist:** [ ] `tsc` passes. [ ] All Milestone 1 requirements met.
