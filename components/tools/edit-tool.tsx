"use client"

import type React from "react"

import { useState, useRef } from "react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Progress } from "@/components/ui/progress"
import { Loader2, Download, Type, ImageIcon, Trash2, RotateCw } from "lucide-react"
import FileUploader from "@/components/file-uploader"
import { PDFDocument, rgb, StandardFonts } from "pdf-lib"

interface TextAnnotation {
  id: string
  text: string
  x: number
  y: number
  fontSize: number
  color: string
  fontFamily: string
}

interface ImageAnnotation {
  id: string
  imageData: string
  x: number
  y: number
  width: number
  height: number
}

export default function EditTool() {
  const [file, setFile] = useState<File | null>(null)
  const [isProcessing, setIsProcessing] = useState(false)
  const [progress, setProgress] = useState(0)
  const [pdfDoc, setPdfDoc] = useState<PDFDocument | null>(null)
  const [currentPage, setCurrentPage] = useState(0)
  const [totalPages, setTotalPages] = useState(0)
  const [textAnnotations, setTextAnnotations] = useState<TextAnnotation[]>([])
  const [imageAnnotations, setImageAnnotations] = useState<ImageAnnotation[]>([])
  const [selectedTool, setSelectedTool] = useState<"text" | "image" | "move">("text")
  const [newText, setNewText] = useState("")
  const [fontSize, setFontSize] = useState(12)
  const [textColor, setTextColor] = useState("#000000")
  const [fontFamily, setFontFamily] = useState("Helvetica")
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const handleFileChange = async (selectedFile: File | null) => {
    if (!selectedFile) return

    setFile(selectedFile)
    setIsProcessing(true)
    setProgress(0)

    try {
      const arrayBuffer = await selectedFile.arrayBuffer()
      const doc = await PDFDocument.load(arrayBuffer)
      setPdfDoc(doc)
      setTotalPages(doc.getPageCount())
      setCurrentPage(0)
      setProgress(50)

      // Render first page
      await renderPage(doc, 0)
      setProgress(100)
    } catch (error) {
      console.error("Error loading PDF:", error)
    } finally {
      setIsProcessing(false)
    }
  }

  const renderPage = async (doc: PDFDocument, pageIndex: number) => {
    if (!canvasRef.current) return

    try {
      // Use PDF.js to render the page
      const pdfjsLib = await import("pdfjs-dist")
      pdfjsLib.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjsLib.version}/pdf.worker.min.js`

      const pdfBytes = await doc.save()
      const pdf = await pdfjsLib.getDocument(pdfBytes).promise
      const page = await pdf.getPage(pageIndex + 1)

      const canvas = canvasRef.current
      const context = canvas.getContext("2d")!
      const viewport = page.getViewport({ scale: 1.5 })

      canvas.height = viewport.height
      canvas.width = viewport.width

      await page.render({
        canvasContext: context,
        viewport: viewport,
      }).promise

      // Render annotations on top
      renderAnnotations(context, viewport.width, viewport.height)
    } catch (error) {
      console.error("Error rendering page:", error)
    }
  }

  const renderAnnotations = (context: CanvasRenderingContext2D, width: number, height: number) => {
    // Render text annotations
    textAnnotations.forEach((annotation) => {
      context.font = `${annotation.fontSize}px ${annotation.fontFamily}`
      context.fillStyle = annotation.color
      context.fillText(annotation.text, annotation.x, annotation.y)
    })

    // Render image annotations
    imageAnnotations.forEach((annotation) => {
      const img = new Image()
      img.onload = () => {
        context.drawImage(img, annotation.x, annotation.y, annotation.width, annotation.height)
      }
      img.src = annotation.imageData
    })
  }

  const handleCanvasClick = (event: React.MouseEvent<HTMLCanvasElement>) => {
    if (!canvasRef.current) return

    const rect = canvasRef.current.getBoundingClientRect()
    const x = event.clientX - rect.left
    const y = event.clientY - rect.top

    if (selectedTool === "text" && newText.trim()) {
      const annotation: TextAnnotation = {
        id: Date.now().toString(),
        text: newText,
        x,
        y,
        fontSize,
        color: textColor,
        fontFamily,
      }
      setTextAnnotations((prev) => [...prev, annotation])
      setNewText("")

      // Re-render canvas
      if (pdfDoc) {
        renderPage(pdfDoc, currentPage)
      }
    }
  }

  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (!file) return

    const reader = new FileReader()
    reader.onload = (e) => {
      const imageData = e.target?.result as string
      const annotation: ImageAnnotation = {
        id: Date.now().toString(),
        imageData,
        x: 100,
        y: 100,
        width: 100,
        height: 100,
      }
      setImageAnnotations((prev) => [...prev, annotation])

      // Re-render canvas
      if (pdfDoc) {
        renderPage(pdfDoc, currentPage)
      }
    }
    reader.readAsDataURL(file)
  }

  const removeTextAnnotation = (id: string) => {
    setTextAnnotations((prev) => prev.filter((annotation) => annotation.id !== id))
    if (pdfDoc) {
      renderPage(pdfDoc, currentPage)
    }
  }

  const removeImageAnnotation = (id: string) => {
    setImageAnnotations((prev) => prev.filter((annotation) => annotation.id !== id))
    if (pdfDoc) {
      renderPage(pdfDoc, currentPage)
    }
  }

  const navigatePage = async (direction: "prev" | "next") => {
    if (!pdfDoc) return

    const newPage = direction === "prev" ? currentPage - 1 : currentPage + 1
    if (newPage < 0 || newPage >= totalPages) return

    setCurrentPage(newPage)
    await renderPage(pdfDoc, newPage)
  }

  const rotatePage = async () => {
    if (!pdfDoc) return

    const page = pdfDoc.getPage(currentPage)
    page.setRotation({ angle: 90, type: "degrees" })
    await renderPage(pdfDoc, currentPage)
  }

  const deletePage = async () => {
    if (!pdfDoc || totalPages <= 1) return

    pdfDoc.removePage(currentPage)
    const newTotalPages = pdfDoc.getPageCount()
    setTotalPages(newTotalPages)

    if (currentPage >= newTotalPages) {
      setCurrentPage(newTotalPages - 1)
    }

    await renderPage(pdfDoc, Math.min(currentPage, newTotalPages - 1))
  }

  const saveEditedPdf = async () => {
    if (!pdfDoc || !file) return

    setIsProcessing(true)
    setProgress(0)

    try {
      // Apply text annotations to the PDF
      for (const annotation of textAnnotations) {
        const page = pdfDoc.getPage(currentPage)
        const { height } = page.getSize()

        // Convert canvas coordinates to PDF coordinates
        const pdfY = height - annotation.y

        let font
        try {
          font = await pdfDoc.embedFont(StandardFonts.Helvetica)
        } catch {
          font = await pdfDoc.embedFont(StandardFonts.Helvetica)
        }

        // Convert hex color to RGB
        const hexColor = annotation.color.replace("#", "")
        const r = Number.parseInt(hexColor.substr(0, 2), 16) / 255
        const g = Number.parseInt(hexColor.substr(2, 2), 16) / 255
        const b = Number.parseInt(hexColor.substr(4, 2), 16) / 255

        page.drawText(annotation.text, {
          x: annotation.x,
          y: pdfY,
          size: annotation.fontSize,
          font,
          color: rgb(r, g, b),
        })
      }

      setProgress(50)

      // Apply image annotations
      for (const annotation of imageAnnotations) {
        const page = pdfDoc.getPage(currentPage)
        const { height } = page.getSize()

        // Convert base64 to bytes
        const imageBytes = Uint8Array.from(atob(annotation.imageData.split(",")[1]), (c) => c.charCodeAt(0))

        let embeddedImage
        if (annotation.imageData.includes("data:image/png")) {
          embeddedImage = await pdfDoc.embedPng(imageBytes)
        } else {
          embeddedImage = await pdfDoc.embedJpg(imageBytes)
        }

        const pdfY = height - annotation.y - annotation.height

        page.drawImage(embeddedImage, {
          x: annotation.x,
          y: pdfY,
          width: annotation.width,
          height: annotation.height,
        })
      }

      setProgress(80)

      const pdfBytes = await pdfDoc.save()
      const blob = new Blob([pdfBytes], { type: "application/pdf" })
      const url = URL.createObjectURL(blob)

      const a = document.createElement("a")
      a.href = url
      a.download = `${file.name.replace(".pdf", "")}_edited.pdf`
      document.body.appendChild(a)
      a.click()
      document.body.removeChild(a)
      URL.revokeObjectURL(url)

      setProgress(100)
    } catch (error) {
      console.error("Error saving PDF:", error)
    } finally {
      setIsProcessing(false)
    }
  }

  return (
    <Card className="p-6">
      <Tabs defaultValue="upload">
        <TabsList className="grid w-full grid-cols-2 mb-6">
          <TabsTrigger value="upload">Upload PDF</TabsTrigger>
          <TabsTrigger value="edit" disabled={!pdfDoc}>
            Edit PDF
          </TabsTrigger>
        </TabsList>

        <TabsContent value="upload" className="space-y-6">
          <FileUploader onFileChange={handleFileChange} accept=".pdf" maxSize={200} />

          {isProcessing && (
            <div className="space-y-2">
              <Progress value={progress} />
              <p className="text-sm text-center text-muted-foreground">Loading PDF... {progress}%</p>
            </div>
          )}
        </TabsContent>

        <TabsContent value="edit" className="space-y-6">
          {pdfDoc && (
            <>
              {/* Toolbar */}
              <div className="flex flex-wrap gap-2 p-4 bg-muted/20 rounded-lg">
                <Button
                  variant={selectedTool === "text" ? "default" : "outline"}
                  size="sm"
                  onClick={() => setSelectedTool("text")}
                >
                  <Type className="mr-2 h-4 w-4" />
                  Add Text
                </Button>
                <Button
                  variant={selectedTool === "image" ? "default" : "outline"}
                  size="sm"
                  onClick={() => {
                    setSelectedTool("image")
                    fileInputRef.current?.click()
                  }}
                >
                  <ImageIcon className="mr-2 h-4 w-4" />
                  Add Image
                </Button>
                <Button variant="outline" size="sm" onClick={rotatePage}>
                  <RotateCw className="mr-2 h-4 w-4" />
                  Rotate
                </Button>
                <Button variant="outline" size="sm" onClick={deletePage} disabled={totalPages <= 1}>
                  <Trash2 className="mr-2 h-4 w-4" />
                  Delete Page
                </Button>
              </div>

              {/* Text Controls */}
              {selectedTool === "text" && (
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4 p-4 bg-muted/20 rounded-lg">
                  <Input placeholder="Enter text to add" value={newText} onChange={(e) => setNewText(e.target.value)} />
                  <Select value={fontFamily} onValueChange={setFontFamily}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Helvetica">Helvetica</SelectItem>
                      <SelectItem value="Times-Roman">Times Roman</SelectItem>
                      <SelectItem value="Courier">Courier</SelectItem>
                    </SelectContent>
                  </Select>
                  <Input
                    type="number"
                    placeholder="Font size"
                    value={fontSize}
                    onChange={(e) => setFontSize(Number(e.target.value))}
                    min="8"
                    max="72"
                  />
                  <Input type="color" value={textColor} onChange={(e) => setTextColor(e.target.value)} />
                </div>
              )}

              {/* PDF Viewer */}
              <div className="border rounded-lg overflow-hidden">
                <div className="flex justify-between items-center p-4 bg-muted/20">
                  <div className="flex items-center space-x-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => navigatePage("prev")}
                      disabled={currentPage === 0}
                    >
                      Previous
                    </Button>
                    <span className="text-sm">
                      Page {currentPage + 1} of {totalPages}
                    </span>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => navigatePage("next")}
                      disabled={currentPage === totalPages - 1}
                    >
                      Next
                    </Button>
                  </div>
                  <Button onClick={saveEditedPdf} disabled={isProcessing}>
                    {isProcessing ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Saving...
                      </>
                    ) : (
                      <>
                        <Download className="mr-2 h-4 w-4" />
                        Save PDF
                      </>
                    )}
                  </Button>
                </div>

                <div className="relative">
                  <canvas
                    ref={canvasRef}
                    onClick={handleCanvasClick}
                    className="w-full cursor-crosshair"
                    style={{ maxHeight: "600px" }}
                  />
                </div>
              </div>

              {/* Annotations List */}
              {(textAnnotations.length > 0 || imageAnnotations.length > 0) && (
                <div className="space-y-4">
                  <h3 className="font-medium">Annotations</h3>

                  {textAnnotations.length > 0 && (
                    <div className="space-y-2">
                      <h4 className="text-sm font-medium">Text Annotations</h4>
                      {textAnnotations.map((annotation) => (
                        <div key={annotation.id} className="flex justify-between items-center p-2 bg-muted/20 rounded">
                          <span className="text-sm">{annotation.text}</span>
                          <Button variant="ghost" size="sm" onClick={() => removeTextAnnotation(annotation.id)}>
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      ))}
                    </div>
                  )}

                  {imageAnnotations.length > 0 && (
                    <div className="space-y-2">
                      <h4 className="text-sm font-medium">Image Annotations</h4>
                      {imageAnnotations.map((annotation) => (
                        <div key={annotation.id} className="flex justify-between items-center p-2 bg-muted/20 rounded">
                          <span className="text-sm">
                            Image ({annotation.width}x{annotation.height})
                          </span>
                          <Button variant="ghost" size="sm" onClick={() => removeImageAnnotation(annotation.id)}>
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}

              {isProcessing && (
                <div className="space-y-2">
                  <Progress value={progress} />
                  <p className="text-sm text-center text-muted-foreground">Saving PDF... {progress}%</p>
                </div>
              )}

              <input ref={fileInputRef} type="file" accept="image/*" onChange={handleImageUpload} className="hidden" />
            </>
          )}
        </TabsContent>
      </Tabs>
    </Card>
  )
}
