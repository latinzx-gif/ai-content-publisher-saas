# Single Owner Mode Report

This document details the design, configuration, implementation changes, and usage instructions for the Single Owner Mode in the AI Content Publisher application.

## 📋 What Changed

To adapt the application for a single-owner SaaS product where the owner accesses the dashboard directly without requiring login/registration (while keeping the existing multi-user authentication functionality intact), we introduced a toggleable mode.

Key components updated/created:
1. **Environment Variables**: Added support for `APP_MODE=single_owner` and `DEFAULT_OWNER_ID`.
2. **Owner Context Helper ([owner-context.ts](file:///Users/jakarinosk/Desktop/AI%20Content%20Legal%20System/src/lib/owner-context.ts))**:
   - Manages single-owner vs. multi-user authentication abstraction.
   - Automatically handles seeding of the default owner user context in Supabase Auth & Profiles if it does not already exist.
3. **Database Compatibility**: Since the schema contains foreign keys to `profiles.id` (which cascades to `auth.users.id`), the system auto-seeds a default owner identity `00000000-0000-0000-0000-000000000001` using the Service Role admin client if it doesn't exist, preventing database constraint failures.
4. **Server Actions Refactored**:
   - Settings actions, Generate actions, Drafts actions, and Publish actions were updated to fetch the current owner/user via `requireOwner()` and `getCurrentOwner()` helper functions.
5. **Middleware Bypass**:
   - In `single_owner` mode, the middleware allows unauthenticated access to the main dashboard `/` and sub-paths `/generate`, `/drafts`, `/profile`, `/settings`, `/calendar`. It redirects any direct attempts to access `/auth/login` or `/auth/register` to the dashboard `/`.
6. **UI Adjustments**:
   - The "Sign Out" button is hidden.
   - An elegant "Single Owner Mode" badge with a pulsing indicator is displayed in the navigation bar.

---

## ⚙️ How to Enable Single-Owner Mode

To enable Single-Owner Mode:
1. Open your `.env.local` file.
2. Set the `APP_MODE` environment variable to `single_owner`.
3. Provide the default owner UUID under `DEFAULT_OWNER_ID` (if omitted, it defaults to `00000000-0000-0000-0000-000000000001`).

```bash
# Application Mode
APP_MODE=single_owner
DEFAULT_OWNER_ID=00000000-0000-0000-0000-000000000001
```

4. Restart your development server:
```bash
npm run dev
```

---

## 🔄 How to Switch Back to Multi-User Mode

To revert to standard Supabase Authentication behaviour:
1. Open your `.env.local` file.
2. Set `APP_MODE` to `multi_user` or remove the variable.

```bash
# Application Mode
APP_MODE=multi_user
```

3. Restart your development server. The middleware will re-enforce the auth wall, and users will be forced to log in or register via Supabase Auth.

---

## ⚠️ Known Limitations

1. **Service Role Key Required**: In `single_owner` mode, the environment must define `SUPABASE_SERVICE_ROLE_KEY` to allow the system to auto-seed the default owner's profile and auth user inside Supabase.
2. **Global Identity Sharing**: In `single_owner` mode, all database entries (brands, drafts, logs, integrations) are owned by the default owner ID. Switching back to `multi_user` mode will restrict standard users from accessing these records, as they will only see records matching their own authenticated UUID.
