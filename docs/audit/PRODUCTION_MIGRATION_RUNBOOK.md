# Production Migration Runbook

Date: 2026-06-01
Role: Senior Supabase DBA and Production Release Engineer
Target project: `nyartblhcenvbworsgxn`
Scope: Prepare only. Do not execute SQL automatically.

## Deployment Summary

This runbook prepares deployment of the existing migrations:

1. `supabase/migrations/0001_initial_schema.sql`
2. `supabase/migrations/0002_single_owner_schema.sql`

Static validation completed:

| Migration | Statements | SQL Block Balance | Result |
| --- | ---: | --- | --- |
| `0001_initial_schema.sql` | 19 | Quotes and `$$` blocks balanced | Valid for deployment planning |
| `0002_single_owner_schema.sql` | 1 | Quotes and `$$` blocks balanced | Valid for deployment planning |

No SQL was executed during runbook preparation.

## Tables To Be Created

### `public.profiles`

| Column | Type | Constraints / Defaults |
| --- | --- | --- |
| `id` | `uuid` | Primary key; initially references `auth.users` with `on delete cascade` |
| `email` | `text` | Nullable |
| `created_at` | `timestamp with time zone` | Not null; defaults to UTC `now()` |
| `updated_at` | `timestamp with time zone` | Not null; defaults to UTC `now()` |

### `public.brands`

| Column | Type | Constraints / Defaults |
| --- | --- | --- |
| `id` | `uuid` | Primary key; defaults to `uuid_generate_v4()` |
| `user_id` | `uuid` | Not null; references `public.profiles(id)` with `on delete cascade` |
| `name` | `text` | Not null |
| `business_type` | `text` | Nullable |
| `target_audience` | `text` | Nullable |
| `tone` | `text` | Nullable |
| `personality` | `text` | Nullable |
| `created_at` | `timestamp with time zone` | Not null; defaults to UTC `now()` |
| `updated_at` | `timestamp with time zone` | Not null; defaults to UTC `now()` |

### `public.integrations`

| Column | Type | Constraints / Defaults |
| --- | --- | --- |
| `id` | `uuid` | Primary key; defaults to `uuid_generate_v4()` |
| `user_id` | `uuid` | Not null; references `public.profiles(id)` with `on delete cascade` |
| `provider` | `text` | Not null |
| `encrypted_value` | `text` | Not null |
| `created_at` | `timestamp with time zone` | Not null; defaults to UTC `now()` |
| `updated_at` | `timestamp with time zone` | Not null; defaults to UTC `now()` |

Constraints:

- Unique constraint on `(user_id, provider)`.

### `public.workflow_logs`

| Column | Type | Constraints / Defaults |
| --- | --- | --- |
| `id` | `uuid` | Primary key; defaults to `uuid_generate_v4()` |
| `user_id` | `uuid` | Not null; references `public.profiles(id)` with `on delete cascade` |
| `action` | `text` | Not null |
| `topic` | `text` | Nullable |
| `status` | `text` | Not null |
| `created_at` | `timestamp with time zone` | Not null; defaults to UTC `now()` |

### `public.content_posts`

| Column | Type | Constraints / Defaults |
| --- | --- | --- |
| `id` | `uuid` | Primary key; defaults to `uuid_generate_v4()` |
| `workflow_id` | `uuid` | Nullable; references `public.workflow_logs(id)` with `on delete cascade` |
| `user_id` | `uuid` | Not null; references `public.profiles(id)` with `on delete cascade` |
| `content` | `text` | Not null |
| `status` | `text` | Not null; defaults to `draft` |
| `buffer_post_id` | `text` | Nullable |
| `created_at` | `timestamp with time zone` | Not null; defaults to UTC `now()` |
| `updated_at` | `timestamp with time zone` | Not null; defaults to UTC `now()` |

## Constraints And Indexes

Implicit indexes/constraints created by migrations:

| Table | Constraint / Index |
| --- | --- |
| `profiles` | Primary key on `id` |
| `brands` | Primary key on `id` |
| `integrations` | Primary key on `id` |
| `integrations` | Unique constraint on `(user_id, provider)` |
| `workflow_logs` | Primary key on `id` |
| `content_posts` | Primary key on `id` |

No explicit secondary indexes are included in the existing migrations.

## Foreign Keys

| Table | Column | References | Deployment State |
| --- | --- | --- | --- |
| `profiles` | `id` | `auth.users(id)` | Created by Step 1, removed by Step 2 |
| `brands` | `user_id` | `profiles(id)` | Remains |
| `integrations` | `user_id` | `profiles(id)` | Remains |
| `workflow_logs` | `user_id` | `profiles(id)` | Remains |
| `content_posts` | `workflow_id` | `workflow_logs(id)` | Remains |
| `content_posts` | `user_id` | `profiles(id)` | Remains |

