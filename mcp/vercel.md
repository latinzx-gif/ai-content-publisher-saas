# MCP Tool: Vercel

## Purpose
Cloud hosting and Serverless/Edge deployment platform optimized for the Next.js 15 App Router.

## Required Credentials
- Vercel Account
- Vercel CLI Token (if deploying via terminal)
- GitHub integration permissions

## Environment Variables
All project environment variables must be mirrored in the Vercel Project Settings:
- `NEXT_PUBLIC_SUPABASE_URL`
- `NEXT_PUBLIC_SUPABASE_ANON_KEY`
- `SUPABASE_SERVICE_ROLE_KEY`
- `ENCRYPTION_KEY`
- `APP_URL`
- `BUFFER_MOCK_MODE`
- `APP_MODE`
- `DEFAULT_OWNER_ID`

## Setup Steps
1. Install CLI: `npm i -g vercel`
2. Login: `vercel login`
3. Link project: `vercel link`
4. Pull envs (optional): `vercel env pull .env.local`
5. Deploy: `vercel --prod`

## Common Failure Cases
- **Missing Env Vars:** Build passes but runtime fails due to missing `ENCRYPTION_KEY`.
- **Pre-rendering Errors:** Dynamic routes attempting to fetch data without `force-dynamic`.
- **Timeout:** Serverless function exceeds the default timeout (e.g., waiting for long OpenAI generations).

## Security Notes
- Treat the Vercel Dashboard as a secure vault. Only organization admins should access environment variables.
- System environment variables are injected securely at runtime.

## When to use
- Deploying the production and staging environments.
- Managing serverless API routes and edge middleware.

## When not to use
- Not for persistent file storage (use Supabase Storage or S3).
- Not for long-running background workers (exceeding 10-60s timeout limits).
