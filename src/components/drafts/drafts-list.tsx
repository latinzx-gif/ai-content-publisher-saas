'use client'

import { useState, useEffect } from 'react'
import { Post } from '@/types'
import { StatusBadge } from '@/components/ui/status-badge'
import { cn } from '@/lib/utils'
import { 
    Search, 
    Filter, 
    ChevronRight, 
    Eye, 
    Edit2, 
    Check, 
    X, 
    Send, 
    ExternalLink, 
    AlertCircle, 
    Globe, 
    MessageSquare,
    Library,
    CheckCheck,
    ThumbsUp,
    Share2,
    MoreHorizontal
} from 'lucide-react'
import { Button, buttonVariants } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Badge } from '@/components/ui/badge'
import { approvePost, rejectPost, approveAllDrafts, rejectAllDrafts } from '@/actions/drafts'
import { sendPostToBuffer, sendApprovedPostsToBuffer } from '@/actions/publish'
import { toast } from 'sonner'
import { EditModal } from '@/components/drafts/edit-modal'
import { EmptyState } from '@/components/ui/empty-state'
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from '@/components/ui/alert-dialog'

interface DraftsListProps {
  initialPosts: Post[]
  hasBufferKey: boolean
}

export function DraftsList({ initialPosts, hasBufferKey }: DraftsListProps) {
  const [selectedPost, setSelectedPost] = useState<Post | null>(null)
  const [posts, setPosts] = useState<Post[]>(initialPosts)
  const [filter, setFilter] = useState<string>('all')
  const [search, setSearch] = useState('')
  const [isEditOpen, setIsEditOpen] = useState(false)
  const [publishing, setPublishing] = useState(false)
  const [loading, setLoading] = useState<string | null>(null)

  useEffect(() => {
      setPosts(initialPosts)
      if (!selectedPost && initialPosts.length > 0) {
          setSelectedPost(initialPosts[0])
      }
  }, [initialPosts, selectedPost])

  const filteredPosts = posts.filter(post => {
    const matchesStatus = filter === 'all' || post.status === filter
    const matchesSearch = post.metadata.title.toLowerCase().includes(search.toLowerCase()) || 
                          post.metadata.caption.toLowerCase().includes(search.toLowerCase())
    return matchesStatus && matchesSearch
  })

  async function handleStatusChange(id: string, action: 'approve' | 'reject') {
      setLoading(id)
      try {
          if (action === 'approve') await approvePost(id)
          else await rejectPost(id)
          toast.success('อัปเดตสถานะเรียบร้อย')
      } catch {
          toast.error('เกิดข้อผิดพลาด')
      } finally {
          setLoading(null)
      }
  }

  async function handlePublish(id: string) {
      setPublishing(true)
      try {
          const result = await sendPostToBuffer(id)
          toast.success('ส่งไปยัง Buffer สำเร็จ!')
          if (result.externalUrl) window.open(result.externalUrl, '_blank')
      } catch {
          toast.error('การส่งล้มเหลว')
      } finally {
          setPublishing(false)
      }
  }

  async function handleApproveAll() {
      try {
          const result = await approveAllDrafts()
          toast.success(`อนุมัติทั้งหมด ${result.count} รายการ`)
      } catch {
          toast.error('เกิดข้อผิดพลาด')
      }
  }

  async function handleRejectAll() {
      try {
          const result = await rejectAllDrafts()
          toast.success(`ปฏิเสธทั้งหมด ${result.count} รายการ`)
      } catch {
          toast.error('เกิดข้อผิดพลาด')
      }
  }

  async function handlePublishAll() {
      setPublishing(true)
      try {
          const result = await sendApprovedPostsToBuffer()
          toast.success(`ส่งไปยัง Buffer สำเร็จ ${result.successCount} รายการ (ล้มเหลว ${result.failCount} รายการ)`)
      } catch {
          toast.error('เกิดข้อผิดพลาดในการเผยแพร่ทั้งหมด')
      } finally {
          setPublishing(false)
      }
  }

  return (
    <div className="flex flex-col h-[calc(100vh-140px)] -mt-4 animate-in fade-in duration-500">
      {/* 3-Column Workspace */}
      <div className="flex-1 flex overflow-hidden border bg-white rounded-3xl shadow-2xl shadow-gray-200/50">
        
        {/* Column 1: Post List (350px) */}
        <div className="w-[380px] border-r flex flex-col bg-gray-50/30">
          <div className="p-5 border-b bg-white/50 backdrop-blur-sm sticky top-0 z-10 space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="font-black text-gray-900 tracking-tight">คลังโพสต์ ({filteredPosts.length})</h3>
                <div className="flex gap-1">
                    <Button variant="ghost" size="icon-xs" className="rounded-lg h-8 w-8">
                        <Filter className="w-4 h-4 text-gray-400" />
                    </Button>
                </div>
              </div>
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                <Input 
                    placeholder="ค้นหาคอนเทนต์..." 
                    className="pl-10 h-10 bg-white border-gray-200 rounded-xl text-sm focus:ring-blue-500"
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                />
              </div>
              <div className="flex gap-1.5 p-1 bg-gray-100 rounded-xl overflow-x-auto no-scrollbar">
                  {['all', 'draft', 'approved', 'published'].map((s) => (
                      <button
                        key={s}
                        onClick={() => setFilter(s)}
                        className={cn(
                            "px-4 py-1.5 rounded-lg text-[10px] font-bold uppercase tracking-widest transition-all whitespace-nowrap",
                            filter === s ? "bg-white text-blue-600 shadow-sm" : "text-gray-400 hover:text-gray-600"
                        )}
                      >
                          {s === 'all' ? 'ทั้งหมด' : s}
                      </button>
                  ))}
              </div>
          </div>
          <ScrollArea className="flex-1">
            <div className="p-3 space-y-2">
              {filteredPosts.map((post) => (
                <div 
                    key={post.id}
                    onClick={() => setSelectedPost(post)}
                    className={cn(
                        "p-4 rounded-2xl cursor-pointer transition-all border-2 relative group",
                        selectedPost?.id === post.id 
                            ? "bg-white border-blue-500 shadow-lg shadow-blue-50" 
                            : "bg-transparent border-transparent hover:bg-white hover:border-gray-200"
                    )}
                >
                    <div className="flex justify-between items-start mb-2">
                        <StatusBadge status={post.status} className="scale-75 origin-left" />
                        <span className="text-[10px] text-gray-400 font-medium">
                            {new Date(post.created_at).toLocaleDateString()}
                        </span>
                    </div>
                    <h4 className={cn(
                        "text-sm font-bold line-clamp-1 leading-snug",
                        selectedPost?.id === post.id ? "text-blue-600" : "text-gray-700"
                    )}>
                        {post.metadata.title}
                    </h4>
                    <p className="text-xs text-gray-400 line-clamp-2 mt-1 leading-relaxed">
                        {post.metadata.caption}
                    </p>
                    <ChevronRight className={cn(
                        "absolute right-4 top-1/2 -translate-y-1/2 w-4 h-4 transition-all opacity-0 group-hover:opacity-100",
                        selectedPost?.id === post.id ? "text-blue-500 translate-x-0 opacity-100" : "text-gray-300 -translate-x-2"
                    )} />
                </div>
              ))}
              {filteredPosts.length === 0 && (
                  <div className="py-20 text-center space-y-3">
                      <div className="w-12 h-12 bg-gray-100 rounded-2xl flex items-center justify-center mx-auto text-gray-400">
                          <Library className="w-6 h-6" />
                      </div>
                      <p className="text-xs font-bold text-gray-400 uppercase tracking-widest">ไม่พบข้อมูล</p>
                  </div>
              )}
            </div>
          </ScrollArea>
          <div className="p-4 bg-white border-t space-y-2">
              {/* Approve All */}
              <AlertDialog>
                  <AlertDialogTrigger>
                    <Button variant="outline" className="w-full rounded-xl h-10 font-bold text-gray-600 hover:text-green-600 hover:bg-green-50 hover:border-green-100 justify-start px-4">
                        <CheckCheck className="w-4 h-4 mr-2" /> อนุมัติร่างทั้งหมด
                    </Button>
                  </AlertDialogTrigger>
                  <AlertDialogContent className="rounded-3xl">
                      <AlertDialogHeader>
                          <AlertDialogTitle>ยืนยันการอนุมัติทั้งหมด?</AlertDialogTitle>
                          <AlertDialogDescription>ต้องการอนุมัติโพสต์ที่ยังเป็นร่างทั้งหมดในขณะนี้หรือไม่?</AlertDialogDescription>
                      </AlertDialogHeader>
                      <AlertDialogFooter>
                          <AlertDialogCancel className="rounded-xl">ยกเลิก</AlertDialogCancel>
                          <AlertDialogAction onClick={handleApproveAll} className="bg-green-600 hover:bg-green-700 rounded-xl">ยืนยัน</AlertDialogAction>
                      </AlertDialogFooter>
                  </AlertDialogContent>
              </AlertDialog>

              {/* Reject All */}
              <AlertDialog>
                  <AlertDialogTrigger>
                    <Button variant="outline" className="w-full rounded-xl h-10 font-bold text-gray-600 hover:text-rose-600 hover:bg-rose-50 hover:border-rose-100 justify-start px-4">
                        <X className="w-4 h-4 mr-2" /> ปฏิเสธร่างทั้งหมด
                    </Button>
                  </AlertDialogTrigger>
                  <AlertDialogContent className="rounded-3xl">
                      <AlertDialogHeader>
                          <AlertDialogTitle>ยืนยันการปฏิเสธทั้งหมด?</AlertDialogTitle>
                          <AlertDialogDescription>ต้องการปฏิเสธโพสต์ที่ยังเป็นร่างทั้งหมดในขณะนี้หรือไม่?</AlertDialogDescription>
                      </AlertDialogHeader>
                      <AlertDialogFooter>
                          <AlertDialogCancel className="rounded-xl">ยกเลิก</AlertDialogCancel>
                          <AlertDialogAction onClick={handleRejectAll} className="bg-rose-600 hover:bg-rose-700 rounded-xl">ยืนยัน</AlertDialogAction>
                      </AlertDialogFooter>
                  </AlertDialogContent>
              </AlertDialog>

              {/* Publish All */}
              <AlertDialog>
                  <AlertDialogTrigger>
                    <Button variant="outline" className="w-full rounded-xl h-10 font-bold text-gray-600 hover:text-blue-600 hover:bg-blue-50 hover:border-blue-100 justify-start px-4" disabled={!hasBufferKey || publishing}>
                        <Send className="w-4 h-4 mr-2" /> เผยแพร่โพสต์ที่อนุมัติแล้วทั้งหมด
                    </Button>
                  </AlertDialogTrigger>
                  <AlertDialogContent className="rounded-3xl">
                      <AlertDialogHeader>
                          <AlertDialogTitle>ยืนยันการเผยแพร่ทั้งหมด?</AlertDialogTitle>
                          <AlertDialogDescription>ต้องการส่งโพสต์ที่อนุมัติแล้วทั้งหมดไปยัง Buffer ในขณะนี้หรือไม่?</AlertDialogDescription>
                      </AlertDialogHeader>
                      <AlertDialogFooter>
                          <AlertDialogCancel className="rounded-xl">ยกเลิก</AlertDialogCancel>
                          <AlertDialogAction onClick={handlePublishAll} className="bg-blue-600 hover:bg-blue-700 rounded-xl">ยืนยัน</AlertDialogAction>
                      </AlertDialogFooter>
                  </AlertDialogContent>
              </AlertDialog>
          </div>
        </div>

        {/* Column 2: Post Detail & Preview (Flexible) */}
        <div className="flex-1 flex flex-col bg-[#fcfcfc] overflow-hidden">
          {selectedPost ? (
            <ScrollArea className="flex-1">
                <div className="max-w-4xl mx-auto p-10 space-y-12 pb-32">
                    {/* Content Section */}
                    <div className="space-y-6">
                        <div className="flex items-center justify-between">
                            <div className="flex items-center gap-2">
                                <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center text-blue-600">
                                    <MessageSquare className="w-4 h-4" />
                                </div>
                                <h2 className="text-xl font-black text-gray-900 tracking-tight">เนื้อหาคอนเทนต์</h2>
                            </div>
                            <Button variant="outline" size="sm" className="rounded-xl font-bold h-9" onClick={() => setIsEditOpen(true)}>
                                <Edit2 className="w-3.5 h-3.5 mr-1.5" /> แก้ไขเนื้อหา
                            </Button>
                        </div>
                        
                        <div className="space-y-4">
                            <div className="bg-white rounded-3xl p-8 shadow-sm border border-gray-100 space-y-6">
                                <div className="space-y-2">
                                    <span className="text-[10px] font-black uppercase text-blue-600 tracking-widest">หัวข้อ / Hook</span>
                                    <h1 className="text-2xl font-bold text-gray-900 leading-tight">{selectedPost.metadata.title}</h1>
                                </div>
                                <div className="space-y-2">
                                    <span className="text-[10px] font-black uppercase text-blue-600 tracking-widest">Caption</span>
                                    <p className="text-gray-700 text-lg leading-relaxed whitespace-pre-wrap">{selectedPost.metadata.caption}</p>
                                </div>
                                <div className="space-y-2">
                                    <span className="text-[10px] font-black uppercase text-blue-600 tracking-widest">Hashtags</span>
                                    <div className="flex flex-wrap gap-2">
                                        {selectedPost.metadata.hashtags.split(' ').map((tag, i) => (
                                            <Badge key={i} variant="secondary" className="bg-blue-50 text-blue-700 font-bold border-blue-100 py-1 px-3 rounded-lg">
                                                {tag}
                                            </Badge>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Facebook Preview Mockup */}
                    <div className="space-y-8">
                        <div className="flex items-center gap-2">
                            <div className="w-8 h-8 bg-indigo-100 rounded-lg flex items-center justify-center text-indigo-600">
                                <Eye className="w-4 h-4" />
                            </div>
                            <h2 className="text-xl font-black text-gray-900 tracking-tight">จำลองการแสดงผล</h2>
                        </div>

                        <div className="max-w-md mx-auto w-full bg-white rounded-2xl shadow-2xl border border-gray-100 overflow-hidden animate-in zoom-in duration-500">
                             <div className="p-4 flex items-center justify-between">
                                <div className="flex items-center gap-3">
                                    <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center text-white font-bold text-xs shadow-md border-2 border-white">AI</div>
                                    <div>
                                        <div className="text-sm font-bold text-gray-900 hover:underline cursor-pointer">Your Brand</div>
                                        <div className="flex items-center gap-1 text-[10px] text-gray-500">
                                            <span>Just now</span>
                                            <span>•</span>
                                            <Globe className="w-2.5 h-2.5" />
                                        </div>
                                    </div>
                                </div>
                                <MoreHorizontal className="w-5 h-5 text-gray-400" />
                             </div>
                             <div className="px-4 pb-4 space-y-4">
                                <p className="text-sm text-gray-900 leading-snug">
                                    <span className="font-bold block mb-2">{selectedPost.metadata.title}</span>
                                    {selectedPost.metadata.caption}
                                </p>
                                <p className="text-sm text-blue-700 hover:underline font-medium tracking-tight">
                                    {selectedPost.metadata.hashtags}
                                </p>
                             </div>
                             <div className="aspect-video bg-gray-100 flex items-center justify-center border-y">
                                 <span className="text-[10px] font-black text-gray-300 uppercase tracking-widest italic">Mock Image Asset</span>
                             </div>
                             <div className="p-1 px-4 flex items-center justify-between border-b border-gray-100">
                                <div className="flex items-center gap-1 py-2">
                                    <div className="flex -space-x-1">
                                        <div className="w-4 h-4 rounded-full bg-blue-500 border border-white flex items-center justify-center z-20"><ThumbsUp className="w-2.5 h-2.5 text-white fill-current" /></div>
                                        <div className="w-4 h-4 rounded-full bg-red-500 border border-white flex items-center justify-center z-10"><span className="text-[8px] text-white">❤️</span></div>
                                    </div>
                                    <span className="text-[10px] text-gray-500 ml-1 font-bold">142 Likes</span>
                                </div>
                             </div>
                             <div className="grid grid-cols-3 p-1">
                                <button className="flex items-center justify-center gap-2 py-2 text-gray-500 hover:bg-gray-50 rounded-lg text-xs font-bold transition-colors"><ThumbsUp className="w-3.5 h-3.5" /> Like</button>
                                <button className="flex items-center justify-center gap-2 py-2 text-gray-500 hover:bg-gray-50 rounded-lg text-xs font-bold transition-colors"><MessageSquare className="w-3.5 h-3.5" /> Comment</button>
                                <button className="flex items-center justify-center gap-2 py-2 text-gray-500 hover:bg-gray-50 rounded-lg text-xs font-bold transition-colors"><Share2 className="w-3.5 h-3.5" /> Share</button>
                             </div>
                        </div>
                    </div>
                </div>
            </ScrollArea>
          ) : (
            <div className="flex-1 flex items-center justify-center">
                <EmptyState 
                    icon={Library}
                    title="เลือกคอนเทนต์ที่ต้องการตรวจสอบ"
                    description="คลิกเลือกโพสต์จากรายการด้านซ้ายเพื่อดูรายละเอียดและส่งเผยแพร่"
                />
            </div>
          )}
        </div>

        {/* Column 3: Actions & Meta (300px) */}
        <div className="w-[320px] border-l flex flex-col bg-white">
            <div className="p-6 border-b">
                <h3 className="font-black text-gray-900 tracking-tight uppercase text-xs tracking-[0.2em]">Publishing Control</h3>
            </div>
            
            {selectedPost ? (
                <div className="flex-1 flex flex-col p-6 space-y-8 overflow-y-auto">
                    {/* Status Section */}
                    <div className="space-y-4">
                        <div className="flex items-center justify-between">
                            <span className="text-xs font-bold text-gray-400 uppercase tracking-widest">สถานะปัจจุบัน</span>
                            <StatusBadge status={selectedPost.status} />
                        </div>
                        
                        <div className="grid gap-2">
                            {selectedPost.status === 'draft' && (
                                <div className="grid grid-cols-2 gap-2">
                                    <Button 
                                        className="bg-green-600 hover:bg-green-700 rounded-xl font-bold h-11 shadow-lg shadow-green-100 transition-all hover:scale-[1.02]"
                                        onClick={() => handleStatusChange(selectedPost.id, 'approve')}
                                        disabled={!!loading}
                                    >
                                        <Check className="w-4 h-4 mr-2" /> อนุมัติ
                                    </Button>
                                    <Button 
                                        variant="outline" 
                                        className="rounded-xl font-bold h-11 text-red-500 border-red-100 hover:bg-red-50 hover:border-red-200"
                                        onClick={() => handleStatusChange(selectedPost.id, 'reject')}
                                        disabled={!!loading}
                                    >
                                        <X className="w-4 h-4 mr-2" /> ปฏิเสธ
                                    </Button>
                                </div>
                            )}

                            {(selectedPost.status === 'approved' || selectedPost.status === 'failed') && (
                                <Button 
                                    className="bg-blue-600 hover:bg-blue-700 rounded-xl font-bold h-14 shadow-xl shadow-blue-100 text-lg transition-all hover:scale-[1.02]"
                                    onClick={() => handlePublish(selectedPost.id)}
                                    disabled={publishing || !hasBufferKey}
                                >
                                    {publishing ? (
                                        <div className="mr-2 h-5 w-5 animate-spin rounded-full border-2 border-white border-t-transparent" />
                                    ) : <Send className="w-5 h-5 mr-2" />}
                                    ส่งไปยัง Buffer
                                </Button>
                            )}

                            {selectedPost.status === 'published' && (
                                <div className="space-y-4 animate-in fade-in duration-500">
                                    <div className="bg-green-50 border border-green-100 rounded-2xl p-5 text-center">
                                        <div className="w-10 h-10 bg-green-100 text-green-600 rounded-full flex items-center justify-center mx-auto mb-3">
                                            <Check className="w-6 h-6" />
                                        </div>
                                        <p className="text-sm font-bold text-green-800">โพสต์สำเร็จ!</p>
                                        <p className="text-[10px] text-green-600 mt-1">คอนเทนต์ของคุณถูกส่งไปยังคิวเรียบร้อยแล้ว</p>
                                    </div>
                                    {selectedPost.metadata.external_url && (
                                        <a 
                                            href={selectedPost.metadata.external_url} 
                                            target="_blank"
                                            className={cn(buttonVariants({ variant: 'outline' }), "w-full rounded-xl border-gray-200 font-bold h-11")}
                                        >
                                            <ExternalLink className="w-4 h-4 mr-2" /> เปิดดูใน Buffer
                                        </a>
                                    )}
                                </div>
                            )}

                            {selectedPost.status === 'failed' && selectedPost.metadata.last_error && (
                                <div className="bg-red-50 border border-red-100 rounded-2xl p-5 space-y-2">
                                    <div className="flex items-center gap-2 text-red-600">
                                        <AlertCircle className="w-4 h-4" />
                                        <span className="text-xs font-bold uppercase tracking-widest">การส่งล้มเหลว</span>
                                    </div>
                                    <p className="text-[11px] text-red-700 leading-relaxed font-medium">{selectedPost.metadata.last_error}</p>
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Metadata Section */}
                    <div className="space-y-6 pt-8 border-t border-gray-50">
                        <div className="space-y-4">
                            <span className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em]">Post Info</span>
                            <div className="space-y-3">
                                <div className="flex justify-between items-center text-xs">
                                    <span className="text-gray-400 font-medium">Platform</span>
                                    <Badge variant="outline" className="bg-blue-50 text-blue-600 border-blue-100 rounded-lg font-bold capitalize">{selectedPost.metadata.platform}</Badge>
                                </div>
                                <div className="flex justify-between items-center text-xs">
                                    <span className="text-gray-400 font-medium">Angle</span>
                                    <Badge variant="outline" className="rounded-lg font-bold">{selectedPost.metadata.angle_type}</Badge>
                                </div>
                                <div className="flex justify-between items-center text-xs">
                                    <span className="text-gray-400 font-medium">Topic</span>
                                    <span className="text-gray-900 font-bold max-w-[150px] truncate">{selectedPost.metadata.topic || '-'}</span>
                                </div>
                            </div>
                        </div>

                        {!hasBufferKey && (selectedPost.status === 'approved' || selectedPost.status === 'failed') && (
                            <div className="bg-amber-50 border border-amber-100 rounded-2xl p-4 space-y-2">
                                <p className="text-[10px] font-bold text-amber-800 leading-relaxed">
                                    * ยังไม่ได้เชื่อมต่อ Buffer Access Token กรุณาตั้งค่าที่เมนู Integrations ก่อนเผยแพร่
                                </p>
                            </div>
                        )}
                    </div>
                </div>
            ) : (
                <div className="flex-1 flex flex-col items-center justify-center p-10 text-center opacity-30">
                    <Send className="w-12 h-12 text-gray-300 mb-4" />
                    <p className="text-xs font-bold text-gray-400 uppercase tracking-widest">No Post Selected</p>
                </div>
            )}
        </div>
      </div>

      {selectedPost && (
        <EditModal 
            post={selectedPost} 
            isOpen={isEditOpen} 
            onClose={() => setIsEditOpen(false)} 
        />
      )}
    </div>
  )
}