## RLS Policies

RLS will be enabled on:

- `public.profiles`
- `public.brands`
- `public.integrations`
- `public.workflow_logs`
- `public.content_posts`

Policies:

| Policy | Table | Command | Predicate |
| --- | --- | --- | --- |
| `Users can view own profile.` | `profiles` | `select` | `auth.uid() = id` |
| `Users can update own profile.` | `profiles` | `update` | `auth.uid() = id` |
| `Users can manage own brands.` | `brands` | `all` | `auth.uid() = user_id` |
| `Users can manage own integrations.` | `integrations` | `all` | `auth.uid() = user_id` |
| `Users can manage own workflow logs.` | `workflow_logs` | `all` | `auth.uid() = user_id` |
| `Users can manage own content posts.` | `content_posts` | `all` | `auth.uid() = user_id` |

## Triggers

Function:

- `public.handle_new_user()`
- Trigger function
- `security definer`
- Inserts new auth users into `public.profiles`.

Trigger:

- `on_auth_user_created`
- Runs after insert on `auth.users`
- Executes `public.handle_new_user()`.

## Single Owner Compatibility

Production app uses:

- `APP_MODE=single_owner`
- `DEFAULT_OWNER_ID=00000000-0000-0000-0000-000000000001`
- Server-side service role client

Compatibility requirement:

- `public.profiles.id` must not require a matching `auth.users.id`.

Deployment implication:

- Step 1 creates `profiles.id -> auth.users(id)`.
- Step 2 removes `profiles_id_fkey`.
- Step 2 is mandatory for Single Owner Mode.

## Execution Order

### Step 1

Run `0001_initial_schema.sql`.

### Step 2

Run `0002_single_owner_schema.sql`.

Do not reverse the order. Step 2 depends on `public.profiles` existing.

## SQL Blocks

### Step 1: Run `0001_initial_schema.sql`

Paste this entire block into Supabase SQL Editor while connected to project `nyartblhcenvbworsgxn`.

```sql
-- Enable UUID extension
create extension if not exists "uuid-ossp";

-- Table: profiles (Base user data)
create table if not exists public.profiles (
  id uuid references auth.users on delete cascade primary key,
  email text,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Table: brands (Brand profiles, tones, personality)
create table if not exists public.brands (
  id uuid default uuid_generate_v4() primary key,
  user_id uuid references public.profiles(id) on delete cascade not null,
  name text not null,
  business_type text,
  target_audience text,
  tone text,
  personality text,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Table: integrations (API Keys stored encrypted)
create table if not exists public.integrations (
  id uuid default uuid_generate_v4() primary key,
  user_id uuid references public.profiles(id) on delete cascade not null,
  provider text not null, -- 'openai', 'buffer', 'facebook', etc.
  encrypted_value text not null,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null,
  unique (user_id, provider)
);

-- Table: workflow_logs (Tracks generations and publishing actions)
create table if not exists public.workflow_logs (
  id uuid default uuid_generate_v4() primary key,
  user_id uuid references public.profiles(id) on delete cascade not null,
  action text not null, -- 'generate_request', 'buffer_publish'
  topic text,
  status text not null, -- 'pending', 'completed', 'failed'
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Table: content_posts (The generated output)
create table if not exists public.content_posts (
  id uuid default uuid_generate_v4() primary key,
  workflow_id uuid references public.workflow_logs(id) on delete cascade,
  user_id uuid references public.profiles(id) on delete cascade not null,
  content text not null,
  status text default 'draft' not null, -- 'draft', 'approved', 'published', 'failed'
  buffer_post_id text,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Enable RLS
alter table public.profiles enable row level security;
alter table public.brands enable row level security;
alter table public.integrations enable row level security;
alter table public.workflow_logs enable row level security;
alter table public.content_posts enable row level security;

-- Create Policies
create policy "Users can view own profile." on public.profiles for select using ( auth.uid() = id );
create policy "Users can update own profile." on public.profiles for update using ( auth.uid() = id );

create policy "Users can manage own brands." on public.brands for all using ( auth.uid() = user_id );
create policy "Users can manage own integrations." on public.integrations for all using ( auth.uid() = user_id );
create policy "Users can manage own workflow logs." on public.workflow_logs for all using ( auth.uid() = user_id );
create policy "Users can manage own content posts." on public.content_posts for all using ( auth.uid() = user_id );

-- Function to handle new user signup
create or replace function public.handle_new_user()
returns trigger as $$
begin
  insert into public.profiles (id, email)
  values (new.id, new.email);
  return new;
end;
$$ language plpgsql security definer;

-- Trigger for new user
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();
```

