import { getBrandProfile } from '@/actions/settings'
import { BrandProfileForm } from '@/components/settings/brand-profile-form'
import { PageHeader } from '@/components/ui/page-header'

export default async function ProfilePage() {
  const profile = await getBrandProfile()

  return (
    <div className="space-y-6">
      <PageHeader 
        title="ตัวตนแบรนด์" 
        subtitle="จัดการข้อมูลเอกลักษณ์และน้ำเสียงของธุรกิจคุณเพื่อให้ AI เข้าใจ"
      />
      <div className="max-w-3xl mx-auto pb-20">
        <BrandProfileForm initialData={profile} />
      </div>
    </div>
  )
}
