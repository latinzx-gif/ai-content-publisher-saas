# V1.1 Execution Master Plan — AI Content Publisher SaaS

**Version:** 1.0  
**Last updated:** 2026-06-03  
**Role:** Hermes PM  
**Target:** Post-MVP delivery (June 5, 2026 → TBD)

---

## 0. Executive Summary

V1.1 is a four-feature release built on the verified M1 foundation. The scope is driven by **revenue readiness** (Industry Templates → Prompt Library) and **operational scale** (Image Hosting → Knowledge Base). No V2 features. No Campaign Factory. No embeddings or vector search.

### Build Order (Mandatory)

```
Phase 1: Image Hosting ────────────── unblocks image-dependent workflows
    │
    ▼
Phase 2: Industry Templates ───────── revenue-first: sellable template packs
    │
    ▼
Phase 3: Prompt Library ───────────── depends on templates for initial content
    │
    ▼
Phase 4: Brand Knowledge Base ─────── depends on Prompt Library for authoring
```

### Dependency Graph

```
V1.1-A Image Hosting ──────────────────────────────────────────────────┐
                              │                                          │
V1.1-B Industry Templates ───┼──→ V1.1-C Prompt Library ──→ V1.1-D KB │
                              │                                          │
                  (revenue priority)          (authoring dependency)
```

---

## 1. V1.1-A: Image Hosting

### Problem
Buffer requires public `https://` image URLs. `gpt-image-1-mini` returns base64 `data:` URIs. The publish action at `src/actions/publish.ts` L50-55 explicitly blocks base64 images:
```
Buffer requires a public image URL. The selected image is stored as
base64 data and cannot be attached until it is hosted publicly.
```

**Image Hosting is not only a scale concern.** It directly unblocks real image publishing to Buffer. Without it, every image-format Facebook post fails at publish time with the error above. The MVP currently works only for `text_only` posts on production Buffer. Image Hosting is a **functional prerequisite** for the image workflow, not a post-MVP optimization.

### Solution
Upload generated images to Supabase Storage (bucket: `post-images`) and store the public URL.

### Workflow
```
generateImageOptions() produces base64 image
    ↓
Upload base64 to Supabase Storage `post-images` bucket
    ↓
Supabase returns public HTTPS URL
    ↓
Store public URL in content_posts.metadata.image_url (replaces base64)
    ↓
Publish action can now attach image to Buffer post
```

### Technical Decisions

| Decision | Choice | Rationale |
|----------|--------|-----------|
| Storage backend | Supabase Storage | Same project = same auth. No new infra. Built-in CDN via `PUBLICURL`. |
| Bucket name | `post-images` | Single purpose. Simple cleanup. |
| Upload timing | During `generateImageOptions()` | Immediately after generation. Image exists as base64 in memory. |
| URL format | `https://<project>.supabase.co/storage/v1/object/public/post-images/<filename>` | Standard Supabase public URL. No signed URLs needed for generated public images. |
| File naming | `{user_id}/{post_id}/{timestamp}_{index}.webp` | Namespaced by user + post. Prevents collisions in single-owner mode. |
| Cleanup | Optional: delete on post deletion | Not required for M1.1. Storage is cheap. |
| Migration | `supabase/migrations/0006_post_images_bucket.sql` | Single migration to create the storage bucket via SQL. |

### Files to Modify

| File | Change |
|------|--------|
| `src/actions/drafts.ts` | After `openai.images.generate()` succeeds, upload base64 to Supabase Storage, then use public URL instead of base64 |
| `src/types/index.ts` | No changes needed — `image_url` already exists in `PostMetadata` |

### Migration

```sql
-- 0006_post_images_bucket.sql
INSERT INTO storage.buckets (id, name, public)
VALUES ('post-images', 'post-images', true)
ON CONFLICT (id) DO NOTHING;

-- Allow authenticated users to upload
CREATE POLICY "Users can upload their own images"
ON storage.objects FOR INSERT
TO authenticated
WITH CHECK (bucket_id = 'post-images' AND (storage.foldername(name))[1] = auth.uid()::text);

-- Allow public read
CREATE POLICY "Anyone can view post images"
ON storage.objects FOR SELECT
TO anon, authenticated
USING (bucket_id = 'post-images');
```

