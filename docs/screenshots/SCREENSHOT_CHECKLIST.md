# Screenshot Checklist for Client Handover

Use this checklist to capture and organize screenshots for application handover. Ensure the environment is running with `APP_MODE=single_owner` to display the "Single Owner Mode" badge.

---

### 1. 📊 Dashboard / Home Screen
*   **Screenshot Filename**: `01_dashboard_overview.png`
*   **Purpose**: Demonstrates the landing area, showing current statistics, onboarding progress, recent workflow actions, and the "Single Owner Mode" status badge.
*   **What should be visible**:
    - Sidebar navigation with all links active.
    - Statistics cards displaying generated, draft, approved, and published post counts.
    - Activity logs timeline.
    - Single Owner Mode badge in the top navigation bar.

---

### 2. 🧙 Generate Wizard (Topic Selection)
*   **Screenshot Filename**: `02_generate_wizard_step1.png`
*   **Purpose**: Shows the first step of content creation where the user specifies topics.
*   **What should be visible**:
    - Step indicators (Step 1 active).
    - Dropdown with law, PDPA, and custom topic select fields.

---

### 3. 🧙 Generate Wizard (Processing State)
*   **Screenshot Filename**: `03_generate_wizard_loading.png`
*   **Purpose**: Shows the duplicate-request prevention and progress state overlay.
*   **What should be visible**:
    - Central animated loading spinner.
    - Text: "Generating Content... Please wait while AI creates your posts."
    - User input fields disabled/blocked to prevent concurrent submissions.

---

### 4. 🗂️ Draft Review Workflow (Three-Column Workspace)
*   **Screenshot Filename**: `04_drafts_review_workspace.png`
*   **Purpose**: Demonstrates the editing, approving, and publishing control workspace.
*   **What should be visible**:
    - Left column: filter options and lists of drafts.
    - Middle column: detailed post preview showing Hooks, Captions, Hashtags, and a Facebook layout mockup.
    - Right column: Action status, Approve/Reject controls, and the "Publish to Buffer" trigger.

---

### 5. ⚠️ Bulk Action Confirmation Dialog
*   **Screenshot Filename**: `05_bulk_action_confirmation.png`
*   **Purpose**: Proves safe execution policies for destructive actions.
*   **What should be visible**:
    - The `AlertDialog` modal overlay active.
    - Title: "Confirm Bulk Action".
    - Details description showing warnings.
    - Confirm/Cancel button triggers.

---

### 6. 👤 Brand Profile Form
*   **Screenshot Filename**: `06_brand_profile_config.png`
*   **Purpose**: Shows how context guidelines are input to tailor content.
*   **What should be visible**:
    - Business name, industry/niche, audience profile, tone selections, and key personality parameters.
    - "Save Profile" action state.

---

### 7. 🔌 Integrations & Key Configurations
*   **Screenshot Filename**: `07_integrations_byok.png`
*   **Purpose**: Proves secure credentials entry for OpenAI and Buffer tokens.
*   **What should be visible**:
    - OpenAI and Buffer connection forms.
    - Hidden encrypted key masks showing update timestamps.
    - Integration status badges.
