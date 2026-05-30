import { getCurrentOwner, getDbClient } from '@/lib/owner-context'
import { DashboardClient } from '@/components/dashboard/dashboard-client'
import { redirect } from 'next/navigation'

export const dynamic = 'force-dynamic'

export default async function DashboardPage() {
  const supabase = await getDbClient()
  const user = await getCurrentOwner()

  if (!user) {
    redirect('/auth/login')
  }

  // Fetch stats from database
  const { data: posts } = await supabase
    .from('content_posts')
    .select('status')
    .eq('user_id', user.id)

  const { data: brand } = await supabase
    .from('brands')
    .select('name')
    .eq('user_id', user.id)
    .single()

  const { data: integrations } = await supabase
    .from('integrations')
    .select('provider')
    .eq('user_id', user.id)

  // Fetch recent activity logs
  const { data: recentActivity } = await supabase
    .from('workflow_logs')
    .select('id, action, topic, status, created_at')
    .eq('user_id', user.id)
    .order('created_at', { ascending: false })
    .limit(5)

  const stats = {
    draft: posts?.filter(p => p.status === 'draft').length || 0,
    approved: posts?.filter(p => p.status === 'approved').length || 0,
    published: posts?.filter(p => p.status === 'published').length || 0,
    generated: posts?.length || 0,
    hasBrand: !!brand,
    hasOpenAI: integrations?.some(i => i.provider === 'openai') || false,
    hasBuffer: integrations?.some(i => i.provider === 'buffer') || false,
  }

  return (
    <DashboardClient
      userEmail={user.email || ''}
      stats={stats}
      brandName={brand?.name}
      recentActivity={recentActivity || []}
    />
  )
}
