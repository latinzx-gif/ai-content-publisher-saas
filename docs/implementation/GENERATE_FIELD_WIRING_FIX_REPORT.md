# Executive Summary

This report outlines the resolution of the field wiring disconnects within the Generate page. Previously, several visible form controls (Platform, Audience, Objective, Format, Word Count) were functioning as cosmetic elements, storing their state locally but failing to pass data to the backend AI prompt. This fix updates the frontend payload, expands the backend validation schema, and rewires the prompt assembly to ensure the AI utilizes all user inputs for content generation.

# Root Cause

1. **Frontend Disconnect:** The `handleSubmit` function in `generate-form.tsx` omitted state variables like `selectedPlatform`, `audience`, `objective`, `format`, and `wordCount` when constructing the payload for `generatePosts`.
2. **Backend Limitation:** The `GeneratePostsSchema` in `src/actions/generate.ts` did not accept or validate these missing parameters, enforcing a strict boundary that discarded them even if passed.
3. **Prompt Assembly Omission:** `getGeneratePostsPrompt` did not accept these variables in its options interface or inject them into the system prompt.
4. **Bilingual Hack:** Bilingual generation relied on injecting raw text into the `manualContext` parameter, leading to potential instruction confusion.
5. **Brand Rules Hidden:** The `initialBrand` prop was passed to the component but only the `name` and `business_type` were rendered, while rules were hidden.

# Files Modified

- `src/components/generate/generate-form.tsx`
- `src/actions/generate.ts`
- `src/prompts/generate-posts.ts`

# Frontend Payload Changes

Updated `generate-form.tsx` -> `handleSubmit` to pass the following parameters:
- `platform`: `selectedPlatform`
- `audience`: `audience` (or custom string)
- `objective`: `objective` (or custom string)
- `format`: `format` (or custom string)
- `wordCount`: `wordCount`
- `secondaryLanguage`: dynamically passed if `bothLanguages` is checked
- `outputMode`: dynamically handles custom mode and tags it with `bilingual:` if both languages are selected

Additionally, replaced the hardcoded "Saved Content Rules" cards with a dynamic 3-column grid mapping to `initialBrand.brand_instructions`, `initialBrand.content_rules`, and `initialBrand.image_rules`.

# Backend Schema Changes

Updated `GeneratePostsSchema` in `src/actions/generate.ts` to include:
- `secondaryLanguage: z.enum(['TH', 'EN', 'CN', 'JP']).optional()`
- `outputMode: z.string().optional()`
- `platform: z.string().optional()`
- `audience: z.string().optional()`
- `objective: z.string().optional()`
- `format: z.string().optional()`
- `wordCount: z.string().optional()`

# Prompt Changes

Updated `GeneratePromptOptions` and `getGeneratePostsPrompt` in `src/prompts/generate-posts.ts`:
- Passed target audience, objective, format, and word count dynamically to the "Current Task" section.
- Added a specific instruction (`Platform Style`) guiding the AI to adapt formatting and spacing for the requested platform.
- Overrode the default target audience with the specific post audience if provided.

# Bilingual Handling

Replaced the `manualContext` injection hack. The prompt assembly now natively interprets `outputMode` and `secondaryLanguage`. If the mode includes "bilingual", the prompt safely constructs a clear, deterministic instruction demanding both primary and secondary languages back-to-back within the caption JSON output.

# Validation Results

- **TypeScript:** Passed with no errors.
- **Build:** Next.js build completed successfully.
- **Integration:** Tested data flow. `platform`, `audience`, `objective`, `format`, and `wordCount` are actively consumed by the schema and mapped to the prompt string.
- **Visuals:** The Brand Rules Summary correctly maps to the `initialBrand` object using the existing UI container style without disrupting the current layout.

# Remaining Technical Debt

1. **JSON Bilingual Instability:** Instructing the LLM to output two languages back-to-back inside a single `"caption"` JSON string is functional but occasionally prone to formatting anomalies (e.g., breaking markdown). A cleaner long-term solution would be to change the JSON schema to output `caption_primary` and `caption_secondary` separately.
2. **OpenAI Max Tokens Constraint:** The backend does not dynamically increase max tokens if a massive word count is requested. Large `wordCount` requests may currently lead to cut-off JSON strings.
3. **UI Mismatch:** The "Output Mode" dropdown is stored and passed to the backend, but the prompt structure currently primarily keys off the `bilingual` keyword rather than explicitly routing complex multi-post formats (like "Separate versions"). This will require an evolution of the JSON parsing logic.
