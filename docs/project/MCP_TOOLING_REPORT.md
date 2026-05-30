# MCP Tooling Report

**Date:** Saturday, May 30, 2026
**Project:** AI Content Publisher SaaS

## Overview
This report documents the Model Context Protocol (MCP) style tool definitions created for the AI Content Publisher SaaS. These documents provide a standardized reference for how external systems and APIs integrate with the core application architecture.

## MCP Docs Created
The following integration specs have been generated in the `/mcp/` directory:
1. `mcp/github.md`
2. `mcp/vercel.md`
3. `mcp/supabase.md`
4. `mcp/openai.md`
5. `mcp/buffer.md`
6. `mcp/google-drive.md`

## Required Tools
These tools are mandatory for the core functionality of Milestone 1:
- **GitHub:** Source control and deployment triggering.
- **Vercel:** Production cloud hosting and Edge/Serverless execution.
- **Supabase:** PostgreSQL database, RLS security, and identity management.
- **OpenAI:** The LLM engine handling content generation (User BYOK).
- **Buffer:** The publishing gateway for delivering content to social media (User BYOK).

## Optional Tools
Tools used for local development or testing flexibility:
- **Buffer Mock Mode:** Controlled via `BUFFER_MOCK_MODE="true"`. Allows the UI and database state transitions to be tested end-to-end without requiring a valid Buffer Access Token.

## Future Tools
Planned integrations for subsequent milestones:
- **Google Drive / Google Docs:** Proposed for Milestone 2+ to allow bulk importing of topics, content calendars, and long-form brand guidelines directly from a user's workspace.
- **Stripe (TBD):** Potential billing and subscription management tool if the platform pivots from BYOK to a managed SaaS model.
