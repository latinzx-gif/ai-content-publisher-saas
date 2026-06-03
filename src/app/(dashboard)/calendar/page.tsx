import { createAdminClient } from '@/lib/supabase/admin'
import { getDefaultOwnerId } from '@/lib/owner-context'
import { Post, PostMetadata, PostStatus } from '@/types'
import { Calendar as CalendarIcon, ExternalLink } from 'lucide-react'
import { cn } from '@/lib/utils'

// ── Types ──
interface CalendarPost {
  id: string
  title: string
  caption: string
  status: PostStatus
  platform: string
  format: string
  timestamp: string | null
  bufferPostId: string | null
  externalUrl: string | null
  imageUrl: string | null
  language: string
}

interface DateGroup {
  date: string          // "2026-06-03"
  label: string         // "Jun 3, 2026" or "3 มิ.ย. 2026"
  posts: CalendarPost[]
}

// ── Helpers ──
function extractPostDate(post: Post): string | null {
  const meta = post.metadata as PostMetadata | null
  if (!meta) return post.updated_at || null

  // Priority: buffer_due_at → published_at → dueAt → updated_at
  const metaAny = meta as unknown as Record<string, unknown>
  const candidates = [
    meta.buffer_due_at,
    meta.published_at,
    metaAny.dueAt as string | undefined,
    post.updated_at,
  ]
  for (const c of candidates) {
    if (c) return c
  }
  return null
}

function formatDateLabel(dateStr: string, locale: string): string {
  const d = new Date(dateStr)
  if (isNaN(d.getTime())) return dateStr
  return d.toLocaleDateString(locale === 'th' ? 'th-TH' : 'en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  })
}

function formatTime(dateStr: string): string {
  const d = new Date(dateStr)
  if (isNaN(d.getTime())) return ''
  return d.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })
}

function getStatusBadge(status: string, locale: string): { label: string; color: string } {
  const map: Record<string, { th: string; en: string }> = {
    published: { th: 'เผยแพร่แล้ว', en: 'Published' },
    creative_approved: { th: 'อนุมัติแล้ว', en: 'Approved' },
    scheduled: { th: 'กำหนดเวลา', en: 'Scheduled' },
    failed: { th: 'ล้มเหลว', en: 'Failed' },
    draft: { th: 'แบบร่าง', en: 'Draft' },
    text_approved: { th: 'อนุมัติข้อความ', en: 'Text Approved' },
  }
  const entry = map[status] || { th: status, en: status }
  const label = locale === 'th' ? entry.th : entry.en

  const colorMap: Record<string, string> = {
    published: 'bg-emerald-100 text-emerald-700 border-emerald-200 dark:bg-emerald-950/30 dark:text-emerald-300 dark:border-emerald-900/50',
    scheduled: 'bg-blue-100 text-blue-700 border-blue-200 dark:bg-blue-950/30 dark:text-blue-300 dark:border-blue-900/50',
    failed: 'bg-red-100 text-red-700 border-red-200 dark:bg-red-950/30 dark:text-red-300 dark:border-red-900/50',
    creative_approved: 'bg-amber-100 text-amber-700 border-amber-200 dark:bg-amber-950/30 dark:text-amber-300 dark:border-amber-900/50',
  }
  return { label, color: colorMap[status] || 'bg-slate-100 text-slate-600 border-slate-200 dark:bg-slate-800 dark:text-slate-300 dark:border-slate-700' }
}

function getPlatformLabel(platform: string, locale: string): string {
  const map: Record<string, { th: string; en: string }> = {
    facebook: { th: 'Facebook', en: 'Facebook' },
    linkedin: { th: 'LinkedIn', en: 'LinkedIn' },
    instagram: { th: 'Instagram', en: 'Instagram' },
    website: { th: 'เว็บไซต์', en: 'Website' },
  }
  const entry = map[platform?.toLowerCase()] || { th: platform || 'Facebook', en: platform || 'Facebook' }
  return locale === 'th' ? entry.th : entry.en
}

function getFormatLabel(fmt: string | undefined, locale: string): string {
  const map: Record<string, { th: string; en: string }> = {
    text_only: { th: 'ข้อความเท่านั้น', en: 'Text Only' },
    facebook_post: { th: 'โพสต์ Facebook', en: 'Facebook Post' },
    instagram_4_5: { th: 'Instagram 4:5', en: 'Instagram 4:5' },
    instagram_square: { th: 'Instagram 1:1', en: 'Instagram Square' },
  }
  const entry = map[fmt || ''] || { th: fmt || '—', en: fmt || '—' }
  return locale === 'th' ? entry.th : entry.en
}

