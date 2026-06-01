# Supabase Schema Audit

Date: 2026-06-01
Role: Senior Supabase Architect
Scope: Audit only. No database or migration fixes were applied.

## Executive Summary

The application is connected to Supabase project `nyartblhcenvbworsgxn`, and the configured service role key has valid admin access. The root problem is not RLS and not Single Owner Mode. The root problem is that the connected Supabase project's `public` schema does not expose any of the application tables required by the codebase.

PostgREST returned `PGRST205` for every expected table, which means the tables are not present in the API schema cache. The PostgREST OpenAPI document also returned zero public paths/definitions, confirming that no app tables are currently exposed in the connected `public` schema.

## Environment Verification

Effective local environment:

| Variable | Status | Notes |
| --- | --- | --- |
| `NEXT_PUBLIC_SUPABASE_URL` | Set | Points to `https://nyartblhcenvbworsgxn.supabase.co` |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Set | Present in both `.env` and `.env.local` |
| `SUPABASE_SERVICE_ROLE_KEY` | Set | Present in both `.env` and `.env.local` |
| `ENCRYPTION_KEY` | Set | Present in both `.env` and `.env.local` |
| `APP_URL` | Set | Effective local value is `http://localhost:3000` from `.env.local` |
| `APP_MODE` | Set | Effective value is `single_owner` from `.env.local` |
| `DEFAULT_OWNER_ID` | Set | `00000000-0000-0000-0000-000000000001` |
| `BUFFER_MOCK_MODE` | Set | Present in `.env`; not present in `.env.local`; effective Next.js value should still resolve to `true` |

Supabase project target:

- Project ref from URL: `nyartblhcenvbworsgxn`
- Host: `nyartblhcenvbworsgxn.supabase.co`
- Auth health endpoint: HTTP `200`
- Service role admin users endpoint: HTTP `200`

Conclusion: the app is targeting a reachable Supabase project, and the service role key is valid for that project.

## Migration Files Audited

### `supabase/migrations/0001_initial_schema.sql`

Defines:

- `public.profiles`
- `public.brands`
- `public.integrations`
- `public.workflow_logs`
- `public.content_posts`

Also defines:

- `uuid-ossp` extension
- RLS enablement on all five tables
- owner-based RLS policies
- `public.handle_new_user()` trigger function
- `on_auth_user_created` trigger on `auth.users`

### `supabase/migrations/0002_single_owner_schema.sql`

Defines:

- Drops `profiles_id_fkey` from `public.profiles` if present.

Purpose:

- Allows `single_owner` mode to seed a deterministic profile ID without requiring a matching `auth.users` row.

Important dependency:

- This migration assumes `public.profiles` already exists from `0001_initial_schema.sql`.

## Expected Tables

Tables expected by migrations and application code:

| Table | Source | Purpose |
| --- | --- | --- |
| `public.profiles` | migration, `owner-context.ts` | Owner identity/profile seed record |
| `public.brands` | migration, settings/generate/dashboard pages | Brand profile and content voice |
| `public.integrations` | migration, settings/generate/publish/dashboard pages | Encrypted OpenAI and Buffer secrets |
| `public.workflow_logs` | migration, generate/drafts/publish/settings actions | Audit and workflow history |
| `public.content_posts` | migration, drafts/generate/publish/dashboard pages | Generated drafts and publishing statuses |

Application table references found:

- `src/lib/owner-context.ts`: `profiles`
- `src/actions/settings.ts`: `brands`, `integrations`, `workflow_logs`
- `src/actions/generate.ts`: `brands`, `integrations`, `workflow_logs`, `content_posts`
- `src/actions/drafts.ts`: `content_posts`, `workflow_logs`
- `src/actions/publish.ts`: `content_posts`, `integrations`, `workflow_logs`
- `src/app/page.tsx`: `content_posts`, `brands`, `integrations`
- `src/app/(dashboard)/generate/page.tsx`: `brands`, `integrations`
- `src/app/(dashboard)/drafts/page.tsx`: `integrations`

## Actual Tables

Read-only checks were run against the configured Supabase REST API using the service role key.

PostgREST OpenAPI result:

| Check | Result |
| --- | --- |
| `/rest/v1/` status | HTTP `200` |
| Public paths exposed | `0` |
| Public definitions exposed | `0` |

Expected table checks:

