# Vercel Deployment Guide

This document outlines the steps to deploy the AI Content Publisher SaaS to Vercel for production use.

## Deployment URL
*To be provided by Vercel after the first successful deployment.*
Example: `https://ai-content-publisher.vercel.app`

## Environment Variables Required
The following environment variables MUST be configured in your Vercel project settings before deployment:

*   `NEXT_PUBLIC_SUPABASE_URL`: Your Supabase Project URL.
*   `NEXT_PUBLIC_SUPABASE_ANON_KEY`: Your Supabase Anon Key.
*   `SUPABASE_SERVICE_ROLE_KEY`: Your Supabase Service Role Key (Required for certain admin actions if added later).
*   `ENCRYPTION_KEY`: A 32-byte hex string (generate using `openssl rand -hex 32`). **CRITICAL: DO NOT LOSE THIS KEY. If lost, all user API keys in the database will become unreadable.**
*   `APP_URL`: The production URL (e.g., `https://ai-content-publisher.vercel.app`).
*   `BUFFER_MOCK_MODE`: Set to `"false"` for production to enable real Buffer API calls.

## Deployment Steps
1.  **Push to GitHub:** Ensure your code is pushed to the `main` branch of your GitHub repository.
2.  **Import to Vercel:**
    *   Log in to [Vercel](https://vercel.com).
    *   Click **Add New...** -> **Project**.
    *   Import your GitHub repository.
3.  **Configure Project:**
    *   Framework Preset: Vercel will auto-detect **Next.js**.
    *   Root Directory: Leave as default (`/`).
4.  **Add Environment Variables:**
    *   Open the **Environment Variables** section.
    *   Add all the variables listed above.
5.  **Deploy:** Click **Deploy**. Vercel will run `npm run build`.
6.  **Verify:** Once deployed, visit the URL, register a test account, and perform a dry run of the workflow.

## Rollback Steps
If a deployment introduces a critical bug:
1.  Go to the **Deployments** tab in your Vercel project dashboard.
2.  Find the previous successful deployment.
3.  Click the three dots (`...`) next to it and select **Promote to Production** (or **Assign Custom Domains** depending on your setup).
4.  Vercel will instantly route traffic back to the stable build without needing a recompile.
