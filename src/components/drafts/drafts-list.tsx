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
import { CheckCheck, Send, Library } from 'lucide-react'
import { Post } from '@/types'
import { EmptyState } from '@/components/ui/empty-state'
import { PageHeader } from '@/components/ui/page-header'

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
      toast.success(`อนุมัติโพสต์ทั้งหมด ${result.count} รายการเรียบร้อยแล้ว`)
    } catch (error) {
      const message = error instanceof Error ? error.message : 'เกิดข้อผิดพลาดในการอนุมัติทั้งหมด'
      toast.error(message)
    }
  }

  async function handlePublishAll() {
    if (!hasBufferKey) {
      toast.error('กรุณาเชื่อมต่อ Buffer ในหน้า Settings ก่อน')
      return
    }
    setPublishing(true)
    try {
      const result = await sendApprovedPostsToBuffer()
      toast.success(`ส่งไปยัง Buffer สำเร็จ: ${result.successCount} รายการ, ล้มเหลว ${result.failCount} รายการ`)
    } catch (error) {
      const message = error instanceof Error ? error.message : 'เกิดข้อผิดพลาดในการส่งทั้งหมด'
      toast.error(message)
    } finally {
      setPublishing(false)
    }
  }

  const PostGrid = ({ posts, type }: { posts: Post[], type: string }) => (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mt-4">
        {posts.map((post) => (
          <DraftCard 
            key={post.id} 
            post={post} 
            onPreview={(p: Post) => setPreviewPost(p)} 
            onEdit={(p: Post) => setEditPost(p)} 
            hasBufferKey={hasBufferKey}
          />
        ))}
      </div>
      {posts.length === 0 && (
        <EmptyState 
          icon={Library}
          title={`ยังไม่มีโพสต์ในหมวด ${type}`}
          description="คุณสามารถเริ่มสร้างคอนเทนต์ใหม่ด้วย AI ได้ทันที เพื่อนำมาเก็บไว้ในคลังเนื้อหาของคุณ"
          action={{ label: "สร้างคอนเทนต์ใหม่", href: "/generate" }}
        />
      )}
    </div>
  )

  const draftPosts = initialPosts.filter(p => p.status === 'draft')
  const approvedPosts = initialPosts.filter(p => p.status === 'approved')
  const rejectedPosts = initialPosts.filter(p => p.status === 'rejected')

  return (
    <div className="space-y-8">
      <PageHeader 
        title="คลังเนื้อหา" 
        subtitle="จัดการ แก้ไข และอนุมัติโพสต์ที่ AI สร้างขึ้นก่อนส่งไปยังโซเชียลมีเดีย"
      >
        <div className="flex gap-3">
            {draftPosts.length > 0 && (
            <AlertDialog>
                <AlertDialogTrigger>
                <Button variant="outline" className="rounded-xl border-gray-200 shadow-sm font-bold">
                    <CheckCheck className="w-4 h-4 mr-2" /> อนุมัติร่างทั้งหมด
                </Button>
                </AlertDialogTrigger>
                <AlertDialogContent className="rounded-2xl">
                <AlertDialogHeader>
                    <AlertDialogTitle>ยืนยันการอนุมัติทั้งหมด?</AlertDialogTitle>
                    <AlertDialogDescription>
                    ระบบจะทำการอนุมัติโพสต์ที่เป็น &quot;ร่าง&quot; ทั้งหมด {draftPosts.length} รายการ เพื่อเตรียมพร้อมสำหรับการเผยแพร่
                    </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                    <AlertDialogCancel className="rounded-xl">ยกเลิก</AlertDialogCancel>
                    <AlertDialogAction onClick={handleApproveAll} className="bg-green-600 hover:bg-green-700 rounded-xl">
                    ยืนยันการอนุมัติ
                    </AlertDialogAction>
                </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>
            )}

            {approvedPosts.length > 0 && (
            <AlertDialog>
                <AlertDialogTrigger>
                <Button className="bg-blue-600 hover:bg-blue-700 shadow-lg shadow-blue-100 rounded-xl font-bold" disabled={publishing || !hasBufferKey}>
                    <Send className="w-4 h-4 mr-2" /> {publishing ? 'กำลังส่ง...' : 'เผยแพร่ที่อนุมัติแล้ว'}
                </Button>
                </AlertDialogTrigger>
                <AlertDialogContent className="rounded-2xl">
                <AlertDialogHeader>
                    <AlertDialogTitle>ยืนยันการส่งไปยัง Buffer?</AlertDialogTitle>
                    <AlertDialogDescription>
                    โพสต์ที่ได้รับ &quot;อนุมัติ&quot; ทั้งหมด {approvedPosts.length} รายการ จะถูกส่งเข้าไปในคิวของ Buffer ทันที
                    </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                    <AlertDialogCancel className="rounded-xl">ยกเลิก</AlertDialogCancel>
                    <AlertDialogAction onClick={handlePublishAll} className="bg-blue-600 hover:bg-blue-700 rounded-xl">
                    ยืนยันการส่ง
                    </AlertDialogAction>
                </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>
            )}
        </div>
      </PageHeader>

      <Tabs defaultValue="all" className="w-full">
        <TabsList className="bg-white border p-1 rounded-2xl h-14 shadow-sm mb-6">
          <TabsTrigger value="all" className="rounded-xl px-8 font-bold data-[state=active]:bg-blue-50 data-[state=active]:text-blue-700">ทั้งหมด ({initialPosts.length})</TabsTrigger>
          <TabsTrigger value="draft" className="rounded-xl px-8 font-bold data-[state=active]:bg-blue-50 data-[state=active]:text-blue-700">ร่าง ({draftPosts.length})</TabsTrigger>
          <TabsTrigger value="approved" className="rounded-xl px-8 font-bold data-[state=active]:bg-blue-50 data-[state=active]:text-blue-700">อนุมัติแล้ว ({approvedPosts.length})</TabsTrigger>
          <TabsTrigger value="rejected" className="rounded-xl px-8 font-bold data-[state=active]:bg-blue-50 data-[state=active]:text-blue-700">ปฏิเสธ ({rejectedPosts.length})</TabsTrigger>
        </TabsList>
        <div className="mt-8">
            <TabsContent value="all" className="m-0 focus-visible:outline-none">
            <PostGrid posts={initialPosts} type="ทั้งหมด" />
            </TabsContent>
            <TabsContent value="draft" className="m-0 focus-visible:outline-none">
            <PostGrid posts={draftPosts} type="ร่าง" />
            </TabsContent>
            <TabsContent value="approved" className="m-0 focus-visible:outline-none">
            <PostGrid posts={approvedPosts} type="อนุมัติแล้ว" />
            </TabsContent>
            <TabsContent value="rejected" className="m-0 focus-visible:outline-none">
            <PostGrid posts={rejectedPosts} type="ปฏิเสธ" />
            </TabsContent>
        </div>
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