function getDayNames(locale: string): string[] {
  if (locale === 'th') return ['อา.', 'จ.', 'อ.', 'พ.', 'พฤ.', 'ศ.', 'ส.']
  return ['SUN', 'MON', 'TUE', 'WED', 'THU', 'FRI', 'SAT']
}

function getMonthName(month: number, locale: string): string {
  const d = new Date(2024, month, 1)
  return d.toLocaleDateString(locale === 'th' ? 'th-TH' : 'en-US', { month: 'long', year: 'numeric' })
}

// ── Server Component ──
export default async function CalendarPage() {
  const supabase = createAdminClient()
  const userId = getDefaultOwnerId()

  // Fetch all non-draft posts for the calendar
  const { data: posts, error } = await supabase
    .from('content_posts')
    .select('id, status, content, buffer_post_id, created_at, updated_at, metadata')
    .eq('user_id', userId)
    .in('status', ['published', 'creative_approved', 'failed', 'scheduled'])
    .order('updated_at', { ascending: false })
    .limit(200)

  if (error) {
    return (
      <div className="flex-1 bg-[#FAF9F6] dark:bg-slate-950 p-6 sm:p-8">
        <p className="text-red-500 text-sm">Failed to load calendar: {error.message}</p>
      </div>
    )
  }

  // Transform into CalendarPost[]
  const calendarPosts: CalendarPost[] = (posts || []).map((p) => {
    const meta = (p.metadata || {}) as PostMetadata
    const dateStr = extractPostDate(p as unknown as Post)
    return {
    id: p.id,
    title: meta.title || '',
    caption: meta.caption || '',
    status: p.status,
    platform: meta.platform || 'facebook',
      format: meta.platform_format || 'facebook_post',
      timestamp: dateStr,
      bufferPostId: p.buffer_post_id || meta.external_id || null,
      externalUrl: meta.external_url || null,
      imageUrl: meta.image_url && meta.image_url.startsWith('https://') ? meta.image_url : null,
      language: meta.language || 'TH',
    }
  })

  // Separate scheduled / published / approved from unscheduled
  const scheduled = calendarPosts.filter((p) => p.timestamp)
  const unscheduled = calendarPosts.filter((p) => !p.timestamp)

  // Group scheduled by date
  const groups: Map<string, CalendarPost[]> = new Map()
  for (const p of scheduled) {
    const day = (p.timestamp as string).slice(0, 10) // "2026-06-03"
    const existing = groups.get(day) || []
    existing.push(p)
    groups.set(day, existing)
  }

  // Sort groups by date descending
  const sortedGroups: DateGroup[] = Array.from(groups.entries())
    .sort(([a], [b]) => b.localeCompare(a))
    .map(([date, posts]) => ({
      date,
      label: formatDateLabel(date, 'en'),
      posts,
    }))

  // Current week info for the header
  const now = new Date()
  const weekStart = new Date(now)
  weekStart.setDate(now.getDate() - now.getDay() + 1) // Monday
  const weekEnd = new Date(weekStart)
  weekEnd.setDate(weekStart.getDate() + 6)

  return (
    <div className="flex-1 overflow-y-auto bg-[#FAF9F6] dark:bg-slate-950 text-slate-800 dark:text-slate-200 p-6 sm:p-8 flex flex-col space-y-6 select-none font-sans min-h-screen">
      {/* Title */}
      <div className="space-y-1 text-left">
        <h1 className="text-3xl font-heading font-black tracking-tight text-slate-900 dark:text-slate-100 uppercase">
          Calendar & Publishing
        </h1>
        <p className="text-xs text-slate-400 dark:text-slate-500 font-medium">
          {calendarPosts.length} real posts from Supabase
        </p>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        {[
          { label: 'Published', count: calendarPosts.filter((p) => p.status === 'published').length, color: 'text-emerald-600' },
          { label: 'Approved', count: calendarPosts.filter((p) => p.status === 'creative_approved').length, color: 'text-amber-600' },
          { label: 'Scheduled', count: calendarPosts.filter((p) => p.status === 'scheduled').length, color: 'text-blue-600' },
          { label: 'Failed', count: calendarPosts.filter((p) => p.status === 'failed').length, color: 'text-red-600' },
        ].map((item) => (
          <div key={item.label} className="bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 rounded-2xl p-4 shadow-[0_2px_12px_rgba(15,23,42,0.01)]">
            <p className="text-[9px] uppercase tracking-wider font-bold text-slate-400 dark:text-slate-500">{item.label}</p>
            <p className={cn('text-2xl font-black mt-1', item.color)}>{item.count}</p>
          </div>
        ))}
      </div>

      {/* Post List Grouped by Date */}
      <div className="space-y-4">
        {sortedGroups.length === 0 && unscheduled.length === 0 && (
          <div className="text-center py-16">
            <CalendarIcon className="w-12 h-12 mx-auto text-slate-300 dark:text-slate-600 mb-3" />
            <p className="text-sm text-slate-400 dark:text-slate-500 font-medium">No published or scheduled posts yet.</p>
            <p className="text-xs text-slate-300 dark:text-slate-600 mt-1">Generate and publish content to see it here.</p>
          </div>
        )}

        {sortedGroups.map((group) => (
          <div key={group.date}>
            <h2 className="text-sm font-black text-slate-800 dark:text-slate-200 mb-2 px-1 uppercase tracking-wide">
              {group.label}
            </h2>
            <div className="space-y-2">
              {group.posts.map((post) => (
                <PostCard key={post.id} post={post} />
              ))}
            </div>
          </div>
        ))}

        {unscheduled.length > 0 && (
          <div>
            <h2 className="text-sm font-black text-slate-800 dark:text-slate-200 mb-2 px-1 uppercase tracking-wide">
              Unscheduled
            </h2>
            <div className="space-y-2">
              {unscheduled.map((post) => (
                <PostCard key={post.id} post={post} />
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

// ── Post Card Component ──
function PostCard({ post }: { post: CalendarPost }) {
  const badge = getStatusBadge(post.status, 'en')
  const displayTitle = post.title || post.caption?.slice(0, 80) || '(untitled)'
  const displayTime = post.timestamp ? formatTime(post.timestamp) : ''

  return (
    <div className="bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 rounded-2xl p-4 shadow-[0_2px_12px_rgba(15,23,42,0.01)] hover:shadow-md transition-shadow">
      <div className="flex items-start gap-4">
        {/* Image thumbnail */}
        {post.imageUrl ? (
          <div className="w-16 h-16 rounded-xl overflow-hidden bg-slate-100 dark:bg-slate-800 shrink-0 border border-slate-200 dark:border-slate-700">
            <img src={post.imageUrl} alt="" className="w-full h-full object-cover" />
          </div>
        ) : (
          <div className="w-16 h-16 rounded-xl bg-slate-50 dark:bg-slate-800 shrink-0 border border-slate-200 dark:border-slate-700 flex items-center justify-center">
            <span className="text-[20px] text-slate-300 dark:text-slate-600">📄</span>
          </div>
        )}

        {/* Content */}
        <div className="flex-1 min-w-0 space-y-1.5">
          {/* Title + Status */}
          <div className="flex items-start justify-between gap-2">
            <h3 className="font-bold text-sm text-slate-900 dark:text-slate-100 leading-snug line-clamp-2">
              {displayTitle}
            </h3>
            <span className={cn('shrink-0 text-[9px] font-black uppercase tracking-wider px-2 py-0.5 rounded-full border', badge.color)}>
              {badge.label}
            </span>
          </div>

          {/* Caption preview */}
          {post.caption && post.caption !== post.title && (
            <p className="text-[11px] text-slate-400 dark:text-slate-500 line-clamp-1 leading-relaxed">
              {post.caption.slice(0, 120)}
            </p>
          )}

          {/* Meta row */}
          <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-[10px] font-semibold text-slate-400 dark:text-slate-500">
            {/* Platform */}
            <span>{getPlatformLabel(post.platform, 'en')}</span>

            {/* Format */}
            <span className="px-1.5 py-0.5 bg-slate-50 dark:bg-slate-800 border border-slate-150 dark:border-slate-700 rounded text-[8px]">
              {getFormatLabel(post.format, 'en')}
            </span>

            {/* Language */}
            {post.language && (
              <span className="px-1.5 py-0.5 bg-slate-50 dark:bg-slate-800 border border-slate-150 dark:border-slate-700 rounded text-[8px]">
                {post.language}
              </span>
            )}

            {/* Time */}
            {displayTime && (
              <span className="flex items-center gap-1">
                <CalendarIcon className="w-3 h-3" />
                {displayTime}
              </span>
            )}

            {/* Buffer post ID */}
            {post.bufferPostId && (
              <span className="font-mono text-[8px] text-slate-300 dark:text-slate-600">
                Buffer: {post.bufferPostId.slice(0, 12)}...
              </span>
            )}

            {/* External URL */}
            {post.externalUrl && (
              <a
                href={post.externalUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1 text-blue-500 hover:text-blue-600 dark:text-blue-400 dark:hover:text-blue-300"
              >
                <ExternalLink className="w-3 h-3" />
                Link
              </a>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}