import { RegisterForm } from '@/components/auth/register-form'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'สมัครสมาชิก | AI Content Publisher',
  description: 'สร้างบัญชีใหม่เพื่อเริ่มใช้งาน',
}

export default function RegisterPage() {
  return (
    <div className="flex h-screen w-full items-center justify-center bg-[#F8F9FA] dark:bg-[#0F172A]">
      <div className="w-full max-w-md px-4">
        {/* Logo / Brand */}
        <div className="mb-8 text-center">
          <div className="inline-flex h-12 w-12 items-center justify-center rounded-2xl bg-indigo-600 shadow-lg shadow-indigo-200 dark:shadow-none mb-4">
            <svg className="h-6 w-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M13 10V3L4 14h7v7l9-11h-7z" />
            </svg>
          </div>
          <h1 className="font-heading font-black text-2xl tracking-tight text-slate-900 dark:text-slate-50">
            AI Content OS
          </h1>
          <p className="mt-1.5 text-sm font-semibold text-slate-400 dark:text-slate-500">
            สร้างบัญชีใหม่เพื่อเริ่มสร้างคอนเทนต์ด้วย AI
          </p>
        </div>

        {/* Card */}
        <div className="rounded-3xl bg-white dark:bg-[#1E293B] border border-slate-100 dark:border-slate-800 shadow-[0_4px_24px_-2px_rgba(15,23,42,0.06)] p-8">
          <RegisterForm />
          <div className="mt-6 text-center text-xs font-semibold text-slate-400 dark:text-slate-500">
            มีบัญชีอยู่แล้วใช่ไหม?{' '}
            <a href="/auth/login" className="font-bold text-indigo-600 hover:text-indigo-700 transition-colors">
              เข้าสู่ระบบที่นี่
            </a>
          </div>
        </div>

        <p className="mt-6 text-center text-[11px] font-semibold text-slate-300 dark:text-slate-600">
          © 2026 AI Content Publisher · Powered by GPT-4o
        </p>
      </div>
    </div>
  )
}