### Risks

| Risk | Severity | Mitigation |
|------|----------|------------|
| Storage cost at scale | LOW | Generated images are small (WebP, quality=80). Supabase free tier includes 1GB. |
| Upload latency adds to generation time | LOW | Upload is sequential after generation. ~200-500ms. Acceptable. |
| File name collision | LOW | User ID + post ID + timestamp + index is unique. |

### Acceptance Criteria

- [ ] Base64 `data:` URI is never stored in `content_posts.metadata.image_url`
- [ ] Public `https://` Supabase Storage URL is stored instead
- [ ] Existing published posts with base64 URIs are unaffected (backward compatible)
- [ ] Buffer publish (`sendPostToBuffer`) can attach the public URL
- [ ] Typecheck PASS, Build PASS

---

## 2. V1.1-B: Industry Templates

### Problem
Each client currently configures a brand profile from scratch. Legal advisory clients (the current use case) reuse similar content angles, formats, and compliance constraints. A template system lets the product ship **pre-configured industry packs** — revenue opportunity.

### Solution
Pre-defined template objects that pre-fill the `generatePosts` input schema with industry-specific defaults.

### Template Schema

```typescript
interface IndustryTemplate {
  id: string                    // e.g. 'legal-thai-pdpa'
  name: string                  // e.g. 'Thai Legal — PDPA Compliance'
  locale: 'TH' | 'EN'
  business_type: string         // pre-fills brand profile
  target_audience: string       // pre-fills brand profile
  tone: string
  personality: string
  default_topics: string[]      // e.g. ['PDPA Compliance Tips', 'Labour Law Update', ...]
  content_rules: string[]       // e.g. 'Cite relevant Thai statute', 'Include disclaimer'
  image_rules: string[]         // e.g. 'Use Thai legal iconography', 'Avoid gavel imagery'
  hashtag_presets: string[]     // e.g. ['กฎหมาย', 'PDPA', 'ธุรกิจไทย']
}
```

### Storage

| Option | Decision |
|--------|----------|
| Storage | **Static TypeScript file** (`src/config/templates.ts`) |
| Rationale | Templates are curated, not user-created. No DB needed. TypeScript gives compile-time validation. Easy to version in git. Easy to ship template packs. |
| Future | Can be migrated to DB if/when template marketplace is needed (V2+) |

### Template Delivery

```
Client selects industry (e.g. "Thai Legal")
    ↓
System loads IndustryTemplate matching locale + business_type
    ↓
Pre-fills brand profile fields (tone, audience, rules)
    ↓
Pre-fills generate form defaults (topics, hashtags)
    ↓
Client can override any field — templates are starting points, not locks
```

### Files to Create/Modify

| File | Change |
|------|--------|
| `src/config/templates.ts` | **CREATE** — Industry templates registry (static array) |
| `src/app/(dashboard)/generate/page.tsx` | Load templates, pass as prop to GenerateForm |
| `src/components/generate/generate-form.tsx` | Add template selector dropdown. On select, pre-fill all matching fields. |

### Tasks

1. Define `IndustryTemplate` type + 1-3 initial templates (Thai Legal: PDPA, Labour Law, Service Business)
2. Static file: `src/config/templates.ts` with template data
3. Template selector UI in GenerateForm
4. Pre-fill logic: on template select → patch form state
5. Test: select template → form fields populated → generate produces industry-relevant content

### Risks

| Risk | Severity | Mitigation |
|------|----------|------------|
| Templates become stale (laws change) | LOW | Templates are static + versioned in git. Update = deploy. |
| Too many templates confuse users | LOW | Start with 1-3 templates. Expand based on client feedback. |
| Override conflicts (user edits then selects template) | LOW | Template selection resets form to defaults. Confirmation dialog: "This will reset your changes." |

