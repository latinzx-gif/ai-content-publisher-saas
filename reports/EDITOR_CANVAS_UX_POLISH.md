# Editor Canvas UX Polish

## Files Changed

- `src/components/generate/generate-form.tsx`
- `reports/EDITOR_CANVAS_UX_POLISH.md`

## UX Improvements Completed

1. Active Brand Switcher
   - Added Quick Mode brand switcher with Law and Accounting options.
   - Active selection is visually highlighted and exposed with `aria-pressed`.
   - Switching updates the displayed template context immediately.
   - Selection is held in Editor Canvas component state only.
   - Brand Profile data structure and backend persistence were not changed.

2. Language Chips
   - Replaced the primary language dropdown, secondary language dropdown, and Both versions toggle.
   - Added multi-select chips for TH, EN, 中文, and 日本語.
   - Default selection is TH + EN.
   - Generation compatibility is preserved by mapping the first selected language to `language` and the second selected language to `secondaryLanguage`.
   - Additional selected languages are included in the existing manual context instruction path.

3. Active Template Display
   - Replaced generic "Configured in Brand Profile" labels.
   - Law context now displays:
     - Saved Content Rules: Legal Professional Template
     - Saved Image Rules: Professional Minimal
   - Accounting context now displays:
     - Saved Content Rules: Accounting Professional Template
     - Saved Image Rules: Corporate Clean

4. Quick Mode Cleanup
   - Quick Mode now foregrounds the approved path:
     - Active Brand
     - Language
     - Content Topic
     - Number of Posts
     - Notes
     - Generate Content
   - No Calendar, Campaign Factory, Trend Engine, or Draft Review functionality was added.
   - Advanced controls remain available behind the existing Advanced Controls entry point.

## Validation Results

- `npm run typecheck`: Passed.
- `npm run build`: Passed after rerunning with elevated sandbox permissions for the known Turbopack worker process restriction.

## Known Warnings

The build still reports existing warnings outside this change:

- Multiple lockfiles / inferred Turbopack workspace root warning.
- Unused helpers in `src/app/(dashboard)/calendar/page.tsx`.
- Existing raw `<img>` warnings in calendar and drafts screens.
- Existing unused `isSingleOwner` / `Briefcase` warnings in layout components.

## Remaining Improvement Opportunities

- Persist the Quick Mode active brand selection to user preferences if the product later needs cross-session behavior.
- Add backend-level template override support if UI-only switching is not enough after RC1 demos.
- Improve multi-language generation beyond the current `language` + `secondaryLanguage` action contract.
- Review whether Quick Mode preview should be simplified further after client demo feedback.
