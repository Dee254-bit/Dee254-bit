import type { Metadata } from "next"
import CompressTool from "@/components/tools/compress-tool"

export const metadata: Metadata = {
  title: "Compress PDF | PDF Master",
  description: "Reduce PDF file size while maintaining quality",
}

export default function CompressPage() {
  return (
    <div className="container py-12">
      <div className="max-w-3xl mx-auto space-y-6">
        <div className="text-center space-y-2">
          <h1 className="text-3xl font-bold">Compress PDF</h1>
          <p className="text-muted-foreground">
            Reduce file size while maintaining quality for easier sharing and storage
          </p>
        </div>

        <CompressTool />
      </div>
    </div>
  )
}
