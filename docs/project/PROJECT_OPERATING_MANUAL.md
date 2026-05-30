# Project Operating Manual: AI Content Publisher SaaS

**Date:** Saturday, May 30, 2026
**Version:** 1.0.0

This master manual defines the operational protocols, architectural standards, and workflows for developing and maintaining the AI Content Publisher SaaS. It is the definitive guide for both human developers and future AI agents working on this repository.

---

## 1. Project Overview
The AI Content Publisher is a high-velocity SaaS application designed to automate social media content creation. It translates simple topics into persona-driven, production-ready posts using OpenAI (`gpt-4o`) and delivers them to social platforms via Buffer.

## 2. Product Workflow
The application operates on a strict, guided 4-step pipeline:
1.  **Configure:** Define Brand Profile (Tone, Personality, Audience) and connect APIs (OpenAI, Buffer).
2.  **Generate:** Use the multi-step wizard to request 5 or 10 posts based on a topic.
3.  **Review:** Examine drafts in a 3-column workspace, utilizing the simulated platform preview (e.g., Facebook). Edit, Approve, or Reject.
4.  **Publish:** Send approved posts to the Buffer queue (individually or in bulk).

## 3. Technical Architecture
-   **Frontend:** Next.js 15 (App Router), React Server Components, Tailwind CSS, shadcn/ui.
-   **Backend:** Next.js Server Actions exclusively. No separate Express/Node API server.
-   **Database:** Supabase (PostgreSQL) with strict Row Level Security (RLS).
-   **Security:** Bring Your Own Key (BYOK) model. External API keys are encrypted at rest using AES-256-GCM. Decryption occurs *only* within Node.js Server Actions.
-   **Auth Mode:** Defaults to `single_owner` mode (bypasses login using `SUPABASE_SERVICE_ROLE_KEY` on the server). Can be switched to `multi_user` for standard JWT authentication.

## 4. File Structure Rules
Maintain the established domain-driven grouping:
-   `src/app/(dashboard)/*`: Route definitions and page layouts.
-   `src/actions/*`: Server Actions, grouped by domain (e.g., `drafts.ts`, `settings.ts`).
-   `src/components/*`: UI components grouped by feature (e.g., `drafts/`, `generate/`, `ui/`).
-   `src/lib/*`: Core infrastructure (Supabase clients, Encryption, Publishing adapters).
-   **Strict Rule:** Client components (`'use client'`) must never import or execute encryption decryption logic or direct database mutations. Always use Server Actions.

## 5. Skill Usage Workflow
When new features require specialized AI skills (e.g., prompt engineering, advanced CSS animations):
1.  Isolate the task to a specific agent role (as defined in `GEMINI_AGENTS.md`).
2.  Provide the agent with explicit boundaries (Allowed Folders / Forbidden Folders).
3.  Require a formal "Implementation Report" upon task completion.

## 6. MCP/Tool Usage Workflow
Integrations are documented in the `/mcp/` directory.
-   **Supabase (`mcp/supabase.md`):** Use for persistent state. Always verify RLS implications.
-   **OpenAI (`mcp/openai.md`):** Use for generation. Must enforce `response_format: json_object`.
-   **Buffer (`mcp/buffer.md`):** Use the `PublishingAdapter` pattern. Respect `BUFFER_MOCK_MODE` during development.
-   **Adding New Tools:** Must be documented with a new `mcp/[tool].md` file specifying credentials, failure cases, and security notes before implementation.

## 7. Development Phases
Development must follow a staged Epic/Phase approach.
-   **Phase 1 (Completed):** Foundation, Setup, Auth.
-   **Phase 2 (Completed):** Settings, Encryption, Profile.
-   **Phase 3 (Completed):** AI Generation Engine.
-   **Phase 4 (Completed):** Draft Workflow & UI Polish.
-   **Phase 5 (Completed):** Buffer Publishing Integration.
-   **Future Phases:** Must be explicitly planned and approved by the Technical Lead before coding begins.

## 8. QA Process (Quality Gates)
Before any code is committed or delivered:
1.  **Type Safety:** Must pass `npm run typecheck` with 0 errors. No implicit `any` types allowed in core logic.
2.  **Build Stability:** Must pass `npm run build` without prerender errors.
3.  **Security Audit:** Verify no secrets are exposed in `Network` tab or client bundles.
4.  **Mock Testing:** Verify end-to-end flow using `BUFFER_MOCK_MODE=true`.

## 9. Deployment Process
Deployments are managed via Vercel.
1.  Ensure all environment variables (`NEXT_PUBLIC_SUPABASE_URL`, `ENCRYPTION_KEY`, etc.) are configured in the Vercel dashboard.
2.  Deploy via `git push origin main` or Vercel CLI (`vercel --prod`).
3.  Verify the live URL. If critical errors occur, use Vercel's instant rollback feature via the dashboard.

## 10. Client Delivery Process
1.  Generate a comprehensive Delivery Report (e.g., `docs/delivery/DELIVERY_ROUND_1.md`).
2.  Update `CLIENT_HANDOFF.md` with instructions on how the client can assume control.
3.  Ensure `SETUP.md` is accurate for local installation.
4.  Require formal sign-off before initiating the next Milestone.

## 11. Milestone 2 Roadmap
The next major iteration of the platform. Focus areas include:
1.  **Content Calendar:** Interactive drag-and-drop calendar for scheduling posts.
2.  **Time-Slot Scheduling:** Passing explicit `scheduled_at` times to the Buffer API.
3.  **Multi-Platform Support:** Expanding the `PublishingAdapter` to support native LinkedIn and X APIs.
4.  **Visual Assets:** DALL-E integration for generating accompanying post images.

## 12. Scope Control Rules
-   **Do NOT** build "just-in-case" features. Stick to the immediate task requirements.
-   **Do NOT** refactor the database schema unless explicitly required by a new feature specification.
-   **Do NOT** change the established UI aesthetic (SaaS Premium) without design approval.
-   If an agent encounters an ambiguous requirement, it MUST stop and ask the Technical Lead for clarification.
