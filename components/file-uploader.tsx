"use client"

import type React from "react"

import { useState, useRef } from "react"
import { Button } from "@/components/ui/button"
import { FileUp } from "lucide-react"

interface FileUploaderProps {
  onFileChange: (file: File | null) => void
  accept?: string
  maxSize?: number // in MB
}

export default function FileUploader({ onFileChange, accept = ".pdf", maxSize = 200 }: FileUploaderProps) {
  const [isDragging, setIsDragging] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)

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
    if (files.length > 0) {
      validateAndSetFile(files[0])
    }
  }

  const handleFileInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files
    if (files && files.length > 0) {
      validateAndSetFile(files[0])
    }
  }

  const validateAndSetFile = (file: File) => {
    setError(null)

    // Check file type
    const fileType = file.type
    const fileExtension = file.name.split(".").pop()?.toLowerCase()

    const acceptedTypes = accept.split(",").map((type) => type.trim())
    const isValidType = acceptedTypes.some((type) => {
      if (type.startsWith(".")) {
        return `.${fileExtension}` === type
      }
      return fileType.match(type)
    })

    if (!isValidType) {
      setError(`Invalid file type. Please upload ${accept} files.`)
      return
    }

    // Check file size
    const fileSizeInMB = file.size / (1024 * 1024)
    if (fileSizeInMB > maxSize) {
      setError(`File size exceeds ${maxSize}MB limit.`)
      return
    }

    onFileChange(file)
  }

  const handleBrowseClick = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click()
    }
  }

  return (
    <div>
      <div
        className={`border-2 border-dashed rounded-lg p-8 transition-colors ${
          isDragging ? "border-primary bg-primary/5" : error ? "border-destructive" : "border-gray-300"
        }`}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
      >
        <div className="flex flex-col items-center space-y-4">
          <FileUp className="h-10 w-10 text-muted-foreground" />
          <div className="text-center">
            <h3 className="text-lg font-medium">Drag & drop your file here</h3>
            <p className="text-sm text-muted-foreground mt-1">or</p>
          </div>
          <Button type="button" variant="secondary" onClick={handleBrowseClick}>
            Browse Files
          </Button>
          <input ref={fileInputRef} type="file" className="hidden" accept={accept} onChange={handleFileInputChange} />
          <p className="text-xs text-muted-foreground">
            Supported formats: {accept} (Max: {maxSize}MB)
          </p>
        </div>
      </div>

      {error && <p className="mt-2 text-sm text-destructive">{error}</p>}
    </div>
  )
}
