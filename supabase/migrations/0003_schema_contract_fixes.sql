-- Align production schema with server action contracts.
-- Brand profile upsert uses onConflict: 'user_id'.
alter table public.brands
  add constraint brands_user_id_key unique (user_id);

-- Generated drafts store structured title/caption/hashtags/platform metadata.
alter table public.content_posts
  add column if not exists metadata jsonb not null default '{}'::jsonb;
