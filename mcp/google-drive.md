# MCP Tool: Google Drive (Future Expansion)

## Purpose
*(Proposed for Milestone 2+)*
To ingest reference documents, brand guidelines, or bulk content calendars directly from a user's Google Workspace environment.

## Required Credentials
- Google Cloud Service Account JSON Key OR OAuth 2.0 Client Credentials

## Environment Variables
- `GOOGLE_DRIVE_CLIENT_ID`
- `GOOGLE_DRIVE_CLIENT_SECRET`
- `GOOGLE_DRIVE_REDIRECT_URI`

## Setup Steps
1. Create a project in Google Cloud Console.
2. Enable the Google Drive API.
3. Create OAuth credentials.
4. Implement OAuth callback in Next.js to retrieve user refresh tokens.

## Common Failure Cases
- **Permission Denied:** The application does not have access to the specific file URL provided.
- **Token Expiry:** Refresh token is revoked or expired.
- **Large File Limits:** Trying to ingest files larger than the Next.js API route payload limit (usually 4MB).

## Security Notes
- Request the minimum scopes required (e.g., `https://www.googleapis.com/auth/drive.readonly`).
- Securely store OAuth Refresh Tokens in the encrypted `integrations` table.

## When to use
- Importing long-form brand guidelines.
- Batch importing topics from a Google Sheet.

## When not to use
- Hosting application assets.
- As a primary database replacement.
