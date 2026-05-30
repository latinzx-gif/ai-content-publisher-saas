# Milestone 1 Testing Checklist

## 1. Authentication
- [ ] User can sign up with email and password.
- [ ] User can log in.
- [ ] Unauthenticated users are redirected to `/auth/login` when accessing dashboard routes.
- [ ] Authenticated users are redirected to `/drafts` when visiting `/auth/login`.

## 2. Brand Profile
- [ ] User can save business name, type, audience, tone, and personality.
- [ ] Existing profile loads correctly into the form.
- [ ] Updates to the profile persist and reflect in AI generation.

## 3. Settings & Integrations
- [ ] OpenAI API key can be saved (encrypted).
- [ ] Buffer Access Token can be saved (encrypted).
- [ ] API keys are masked in the UI after saving.
- [ ] "Test Connection" for OpenAI returns success with a valid key.
- [ ] "Test Connection" for Buffer returns success with a valid token.
- [ ] Informative error messages show for invalid keys.

## 4. AI Content Generation
- [ ] "Generate Posts" is disabled if Brand Profile or OpenAI key is missing.
- [ ] Topic input and count selection (5/10) work correctly.
- [ ] System generates exactly the requested number of posts.
- [ ] Generated posts are in Thai language.
- [ ] Posts follow the requested Tone and Personality.
- [ ] Generated posts are saved to the database as `draft`.

## 5. Draft Management
- [ ] Drafts page displays all generated posts.
- [ ] Filter tabs (All, Draft, Approved, Rejected) work correctly.
- [ ] "Preview" opens a modal with a Facebook-style simulation.
- [ ] "Edit" allows modifying title, caption, and hashtags.
- [ ] Saving an edit resets post status to `draft`.
- [ ] "Approve" moves post to `approved` status.
- [ ] "Reject" moves post to `rejected` status.
- [ ] "Approve All Drafts" works with confirmation dialog.

## 6. Buffer Publishing
- [ ] "Send to Buffer" is visible only for `approved` or `failed` posts.
- [ ] "Send to Buffer" is disabled if Buffer token is missing.
- [ ] Individual publishing updates status to `published` on success.
- [ ] External link to Buffer appears after successful publishing.
- [ ] "Publish All Approved" works in bulk with confirmation.
- [ ] Failure reasons are displayed if status is `failed`.
- [ ] Mock mode (`BUFFER_MOCK_MODE=true`) allows full flow testing without real API calls.

## 7. Security & RLS
- [ ] User A cannot see User B's brand profile.
- [ ] User A cannot see User B's generated posts.
- [ ] Database secrets are never returned in server action payloads.
- [ ] Encryption key check: Application fails gracefully if `ENCRYPTION_KEY` is missing.
