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
