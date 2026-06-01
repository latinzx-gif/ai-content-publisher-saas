'use client'

import { useState } from 'react'
import { signup } from '@/actions/auth'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { AlertCircle, Eye, EyeOff, Loader2, CheckCircle2 } from 'lucide-react'
import { useLanguage } from '@/components/providers/language-provider'

export function RegisterForm() {
  const { t } = useLanguage()
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)
  const [success, setSuccess] = useState(false)
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirm, setShowConfirm] = useState(false)

  async function handleSubmit(formData: FormData) {
    setError(null)

    // Client-side confirm password check
    const password = formData.get('password') as string
    const confirmPassword = formData.get('confirmPassword') as string
    if (password !== confirmPassword) {
      setError(t('auth.register.errorMismatch'))
      return
    }
    if (password.length < 6) {
      setError(t('auth.register.errorLength'))
      return
    }

    setLoading(true)
    const result = await signup(formData)
    if (result?.error) {
      setError(result.error)
      setLoading(false)
    } else {
      // Show verify email message instead of redirect
      setSuccess(true)
      setLoading(false)
    }
  }

  // Success state: email sent
  if (success) {
    return (
      <div className="space-y-4 text-center py-2">
        <div className="inline-flex h-14 w-14 items-center justify-center rounded-2xl bg-emerald-50 dark:bg-emerald-950/40 mx-auto">
          <CheckCircle2 className="h-7 w-7 text-emerald-500" />
        </div>
        <div className="space-y-1">
          <h2 className="font-heading font-black text-lg text-slate-900 dark:text-slate-50">
            {t('auth.register.successTitle')}
          </h2>
          <p className="text-sm font-semibold text-slate-500 dark:text-slate-400 leading-relaxed">
            {t('auth.register.successDesc')}
          </p>
        </div>
        <a
          href="/auth/login"
          className="inline-block text-xs font-bold text-indigo-600 hover:text-indigo-700 transition-colors underline underline-offset-4"
        >
          {t('auth.register.backToLogin')}
        </a>
      </div>
    )
  }

  return (
    <form action={handleSubmit} className="space-y-5">
      {/* Error Banner */}
      {error && (
        <div className="flex items-start gap-2.5 rounded-xl bg-red-50 dark:bg-red-950/30 border border-red-100 dark:border-red-900/40 px-3.5 py-3 text-sm text-red-700 dark:text-red-400">
          <AlertCircle className="mt-0.5 h-4 w-4 shrink-0" />
          <span className="font-semibold">{error}</span>
        </div>
      )}

      {/* Email */}
      <div className="space-y-1.5">
        <Label htmlFor="email" className="text-xs font-bold uppercase tracking-widest text-slate-500 dark:text-slate-400">
          {t('auth.login.email')}
        </Label>
        <Input
          id="email"
          name="email"
          type="email"
          placeholder="name@example.com"
          required
          autoComplete="email"
          className="h-11 rounded-xl border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/60 text-sm font-medium focus:border-indigo-400 focus:ring-indigo-300/40 placeholder:text-slate-300 dark:placeholder:text-slate-600 transition-all"
        />
      </div>

      {/* Password */}
      <div className="space-y-1.5">
        <Label htmlFor="password" className="text-xs font-bold uppercase tracking-widest text-slate-500 dark:text-slate-400">
          {t('auth.login.password')}
        </Label>
        <div className="relative">
          <Input
            id="password"
            name="password"
            type={showPassword ? 'text' : 'password'}
            required
            autoComplete="new-password"
            placeholder={t('auth.register.placeholderPassword')}
            className="h-11 rounded-xl border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/60 text-sm font-medium focus:border-indigo-400 focus:ring-indigo-300/40 placeholder:text-slate-300 dark:placeholder:text-slate-600 pr-10 transition-all"
          />
          <button
            type="button"
            tabIndex={-1}
            onClick={() => setShowPassword(!showPassword)}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-300 transition-colors"
          >
            {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
          </button>
        </div>
      </div>

      {/* Confirm Password */}
      <div className="space-y-1.5">
        <Label htmlFor="confirmPassword" className="text-xs font-bold uppercase tracking-widest text-slate-500 dark:text-slate-400">
          {t('auth.register.confirmPassword')}
        </Label>
        <div className="relative">
          <Input
            id="confirmPassword"
            name="confirmPassword"
            type={showConfirm ? 'text' : 'password'}
            required
            autoComplete="new-password"
            placeholder={t('auth.register.placeholderConfirm')}
            className="h-11 rounded-xl border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/60 text-sm font-medium focus:border-indigo-400 focus:ring-indigo-300/40 placeholder:text-slate-300 dark:placeholder:text-slate-600 pr-10 transition-all"
          />
          <button
            type="button"
            tabIndex={-1}
            onClick={() => setShowConfirm(!showConfirm)}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-300 transition-colors"
          >
            {showConfirm ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
          </button>
        </div>
      </div>

      {/* Submit */}
      <Button
        type="submit"
        disabled={loading}
        className="w-full h-11 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-sm tracking-wide shadow-md shadow-indigo-200 dark:shadow-none transition-all duration-200 disabled:opacity-60 disabled:cursor-not-allowed"
      >
        {loading ? (
          <span className="flex items-center gap-2">
            <Loader2 className="h-4 w-4 animate-spin" />
            {t('auth.register.loading')}
          </span>
        ) : (
          t('auth.register.submit')
        )}
      </Button>
    </form>
  )
}
