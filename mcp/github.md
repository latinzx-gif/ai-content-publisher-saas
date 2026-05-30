# MCP Tool: GitHub

## Purpose
Provides source control, versioning, and continuous integration triggers for the AI Content Publisher SaaS.

## Required Credentials
- GitHub Account
- SSH Key or Personal Access Token (PAT) for CLI operations

## Environment Variables
*None directly in the Next.js application.*

## Setup Steps
1. Create a repository on GitHub.
2. Initialize local repository: `git init`
3. Add remote: `git remote add origin <url>`
4. Push code: `git push -u origin main`

## Common Failure Cases
- **Merge Conflicts:** Occurs during parallel agent development if files overlap.
- **Authentication Failure:** Expired PAT or missing SSH keys.
- **Large Files:** Accidentally committing `.env` or large binaries without Git LFS.

## Security Notes
- **NEVER** commit `.env` or `.env.local` files.
- Ensure `.gitignore` includes `node_modules`, `.next`, and environment files.

## When to use
- Tracking codebase changes.
- Triggering Vercel deployments.
- Code reviews and rollback states.

## When not to use
- Do not use as a database.
- Do not store user-generated content or encrypted API keys.
