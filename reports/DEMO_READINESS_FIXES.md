# Phase A Demo-Readiness Fixes — Summary

**Date:** 2026-06-04  
**Context:** Codex completed Phase A demo-readiness fixes per the Demo Ready Roadmap.  
**Status:** Uncommitted — review and human sign-off required before commit.

---

## 1. Files Changed

**Phase A demo-readiness fixes (7 files):**

| File | Δ Lines | Change |
|------|---------|--------|
| `src/config/navigation.ts` | −32 | Removed Campaign Factory and Asset Composer from main nav; removed dead imports (Layers, LockKeyhole, Settings icons) |
| `src/app/(dashboard)/calendar/page.tsx` | +21/−0 | Added Link import; updated "real posts from Supabase" label to "posts in your publishing pipeline" |
| `src/components/dashboard/dashboard-client.tsx` | +86/−?? | Major dashboard rewrite with empty states, setup health summary, template badge, guided CTAs |
| `src/components/drafts/drafts-list.tsx` | +220/−?? | Removed dead filter/search controls; replaced with Select-based filters; added `toActionableToast()` for error handling; improved fallback language |
| `src/components/generate/generate-form.tsx` | +346/−?? | Simplified first-run path; added template display badge with color swatches; added AlertCircle import; cleaned up template descriptions |
| `src/components/settings/brand-profile-form.tsx` | +36/−? | Enhanced template selector with color swatches, title, and description per theme |
| `src/components/settings/integration-settings-form.tsx` | +25/−? | Added "Demo Readiness" guidance panel with OpenAI/Buffer status badges and Thai/EN copy |

**Supporting/infra changes (8 files — pre-existing or unrelated):**

| File | Note |
|------|------|
| `src/actions/drafts.ts` | Pre-existing changes (not Phase A) |
| `src/actions/publish.ts` | Pre-existing changes |
| `src/lib/openai/index.ts` | Pre-existing changes |
| `src/lib/publishing/buffer.ts` | Pre-existing changes |
| `src/lib/publishing/types.ts` | Pre-existing changes |
| `package.json` | Pre-existing `sharp` dependency |
| `package-lock.json` | Lockfile update |
| `supabase/migrations/0007_template_key.sql` | Pre-existing migration |

**Documents (untracked — not part of changeset):**
`reports/` — 12+ audit/review reports created this session.

---

## 2. Six Fixes Completed

### Fix 1 — Hide future/locked modules ✅

**Files:** `src/config/navigation.ts`

Removed Campaign Factory and Asset Composer from the main navigation entirely. Previously they appeared as navigable links leading to locked/mock pages — a dead-end UX that erodes trust during a live demo. The commented-out Asset Composer entry was also removed to clean up dead code.

### Fix 2 — Fix duplicate Settings/Integrations navigation ✅

**Files:** `src/config/navigation.ts`

Removed the duplicated `Settings` navigation entry. The Settings and Integrations pages pointed to the same route, creating a confusing duplicate in the sidebar. Now only one entry remains.

### Fix 3 — Remove or wire dead Draft Review controls ✅

**Files:** `src/components/drafts/drafts-list.tsx`

- Removed dead filter/search UI controls (`Search`, `Filter`, `Input`, `ChevronDown` icons) that had no backend wiring
- Replaced with working `Select`-based filters using the shadcn Select component
- Added `toActionableToast()` helper that maps common error patterns (OpenAI, Buffer, Storage) to human-readable messages instead of raw error strings
- Improved fallback count warning language to include actionable guidance about checking OpenAI key/billing

### Fix 4 — Add guided empty states ✅

**Files:** `src/components/dashboard/dashboard-client.tsx`

- Dashboard rewritten to detect empty state (zero posts) and render a guided setup prompt instead of a blank metric panel
- Shows a "setup health" summary with brand profile, OpenAI key, and integration status
- Adds template badge to the dashboard header showing the active Legal/Accounting theme
- Includes clear CTAs guiding the user to their next step

### Fix 5 — Simplify Generator first path ✅

**Files:** `src/components/generate/generate-form.tsx`

- Added `TEMPLATE_DISPLAY` mapping to show the active template (Legal/Accounting) as a visible badge with color dot and tone description at the top of the generator
- Added `getInitials()` helper for brand avatar fallback
- Refined content template descriptions to be more demo-appropriate
- Cleaned up unused imports and simplified the form entry point

### Fix 6 — Show Legal/Accounting template clearly ✅

**Files:** `src/components/settings/brand-profile-form.tsx`, `src/components/generate/generate-form.tsx`

- **Brand Profile:** Enhanced the template selector with rich display — each option now includes `title`, `description`, and `color swatches` (3 colors per theme). An "Active Template" card below the selector shows the current theme with its color palette circles and description.
- **Generator:** Added a template badge at the top of the generate form showing the active template name, color dot, and tone description — making the Dual Template System visible before and during content generation.

---

## 3. Validation Results

| Check | Result |
|-------|--------|
| `npm run typecheck` | **PASS** (exit 0) |
| `npm run build` | **PASS** (exit 0) after rerunning outside sandbox restriction |
| New warnings introduced | **None** — all warnings are pre-existing |

---

## 4. Known Warnings (Pre-Existing — Not Introduced by Phase A)

### Next.js Multiple Lockfiles Warning
```
Warning: Next.js inferred your workspace root, but it may not be correct.
Detected additional lockfiles:
  - /Users/jakarinosk/package-lock.json
  - /Users/jakarinosk/Desktop/package-lock.json
```
This is a Next.js Turbopack warning caused by multiple `package-lock.json` files in parent directories. Unrelated to Phase A changes. Can be silenced by setting `turbopack.root` in `next.config.ts`.

### Unused Helper Warnings
```
calendar/page.tsx:  getDayNames unused
calendar/page.tsx:  getMonthName unused
navbar.tsx:         isSingleOwner assigned but never used
sidebar.tsx:        isSingleOwner assigned but never used
sidebar.tsx:        Briefcase defined but never used
```
Pre-existing unused imports in calendar, navbar, and sidebar components. Not affected by Phase A.

### Raw `<img>` Tag Warnings
```
drafts-list.tsx:  Using <img> could result in slower LCP
```
Three instances of raw `<img>` tags in `drafts-list.tsx` (lines 469, 530) and `calendar/page.tsx` (line 276). These are pre-existing and would require `next/image` migration or a custom image loader to resolve.

---

## 5. Remaining Issues

### Before Commit/Push
- [ ] **No commit yet** — all Phase A changes are unstaged/uncommitted
- [ ] **No push yet** — no remote changes
- [ ] **Final human review required** — verify all six fixes render correctly in the browser
- [ ] **UI polish may remain** after Phase A — see Phase B items in `reports/DEMO_READY_ROADMAP.md` for lower-priority improvements

### Post-Commit
- [ ] DB migration (`0007_template_key.sql`) must still be applied manually via Supabase SQL editor
- [ ] Template selector UI values won't persist until the `template_key` column exists in the DB

---

## Current Working Tree

```
$ git status --short
 M src/config/navigation.ts
 M src/app/(dashboard)/calendar/page.tsx
 M src/components/dashboard/dashboard-client.tsx
 M src/components/drafts/drafts-list.tsx
 M src/components/generate/generate-form.tsx
 M src/components/settings/brand-profile-form.tsx
 M src/components/settings/integration-settings-form.tsx
 M ... (pre-existing unrelated changes in 8 other files)
```

All Phase A changes are modified but unstaged. Ready for review, staging, commit, and push once signed off.