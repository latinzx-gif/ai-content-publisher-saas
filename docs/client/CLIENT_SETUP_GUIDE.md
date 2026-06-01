# Client Setup Guide

## Required Accounts

The system requires:

- Supabase project.
- OpenAI API key.
- Buffer account and access token, unless using Buffer mock mode.

## Environment Variables

The application uses these environment variables:

```bash
NEXT_PUBLIC_SUPABASE_URL="https://your-project.supabase.co"
NEXT_PUBLIC_SUPABASE_ANON_KEY="your-anon-key"
SUPABASE_SERVICE_ROLE_KEY="your-service-role-key"
ENCRYPTION_KEY="your-encryption-key"

APP_MODE="single_owner"
DEFAULT_OWNER_ID="00000000-0000-0000-0000-000000000001"

BUFFER_MOCK_MODE="true"
```

## Supabase Setup

Required database tables:

- `profiles`
- `brands`
- `integrations`
- `workflow_logs`
- `content_posts`

Required migration order:

1. `supabase/migrations/0001_initial_schema.sql`
2. `supabase/migrations/0002_single_owner_schema.sql`
3. `supabase/migrations/0003_schema_contract_fixes.sql`

The verified production project contains all application tables.

## OpenAI Configuration

### Create OpenAI API Key

1. Log in to the OpenAI platform.
2. Create a project API key.
3. Copy the API key.
4. Open the app.
5. Go to `/settings`.
6. Paste the key into the OpenAI API Key field.
7. Save.
8. Use the connection test to confirm it works.

### Important Notes

- The key must be valid and active.
- The key must have access to the model used by the app.
- If the key is invalid, generation will not create drafts.
- The app stores the key encrypted at rest.

## Buffer Configuration

### Mock Mode

For demos and safe verification, use:

```bash
BUFFER_MOCK_MODE="true"
```

In mock mode:

- The app does not publish to a real Buffer queue.
- Approved posts can still move to `published`.
- A mock Buffer URL is stored for verification.

### Live Mode

For live publishing, use:

```bash
BUFFER_MOCK_MODE="false"
```

Then:

1. Log in to Buffer.
2. Create or retrieve a Buffer access token.
3. Open `/settings`.
4. Paste the Buffer access token.
5. Save.
6. Test publishing with one approved draft before using live operations.

## Local Verification Commands

Run:

```bash
npm run typecheck
npm run build
```

Expected result:

- Typecheck passes.
- Build passes.
- Current build may show non-blocking unused-code warnings.

## Production Readiness Checklist

Before client use:

- Supabase migrations applied.
- OpenAI key saved and validated.
- Brand profile configured.
- Buffer mode confirmed.
- Test generation creates 5 real drafts.
- Dashboard counts match `content_posts`.
- Draft approve and publish flow confirmed.

