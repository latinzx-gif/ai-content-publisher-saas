# UX Functionality Audit

## Executive Summary
This audit reviews the current platform UX to identify functional state, mock data presence, and missing microcopy. Overall, the core client workflow (Brand Setup → Generate → Review → Publish) is fully functional and connected to the database. However, there are two major sections (Calendar and Asset Composer) that are highly detailed UI mockups intended for Milestone 2. Additionally, several secondary actions (filters, notes, add buttons) are placeholders. The recommendations focus on adding "Coming Soon" labels, disabling non-functional UI, and improving empty states without altering the approved design.

## Menu Functionality Status

| Menu | Route | Current Status | Issue | Recommendation | Priority |
|---|---|---|---|---|---|
| Operations Dashboard | `/` | Functional | None | Keep as is | High |
| Editor Canvas | `/generate` | Functional | None | Keep as is | High |
| Review Board | `/drafts` | Functional | None | Keep as is | High |
| Calendar & Publishing | `/calendar` | Mock / Demo Only | Entirely mock UI | Mark as "Coming Soon (Milestone 2)" | High |
| Asset Composer | `/asset-composer` | Mock / Demo Only | Entirely mock UI | Mark as "Coming Soon (Milestone 2)" | High |
| Brand & Voice | `/profile` | Functional | None | Keep as is | High |
| Integrations | `/settings` | Functional | Redundant link | Keep this one | Medium |
| Settings | `/settings` | Duplicate | Points to same route as Integrations | Hide/Remove from `navigation.ts` | Medium |

## Button / CTA Audit

| Page | Button | Current Behavior | Issue | Recommendation |
|---|---|---|---|---|
| Dashboard | Apply Pattern | Clickable, no action | Confusing for users | Add tooltip "Demo Only" or hide |
| Dashboard | Channel Health "View All" | Clickable, no `href` | Does nothing | Hide or link to `/drafts` |
| Review Board | + Add content | Clickable, no action | Does nothing | Change to link to `/generate` |
| Review Board | More filters | Clickable, no action | Does nothing | Hide or add "Coming Soon" tooltip |
| Review Board | Save note | Shows toast only | State does not persist | Add "Coming Soon" or disable |
| Calendar | Ready to publish | Shows toast only | Mock action | Add "Coming Soon" label |
| Asset Composer| Generate Content | Shows toast only | Mock action | Add "Coming Soon" label |

## Mock / Demo Data Audit

| Page | Mock Data | Risk | Recommendation |
|---|---|---|---|
| Dashboard | Smart Input Pattern examples | Low, clearly educational | Leave as is, but clarify it's a demo |
| Review Board | Filter dropdown values | Medium, users will try to filter | Disable filter dropdowns or mark as Coming Soon |
| Calendar | All events, queue, readiness | High, misleading | Add clear banner indicating "Preview Mode / Milestone 2" |
| Asset Composer| Output metadata, layouts | High, misleading | Add clear banner indicating "Preview Mode / Milestone 2" |

## Empty State Audit

| Page | Current Empty State | Issue | Recommended Copy |
|---|---|---|---|
| Dashboard | Snapshot: "No content posts yet." | Lacks direction | "No content posts yet. Go to Editor Canvas to create your first draft." |
| Review Board | Empty columns show nothing | Unclear if broken or empty | "No drafts in this stage." |
| Dashboard | Upcoming Queue: "No approved posts queued."| A bit brief | "Approve drafts in the Review Board to see them here." |

## Microcopy Improvements

| Page | Location | Current Copy | Recommended Copy |
|---|---|---|---|
| Calendar | Header subtitle | Plan and schedule... | [Coming Soon] Plan and schedule... |
| Asset Composer| Header subtitle | Configure visual... | [Coming Soon] Configure visual... |
| Review Board | Notes sidebar | Add a note for this board... | Notes (Coming Soon) |

## Client Workflow Review

- **Brand Setup**: PASS. Fully functional.
- **OpenAI Setup**: PASS. Fully functional.
- **Knowledge Sources**: PASS. Can add URLs and manual text during Generation.
- **Generate**: PASS. Generates real drafts to the database.
- **Draft Review**: PASS. Shows real database posts.
- **Approve**: PASS. Status transitions properly.
- **Publish**: PASS. Buffer integration triggers successfully.

*Note: The primary workflow is robust. The issues lie strictly in the peripheral "future scope" UI components.*

## Menus To Keep
- Workspace: Operations Dashboard, Editor Canvas, Review Board
- Engine Settings: Brand & Voice, Integrations

## Menus To Hide
- Settings (Duplicate of Integrations)

## Menus To Mark As Coming Soon
- Calendar & Publishing
- Asset Composer

## Milestone 1 Must-Fix Items
1. Hide the duplicate "Settings" navigation link.
2. Link the "+ Add content" buttons in the Review Board columns to the `/generate` route, or hide them.
3. Add a disabled state or "Coming Soon" tooltip to the Review Board filters and Save Note button.
4. Improve the empty state copy on the Dashboard's Campaign Snapshot.

## Milestone 2 Suggestions
1. Fully implement Calendar drag-and-drop scheduling.
2. Implement image/asset generation for the Asset Composer.
3. Wire up Review Board filters to actually filter the Supabase query.
4. Persist Review Board notes to a `workspace_notes` table.

## Final Recommendation
The platform layout and design system are highly polished and premium. The core workflow required for Milestone 1 is functionally complete. The immediate next step should be adding "Coming Soon" / "Milestone 2" badges to the non-functional screens (Calendar, Asset Composer) and removing dead-end UI elements (duplicate menus, empty buttons) to prevent client confusion during UAT. No architectural or visual redesign is needed.
