# MCP Tool: Buffer

## Purpose
Acts as the social media publishing aggregator, allowing the application to queue approved content to platforms like Facebook, LinkedIn, and Twitter via a single API.

## Required Credentials
- Buffer Personal Access Token

## Environment Variables
- `BUFFER_MOCK_MODE`: If `"true"`, bypasses actual HTTP requests to Buffer and simulates a successful publish.

## Setup Steps
1. User generates an Access Token from the Buffer developer portal.
2. User inputs the token in the `/settings` page.
3. System encrypts and stores the token.
4. Set `BUFFER_MOCK_MODE="false"` in production to enable real publishing.

## Common Failure Cases
- **Invalid Token:** Token expired or revoked.
- **No Profiles Found:** The Buffer account has no social media profiles (e.g., Facebook pages) connected to it.
- **Rate Limiting:** Hitting the Buffer API too frequently during bulk publishing.

## Security Notes
- Access Tokens provide write access to social media accounts. They must be encrypted at rest and decrypted only during Server Action execution.

## When to use
- Queueing social media posts.
- Abstracting multi-platform delivery (write once, publish anywhere).

## When not to use
- If real-time, native platform features (like Instagram Reels specific tagging) are required that Buffer's API does not support.
- During local UI development (use Mock Mode instead to save API quotas).
