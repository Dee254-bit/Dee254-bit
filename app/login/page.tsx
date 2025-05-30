import type { Metadata } from "next"
import LoginForm from "@/components/auth/login-form"
import Link from "next/link"
import { FileText } from "lucide-react"

export const metadata: Metadata = {
  title: "Login | PDF Master",
  description: "Sign in to your PDF Master account",
}

export default function LoginPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div className="text-center">
          <Link href="/" className="flex items-center justify-center space-x-2">
            <FileText className="h-8 w-8 text-primary" />
            <span className="text-2xl font-bold">PDF Master</span>
          </Link>
          <h2 className="mt-6 text-3xl font-bold text-gray-900">Sign in to your account</h2>
          <p className="mt-2 text-sm text-gray-600">
            Or{" "}
            <Link href="/signup" className="font-medium text-primary hover:text-primary/80">
              create a new account
            </Link>
          </p>
        </div>

        <LoginForm />

        <div className="text-center">
          <p className="text-sm text-gray-600">Demo credentials: demo@pdfmaster.com / demo123</p>
        </div>
      </div>
    </div>
  )
}
