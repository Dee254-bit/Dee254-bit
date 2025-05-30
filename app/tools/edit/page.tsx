import type { Metadata } from "next"
import EditTool from "@/components/tools/edit-tool"

export const metadata: Metadata = {
  title: "Edit PDF | PDF Master",
  description: "Edit PDF documents - add text, images, rotate pages, and more",
}

export default function EditPage() {
  return (
    <div className="container py-12">
      <div className="max-w-6xl mx-auto space-y-6">
        <div className="text-center space-y-2">
          <h1 className="text-3xl font-bold">Edit PDF</h1>
          <p className="text-muted-foreground">Add text, images, rotate pages, and modify your PDF documents</p>
        </div>

        <EditTool />
      </div>
    </div>
  )
}
