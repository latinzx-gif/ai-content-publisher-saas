# Project Plan: AI Content Publisher SaaS

## Business Goal
To build a high-velocity AI content generation and publishing platform that enables creators and brands to generate persona-aligned social media content and schedule it via Buffer with minimal friction.

## MVP Scope (Milestone 1)
* User Authentication (Supabase).
* Brand Profile configuration (Tone, Personality).
* Secure API Key management (OpenAI, Buffer).
* AI-driven post generation (5 or 10 posts).
* Post preview, editing, and approval workflow.
* Basic Buffer integration for publishing approved posts.

## Out-of-Scope (Future Milestones)
* AI Image generation (DALL-E/Midjourney).
* Multi-platform direct publishing (bypassing Buffer).
* Advanced analytics and engagement tracking.
* Team collaboration and approval permissions.
* Subscription/Payment integration (Stripe).
* Bulk upload/import of topics.

## Milestone 1 Deliverables
* **Auth System:** Secure signup/login/logout.
* **Dashboard:** Overview of recent generations and account status.
* **Settings/Profile:** Management of Brand Profile and Encrypted API Keys.
* **Generation Engine:** topic-to-post conversion using OpenAI.
* **Drafts Hub:** centralized UI for reviewing and modifying generated content.
* **Buffer Connector:** Service to push content to Buffer's API.

## Milestone 2 Deliverables (Preview)
* Post scheduling (calendar view).
* Multi-brand support.
* Visual asset generation for posts.
* Enhanced prompt engineering with user-provided examples.

## 8-Day Timeline
* **Day 1:** Planning, Foundation, Repo Setup, Supabase Config.
* **Day 2:** Authentication & Basic Dashboard Layout.
* **Day 3:** Settings (API Keys + Encryption) & Brand Profile.
* **Day 4:** AI Generation Backend (OpenAI) & Generation UI.
* **Day 5:** Draft Management (Preview/Edit/Approve) Workflow.
* **Day 6:** Buffer API Integration & Publishing Service.
* **Day 7:** End-to-End Testing, Bug Squashing, QA.
* **Day 8:** Documentation Finalization & Production Deployment.

## Risks
* **API Dependency:** Changes or downtime in OpenAI or Buffer APIs.
* **Key Security:** Potential for API key leakage if encryption is mishandled.
* **Context Limits:** Large post counts or complex tones hitting LLM token limits.
* **Timeline Pressure:** 8 days is tight for a polished, multi-integration SaaS.

## Acceptance Criteria
* Users can sign up and securely log in.
* Users can save and successfully validate OpenAI and Buffer API keys.
* The system generates exactly 5 or 10 posts based on user selection.
* Generated posts reflect the configured Tone and Personality.
* Users can edit a post's text before approving it.
* Approved posts appear in the user's Buffer queue correctly.
