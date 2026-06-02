# Executive Summary

Implemented the next minimum sellable workflow increment for the Review Board:

- CSV export for selected posts, with approved-post fallback.
- TXT export for selected posts, with approved-post fallback.
- Board-level review note persistence through a new Supabase migration and server actions.
- Loading, success, and error states for export and review note saving.

No calendar scheduling, per-post notes, or visual redesign work was added.

# Files Modified

- `src/actions/drafts.ts`
- `src/app/(dashboard)/drafts/page.tsx`
- `src/components/drafts/drafts-list.tsx`
- `supabase/migrations/0005_review_board_notes.sql`
- `docs/implementation/MINIMUM_SELLABLE_WORKFLOW_IMPLEMENTATION.md`

# Supabase Schema

Added migration:

- `supabase/migrations/0005_review_board_notes.sql`

Schema:

```sql
create table if not exists public.review_board_notes (
  id uuid default uuid_generate_v4() primary key,
  user_id uuid references public.profiles(id) on delete cascade not null,
  board_key text not null default 'drafts',
  note text not null default '',
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null,
  unique (user_id, board_key)
);
```

The MVP intentionally stores one note per owner per board. It does not attach notes to individual `content_posts`.

# Export Workflow

CSV export:

- Uses selected posts when at least one post is selected.
- Falls back to all approved posts when no post is selected.
- Downloads a client-side CSV file.
- Includes `id`, `status`, `platform`, `topic`, `title`, `caption`, `hashtags`, `created_at`, and `updated_at`.

TXT export:

- Uses the same selection and fallback behavior.
- Downloads a client-side TXT file.
- Formats each post as a readable content block.

# Review Notes Workflow

- `/drafts` loads the persisted board-level note with `getReviewBoardNote()`.
- The right-side Review Notes panel saves with `saveReviewBoardNote()`.
- The save action upserts by `user_id` and `board_key = drafts`.
- Save events are recorded in `workflow_logs` as `review_note_saved`.

# Validation Results

- `npm run typecheck`: Passed.
- `npm run build`: Passed.

Build warnings remain for existing unused imports/variables. They do not block the build.

# Deployment Status

The migration file is ready, but the connected Supabase project did not yet contain `public.review_board_notes` during verification. Deploy `supabase/migrations/0005_review_board_notes.sql` before using persisted board notes in the connected environment.

# Remaining Risks

- Review notes will fail at runtime until migration `0005_review_board_notes.sql` is deployed.
- Export is client-side only and does not store export history.
- Board notes are board-level only by design; per-post review notes are intentionally out of scope.
- Calendar scheduling remains static/mock and was not changed.
