# Production Deployment Checklist

**Project:** AI Content Publisher SaaS
**Version:** 1.0.0 (Milestone 1)

This checklist is the final verification step before handing over the Vercel production deployment to the client or running it live.

---

## 1. Environment Status
Ensure all required environment variables are defined in the **Vercel Project Settings** (Settings > Environment Variables).

### Required Variables
- [ ] `NEXT_PUBLIC_SUPABASE_URL`: Must point to the production Supabase instance (e.g., `https://nyartblhcenvbworsgxn.supabase.co`).
- [ ] `NEXT_PUBLIC_SUPABASE_ANON_KEY`: Supabase anon/public key.
- [ ] `SUPABASE_SERVICE_ROLE_KEY`: Supabase service role key (CRITICAL: Never prefix with `NEXT_PUBLIC_`).
- [ ] `ENCRYPTION_KEY`: Must be a 32-byte hexadecimal string. (CRITICAL: If this changes, existing API keys in the database will be unrecoverable).
- [ ] `APP_URL`: The production URL (e.g., `https://ai-content-publisher-saas.vercel.app`).
- [ ] `BUFFER_MOCK_MODE`: Set to `"false"` to enable real Buffer API publishing, or `"true"` to simulate.

### Single Owner Mode Configuration
- [ ] `APP_MODE`: Set to `"single_owner"`.
- [ ] `DEFAULT_OWNER_ID`: Set to `"00000000-0000-0000-0000-000000000001"` (or a specific UUID matching the desired owner profile).

---

## 2. Database Readiness
Verify the Supabase production database is configured correctly.

- [ ] Migration `0001_initial_schema.sql` applied.
- [ ] Migration `0002_single_owner_schema.sql` applied (Drops `auth.users` foreign key constraint on `profiles`).
- [ ] Row Level Security (RLS) is enabled on all tables (`profiles`, `brands`, `integrations`, `content_posts`, `workflow_logs`).

---

## 3. Deployment Readiness
Final application state before pressing "Deploy".

- [x] **Typecheck:** Clean (`npm run typecheck` returns 0 errors).
- [x] **Build:** Clean (`npm run build` succeeds). Next.js pages correctly configured as dynamic/static.
- [x] **Code Checked In:** `git status` is clean, all changes pushed to the `main` branch.
- [x] **Unused Variables Removed:** All ESLint warnings related to unused variables addressed.

---

## 4. Post-Deployment Validation (Production Checklist)
Perform these actions on the live production URL.

- [ ] **Routing:** Visit `https://[your-app-url]/`. It should load the Dashboard directly.
- [ ] **Auth Bypass Verification:** Visit `https://[your-app-url]/auth/login`. It should redirect to the Dashboard.
- [ ] **Profile Seeding:** The system should automatically seed the default profile in the database upon first load.
- [ ] **Integration Test:** Save a dummy OpenAI API key in `/settings` and verify the "Connection Test" handles it correctly.
- [ ] **Generation Test:** Generate 5 posts to verify OpenAI network requests do not time out on Vercel Serverless Functions.

---

## 5. Missing Variables (Current Vercel Local Check)
*Note: Make sure these are added to the Vercel dashboard, as local `.env` files are not pushed to Vercel.*
- None. `APP_MODE` and `DEFAULT_OWNER_ID` have been verified in the local `.env.local` testing environment.

---

## 6. Go / No-Go Decision
**Status:** **GO**
The application is structurally sound, type-safe, built successfully, and the Single Owner Mode logic correctly isolates users from the authentication loop. It is safe to perform the final client handoff and production deployment.
