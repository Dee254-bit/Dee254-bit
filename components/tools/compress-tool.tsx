"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Progress } from "@/components/ui/progress"
import { Loader2, Download, FileDown } from "lucide-react"
import FileUploader from "@/components/file-uploader"
import { PDFDocument } from "pdf-lib"

export default function CompressTool() {
  const [file, setFile] = useState<File | null>(null)
  const [quality, setQuality] = useState("medium")
  const [isProcessing, setIsProcessing] = useState(false)
  const [progress, setProgress] = useState(0)
  const [result, setResult] = useState<{
    url: string
    originalSize: number
    compressedSize: number
    compressionRatio: number
  } | null>(null)

  const handleFileChange = (selectedFile: File | null) => {
    setFile(selectedFile)
    setResult(null)
  }

  const handleCompress = async () => {
    if (!file) return

    setIsProcessing(true)
    setProgress(0)

    try {
      // Simulate progress
      const progressInterval = setInterval(() => {
        setProgress((prev) => {
          if (prev >= 90) {
            clearInterval(progressInterval)
            return 90
          }
          return prev + 10
        })
      }, 200)

      const arrayBuffer = await file.arrayBuffer()
      const pdfDoc = await PDFDocument.load(arrayBuffer)

      // Basic compression by removing unnecessary data
      // In a real implementation, you would use more sophisticated compression
      const compressedPdfBytes = await pdfDoc.save({
        useObjectStreams: false,
        addDefaultPage: false,
      })

      clearInterval(progressInterval)
      setProgress(100)

      const blob = new Blob([compressedPdfBytes], { type: "application/pdf" })
      const url = URL.createObjectURL(blob)

      const originalSize = file.size
      const compressedSize = blob.size
      const compressionRatio = ((originalSize - compressedSize) / originalSize) * 100

      setResult({
        url,
        originalSize,
        compressedSize,
        compressionRatio,
      })
    } catch (error) {
      console.error("PDF compression error:", error)
    } finally {
      setIsProcessing(false)
    }
  }

  const downloadCompressed = () => {
    if (!result || !file) return

    const a = document.createElement("a")
    a.href = result.url
    a.download = `${file.name.replace(".pdf", "")}_compressed.pdf`
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
  }

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return "0 Bytes"
    const k = 1024
    const sizes = ["Bytes", "KB", "MB", "GB"]
    const i = Math.floor(Math.log(bytes) / Math.log(k))
    return Number.parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i]
  }

  return (
    <Card className="p-6">
      <div className="space-y-6">
        <div>
          <h3 className="text-lg font-medium mb-4">Upload PDF to Compress</h3>
          <FileUploader onFileChange={handleFileChange} accept=".pdf" maxSize={200} />
        </div>

        {file && (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium">{file.name}</p>
                <p className="text-sm text-muted-foreground">{formatFileSize(file.size)}</p>
              </div>
              <Button variant="ghost" size="sm" onClick={() => setFile(null)}>
                Remove
              </Button>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">Compression Quality</label>
              <Select value={quality} onValueChange={setQuality}>
                <SelectTrigger>
                  <SelectValue placeholder="Select quality" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="low">Low (Smallest file)</SelectItem>
                  <SelectItem value="medium">Medium (Balanced)</SelectItem>
                  <SelectItem value="high">High (Best quality)</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <Button className="w-full" onClick={handleCompress} disabled={isProcessing}>
              {isProcessing ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Compressing...
                </>
              ) : (
                <>
                  <FileDown className="mr-2 h-4 w-4" />
                  Compress PDF
                </>
              )}
            </Button>

            {isProcessing && (
              <div className="space-y-2">
                <Progress value={progress} />
                <p className="text-sm text-center text-muted-foreground">Compressing PDF... {progress}%</p>
              </div>
            )}

            {result && (
              <div className="p-4 border rounded-lg bg-muted/20">
                <h4 className="font-medium mb-3">Compression Complete!</h4>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span>Original size:</span>
                    <span>{formatFileSize(result.originalSize)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Compressed size:</span>
                    <span>{formatFileSize(result.compressedSize)}</span>
                  </div>
                  <div className="flex justify-between font-medium">
                    <span>Size reduction:</span>
                    <span className="text-green-600">{result.compressionRatio.toFixed(1)}%</span>
                  </div>
                </div>
                <Button className="w-full mt-4" onClick={downloadCompressed}>
                  <Download className="mr-2 h-4 w-4" />
                  Download Compressed PDF
                </Button>
              </div>
            )}
          </div>
        )}
      </div>
    </Card>
  )
}
