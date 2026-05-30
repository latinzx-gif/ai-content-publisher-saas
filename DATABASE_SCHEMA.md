# Database Schema

The database relies on Supabase (PostgreSQL). It includes Row Level Security (RLS) to ensure users can only access their own data.

## Tables

### 1. `profiles`
Extended user profile data, automatically created when a user signs up.
*   `id` (uuid, primary key, references `auth.users.id`)
*   `email` (text)
*   `created_at` (timestamp)
*   `updated_at` (timestamp)

### 2. `brands`
Stores the brand guidelines (Tone and Personality).
*   `id` (uuid, primary key)
*   `user_id` (uuid, references `profiles.id`)
*   `name` (text)
*   `tone` (text)
*   `personality` (text)
*   `created_at` / `updated_at`

### 3. `integrations`
Stores the user's API keys (OpenAI, Buffer) in an encrypted format.
*   `id` (uuid, primary key)
*   `user_id` (uuid, references `profiles.id`)
*   `provider` (text: 'openai' | 'buffer')
*   `encrypted_value` (text)
*   `created_at` / `updated_at`
*   *Unique constraint on `(user_id, provider)`*

### 4. `workflow_logs`
Tracks the history of content generation requests and publishing actions.
*   `id` (uuid, primary key)
*   `user_id` (uuid, references `profiles.id`)
*   `action` (text)
*   `topic` (text)
*   `status` (text: 'pending', 'completed', 'failed')
*   `created_at` (timestamp)

### 5. `content_posts`
Stores the generated AI content, its status, and its Buffer integration ID.
*   `id` (uuid, primary key)
*   `workflow_id` (uuid, references `workflow_logs.id`)
*   `user_id` (uuid, references `profiles.id`)
*   `content` (text)
*   `status` (text: 'draft' | 'approved' | 'published')
*   `buffer_post_id` (text, nullable)
*   `created_at` / `updated_at`
