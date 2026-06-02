import { getPosts, getReviewBoardNote } from '@/actions/drafts'
import { DraftsList } from '@/components/drafts/drafts-list'
import { getCurrentOwner, getDbClient } from '@/lib/owner-context'

export default async function DraftsPage() {
  const posts = await getPosts()
  const boardNote = await getReviewBoardNote()
  
  const supabase = await getDbClient()
  const user = await getCurrentOwner()
  
  const { data: bufferInt } = await supabase
    .from('integrations')
    .select('id')
    .eq('user_id', user?.id)
    .eq('provider', 'buffer')
    .single()

  return (
    <div className="space-y-6 pb-20 min-w-0 overflow-x-hidden">
      <DraftsList initialPosts={posts} hasBufferKey={!!bufferInt} initialBoardNote={boardNote} />
    </div>
  )
}
