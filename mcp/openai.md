# MCP Tool: OpenAI

## Purpose
The core AI engine used to transform topics into structured, persona-driven social media posts in the Thai language.

## Required Credentials
- OpenAI API Key (starts with `sk-proj-...`)

## Environment Variables
*None statically configured in `.env.local` for the core app.*
- The architecture uses a **Bring Your Own Key (BYOK)** model. The key is provided by the user in the Settings UI and stored encrypted in the Supabase database.

## Setup Steps
1. User generates an API key from `platform.openai.com`.
2. User enters the key in the `/settings` page.
3. System encrypts and stores the key in `integrations`.

## Common Failure Cases
- **Quota Exceeded (429):** The user's OpenAI account has run out of credits or hit a rate limit.
- **Invalid Key (401):** The key was revoked or entered incorrectly.
- **JSON Parse Error:** The LLM hallucinates and returns malformed JSON despite `response_format: json_object`.

## Security Notes
- Keys MUST be encrypted at rest using AES-256-GCM.
- Keys MUST be decrypted server-side only inside Next.js Server Actions.
- Client bundles must never receive the plaintext API key.

## When to use
- Text generation (`gpt-4o`).
- Structuring unstructured data.
- Tone and personality adaptation.

## When not to use
- Deterministic logic or exact mathematical calculations.
- Handling highly sensitive PII (Personally Identifiable Information) without scrubbing.
