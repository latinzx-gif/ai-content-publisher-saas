export type PostStatus = 'draft' | 'approved' | 'rejected' | 'published' | 'failed'

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
  creative_status?: 'not_required' | 'needs_review' | 'approved'
  image_url?: string | null
  image_source?: 'manual_url' | 'placeholder' | null
  external_id?: string
  external_url?: string
  last_error?: string
  published_at?: string
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
