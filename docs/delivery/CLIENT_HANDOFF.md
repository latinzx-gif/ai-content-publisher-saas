# Client Handoff: Milestone 1

Welcome to the first delivery of your AI Content Publisher SaaS. This document outlines everything you need to know to take over and start using the current version of the application.

## 1. What You Are Receiving
- Complete source code for the Next.js 15 application.
- Foundational database schema (PostgreSQL) ready for Supabase.
- Integrated OpenAI content generation engine (GPT-4o).
- Integrated Buffer publishing adapter.
- Full security model with at-rest encryption for your API keys.

## 2. Prerequisites & Accounts
To run the full workflow, you will need:
- **Supabase Account:** For hosting the database and authentication.
- **OpenAI API Key:** For generating content (Bring Your Own Key).
- **Buffer Account:** For publishing to social media (requires a Facebook profile connected in Buffer for this milestone).
- **Vercel Account (Optional):** For production deployment.

## 3. Local Setup Guide
Please refer to the `SETUP.md` file in the root of the project for detailed installation steps, environment variable configuration, and database migration instructions.

## 4. How to Test the Workflow
1.  **Register:** Create a new account via `/auth/register`.
2.  **Brand Profile:** Navigate to **Brand Profile** and fill in your business details.
3.  **Settings:** Navigate to **Settings** and save your OpenAI and Buffer keys.
4.  **Generate:** Go to **Generate**, enter a topic (e.g., "AI Marketing"), and click **Generate Posts**.
5.  **Review:** Go to **Drafts**. Use the **Edit** or **Preview** buttons to refine your content.
6.  **Approve:** Click **Approve** on the posts you like.
7.  **Publish:** Click **Send to Buffer** on an approved post. Check your Buffer queue to see the result.

*Note: You can use `BUFFER_MOCK_MODE=true` in `.env.local` to test the publishing flow without a real Buffer key.*

## 5. Known Limitations (Milestone 1)
- **Facebook Only:** The current Buffer implementation defaults to sending posts to the first Facebook profile it finds in your Buffer account.
- **Queue only:** Posts are sent to the Buffer queue; specific calendar time selection is not yet implemented.
- **Single Brand:** One user can manage one brand profile at a time.

## 6. Next Milestone Plan
- **Milestone 2:** Multi-platform selection (LinkedIn, Twitter), scheduled publishing, and multi-brand support.
