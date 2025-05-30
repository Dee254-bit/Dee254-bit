import type { Metadata } from "next"
import SignupForm from "@/components/auth/signup-form"
import Link from "next/link"
import { FileText } from "lucide-react"

export const metadata: Metadata = {
  title: "Sign Up | PDF Master",
  description: "Create your PDF Master account",
}

export default function SignupPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div className="text-center">
          <Link href="/" className="flex items-center justify-center space-x-2">
            <FileText className="h-8 w-8 text-primary" />
            <span className="text-2xl font-bold">PDF Master</span>
          </Link>
          <h2 className="mt-6 text-3xl font-bold text-gray-900">Create your account</h2>
          <p className="mt-2 text-sm text-gray-600">
            Or{" "}
            <Link href="/login" className="font-medium text-primary hover:text-primary/80">
              sign in to existing account
            </Link>
          </p>
        </div>

        <SignupForm />
      </div>
    </div>
  )
}
