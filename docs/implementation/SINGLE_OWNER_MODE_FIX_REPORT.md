# Single Owner Mode Fix Report

**Date:** Saturday, May 30, 2026
**Issue:** `Email address "owner@local.contentos" is invalid` causing application failure and redirect loop.

## Root Cause
The previous "Single Owner Mode" implementation attempted to inject a simulated multi-user session by explicitly creating a fake user (`owner@local.contentos`) into the `auth.users` table using the Supabase Admin API. However, Supabase's internal email validation rejected the `.contentos` Top-Level Domain (TLD), causing the user creation to fail. Because Postgres strictly enforced foreign key constraints (profiles -> auth.users) and RLS (Row Level Security), any subsequent data queries failed, throwing the user back into the registration/login redirection loop.

## Files Modified
- `src/lib/owner-context.ts`: Refactored to eliminate all fake authentication seeding and `owner@local.contentos` references.
- `src/lib/supabase/admin.ts`: Created new server-only module leveraging the `SUPABASE_SERVICE_ROLE_KEY`.
- `src/actions/settings.ts`, `src/actions/generate.ts`, `src/actions/drafts.ts`, `src/actions/publish.ts`: Refactored server actions to dynamically request the active database client via `getDbClient()`.
- `src/app/page.tsx`, `src/app/(dashboard)/*/page.tsx`: Updated Server Components to dynamically use the `getDbClient()` helper.
- `supabase/migrations/0002_single_owner_schema.sql`: Added migration script to gracefully drop the rigid foreign key constraint between `profiles` and `auth.users`, enabling profile provisioning without relying on auth workflows.
- `SETUP.md` & `.env.example`: Updated environment documentation to explicitly define `APP_MODE`.

## What Changed & How It Works Now
Instead of forcing a fake authentication session, the system now intelligently circumvents authentication and Row Level Security exclusively on the server side:
1. **Dynamic Client Selection:** When `APP_MODE=single_owner`, `getDbClient()` returns the Supabase Admin Client (`createAdminClient`), completely bypassing RLS.
2. **Deterministic Ownership:** Records are strictly associated with `DEFAULT_OWNER_ID`. This guarantees data structure compatibility without ever interacting with `auth.users`.
3. **Middleware Gate:** The Next.js Edge Middleware checks `APP_MODE` and allows unauthenticated traffic directly into dashboard routes.

## Multi-User Compatibility
The application seamlessly toggles back to multi-user mode. If `APP_MODE=multi_user`, the system utilizes standard cookie-based Supabase SSR clients and falls back to requiring explicit user sessions and enforcing RLS.

## Security Notes
- **CRITICAL:** `SUPABASE_SERVICE_ROLE_KEY` is exclusively scoped to Node.js server environments (`src/lib/supabase/admin.ts`). It is never passed to client components and is not prefixed with `NEXT_PUBLIC_`.
- Server actions still apply the ownership check (`requireOwner()`) to maintain logical data bounds, preventing accidental data bleed if transitioning between single and multi-user modes.

## Production Test Results
1. **No Login Page:** Verified. Direct root URL access successfully bypasses `/auth/login`.
2. **Dashboard Load:** Verified. Data seamlessly populates using Admin Client privileges.
3. **Regex Check:** The term `owner@local.contentos` was fully eradicated from the codebase.
4. **Build Status:** Verified passing.

## Remaining Risks
- Manual application of `0002_single_owner_schema.sql` via Supabase SQL Editor is required on existing production databases to prevent foreign key errors when seeding the first profile record.
