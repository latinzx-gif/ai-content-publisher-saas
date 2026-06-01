# Client Limitations

## Current Known Limitations

### Buffer Live Publishing

Final verification used Buffer mock mode.

Impact:

- The app verified the publish workflow and database transition.
- It did not verify a real Buffer account queue.

Recommendation:

- Run a live Buffer publishing test before live social posting.

### Single Owner Mode

The current verified deployment uses `APP_MODE=single_owner`.

Impact:

- The app is intended for one owner/workspace.
- Multi-user permissions, client teams, and role-based approvals are not part of the verified Milestone 1 scope.

Recommendation:

- Add multi-user roles in a future milestone if multiple reviewers or client accounts are required.

### AI Output Requires Human Review

OpenAI-generated content may be incomplete, inaccurate, or unsuitable without review.

Impact:

- Legal, tax, HR, PDPA, and compliance content must be reviewed before publishing.

Recommendation:

- Treat generated content as a draft, not final legal advice.

### Limited Publishing Channels

Publishing is currently centered on Buffer.

Impact:

- Platform-specific publishing rules for LinkedIn, Facebook, Instagram, and websites are not fully separate workflows yet.

Recommendation:

- Add platform-specific publishing adapters and validation.

### No Full Analytics Suite

The dashboard shows workflow statistics, not performance analytics.

Impact:

- It tracks operational status but does not yet measure engagement, reach, clicks, or conversion.

Recommendation:

- Add analytics integration after publishing is live.

### Existing Build Warnings

The production build passes, but lint warnings remain for unused imports and variables.

Impact:

- These warnings are non-blocking.
- They should be cleaned up before a larger production hardening phase.

### Demo-Oriented UI Labels

Some interface labels and secondary panels still contain demo-oriented wording.

Impact:

- Core workflow data is real.
- Some supporting UI copy may need client-specific polishing.

Recommendation:

- Run a copywriting pass before public client launch.

## Not In Current Scope

The following are not part of Milestone 1:

- Multi-tenant client management.
- Role-based approval permissions.
- Scheduled calendar publishing.
- Real performance analytics.
- AI image generation.
- Automated legal source verification.
- Full audit export.

