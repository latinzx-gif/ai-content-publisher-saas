'use client'

import { useState } from 'react'
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Button, buttonVariants } from '@/components/ui/button'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { generatePosts } from '@/actions/generate'
import { toast } from 'sonner'
import Link from 'next/link'
import { cn } from '@/lib/utils'

interface GenerateFormProps {
  initialBrand?: {
    tone: string
    personality: string
  } | null
  hasOpenAIKey: boolean
}

export function GenerateForm({ initialBrand, hasOpenAIKey }: GenerateFormProps) {
  const [loading, setLoading] = useState(false)
  const [successCount, setSuccessCount] = useState<number | null>(null)
  
  const [formData, setFormData] = useState({
    topic: '',
    tone: initialBrand?.tone || '',
    personality: initialBrand?.personality || '',
    postCount: 5 as 5 | 10
  })

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!hasOpenAIKey) {
      toast.error('Please configure your OpenAI API Key in Settings first.')
      return
    }
    if (!initialBrand) {
      toast.error('Please configure your Brand Profile first.')
      return
    }

    setLoading(true)
    setSuccessCount(null)
    try {
      const result = await generatePosts(formData)
      setSuccessCount(result.count)
      toast.success(`Successfully generated ${result.count} posts!`)
      setFormData({ ...formData, topic: '' })
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Generation failed'
      toast.error(message)
    } finally {
      setLoading(false)
    }
  }

  if (successCount !== null) {
    return (
      <Card className="border-green-200 bg-green-50">
        <CardHeader>
          <CardTitle className="text-green-800">Generation Complete!</CardTitle>
          <CardDescription className="text-green-700">
            We&apos;ve generated {successCount} posts and saved them as drafts.
          </CardDescription>
        </CardHeader>
        <CardFooter className="flex gap-4">
          <Link href="/drafts" className={cn(buttonVariants())}>
            View Drafts
          </Link>
          <Button variant="outline" onClick={() => setSuccessCount(null)}>
            Generate More
          </Button>
        </CardFooter>
      </Card>
    )
  }

  return (
    <form onSubmit={handleSubmit}>
      <Card>
        <CardHeader>
          <CardTitle>Generate AI Content</CardTitle>
          <CardDescription>
            Enter a topic and select the style for your posts.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="topic">Topic</Label>
            <Input
              id="topic"
              value={formData.topic}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) => setFormData({ ...formData, topic: e.target.value })}
              placeholder="e.g. Benefits of drinking water, How to start a SaaS"
              required
              disabled={loading}
            />
          </div>
          
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="tone">Tone</Label>
              <Input
                id="tone"
                value={formData.tone}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) => setFormData({ ...formData, tone: e.target.value })}
                placeholder="e.g. Professional"
                required
                disabled={loading}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="personality">Personality</Label>
              <Input
                id="personality"
                value={formData.personality}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) => setFormData({ ...formData, personality: e.target.value })}
                placeholder="e.g. Helpful Mentor"
                required
                disabled={loading}
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="postCount">Post Count</Label>
            <Select 
              value={formData.postCount.toString()} 
              onValueChange={(val: string | null) => {
                if (val) setFormData({ ...formData, postCount: parseInt(val) as 5 | 10 })
              }}
              disabled={loading}
            >
              <SelectTrigger id="postCount">
                <SelectValue placeholder="Select count" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="5">5 Posts</SelectItem>
                <SelectItem value="10">10 Posts</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
        <CardFooter>
          <Button type="submit" className="w-full" disabled={loading || !formData.topic}>
            {loading ? 'Generating with AI...' : 'Generate Posts'}
          </Button>
        </CardFooter>
      </Card>
      
      {!hasOpenAIKey && (
        <p className="mt-4 text-sm text-red-500 text-center">
          OpenAI API Key is missing. Please add it in <Link href="/settings" className="underline">Settings</Link>.
        </p>
      )}
      {!initialBrand && (
        <p className="mt-2 text-sm text-red-500 text-center">
          Brand Profile is incomplete. Please configure it in <Link href="/profile" className="underline">Profile</Link>.
        </p>
      )}
    </form>
  )
}