| Table | REST Status | Result |
| --- | ---: | --- |
| `public.profiles` | `404` | `PGRST205`: table not found in schema cache |
| `public.brands` | `404` | `PGRST205`: table not found in schema cache |
| `public.integrations` | `404` | `PGRST205`: table not found in schema cache |
| `public.workflow_logs` | `404` | `PGRST205`: table not found in schema cache |
| `public.content_posts` | `404` | `PGRST205`: table not found in schema cache |

## Missing Tables

All application tables are missing from the connected Supabase project's exposed `public` schema:

- `public.profiles`
- `public.brands`
- `public.integrations`
- `public.workflow_logs`
- `public.content_posts`

## Migration Status

Repository migration status:

- Migration files exist locally.
- `0001_initial_schema.sql` contains the required table definitions.
- `0002_single_owner_schema.sql` contains a follow-up constraint adjustment for Single Owner Mode.

Connected Supabase project status:

- The required tables are not present in PostgREST schema cache.
- The PostgREST OpenAPI document exposes no public tables.
- Therefore, the local migration files have not been applied to the connected project, were applied to a different project, failed before table creation, or were later dropped from this project.

## APP_MODE=single_owner Logic

Code path:

- `src/lib/supabase/middleware.ts` bypasses auth routes when `APP_MODE === 'single_owner'`.
- `src/lib/owner-context.ts` returns the deterministic owner ID from `DEFAULT_OWNER_ID`.
- `getDbClient()` returns the admin Supabase client in Single Owner Mode.
- `seedDefaultProfile()` attempts to upsert into `public.profiles`.

Finding:

- The Single Owner Mode logic is conceptually correct for bypassing user auth and using service role access.
- However, `seedDefaultProfile()` catches and logs seeding errors without failing the request.
- If `public.profiles` is missing, Single Owner Mode still returns an owner object, so the dashboard shell can load while downstream table reads fail later.

Conclusion:

- Single Owner Mode is not the source of the missing table errors.
- It masks the missing `profiles` table during owner resolution because the profile seed failure is non-fatal.

## Service Role Access Verification

Service role status:

- Supabase Auth health endpoint returned HTTP `200`.
- Supabase admin users endpoint returned HTTP `200`.
- This confirms that the service role key is valid for the configured project and has privileged Supabase API access.

Table access status:

- Service role queries to expected tables returned `PGRST205`, not RLS errors.
- This is a schema/table availability problem, not a permission problem.

## Database Connection Target

The application target is determined by:

- `NEXT_PUBLIC_SUPABASE_URL`
- `NEXT_PUBLIC_SUPABASE_ANON_KEY`
- `SUPABASE_SERVICE_ROLE_KEY`

All Supabase clients point to:

- `nyartblhcenvbworsgxn.supabase.co`

Client usage:

- Browser/client Supabase uses anon key.
- Server SSR client uses anon key plus cookies.
- Admin client uses service role key.
- Single Owner Mode uses the admin client.

Finding:

- The code is consistently targeting the configured project ref.
- The target project is reachable.
- The target project does not currently contain/expose the expected `public` schema tables.

## Root Cause

The connected Supabase project `nyartblhcenvbworsgxn` has not had the repository's application migrations applied successfully to its `public` schema.

This is why the application reports:

- `public.brands` missing
- `public.integrations` missing
- `public.content_posts` missing

The same root cause also affects:

- `public.profiles`
- `public.workflow_logs`

## Fix Plan

Do not implement in this audit pass. Recommended remediation sequence:

1. Confirm the intended Supabase project is `nyartblhcenvbworsgxn`.
2. In the Supabase dashboard SQL editor for that project, apply `supabase/migrations/0001_initial_schema.sql`.
3. Apply `supabase/migrations/0002_single_owner_schema.sql`.
4. Refresh PostgREST schema cache if needed.
5. Re-run read-only table checks for all expected tables.
6. Verify `public.profiles` can accept the deterministic Single Owner profile ID.
7. Re-run the full production smoke test:
   - Create Brand Profile
   - Save OpenAI key
   - Save Buffer key
   - Generate posts
   - Edit/approve/publish draft
   - Verify dashboard counts
8. Consider making `seedDefaultProfile()` fail loudly in non-production diagnostics when `profiles` is missing, so schema drift is caught earlier.

## Go / No-Go Impact

Schema state is currently **NO-GO** for client delivery.

The application code and environment can reach Supabase, but the database schema required for the production workflow is absent from the connected project.
