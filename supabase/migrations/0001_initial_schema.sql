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
