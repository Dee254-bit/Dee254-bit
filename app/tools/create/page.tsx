import type { Metadata } from "next"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { FileText, Clock, Mail } from "lucide-react"
import Link from "next/link"

export const metadata: Metadata = {
  title: "Create PDF - Coming Soon | PDF Master",
  description: "PDF creation tool coming soon to PDF Master",
}

export default function CreatePage() {
  return (
    <div className="container py-12">
      <div className="max-w-2xl mx-auto text-center space-y-8">
        <div className="space-y-4">
          <FileText className="h-16 w-16 text-primary mx-auto" />
          <h1 className="text-4xl font-bold">PDF Creation Tool</h1>
          <p className="text-xl text-muted-foreground">
            We're working hard to bring you the best PDF creation experience. This tool will be available soon!
          </p>
        </div>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center justify-center">
              <Clock className="h-5 w-5 mr-2" />
              Coming Soon
            </CardTitle>
            <CardDescription>Expected launch: Q2 2024</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-muted-foreground">Our PDF creation tool will allow you to:</p>
            <ul className="text-left space-y-2 text-sm">
              <li className="flex items-center">
                <div className="w-2 h-2 bg-primary rounded-full mr-3" />
                Create PDFs from multiple file formats
              </li>
              <li className="flex items-center">
                <div className="w-2 h-2 bg-primary rounded-full mr-3" />
                Use professional templates
              </li>
              <li className="flex items-center">
                <div className="w-2 h-2 bg-primary rounded-full mr-3" />
                Add custom headers and footers
              </li>
              <li className="flex items-center">
                <div className="w-2 h-2 bg-primary rounded-full mr-3" />
                Insert watermarks and signatures
              </li>
              <li className="flex items-center">
                <div className="w-2 h-2 bg-primary rounded-full mr-3" />
                Batch create multiple PDFs
              </li>
            </ul>
          </CardContent>
        </Card>

        <div className="space-y-4">
          <h3 className="text-lg font-medium">Get Notified When It's Ready</h3>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button asChild>
              <Link href="/contact">
                <Mail className="mr-2 h-4 w-4" />
                Notify Me
              </Link>
            </Button>
            <Button variant="outline" asChild>
              <Link href="/tools">Explore Other Tools</Link>
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}
