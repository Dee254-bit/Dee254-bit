import type { Metadata } from "next"
import ConvertTool from "@/components/tools/convert-tool"

export const metadata: Metadata = {
  title: "Convert PDF | PDF Master",
  description: "Convert PDFs to Word, Excel, PowerPoint, images, and other formats",
}

export default function ConvertPage() {
  return (
    <div className="container py-12">
      <div className="max-w-3xl mx-auto space-y-6">
        <div className="text-center space-y-2">
          <h1 className="text-3xl font-bold">Convert PDF</h1>
          <p className="text-muted-foreground">
            Transform PDFs to Word, Excel, PowerPoint, images, and many other formats
          </p>
        </div>

        <ConvertTool />
      </div>
    </div>
  )
}
