create table if not exists public.review_board_notes (
  id uuid default uuid_generate_v4() primary key,
  user_id uuid references public.profiles(id) on delete cascade not null,
  board_key text not null default 'drafts',
  note text not null default '',
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null,
  unique (user_id, board_key)
);

create index if not exists review_board_notes_user_id_idx
  on public.review_board_notes(user_id);

alter table public.review_board_notes enable row level security;

create policy "Users can manage own review board notes."
  on public.review_board_notes
  for all
  using (auth.uid() = user_id)
  with check (auth.uid() = user_id);
