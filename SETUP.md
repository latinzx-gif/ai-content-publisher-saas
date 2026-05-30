# Setup Instructions

Follow these steps to set up the AI Content Publisher SaaS on your local machine.

## 1. Prerequisites
- **Node.js:** version 18.0.0 or higher.
- **npm:** usually bundled with Node.js.
- **Supabase Account:** Access to a Supabase project for Auth and Database.
- **OpenAI API Key:** For content generation.
- **Buffer Access Token:** For social media publishing.

## 2. Environment Configuration
Create a file named `.env.local` in the root of the project. You can copy the structure from `.env.example`.

```bash
# Supabase Configuration
NEXT_PUBLIC_SUPABASE_URL="https://your-project-ref.supabase.co"
NEXT_PUBLIC_SUPABASE_ANON_KEY="your-anon-key"
SUPABASE_SERVICE_ROLE_KEY="your-service-role-key"

# Security
ENCRYPTION_KEY="your-32-byte-hex-key" # Generate via 'openssl rand -hex 32'

# Application
APP_URL="http://localhost:3000"

# Publishing
BUFFER_MOCK_MODE="true" # Set to 'false' to make real API calls to Buffer

# Application Mode
APP_MODE="single_owner" # Set to 'single_owner' to bypass auth, or 'multi_user' for multi-tenant auth
DEFAULT_OWNER_ID="00000000-0000-0000-0000-000000000001"
```

### Note on Authentication Mode:
By default, the application is designed to run in `single_owner` mode. This mode uses the `SUPABASE_SERVICE_ROLE_KEY` to securely bypass Postgres Row Level Security (RLS) and authentication forms without requiring a fake login, meaning the app is instantly ready for use by a single admin entity while remaining isolated from public access. If you set `APP_MODE="multi_user"`, the system expects valid JWT sessions and will force users through the login/register flows.

## 3. Database Setup
1.  Navigate to your Supabase project dashboard.
2.  Open the **SQL Editor**.
3.  Copy the contents of `supabase/migrations/0001_initial_schema.sql` from this repository.
4.  Paste and **Run** the script. This will create the necessary tables, triggers, and Row Level Security (RLS) policies.

## 4. Local Installation
Run the following commands in your terminal:

```bash
# Install dependencies
npm install

# Run the development server
npm run dev
```

The application will be available at [http://localhost:3000](http://localhost:3000).

## 5. Deployment (Vercel)
1.  Connect your GitHub repository to Vercel.
2.  Add all environment variables from `.env.local` to the Vercel project settings.
3.  Vercel will automatically detect the Next.js setup and deploy the application.

## 6. Verification
To ensure everything is working correctly, run:
```bash
npm run typecheck
npm run build
```
If both commands pass without errors, your environment is correctly configured.
