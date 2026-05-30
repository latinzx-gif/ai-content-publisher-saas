'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Button } from '@/components/ui/button'
import { saveBrandProfile } from '@/actions/settings'
import { toast } from 'sonner'

interface BrandProfileFormProps {
  initialData?: {
    name: string
    business_type: string
    target_audience: string
    tone: string
    personality: string
  } | null
}

export function BrandProfileForm({ initialData }: BrandProfileFormProps) {
  const router = useRouter()
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
      toast.success('Brand profile saved successfully')
      router.refresh()
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Failed to save brand profile'
      toast.error(message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <form onSubmit={handleSubmit}>
      <Card>
        <CardHeader>
          <CardTitle>Brand Profile</CardTitle>
          <CardDescription>
            Configure your brand identity to help AI generate consistent content.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="name">Business Name</Label>
            <Input
              id="name"
              value={formData.name}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) => setFormData({ ...formData, name: e.target.value })}
              placeholder="e.g. Acme Corp"
              required
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="business_type">Business Type</Label>
            <Input
              id="business_type"
              value={formData.business_type}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) => setFormData({ ...formData, business_type: e.target.value })}
              placeholder="e.g. SaaS, E-commerce"
              required
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="target_audience">Target Audience</Label>
            <Input
              id="target_audience"
              value={formData.target_audience}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) => setFormData({ ...formData, target_audience: e.target.value })}
              placeholder="e.g. Tech Founders, Busy Moms"
              required
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="tone">Brand Tone</Label>
            <Input
              id="tone"
              value={formData.tone}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) => setFormData({ ...formData, tone: e.target.value })}
              placeholder="e.g. Professional, Humorous, Bold"
              required
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="personality">Brand Personality</Label>
            <Input
              id="personality"
              value={formData.personality}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) => setFormData({ ...formData, personality: e.target.value })}
              placeholder="e.g. Helpful Mentor, Disruptive Innovator"
              required
            />
          </div>
        </CardContent>
        <CardFooter>
          <Button type="submit" disabled={loading}>
            {loading ? 'Saving...' : 'Save Profile'}
          </Button>
        </CardFooter>
      </Card>
    </form>
  )
}