### Acceptance Criteria

- [ ] Template selector renders in GenerateForm
- [ ] Selecting a template pre-fills topic, tone, personality, audience, objectives, format, hashtags
- [ ] User can override any pre-filled field after template selection
- [ ] Templates are defined as static TypeScript objects
- [ ] At least 3 Thai Legal templates ship
- [ ] Typecheck PASS, Build PASS

---

## 3. V1.1-C: Prompt Library

### Problem
Advanced users want to customize the generation prompt without editing code. The current prompt is hardcoded in `src/prompts/generate-posts.ts`. Prompt Library allows saving, selecting, and managing prompt variations.

### Solution
Store prompt templates in the database (`prompts` table) with a simple CRUD UI. Each prompt template is a text string that replaces the system prompt in `generatePosts()`.

### Database Migration

```sql
-- 0007_prompts.sql
CREATE TABLE prompts (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES profiles(id),
  name text NOT NULL,
  description text,
  system_prompt text NOT NULL,        -- The full system prompt
  category text DEFAULT 'custom',     -- 'industry' | 'format' | 'custom'
  is_default boolean DEFAULT false,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

CREATE INDEX idx_prompts_user ON prompts(user_id);
```

### Prompt Authoring

```
Prompt Library page (/prompts)
    ├── List: name, description, category
    ├── Create: name + system_prompt textarea
    ├── Edit: name + system_prompt
    ├── Delete: confirmation dialog
    └── Set Default: one prompt marked is_default

GenerateForm
    └── Prompt selector dropdown
        ├── "Default (AI-generated)"  ← hardcoded prompt
        ├── "--- Industry Templates ---"
        ├── Template prompts from V1.1-B
        └── "--- Saved Prompts ---"
            └── User's saved prompts from `prompts` table
```

### Files to Create/Modify

| File | Change |
|------|--------|
| `src/actions/prompts.ts` | **CREATE** — Server actions: listPrompts, createPrompt, updatePrompt, deletePrompt, setDefaultPrompt |
| `src/app/(dashboard)/prompts/page.tsx` | **CREATE** — Prompt library management page |
| `src/actions/generate.ts` | Modify `generatePosts()` to accept optional `promptTemplateId`. If provided, use template's system_prompt instead of hardcoded prompt. |
| `src/types/index.ts` | Add `PromptTemplate` interface |

### Dependency on V1.1-B

Prompt Library **reuses the template selector pattern** from Industry Templates. Templates generate prompt variations. The Prompt Library adds user-authored prompts on top.

### Risks

| Risk | Severity | Mitigation |
|------|----------|------------|
| Users write bad prompts that waste tokens | MEDIUM | Token counter warning before save. Character limit on prompt text (10K chars). |
| Prompt templates break after prompt format changes | LOW | Prompts are versioned. Old prompts still work but may produce lower quality output. |
| Empty prompt library on first visit | LOW | Show "No saved prompts. Use templates or create one." empty state. |

### Acceptance Criteria

- [ ] Prompt library page lists saved prompts
- [ ] Create/edit/delete prompts works via server actions
- [ ] One prompt can be marked as default
- [ ] GenerateForm shows prompt selector dropdown
- [ ] Selecting a saved prompt uses its system_prompt
- [ ] User can switch back to "Default" prompt
- [ ] Typecheck PASS, Build PASS

---

## 4. V1.1-D: Brand Knowledge Base

### Problem
Brand profiles are limited to flat fields (tone, personality, rules). Clients need to store structured reference material: company policies, competitor analysis, brand guidelines, style references — without embeddings or vector search.

### Solution
**Simple Knowledge Blocks** — a flat `knowledge_blocks` table where each block is a key-value pair with a category tag. No embeddings. No pgvector. No semantic search. Keyword search only via PostgreSQL `ILIKE`.

### Database Migration

