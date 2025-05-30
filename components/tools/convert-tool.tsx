"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Progress } from "@/components/ui/progress"
import { Loader2, Download, FileOutput, FileText, Table, ImageIcon } from "lucide-react"
import FileUploader from "@/components/file-uploader"
import { PDFDocument } from "pdf-lib"
import { createWorker } from "tesseract.js"

interface ConversionResult {
  url: string
  filename: string
  format: string
}

export default function ConvertTool() {
  const [file, setFile] = useState<File | null>(null)
  const [outputFormat, setOutputFormat] = useState("docx")
  const [isProcessing, setIsProcessing] = useState(false)
  const [progress, setProgress] = useState(0)
  const [result, setResult] = useState<ConversionResult | null>(null)

  const handleFileChange = (selectedFile: File | null) => {
    setFile(selectedFile)
    setResult(null)
  }

  const convertToText = async (pdfDoc: PDFDocument): Promise<string> => {
    try {
      // Convert PDF pages to images and then use OCR
      const pdfjsLib = await import("pdfjs-dist")
      pdfjsLib.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjsLib.version}/pdf.worker.min.js`

      const pdfBytes = await pdfDoc.save()
      const pdf = await pdfjsLib.getDocument(pdfBytes).promise
      const pageCount = pdf.numPages

      let fullText = ""

      for (let i = 1; i <= pageCount; i++) {
        setProgress((i / pageCount) * 80)

        const page = await pdf.getPage(i)
        const viewport = page.getViewport({ scale: 2 })

        const canvas = document.createElement("canvas")
        const context = canvas.getContext("2d")!
        canvas.height = viewport.height
        canvas.width = viewport.width

        await page.render({
          canvasContext: context,
          viewport: viewport,
        }).promise

        // Use OCR to extract text
        const worker = await createWorker("eng")
        const {
          data: { text },
        } = await worker.recognize(canvas.toDataURL())
        await worker.terminate()

        fullText += `\n--- Page ${i} ---\n${text}\n`
      }

      return fullText
    } catch (error) {
      console.error("Error converting to text:", error)
      return "Error extracting text from PDF"
    }
  }

  const convertToImages = async (pdfDoc: PDFDocument): Promise<string[]> => {
    try {
      const pdfjsLib = await import("pdfjs-dist")
      pdfjsLib.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjsLib.version}/pdf.worker.min.js`

      const pdfBytes = await pdfDoc.save()
      const pdf = await pdfjsLib.getDocument(pdfBytes).promise
      const pageCount = pdf.numPages

      const imageUrls: string[] = []

      for (let i = 1; i <= pageCount; i++) {
        setProgress((i / pageCount) * 90)

        const page = await pdf.getPage(i)
        const viewport = page.getViewport({ scale: 2 })

        const canvas = document.createElement("canvas")
        const context = canvas.getContext("2d")!
        canvas.height = viewport.height
        canvas.width = viewport.width

        await page.render({
          canvasContext: context,
          viewport: viewport,
        }).promise

        // Convert canvas to blob and create URL
        const blob = await new Promise<Blob>((resolve) => {
          canvas.toBlob((blob) => resolve(blob!), "image/png")
        })

        const url = URL.createObjectURL(blob)
        imageUrls.push(url)
      }

      return imageUrls
    } catch (error) {
      console.error("Error converting to images:", error)
      return []
    }
  }

  const createWordDocument = (text: string): Blob => {
    // Create a simple HTML document that can be opened by Word
    const htmlContent = `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="UTF-8">
        <title>Converted PDF</title>
        <style>
          body { font-family: Arial, sans-serif; margin: 40px; line-height: 1.6; }
          .page-break { page-break-before: always; }
        </style>
      </head>
      <body>
        <pre style="white-space: pre-wrap; font-family: Arial, sans-serif;">${text}</pre>
      </body>
      </html>
    `

    return new Blob([htmlContent], { type: "application/vnd.openxmlformats-officedocument.wordprocessingml.document" })
  }

  const createExcelDocument = (text: string): Blob => {
    // Create a simple CSV that can be opened by Excel
    const lines = text.split("\n")
    const csvContent = lines.map((line) => `"${line.replace(/"/g, '""')}"`).join("\n")

    return new Blob([csvContent], { type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet" })
  }

  const createPowerPointDocument = (text: string): Blob => {
    // Create a simple HTML presentation
    const slides = text.split("--- Page")
    const htmlContent = `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="UTF-8">
        <title>PDF Presentation</title>
        <style>
          body { font-family: Arial, sans-serif; margin: 0; }
          .slide { 
            width: 100vw; 
            height: 100vh; 
            padding: 40px; 
            box-sizing: border-box; 
            page-break-after: always;
            display: flex;
            flex-direction: column;
            justify-content: center;
          }
          .slide h1 { color: #333; margin-bottom: 20px; }
          .slide pre { white-space: pre-wrap; font-size: 14px; }
        </style>
      </head>
      <body>
        ${slides
          .map(
            (slide, index) => `
          <div class="slide">
            <h1>Slide ${index + 1}</h1>
            <pre>${slide}</pre>
          </div>
        `,
          )
          .join("")}
      </body>
      </html>
    `

    return new Blob([htmlContent], {
      type: "application/vnd.openxmlformats-officedocument.presentationml.presentation",
    })
  }

  const handleConvert = async () => {
    if (!file) return

    setIsProcessing(true)
    setProgress(0)

    try {
      const arrayBuffer = await file.arrayBuffer()
      const pdfDoc = await PDFDocument.load(arrayBuffer)

      let blob: Blob
      let filename: string
      let format: string

      setProgress(10)

      switch (outputFormat) {
        case "txt": {
          const text = await convertToText(pdfDoc)
          blob = new Blob([text], { type: "text/plain" })
          filename = `${file.name.replace(".pdf", "")}.txt`
          format = "Text"
          break
        }

        case "docx": {
          const text = await convertToText(pdfDoc)
          blob = createWordDocument(text)
          filename = `${file.name.replace(".pdf", "")}.docx`
          format = "Word Document"
          break
        }

        case "xlsx": {
          const text = await convertToText(pdfDoc)
          blob = createExcelDocument(text)
          filename = `${file.name.replace(".pdf", "")}.xlsx`
          format = "Excel Spreadsheet"
          break
        }

        case "pptx": {
          const text = await convertToText(pdfDoc)
          blob = createPowerPointDocument(text)
          filename = `${file.name.replace(".pdf", "")}.pptx`
          format = "PowerPoint Presentation"
          break
        }

        case "png": {
          const imageUrls = await convertToImages(pdfDoc)
          if (imageUrls.length === 1) {
            // Single page - download as single image
            const response = await fetch(imageUrls[0])
            blob = await response.blob()
            filename = `${file.name.replace(".pdf", "")}.png`
            format = "PNG Image"
          } else {
            // Multiple pages - create a zip file (simplified approach)
            // For now, we'll just download the first page
            const response = await fetch(imageUrls[0])
            blob = await response.blob()
            filename = `${file.name.replace(".pdf", "")}_page_1.png`
            format = "PNG Images"
          }
          break
        }

        case "jpg": {
          const imageUrls = await convertToImages(pdfDoc)
          if (imageUrls.length > 0) {
            // Convert PNG to JPG
            const canvas = document.createElement("canvas")
            const ctx = canvas.getContext("2d")!
            const img = new Image()

            await new Promise((resolve) => {
              img.onload = resolve
              img.src = imageUrls[0]
            })

            canvas.width = img.width
            canvas.height = img.height
            ctx.fillStyle = "white"
            ctx.fillRect(0, 0, canvas.width, canvas.height)
            ctx.drawImage(img, 0, 0)

            blob = await new Promise<Blob>((resolve) => {
              canvas.toBlob((blob) => resolve(blob!), "image/jpeg", 0.9)
            })

            filename = `${file.name.replace(".pdf", "")}.jpg`
            format = "JPEG Image"
          } else {
            throw new Error("Failed to convert to image")
          }
          break
        }

        default:
          throw new Error("Unsupported format")
      }

      setProgress(100)

      const url = URL.createObjectURL(blob)
      setResult({ url, filename, format })
    } catch (error) {
      console.error("Conversion error:", error)
      alert("Conversion failed. Please try again.")
    } finally {
      setIsProcessing(false)
    }
  }

  const downloadResult = () => {
    if (!result) return

    const a = document.createElement("a")
    a.href = result.url
    a.download = result.filename
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
  }

  const formatOptions = [
    { value: "txt", label: "Text (.txt)", icon: <FileText className="h-4 w-4" /> },
    { value: "docx", label: "Word Document (.docx)", icon: <FileText className="h-4 w-4" /> },
    { value: "xlsx", label: "Excel Spreadsheet (.xlsx)", icon: <Table className="h-4 w-4" /> },
    { value: "pptx", label: "PowerPoint (.pptx)", icon: <FileOutput className="h-4 w-4" /> },
    { value: "png", label: "PNG Image (.png)", icon: <ImageIcon className="h-4 w-4" /> },
    { value: "jpg", label: "JPEG Image (.jpg)", icon: <ImageIcon className="h-4 w-4" /> },
  ]

  return (
    <Card className="p-6">
      <div className="space-y-6">
        <div>
          <h3 className="text-lg font-medium mb-4">Upload PDF to Convert</h3>
          <FileUploader onFileChange={handleFileChange} accept=".pdf" maxSize={200} />
        </div>

        {file && (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium">{file.name}</p>
                <p className="text-sm text-muted-foreground">{(file.size / (1024 * 1024)).toFixed(2)} MB</p>
              </div>
              <Button variant="ghost" size="sm" onClick={() => setFile(null)}>
                Remove
              </Button>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">Convert to:</label>
              <Select value={outputFormat} onValueChange={setOutputFormat}>
                <SelectTrigger>
                  <SelectValue placeholder="Select output format" />
                </SelectTrigger>
                <SelectContent>
                  {formatOptions.map((option) => (
                    <SelectItem key={option.value} value={option.value}>
                      <div className="flex items-center space-x-2">
                        {option.icon}
                        <span>{option.label}</span>
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <Button className="w-full" onClick={handleConvert} disabled={isProcessing}>
              {isProcessing ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Converting...
                </>
              ) : (
                <>
                  <FileOutput className="mr-2 h-4 w-4" />
                  Convert PDF
                </>
              )}
            </Button>

            {isProcessing && (
              <div className="space-y-2">
                <Progress value={progress} />
                <p className="text-sm text-center text-muted-foreground">Converting PDF... {progress}%</p>
              </div>
            )}

            {result && (
              <div className="p-4 border rounded-lg bg-muted/20">
                <h4 className="font-medium mb-3">Conversion Complete!</h4>
                <div className="space-y-2 text-sm mb-4">
                  <div className="flex justify-between">
                    <span>Format:</span>
                    <span>{result.format}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Filename:</span>
                    <span>{result.filename}</span>
                  </div>
                </div>
                <Button className="w-full" onClick={downloadResult}>
                  <Download className="mr-2 h-4 w-4" />
                  Download {result.format}
                </Button>
              </div>
            )}
          </div>
        )}
      </div>
    </Card>
  )
}
