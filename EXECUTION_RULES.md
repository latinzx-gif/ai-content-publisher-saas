# Execution Rules (Gemini CLI)

## 1. Staged Implementation
* Work MUST be completed in stages following the `TASK_BOARD.md`.
* Each stage corresponds to an Agent's task.
* Do not move to the next stage until the current one is validated.

## 2. Surgical Edits
* Only edit files that are within your Agent's "Allowed Folders".
* Never modify unrelated files (e.g., don't touch Auth code while working on OpenAI prompts).
* Use the `replace` tool whenever possible for precision.

## 3. Scope Discipline
* Do NOT implement features planned for Milestone 2.
* Keep the code minimal and focused on Milestone 1 acceptance criteria.

## 4. Mandatory Validation
* After every major code change or stage completion, run:
  * `npm run build` (or `next build`) to check for build errors.
  * `tsc --noEmit` to check for type errors.
* Fix all warnings and errors before reporting completion.

## 5. Implementation Reports
* At the end of each stage, create a markdown file in `/docs/implementation/` summarizing:
  * Files created/modified.
  * Challenges encountered.
  * Verification steps taken.
  * Status (Success/Blocked).

## 6. Approval Gates
* Stop and ask for user approval before moving between Epics.
* Never assume the next step; wait for the Technical Lead (User/Agent 0) to confirm.

## 7. Professional Standards
* Use clear, descriptive variable names.
* Add JSDoc comments to complex functions.
* Ensure all code is formatted and "GitHub-ready" (clean, no secrets, no debug logs).
