"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { FileUp } from "lucide-react"
import Link from "next/link"
import { useRouter } from "next/navigation"

export default function HeroSection() {
  const [isDragging, setIsDragging] = useState(false)
  const router = useRouter()

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(true)
  }

  const handleDragLeave = () => {
    setIsDragging(false)
  }

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(false)

    const files = e.dataTransfer.files
    if (files.length > 0 && files[0].type === "application/pdf") {
      // Handle the file upload
      handleFileUpload(files[0])
    }
  }

  const handleFileUpload = (file: File) => {
    // Create a FormData object to send the file
    const formData = new FormData()
    formData.append("file", file)

    // Redirect to the dashboard with the file
    router.push("/tools/ocr")

    // In a real implementation, you would upload the file to the server
    // and then redirect to the appropriate tool
  }

  return (
    <section className="bg-gradient-to-b from-gray-50 to-white py-20 lg:py-32">
      <div className="container px-4 md:px-6">
        <div className="flex flex-col items-center text-center space-y-8">
          <div className="space-y-4 max-w-3xl">
            <h1 className="text-4xl font-bold tracking-tighter sm:text-5xl md:text-6xl">
              The Complete PDF Solution for <span className="text-primary">Every Need</span>
            </h1>
            <p className="text-xl text-muted-foreground md:text-2xl max-w-[700px] mx-auto">
              Edit, convert, compress, and extract text from PDFs with our powerful all-in-one platform.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row gap-4">
            <Button asChild size="lg">
              <Link href="/tools">Explore Tools</Link>
            </Button>
            <Button variant="outline" size="lg" asChild>
              <Link href="/about">Learn More</Link>
            </Button>
          </div>

          <div
            className={`w-full max-w-3xl mt-8 border-2 border-dashed rounded-lg p-12 transition-colors ${
              isDragging ? "border-primary bg-primary/5" : "border-gray-300"
            }`}
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onDrop={handleDrop}
          >
            <div className="flex flex-col items-center space-y-4">
              <FileUp className="h-12 w-12 text-muted-foreground" />
              <h3 className="text-xl font-medium">Drag & drop your PDF here</h3>
              <p className="text-muted-foreground">or</p>
              <Button variant="secondary">Browse Files</Button>
              <p className="text-sm text-muted-foreground">Max file size: 200MB</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
