import { getBrandProfile } from '@/actions/settings'
import { BrandProfileForm } from '@/components/settings/brand-profile-form'

export default async function ProfilePage() {
  const profile = await getBrandProfile()

  return (
    <div className="max-w-3xl mx-auto pb-20">
      <BrandProfileForm initialData={profile} />
    </div>
  )
}