```sql
-- 0008_knowledge_blocks.sql
CREATE TABLE knowledge_blocks (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES profiles(id),
  category text NOT NULL,         -- 'brand_guidelines' | 'competitor_analysis' | 'legal_policy' | 'style_reference' | 'custom'
  key text NOT NULL,              -- Short label, e.g. 'Competitor A social strategy'
  value text NOT NULL,            -- Block content (up to 5,000 chars)
  tags text[] DEFAULT '{}',       -- e.g. {'facebook', 'competitor', '2026'}
  is_active boolean DEFAULT true,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

CREATE INDEX idx_kb_user ON knowledge_blocks(user_id);
CREATE INDEX idx_kb_category ON knowledge_blocks(user_id, category);
```

### Knowledge Block Schema

```typescript
interface KnowledgeBlock {
  id: string
  user_id: string
  category: 'brand_guidelines' | 'competitor_analysis' | 'legal_policy' | 'style_reference' | 'custom'
  key: string                 // label, max 200 chars
  value: string               // content, max 5,000 chars
  tags: string[]              // freeform tags for filtering
  is_active: boolean
}
```

### How It Feeds Into Generation

```
generatePosts() flow (modified):
    1. Query knowledge_blocks WHERE user_id = X AND is_active = true
    2. Format blocks into a "Brand Knowledge" context section
    3. Append to the prompt sent to OpenAI
    4. OpenAI receives: [system prompt] + [brand profile] + [knowledge blocks] + [user topic]
```

**No embeddings.** Blocks are appended as plain text. For 10 blocks × 500 chars = ~5,000 chars (~1,250 tokens). Acceptable for GPT-4o's 128K context.

### Knowledge Base UI

```
Knowledge Base page (/knowledge)
    ├── Category tabs: Brand Guidelines | Competitor Analysis | Legal Policy | Style Reference | Custom
    ├── Per category:
    │   └── Block list: key, truncated value, tags, edit/delete
    ├── Create block: category, key, value, tags
    ├── Edit block: inline modal
    └── Delete block: confirmation

Appears in GenerateForm as:
    └── "Knowledge Blocks" section
        ├── Toggle: Enable knowledge context for this generation
        ├── Select categories to include (checkboxes)
        └── Block count indicator: "Using 5 of 12 blocks"
```

### Files to Create/Modify

| File | Change |
|------|--------|
| `src/actions/knowledge.ts` | **CREATE** — Server actions: listBlocks, createBlock, updateBlock, deleteBlock, toggleActive |
| `src/app/(dashboard)/knowledge/page.tsx` | **CREATE** — Knowledge base management page |
| `src/actions/generate.ts` | Modify to load active knowledge blocks and append to prompt |
| `src/types/index.ts` | Add `KnowledgeBlock` interface |

### Dependency on V1.1-C

Prompt Library is a prerequisite because: Prompt Library provides the prompt authoring interface. Knowledge Base blocks augment prompts. Without Prompt Library, there is no prompt authoring context for users to understand how blocks affect generation. The dependency is **logical** not technical — the code could be built independently, but the user experience would be incomplete.

### Risks

| Risk | Severity | Mitigation |
|------|----------|------------|
| Token cost from long knowledge blocks | MEDIUM | Truncate blocks to 5,000 chars. Limit total knowledge context to ~5,000 tokens. Warning when approaching limit. |
| Knowledge blocks duplicate brand profile fields | LOW | Clear distinction: brand profile = identity, knowledge blocks = reference material. |
| Blocks become stale | LOW | `updated_at` timestamp shown in UI. No automated refresh needed for MVP. |
| No semantic search | ACCEPTED | Intentionally excluded per guardrails. ILIKE keyword search is sufficient for M1.1 scale. |

### Acceptance Criteria

