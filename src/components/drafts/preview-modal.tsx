'use client'

import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Badge } from '@/components/ui/badge'
import { Post, PostMetadata } from '@/types'

interface PreviewModalProps {
  post: Post | null
  isOpen: boolean
  onClose: () => void
}

export function PreviewModal({ post, isOpen, onClose }: PreviewModalProps) {
  if (!post) return null

  const metadata = post.metadata as PostMetadata

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>Post Preview</DialogTitle>
        </DialogHeader>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 py-4">
          <div className="space-y-4">
            <div>
              <h4 className="text-sm font-medium text-muted-foreground">Title</h4>
              <p className="text-sm font-bold">{metadata.title}</p>
            </div>
            <div>
              <h4 className="text-sm font-medium text-muted-foreground">Caption</h4>
              <ScrollArea className="h-[200px] rounded-md border p-4">
                <p className="text-sm whitespace-pre-wrap">{metadata.caption || post.content}</p>
              </ScrollArea>
            </div>
            <div>
              <h4 className="text-sm font-medium text-muted-foreground">Hashtags</h4>
              <p className="text-sm text-blue-600">{metadata.hashtags}</p>
            </div>
            <div className="flex gap-2">
              <Badge variant="outline">{metadata.angle_type}</Badge>
              <Badge variant="outline" className="capitalize">{metadata.platform}</Badge>
            </div>
          </div>

          <div className="border rounded-lg bg-gray-50 p-4">
            <h4 className="text-xs font-bold uppercase text-gray-400 mb-4">Facebook Preview (Simulated)</h4>
            <div className="bg-white border rounded shadow-sm p-3">
              <div className="flex items-center gap-2 mb-3">
                <div className="w-10 h-10 rounded-full bg-gray-200" />
                <div>
                  <div className="w-24 h-3 bg-gray-200 rounded mb-1" />
                  <div className="w-16 h-2 bg-gray-100 rounded" />
                </div>
              </div>
              <p className="text-sm mb-3 whitespace-pre-wrap">{metadata.caption}</p>
              <p className="text-sm text-blue-600 mb-3">{metadata.hashtags}</p>
              <div className="border-t pt-2 flex justify-between text-gray-500 text-xs">
                <span>Like</span>
                <span>Comment</span>
                <span>Share</span>
              </div>
            </div>
          </div>
        </div>
        <DialogFooter>
          <Button onClick={onClose}>Close</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
