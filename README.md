# AI Content Publisher SaaS

An AI-powered content generation and publishing platform that enables users to generate, review, and schedule persona-driven social media posts via OpenAI and Buffer.

## 🚀 Overview
AI Content Publisher is a high-velocity SaaS application designed for brands and creators who want to automate their social media content creation while maintaining a consistent voice. By leveraging the power of GPT-4o, the platform transforms simple topics into ready-to-publish posts tailored to your brand's unique tone and personality.

## ✨ Milestone 1 Features
- **User Authentication:** Secure signup/login via Supabase Auth.
- **Brand Profile:** Configure your business name, audience, tone, and personality.
- **Secure Integration:** "Bring Your Own Key" (BYOK) model for OpenAI and Buffer, with AES-256-GCM encryption at rest.
- **AI Generation Engine:** Generate 5 or 10 posts at a time in Thai language.
- **Drafts Dashboard:** Preview, Edit, Approve, and Reject generated content.
- **Buffer Integration:** Push approved content directly to your Buffer publishing queue.
- **Audit Logging:** Transparent tracking of all generation and publishing actions.

## 🛠 Tech Stack
- **Framework:** [Next.js 15](https://nextjs.org/) (App Router, Server Components)
- **Language:** [TypeScript](https://www.typescriptlang.org/)
- **Styling:** [Tailwind CSS](https://tailwindcss.com/) + [shadcn/ui](https://ui.shadcn.com/)
- **Backend/Database:** [Supabase](https://supabase.com/) (Auth, PostgreSQL, RLS)
- **AI Engine:** [OpenAI SDK](https://openai.com/) (GPT-4o)
- **Publishing:** [Buffer API](https://buffer.com/)

## 📋 Prerequisites
- Node.js 18+
- Supabase Project
- OpenAI API Key
- Buffer Access Token

## ⚙️ Environment Variables
Create a `.env.local` file with the following:
```bash
NEXT_PUBLIC_SUPABASE_URL="your-supabase-url"
NEXT_PUBLIC_SUPABASE_ANON_KEY="your-supabase-anon-key"
SUPABASE_SERVICE_ROLE_KEY="your-supabase-service-role-key" # Required for Single Owner Mode
ENCRYPTION_KEY="your-32-byte-hex-key"
BUFFER_MOCK_MODE="true" # Set to false for production Buffer calls

# Configurable Modes
APP_MODE="single_owner" # Toggle between 'single_owner' and 'multi_user'
DEFAULT_OWNER_ID="00000000-0000-0000-0000-000000000001"
```

## 🏃 Local Development
1. Clone the repository.
2. Install dependencies: `npm install`
3. Set up your environment variables.
4. Run migrations: Execute the SQL in `supabase/migrations/0001_initial_schema.sql` in your Supabase dashboard.
5. Start the dev server: `npm run dev`
6. Open [http://localhost:3000](http://localhost:3000)

## 🏗 Workflow
1.  **Configure:** Set up your Brand Profile and add your API Keys in Settings.
2.  **Generate:** Input a topic and choose how many posts you want.
3.  **Refine:** Edit the generated drafts in the dashboard.
4.  **Publish:** Approve your favorites and send them to Buffer with one click.

## 🔜 Future Scope (Milestone 2)
- Multi-platform selection (Twitter, LinkedIn, Instagram).
- Scheduled posting with calendar view.
- AI-generated visual assets (images/graphics).
- Advanced analytics and performance tracking.

## 📦 Delivery Status
**Milestone 1:** COMPLETED (Saturday, May 30, 2026)
**Current Version:** 1.0.0
**Status:** Ready for Client Review

## 📖 Single Owner Mode
This application supports a configurable **Single Owner Mode** that allows running the application without an authentication wall.
- To configure or switch modes, refer to the [Single Owner Mode Report](file:///Users/jakarinosk/Desktop/AI%20Content%20Legal%20System/docs/implementation/SINGLE_OWNER_MODE_REPORT.md).