- [ ] Knowledge base page lists blocks grouped by category
- [ ] Create/edit/delete blocks works via server actions
- [ ] Each block has: category, key, value, tags
- [ ] GenerateForm has "Enable knowledge context" toggle
- [ ] When enabled, active blocks are appended to generation prompt
- [ ] Token budget warning when blocks exceed 5,000 total chars
- [ ] No pgvector, no embeddings, no semantic search
- [ ] Typecheck PASS, Build PASS

---

## 5. Task Breakdown

### Phase 1: Image Hosting (Engineering: ~4h, Verification: ~1h)

| Task ID | Description | Agent | Est. Effort |
|---------|-------------|-------|-------------|
| V1.1-01 | Create storage bucket migration (0006_post_images_bucket.sql) | Engineering | 30m |
| V1.1-02 | Modify `generateImageOptions()` to upload base64 → Supabase Storage | Engineering | 2h |
| V1.1-03 | Verify base64 is no longer stored in metadata | Verification | 30m |
| V1.1-04 | Verify Buffer publish works with HTTPS image URL | Verification | 30m |

### Phase 2: Industry Templates (Engineering: ~4h, Verification: ~1h)

| Task ID | Description | Agent | Est. Effort |
|---------|-------------|-------|-------------|
| V1.1-05 | Define `IndustryTemplate` type + create `src/config/templates.ts` with 3 templates | Engineering | 1h |
| V1.1-06 | Add template selector UI to GenerateForm | Engineering | 2h |
| V1.1-07 | Implement pre-fill logic on template selection | Engineering | 1h |
| V1.1-08 | Verify template pre-fills all form fields | Verification | 30m |
| V1.1-09 | Verify generated content matches template industry | Verification | 30m |

### Phase 3: Prompt Library (Engineering: ~6h, Verification: ~1.5h)

| Task ID | Description | Agent | Est. Effort |
|---------|-------------|-------|-------------|
| V1.1-10 | Create migration 0007_prompts.sql | Engineering | 30m |
| V1.1-11 | Create server actions: listPrompts, create/update/delete/setDefault | Engineering | 2h |
| V1.1-12 | Create `/prompts` management page | Engineering | 2h |
| V1.1-13 | Modify `generatePosts()` to accept promptTemplateId | Engineering | 1h |
| V1.1-14 | Update GenerateForm with prompt selector dropdown | Engineering | 30m |
| V1.1-15 | Verify CRUD operations on prompts table | Verification | 30m |
| V1.1-16 | Verify prompt override in generation output | Verification | 30m |
| V1.1-17 | Verify default prompt fallback | Verification | 30m |

### Phase 4: Brand Knowledge Base (Engineering: ~6h, Verification: ~1.5h)

| Task ID | Description | Agent | Est. Effort |
|---------|-------------|-------|-------------|
| V1.1-18 | Create migration 0008_knowledge_blocks.sql | Engineering | 30m |
| V1.1-19 | Create server actions: listBlocks, create/update/delete/toggleActive | Engineering | 2h |
| V1.1-20 | Create `/knowledge` management page | Engineering | 2h |
| V1.1-21 | Modify `generatePosts()` to load + append knowledge blocks | Engineering | 1h |
| V1.1-22 | Update GenerateForm with knowledge toggle + category filter | Engineering | 30m |
| V1.1-23 | Verify knowledge blocks appear in generated output | Verification | 30m |
| V1.1-24 | Verify token budget warning works | Verification | 30m |
| V1.1-25 | Verify no embeddings / no pgvector dependencies | Verification | 30m |

### Total Effort

| Phase | Engineering | Verification | Total |
|-------|-------------|-------------|-------|
| Image Hosting | 4h | 1h | 5h |
| Industry Templates | 4h | 1h | 5h |
| Prompt Library | 6h | 1.5h | 7.5h |
| Brand Knowledge Base | 6h | 1.5h | 7.5h |
| **Total** | **20h** | **5h** | **25h** |

---

## 6. Database Migrations Required

