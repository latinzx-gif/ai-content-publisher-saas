'use client'

import { useState, useEffect } from 'react'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { updatePost } from '@/actions/drafts'
import { toast } from 'sonner'
import { Post, PostMetadata } from '@/types'

interface EditModalProps {
  post: Post | null
  isOpen: boolean
  onClose: () => void
}

export function EditModal({ post, isOpen, onClose }: EditModalProps) {
  const [loading, setLoading] = useState(false)
  const [formData, setFormData] = useState({
    title: '',
    caption: '',
    hashtags: ''
  })

  useEffect(() => {
    if (post) {
      const metadata = post.metadata as PostMetadata
      setFormData({
        title: metadata?.title || '',
        caption: metadata?.caption || post.content,
        hashtags: metadata?.hashtags || ''
      })
    }
  }, [post])

  async function handleSubmit(e: React.FormEvent) {
    if (!post) return
    e.preventDefault()
    setLoading(true)
    try {
      await updatePost({
        id: post.id,
        ...formData
      })
      toast.success('Post updated successfully')
      onClose()
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Failed to update'
      toast.error(message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-xl">
        <DialogHeader>
          <DialogTitle>Edit Post</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4 py-4">
          <div className="space-y-2">
            <Label htmlFor="title">Title / Hook</Label>
            <Input
              id="title"
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              required
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="caption">Caption</Label>
            <Textarea
              id="caption"
              value={formData.caption}
              onChange={(e) => setFormData({ ...formData, caption: e.target.value })}
              className="h-40"
              required
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="hashtags">Hashtags</Label>
            <Input
              id="hashtags"
              value={formData.hashtags}
              onChange={(e) => setFormData({ ...formData, hashtags: e.target.value })}
              placeholder="#hashtag1 #hashtag2"
            />
          </div>
          <DialogFooter>
            <Button type="button" variant="outline" onClick={onClose}>Cancel</Button>
            <Button type="submit" disabled={loading}>
              {loading ? 'Saving...' : 'Save Changes'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