### Step 2: Run `0002_single_owner_schema.sql`

Paste this block only after Step 1 succeeds.

```sql
-- Drop the foreign key constraint from profiles to auth.users if it exists
-- This allows single_owner mode to seed a profile without requiring an auth.users record
ALTER TABLE public.profiles
  DROP CONSTRAINT IF EXISTS profiles_id_fkey;

-- Make sure id is still the primary key, but no longer enforces existing in auth.users
```

## Verification Checklist

Run this block after Step 1 and Step 2 complete.

```sql
-- Verify expected tables exist in public schema
select table_schema, table_name
from information_schema.tables
where table_schema = 'public'
  and table_name in (
    'profiles',
    'brands',
    'integrations',
    'workflow_logs',
    'content_posts'
  )
order by table_name;

-- Verify RLS enabled
select schemaname, tablename, rowsecurity
from pg_tables
where schemaname = 'public'
  and tablename in (
    'profiles',
    'brands',
    'integrations',
    'workflow_logs',
    'content_posts'
  )
order by tablename;

-- Verify policies exist
select schemaname, tablename, policyname, cmd, qual
from pg_policies
where schemaname = 'public'
  and tablename in (
    'profiles',
    'brands',
    'integrations',
    'workflow_logs',
    'content_posts'
  )
order by tablename, policyname;

-- Verify profiles_id_fkey removed for Single Owner Mode
select conname, contype, conrelid::regclass as table_name, confrelid::regclass as references_table
from pg_constraint
where conrelid = 'public.profiles'::regclass
order by conname;

-- Verify foreign keys on application tables
select conname, conrelid::regclass as table_name, confrelid::regclass as references_table
from pg_constraint
where contype = 'f'
  and conrelid in (
    'public.brands'::regclass,
    'public.integrations'::regclass,
    'public.workflow_logs'::regclass,
    'public.content_posts'::regclass
  )
order by table_name::text, conname;

-- Verify DEFAULT_OWNER_ID can exist in profiles
-- This is a read-only check if the row already exists.
select id, email, created_at, updated_at
from public.profiles
where id = '00000000-0000-0000-0000-000000000001';
```

Expected verification outcome:

- Five rows from `information_schema.tables`.
- RLS enabled for all five tables.
- Six policies present.
- `profiles` constraints show primary key only, not `profiles_id_fkey`.
- Foreign keys exist from child tables to `profiles` and from `content_posts.workflow_id` to `workflow_logs`.
- `DEFAULT_OWNER_ID` row may be absent immediately after migration; the app should seed it on first Single Owner server request. If validating write compatibility manually, use the optional controlled check below.

Optional controlled Single Owner insert/upsert check:

```sql
-- Optional write compatibility check.
-- Use only during approved validation because it writes one deterministic profile row.
insert into public.profiles (id, email)
values ('00000000-0000-0000-0000-000000000001', 'owner@example.com')
on conflict (id) do update
set email = excluded.email,
    updated_at = timezone('utc'::text, now());

select id, email
from public.profiles
where id = '00000000-0000-0000-0000-000000000001';
```

## Rollback Plan

Use only if deployment fails and the production owner approves rollback. This removes application schema objects and deletes application data in those tables.

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

- Do not drop `uuid-ossp`; other database objects may rely on it.
- If Step 1 partially succeeds, inspect actual objects before running the full rollback.
- If production data has been created after migration, rollback is destructive.

## Release Risks

1. Policy/trigger idempotency risk:
   - Tables use `if not exists`, but policies and trigger do not.
   - If a partial previous deployment exists, Step 1 can fail on duplicate policy or trigger names.

2. Single Owner risk:
   - Step 2 is mandatory.
   - Without Step 2, `DEFAULT_OWNER_ID` may fail to seed because it is not in `auth.users`.

3. Performance risk:
   - Existing migrations do not add secondary indexes on frequent lookup columns.
   - Acceptable for initial deployment, but should be revisited after workflow validation.

4. Schema cache risk:
   - Supabase PostgREST may briefly continue returning `PGRST205` after deployment.
   - Reload schema cache or wait, then retest.

## Final Pre-Deployment Gate

Before executing:

- Confirm SQL Editor is connected to `nyartblhcenvbworsgxn`.
- Confirm current public schema has no application tables or that partial objects have been reviewed.
- Run Step 1 fully.
- Run Step 2 immediately after Step 1.
- Run verification checklist.
- Re-run application smoke test only after verification passes.
