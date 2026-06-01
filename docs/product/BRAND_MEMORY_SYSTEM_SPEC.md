# Executive Summary
The Brand Memory System is a core architecture feature designed to ensure that AI-generated content (both text and images) consistently aligns with a brand's unique identity. This specification outlines an MVP and future-state architecture for storing, managing, and injecting brand-specific rules, references, and preferences into AI prompts, allowing the platform to act as a true brand guardian.

# User Problem
Currently, AI generation lacks long-term context about a brand's specific needs. Users have to repeatedly instruct the AI on their brand's tone, preferred visual style, target audience, and specific industry compliance rules. This repetitive workflow leads to inconsistent output, wasted time tweaking prompts, and brand dilution across different generated assets.

# Proposed Solution
Implement a centralized "Brand Memory" repository that stores identity guidelines, strict content rules, image generation rules, and reference assets. This repository will automatically compile and append relevant constraints and stylistic guidelines to all AI generation requests, ensuring output consistency without requiring the user to re-enter their preferences.

# Information Architecture
The architecture separates high-level brand identity (Profile) from granular execution directives (Memory).

1. **Brand Profile (Identity):** 
   - Belongs in `/profile`
   - Core immutable attributes: Name, Business Type, Target Audience, Tone, Personality.
2. **Brand Memory (Execution Rules):**
   - Belongs in a separate `Brand Memory` section.
   - **Content Rules:** Formatting preferences, prohibited words, legal/compliance constraints, preferred hashtag strategies, phrasing preferences.
   - **Image Rules:** Color palettes (HEX codes), stylistic preferences (e.g., photorealistic vs. 2D vector, lighting preferences), typography choices, recurring visual motifs.
   - **Reference Assets:** Key visuals, logos, product photos for image-to-image generation or stylistic referencing.
   - **Prompt Templates:** Saved, proven prompt structures tailored specifically to the brand.

# Database Entities
*Note: This is a planning schema.*

- `brands` (Existing): 
  - Stores `name`, `business_type`, `target_audience`, `tone`, `personality`.
- `brand_memory_rules` (New): 
  - `id` (uuid, PK)
  - `brand_id` (uuid, FK)
  - `rule_type` (enum: 'content', 'image', 'negative_prompt', 'compliance')
  - `content` (text)
  - `is_active` (boolean)
- `brand_assets` (New): 
  - `id` (uuid, PK)
  - `brand_id` (uuid, FK)
  - `asset_type` (enum: 'logo', 'reference_image', 'font')
  - `url` (string)
  - `description` (text)
- `prompt_templates` (New): 
  - `id` (uuid, PK)
  - `brand_id` (uuid, FK)
  - `title` (string)
  - `template_text` (text)
  - `category` (enum: 'text', 'image')

# UI Structure
- **Profile Page (`/profile`):** Retains the high-level Brand Identity (Name, Tone, Audience). This is the macro-level overview.
- **Brand Memory Hub (`/settings/memory` or new `/memory` route):**
  - **Content Guidelines Tab:** Interface to add/edit text rules, prohibited words, and tone specifics.
  - **Visual Guidelines Tab:** Interface to define color palettes, image style preferences, and negative visual prompts.
  - **Asset Library Tab:** Grid view to upload and manage reference images, logos, and style anchors.
  - **Templates Tab:** List view to manage custom prompt templates.

# MVP Scope
To validate the feature quickly without heavy engineering overhead:
- Add a new `brand_instructions` (text) field and a `visual_instructions` (text) field to the existing `brands` table.
- Create a simple UI within the existing Profile page or a new settings tab for users to input unified "Content Guidelines" and "Visual Guidelines" as plain text.
- Automatically inject these text instructions into the system prompt for OpenAI text generation requests.
- Exclude complex image referencing, multi-asset storage, and granular prompt templates for now.

# Phase 2 Scope
- Implement the dedicated `brand_memory_rules`, `brand_assets`, and `prompt_templates` tables.
- Integration with an Image Generation API (e.g., DALL-E 3, Midjourney API, Stable Diffusion) utilizing the stored Visual Guidelines and Reference Assets.
- Multi-modal support: Use Vision AI to analyze uploaded Reference Images to automatically extract and save style tokens.
- Tag-based system for Prompt Templates.
- Granular, tabbed UI for distinct memory categories.

# Risks
- **Prompt Token Limits & Cost:** Injecting too many brand rules into every AI prompt could consume a large portion of the LLM context window and significantly increase API costs per generation.
- **AI Rule Ignorance / Hallucination:** The AI might hallucinate or ignore specific negative constraints if the Brand Memory instructions grow too complex or contradictory.
- **Asset Storage Overhead:** Hosting numerous high-res reference images for multiple brands will increase cloud storage (e.g., Supabase Storage / S3) costs and require asset lifecycle management.

# Recommendations
- **System Prompt Optimization:** Consolidate Brand Memory rules into a highly concise markdown format or JSON structure before injecting them into the AI prompt to save tokens and improve LLM adherence.
- **Enforce MVP Simplicity:** Start with simple, aggregated text boxes for global instructions before building complex, multi-table rule architectures.
- **Prioritize Compliance:** Ensure legal and compliance rules are injected at the *very end* of the system prompt, as LLMs tend to pay more attention to the end of a prompt (recency bias).
