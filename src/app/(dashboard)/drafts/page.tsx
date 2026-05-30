import { getPosts } from '@/actions/drafts'
import { DraftsList } from '@/components/drafts/drafts-list'
import { createClient } from '@/lib/supabase/server'

export default async function DraftsPage() {
  const posts = await getPosts()
  
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  
  const { data: bufferInt } = await supabase
    .from('integrations')
    .select('id')
    .eq('user_id', user?.id)
    .eq('provider', 'buffer')
    .single()

  return (
    <div className="container mx-auto py-10">
      <DraftsList initialPosts={posts} hasBufferKey={!!bufferInt} />
    </div>
  )
}
