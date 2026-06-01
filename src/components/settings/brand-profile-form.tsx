'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Button } from '@/components/ui/button'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { saveBrandProfile } from '@/actions/settings'
import { toast } from 'sonner'
import { Fingerprint, Save, Info } from 'lucide-react'
import { useLanguage } from '@/components/providers/language-provider'
import { PageHeader } from '@/components/ui/page-header'

interface BrandProfileFormProps {
  initialData?: {
    name: string
    business_type: string
    target_audience: string
    tone: string
    personality: string
  } | null
}

const TONE_OPTIONS = [
  { value: 'Professional', label: 'Professional (เป็นทางการ)' },
  { value: 'Friendly', label: 'Friendly (เป็นกันเอง)' },
  { value: 'Educational', label: 'Educational (ให้ความรู้)' },
  { value: 'Expert', label: 'Expert (ผู้เชี่ยวชาญ)' },
  { value: 'Corporate', label: 'Corporate (องค์กร)' },
  { value: 'Simple', label: 'Simple (เรียบง่าย)' },
]

const PERSONALITY_OPTIONS = [
  { value: 'น่าเชื่อถือ', label: 'น่าเชื่อถือ (Trustworthy)' },
  { value: 'เป็นกันเอง', label: 'เป็นกันเอง (Approachable)' },
  { value: 'จริงจัง', label: 'จริงจัง (Serious)' },
  { value: 'ทันสมัย', label: 'ทันสมัย (Modern)' },
  { value: 'ผู้เชี่ยวชาญ', label: 'ผู้เชี่ยวชาญ (Authority)' },
  { value: 'เน้นขาย', label: 'เน้นขาย (Sales-focused)' },
]

export function BrandProfileForm({ initialData }: BrandProfileFormProps) {
  const router = useRouter()
  const { t } = useLanguage()
  const [loading, setLoading] = useState(false)
  const [formData, setFormData] = useState({
    name: initialData?.name || '',
    business_type: initialData?.business_type || '',
    target_audience: initialData?.target_audience || '',
    tone: initialData?.tone || '',
    personality: initialData?.personality || '',
  })

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true)
    try {
      await saveBrandProfile(formData)
      toast.success(t('profile.form.success'))
      router.refresh()
    } catch (error) {
      const message = error instanceof Error ? error.message : t('profile.form.error')
      toast.error(message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="space-y-6">
      <PageHeader 
        title={t('profile.title')} 
        subtitle={t('profile.subtitle')}
      />
      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="bg-blue-50 border border-blue-100 rounded-2xl p-6 flex items-start gap-4 text-blue-800 animate-in fade-in duration-500">
          <div className="bg-blue-100 p-2 rounded-xl shrink-0">
            <Info className="w-5 h-5 text-blue-600" />
          </div>
        <div className="space-y-1">
            <h4 className="font-bold text-sm">{t('profile.info.title')}</h4>
            <p className="text-sm leading-relaxed opacity-90">
                {t('profile.info.desc')}
            </p>
        </div>
      </div>

      <Card className="border-none shadow-xl shadow-gray-200/50 rounded-2xl overflow-hidden">
        <CardHeader className="bg-white border-b pb-8">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-10 h-10 bg-gray-100 rounded-xl flex items-center justify-center text-gray-600">
                <Fingerprint className="w-6 h-6" />
            </div>
            <CardTitle className="text-xl font-bold">{t('profile.card.title')}</CardTitle>
          </div>
          <CardDescription className="text-sm">
            {t('profile.card.desc')}
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6 pt-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-3">
              <Label htmlFor="name" className="text-sm font-bold text-gray-700">{t('profile.form.name')}</Label>
              <Input
                id="name"
                value={formData.name}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) => setFormData({ ...formData, name: e.target.value })}
                placeholder={t('profile.form.namePlaceholder')}
                className="h-11 rounded-xl border-gray-200 focus:ring-blue-500"
                required
              />
            </div>
            <div className="space-y-3">
              <Label htmlFor="business_type" className="text-sm font-bold text-gray-700">{t('profile.form.businessType')}</Label>
              <Input
                id="business_type"
                value={formData.business_type}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) => setFormData({ ...formData, business_type: e.target.value })}
                placeholder={t('profile.form.businessTypePlaceholder')}
                className="h-11 rounded-xl border-gray-200 focus:ring-blue-500"
                required
              />
            </div>
          </div>

          <div className="space-y-3">
            <Label htmlFor="target_audience" className="text-sm font-bold text-gray-700">{t('profile.form.targetAudience')}</Label>
            <Input
              id="target_audience"
              value={formData.target_audience}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) => setFormData({ ...formData, target_audience: e.target.value })}
              placeholder={t('profile.form.targetAudiencePlaceholder')}
              className="h-11 rounded-xl border-gray-200 focus:ring-blue-500"
              required
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-2">
            <div className="space-y-3">
              <Label htmlFor="tone" className="text-sm font-bold text-gray-700">{t('profile.form.tone')}</Label>
              <Select 
                value={formData.tone} 
                onValueChange={(val: string | null) => {
                    if (val) setFormData({ ...formData, tone: val })
                }}
              >
                <SelectTrigger id="tone" className="h-11 rounded-xl border-gray-200">
                  <SelectValue placeholder={t('profile.form.tonePlaceholder')} />
                </SelectTrigger>
                <SelectContent>
                  {TONE_OPTIONS.map(opt => (
                    <SelectItem key={opt.value} value={opt.value}>{opt.label}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-3">
              <Label htmlFor="personality" className="text-sm font-bold text-gray-700">{t('profile.form.personality')}</Label>
              <Select 
                value={formData.personality} 
                onValueChange={(val: string | null) => {
                    if (val) setFormData({ ...formData, personality: val })
                }}
              >
                <SelectTrigger id="personality" className="h-11 rounded-xl border-gray-200">
                  <SelectValue placeholder={t('profile.form.personalityPlaceholder')} />
                </SelectTrigger>
                <SelectContent>
                  {PERSONALITY_OPTIONS.map(opt => (
                    <SelectItem key={opt.value} value={opt.value}>{opt.label}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>
        <CardFooter className="bg-gray-50/50 border-t p-8">
          <Button 
            type="submit" 
            className="w-full h-12 bg-blue-600 hover:bg-blue-700 shadow-md rounded-xl font-bold transition-all hover:scale-[1.01]" 
            disabled={loading}
          >
            {loading ? (
                <>
                <div className="mr-2 h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
                {t('profile.form.saving')}
                </>
            ) : (
                <>
                <Save className="mr-2 h-4 w-4" /> {t('profile.form.saveBtn')}
                </>
            )}
          </Button>
        </CardFooter>
      </Card>
    </form>
  </div>
)
}
