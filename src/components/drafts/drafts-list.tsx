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
  ChevronDown,
  Download,
  FileText,
  Image as ImageIcon
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { approvePost, rejectPost, saveReviewBoardNote, generateImageOptions, selectImageOption, saveCreativeReview } from '@/actions/drafts';
import { sendPostToBuffer } from '@/actions/publish';
import { toast } from 'sonner';
import { EditModal } from '@/components/drafts/edit-modal';
import { useLanguage } from '@/components/providers/language-provider';

interface DraftsListProps {
  initialPosts: Post[];
  hasBufferKey: boolean;
  initialBoardNote?: string;
}

export function DraftsList({ initialPosts, hasBufferKey, initialBoardNote = '' }: DraftsListProps) {
  const { t, currentLanguage } = useLanguage();
  const [selectedPost, setSelectedPost] = useState<Post | null>(null);
  const [posts, setPosts] = useState<Post[]>(initialPosts || []);
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [publishing, setPublishing] = useState(false);
  const [loadingId, setLoadingId] = useState<string | null>(null);
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());
  const [exporting, setExporting] = useState<'csv' | 'txt' | null>(null);
  const [savingNote, setSavingNote] = useState(false);
  
  // Board Notes State
  const [boardNote, setBoardNote] = useState(initialBoardNote);

  // Dropdown Filter States
  const [campaignFilter, setCampaignFilter] = useState('All');
  const [platformFilter, setPlatformFilter] = useState('All');
  const [languageFilter, setLanguageFilter] = useState('All');
  const [statusFilter, setStatusFilter] = useState('All');
  const [priorityFilter, setPriorityFilter] = useState('All');
  const [imageCount, setImageCount] = useState<1 | 2 | 3>(3);

  useEffect(() => {
    setPosts(initialPosts || []);
  }, [initialPosts]);

  useEffect(() => {
    setBoardNote(initialBoardNote);
  }, [initialBoardNote]);

  function getExportPosts() {
    const selected = posts.filter((post) => selectedIds.has(post.id));
    return selected.length > 0 ? selected : approvedPosts;
  }

  function csvEscape(value: unknown) {
    const text = String(value ?? '');
    return `"${text.replace(/"/g, '""')}"`;
  }

  function downloadFile(filename: string, content: string, type: string) {
    const blob = new Blob([content], { type });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  }

  function buildCsv(exportPosts: Post[]) {
    const headers = ['id', 'status', 'platform', 'topic', 'title', 'caption', 'hashtags', 'created_at', 'updated_at'];
    const rows = exportPosts.map((post) => {
      const meta = post.metadata || {};
      return [
        post.id,
        post.status,
        meta.platform || '',
        meta.topic || '',
        meta.title || post.content.split('\n')[0] || '',
        meta.caption || post.content,
        meta.hashtags || '',
        post.created_at,
        post.updated_at
      ].map(csvEscape).join(',');
    });

    return [headers.join(','), ...rows].join('\n');
  }

  function buildTxt(exportPosts: Post[]) {
    return exportPosts.map((post, index) => {
      const meta = post.metadata || {};
      return [
        `Post ${index + 1}`,
        `ID: ${post.id}`,
        `Status: ${post.status}`,
        `Platform: ${meta.platform || ''}`,
        `Topic: ${meta.topic || ''}`,
        `Title: ${meta.title || post.content.split('\n')[0] || ''}`,
        '',
        'Caption:',
        meta.caption || post.content,
        '',
        `Hashtags: ${meta.hashtags || ''}`,
        `Created: ${post.created_at}`,
        `Updated: ${post.updated_at}`
      ].join('\n');
    }).join('\n\n---\n\n');
  }

  async function handleExport(format: 'csv' | 'txt') {
    const exportPosts = getExportPosts();

    if (exportPosts.length === 0) {
      toast.error(currentLanguage === 'th' ? 'ไม่มีโพสต์ที่เลือกหรืออนุมัติแล้วสำหรับส่งออก' : 'No selected or approved posts to export');
      return;
    }

    setExporting(format);
    try {
      const stamp = new Date().toISOString().slice(0, 10);
      if (format === 'csv') {
        downloadFile(`content-export-${stamp}.csv`, buildCsv(exportPosts), 'text/csv;charset=utf-8');
      } else {
        downloadFile(`content-export-${stamp}.txt`, buildTxt(exportPosts), 'text/plain;charset=utf-8');
      }
      toast.success(currentLanguage === 'th' ? `ส่งออก ${exportPosts.length} โพสต์แล้ว` : `Exported ${exportPosts.length} post${exportPosts.length === 1 ? '' : 's'}`);
    } catch {
      toast.error(currentLanguage === 'th' ? 'ส่งออกไฟล์ไม่สำเร็จ' : 'Export failed');
    } finally {
      setExporting(null);
    }
  }

  async function handleSaveBoardNote() {
    setSavingNote(true);
    try {
      await saveReviewBoardNote({ boardKey: 'drafts', note: boardNote });
      toast.success(t('board.sidebar.saveSuccess'));
    } catch {
      toast.error(currentLanguage === 'th' ? 'บันทึกข้อความไม่สำเร็จ' : 'Failed to save review note');
    } finally {
      setSavingNote(false);
    }
  }

  function togglePostSelection(postId: string) {
    setSelectedIds((current) => {
      const next = new Set(current);
      if (next.has(postId)) {
        next.delete(postId);
      } else {
        next.add(postId);
      }
      return next;
    });
  }

  async function handleStatusChange(id: string, action: 'approve' | 'reject') {
    setLoadingId(id);
    try {
      if (action === 'approve') {
        await approvePost(id);
        setPosts(posts.map(p => p.id === id ? {
          ...p,
          status: 'text_approved',
          metadata: {
            ...p.metadata,
            creative_status: p.metadata?.platform_format === 'text_only' ? 'not_required' : 'pending',
            image_options: [],
            selected_image: null,
            selected_image_url: undefined,
            image_url: null,
            image_source: null
          }
        } : p));
        toast.success(currentLanguage === 'th' ? 'อนุมัติข้อความแล้ว' : 'Text approved successfully');
      } else {
        await rejectPost(id);
        setPosts(posts.map(p => p.id === id ? { ...p, status: 'rejected' } : p));
        toast.success(currentLanguage === 'th' ? 'ปฏิเสธเรียบร้อยแล้ว' : 'Rejected successfully');
      }
    } catch {
      toast.error(currentLanguage === 'th' ? 'ไม่สามารถอัปเดตสถานะได้' : 'Failed to update status');
    } finally {
      setLoadingId(null);
    }
  }

  async function handleGenerateImages(postId: string, count: 1 | 2 | 3) {
    setLoadingId(postId);
    setPosts(posts.map(p => p.id === postId ? {
      ...p,
      status: 'images_pending',
      metadata: {
        ...p.metadata,
        creative_status: 'generating',
        image_options: [],
        selected_image: null,
        selected_image_url: undefined,
        image_url: null,
        image_source: null
      }
    } : p));

    try {
      const result = await generateImageOptions(postId, count);
      setPosts(current => current.map(p => p.id === postId ? {
        ...p,
        status: 'images_ready',
        metadata: {
          ...p.metadata,
          ...result.metadata
        }
      } : p));
      const fallbackCount = result.options.filter(option => option.source === 'placeholder').length;
      if (fallbackCount > 0) {
        toast.warning(currentLanguage === 'th' ? `สร้างรูปภาพเสร็จ แต่มี ${fallbackCount} รูปเป็นภาพสำรอง` : `Images ready, with ${fallbackCount} placeholder fallback${fallbackCount === 1 ? '' : 's'}`);
      } else {
        toast.success(currentLanguage === 'th' ? 'สร้างรูปภาพเรียบร้อยแล้ว' : 'Images generated successfully');
      }
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Failed to generate images';
      toast.error(message);
      setPosts(current => current.map(p => p.id === postId ? {
        ...p,
        status: 'text_approved',
        metadata: {
          ...p.metadata,
          creative_status: 'pending'
        }
      } : p));
    } finally {
      setLoadingId(null);
    }
  }

  async function handleSelectImage(postId: string, imageId: string) {
    setLoadingId(postId);
    try {
      const result = await selectImageOption(postId, imageId);
      setPosts(posts.map(p => p.id === postId ? { ...p, metadata: { ...p.metadata, ...result.metadata } } : p));
      toast.success(currentLanguage === 'th' ? 'เลือกรูปภาพแล้ว' : 'Image selected');
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Failed to select image';
      toast.error(message);
    } finally {
      setLoadingId(null);
    }
  }

  async function handleApproveCreative(postId: string) {
    setLoadingId(postId);
    try {
      const result = await saveCreativeReview({ id: postId, approveCreative: true });
      setPosts(posts.map(p => p.id === postId ? {
        ...p,
        status: 'creative_approved',
        metadata: { ...p.metadata, ...result.metadata }
      } : p));
      toast.success(currentLanguage === 'th' ? 'อนุมัติครีเอทีฟแล้ว' : 'Creative approved');
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Failed to approve creative';
      toast.error(message);
    } finally {
      setLoadingId(null);
    }
  }

  async function handlePublish(id: string) {
    setPublishing(true);
    try {
      const result = await sendPostToBuffer(id);
      setPosts(posts.map(p => p.id === id ? { ...p, status: 'published' } : p));
      toast.success(currentLanguage === 'th' ? 'ส่งไปยัง Buffer สำเร็จแล้ว!' : 'Dispatched to Buffer successfully!');
      if (result.externalUrl) window.open(result.externalUrl, '_blank');
    } catch {
      toast.error(currentLanguage === 'th' ? 'การเผยแพร่ล้มเหลว' : 'Failed to publish');
    } finally {
      setPublishing(false);
    }
  }

  const draftPosts = posts.filter((p) => p.status === 'draft');
  const textApprovedPosts = posts.filter((p) => ['text_approved', 'images_pending', 'images_ready'].includes(String(p.status)));
  const creativeApprovedPosts = posts.filter((p) => p.status === 'creative_approved');
  const approvedPosts = [...textApprovedPosts, ...creativeApprovedPosts];
  const publishedPosts = posts.filter((p) => p.status === 'published');

  const renderCard = (post: Post, isPublished = false) => {
    const meta = post.metadata || {};
    const isSelected = selectedIds.has(post.id);
    const publishedAt = meta.published_at || post.updated_at;
    const status = String(post.status);
    const platformFormat = meta.platform_format || 'text_only';
    const isTextOnly = platformFormat === 'text_only';
    const canGenerateImages = !isTextOnly && ['text_approved', 'images_ready'].includes(status);
    const isGeneratingImages = status === 'images_pending' || (loadingId === post.id && meta.creative_status === 'generating');
    const canPublish = (isTextOnly && status === 'text_approved') || status === 'creative_approved';
    const selectedImageId = meta.selected_image?.id;
    return (
      <div 
        key={post.id}
        onClick={() => {
          setSelectedPost(post);
          setIsEditOpen(true);
        }}
        className={cn(
          "bg-white dark:bg-slate-900 border border-[#E6DFD5] dark:border-slate-800 rounded-xl p-4 space-y-4 hover:border-[#967F5C] transition-all cursor-pointer shadow-[0_2px_6px_rgba(30,29,27,0.01)] text-left relative group",
          isSelected && "border-[#967F5C] ring-1 ring-[#967F5C]/30"
        )}
      >
        <div className="flex justify-between items-start">
          <div className="flex items-start gap-2 min-w-0">
            <input
              type="checkbox"
              checked={isSelected}
              onChange={() => togglePostSelection(post.id)}
              onClick={(event) => event.stopPropagation()}
              className="mt-0.5 h-3.5 w-3.5 shrink-0 accent-[#967F5C]"
              aria-label={currentLanguage === 'th' ? 'เลือกโพสต์สำหรับส่งออก' : 'Select post for export'}
            />
            <h4 className="text-xs font-bold text-[#1E1D1B] dark:text-[#EBE7E0] leading-snug line-clamp-2">
              {meta.title || post.content.split('\n')[0] || (currentLanguage === 'th' ? 'แบบร่างไม่มีชื่อ' : 'Untitled Draft')}
            </h4>
          </div>
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

        <div className="flex flex-wrap gap-1.5 text-[9px] font-bold text-[#7C756C]">
          <span className="rounded bg-[#FAF8F5] border border-[#E6DFD5] px-1.5 py-0.5">
            {platformFormat.replace(/_/g, ' ')}
          </span>
          {meta.requested_word_count && (
            <span className="rounded bg-[#FAF8F5] border border-[#E6DFD5] px-1.5 py-0.5">
              {meta.actual_word_count || 0}/{meta.requested_word_count} words
            </span>
          )}
        </div>

        {/* Published date rendering */}
        {isPublished && (
          <div className="flex items-center gap-1.5 text-[9px] font-bold text-[#967F5C] bg-[#FAF8F5] p-1.5 rounded-lg border border-[#E6DFD5]/50">
            <CalendarIcon className="w-3 h-3" />
            <span>
              {currentLanguage === 'th' ? 'เผยแพร่แล้ว ' : 'Published '}
              {new Date(publishedAt).toLocaleString(currentLanguage === 'th' ? 'th-TH' : 'en-US', {
                month: 'short',
                day: 'numeric',
                hour: '2-digit',
                minute: '2-digit',
              })}
            </span>
          </div>
        )}

        {!isPublished && status !== 'draft' && (
          <div className="flex items-center gap-1.5 text-[9px] font-bold text-emerald-700 bg-emerald-50 p-1.5 rounded-lg border border-emerald-100">
            <Check className="w-3 h-3" />
            <span>
              {status === 'text_approved' && isTextOnly
                ? (currentLanguage === 'th' ? 'ข้อความอนุมัติแล้ว - พร้อมเผยแพร่' : 'Text approved - ready to publish')
                : status === 'text_approved'
                  ? (currentLanguage === 'th' ? 'ข้อความอนุมัติแล้ว - รอสร้างรูปภาพ' : 'Text approved - images required')
                  : status === 'images_pending'
                    ? (currentLanguage === 'th' ? 'กำลังสร้างรูปภาพ' : 'Generating images')
                    : status === 'images_ready'
                      ? (currentLanguage === 'th' ? 'เลือกรูปภาพและอนุมัติครีเอทีฟ' : 'Select image and approve creative')
                      : status === 'creative_approved'
                        ? (currentLanguage === 'th' ? 'ครีเอทีฟอนุมัติแล้ว - พร้อมเผยแพร่' : 'Creative approved - ready to publish')
                        : (currentLanguage === 'th' ? 'พร้อมสำหรับขั้นตอนถัดไป' : 'Ready for next step')}
            </span>
          </div>
        )}

        {!isTextOnly && ['text_approved', 'images_pending', 'images_ready', 'creative_approved'].includes(status) && (
          <div
            className="mt-2 space-y-3 rounded-lg border border-[#E6DFD5] bg-[#FAF8F5] p-2"
            onClick={(event) => event.stopPropagation()}
          >
            {meta.selected_image?.url ? (
              <div className="space-y-1">
                <img src={meta.selected_image.url} alt="Selected creative" className="h-28 w-full rounded-md border border-[#E6DFD5] bg-white object-cover" />
                <div className="text-[9px] font-bold uppercase tracking-wide text-emerald-700">
                  {currentLanguage === 'th' ? 'รูปที่เลือกแล้ว' : 'Selected image'}
                </div>
              </div>
            ) : (
              <div className="flex h-16 items-center justify-center rounded-md border border-dashed border-[#D6CEC1] bg-white text-[10px] font-bold text-[#7C756C]">
                <ImageIcon className="mr-1.5 h-3.5 w-3.5" />
                {isGeneratingImages
                  ? (currentLanguage === 'th' ? 'กำลังสร้างรูปภาพ...' : 'Generating images...')
                  : (currentLanguage === 'th' ? 'ยังไม่ได้เลือกรูปภาพ' : 'No image selected')}
              </div>
            )}

            <div className="flex items-center justify-between text-[10px] font-bold">
              <span>Options:</span>
              <div className="flex gap-1 rounded-md bg-white border border-[#E6DFD5] p-0.5">
                {[1, 2, 3].map(c => (
                  <button
                    key={c}
                    type="button"
                    disabled={isGeneratingImages}
                    onClick={() => setImageCount(c as 1 | 2 | 3)}
                    className={cn(
                      "w-6 h-5 rounded transition-all disabled:opacity-50",
                      imageCount === c ? 'bg-slate-800 text-white' : 'text-slate-500 hover:bg-slate-100'
                    )}
                  >
                    {c}
                  </button>
                ))}
              </div>
            </div>

            <Button
              type="button"
              disabled={!canGenerateImages || isGeneratingImages || loadingId === post.id}
              onClick={() => handleGenerateImages(post.id, imageCount)}
              className="h-8 w-full rounded-md bg-slate-800 text-[10px] font-bold text-white hover:bg-slate-900 disabled:bg-slate-400"
            >
              {isGeneratingImages
                ? (currentLanguage === 'th' ? 'กำลังสร้าง...' : 'Generating...')
                : meta.image_options?.length
                  ? (currentLanguage === 'th' ? `สร้างใหม่ ${imageCount} รูป` : `Regenerate ${imageCount}`)
                  : (currentLanguage === 'th' ? `สร้าง ${imageCount} รูป` : `Generate ${imageCount} image${imageCount === 1 ? '' : 's'}`)}
            </Button>

            {meta.image_options && meta.image_options.length > 0 && (
              <div className="grid grid-cols-3 gap-1.5">
                {meta.image_options.map((option, index) => (
                  <button
                    key={option.id}
                    type="button"
                    onClick={() => handleSelectImage(post.id, option.id)}
                    disabled={loadingId === post.id || status !== 'images_ready'}
                    className={cn(
                      "overflow-hidden rounded-md border bg-white text-left transition-all disabled:opacity-60",
                      selectedImageId === option.id ? 'border-emerald-600 ring-1 ring-emerald-500' : 'border-[#E6DFD5] hover:border-[#967F5C]'
                    )}
                    title={option.warning || option.prompt}
                  >
                    <img src={option.url} alt={`Image option ${index + 1}`} className="h-16 w-full object-cover" />
                    <span className="block px-1 py-0.5 text-[8px] font-bold uppercase text-[#7C756C]">
                      {option.source === 'placeholder' ? 'Fallback' : `Option ${index + 1}`}
                    </span>
                  </button>
                ))}
              </div>
            )}

            {meta.image_options?.some(option => option.source === 'placeholder') && (
              <p className="text-[9px] font-semibold text-amber-700">
                {currentLanguage === 'th'
                  ? 'มีรูปภาพสำรองเนื่องจาก OpenAI สร้างภาพไม่สำเร็จบางรายการ'
                  : 'Some placeholder fallbacks were used because OpenAI image generation failed.'}
              </p>
            )}

            {status === 'images_ready' && (
              <Button
                type="button"
                disabled={!meta.selected_image || loadingId === post.id}
                onClick={() => handleApproveCreative(post.id)}
                className="h-8 w-full rounded-md bg-emerald-600 text-[10px] font-bold text-white hover:bg-emerald-700 disabled:bg-emerald-300"
              >
                {currentLanguage === 'th' ? 'อนุมัติครีเอทีฟ' : 'Approve Creative'}
              </Button>
            )}
          </div>
        )}

        {/* Checklist Dots (Legal, Accounting, Brand) */}
        <div className="flex items-center justify-between pt-3 border-t border-[#E6DFD5]/50 dark:border-slate-800/80">
          <div className="flex items-center gap-2.5 text-[9px] font-semibold text-[#7C756C]">
            <span className="flex items-center gap-1"><span className="w-1.5 h-1.5 rounded-full bg-emerald-500" /> {currentLanguage === 'th' ? 'กฎหมาย' : 'Legal'}</span>
            <span className="flex items-center gap-1"><span className="w-1.5 h-1.5 rounded-full bg-blue-500" /> {currentLanguage === 'th' ? 'บัญชี' : 'Accounting'}</span>
            <span className="flex items-center gap-1"><span className="w-1.5 h-1.5 rounded-full bg-emerald-500" /> {currentLanguage === 'th' ? 'แบรนด์' : 'Brand'}</span>
          </div>
        </div>

        <div className="flex gap-2 pt-1">
          {post.status === 'draft' && (
            <Button
              type="button"
              size="sm"
              disabled={loadingId === post.id}
              onClick={(event) => {
                event.stopPropagation();
                handleStatusChange(post.id, 'approve');
              }}
              className="h-8 flex-1 rounded-lg text-[10px] font-bold bg-emerald-600 hover:bg-emerald-700 text-white"
            >
              <Check className="w-3 h-3 mr-1" />
              {currentLanguage === 'th' ? 'อนุมัติ' : 'Approve'}
            </Button>
          )}
          {canPublish && (
            <Button
              type="button"
              size="sm"
              disabled={publishing || !hasBufferKey}
              onClick={(event) => {
                event.stopPropagation();
                handlePublish(post.id);
              }}
              className="h-8 flex-1 rounded-lg text-[10px] font-bold bg-[#1E1D1B] hover:bg-[#2D2A26] text-white"
            >
              <Send className="w-3 h-3 mr-1" />
              {currentLanguage === 'th' ? 'เผยแพร่' : 'Publish'}
            </Button>
          )}
        </div>
      </div>
    );
  };

  const getFilterLabel = (label: string) => {
    switch (label) {
      case 'Campaign': return t('board.filters.campaign');
      case 'Platform': return t('board.filters.platform');
      case 'Language': return t('board.filters.language');
      case 'Status': return t('board.filters.status');
      case 'Priority': return t('board.filters.priority');
      default: return label;
    }
  };

  return (
    <div className="flex-1 bg-[#FAF8F5] dark:bg-slate-950 min-h-screen text-[#1E1D1B] dark:text-[#EBE7E0] p-4 md:p-6 lg:p-8 flex flex-col space-y-6 min-w-0 overflow-x-hidden">
      
      {/* Header and Title */}
      <div className="space-y-1 text-left pb-3 border-b border-[#E6DFD5] dark:border-slate-800">
        <h2 className="text-3xl font-heading font-semibold tracking-wide uppercase text-[#1E1D1B] dark:text-[#EBE7E0]">
          {t('board.title')}
        </h2>
        <p className="text-xs text-[#7C756C] dark:text-slate-400">
          {t('board.subtitle')}
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
            <span className="text-[9px] uppercase tracking-wider font-bold text-[#7C756C]">{getFilterLabel(f.label)}</span>
            <div className="h-8 border border-[#E6DFD5] rounded px-2 flex items-center justify-between cursor-pointer hover:bg-slate-50/50">
              <span className="font-semibold text-[11px]">
                {f.val === 'All' ? (currentLanguage === 'th' ? 'ทั้งหมด' : 'All') : f.val}
              </span>
              <ChevronDown className="w-3 h-3 text-[#7C756C]" />
            </div>
          </div>
        ))}
        
        <div className="ml-auto flex items-end gap-2">
          <div className="flex flex-col gap-1">
            <span className="text-[9px] uppercase tracking-wider font-bold text-[#7C756C]">
              {currentLanguage === 'th' ? 'ส่งออก' : 'Export'}
            </span>
            <div className="flex gap-2">
              <Button
                type="button"
                variant="outline"
                disabled={exporting !== null}
                onClick={() => handleExport('csv')}
                className="h-8 text-[10px] font-bold border-[#E6DFD5]"
              >
                <Download className="w-3 h-3 mr-1" />
                {exporting === 'csv' ? (currentLanguage === 'th' ? 'กำลังส่งออก...' : 'Exporting...') : 'CSV'}
              </Button>
              <Button
                type="button"
                variant="outline"
                disabled={exporting !== null}
                onClick={() => handleExport('txt')}
                className="h-8 text-[10px] font-bold border-[#E6DFD5]"
              >
                <FileText className="w-3 h-3 mr-1" />
                {exporting === 'txt' ? (currentLanguage === 'th' ? 'กำลังส่งออก...' : 'Exporting...') : 'TXT'}
              </Button>
            </div>
          </div>
          <span className="pb-2 text-[10px] font-semibold text-[#7C756C]">
            {selectedIds.size > 0
              ? (currentLanguage === 'th' ? `เลือก ${selectedIds.size}` : `${selectedIds.size} selected`)
              : (currentLanguage === 'th' ? `ใช้อนุมัติแล้ว ${approvedPosts.length}` : `${approvedPosts.length} approved fallback`)}
          </span>
          <Button variant="outline" className="h-8 text-[10px] font-bold border-[#E6DFD5]">
            {t('board.filters.more')}
          </Button>
        </div>
      </div>

      {/* Main Workspace (Kanban columns + right notes sidebar) */}
      <div className="flex-1 grid grid-cols-1 xl:grid-cols-[minmax(0,3fr)_minmax(260px,1fr)] gap-6 items-start min-w-0 overflow-x-hidden">
        
        {/* Kanban Board Container */}
        <div className="min-w-0 max-w-full overflow-hidden">
          <div className="max-w-full overflow-x-auto overflow-y-hidden pb-4">
            <div className="flex flex-row flex-nowrap gap-4 items-start snap-x min-w-max">
          
          {/* Column 1: DRAFT */}
          <div className="bg-[#F3EFEA]/40 dark:bg-slate-900/40 border border-[#E6DFD5] dark:border-slate-800 rounded-xl p-3.5 space-y-3.5 min-h-[500px] w-[280px] min-w-[280px] md:w-[320px] md:min-w-[320px] max-w-[320px] flex-shrink-0 snap-start">
            <div className="flex items-center justify-between pb-1 border-b border-[#E6DFD5] dark:border-slate-800">
              <span className="text-[10px] font-bold uppercase tracking-wider text-[#1E1D1B] dark:text-[#EBE7E0]">{t('board.column.draft')}</span>
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
                {t('board.action.add')}
              </Button>
            </div>
          </div>

          {/* Column 2: TEXT APPROVED / IMAGE REVIEW */}
          <div className="bg-[#F3EFEA]/40 dark:bg-slate-900/40 border border-[#E6DFD5] dark:border-slate-800 rounded-xl p-3.5 space-y-3.5 min-h-[500px] w-[280px] min-w-[280px] md:w-[320px] md:min-w-[320px] max-w-[320px] flex-shrink-0 snap-start">
            <div className="flex items-center justify-between pb-1 border-b border-[#E6DFD5] dark:border-slate-800">
              <span className="text-[10px] font-bold uppercase tracking-wider text-[#1E1D1B] dark:text-[#EBE7E0]">
                {currentLanguage === 'th' ? 'อนุมัติข้อความ / รูปภาพ' : 'Text + Images'}
              </span>
              <span className="text-[9px] font-bold bg-[#FAF8F5] border border-[#E6DFD5] px-1.5 py-0.2 rounded-full text-[#7C756C]">
                {textApprovedPosts.length}
              </span>
            </div>
            <div className="space-y-3">
              {textApprovedPosts.map(post => renderCard(post))}
              <Button 
                variant="outline" 
                className="w-full text-center border-dashed border-[#E6DFD5] text-[10px] font-bold h-9 hover:bg-white rounded-lg"
              >
                {t('board.action.add')}
              </Button>
            </div>
          </div>

          {/* Column 3: CREATIVE APPROVED */}
          <div className="bg-[#F3EFEA]/40 dark:bg-slate-900/40 border border-[#E6DFD5] dark:border-slate-800 rounded-xl p-3.5 space-y-3.5 min-h-[500px] w-[280px] min-w-[280px] md:w-[320px] md:min-w-[320px] max-w-[320px] flex-shrink-0 snap-start">
            <div className="flex items-center justify-between pb-1 border-b border-[#E6DFD5] dark:border-slate-800">
              <span className="text-[10px] font-bold uppercase tracking-wider text-[#1E1D1B] dark:text-[#EBE7E0]">
                {currentLanguage === 'th' ? 'อนุมัติครีเอทีฟ' : 'Creative Approved'}
              </span>
              <span className="text-[9px] font-bold bg-[#FAF8F5] border border-[#E6DFD5] px-1.5 py-0.2 rounded-full text-[#7C756C]">
                {creativeApprovedPosts.length}
              </span>
            </div>
            <div className="space-y-3">
              {creativeApprovedPosts.map(post => renderCard(post))}
              <Button 
                variant="outline" 
                className="w-full text-center border-dashed border-[#E6DFD5] text-[10px] font-bold h-9 hover:bg-white rounded-lg"
              >
                {t('board.action.add')}
              </Button>
            </div>
          </div>

          {/* Column 4: PUBLISHED */}
          <div className="bg-[#F3EFEA]/40 dark:bg-slate-900/40 border border-[#E6DFD5] dark:border-slate-800 rounded-xl p-3.5 space-y-3.5 min-h-[500px] w-[280px] min-w-[280px] md:w-[320px] md:min-w-[320px] max-w-[320px] flex-shrink-0 snap-start">
            <div className="flex items-center justify-between pb-1 border-b border-[#E6DFD5] dark:border-slate-800">
              <span className="text-[10px] font-bold uppercase tracking-wider text-[#1E1D1B] dark:text-[#EBE7E0]">{t('status.published')}</span>
              <span className="text-[9px] font-bold bg-[#FAF8F5] border border-[#E6DFD5] px-1.5 py-0.2 rounded-full text-[#7C756C]">
                {publishedPosts.length}
              </span>
            </div>
            <div className="space-y-3">
              {publishedPosts.map(post => renderCard(post, true))}
              <Button 
                variant="outline" 
                className="w-full text-center border-dashed border-[#E6DFD5] text-[10px] font-bold h-9 hover:bg-white rounded-lg"
              >
                {t('board.action.add')}
              </Button>
            </div>
          </div>

            </div>
          </div>
        </div>

        {/* Right Sidebar (1/4 Grid) */}
        <div className="space-y-6 text-left min-w-0 overflow-x-hidden">
          
          {/* Review Notes */}
          <div className="border border-[#E6DFD5] dark:border-slate-800 bg-white dark:bg-slate-900 rounded-xl p-5 space-y-4 shadow-[0_2px_8px_rgba(30,29,27,0.02)]">
            <span className="text-[9px] uppercase tracking-widest text-[#7C756C] font-bold block">{t('board.sidebar.notes')}</span>
            <textarea 
              value={boardNote}
              onChange={(e) => setBoardNote(e.target.value)}
              placeholder={t('board.sidebar.notesPlaceholder')}
              rows={4}
              className="w-full text-xs rounded-lg border border-[#E6DFD5] dark:border-slate-700 p-3 bg-white dark:bg-slate-900 text-[#1E1D1B] dark:text-[#EBE7E0] outline-none resize-none font-medium leading-relaxed"
            />
            <div className="flex justify-end">
              <Button 
                disabled={savingNote}
                onClick={handleSaveBoardNote}
                className="bg-[#1E1D1B] text-white dark:bg-[#EBE7E0] dark:text-[#1E1D1B] text-[10px] font-bold h-8 rounded px-4"
              >
                {savingNote ? (currentLanguage === 'th' ? 'กำลังบันทึก...' : 'Saving...') : t('board.sidebar.saveNote')}
              </Button>
            </div>
          </div>

          {/* Approval Rules */}
          <div className="border border-[#E6DFD5] dark:border-slate-800 bg-white dark:bg-slate-900 rounded-xl p-5 space-y-4 shadow-[0_2px_8px_rgba(30,29,27,0.02)]">
            <span className="text-[9px] uppercase tracking-widest text-[#7C756C] font-bold block">{t('board.sidebar.rules')}</span>
            
            <div className="space-y-3.5 pt-1 text-xs">
              {[
                { label: t('board.rules.bilingual'), active: true },
                { label: t('board.rules.hashtags'), active: true },
                { label: t('board.rules.source'), active: true },
                { label: t('board.rules.template'), active: true }
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
