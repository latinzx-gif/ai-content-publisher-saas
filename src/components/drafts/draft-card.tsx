'use client'

import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Eye, Edit2, Check, X, Send, ExternalLink, AlertCircle } from 'lucide-react'
import { approvePost, rejectPost } from '@/actions/drafts'
import { sendPostToBuffer } from '@/actions/publish'
import { toast } from 'sonner'
import { useState } from 'react'
import { Post, PostMetadata, PostStatus } from '@/types'

interface DraftCardProps {
  post: Post
  onPreview: (post: Post) => void
  onEdit: (post: Post) => void
  hasBufferKey: boolean
}

export function DraftCard({ post, onPreview, onEdit, hasBufferKey }: DraftCardProps) {
  const [loading, setLoading] = useState(false)
  const [publishing, setPublishing] = useState(false)
  const metadata = post.metadata as PostMetadata & { external_url?: string; last_error?: string }

  const statusColors: Record<PostStatus, string> = {
    draft: 'bg-gray-100 text-gray-800',
    approved: 'bg-green-100 text-green-800',
    rejected: 'bg-red-100 text-red-800',
    published: 'bg-blue-100 text-blue-800',
    failed: 'bg-yellow-100 text-yellow-800'
  }

  async function handleApprove() {
    setLoading(true)
    try {
      await approvePost(post.id)
      toast.success('Post approved')
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Failed to approve'
      toast.error(message)
    } finally {
      setLoading(false)
    }
  }

  async function handleReject() {
    setLoading(true)
    try {
      await rejectPost(post.id)
      toast.success('Post rejected')
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Failed to reject'
      toast.error(message)
    } finally {
      setLoading(false)
    }
  }

  async function handlePublish() {
    if (!hasBufferKey) {
      toast.error('Please connect Buffer in Settings first.')
      return
    }
    setPublishing(true)
    try {
      const result = await sendPostToBuffer(post.id)
      toast.success('Successfully sent to Buffer!')
      if (result.externalUrl) {
          window.open(result.externalUrl, '_blank')
      }
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Failed to publish'
      toast.error(message)
    } finally {
      setPublishing(false)
    }
  }

  return (
    <Card className="flex flex-col h-full">
      <CardHeader className="pb-2">
        <div className="flex justify-between items-start mb-2">
          <Badge className={statusColors[post.status]}>{post.status}</Badge>
          <span className="text-[10px] text-muted-foreground">
            {new Date(post.created_at).toLocaleDateString()}
          </span>
        </div>
        <CardTitle className="text-sm line-clamp-2">{metadata?.title}</CardTitle>
      </CardHeader>
      <CardContent className="flex-grow">
        <p className="text-xs text-muted-foreground line-clamp-3 mb-2">
          {metadata?.caption || post.content}
        </p>
        <div className="flex flex-wrap gap-1 mt-auto">
          <Badge variant="secondary" className="text-[10px]">{metadata?.angle_type}</Badge>
          <Badge variant="outline" className="text-[10px] capitalize">{metadata?.platform}</Badge>
        </div>

        {post.status === 'published' && metadata.external_url && (
          <a 
            href={metadata.external_url} 
            target="_blank" 
            rel="noopener noreferrer"
            className="flex items-center text-[10px] text-blue-600 mt-2 hover:underline"
          >
            <ExternalLink className="w-3 h-3 mr-1" /> View in Buffer
          </a>
        )}

        {post.status === 'failed' && metadata.last_error && (
          <div className="flex items-start text-[10px] text-red-600 mt-2 bg-red-50 p-1 rounded">
            <AlertCircle className="w-3 h-3 mr-1 shrink-0 mt-0.5" />
            <span>Error: {metadata.last_error}</span>
          </div>
        )}
      </CardContent>
      <CardFooter className="grid grid-cols-2 gap-2 border-t pt-4 mt-auto">
        <Button variant="outline" size="sm" onClick={() => onPreview(post)} disabled={publishing}>
          <Eye className="w-4 h-4 mr-1" /> Preview
        </Button>
        <Button variant="outline" size="sm" onClick={() => onEdit(post)} disabled={publishing || post.status === 'published'}>
          <Edit2 className="w-4 h-4 mr-1" /> Edit
        </Button>
        
        {(post.status === 'approved' || post.status === 'failed') ? (
          <Button 
            size="sm" 
            className="col-span-2 bg-blue-600 hover:bg-blue-700" 
            onClick={handlePublish} 
            disabled={publishing || !hasBufferKey}
          >
            <Send className="w-4 h-4 mr-1" /> {publishing ? 'Sending...' : 'Send to Buffer'}
          </Button>
        ) : post.status === 'draft' ? (
          <>
            <Button size="sm" className="bg-green-600 hover:bg-green-700" onClick={handleApprove} disabled={loading}>
              <Check className="w-4 h-4 mr-1" /> Approve
            </Button>
            <Button size="sm" variant="destructive" onClick={handleReject} disabled={loading}>
              <X className="w-4 h-4 mr-1" /> Reject
            </Button>
          </>
        ) : (
          <Button size="sm" variant="outline" className="col-span-2" disabled>
             {post.status === 'published' ? 'Already Published' : 'Cannot Publish'}
          </Button>
        )}
      </CardFooter>
    </Card>
  )
}
