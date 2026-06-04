export type PostStatus =
  | 'draft'
  | 'text_approved'
  | 'images_pending'
  | 'images_ready'
  | 'creative_approved'
  | 'scheduled'
  | 'published'
  | 'failed'
  | 'rejected'

export interface PostMetadata {
  title: string
  caption: string
  hashtags: string
  platform: string
  angle_type: string
  topic?: string
  tone?: string
  personality?: string
  audience?: string
  objective?: string
  format?: string
  output_mode?: string
  secondary_language?: string
  requested_word_count?: string
  actual_word_count?: number
  platform_format?: 'text_only' | 'facebook_post' | 'instagram_4_5' | 'instagram_square'
  creative_status?: 'not_required' | 'pending' | 'generating' | 'images_ready' | 'approved'
  image_prompt?: string
  image_options?: Array<{
    id: string;
    url: string;
    source: 'openai' | 'placeholder';
    prompt?: string;
    warning?: string;
    overlay_meta?: {
      text_chars: number;
      qa_pass: boolean;
      qa_reason?: string;
      model: string;
      input_tokens?: number;
      output_tokens?: number;
      total_tokens?: number;
    };
  }>;
  selected_image?: {
    id: string;
    url: string;
    source: 'openai' | 'placeholder';
    prompt?: string;
    warning?: string;
  } | null
  selected_image_url?: string;
  image_url?: string | null
  image_source?: 'manual_url' | 'placeholder' | 'openai' | null
  external_id?: string
  external_url?: string
  last_error?: string
  published_at?: string
  buffer_due_at?: string
  language?: string
}

export interface Post {
  id: string
  user_id: string
  workflow_id: string | null
  content: string
  status: PostStatus
  buffer_post_id: string | null
  metadata: PostMetadata
  created_at: string
  updated_at: string
}
