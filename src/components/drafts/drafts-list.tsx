'use client';

import { useState, useEffect } from 'react';
import { Post } from '@/types';
import { cn } from '@/lib/utils';
import { 
  Search, 
  Filter, 
  ChevronRight, 
  Edit2, 
  Check, 
  X, 
  Send, 
  Calendar as CalendarIcon,
  MessageSquare,
  MoreHorizontal,
  ChevronDown
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { approvePost, rejectPost, approveAllDrafts } from '@/actions/drafts';
import { sendPostToBuffer } from '@/actions/publish';
import { toast } from 'sonner';
import { EditModal } from '@/components/drafts/edit-modal';
import { useLanguage } from '@/components/providers/language-provider';

const MOCK_REVIEW_POSTS: Post[] = [
  {
    id: 'mock-1',
    user_id: '1',
    workflow_id: null,
    buffer_post_id: null,
    updated_at: '2026-06-01T00:00:00Z',
    content: 'อัปเดตใหม่กฎหมายแรงงาน 2025: ข้อตกลงการจ้างงานและการชดเชยที่ผู้ประกอบการต้องเตรียมรับมือ เพื่อป้องกันความเสี่ยงด้านคดีความ',
    status: 'draft',
    created_at: '2026-06-01T00:00:00Z',
    metadata: {
      title: 'Labor Law: 2025 Contract Checklist',
      topic: 'Labour Law Update',
      platform: 'LinkedIn',
      caption: '',
      hashtags: '',
      angle_type: ''
    }
  },
  {
    id: 'mock-2',
    user_id: '1',
    workflow_id: null,
    buffer_post_id: null,
    updated_at: '2026-06-01T00:00:00Z',
    content: 'วางแผนภาษีบริษัทแบบถูกวิธีช่วยให้ธุรกิจสร้างแต้มต่อและประหยัดงบได้มหาศาล คำปรึกษาภาษีสำหรับนิติบุคคลจากทีมผู้เชี่ยวชาญ',
    status: 'draft',
    created_at: '2026-06-01T00:00:00Z',
    metadata: {
      title: 'Tax Strategy: Corporate Optimization',
      topic: 'Q2 Tax Advisory Series',
      platform: 'Facebook',
      caption: '',
      hashtags: '',
      angle_type: ''
    }
  },
  {
    id: 'mock-3',
    user_id: '1',
    workflow_id: null,
    buffer_post_id: null,
    updated_at: '2026-06-01T00:00:00Z',
    content: 'PDPA ไม่ใช่เรื่องยาก: เช็คลิสต์ 5 ส่วนการจัดเก็บข้อมูลลูกค้าเพื่อความถูกต้อง และหลีกเลี่ยงโทษปรับสูงสุดตามกฎหมายใหม่',
    status: 'draft',
    created_at: '2026-06-01T00:00:00Z',
    metadata: {
      title: 'PDPA: 5 Core Customer Data Elements',
      topic: 'PDPA Compliance Hub',
      platform: 'LinkedIn',
      caption: '',
      hashtags: '',
      angle_type: ''
    }
  },
  {
    id: 'mock-4',
    user_id: '1',
    workflow_id: null,
    buffer_post_id: null,
    updated_at: '2026-06-01T00:00:00Z',
    content: 'ความคุ้มครองเครื่องหมายการค้า: ทรัพย์สินทางปัญญาที่คุณต้องปกป้องตั้งแต่ก้าวแรกที่ทำธุรกิจ ป้องกันไม่ให้ชื่อร้านถูกเลียนแบบ',
    status: 'draft',
    created_at: '2026-06-01T00:00:00Z',
    metadata: {
      title: 'IP Protection: Trademark Registration',
      topic: 'SME Legal Protection Toolkit',
      platform: 'Instagram',
      caption: '',
      hashtags: '',
      angle_type: ''
    }
  },
  {
    id: 'mock-5',
    user_id: '1',
    workflow_id: null,
    buffer_post_id: null,
    updated_at: '2026-06-01T00:00:00Z',
    content: 'ทำความเข้าใจข้อตกลงการไม่เปิดเผยความลับ (NDA) ปากกาตัวแรกที่สำคัญที่สุดในการร่วมทุนทางธุรกิจหรือการจัดจ้างภายนอก',
    status: 'approved',
    created_at: '2026-06-01T00:00:00Z',
    metadata: {
      title: 'Business Setup: NDA Agreements 101',
      topic: 'Corporate Restructuring FAQ',
      platform: 'Website',
      caption: '',
      hashtags: '',
      angle_type: ''
    }
  },
  {
    id: 'mock-6',
    user_id: '1',
    workflow_id: null,
    buffer_post_id: null,
    updated_at: '2026-06-01T00:00:00Z',
    content: 'เช็คลิสต์มติคณะกรรมการประจำปีสำหรับบริษัทจำกัด การรายงานและลงทะเบียนให้ถูกต้องตามกรอบเวลาตามพระราชบัญญัติแพ่งและพาณิชย์',
    status: 'approved',
    created_at: '2026-06-01T00:00:00Z',
    metadata: {
      title: 'Compliance: Annual Board Resolutions',
      topic: 'SME Legal Protection Toolkit',
      platform: 'LinkedIn',
      caption: '',
      hashtags: '',
      angle_type: ''
    }
  }
];

interface DraftsListProps {
  initialPosts: Post[];
  hasBufferKey: boolean;
}

export function DraftsList({ initialPosts, hasBufferKey }: DraftsListProps) {
  const { t, currentLanguage } = useLanguage();
  const [selectedPost, setSelectedPost] = useState<Post | null>(null);
  const [posts, setPosts] = useState<Post[]>(initialPosts && initialPosts.length > 0 ? initialPosts : MOCK_REVIEW_POSTS);
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [publishing, setPublishing] = useState(false);
  const [loadingId, setLoadingId] = useState<string | null>(null);
  
  // Board Notes State
  const [boardNote, setBoardNote] = useState('');

  // Dropdown Filter States
  const [campaignFilter, setCampaignFilter] = useState('All');
  const [platformFilter, setPlatformFilter] = useState('All');
  const [languageFilter, setLanguageFilter] = useState('All');
  const [statusFilter, setStatusFilter] = useState('All');
  const [priorityFilter, setPriorityFilter] = useState('All');

  useEffect(() => {
    if (initialPosts && initialPosts.length > 0) {
      setPosts(initialPosts);
    }
  }, [initialPosts]);

  async function handleStatusChange(id: string, action: 'approve' | 'reject') {
    setLoadingId(id);
    try {
      if (action === 'approve') {
        await approvePost(id);
        setPosts(posts.map(p => p.id === id ? { ...p, status: 'approved' } : p));
        toast.success('Approved successfully');
      } else {
        await rejectPost(id);
        setPosts(posts.map(p => p.id === id ? { ...p, status: 'rejected' } : p));
        toast.success('Rejected successfully');
      }
    } catch {
      toast.error('Failed to update status');
    } finally {
      setLoadingId(null);
    }
  }

  async function handlePublish(id: string) {
    setPublishing(true);
    try {
      const result = await sendPostToBuffer(id);
      setPosts(posts.map(p => p.id === id ? { ...p, status: 'published' } : p));
      toast.success('Dispatched to Buffer successfully!');
      if (result.externalUrl) window.open(result.externalUrl, '_blank');
    } catch {
      toast.error('Failed to publish');
    } finally {
      setPublishing(false);
    }
  }

  // Segment posts into mockup Kanban columns
  const draftPosts = posts.filter((p, i) => p.status === 'draft' && i % 2 === 0);
  const inReviewPosts = posts.filter((p, i) => p.status === 'draft' && i % 2 === 1);
  const approvedPosts = posts.filter((p, i) => p.status === 'approved' && i % 2 === 0);
  const scheduledPosts = posts.filter((p, i) => (p.status === 'approved' && i % 2 === 1) || p.status === 'published');

  const renderCard = (post: Post, isScheduled = false) => {
    const meta = post.metadata || {};
    return (
      <div 
        key={post.id}
        onClick={() => {
          setSelectedPost(post);
          setIsEditOpen(true);
        }}
        className="bg-white dark:bg-slate-900 border border-[#E6DFD5] dark:border-slate-800 rounded-xl p-4 space-y-4 hover:border-[#967F5C] transition-all cursor-pointer shadow-[0_2px_6px_rgba(30,29,27,0.01)] text-left relative group"
      >
        <div className="flex justify-between items-start">
          <h4 className="text-xs font-bold text-[#1E1D1B] dark:text-[#EBE7E0] leading-snug line-clamp-2">
            {meta.title || post.content.split('\n')[0] || 'Untitled Draft'}
          </h4>
          <MoreHorizontal className="w-3.5 h-3.5 text-[#7C756C] opacity-0 group-hover:opacity-100 transition-opacity shrink-0 ml-2" />
        </div>
        
        {/* Card Metadata (TH / EN, platforms) */}
        <div className="flex items-center gap-2 text-[9px] font-bold">
          <div className="flex gap-0.5">
            <span className="px-1 py-0.2 bg-[#FAF8F5] border border-[#E6DFD5] rounded text-[#7C756C]">TH</span>
            <span className="px-1 py-0.2 bg-[#FAF8F5] border border-[#E6DFD5] rounded text-[#7C756C]">EN</span>
          </div>
          <span className="text-[#7C756C]">•</span>
          <span className="text-[#7C756C] capitalize truncate max-w-[80px]">{meta.platform || 'LinkedIn'}</span>
        </div>

        {/* Scheduled date rendering if column is Scheduled */}
        {isScheduled && (
          <div className="flex items-center gap-1.5 text-[9px] font-bold text-[#967F5C] bg-[#FAF8F5] p-1.5 rounded-lg border border-[#E6DFD5]/50">
            <CalendarIcon className="w-3 h-3" />
            <span>May 20, 2025 • 09:00</span>
          </div>
        )}

        {/* Ready for publish indicator if approved */}
        {post.status === 'approved' && !isScheduled && (
          <div className="flex items-center gap-1.5 text-[9px] font-bold text-emerald-700 bg-emerald-50 p-1.5 rounded-lg border border-emerald-100">
            <Check className="w-3 h-3" />
            <span>Ready for publish</span>
          </div>
        )}

        {/* Checklist Dots (Legal, Accounting, Brand) */}
        <div className="flex items-center justify-between pt-3 border-t border-[#E6DFD5]/50 dark:border-slate-800/80">
          <div className="flex items-center gap-2.5 text-[9px] font-semibold text-[#7C756C]">
            <span className="flex items-center gap-1"><span className="w-1.5 h-1.5 rounded-full bg-emerald-500" /> Legal</span>
            <span className="flex items-center gap-1"><span className="w-1.5 h-1.5 rounded-full bg-blue-500" /> Accounting</span>
            <span className="flex items-center gap-1"><span className="w-1.5 h-1.5 rounded-full bg-emerald-500" /> Brand</span>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="flex-1 bg-[#FAF8F5] dark:bg-slate-950 min-h-screen text-[#1E1D1B] dark:text-[#EBE7E0] p-8 flex flex-col space-y-6">
      
      {/* Header and Title */}
      <div className="space-y-1 text-left pb-3 border-b border-[#E6DFD5] dark:border-slate-800">
        <h2 className="text-3xl font-serif font-medium tracking-wide uppercase text-[#1E1D1B] dark:text-[#EBE7E0]">
          Review Board
        </h2>
        <p className="text-xs text-[#7C756C] dark:text-slate-400">
          Move content through legal, brand, and publishing review with clarity.
        </p>
      </div>

      {/* Filters Row */}
      <div className="flex flex-wrap items-center gap-3.5 bg-white dark:bg-slate-900 border border-[#E6DFD5] dark:border-slate-800 p-3 rounded-xl text-xs shadow-[0_2px_6px_rgba(30,29,27,0.01)] text-left">
        {[
          { label: 'Campaign', val: campaignFilter, set: setCampaignFilter },
          { label: 'Platform', val: platformFilter, set: setPlatformFilter },
          { label: 'Language', val: languageFilter, set: setLanguageFilter },
          { label: 'Status', val: statusFilter, set: setStatusFilter },
          { label: 'Priority', val: priorityFilter, set: setPriorityFilter }
        ].map((f) => (
          <div key={f.label} className="flex flex-col gap-1 min-w-[100px]">
            <span className="text-[9px] uppercase tracking-wider font-bold text-[#7C756C]">{f.label}</span>
            <div className="h-8 border border-[#E6DFD5] rounded px-2 flex items-center justify-between cursor-pointer hover:bg-slate-50/50">
              <span className="font-semibold text-[11px]">{f.val}</span>
              <ChevronDown className="w-3 h-3 text-[#7C756C]" />
            </div>
          </div>
        ))}
        
        <div className="ml-auto">
          <Button variant="outline" className="h-8 text-[10px] font-bold border-[#E6DFD5]">
            More filters
          </Button>
        </div>
      </div>

      {/* Main Workspace (Kanban columns + right notes sidebar) */}
      <div className="flex-1 grid grid-cols-1 xl:grid-cols-4 gap-6 items-start">
        
        {/* Kanban Board Container (3/4 Grid) */}
        <div className="xl:col-span-3 grid grid-cols-1 md:grid-cols-4 gap-4 items-start">
          
          {/* Column 1: DRAFT */}
          <div className="bg-[#F3EFEA]/40 dark:bg-slate-900/40 border border-[#E6DFD5] dark:border-slate-800 rounded-xl p-3.5 space-y-3.5 min-h-[500px]">
            <div className="flex items-center justify-between pb-1 border-b border-[#E6DFD5] dark:border-slate-800">
              <span className="text-[10px] font-bold uppercase tracking-wider text-[#1E1D1B] dark:text-[#EBE7E0]">Draft</span>
              <span className="text-[9px] font-bold bg-[#FAF8F5] border border-[#E6DFD5] px-1.5 py-0.2 rounded-full text-[#7C756C]">
                {draftPosts.length}
              </span>
            </div>
            <div className="space-y-3">
              {draftPosts.map(post => renderCard(post))}
              <Button 
                variant="outline" 
                className="w-full text-center border-dashed border-[#E6DFD5] text-[10px] font-bold h-9 hover:bg-white rounded-lg"
              >
                + Add content
              </Button>
            </div>
          </div>

          {/* Column 2: IN REVIEW */}
          <div className="bg-[#F3EFEA]/40 dark:bg-slate-900/40 border border-[#E6DFD5] dark:border-slate-800 rounded-xl p-3.5 space-y-3.5 min-h-[500px]">
            <div className="flex items-center justify-between pb-1 border-b border-[#E6DFD5] dark:border-slate-800">
              <span className="text-[10px] font-bold uppercase tracking-wider text-[#1E1D1B] dark:text-[#EBE7E0]">In Review</span>
              <span className="text-[9px] font-bold bg-[#FAF8F5] border border-[#E6DFD5] px-1.5 py-0.2 rounded-full text-[#7C756C]">
                {inReviewPosts.length}
              </span>
            </div>
            <div className="space-y-3">
              {inReviewPosts.map(post => renderCard(post))}
              <Button 
                variant="outline" 
                className="w-full text-center border-dashed border-[#E6DFD5] text-[10px] font-bold h-9 hover:bg-white rounded-lg"
              >
                + Add content
              </Button>
            </div>
          </div>

          {/* Column 3: APPROVED */}
          <div className="bg-[#F3EFEA]/40 dark:bg-slate-900/40 border border-[#E6DFD5] dark:border-slate-800 rounded-xl p-3.5 space-y-3.5 min-h-[500px]">
            <div className="flex items-center justify-between pb-1 border-b border-[#E6DFD5] dark:border-slate-800">
              <span className="text-[10px] font-bold uppercase tracking-wider text-[#1E1D1B] dark:text-[#EBE7E0]">Approved</span>
              <span className="text-[9px] font-bold bg-[#FAF8F5] border border-[#E6DFD5] px-1.5 py-0.2 rounded-full text-[#7C756C]">
                {approvedPosts.length}
              </span>
            </div>
            <div className="space-y-3">
              {approvedPosts.map(post => renderCard(post))}
              <Button 
                variant="outline" 
                className="w-full text-center border-dashed border-[#E6DFD5] text-[10px] font-bold h-9 hover:bg-white rounded-lg"
              >
                + Add content
              </Button>
            </div>
          </div>

          {/* Column 4: SCHEDULED */}
          <div className="bg-[#F3EFEA]/40 dark:bg-slate-900/40 border border-[#E6DFD5] dark:border-slate-800 rounded-xl p-3.5 space-y-3.5 min-h-[500px]">
            <div className="flex items-center justify-between pb-1 border-b border-[#E6DFD5] dark:border-slate-800">
              <span className="text-[10px] font-bold uppercase tracking-wider text-[#1E1D1B] dark:text-[#EBE7E0]">Scheduled</span>
              <span className="text-[9px] font-bold bg-[#FAF8F5] border border-[#E6DFD5] px-1.5 py-0.2 rounded-full text-[#7C756C]">
                {scheduledPosts.length}
              </span>
            </div>
            <div className="space-y-3">
              {scheduledPosts.map(post => renderCard(post, true))}
              <Button 
                variant="outline" 
                className="w-full text-center border-dashed border-[#E6DFD5] text-[10px] font-bold h-9 hover:bg-white rounded-lg"
              >
                + Add content
              </Button>
            </div>
          </div>

        </div>

        {/* Right Sidebar (1/4 Grid) */}
        <div className="space-y-6 text-left">
          
          {/* Review Notes */}
          <div className="border border-[#E6DFD5] dark:border-slate-800 bg-white dark:bg-slate-900 rounded-xl p-5 space-y-4 shadow-[0_2px_8px_rgba(30,29,27,0.02)]">
            <span className="text-[9px] uppercase tracking-widest text-[#7C756C] font-bold block">Review Notes</span>
            <textarea 
              value={boardNote}
              onChange={(e) => setBoardNote(e.target.value)}
              placeholder="Add a note for this board..."
              rows={4}
              className="w-full text-xs rounded-lg border border-[#E6DFD5] dark:border-slate-700 p-3 bg-white dark:bg-slate-900 text-[#1E1D1B] dark:text-[#EBE7E0] outline-none resize-none font-medium leading-relaxed"
            />
            <div className="flex justify-end">
              <Button 
                onClick={() => toast.success('Note saved')}
                className="bg-[#1E1D1B] text-white dark:bg-[#EBE7E0] dark:text-[#1E1D1B] text-[10px] font-bold h-8 rounded px-4"
              >
                Save note
              </Button>
            </div>
          </div>

          {/* Approval Rules */}
          <div className="border border-[#E6DFD5] dark:border-slate-800 bg-white dark:bg-slate-900 rounded-xl p-5 space-y-4 shadow-[0_2px_8px_rgba(30,29,27,0.02)]">
            <span className="text-[9px] uppercase tracking-widest text-[#7C756C] font-bold block">Approval Rules</span>
            
            <div className="space-y-3.5 pt-1 text-xs">
              {[
                { label: 'Bilingual output checked', active: true },
                { label: 'Hashtags reviewed', active: true },
                { label: 'Source verified', active: true },
                { label: 'Image template approved', active: true }
              ].map((rule, idx) => (
                <div key={idx} className="flex items-center gap-2.5 py-1">
                  <div className="w-4 h-4 rounded-full border border-emerald-500 bg-emerald-50 text-emerald-600 flex items-center justify-center">
                    <Check className="w-2.5 h-2.5" />
                  </div>
                  <span className="text-[#1E1D1B] dark:text-[#EBE7E0] font-semibold">{rule.label}</span>
                </div>
              ))}
            </div>
          </div>

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
  );
}
