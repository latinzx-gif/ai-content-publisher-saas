# MCP Tool: Supabase

## Purpose
Provides the primary PostgreSQL database, Row Level Security (RLS), and optional Authentication layer for the application.

## Required Credentials
- Supabase Project URL
- Public Anon Key
- Secret Service Role Key

## Environment Variables
- `NEXT_PUBLIC_SUPABASE_URL`: API gateway URL.
- `NEXT_PUBLIC_SUPABASE_ANON_KEY`: Safe to expose to client; used for RLS-scoped queries.
- `SUPABASE_SERVICE_ROLE_KEY`: Server-only secret; bypasses all RLS.

## Setup Steps
1. Create a Supabase Project.
2. Navigate to SQL Editor.
3. Execute `supabase/migrations/0001_initial_schema.sql`.
4. Execute `supabase/migrations/0002_single_owner_schema.sql` (if using single owner mode).
5. Copy API keys to `.env.local` and Vercel.

## Common Failure Cases
- **RLS Blocking:** Queries returning empty arrays `[]` because the user session is missing or invalid.
- **Foreign Key Violation:** Trying to insert a record for a `user_id` that does not exist in `profiles`.
- **PGRST116:** Using `.single()` when 0 rows match the query.

## Security Notes
- Never expose the `SUPABASE_SERVICE_ROLE_KEY` to the client.
- Ensure all tables have `ALTER TABLE table_name ENABLE ROW LEVEL SECURITY;`.
- In `single_owner` mode, the Service Role key is used strictly server-side to bypass auth limitations.

## When to use
- Relational data storage (Profiles, Brands, Posts).
- Audit logging (`workflow_logs`).
- Identity and Access Management.

## When not to use
- Do not use for high-frequency time-series data without optimization.
- Do not store plaintext third-party API keys (always encrypt before inserting).
