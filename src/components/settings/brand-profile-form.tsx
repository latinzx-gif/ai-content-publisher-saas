'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Image from 'next/image'
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Button } from '@/components/ui/button'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { saveBrandProfile } from '@/actions/settings'
import { toast } from 'sonner'
import { Fingerprint, Save, Info, Image as ImageIcon, Upload, X } from 'lucide-react'
import { useLanguage } from '@/components/providers/language-provider'
import { PageHeader } from '@/components/ui/page-header'

interface BrandProfileFormProps {
  initialData?: {
    name: string
    business_type: string
    target_audience: string
    tone: string
    personality: string
    brand_description?: string | null
    brand_instructions?: string | null
    content_rules?: string | null
    image_rules?: string | null
    template_key?: string | null
    reference_images?: ReferenceImage[] | null
  } | null
}

interface ReferenceImage {
  id: string
  name: string
  type: 'image/jpeg' | 'image/png' | 'image/webp'
  size: number
  dataUrl: string
  uploadedAt: string
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

const TEMPLATE_OPTIONS = [
  { value: 'legal-professional', label: 'กฎหมายวิชาชีพ (Legal Professional) — Gold / Navy / Serif' },
  { value: 'accounting-professional', label: 'บัญชีวิชาชีพ (Accounting Professional) — Green / White / Sans-serif' },
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
    brand_description: initialData?.brand_description || '',
    brand_instructions: initialData?.brand_instructions || '',
    content_rules: initialData?.content_rules || '',
    image_rules: initialData?.image_rules || '',
    template_key: (initialData?.template_key || 'legal-professional') as 'legal-professional' | 'accounting-professional',
    reference_images: initialData?.reference_images || [],
  })

  function handleReferenceUpload(files: FileList | null) {
    if (!files?.length) return

    const acceptedTypes = ['image/jpeg', 'image/png', 'image/webp']
    const remainingSlots = 5 - formData.reference_images.length
    const selectedFiles = Array.from(files).slice(0, remainingSlots)

    if (remainingSlots <= 0) {
      toast.error('Reference images are limited to 5 files.')
      return
    }

    if (files.length > remainingSlots) {
      toast.error(`Only ${remainingSlots} more reference image${remainingSlots === 1 ? '' : 's'} can be added.`)
    }

    selectedFiles.forEach((file) => {
      if (!acceptedTypes.includes(file.type)) {
        toast.error(`${file.name} must be JPG, PNG, or WEBP.`)
        return
      }

      if (file.size > 2_500_000) {
        toast.error(`${file.name} is too large. Maximum size is 2.5 MB.`)
        return
      }

      const reader = new FileReader()
      reader.onload = () => {
        const dataUrl = typeof reader.result === 'string' ? reader.result : ''
        if (!dataUrl) return

        setFormData((current) => ({
          ...current,
          reference_images: [
            ...current.reference_images,
            {
              id: `${Date.now()}-${file.name}`,
              name: file.name,
              type: file.type as ReferenceImage['type'],
              size: file.size,
              dataUrl,
              uploadedAt: new Date().toISOString(),
            },
          ].slice(0, 5),
        }))
      }
      reader.readAsDataURL(file)
    })
  }

  function removeReferenceImage(id: string) {
    setFormData((current) => ({
      ...current,
      reference_images: current.reference_images.filter((image) => image.id !== id),
    }))
  }

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

          {/* Template Theme Selector — V1.3 Dual Template System */}
          <div className="pt-4 border-t border-gray-100">
            <div className="grid grid-cols-1 gap-4">
              <div className="space-y-2">
                <Label htmlFor="template_key" className="text-sm font-bold text-gray-700">Template Theme (โทนภาพ)</Label>
                <p className="text-xs text-gray-500">Choose the visual theme for generated images. Affects colors, fonts, and iconography.</p>
                <Select
                  value={formData.template_key}
                  onValueChange={(val: string | null) => {
                    if (val && (val === 'legal-professional' || val === 'accounting-professional')) {
                      setFormData({ ...formData, template_key: val as 'legal-professional' | 'accounting-professional' })
                    }
                  }}
                >
                  <SelectTrigger id="template_key" className="h-11 rounded-xl border-gray-200">
                    <SelectValue placeholder="Select a template theme" />
                  </SelectTrigger>
                  <SelectContent>
                    {TEMPLATE_OPTIONS.map(opt => (
                      <SelectItem key={opt.value} value={opt.value}>{opt.label}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>

          <div className="pt-6 border-t border-gray-100 space-y-6">
            <div className="space-y-2">
              <h3 className="text-sm font-bold text-gray-900">Brand Memory</h3>
              <p className="text-xs text-gray-500">
                Stored guidance used by AI generation so repeated brand instructions do not need to be re-entered.
              </p>
            </div>

            <div className="space-y-3">
              <Label htmlFor="brand_description" className="text-sm font-bold text-gray-700">Brand Description</Label>
              <textarea
                id="brand_description"
                value={formData.brand_description}
                onChange={(e) => setFormData({ ...formData, brand_description: e.target.value })}
                placeholder="Describe what the brand does, positioning, products, services, and differentiators."
                rows={3}
                className="w-full rounded-xl border border-gray-200 bg-white p-3 text-sm leading-relaxed outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div className="space-y-3">
              <Label htmlFor="brand_instructions" className="text-sm font-bold text-gray-700">Brand Instructions</Label>
              <textarea
                id="brand_instructions"
                value={formData.brand_instructions}
                onChange={(e) => setFormData({ ...formData, brand_instructions: e.target.value })}
                placeholder="Add standing instructions such as preferred message framing, CTA style, and brand voice details."
                rows={3}
                className="w-full rounded-xl border border-gray-200 bg-white p-3 text-sm leading-relaxed outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-3">
                <Label htmlFor="content_rules" className="text-sm font-bold text-gray-700">Content Rules</Label>
                <textarea
                  id="content_rules"
                  value={formData.content_rules}
                  onChange={(e) => setFormData({ ...formData, content_rules: e.target.value })}
                  placeholder="Rules, disclaimers, required wording, prohibited claims, or compliance constraints."
                  rows={5}
                  className="w-full rounded-xl border border-gray-200 bg-white p-3 text-sm leading-relaxed outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div className="space-y-3">
                <Label htmlFor="image_rules" className="text-sm font-bold text-gray-700">Image Rules</Label>
                <textarea
                  id="image_rules"
                  value={formData.image_rules}
                  onChange={(e) => setFormData({ ...formData, image_rules: e.target.value })}
                  placeholder="Visual style guidance, brand colors, image do/don't rules, and reference usage notes."
                  rows={5}
                  className="w-full rounded-xl border border-gray-200 bg-white p-3 text-sm leading-relaxed outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>

            <div className="space-y-3">
              <div className="flex items-center justify-between gap-4">
                <div>
                  <Label className="text-sm font-bold text-gray-700">Reference Images</Label>
                  <p className="text-xs text-gray-500 mt-1">Upload up to 5 JPG, PNG, or WEBP references for future image workflows.</p>
                </div>
                <Label
                  htmlFor="reference_images"
                  className="inline-flex h-10 cursor-pointer items-center gap-2 rounded-xl border border-gray-200 px-4 text-xs font-bold text-gray-700 hover:bg-gray-50"
                >
                  <Upload className="h-4 w-4" />
                  Upload
                </Label>
                <input
                  id="reference_images"
                  type="file"
                  accept="image/jpeg,image/png,image/webp"
                  multiple
                  className="hidden"
                  onChange={(e) => {
                    handleReferenceUpload(e.target.files)
                    e.currentTarget.value = ''
                  }}
                />
              </div>

              {formData.reference_images.length > 0 ? (
                <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
                  {formData.reference_images.map((image) => (
                    <div key={image.id} className="group relative overflow-hidden rounded-xl border border-gray-200 bg-gray-50">
                      <Image
                        src={image.dataUrl}
                        alt={image.name}
                        width={160}
                        height={160}
                        unoptimized
                        className="aspect-square w-full object-cover"
                      />
                      <button
                        type="button"
                        onClick={() => removeReferenceImage(image.id)}
                        className="absolute right-2 top-2 flex h-7 w-7 items-center justify-center rounded-full bg-white/90 text-gray-700 shadow-sm hover:text-red-600"
                        aria-label={`Remove ${image.name}`}
                      >
                        <X className="h-3.5 w-3.5" />
                      </button>
                      <div className="absolute inset-x-0 bottom-0 bg-white/90 px-2 py-1">
                        <p className="truncate text-[10px] font-semibold text-gray-700">{image.name}</p>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="flex items-center gap-3 rounded-xl border border-dashed border-gray-200 bg-gray-50 p-4 text-sm text-gray-500">
                  <ImageIcon className="h-5 w-5 text-gray-400" />
                  No reference images uploaded.
                </div>
              )}
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
