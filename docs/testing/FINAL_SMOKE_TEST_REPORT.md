# Final Production Smoke Test Report

Date: 2026-06-01
Run: Second smoke test rerun
Environment: Local workflow smoke test against `http://localhost:3000`
Mode: `APP_MODE=single_owner`
Publishing: `BUFFER_MOCK_MODE=true`

## Summary

Result: **NO-GO for client delivery**

The rerun confirms the same production blocker: the connected Supabase environment is missing required application tables. The application shell loads and Single Owner Mode works, but the workflow cannot proceed past Brand Profile setup because `public.brands` is not available in the schema cache.

## Passed Tests

1. Open application from a fresh browser session
   - Passed.
   - `http://localhost:3000/` loaded successfully.

2. Verify Single Owner Mode works
   - Passed.
   - Dashboard loaded without login and displayed `owner@example.com`.

6. Open Generate page
   - Partially passed.
   - `/generate` returned HTTP `200`, but generation cannot be completed because Brand Profile and OpenAI settings are not available.

17. Static verification commands
   - `npm run typecheck`: Passed.
   - `npm run build`: Passed after rerunning outside the sandbox.

## Failed Tests

3. Create Brand Profile
   - Failed.
   - `/profile` showed a runtime/server error: `Could not find the table 'public.brands' in the schema cache`.

4. Save OpenAI API Key
   - Failed / blocked.
   - `/settings` returned HTTP `500` because `public.integrations` is missing.

5. Save Buffer API Key
   - Failed / blocked.
   - Same `/settings` blocker: missing `public.integrations`.

7. Verify drafts created
   - Failed / blocked.
   - `/drafts` returned HTTP `500` because `public.content_posts` is missing.

15. Verify no console errors
   - Failed.
   - Browser console recorded the server runtime error from `/profile`.

16. Verify no server errors
   - Failed.
   - Server logs recorded missing table errors for:
     - `public.brands`
     - `public.integrations`
     - `public.content_posts`

## Blocked Tests

The following tests could not be executed end-to-end because the database schema is unavailable:

6. Generate 5 posts
8. Edit draft
9. Approve draft
10. Publish draft
11. Verify published status
12. Verify dashboard statistics update
13. Verify Knowledge Sources URLs work
14. Verify Manual Context works

## Route Check Results

- `/`: loaded successfully in browser.
- `/profile`: HTTP `500`
- `/settings`: HTTP `500`
- `/generate`: HTTP `200`
- `/drafts`: HTTP `500`

## Build Status

- `npm run typecheck`: Passed.
- `npm run build`: Passed after rerunning outside the sandbox.

Build note: the sandboxed build failed because Turbopack attempted process creation / port binding and was blocked by sandbox permissions. The escalated rerun completed successfully.

## Server / Console Evidence

- Browser console error:
  - `Could not find the table 'public.brands' in the schema cache`
- Server stack locations:
  - `src/actions/settings.ts:48` via `/profile`
  - `src/actions/settings.ts:92` via `/settings`
  - `src/actions/drafts.ts:29` via `/drafts`

## Remaining Risks

- Supabase migrations are not applied or not visible to the configured Supabase project.
- Full OpenAI generation is unverified.
- Buffer publishing is unverified, even in mock mode.
- Draft edit/approve/publish workflow is unverified.
- Dashboard statistics cannot be trusted until post tables exist and workflow data can be created.
- Knowledge Sources URL ingestion and Manual Context remain unverified end-to-end.

## Go / No-Go

**NO-GO.**

Client delivery should wait until the Supabase schema is migrated in the connected environment and the full workflow passes from Brand Profile creation through published status verification.
