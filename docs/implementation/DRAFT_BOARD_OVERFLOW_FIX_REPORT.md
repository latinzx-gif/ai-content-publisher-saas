# Root Cause

The Drafts / Review Board had Kanban columns inside the same grid area as the right notes panel. The Kanban container used horizontal scrolling, but the columns only had `min-w` rules. In practice, column content could expand beyond the intended width, and the grid wrapper did not explicitly hide page-level horizontal overflow.

This made the Scheduled column appear cut off and could create the impression of page-level horizontal scrolling instead of clearly contained Kanban scrolling.

# Files Modified

- `src/app/(dashboard)/drafts/page.tsx`
- `src/components/drafts/drafts-list.tsx`

# Fix Applied

- Added page-level horizontal containment:
  - `min-w-0`
  - `overflow-x-hidden`
- Changed the main Draft Board layout to use explicit grid tracks:
  - `xl:grid-cols-[minmax(0,3fr)_minmax(260px,1fr)]`
- Wrapped the Kanban board in a dedicated overflow boundary:
  - Outer board wrapper: `min-w-0 overflow-hidden`
  - Scroll viewport: `overflow-x-auto`
  - Inner row: `flex flex-row flex-nowrap w-max min-w-full`
- Locked each Kanban column to healthy widths:
  - `w-[280px]`
  - `min-w-[280px]`
  - `md:w-[320px]`
  - `md:min-w-[320px]`
  - `max-w-[320px]`
  - `flex-shrink-0`
- Added `min-w-0` to the right notes panel so it cannot force the whole page wider.

Visual design, workflow logic, database logic, sidebar, and navigation were not changed.

# Validation Results

Commands:

- `npm run typecheck`: Passed
- `npm run build`: Passed

Build notes:

- The first sandboxed build hit the known Turbopack local port restriction.
- A second build failed while the dev server was still using `.next`.
- After stopping the dev server, `npm run build` passed.
- Existing lint warnings remain for unrelated unused imports and variables.

Browser verification at `/drafts` with viewport `1366x768`:

- `document.body.scrollWidth`: `1366`
- `document.documentElement.scrollWidth`: `1366`
- `window.innerWidth`: `1366`
- Page-level horizontal overflow: no
- Kanban board client width: `762`
- Kanban board scroll width: `1328`
- Kanban internal horizontal scroll: yes
- Kanban row display: `flex`
- Kanban row wrap: `nowrap`
- Column widths: `320, 320, 320, 320`
- Scheduled column visible after internal board scroll: yes
- Browser console errors: `0`

# Remaining Risks

- The Kanban board intentionally scrolls horizontally when four columns exceed the board area.
- Existing lint warnings remain in unrelated files and were not addressed as part of this scoped overflow fix.
- Very long unbroken content inside cards may still require future text wrapping hardening, but current generated draft content did not create page-level overflow.