| Migration | Tables | Purpose | Dependencies |
|-----------|--------|---------|--------------|
| `0006_post_images_bucket.sql` | Storage bucket `post-images` | Image hosting storage | None |
| `0007_prompts.sql` | `prompts` | Prompt library storage | None |
| `0008_knowledge_blocks.sql` | `knowledge_blocks` | Knowledge base storage | None |

**No schema changes to existing tables.** All V1.1 data lives in new tables. Existing `content_posts`, `brands`, `integrations`, `workflow_logs` are untouched.

### New Tables

| Table | Phase | Purpose | Key Columns |
|-------|-------|---------|-------------|
| `industry_templates` | B | Static template data (see Appendix B) | `id`, `name`, `locale`, `business_type`, `target_audience`, `tone`, `personality`, `default_topics[]`, `content_rules[]`, `image_rules[]`, `hashtag_presets[]` |
| `prompts` | C | User-authored prompt overrides | `id`, `user_id`, `name`, `description`, `system_prompt`, `category`, `is_default` |
| `knowledge_blocks` | D | Brand knowledge reference blocks | `id`, `user_id`, `category`, `key`, `value`, `tags[]`, `is_active` |

### Storage

| Bucket | Phase | Purpose | Visibility |
|--------|-------|---------|------------|
| `post-images` | A | Generated image hosting | Public (authenticated upload, anonymous read) |

---

## 7. Risks

