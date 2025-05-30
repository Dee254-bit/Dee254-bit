import type { Metadata } from "next"
import MergeSplitTool from "@/components/tools/merge-split-tool"

export const metadata: Metadata = {
  title: "Merge & Split PDFs | PDF Master",
  description: "Combine multiple PDFs into one or split a single PDF into multiple documents",
}

export default function MergeSplitPage() {
  return (
    <div className="container py-12">
      <div className="max-w-4xl mx-auto space-y-6">
        <div className="text-center space-y-2">
          <h1 className="text-3xl font-bold">Merge & Split PDFs</h1>
          <p className="text-muted-foreground">
            Combine multiple PDFs into one or split a single PDF into multiple documents
          </p>
        </div>

        <MergeSplitTool />
      </div>
    </div>
  )
}
