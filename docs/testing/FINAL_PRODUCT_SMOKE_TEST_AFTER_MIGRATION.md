# Final Product Smoke Test After Migration

Date: 2026-06-01
Environment: Local Next.js app connected to Supabase project `nyartblhcenvbworsgxn`
Mode: `APP_MODE=single_owner`

## Summary

Milestone 1 is not ready for client delivery yet. The production Supabase schema is now reachable and the application no longer reports missing tables, but the full generate -> draft -> approve -> publish workflow could not complete because the saved OpenAI key used for smoke testing is invalid.

Final status: **No-Go until a valid OpenAI API key is saved and the end-to-end content workflow is rerun.**

## Steps Tested

| Step | Result | Notes |
| --- | --- | --- |
| Open `/` | Pass | Dashboard loads from a fresh browser session. |
| Verify dashboard loads | Pass | Dashboard renders and now reflects actual database counts. |
| Open `/profile` | Pass | Brand profile page loads. |
| Create/update Brand Profile | Pass | Saved `Smoke Legal Advisory` profile successfully. |
| Open `/settings` | Pass | Settings page loads. |
| Save OpenAI API key | Partial | Key storage works, but the smoke key is invalid and cannot generate content. |
| Save Buffer API key or enable mock mode | Pass | Buffer integration saved; mock mode is enabled. |
| Open `/generate` | Pass | Generate page loads and reads brand context. |
| Generate 5 posts | Fail | OpenAI returned invalid API key. The app now shows a controlled error instead of a 500. |
| Verify rows created in `content_posts` | Fail | Verified `content_posts` count remains `0`. |
| Open `/drafts` | Pass | Drafts page loads with an empty state. |
| Edit one draft | Not run | Blocked because no drafts were generated. |
| Approve one draft | Not run | Blocked because no drafts were generated. |
| Publish one approved draft | Not run | Blocked because no approved draft exists. |
| Verify status changes to `published` | Not run | Blocked by generation failure. |
| Verify dashboard statistics update | Partial | Dashboard now reads real counts; publish-driven count changes could not be verified. |

## Additional Verification

| Check | Result | Notes |
| --- | --- | --- |
| No missing table errors | Pass | `profiles`, `brands`, `integrations`, `workflow_logs`, and `content_posts` exist. |
| No 500 errors after fixes | Pass | Retested generate failure returns `POST /generate 200` with a controlled UI error. |
| Single Owner Mode works | Pass | Default owner profile is used and brand/integration saves succeed. |
| Service role does not leak to client | Pass | No service role token references found in client/static assets. |
| `npm run typecheck` | Pass | Completed successfully. |
| `npm run build` | Pass | Completed successfully. Existing lint warnings remain for unused imports/variables. |

## Bugs Found

1. `brands.user_id` was missing a unique constraint required by the app upsert contract.
2. `content_posts.metadata` was missing from the deployed schema contract.
3. Invalid OpenAI credentials caused `POST /generate` to return 500.
4. Dashboard showed hard-coded sample counts/rows, making real statistics unverifiable.
5. Sidebar had a duplicate React key for the two `/settings` navigation entries.

## Fixes Applied

1. Added and deployed `supabase/migrations/0003_schema_contract_fixes.sql`.
2. Updated generate error handling so invalid OpenAI keys return a controlled UI error.
3. Updated OpenAI client error handling to avoid server stack traces for invalid API keys.
4. Updated dashboard summary and empty state to use real `content_posts` data.
5. Updated sidebar navigation keys to be unique.

## Database Verification

Existing application tables:

- `profiles`
- `brands`
- `integrations`
- `workflow_logs`
- `content_posts`

Current smoke-test row state:

- `brands`: 1
- `integrations`: OpenAI 1, Buffer 1
- `content_posts`: 0 total, 0 draft, 0 approved, 0 published

## Build Status

- `npm run typecheck`: Pass
- `npm run build`: Pass

Build warnings are non-blocking and relate to existing unused imports/variables.

## Remaining Risks

1. Full generation cannot be certified until a valid OpenAI key is provided.
2. Draft edit, approve, publish, and published dashboard-stat transitions remain unverified because no posts were generated.
3. Buffer publish path was not exercised with a real approved draft, though mock mode is configured.
4. Dashboard still contains static secondary widgets outside the main production count path, such as channel health and upcoming queue.

## Final Milestone 1 Status

**No-Go for client delivery today.**

The database migration and schema contract are ready, but Milestone 1 needs one more full smoke test with a valid OpenAI API key to verify draft creation, approval, publishing, and final dashboard statistics.
