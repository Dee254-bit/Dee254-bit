"use client"

import { useAuth } from "@/lib/auth-context"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { Badge } from "@/components/ui/badge"
import {
  FileText,
  ScanText,
  Layers,
  FileDown,
  Edit,
  FileOutput,
  TrendingUp,
  Calendar,
  HardDrive,
  User,
  Settings,
  LogOut,
} from "lucide-react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { useEffect } from "react"

export default function DashboardContent() {
  const { user, logout, loading } = useAuth()
  const router = useRouter()

  useEffect(() => {
    if (!loading && !user) {
      router.push("/login")
    }
  }, [user, loading, router])

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary"></div>
      </div>
    )
  }

  if (!user) {
    return null
  }

  const usagePercentage = (user.usage.current / user.usage.limit) * 100

  const tools = [
    {
      icon: <ScanText className="h-8 w-8 text-primary" />,
      title: "OCR",
      description: "Extract text from PDFs",
      link: "/tools/ocr",
      usage: "12 files this month",
    },
    {
      icon: <Layers className="h-8 w-8 text-primary" />,
      title: "Merge & Split",
      description: "Combine or separate PDFs",
      link: "/tools/merge-split",
      usage: "8 files this month",
    },
    {
      icon: <FileDown className="h-8 w-8 text-primary" />,
      title: "Compress",
      description: "Reduce file sizes",
      link: "/tools/compress",
      usage: "5 files this month",
    },
    {
      icon: <Edit className="h-8 w-8 text-primary" />,
      title: "Edit",
      description: "Modify PDF content",
      link: "/tools/edit",
      usage: "3 files this month",
    },
    {
      icon: <FileOutput className="h-8 w-8 text-primary" />,
      title: "Convert",
      description: "Change file formats",
      link: "/tools/convert",
      usage: "7 files this month",
    },
    {
      icon: <FileText className="h-8 w-8 text-primary" />,
      title: "Create",
      description: "Generate new PDFs",
      link: "/tools/create",
      usage: "Coming soon",
    },
  ]

  const recentActivity = [
    { action: "OCR processed", file: "invoice_2024.pdf", time: "2 hours ago" },
    { action: "PDF merged", file: "reports_combined.pdf", time: "1 day ago" },
    { action: "File compressed", file: "presentation.pdf", time: "2 days ago" },
    { action: "Document converted", file: "contract.docx", time: "3 days ago" },
  ]

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <Link href="/" className="flex items-center space-x-2">
                <FileText className="h-6 w-6 text-primary" />
                <span className="text-xl font-bold">PDF Master</span>
              </Link>
              <Badge variant="secondary">{user.plan}</Badge>
            </div>

            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2">
                {user.avatar ? (
                  <img src={user.avatar || "/placeholder.svg"} alt={user.name} className="h-8 w-8 rounded-full" />
                ) : (
                  <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center">
                    <User className="h-4 w-4 text-primary" />
                  </div>
                )}
                <span className="font-medium">{user.name}</span>
              </div>

              <Button variant="ghost" size="sm">
                <Settings className="h-4 w-4" />
              </Button>

              <Button variant="ghost" size="sm" onClick={logout}>
                <LogOut className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">Welcome back, {user.name}!</h1>
          <p className="text-muted-foreground">Here's what's happening with your PDF processing</p>
        </div>

        {/* Usage Overview */}
        <div className="grid md:grid-cols-3 gap-6 mb-8">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Monthly Usage</CardTitle>
              <HardDrive className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{user.usage.current.toFixed(1)} MB</div>
              <p className="text-xs text-muted-foreground">of {user.usage.limit} MB limit</p>
              <Progress value={usagePercentage} className="mt-2" />
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Files Processed</CardTitle>
              <TrendingUp className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">35</div>
              <p className="text-xs text-muted-foreground">+12% from last month</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Plan Status</CardTitle>
              <Calendar className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold capitalize">{user.plan}</div>
              <p className="text-xs text-muted-foreground">
                {user.plan === "free" ? "Upgrade for more features" : "Renews monthly"}
              </p>
            </CardContent>
          </Card>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Tools Grid */}
          <div className="lg:col-span-2">
            <h2 className="text-xl font-semibold mb-4">Your Tools</h2>
            <div className="grid md:grid-cols-2 gap-4">
              {tools.map((tool, index) => (
                <Card key={index} className="hover:shadow-md transition-shadow">
                  <CardHeader className="pb-3">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-3">
                        {tool.icon}
                        <div>
                          <CardTitle className="text-lg">{tool.title}</CardTitle>
                          <CardDescription>{tool.description}</CardDescription>
                        </div>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-muted-foreground">{tool.usage}</span>
                      <Button asChild size="sm">
                        <Link href={tool.link}>Use Tool</Link>
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>

          {/* Recent Activity */}
          <div>
            <h2 className="text-xl font-semibold mb-4">Recent Activity</h2>
            <Card>
              <CardContent className="p-0">
                <div className="space-y-0">
                  {recentActivity.map((activity, index) => (
                    <div key={index} className="p-4 border-b last:border-b-0">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="font-medium text-sm">{activity.action}</p>
                          <p className="text-sm text-muted-foreground">{activity.file}</p>
                        </div>
                        <span className="text-xs text-muted-foreground">{activity.time}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Quick Actions */}
            <div className="mt-6">
              <h3 className="font-semibold mb-3">Quick Actions</h3>
              <div className="space-y-2">
                <Button asChild variant="outline" className="w-full justify-start">
                  <Link href="/tools/ocr">
                    <ScanText className="mr-2 h-4 w-4" />
                    Extract Text from PDF
                  </Link>
                </Button>
                <Button asChild variant="outline" className="w-full justify-start">
                  <Link href="/tools/merge-split">
                    <Layers className="mr-2 h-4 w-4" />
                    Merge PDFs
                  </Link>
                </Button>
                <Button asChild variant="outline" className="w-full justify-start">
                  <Link href="/pricing">
                    <TrendingUp className="mr-2 h-4 w-4" />
                    Upgrade Plan
                  </Link>
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
