# Migration Deployment Plan

Date: 2026-06-01
Role: Senior Supabase DBA
Scope: Planning only. Migrations were inspected but not executed.
Target Supabase project: `nyartblhcenvbworsgxn`

## Objective

Deploy the existing application migrations into the connected Supabase project, which currently exposes zero application tables in the `public` schema.

Migration files in scope:

1. `supabase/migrations/0001_initial_schema.sql`
2. `supabase/migrations/0002_single_owner_schema.sql`

## Syntax Validation

Static syntax inspection result:

| File | Statements | Quote Blocks | Dollar Blocks | Notes |
| --- | ---: | --- | --- | --- |
| `0001_initial_schema.sql` | 19 | Balanced | Balanced | Ends with semicolon |
| `0002_single_owner_schema.sql` | 1 | Balanced | Balanced | Statement has semicolon; file ends with comment |

Validation method:

- Static SQL boundary scan for semicolons outside quotes / dollar blocks.
- Balanced single quotes, double quotes, and `$$` blocks.
- Manual dependency review.

Limitations:

- This plan did not execute SQL against Supabase.
- Full PostgreSQL parser validation requires a live database execution or a direct PostgreSQL parser. That was intentionally not performed.

## Execution Order

Required order:

1. Run `0001_initial_schema.sql`.
2. Run `0002_single_owner_schema.sql`.
3. Refresh/reload PostgREST schema cache if the Supabase UI does not expose the tables immediately.
4. Run post-deployment verification.

Reason:

- `0001` creates `public.profiles`.
- `0002` depends on `public.profiles` and drops the `profiles.id -> auth.users.id` foreign key for Single Owner compatibility.
- Running `0002` before `0001` will fail because `public.profiles` does not exist.

## Tables That Will Be Created

### `public.profiles`

Purpose: base user/owner profile records.

Columns:

| Column | Type | Nullable | Default | Notes |
| --- | --- | --- | --- | --- |
| `id` | `uuid` | No | None | Primary key; initially references `auth.users`; decoupled by `0002` |
| `email` | `text` | Yes | None | Owner/user email |
| `created_at` | `timestamp with time zone` | No | `timezone('utc'::text, now())` | Creation timestamp |
| `updated_at` | `timestamp with time zone` | No | `timezone('utc'::text, now())` | Update timestamp |

### `public.brands`

Purpose: brand profile and content voice configuration.

Columns:

| Column | Type | Nullable | Default | Notes |
| --- | --- | --- | --- | --- |
| `id` | `uuid` | No | `uuid_generate_v4()` | Primary key |
| `user_id` | `uuid` | No | None | References `public.profiles(id)` |
| `name` | `text` | No | None | Business/brand name |
| `business_type` | `text` | Yes | None | Business category |
| `target_audience` | `text` | Yes | None | Audience segment |
| `tone` | `text` | Yes | None | Brand tone |
| `personality` | `text` | Yes | None | Brand personality |
| `created_at` | `timestamp with time zone` | No | `timezone('utc'::text, now())` | Creation timestamp |
| `updated_at` | `timestamp with time zone` | No | `timezone('utc'::text, now())` | Update timestamp |

### `public.integrations`

Purpose: encrypted external service credentials.

Columns:

| Column | Type | Nullable | Default | Notes |
| --- | --- | --- | --- | --- |
| `id` | `uuid` | No | `uuid_generate_v4()` | Primary key |
| `user_id` | `uuid` | No | None | References `public.profiles(id)` |
| `provider` | `text` | No | None | Expected values include `openai`, `buffer`, `facebook` |
| `encrypted_value` | `text` | No | None | Encrypted API key/token |
| `created_at` | `timestamp with time zone` | No | `timezone('utc'::text, now())` | Creation timestamp |
| `updated_at` | `timestamp with time zone` | No | `timezone('utc'::text, now())` | Update timestamp |

Constraints:

- Unique constraint on `(user_id, provider)`.

### `public.workflow_logs`

Purpose: generation/publishing audit trail.

Columns:

| Column | Type | Nullable | Default | Notes |
| --- | --- | --- | --- | --- |
| `id` | `uuid` | No | `uuid_generate_v4()` | Primary key |
| `user_id` | `uuid` | No | None | References `public.profiles(id)` |
| `action` | `text` | No | None | Example: `generate_request`, `buffer_publish` |
| `topic` | `text` | Yes | None | Content topic or provider context |
| `status` | `text` | No | None | Example: `pending`, `completed`, `failed` |
| `created_at` | `timestamp with time zone` | No | `timezone('utc'::text, now())` | Creation timestamp |

