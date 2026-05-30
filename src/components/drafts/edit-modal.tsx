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
import { Edit3, Save } from 'lucide-react'

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
      toast.success('อัปเดตข้อมูลเรียบร้อยแล้ว')
      onClose()
    } catch (error) {
      const message = error instanceof Error ? error.message : 'เกิดข้อผิดพลาดในการบันทึก'
      toast.error(message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl rounded-2xl p-0 overflow-hidden border-none shadow-2xl">
        <DialogHeader className="p-8 bg-white border-b">
          <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-blue-50 rounded-xl flex items-center justify-center text-blue-600">
                  <Edit3 className="w-5 h-5" />
              </div>
              <DialogTitle className="text-xl font-bold">แก้ไขคอนเทนต์</DialogTitle>
          </div>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="p-8 space-y-6 bg-white">
          <div className="space-y-3">
            <Label htmlFor="title" className="text-sm font-bold text-gray-700">หัวข้อโพสต์ / Hook</Label>
            <Input
              id="title"
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              className="h-11 rounded-xl border-gray-200 focus:ring-blue-500"
              required
            />
          </div>
          <div className="space-y-3">
            <Label htmlFor="caption" className="text-sm font-bold text-gray-700">เนื้อหา (Caption)</Label>
            <Textarea
              id="caption"
              value={formData.caption}
              onChange={(e) => setFormData({ ...formData, caption: e.target.value })}
              className="h-48 rounded-xl border-gray-200 focus:ring-blue-500 p-4 leading-relaxed"
              required
            />
          </div>
          <div className="space-y-3">
            <Label htmlFor="hashtags" className="text-sm font-bold text-gray-700">แฮชแท็ก</Label>
            <Input
              id="hashtags"
              value={formData.hashtags}
              onChange={(e) => setFormData({ ...formData, hashtags: e.target.value })}
              placeholder="เช่น #กฎหมาย #SME #ความรู้"
              className="h-11 rounded-xl border-gray-200 focus:ring-blue-500 font-mono text-sm"
            />
          </div>
          <DialogFooter className="pt-4 gap-3">
            <Button type="button" variant="ghost" onClick={onClose} className="rounded-xl font-bold h-11">
                ยกเลิก
            </Button>
            <Button type="submit" disabled={loading} className="rounded-xl bg-blue-600 hover:bg-blue-700 shadow-md font-bold px-8 h-11 transition-all hover:scale-[1.02]">
              {loading ? (
                  <>
                  <div className="mr-2 h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
                  กำลังบันทึก...
                  </>
              ) : (
                  <>
                  <Save className="mr-2 h-4 w-4" /> บันทึกการแก้ไข
                  </>
              )}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
