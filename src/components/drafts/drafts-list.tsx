'use client'

import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { DraftCard } from '@/components/drafts/draft-card'
import { PreviewModal } from '@/components/drafts/preview-modal'
import { EditModal } from '@/components/drafts/edit-modal'
import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { approveAllDrafts } from '@/actions/drafts'
import { sendApprovedPostsToBuffer } from '@/actions/publish'
import { toast } from 'sonner'
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from '@/components/ui/alert-dialog'
import { CheckCheck, Send } from 'lucide-react'
import { Post } from '@/types'

interface DraftsListProps {
  initialPosts: Post[]
  hasBufferKey: boolean
}

export function DraftsList({ initialPosts, hasBufferKey }: DraftsListProps) {
  const [previewPost, setPreviewPost] = useState<Post | null>(null)
  const [editPost, setEditPost] = useState<Post | null>(null)
  const [publishing, setPublishing] = useState(false)

  async function handleApproveAll() {
    try {
      const result = await approveAllDrafts()
      toast.success(`Successfully approved ${result.count} posts`)
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Failed to approve all'
      toast.error(message)
    }
  }

  async function handlePublishAll() {
    if (!hasBufferKey) {
      toast.error('Please connect Buffer in Settings first.')
      return
    }
    setPublishing(true)
    try {
      const result = await sendApprovedPostsToBuffer()
      toast.success(`Sent to Buffer: ${result.successCount} success, ${result.failCount} failed.`)
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Failed to publish all'
      toast.error(message)
    } finally {
      setPublishing(false)
    }
  }

  const PostGrid = ({ posts }: { posts: Post[] }) => (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-6">
      {posts.map((post) => (
        <DraftCard 
          key={post.id} 
          post={post} 
          onPreview={(p: Post) => setPreviewPost(p)} 
          onEdit={(p: Post) => setEditPost(p)} 
          hasBufferKey={hasBufferKey}
        />
      ))}
      {posts.length === 0 && (
        <div className="col-span-full py-20 text-center border-2 border-dashed rounded-lg">
          <p className="text-muted-foreground">No posts found in this category.</p>
        </div>
      )}
    </div>
  )

  const draftPosts = initialPosts.filter(p => p.status === 'draft')
  const approvedPosts = initialPosts.filter(p => p.status === 'approved')
  const rejectedPosts = initialPosts.filter(p => p.status === 'rejected')

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold tracking-tight">Content Drafts</h1>
        <div className="flex gap-2">
            {draftPosts.length > 0 && (
            <AlertDialog>
                <AlertDialogTrigger>
                <Button variant="outline">
                    <CheckCheck className="w-4 h-4 mr-2" /> Approve All Drafts
                </Button>
                </AlertDialogTrigger>
                <AlertDialogContent>
                <AlertDialogHeader>
                    <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                    <AlertDialogDescription>
                    This will approve all {draftPosts.length} draft posts currently in the list.
                    </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                    <AlertDialogCancel>Cancel</AlertDialogCancel>
                    <AlertDialogAction onClick={handleApproveAll} className="bg-green-600 hover:bg-green-700">
                    Yes, Approve All
                    </AlertDialogAction>
                </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>
            )}

            {approvedPosts.length > 0 && (
            <AlertDialog>
                <AlertDialogTrigger>
                <Button className="bg-blue-600 hover:bg-blue-700" disabled={publishing || !hasBufferKey}>
                    <Send className="w-4 h-4 mr-2" /> {publishing ? 'Sending...' : 'Publish All Approved'}
                </Button>
                </AlertDialogTrigger>
                <AlertDialogContent>
                <AlertDialogHeader>
                    <AlertDialogTitle>Publish All Approved Posts?</AlertDialogTitle>
                    <AlertDialogDescription>
                    This will send all {approvedPosts.length} approved posts to your Buffer queue.
                    </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                    <AlertDialogCancel>Cancel</AlertDialogCancel>
                    <AlertDialogAction onClick={handlePublishAll} className="bg-blue-600 hover:bg-blue-700">
                    Yes, Publish All
                    </AlertDialogAction>
                </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>
            )}
        </div>
      </div>

      <Tabs defaultValue="all" className="w-full">
        <TabsList>
          <TabsTrigger value="all">All ({initialPosts.length})</TabsTrigger>
          <TabsTrigger value="draft">Draft ({draftPosts.length})</TabsTrigger>
          <TabsTrigger value="approved">Approved ({approvedPosts.length})</TabsTrigger>
          <TabsTrigger value="rejected">Rejected ({rejectedPosts.length})</TabsTrigger>
        </TabsList>
        <TabsContent value="all">
          <PostGrid posts={initialPosts} />
        </TabsContent>
        <TabsContent value="draft">
          <PostGrid posts={draftPosts} />
        </TabsContent>
        <TabsContent value="approved">
          <PostGrid posts={approvedPosts} />
        </TabsContent>
        <TabsContent value="rejected">
          <PostGrid posts={rejectedPosts} />
        </TabsContent>
      </Tabs>

      <PreviewModal 
        post={previewPost} 
        isOpen={!!previewPost} 
        onClose={() => setPreviewPost(null)} 
      />
      
      <EditModal 
        post={editPost} 
        isOpen={!!editPost} 
        onClose={() => setEditPost(null)} 
      />
    </div>
  )
}
