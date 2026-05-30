'use client'

import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Eye, Edit2, Check, X, Send, ExternalLink, AlertCircle, Hash, MessageSquare, Globe } from 'lucide-react'
import { approvePost, rejectPost } from '@/actions/drafts'
import { sendPostToBuffer } from '@/actions/publish'
import { toast } from 'sonner'
import { useState } from 'react'
import { Post, PostMetadata } from '@/types'
import { StatusBadge } from '@/components/ui/status-badge'

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

  const hashtags = metadata.hashtags.split(' ').filter(h => h.startsWith('#'))

  async function handleApprove() {
    setLoading(true)
    try {
      await approvePost(post.id)
      toast.success('อนุมัติโพสต์เรียบร้อยแล้ว')
    } catch (error) {
      const message = error instanceof Error ? error.message : 'เกิดข้อผิดพลาดในการอนุมัติ'
      toast.error(message)
    } finally {
      setLoading(false)
    }
  }

  async function handleReject() {
    setLoading(true)
    try {
      await rejectPost(post.id)
      toast.success('ปฏิเสธโพสต์เรียบร้อยแล้ว')
    } catch (error) {
      const message = error instanceof Error ? error.message : 'เกิดข้อผิดพลาดในการปฏิเสธ'
      toast.error(message)
    } finally {
      setLoading(false)
    }
  }

  async function handlePublish() {
    if (!hasBufferKey) {
      toast.error('กรุณาเชื่อมต่อ Buffer ในหน้า Settings ก่อน')
      return
    }
    setPublishing(true)
    try {
      const result = await sendPostToBuffer(post.id)
      toast.success('ส่งโพสต์ไปยัง Buffer สำเร็จ!')
      if (result.externalUrl) {
          window.open(result.externalUrl, '_blank')
      }
    } catch (error) {
      const message = error instanceof Error ? error.message : 'เกิดข้อผิดพลาดในการส่งไปยัง Buffer'
      toast.error(message)
    } finally {
      setPublishing(false)
    }
  }

  return (
    <Card className="flex flex-col h-full border-none shadow-md hover:shadow-xl shadow-gray-200/50 transition-all duration-300 rounded-2xl overflow-hidden group">
      <CardHeader className="pb-4 space-y-3 bg-white">
        <div className="flex justify-between items-start">
          <StatusBadge status={post.status} />
          <span className="text-[11px] font-medium text-muted-foreground bg-gray-100 px-2 py-0.5 rounded-full">
            {new Date(post.created_at).toLocaleDateString('th-TH', { day: 'numeric', month: 'short' })}
          </span>
        </div>
        <CardTitle className="text-base font-bold line-clamp-2 leading-snug group-hover:text-blue-600 transition-colors">
          {metadata?.title}
        </CardTitle>
      </CardHeader>
      <CardContent className="flex-grow pb-6 space-y-4">
        <div className="relative">
            <p className="text-sm text-gray-600 line-clamp-4 leading-relaxed">
            {metadata?.caption}
            </p>
            <div className="absolute bottom-0 left-0 right-0 h-6 bg-gradient-to-t from-white to-transparent" />
        </div>

        <div className="flex flex-wrap gap-1.5">
          {hashtags.slice(0, 3).map((tag, i) => (
            <span key={i} className="text-[10px] font-bold text-blue-600 bg-blue-50 px-2 py-0.5 rounded-md border border-blue-100 flex items-center">
              <Hash className="w-2.5 h-2.5 mr-0.5" />
              {tag.replace('#', '')}
            </span>
          ))}
          {hashtags.length > 3 && (
            <span className="text-[10px] text-gray-400 font-bold px-1">+{hashtags.length - 3}</span>
          )}
        </div>

        <div className="flex items-center gap-3 pt-2">
            <div className="flex items-center gap-1 text-[11px] font-bold text-gray-400 uppercase tracking-tighter">
                <MessageSquare className="w-3 h-3" />
                {metadata?.angle_type}
            </div>
            <div className="w-1 h-1 rounded-full bg-gray-300" />
            <div className="flex items-center gap-1 text-[11px] font-bold text-gray-400 uppercase tracking-tighter">
                <Globe className="w-3 h-3" />
                {metadata?.platform}
            </div>
        </div>

        {post.status === 'published' && metadata.external_url && (
          <a 
            href={metadata.external_url} 
            target="_blank" 
            rel="noopener noreferrer"
            className="flex items-center justify-center gap-2 text-xs font-bold text-blue-600 mt-2 bg-blue-50/50 p-2 rounded-xl border border-blue-100 hover:bg-blue-100 transition-colors"
          >
            <ExternalLink className="w-3.5 h-3.5" /> ดูโพสต์ใน Buffer
          </a>
        )}

        {post.status === 'failed' && metadata.last_error && (
          <div className="flex items-start gap-2 text-[11px] text-red-600 mt-2 bg-red-50 p-3 rounded-xl border border-red-100">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span className="font-medium">ข้อผิดพลาด: {metadata.last_error}</span>
          </div>
        )}
      </CardContent>
      <CardFooter className="grid grid-cols-2 gap-2 border-t bg-gray-50/50 p-4 mt-auto">
        <Button variant="ghost" size="sm" onClick={() => onPreview(post)} disabled={publishing} className="rounded-lg font-bold text-xs h-9">
          <Eye className="w-3.5 h-3.5 mr-1.5" /> ดูตัวอย่าง
        </Button>
        <Button variant="ghost" size="sm" onClick={() => onEdit(post)} disabled={publishing || post.status === 'published'} className="rounded-lg font-bold text-xs h-9">
          <Edit2 className="w-3.5 h-3.5 mr-1.5" /> แก้ไข
        </Button>
        
        {(post.status === 'approved' || post.status === 'failed') ? (
          <Button 
            size="sm" 
            className="col-span-2 bg-blue-600 hover:bg-blue-700 shadow-md shadow-blue-100 rounded-lg font-bold h-10 transition-all hover:scale-[1.02]" 
            onClick={handlePublish} 
            disabled={publishing || !hasBufferKey}
          >
            {publishing ? (
                <>
                <div className="mr-2 h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
                กำลังส่ง...
                </>
            ) : (
                <>
                <Send className="w-4 h-4 mr-2" /> ส่งไปยัง Buffer
                </>
            )}
          </Button>
        ) : post.status === 'draft' ? (
          <>
            <Button size="sm" className="bg-green-600 hover:bg-green-700 rounded-lg font-bold h-9" onClick={handleApprove} disabled={loading}>
              <Check className="w-3.5 h-3.5 mr-1.5" /> อนุมัติ
            </Button>
            <Button size="sm" variant="destructive" className="rounded-lg font-bold h-9" onClick={handleReject} disabled={loading}>
              <X className="w-3.5 h-3.5 mr-1.5" /> ปฏิเสธ
            </Button>
          </>
        ) : (
          <Button size="sm" variant="outline" className="col-span-2 bg-white rounded-lg font-bold h-9" disabled>
             {post.status === 'published' ? 'เผยแพร่แล้ว' : 'ไม่สามารถส่งได้'}
          </Button>
        )}
      </CardFooter>
    </Card>
  )
}
