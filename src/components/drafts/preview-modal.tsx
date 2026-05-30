'use client'

import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Badge } from '@/components/ui/badge'
import { Post, PostMetadata } from '@/types'
import { MessageSquare, ThumbsUp, Share2, Globe, MoreHorizontal } from 'lucide-react'

interface PreviewModalProps {
  post: Post | null
  isOpen: boolean
  onClose: () => void
}

export function PreviewModal({ post, isOpen, onClose }: PreviewModalProps) {
  if (!post) return null

  const metadata = post.metadata as PostMetadata
  const hashtags = metadata.hashtags.split(' ').filter(h => h.startsWith('#'))

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl rounded-2xl overflow-hidden p-0 border-none shadow-2xl">
        <div className="grid grid-cols-1 lg:grid-cols-5 h-full max-h-[90vh]">
          <div className="lg:col-span-3 p-8 overflow-y-auto space-y-8 bg-white border-r">
            <DialogHeader className="p-0">
                <DialogTitle className="text-2xl font-bold text-gray-900">ดูตัวอย่างคอนเทนต์</DialogTitle>
            </DialogHeader>
            
            <div className="space-y-6 pt-2">
                <div className="space-y-2">
                    <h4 className="text-xs font-bold uppercase tracking-wider text-blue-600">หัวข้อโพสต์ / Hook</h4>
                    <p className="text-lg font-bold text-gray-900 leading-tight">{metadata.title}</p>
                </div>

                <div className="space-y-2">
                    <h4 className="text-xs font-bold uppercase tracking-wider text-blue-600">เนื้อหา (Caption)</h4>
                    <div className="bg-gray-50 rounded-2xl p-6 border border-gray-100">
                        <p className="text-base text-gray-700 whitespace-pre-wrap leading-relaxed">{metadata.caption}</p>
                    </div>
                </div>

                <div className="space-y-2">
                    <h4 className="text-xs font-bold uppercase tracking-wider text-blue-600">แฮชแท็ก</h4>
                    <div className="flex flex-wrap gap-2">
                        {hashtags.map((tag, i) => (
                            <Badge key={i} variant="secondary" className="bg-blue-50 text-blue-700 hover:bg-blue-100 transition-colors border-blue-100 px-3 py-1 text-sm rounded-lg">
                                {tag}
                            </Badge>
                        ))}
                    </div>
                </div>

                <div className="flex items-center gap-6 pt-4 border-t">
                    <div className="grid gap-1">
                        <span className="text-[10px] font-bold uppercase text-gray-400 tracking-widest">มุมมองคอนเทนต์</span>
                        <Badge variant="outline" className="w-fit border-gray-300 font-bold">{metadata.angle_type}</Badge>
                    </div>
                    <div className="grid gap-1">
                        <span className="text-[10px] font-bold uppercase text-gray-400 tracking-widest">แพลตฟอร์ม</span>
                        <Badge variant="outline" className="w-fit border-gray-300 font-bold capitalize">{metadata.platform}</Badge>
                    </div>
                </div>
            </div>
          </div>

          <div className="lg:col-span-2 bg-gray-100 p-8 flex flex-col items-center justify-start overflow-y-auto">
            <h4 className="text-[10px] font-extrabold uppercase text-gray-400 mb-6 tracking-[0.2em] w-full text-center">จำลองการแสดงผลบน Facebook</h4>
            
            <div className="w-full bg-white rounded-xl shadow-xl overflow-hidden border border-gray-200 animate-in fade-in slide-in-from-right-4 duration-500 delay-200">
              <div className="p-4 flex items-center justify-between">
                <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center text-white font-bold text-xs shadow-md border-2 border-white">
                        AI
                    </div>
                    <div>
                        <div className="text-sm font-bold text-gray-900 hover:underline cursor-pointer">ชื่อแบรนด์ของคุณ</div>
                        <div className="flex items-center gap-1 text-[10px] text-gray-500">
                            <span>1 นาทีที่แล้ว</span>
                            <span>•</span>
                            <Globe className="w-2.5 h-2.5" />
                        </div>
                    </div>
                </div>
                <MoreHorizontal className="w-5 h-5 text-gray-400 cursor-pointer" />
              </div>

              <div className="px-4 pb-3 space-y-4">
                  <p className="text-sm text-gray-900 whitespace-pre-wrap leading-snug">
                    <span className="font-bold block mb-2">{metadata.title}</span>
                    {metadata.caption}
                  </p>
                  <p className="text-sm text-blue-700 hover:underline cursor-pointer font-medium tracking-tight">
                    {metadata.hashtags}
                  </p>
              </div>

              <div className="aspect-video bg-gray-200 flex items-center justify-center border-y border-gray-100 relative group cursor-pointer overflow-hidden">
                  <div className="absolute inset-0 bg-gradient-to-br from-gray-100/50 to-gray-200/50" />
                  <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest relative z-10 group-hover:scale-110 transition-transform italic">ภาพประกอบคอนเทนต์</span>
              </div>

              <div className="p-1 px-4 flex items-center justify-between border-b border-gray-100">
                  <div className="flex items-center gap-1 py-2">
                      <div className="flex -space-x-1">
                          <div className="w-4 h-4 rounded-full bg-blue-500 border border-white flex items-center justify-center z-20">
                            <ThumbsUp className="w-2.5 h-2.5 text-white fill-current" />
                          </div>
                          <div className="w-4 h-4 rounded-full bg-red-500 border border-white flex items-center justify-center z-10">
                            <span className="text-[8px] text-white">❤️</span>
                          </div>
                      </div>
                      <span className="text-xs text-gray-500 ml-1">1.2K</span>
                  </div>
                  <div className="text-xs text-gray-500 py-2">
                      45 ความคิดเห็น • 12 แชร์
                  </div>
              </div>

              <div className="grid grid-cols-3 p-1">
                <button className="flex items-center justify-center gap-2 py-2 text-gray-500 hover:bg-gray-50 transition-colors rounded-lg text-sm font-semibold">
                  <ThumbsUp className="w-4 h-4" />
                  ถูกใจ
                </button>
                <button className="flex items-center justify-center gap-2 py-2 text-gray-500 hover:bg-gray-50 transition-colors rounded-lg text-sm font-semibold">
                  <MessageSquare className="w-4 h-4" />
                  แสดงความเห็น
                </button>
                <button className="flex items-center justify-center gap-2 py-2 text-gray-500 hover:bg-gray-50 transition-colors rounded-lg text-sm font-semibold">
                  <Share2 className="w-4 h-4" />
                  แชร์
                </button>
              </div>
            </div>
            
            <p className="mt-6 text-[10px] text-gray-400 text-center leading-relaxed">
                นี่เป็นเพียงการจำลองการแสดงผลเบื้องต้นเท่านั้น<br/>ผลลัพธ์จริงอาจแตกต่างกันไปตามแต่ละแพลตฟอร์ม
            </p>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
