import type { Metadata } from "next"
import AdvancedOcrTool from "@/components/tools/advanced-ocr-tool"

export const metadata: Metadata = {
  title: "Advanced OCR Tool - Extract Text from PDFs | PDF Master",
  description: "Extract text from scanned PDFs and images with high accuracy using advanced OCR technology",
}

export default function OcrPage() {
  return (
    <div className="container py-12">
      <div className="max-w-6xl mx-auto space-y-6">
        <div className="text-center space-y-2">
          <h1 className="text-3xl font-bold">Advanced OCR Tool</h1>
          <p className="text-muted-foreground">
            Extract text from scanned PDFs and images with industry-leading accuracy and export directly to Word
          </p>
        </div>

        <AdvancedOcrTool />
      </div>
    </div>
  )
}
