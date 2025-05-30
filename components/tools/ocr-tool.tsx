"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Upload, Globe, Loader2, Download, Copy } from "lucide-react"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { Progress } from "@/components/ui/progress"
import FileUploader from "@/components/file-uploader"
import { createWorker } from "tesseract.js"

export default function OcrTool() {
  const [file, setFile] = useState<File | null>(null)
  const [language, setLanguage] = useState("eng")
  const [isProcessing, setIsProcessing] = useState(false)
  const [progress, setProgress] = useState(0)
  const [result, setResult] = useState("")

  const handleFileChange = (selectedFile: File | null) => {
    setFile(selectedFile)
    setResult("")
  }

  const handleProcess = async () => {
    if (!file) return

    setIsProcessing(true)
    setProgress(0)

    try {
      const worker = await createWorker(language, 1, {
        logger: (m) => {
          if (m.status === "recognizing text") {
            setProgress(Math.round(m.progress * 100))
          }
        },
      })

      let imageUrl: string

      if (file.type === "application/pdf") {
        // Convert PDF to image first
        const canvas = document.createElement("canvas")
        const ctx = canvas.getContext("2d")

        // For PDF files, we'll use PDF.js to convert to image
        const pdfjsLib = await import("pdfjs-dist")
        pdfjsLib.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjsLib.version}/pdf.worker.min.js`

        const arrayBuffer = await file.arrayBuffer()
        const pdf = await pdfjsLib.getDocument(arrayBuffer).promise
        const page = await pdf.getPage(1)

        const viewport = page.getViewport({ scale: 2 })
        canvas.height = viewport.height
        canvas.width = viewport.width

        await page.render({
          canvasContext: ctx!,
          viewport: viewport,
        }).promise

        imageUrl = canvas.toDataURL()
      } else {
        // For image files, create object URL
        imageUrl = URL.createObjectURL(file)
      }

      const {
        data: { text },
      } = await worker.recognize(imageUrl)
      setResult(text)

      await worker.terminate()

      if (file.type !== "application/pdf") {
        URL.revokeObjectURL(imageUrl)
      }

      setProgress(100)
    } catch (error) {
      console.error("OCR processing error:", error)
      setResult("Error processing file. Please try again.")
    } finally {
      setIsProcessing(false)
    }
  }

  const downloadAsText = () => {
    const blob = new Blob([result], { type: "text/plain" })
    const url = URL.createObjectURL(blob)
    const a = document.createElement("a")
    a.href = url
    a.download = `${file?.name.replace(".pdf", "")}_extracted_text.txt`
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    URL.revokeObjectURL(url)
  }

  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(result)
      // You could add a toast notification here
    } catch (err) {
      console.error("Failed to copy text: ", err)
    }
  }

  const languages = [
    { value: "eng", label: "English" },
    { value: "spa", label: "Spanish" },
    { value: "fra", label: "French" },
    { value: "deu", label: "German" },
    { value: "ita", label: "Italian" },
    { value: "por", label: "Portuguese" },
    { value: "rus", label: "Russian" },
    { value: "chi_sim", label: "Chinese (Simplified)" },
    { value: "chi_tra", label: "Chinese (Traditional)" },
    { value: "jpn", label: "Japanese" },
    { value: "kor", label: "Korean" },
    { value: "ara", label: "Arabic" },
  ]

  return (
    <Card className="p-6">
      <Tabs defaultValue="upload">
        <TabsList className="grid w-full grid-cols-2 mb-6">
          <TabsTrigger value="upload">Upload File</TabsTrigger>
          <TabsTrigger value="url">URL</TabsTrigger>
        </TabsList>

        <TabsContent value="upload" className="space-y-6">
          <FileUploader onFileChange={handleFileChange} accept=".pdf,image/png,image/jpeg,image/jpg" maxSize={200} />

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
                <div className="flex items-center space-x-2">
                  <Globe className="h-4 w-4 text-muted-foreground" />
                  <p className="text-sm font-medium">Select Language</p>
                </div>

                <Select value={language} onValueChange={setLanguage}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select language" />
                  </SelectTrigger>
                  <SelectContent>
                    {languages.map((lang) => (
                      <SelectItem key={lang.value} value={lang.value}>
                        {lang.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <Button className="w-full" onClick={handleProcess} disabled={isProcessing}>
                {isProcessing ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Processing...
                  </>
                ) : (
                  <>
                    <Upload className="mr-2 h-4 w-4" />
                    Extract Text
                  </>
                )}
              </Button>

              {isProcessing && (
                <div className="space-y-2">
                  <Progress value={progress} />
                  <p className="text-sm text-center text-muted-foreground">Processing document... {progress}%</p>
                </div>
              )}
            </div>
          )}

          {result && (
            <div className="space-y-2">
              <h3 className="font-medium">Extracted Text:</h3>
              <Textarea value={result} readOnly className="min-h-[200px]" />
              <div className="flex justify-end space-x-2">
                <Button variant="outline" onClick={copyToClipboard}>
                  <Copy className="mr-2 h-4 w-4" />
                  Copy to Clipboard
                </Button>
                <Button onClick={downloadAsText}>
                  <Download className="mr-2 h-4 w-4" />
                  Download as TXT
                </Button>
              </div>
            </div>
          )}
        </TabsContent>

        <TabsContent value="url" className="space-y-6">
          <div className="space-y-2">
            <label htmlFor="url" className="text-sm font-medium">
              Enter PDF URL
            </label>
            <div className="flex space-x-2">
              <input
                id="url"
                type="url"
                placeholder="https://example.com/document.pdf"
                className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
              />
              <Button>Fetch</Button>
            </div>
          </div>
        </TabsContent>
      </Tabs>
    </Card>
  )
}
