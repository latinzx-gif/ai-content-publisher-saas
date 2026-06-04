# Editor Canvas Word Count Fix

Date: 2026-06-04
Scope: P1 word-count behavior only.

## Root Cause

The Editor Canvas passed `wordCount` into the prompt, but the OpenAI chat completion request did not set `max_tokens`. The model therefore treated the word-count prompt as guidance and often returned short social captions around 150-250 words, even when the user selected a long target such as 1200 words.

## Files Changed

- `src/actions/generate.ts`
- `src/lib/openai/index.ts`
- `reports/EDITOR_CANVAS_WORD_COUNT_FIX.md`

## Fix Summary

- Added a safe `max_tokens` budget to the OpenAI generation call.
- Passed normalized `wordCount` and `postCount` from `generatePosts` into `callOpenAI`.
- Kept `wordCount` in the prompt through `getGeneratePostsPrompt`.
- Added fallback normalization so missing or invalid `wordCount` defaults to `500`.
- Saved normalized `requested_word_count` metadata with generated drafts.
- Kept the JSON response format unchanged.

## Token Mapping

Per-post token budget:

| Requested words | max_tokens per post |
|---:|---:|
| <= 250 | 700 |
| <= 500 | 1200 |
| <= 800 | 1900 |
| <= 1200 | 2800 |

Batch scaling:

```text
max_tokens = perPostTokens * postCount
cap = 16000
```

If a custom word count is above 1200, the 1200-word token tier is used. If the scaled value exceeds the cap, the request uses the cap to avoid unsafe oversized responses.

## Validation Result

- `npm run typecheck`: Passed.
- `npm run build`: Passed after rerunning with elevated permissions because the default sandbox blocked Turbopack's internal process/port binding.

## Known Limitations

- `max_tokens` increases available output length but cannot guarantee exact word counts; the prompt still instructs the model to stay within a 90-110% range.
- Very large batch requests, such as 10 posts at 1200 words, may still be constrained by the 16000-token cap.
- Source summarization calls are unchanged; this fix only applies to final post generation.
- Existing build warnings remain outside this scope: multiple lockfiles, unused calendar helpers, raw `<img>` usage, and unused layout imports.
