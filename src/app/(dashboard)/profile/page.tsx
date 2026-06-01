import { getBrandProfile } from '@/actions/settings'
import { BrandProfileForm } from '@/components/settings/brand-profile-form'

export default async function ProfilePage() {
  const profile = await getBrandProfile()

  return (
    <div className="min-h-screen bg-[#FAF8F5] dark:bg-slate-950 p-4 md:p-6 lg:p-8">
      <div className="max-w-3xl mx-auto pb-20">
        <BrandProfileForm initialData={profile} />
      </div>
    </div>
  )
}