| # | Risk | Likelihood | Impact | Mitigation |
|---|------|-----------|--------|------------|
| R1 | Image hosting cost at scale | LOW | MEDIUM | WebP compression, quality=80. Monitor Supabase storage usage. |
| R2 | Prompt Library unused (users don't write prompts) | MEDIUM | LOW | Industry Templates drive adoption. Users start from templates, then customize. |
| R3 | Knowledge blocks cause token overflow | LOW | MEDIUM | Hard truncation at 5,000 total chars (~1,250 tokens). Warning in UI. |
| R4 | Template staleness (laws change) | LOW | LOW | Templates in git = versioned. Update PR → deploy. |
| R5 | Generations go to production with the wrong prompt | LOW | HIGH | Prompt selector defaults to "Default" on each new session. Explicit re-selection required. |
| R6 | Parallel work conflicts (Engineering works on two phases) | LOW | MEDIUM | Strict build order prevents conflicts. Each phase is gated on the previous. |

---

## 8. Acceptance Criteria

### V1.1 Overall

- [ ] All 4 features are built and verified
- [ ] No V2 features implemented
- [ ] No Campaign Factory changes
- [ ] No pgvector or embeddings
- [ ] No new external dependencies
- [ ] All migrations are reversible (`DROP TABLE IF EXISTS ... CASCADE`)
- [ ] Typecheck PASS
- [ ] Build PASS
- [ ] Client can publish a post WITH a working image on Buffer (V1.1-A)
- [ ] Client can select an industry template and generate relevant content (V1.1-B)
- [ ] Client can save a custom prompt and use it for generation (V1.1-C)
- [ ] Client can store reference knowledge and have it influence generation (V1.1-D)

---

## 9. Verification Plan

### Per-Phase Verification

| Phase | What to Verify | Method |
|-------|---------------|--------|
| A | Image generated → public URL stored → Buffer publish succeeds | Node.js script: generate → upload → publish → check externalId |
| B | Template selected → form prefilled → content matches industry | Browser: select template → inspect form fields → generate → inspect output |
| C | Prompt CRUD works → prompt overrides generation output | Server action tests: create prompt → generate with prompt ID → verify output changed |
| D | Knowledge blocks created → appended to generation prompt | Supabase query: blocks exist → generate → verify output contains block content |

### Cross-Phase Integration

| Scenario | What to Verify |
|----------|---------------|
| Template + Prompt | Select template → customize prompt → generate. Prompt should override template's implied prompt. |
| Prompt + Knowledge | Select prompt → enable knowledge blocks → generate. Both prompt AND blocks should affect output. |
| Full stack | Template → prompt → knowledge → generate → image → upload → publish. Complete workflow. |

---

## 10. Release Plan

### Rollout Order

```
Phase 1 (Image Hosting) ──→ Deploy immediately. Unblocks all image workflows.
                              ↓
Phase 2 (Industry Templates) ──→ Revenue-ready. Ship to client as "new feature."
                              ↓
Phase 3 (Prompt Library) ──→ Requires templates for initial content.
                              ↓
Phase 4 (Knowledge Base) ──→ Requires prompts for authoring context.
```

### Release Gate Criteria

Each phase gates individually. You do not need all 4 phases to ship.

| Phase | Gate Criteria |
|-------|---------------|
| A | Buffer publish with HTTPS image verified. Existing posts backward compatible. |
| B | 3 templates ship. Template selector + pre-fill verified. |
| C | Prompt CRUD verified. GenerateForm accepts prompt override. Default fallback works. |
| D | Knowledge Blocks CRUD verified. Blocks appended to generation prompt. Token budget warning functional. |

### Rollback Plan

| Component | Rollback Action |
|-----------|----------------|
| Migrations | `DROP TABLE IF EXISTS prompts CASCADE; DROP TABLE IF EXISTS knowledge_blocks CASCADE;` Storage bucket is metadata-only — no rollback needed. Industry templates are static code — no rollback needed. |
| Code changes | Revert commits per phase. Each phase is a separate commit. |
| Image hosting | Revert `generateImageOptions()` changes. Existing public URLs in metadata remain functional. New generations will use base64 (previous behavior). |

### Deployment

- Each phase is a separate PR → merge to `main` → Vercel auto-deploys
- No feature flags needed (phases are additive)
- Client notification after Phases 1+2 (visible features)
- Phase 3+4 documented in release notes

---

## Appendix A: File Creation/Modification Summary

| Phase | Action | File |
|-------|--------|------|
| A | Modify | `src/actions/drafts.ts` |
| A | Create | `supabase/migrations/0006_post_images_bucket.sql` |
| B | Create | `src/config/templates.ts` |
| B | Modify | `src/app/(dashboard)/generate/page.tsx` |
| B | Modify | `src/components/generate/generate-form.tsx` |
| C | Create | `src/actions/prompts.ts` |
| C | Create | `src/app/(dashboard)/prompts/page.tsx` |
| C | Modify | `src/actions/generate.ts` |
| C | Modify | `src/components/generate/generate-form.tsx` |
| C | Modify | `src/types/index.ts` |
| C | Create | `supabase/migrations/0007_prompts.sql` |
| D | Create | `src/actions/knowledge.ts` |
| D | Create | `src/app/(dashboard)/knowledge/page.tsx` |
| D | Modify | `src/actions/generate.ts` |
| D | Modify | `src/components/generate/generate-form.tsx` |
| D | Modify | `src/types/index.ts` |
| D | Create | `supabase/migrations/0008_knowledge_blocks.sql` |

## Appendix B: Build Order Rationale

The build order is determined by a single constraint: **each phase provides the foundation for the next.**

```
Image Hosting ────── Foundation: public image URLs needed for Buffer publishing.
                        Unblocks real image publishing — every image-format post
                        currently fails on Buffer without it.
                        ↓
Industry Templates ── Revenue: pre-built templates are sellable. No dependencies on later phases.
                        Provides template selector UI pattern reused by Prompt Library.
                        ↓
Prompt Library ────── Content: templates provide initial prompt content for the library.
                        Reuses template selector dropdown pattern from V1.1-B.
                        Prompt authoring is prerequisite for understanding Knowledge Base impact.
                        ↓
Brand Knowledge Base ─ Context: knowledge blocks augment prompts.
                        Without Prompt Library, users have no authoring context to understand
                        how blocks affect generation. The dependency is UX-logical, not technical.
```

**Why not parallelize?** The UI patterns cascade: template selector → prompt selector → knowledge toggle. Building them sequentially avoids rework. Each phase adds one dropdown/toggle to GenerateForm. Parallel builds would merge-conflict on the same form component.
