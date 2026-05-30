# Agents Definition & Workflow

## Agent 0 = Technical Lead
* **Responsibilities:** Project architecture, code reviews, unblocking other agents, ensuring alignment with `PROJECT_PLAN.md` and `ARCHITECTURE.md`.
* **Allowed Folders:** `*` (All)
* **Forbidden Folders:** None.
* **Deliverables:** Architecture specs, code review approvals, merged PRs.
* **Merge Rules:** Controls the `main` branch. Approves PRs from other agents.

## Agent 1 = Foundation Agent
* **Responsibilities:** Initializing Next.js, configuring Tailwind/shadcn, setting up Supabase clients, database migrations, and authentication.
* **Allowed Folders:** `/src/components/ui`, `/src/lib/supabase`, `/supabase`, `/src/app/auth`
* **Forbidden Folders:** `/src/app/(dashboard)/generate`, `/src/lib/openai`
* **Deliverables:** Configured Next.js app, DB migrations, Login/Register flows.
* **Merge Rules:** Must verify Supabase connection and RLS rules before PR submission.

## Agent 2 = Settings Agent
* **Responsibilities:** Building the Settings and Brand Profile views. Handling API Key encryption, decryption, and secure storage.
* **Allowed Folders:** `/src/app/(dashboard)/settings`, `/src/app/(dashboard)/profile`, `/src/lib/encryption`, `/src/actions/settings`
* **Forbidden Folders:** `/src/lib/openai`, `/src/lib/buffer`
* **Deliverables:** Secure API key storage module, Brand profile forms.
* **Merge Rules:** Must include unit tests for encryption/decryption utilities. 

## Agent 3 = AI Generation Agent
* **Responsibilities:** Developing the Generation UI, OpenAI prompt engineering, handling LLM responses, and saving generated drafts.
* **Allowed Folders:** `/src/app/(dashboard)/generate`, `/src/lib/openai`, `/src/actions/generation`
* **Forbidden Folders:** `/src/lib/encryption` (uses exported utils instead), `/src/lib/buffer`
* **Deliverables:** Functioning generation form, Server Action for OpenAI API interaction, structured JSON parsing.
* **Merge Rules:** Must handle OpenAI API timeouts, invalid keys, and rate limits gracefully.

## Agent 4 = Draft Workflow Agent
* **Responsibilities:** Creating the UI for viewing, editing, and managing generated posts.
* **Allowed Folders:** `/src/app/(dashboard)/drafts`, `/src/components/drafts`, `/src/actions/drafts`
* **Forbidden Folders:** `/src/lib/openai`, `/src/lib/buffer`
* **Deliverables:** Editable post grid, text editing states, status badging.
* **Merge Rules:** Optimistic UI updates required for editing drafts.

## Agent 5 = Publishing Agent
* **Responsibilities:** Integrating the Buffer API, handling the transition from 'draft' to 'published', and error handling for failed API calls.
* **Allowed Folders:** `/src/lib/buffer`, `/src/actions/publish`, `/src/components/publish`
* **Forbidden Folders:** `/src/lib/encryption` (uses exported utils), `/src/lib/openai`
* **Deliverables:** Server Action for publishing to Buffer, success/error toast notifications.
* **Merge Rules:** Must log Buffer API errors clearly and handle invalid Buffer API keys securely.
