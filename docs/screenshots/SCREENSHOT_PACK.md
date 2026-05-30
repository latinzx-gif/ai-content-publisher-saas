# Screenshot Pack Guide: Client Delivery & Portfolio

This document provides a comprehensive checklist and guide for capturing the final application state. These screenshots highlight the premium UI/UX, workflow-first architecture, and technical capabilities of the AI Content Publisher SaaS.

---

## 1. Dashboard Overview
* **Screenshot Name:** `01_dashboard_overview.png`
* **Route:** `/`
* **Required Data:** Seeded data showing at least 1 Draft, 1 Approved, and 1 Published post. API connections should be established.
* **What should be visible:** The premium sidebar, global page header, "Connected" status cards, the 4-step interactive workflow tracker, and the bold metric cards.
* **Recommended Browser Width:** `1440px` (Standard Desktop)
* **Portfolio Value:** Demonstrates a high-level SaaS control center, clean data visualization, and premium UI aesthetics.

## 2. Generate Wizard
* **Screenshot Name:** `02_generate_wizard.png`
* **Route:** `/generate`
* **Required Data:** Brand Profile and OpenAI API Key must be connected.
* **What should be visible:** The 3-step wizard interface (Topic, Style, Settings), custom dropdowns, the "Custom Topic" input field, and the "Generate" CTA.
* **Recommended Browser Width:** `1440px`
* **Portfolio Value:** Highlights the intuitive, guided onboarding UX instead of a raw, intimidating form.

## 3. Generation Progress
* **Screenshot Name:** `03_generation_success.png`
* **Route:** `/generate` (Post-submission)
* **Required Data:** A successfully completed generation request.
* **What should be visible:** The green success card with the Rocket icon, the generated count (e.g., "10 posts"), and the "View Drafts" / "Generate More" buttons.
* **Recommended Browser Width:** `1440px`
* **Portfolio Value:** Demonstrates positive user feedback, micro-interactions, and clear next-step routing.

## 4. Draft Review
* **Screenshot Name:** `04_draft_review_workspace.png`
* **Route:** `/drafts`
* **Required Data:** Several posts in "Draft" status. One post actively selected.
* **What should be visible:** The 3-column workspace. Left: Scrollable list of posts with status badges. Center: The realistic Facebook preview mockup with generated text and hashtags. Right: The "Publishing Control" panel showing "Approve" and "Reject" actions.
* **Recommended Browser Width:** `1600px` (Widescreen to showcase the 3-column layout perfectly)
* **Portfolio Value:** The crown jewel of the UI. Shows complex layout management, data density, and realistic platform mockups.

## 5. Approved Content
* **Screenshot Name:** `05_approved_content_bulk.png`
* **Route:** `/drafts` (Filtered to "Approved")
* **Required Data:** Multiple posts manually approved. Buffer Key connected.
* **What should be visible:** The "Approved" tab active. The global "Publish All Approved" button visible at the top. The right-hand column showing the blue "Send to Buffer" action.
* **Recommended Browser Width:** `1600px`
* **Portfolio Value:** Demonstrates bulk action capabilities, state management, and clear UI state transitions.

## 6. Published Content
* **Screenshot Name:** `06_published_content_archive.png`
* **Route:** `/drafts` (Filtered to "Published")
* **Required Data:** At least one successfully published post (via Mock mode or real API).
* **What should be visible:** Blue "Published" badges, the success checkmark in the right column, and the "View in Buffer" external link button.
* **Recommended Browser Width:** `1600px`
* **Portfolio Value:** Shows end-to-end completion and successful third-party integration routing.

## 7. Brand Profile
* **Screenshot Name:** `07_brand_profile_config.png`
* **Route:** `/profile`
* **Required Data:** A filled form (e.g., Business Name: "ABC Legal Advisory", Tone: "Professional").
* **What should be visible:** The blue informational callout box, the clean form inputs, and the "Save Changes" button.
* **Recommended Browser Width:** `1440px`
* **Portfolio Value:** Shows clean form design, localized Thai UI, typography hierarchy, and context-aware helper text.

## 8. OpenAI Settings
* **Screenshot Name:** `08_openai_settings.png`
* **Route:** `/settings`
* **Required Data:** A valid OpenAI API Key saved.
* **What should be visible:** The OpenAI integration card, the green "Connected" badge with timestamp, the password-masked input (`••••••••`), and the "Test Connection" button.
* **Recommended Browser Width:** `1440px`
* **Portfolio Value:** Visualizes a security-focused UX and the "Bring Your Own Key" (BYOK) SaaS model.

## 9. Buffer Settings
* **Screenshot Name:** `09_buffer_settings.png`
* **Route:** `/settings`
* **Required Data:** A Buffer Access Token saved.
* **What should be visible:** The Buffer integration card, connected status, and potentially a green success toast from a recent "Test Connection" click.
* **Recommended Browser Width:** `1440px`
* **Portfolio Value:** Demonstrates multi-integration capability and consistent component reusability.

## 10. Calendar
* **Screenshot Name:** `10_calendar_placeholder.png`
* **Route:** `/calendar`
* **Required Data:** None.
* **What should be visible:** The structured Empty State component with the Calendar icon and "Coming Soon" messaging.
* **Recommended Browser Width:** `1440px`
* **Portfolio Value:** Shows roadmap awareness, graceful feature gating, and reusable empty state patterns.

## 11. Onboarding Complete
* **Screenshot Name:** `11_onboarding_workflow_complete.png`
* **Route:** `/`
* **Required Data:** Profile, OpenAI, and Buffer connected. At least one post pushed to Published.
* **What should be visible:** The 4-step workflow tracker on the dashboard, with all four steps showing green checkmarks and active blue styling.
* **Recommended Browser Width:** `1440px`
* **Portfolio Value:** Highlights gamification, user onboarding success, and dynamic UI states based on database milestones.
