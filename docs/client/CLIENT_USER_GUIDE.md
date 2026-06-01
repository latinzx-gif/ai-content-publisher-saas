# Client User Guide

## Overview

AI Content Legal System helps a legal/business content team generate, review, approve, and publish social media posts from a single workspace.

The typical workflow is:

1. Confirm brand profile.
2. Generate content.
3. Review drafts.
4. Edit draft content.
5. Approve selected drafts.
6. Publish approved drafts.
7. Check dashboard statistics.

## Main Pages

### Dashboard

Path: `/`

Use the dashboard to review content pipeline status.

The dashboard shows:

- Total generated posts.
- Draft count.
- Approved count.
- Published count.
- Recent content rows.
- Brand context.

### Brand Profile

Path: `/profile`

Use this page to configure the business identity used by AI generation.

Recommended fields:

- Business or brand name.
- Business type.
- Target audience.
- Tone.
- Brand personality.

After saving, future generated posts will use this profile as context.

### Settings

Path: `/settings`

Use this page to configure:

- OpenAI API key.
- Buffer access token.

The system stores integration secrets encrypted.

### Content Studio

Path: `/generate`

Use this page to generate new content.

Basic generation flow:

1. Select a content template or type a topic.
2. Confirm audience, tone, goal, format, and hashtags.
3. Optionally add knowledge URLs.
4. Optionally add manual context.
5. Click the generate button.
6. The system creates draft posts in the database.

### Draft Review Board

Path: `/drafts`

Use this page to review and move posts through the workflow.

Available actions:

- Open a draft.
- Edit title, caption, and hashtags.
- Save edits.
- Approve draft.
- Publish approved draft.

## Content Workflow

### 1. Generate Posts

Go to `/generate`, choose or enter a topic, then generate content.

Expected result:

- 5 posts are created as `draft` rows in `content_posts`.

### 2. Edit Draft

Go to `/drafts`, click a draft card, edit the content, and save.

Expected result:

- Draft content updates in the database.
- Status remains `draft`.

### 3. Approve Draft

On `/drafts`, click approve on a draft.

Expected result:

- Status changes from `draft` to `approved`.

### 4. Publish Draft

On `/drafts`, publish an approved post.

Expected result:

- Status changes from `approved` to `published`.
- Buffer post metadata is stored.

### 5. Verify Dashboard

Return to `/`.

Expected result:

- Dashboard counts update based on real Supabase data.

## Recommended Operating Practice

- Keep brand profile updated before generating new content.
- Review all AI output before approval.
- Use manual context for legal nuance, source material, or client-specific rules.
- Use approved templates for repeatable content quality.
- Confirm Buffer mode before live publishing.

