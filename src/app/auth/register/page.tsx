import { RegisterForm } from '@/components/auth/register-form'

export default function RegisterPage() {
  return (
    <div className="flex h-screen w-full items-center justify-center bg-gray-50">
      <div className="w-full max-w-md space-y-8 px-4">
        <div className="text-center">
          <h2 className="text-3xl font-bold tracking-tight text-gray-900">Create an account</h2>
          <p className="mt-2 text-sm text-gray-600">Get started with AI Content Publisher.</p>
        </div>
        <div className="mt-8 rounded-xl bg-white p-8 shadow-sm border">
          <RegisterForm />
          <div className="mt-6 text-center text-sm text-gray-500">
            Already have an account?{' '}
            <a href="/auth/login" className="font-semibold text-blue-600 hover:text-blue-500 underline underline-offset-4">
              Login here
            </a>
          </div>
        </div>
      </div>
    </div>
  )
}
