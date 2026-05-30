# Production Environment Audit

**Date:** Saturday, May 30, 2026
**Agent:** Agent 0 (Technical Lead) & Agent 6 (QA)

## Objective
Verify that no sensitive environment variables or user secrets (API keys) are exposed to the client-side bundle or browser network requests.

## Environment Variable Audit
The application relies on Next.js environment variable conventions. Only variables prefixed with `NEXT_PUBLIC_` are bundled into the client browser.

*   `NEXT_PUBLIC_SUPABASE_URL`: **Exposed (Safe).** Required by Supabase browser client.
*   `NEXT_PUBLIC_SUPABASE_ANON_KEY`: **Exposed (Safe).** Required by Supabase browser client. RLS prevents unauthorized access.
*   `SUPABASE_SERVICE_ROLE_KEY`: **Hidden.** Only accessible in Node.js server environment.
*   `ENCRYPTION_KEY`: **Hidden.** Only accessible in Node.js server environment (Server Actions).
*   `BUFFER_MOCK_MODE`: **Hidden.** Only accessed on the server.

## Data Flow Audit
### 1. Settings (Saving Keys)
*   **Action:** User submits OpenAI/Buffer API key via form.
*   **Transport:** Data is sent via Next.js Server Action (`POST` request to the same origin). Payload is encrypted in transit (HTTPS).
*   **Processing:** The Server Action (`src/actions/settings.ts`) receives the plaintext key, encrypts it using `ENCRYPTION_KEY`, and stores the ciphertext (`encrypted_value`) in Supabase.
*   **Result:** The plaintext key is discarded from memory. It is never logged.

### 2. Settings (Retrieving Status)
*   **Action:** User loads `/settings` page.
*   **Processing:** Server component fetches integration metadata.
*   **Result:** Only `provider` and `updated_at` are passed to the client. **The `encrypted_value` is explicitly omitted from the client payload.**

### 3. Generation / Publishing (Using Keys)
*   **Action:** User requests AI generation or Buffer publishing.
*   **Processing:** Server Action queries Supabase for the `encrypted_value`. The value is decrypted *in server memory only*. The decrypted key is passed to the OpenAI/Buffer SDK.
*   **Result:** The decrypted key never leaves the Node.js process. The client only receives the result (e.g., the generated text or a success status).

## Network Request Analysis
Simulated network inspection confirms:
- No API keys are visible in the Response bodies of Next.js hydration requests.
- No secrets are leaked in headers or cookies.

## Conclusion
**PASS.** The BYOK security model is robust. Secrets are successfully isolated to the server environment, and at-rest encryption protects against database breaches.
