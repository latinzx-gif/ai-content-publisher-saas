'use server'

import { createClient } from '@/lib/supabase/server'
import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'
import { z } from 'zod'

const AuthSchema = z.object({
  email: z.string().email({ message: 'รูปแบบอีเมลไม่ถูกต้อง' }),
  password: z.string().min(6, { message: 'รหัสผ่านต้องมีอย่างน้อย 6 ตัวอักษร' }),
})

export async function signup(formData: FormData) {
  const supabase = await createClient()

  const email = formData.get('email') as string
  const password = formData.get('password') as string

  const validated = AuthSchema.safeParse({ email, password })
  if (!validated.success) {
    return { error: 'อีเมลหรือรหัสผ่านไม่ถูกต้อง (รหัสผ่านต้องมีอย่างน้อย 6 ตัวอักษร)' }
  }

  const { error } = await supabase.auth.signUp({
    email,
    password,
    options: {
      emailRedirectTo: `${process.env.APP_URL}/auth/callback`,
    },
  })

  if (error) {
    if (error.message.includes('already registered')) {
      return { error: 'อีเมลนี้ถูกใช้งานแล้ว กรุณาเข้าสู่ระบบหรือใช้อีเมลอื่น' }
    }
    return { error: error.message }
  }

  // Don't redirect — let the form show an email verification notice
  return { success: true }
}

export async function login(formData: FormData) {
  const supabase = await createClient()

  const email = formData.get('email') as string
  const password = formData.get('password') as string

  const validated = AuthSchema.safeParse({ email, password })
  if (!validated.success) {
    return { error: 'อีเมลหรือรหัสผ่านไม่ถูกต้อง' }
  }

  const { error } = await supabase.auth.signInWithPassword({
    email,
    password,
  })

  if (error) {
    if (error.message.includes('Invalid login credentials')) {
      return { error: 'อีเมลหรือรหัสผ่านไม่ถูกต้อง กรุณาลองใหม่อีกครั้ง' }
    }
    if (error.message.includes('Email not confirmed')) {
      return { error: 'กรุณายืนยันอีเมลของคุณก่อนเข้าสู่ระบบ' }
    }
    return { error: error.message }
  }

  revalidatePath('/', 'layout')
  redirect('/generate')
}