### `public.content_posts`

Purpose: generated content drafts and publishing state.

Columns:

| Column | Type | Nullable | Default | Notes |
| --- | --- | --- | --- | --- |
| `id` | `uuid` | No | `uuid_generate_v4()` | Primary key |
| `workflow_id` | `uuid` | Yes | None | References `public.workflow_logs(id)` |
| `user_id` | `uuid` | No | None | References `public.profiles(id)` |
| `content` | `text` | No | None | Generated post content |
| `status` | `text` | No | `draft` | Expected values include `draft`, `approved`, `published`, `failed` |
| `buffer_post_id` | `text` | Yes | None | External Buffer ID |
| `created_at` | `timestamp with time zone` | No | `timezone('utc'::text, now())` | Creation timestamp |
| `updated_at` | `timestamp with time zone` | No | `timezone('utc'::text, now())` | Update timestamp |

## Foreign Keys

Foreign keys created by `0001`:

| Table | Column | References | Delete Behavior |
| --- | --- | --- | --- |
| `public.profiles` | `id` | `auth.users(id)` | `ON DELETE CASCADE` |
| `public.brands` | `user_id` | `public.profiles(id)` | `ON DELETE CASCADE` |
| `public.integrations` | `user_id` | `public.profiles(id)` | `ON DELETE CASCADE` |
| `public.workflow_logs` | `user_id` | `public.profiles(id)` | `ON DELETE CASCADE` |
| `public.content_posts` | `workflow_id` | `public.workflow_logs(id)` | `ON DELETE CASCADE` |
| `public.content_posts` | `user_id` | `public.profiles(id)` | `ON DELETE CASCADE` |

Foreign key modified by `0002`:

- Drops `profiles_id_fkey` if it exists.
- Final desired state for Single Owner Mode: `public.profiles.id` remains the primary key but no longer requires a matching `auth.users` record.

## Indexes / Constraints

Indexes created implicitly by constraints:

| Table | Index / Constraint |
| --- | --- |
| `public.profiles` | Primary key on `id` |
| `public.brands` | Primary key on `id` |
| `public.integrations` | Primary key on `id` |
| `public.integrations` | Unique constraint on `(user_id, provider)` |
| `public.workflow_logs` | Primary key on `id` |
| `public.content_posts` | Primary key on `id` |

No explicit secondary indexes are defined in the existing migrations.

## RLS Policies

RLS enabled by `0001`:

- `public.profiles`
- `public.brands`
- `public.integrations`
- `public.workflow_logs`
- `public.content_posts`

Policies created by `0001`:

| Policy | Table | Command | Predicate |
| --- | --- | --- | --- |
| `Users can view own profile.` | `public.profiles` | `SELECT` | `auth.uid() = id` |
| `Users can update own profile.` | `public.profiles` | `UPDATE` | `auth.uid() = id` |
| `Users can manage own brands.` | `public.brands` | `ALL` | `auth.uid() = user_id` |
| `Users can manage own integrations.` | `public.integrations` | `ALL` | `auth.uid() = user_id` |
| `Users can manage own workflow logs.` | `public.workflow_logs` | `ALL` | `auth.uid() = user_id` |
| `Users can manage own content posts.` | `public.content_posts` | `ALL` | `auth.uid() = user_id` |

Single Owner Mode uses the service role client server-side, so it bypasses RLS. These policies remain important for future `multi_user` mode.

## Functions And Triggers

Function created by `0001`:

- `public.handle_new_user()`
- Type: trigger function
- Security: `security definer`
- Behavior: inserts new `auth.users` rows into `public.profiles`.

Trigger created by `0001`:

- `on_auth_user_created`
- Table: `auth.users`
- Event: `AFTER INSERT`
- Procedure: `public.handle_new_user()`

## Single Owner Compatibility

Current app settings:

- `APP_MODE=single_owner`
- `DEFAULT_OWNER_ID=00000000-0000-0000-0000-000000000001`
- Server-side `SUPABASE_SERVICE_ROLE_KEY` is configured.

Compatibility requirement:

- `public.profiles` must allow inserting `DEFAULT_OWNER_ID` without requiring a matching row in `auth.users`.

How existing migrations handle this:

1. `0001` creates `public.profiles.id` with an FK to `auth.users(id)`.
2. `0002` drops `profiles_id_fkey`.

