import { getBrandProfile } from '@/actions/settings'
import { BrandProfileForm } from '@/components/settings/brand-profile-form'

export default async function ProfilePage() {
  const profile = await getBrandProfile()

  return (
    <div className="container mx-auto py-10 max-w-2xl">
      <div className="mb-8">
        <h1 className="text-3xl font-bold tracking-tight">Brand Profile</h1>
        <p className="text-muted-foreground">Manage your brand identity and voice.</p>
      </div>
      <BrandProfileForm initialData={profile} />
    </div>
  )
}
