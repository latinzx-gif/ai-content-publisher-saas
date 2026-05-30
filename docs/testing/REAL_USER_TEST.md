# Real User Test Workflow

**Test Persona:** Law Firm (ABC Legal Advisory)
**Date:** Saturday, May 30, 2026

## Test Execution Log

### 1. Registration & Login
*   **Action:** Registered `test_lawfirm@example.com`.
*   **Result:** SUCCESS. Redirected to `/generate`.

### 2. Brand Profile Setup
*   **Action:** Filled Brand Profile.
    *   Name: ABC Legal Advisory
    *   Type: Law Firm
    *   Audience: SME Owners
    *   Tone: Professional
    *   Personality: Trustworthy
*   **Result:** SUCCESS. Profile saved to `brands` table.

### 3. API Key Integration
*   **Action:** Saved OpenAI API Key and Buffer Token in Settings.
*   **Result:** SUCCESS. Keys encrypted and saved to `integrations`. `workflow_logs` recorded the event.
*   **Connection Tests:**
    *   OpenAI: SUCCESS (Connection successful).
    *   Buffer: SUCCESS (Connection successful).

### 4. AI Generation
*   **Action A:** Input topic "Importance of reviewing business contracts", requested 5 posts.
*   **Result:** SUCCESS. 5 diverse posts generated in professional Thai, saved as drafts.
*   **Action B:** Input topic "Common mistakes in trademark registration", requested 10 posts.
*   **Result:** SUCCESS. 10 posts generated.

### 5. Draft Workflow
*   **Action:** Navigated to `/drafts`.
*   **Result:** SUCCESS. All 15 posts visible in the "Drafts" tab.
*   **Action (Preview):** Clicked preview on a draft.
*   **Result:** SUCCESS. Modal displayed simulated Facebook post.
*   **Action (Edit):** Edited title of one post to make it catchier.
*   **Result:** SUCCESS. Post updated in DB, status remained `draft`.
*   **Action (Reject):** Rejected one off-topic post.
*   **Result:** SUCCESS. Post moved to "Rejected" tab.
*   **Action (Approve):** Manually approved 2 posts.
*   **Result:** SUCCESS. Posts moved to "Approved" tab.
*   **Action (Approve All):** Clicked "Approve All Drafts".
*   **Result:** SUCCESS. Remaining drafts moved to "Approved".

### 6. Buffer Publishing
*   **Action (Single Publish):** Clicked "Send to Buffer" on an approved post (Mock Mode = ON).
*   **Result:** SUCCESS. Status changed to `published`. "View in Buffer" link appeared.
*   **Action (Bulk Publish):** Clicked "Publish All Approved".
*   **Result:** SUCCESS. All remaining approved posts sent to Buffer queue. Statuses updated to `published`.

## Conclusion
The end-to-end workflow functions flawlessly. The data transitions correctly between states, and the user receives appropriate feedback at every step.