Verdict:

- The migration set is compatible with Single Owner Mode only if `0002` runs immediately after `0001`.
- If only `0001` is applied, Single Owner profile seeding can fail because `DEFAULT_OWNER_ID` is not guaranteed to exist in `auth.users`.

## Deployment Procedure

Do not run this during planning. Exact procedure when approved:

1. Open Supabase dashboard.
2. Confirm active project ref is `nyartblhcenvbworsgxn`.
3. Open SQL Editor.
4. Run the entire contents of `supabase/migrations/0001_initial_schema.sql`.
5. Confirm execution succeeds.
6. Run the entire contents of `supabase/migrations/0002_single_owner_schema.sql`.
7. Confirm execution succeeds.
8. If tables do not immediately appear through REST, refresh the PostgREST schema cache from Supabase dashboard or wait briefly and retry.
9. Run post-deployment verification:
   - `public.profiles` exists.
   - `public.brands` exists.
   - `public.integrations` exists.
   - `public.workflow_logs` exists.
   - `public.content_posts` exists.
   - RLS is enabled on all five tables.
   - `profiles_id_fkey` is absent.
   - `DEFAULT_OWNER_ID` can be inserted/upserted into `public.profiles`.
10. Re-run the production smoke test.

## Risks

### Partial Deployment Risk

`CREATE TABLE IF NOT EXISTS` and `CREATE EXTENSION IF NOT EXISTS` are idempotent, but the policies and trigger are not written with `IF NOT EXISTS`.

If a previous partial migration created policies or trigger objects, rerunning `0001` can fail at:

- `create policy ...`
- `create trigger on_auth_user_created ...`

Mitigation:

- Because the current project exposes zero app tables, this risk appears low.
- If SQL execution fails with “already exists,” inspect existing object state before rerunning modified SQL.

### Single Owner FK Risk

If `0001` succeeds but `0002` does not run, `public.profiles.id` remains tied to `auth.users(id)`.

Impact:

- `seedDefaultProfile()` can fail for `DEFAULT_OWNER_ID`.
- Single Owner Mode can still return the owner object in code, but database writes depending on `profiles` may fail.

Mitigation:

- Run `0002` immediately after `0001`.
- Verify `profiles_id_fkey` is absent.

### Future Multi-User Risk

Dropping the `profiles.id -> auth.users.id` FK supports Single Owner Mode but weakens referential enforcement for multi-user auth profiles.

Impact:

- Multi-user mode relies on app logic and RLS policies rather than this FK for profile/auth consistency.

Mitigation:

- Accept for current Single Owner deployment.
- Revisit schema if multi-user mode becomes production-critical.

### Missing Secondary Indexes

The current migrations do not define indexes on common lookup columns such as:

- `brands.user_id`
- `integrations.user_id`
- `workflow_logs.user_id`
- `content_posts.user_id`
- `content_posts.status`
- `content_posts.created_at`

Impact:

- Small datasets are fine.
- Larger production datasets may need query performance tuning.

Mitigation:

- Not part of this deployment because the instruction is to apply existing migrations.
- Plan a separate performance migration after functional verification.

### Schema Cache Delay

Supabase PostgREST may need time or a cache reload before newly created tables appear through REST.

Mitigation:

- After migration execution, check SQL table list first, then REST/OpenAPI.
- Reload schema cache if REST still reports `PGRST205`.

## Rollback Procedure

Use rollback only if deployment fails and the project must return to its previous empty application-schema state.

Recommended rollback SQL order:

```sql
-- Drop auth trigger first because it depends on public.handle_new_user()
drop trigger if exists on_auth_user_created on auth.users;

drop function if exists public.handle_new_user();

-- Drop dependent tables before parent tables
drop table if exists public.content_posts cascade;
drop table if exists public.workflow_logs cascade;
drop table if exists public.integrations cascade;
drop table if exists public.brands cascade;
drop table if exists public.profiles cascade;
```

Rollback notes:

- This deletes all application data in those tables.
- Do not drop `uuid-ossp`; it may be used by other schemas or future app migrations.
- If only a partial migration ran, execute only the relevant rollback statements after inspecting actual objects.

## Final Recommendation

The existing migration order is valid:

1. `0001_initial_schema.sql`
2. `0002_single_owner_schema.sql`

The plan is ready for an approved deployment window. Do not deploy until the project owner confirms that `nyartblhcenvbworsgxn` is the intended target and accepts the Single Owner FK tradeoff introduced by `0002`.
