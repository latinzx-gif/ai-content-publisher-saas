# Editor Canvas RC1.1 Cleanup

Date: 2026-06-04
Scope: Approved P1 Editor Canvas cleanup only.

## Files Changed

- `src/components/generate/generate-form.tsx`
- `reports/EDITOR_CANVAS_RC11_CLEANUP.md`

## Removed Dead Actions

- Removed the non-functional TH/EN header toggle from Editor Canvas.
- Removed the decorative three-dot action icon from the post preview card.
- Removed decorative social actions from the post preview card:
  - Like
  - Comment
  - Share
  - Send
- Replaced the fake social action row with a static `Preview only` label.

## Removed Mock Analytics

- Removed the entire `Content Performance Score` section.
- Removed hardcoded score metrics:
  - Hook Strength
  - Readability Meter
  - Engagement Potential
  - CTA Strength
- Removed unused icon imports tied to the mock score and dead action UI.

## Dead Template / Angle Link Audit

- `View all ->` and `Browse all templates ->` were not present in the current Editor Canvas implementation.
- `Manage ->` for content angles was not present in the current Editor Canvas implementation.
- Working preset/template buttons were preserved.

## Validation Results

- `npm run typecheck`: Passed.
- `npm run build`: Passed after rerunning with elevated permissions because the default sandbox blocked Turbopack's internal process/port binding.

## Known Warnings

Build completed with existing warnings outside this RC1.1 scope:

- Next.js workspace-root warning due multiple lockfiles.
- `src/app/(dashboard)/calendar/page.tsx`: unused `getDayNames`, unused `getMonthName`, and raw `<img>` warning.
- `src/components/drafts/drafts-list.tsx`: raw `<img>` warnings for selected/generated image previews.
- `src/components/layout/navbar.tsx`: unused `isSingleOwner`.
- `src/components/layout/sidebar.tsx`: unused `Briefcase` and `isSingleOwner`.

## Remaining Improvement Opportunities

- Replace the removed score panel later with factual post-generation metadata such as word count, token usage, or generation cost.
- Make content presets template-aware for Legal vs Accounting brands.
- Add a real language/output-mode control only if it changes generation behavior visibly.
- Replace remaining raw image tags in non-Editor Canvas files with optimized image components.
