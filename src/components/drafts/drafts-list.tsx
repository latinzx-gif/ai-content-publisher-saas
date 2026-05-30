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
      <div className="flex-1 flex overflow-hidden border border-slate-200/80 bg-white rounded-3xl shadow-xl shadow-slate-100">
        
        {/* Column 1: Post List (350px) */}
        <div className="w-[350px] border-r border-slate-200/80 flex flex-col bg-slate-50/20 shrink-0">
          <div className="p-4 border-b border-slate-150/80 bg-white/50 backdrop-blur-sm sticky top-0 z-10 space-y-3">
              <div className="flex items-center justify-between">
                <h3 className="text-xs font-black text-slate-800 uppercase tracking-wider">Drafts Repository ({filteredPosts.length})</h3>
                <div className="flex gap-1">
                    <Button variant="ghost" size="icon-xs" className="rounded-lg h-7 w-7">
                        <Filter className="w-3.5 h-3.5 text-slate-400" />
                    </Button>
                </div>
              </div>
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-slate-400" />
                <Input 
                    placeholder="Search posts..." 
                    className="pl-9 h-9 bg-white border-slate-200 focus:border-indigo-500 rounded-xl text-xs"
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                />
              </div>
              <div className="flex gap-1 p-0.5 bg-slate-100/70 rounded-xl overflow-x-auto no-scrollbar">
                  {['all', 'draft', 'approved', 'published'].map((s) => (
                      <button
                        key={s}
                        onClick={() => setFilter(s)}
                        className={cn(
                            "px-3 py-1 rounded-lg text-[9px] font-black uppercase tracking-widest transition-all whitespace-nowrap flex-1 text-center",
                            filter === s ? "bg-white text-indigo-600 shadow-sm" : "text-slate-400 hover:text-slate-655"
                        )}
                      >
                          {s === 'all' ? 'All' : s + 's'}
                      </button>
                  ))}
              </div>
          </div>
          <ScrollArea className="flex-1">
            <div className="p-2 space-y-1.5">
              {filteredPosts.map((post) => (
                <div 
                    key={post.id}
                    onClick={() => setSelectedPost(post)}
                    className={cn(
                        "p-3.5 rounded-2xl cursor-pointer transition-all border relative group",
                        selectedPost?.id === post.id 
                            ? "bg-slate-50/50 border-slate-300/80 shadow-sm" 
                            : "bg-transparent border-transparent hover:bg-slate-50/20 hover:border-slate-200/50"
                    )}
                >
                    <div className="flex justify-between items-center mb-1.5">
                        <StatusBadge status={post.status} className="scale-75 origin-left" />
                        <span className="text-[9px] text-slate-400 font-bold uppercase tracking-wider">
                            {new Date(post.created_at).toLocaleDateString()}
                        </span>
                    </div>
                    <h4 className={cn(
                        "text-xs font-bold line-clamp-1 leading-snug",
                        selectedPost?.id === post.id ? "text-indigo-650" : "text-slate-700"
                    )}>
                        {post.metadata.title}
                    </h4>
                    <p className="text-[10px] text-slate-400 line-clamp-2 mt-1 leading-relaxed">
                        {post.metadata.caption}
                    </p>
                    <ChevronRight className={cn(
                        "absolute right-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 transition-all opacity-0 group-hover:opacity-100",
                        selectedPost?.id === post.id ? "text-indigo-500 translate-x-0 opacity-100" : "text-slate-300 -translate-x-1"
                    )} />
                </div>
              ))}
              {filteredPosts.length === 0 && (
                  <div className="py-20 text-center space-y-2">
                      <div className="w-10 h-10 bg-slate-50 rounded-xl flex items-center justify-center mx-auto text-slate-400 border border-slate-100">
                          <Library className="w-4 h-4" />
                      </div>
                      <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest">No drafts found</p>
                  </div>
              )}
            </div>
          </ScrollArea>
          <div className="p-3 bg-white border-t border-slate-150/80 space-y-1.5">
              {/* Approve All */}
              <AlertDialog>
                  <AlertDialogTrigger className="w-full">
                    <Button variant="outline" className="w-full rounded-xl h-9 font-bold text-xs text-slate-650 hover:text-emerald-650 hover:bg-emerald-50 hover:border-emerald-100 justify-start px-3.5 border-slate-200">
                        <CheckCheck className="w-3.5 h-3.5 mr-2 text-slate-450" /> Approve All Drafts
                    </Button>
                  </AlertDialogTrigger>
                  <AlertDialogContent className="rounded-2xl border-slate-200">
                      <AlertDialogHeader>
                          <AlertDialogTitle className="text-sm font-black text-slate-900">Confirm Approve All?</AlertDialogTitle>
                          <AlertDialogDescription className="text-xs font-semibold text-slate-450">Are you sure you want to approve all current post drafts in this workspace?</AlertDialogDescription>
                      </AlertDialogHeader>
                      <AlertDialogFooter>
                          <AlertDialogCancel className="rounded-xl text-xs h-9">Cancel</AlertDialogCancel>
                          <AlertDialogAction onClick={handleApproveAll} className="bg-emerald-600 hover:bg-emerald-700 rounded-xl text-xs h-9">Approve All</AlertDialogAction>
                      </AlertDialogFooter>
                  </AlertDialogContent>
              </AlertDialog>

              {/* Reject All */}
              <AlertDialog>
                  <AlertDialogTrigger className="w-full">
                    <Button variant="outline" className="w-full rounded-xl h-9 font-bold text-xs text-slate-655 hover:text-rose-650 hover:bg-rose-50 hover:border-rose-100 justify-start px-3.5 border-slate-200">
                        <X className="w-3.5 h-3.5 mr-2 text-slate-450" /> Reject All Drafts
                    </Button>
                  </AlertDialogTrigger>
                  <AlertDialogContent className="rounded-2xl border-slate-200">
                      <AlertDialogHeader>
                          <AlertDialogTitle className="text-sm font-black text-slate-900">Confirm Reject All?</AlertDialogTitle>
                          <AlertDialogDescription className="text-xs font-semibold text-slate-450">Are you sure you want to reject all current post drafts in this workspace?</AlertDialogDescription>
                      </AlertDialogHeader>
                      <AlertDialogFooter>
                          <AlertDialogCancel className="rounded-xl text-xs h-9">Cancel</AlertDialogCancel>
                          <AlertDialogAction onClick={handleRejectAll} className="bg-rose-600 hover:bg-rose-700 rounded-xl text-xs h-9">Reject All</AlertDialogAction>
                      </AlertDialogFooter>
                  </AlertDialogContent>
              </AlertDialog>

              {/* Publish All */}
              <AlertDialog>
                  <AlertDialogTrigger className="w-full" disabled={!hasBufferKey || publishing}>
                    <Button variant="outline" className="w-full rounded-xl h-9 font-bold text-xs text-slate-655 hover:text-indigo-650 hover:bg-indigo-50 hover:border-indigo-150 justify-start px-3.5 border-slate-200" disabled={!hasBufferKey || publishing}>
                        <Send className="w-3.5 h-3.5 mr-2 text-slate-450" /> Publish All Approved
                    </Button>
                  </AlertDialogTrigger>
                  <AlertDialogContent className="rounded-2xl border-slate-200">
                      <AlertDialogHeader>
                          <AlertDialogTitle className="text-sm font-black text-slate-900">Confirm Bulk Publish?</AlertDialogTitle>
                          <AlertDialogDescription className="text-xs font-semibold text-slate-450">This will dispatch all approved posts directly to your connected Buffer publishing channels. Continue?</AlertDialogDescription>
                      </AlertDialogHeader>
                      <AlertDialogFooter>
                          <AlertDialogCancel className="rounded-xl text-xs h-9">Cancel</AlertDialogCancel>
                          <AlertDialogAction onClick={handlePublishAll} className="bg-indigo-600 hover:bg-indigo-700 rounded-xl text-xs h-9">Publish All</AlertDialogAction>
                      </AlertDialogFooter>
                  </AlertDialogContent>
              </AlertDialog>
          </div>
        </div>

        {/* Column 2: Post Detail & Preview (Flexible) */}
        <div className="flex-1 flex flex-col bg-[#FDFDFD] overflow-hidden">
          {selectedPost ? (
            <ScrollArea className="flex-1">
                <div className="max-w-3xl mx-auto p-8 space-y-10 pb-32">
                    {/* Content Section */}
                    <div className="space-y-5 text-left">
                        <div className="flex items-center justify-between">
                            <div className="flex items-center gap-2">
                                <div className="w-7 h-7 bg-indigo-50 rounded-lg flex items-center justify-center text-indigo-650">
                                    <MessageSquare className="w-3.5 h-3.5" />
                                </div>
                                <h2 className="text-sm font-black text-slate-800 uppercase tracking-wider">Post Editor</h2>
                            </div>
                            <Button variant="outline" size="xs" className="rounded-lg font-bold h-8 border-slate-200" onClick={() => setIsEditOpen(true)}>
                                <Edit2 className="w-3 h-3 mr-1.5" /> Edit Draft
                            </Button>
                        </div>
                        
                        <div className="space-y-4">
                            <div className="bg-white rounded-2xl p-6 shadow-[0_2px_12px_rgba(15,23,42,0.01)] border border-slate-150/70 space-y-5">
                                <div className="space-y-1">
                                    <span className="text-[8px] font-black uppercase text-indigo-600 tracking-widest">Headline / Hook</span>
                                    <h1 className="text-base font-bold text-slate-900 leading-snug">{selectedPost.metadata.title}</h1>
                                </div>
                                <div className="space-y-1">
                                    <span className="text-[8px] font-black uppercase text-indigo-600 tracking-widest">Caption</span>
                                    <p className="text-slate-700 text-xs leading-relaxed whitespace-pre-wrap font-medium">{selectedPost.metadata.caption}</p>
                                </div>
                                <div className="space-y-1">
                                    <span className="text-[8px] font-black uppercase text-indigo-600 tracking-widest">Hashtags</span>
                                    <div className="flex flex-wrap gap-1.5 pt-0.5">
                                        {selectedPost.metadata.hashtags.split(' ').map((tag, i) => (
                                            <Badge key={i} variant="secondary" className="bg-slate-100 text-slate-655 font-bold border-slate-200/50 py-0.5 px-2 rounded-lg text-[9px]">
                                                {tag}
                                            </Badge>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Preview Mockup */}
                    <div className="space-y-5 text-left border-t border-slate-100 pt-8">
                        <div className="flex items-center gap-2">
                            <div className="w-7 h-7 bg-indigo-50 rounded-lg flex items-center justify-center text-indigo-600">
                                <Eye className="w-3.5 h-3.5" />
                            </div>
                            <h2 className="text-sm font-black text-slate-800 uppercase tracking-wider">Platform Preview Feed</h2>
                        </div>

                        <div className="max-w-md mx-auto w-full bg-white rounded-xl shadow-lg border border-slate-200/60 overflow-hidden animate-in zoom-in duration-300">
                             <div className="p-3.5 flex items-center justify-between">
                                <div className="flex items-center gap-2.5">
                                    <div className="w-8 h-8 rounded-full bg-gradient-to-br from-indigo-500 to-indigo-650 flex items-center justify-center text-white font-black text-[10px]">OS</div>
                                    <div>
                                        <div className="text-xs font-bold text-slate-800 hover:underline cursor-pointer">Your Brand Workspace</div>
                                        <div className="flex items-center gap-1 text-[9px] text-slate-400 font-semibold">
                                            <span>Sponsored</span>
                                            <span>•</span>
                                            <Globe className="w-2 h-2" />
                                        </div>
                                    </div>
                                </div>
                                <MoreHorizontal className="w-4 h-4 text-slate-400" />
                             </div>
                             <div className="px-3.5 pb-3.5 space-y-2">
                                <p className="text-xs text-slate-800 leading-relaxed">
                                    <span className="font-bold block mb-1.5 text-xs text-slate-900">{selectedPost.metadata.title}</span>
                                    {selectedPost.metadata.caption}
                                </p>
                                <p className="text-xs text-indigo-600 hover:underline font-bold tracking-tight">
                                    {selectedPost.metadata.hashtags}
                                </p>
                             </div>
                             <div className="aspect-[1.91/1] bg-slate-50 flex items-center justify-center border-y border-slate-100">
                                 <span className="text-[9px] font-black text-slate-300 uppercase tracking-widest italic">Mock Workspace Media Attachment</span>
                             </div>
                             <div className="p-1 px-3.5 flex items-center justify-between border-b border-slate-100">
                                <div className="flex items-center gap-1 py-1.5">
                                    <div className="flex -space-x-1">
                                        <div className="w-3.5 h-3.5 rounded-full bg-indigo-550 border border-white flex items-center justify-center z-20"><ThumbsUp className="w-2 h-2 text-white fill-current" /></div>
                                        <div className="w-3.5 h-3.5 rounded-full bg-rose-500 border border-white flex items-center justify-center z-10"><span className="text-[7px] text-white">❤️</span></div>
                                    </div>
                                    <span className="text-[9px] text-slate-400 ml-1 font-bold">142 reactions</span>
                                </div>
                             </div>
                             <div className="grid grid-cols-3 p-0.5 bg-slate-50/50">
                                <button className="flex items-center justify-center gap-1.5 py-1.5 text-slate-450 hover:bg-slate-100/50 rounded-lg text-[10px] font-bold transition-all"><ThumbsUp className="w-3 h-3" /> Like</button>
                                <button className="flex items-center justify-center gap-1.5 py-1.5 text-slate-450 hover:bg-slate-100/50 rounded-lg text-[10px] font-bold transition-all"><MessageSquare className="w-3 h-3" /> Comment</button>
                                <button className="flex items-center justify-center gap-1.5 py-1.5 text-slate-455 hover:bg-slate-100/50 rounded-lg text-[10px] font-bold transition-all"><Share2 className="w-3 h-3" /> Share</button>
                             </div>
                        </div>
                    </div>
                </div>
            </ScrollArea>
          ) : (
            <div className="flex-1 flex items-center justify-center">
                <EmptyState 
                    icon={Library}
                    title="Select a post draft to edit"
                    description="Choose a content piece from the repository side-panel to edit details, view social preview formats, and publish."
                />
            </div>
          )}
        </div>
            {/* Column 3: Actions & Meta (280px) */}
        <div className="w-[280px] border-l border-slate-200/80 flex flex-col bg-slate-50/10 shrink-0">
            <div className="p-4 border-b border-slate-100/80">
                <h3 className="text-[9px] font-black uppercase tracking-[0.2em] text-slate-400">Publishing Control</h3>
            </div>
            
            {selectedPost ? (
                <div className="flex-1 flex flex-col p-4 space-y-6 overflow-y-auto text-left">
                    {/* Status Section */}
                    <div className="space-y-3">
                        <div className="flex items-center justify-between">
                            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Current Pipeline Status</span>
                            <StatusBadge status={selectedPost.status} />
                        </div>
                        
                        <div className="grid gap-2">
                            {selectedPost.status === 'draft' && (
                                <div className="grid grid-cols-2 gap-2">
                                    <Button 
                                        className="bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl font-bold h-10 shadow-sm transition-all hover:scale-[1.02] text-xs"
                                        onClick={() => handleStatusChange(selectedPost.id, 'approve')}
                                        disabled={!!loading}
                                    >
                                        <Check className="w-3.5 h-3.5 mr-1" /> Approve
                                    </Button>
                                    <Button 
                                        variant="outline" 
                                        className="rounded-xl font-bold h-10 text-xs text-rose-600 border-rose-100 hover:bg-rose-50 hover:border-rose-200"
                                        onClick={() => handleStatusChange(selectedPost.id, 'reject')}
                                        disabled={!!loading}
                                    >
                                        <X className="w-3.5 h-3.5 mr-1" /> Reject
                                    </Button>
                                </div>
                            )}

                            {(selectedPost.status === 'approved' || selectedPost.status === 'failed') && (
                                <Button 
                                    className="bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl font-black h-11 shadow-md text-xs transition-all hover:scale-[1.02]"
                                    onClick={() => handlePublish(selectedPost.id)}
                                    disabled={publishing || !hasBufferKey}
                                >
                                    {publishing ? (
                                        <div className="mr-2 h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
                                    ) : <Send className="w-4 h-4 mr-1.5" />}
                                    Publish via Buffer
                                </Button>
                            )}

                            {selectedPost.status === 'published' && (
                                <div className="space-y-4 animate-in fade-in duration-500">
                                    <div className="bg-emerald-50/50 border border-emerald-100/80 rounded-2xl p-4 text-center">
                                        <div className="w-8 h-8 bg-emerald-100 text-emerald-650 rounded-full flex items-center justify-center mx-auto mb-2">
                                            <Check className="w-4 h-4" />
                                        </div>
                                        <p className="text-xs font-bold text-emerald-800">Dispatched!</p>
                                        <p className="text-[10px] text-emerald-600 mt-1">Post successfully queued in your Buffer schedule.</p>
                                    </div>
                                    {selectedPost.metadata.external_url && (
                                        <a 
                                            href={selectedPost.metadata.external_url} 
                                            target="_blank"
                                            className={cn(buttonVariants({ variant: 'outline' }), "w-full rounded-xl border-slate-200 font-bold h-10 text-xs")}
                                        >
                                            <ExternalLink className="w-3.5 h-3.5 mr-1.5" /> Open Buffer Panel
                                        </a>
                                    )}
                                </div>
                            )}

                            {selectedPost.status === 'failed' && selectedPost.metadata.last_error && (
                                <div className="bg-rose-50/50 border border-rose-100 rounded-2xl p-4 space-y-1.5">
                                    <div className="flex items-center gap-1.5 text-rose-600">
                                        <AlertCircle className="w-3.5 h-3.5" />
                                        <span className="text-[9px] font-black uppercase tracking-wider">Dispatch Failed</span>
                                    </div>
                                    <p className="text-[10px] text-rose-700 leading-relaxed font-semibold">{selectedPost.metadata.last_error}</p>
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Metadata Section */}
                    <div className="space-y-5 pt-5 border-t border-slate-100">
                        <div className="space-y-3">
                            <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest">Post Info</span>
                            <div className="space-y-2.5">
                                <div className="flex justify-between items-center text-xs">
                                    <span className="text-slate-400 font-semibold">Platform</span>
                                    <Badge variant="outline" className="bg-indigo-50 text-indigo-700 border-indigo-100 rounded-lg font-bold capitalize text-[10px] py-0 px-2">{selectedPost.metadata.platform}</Badge>
                                </div>
                                <div className="flex justify-between items-center text-xs">
                                    <span className="text-slate-400 font-semibold">Angle</span>
                                    <Badge variant="outline" className="rounded-lg font-bold text-[10px] py-0 px-2">{selectedPost.metadata.angle_type}</Badge>
                                </div>
                                <div className="flex justify-between items-center text-xs">
                                    <span className="text-slate-455 font-semibold">Topic</span>
                                    <span className="text-slate-800 font-bold max-w-[120px] truncate">{selectedPost.metadata.topic || '-'}</span>
                                </div>
                            </div>
                        </div>

                        {!hasBufferKey && (selectedPost.status === 'approved' || selectedPost.status === 'failed') && (
                            <div className="bg-amber-50/50 border border-amber-100 rounded-2xl p-3.5">
                                <p className="text-[9px] font-bold text-amber-800 leading-relaxed">
                                    * Buffer credentials not linked. Configure this channel under Settings before dispatching.
                                </p>
                            </div>
                        )}
                    </div>
                </div>
            ) : (
                <div className="flex-1 flex flex-col items-center justify-center p-8 text-center opacity-30">
                    <Send className="w-10 h-10 text-slate-300 mb-3" />
                    <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest">No Post Selected</p>
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
