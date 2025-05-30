"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { ArrowDown, ArrowUp, Trash2, Plus, Loader2, Download } from "lucide-react"
import { Input } from "@/components/ui/input"
import FileUploader from "@/components/file-uploader"
import { PDFDocument } from "pdf-lib"

interface PdfFile {
  file: File
  name: string
  size: number
}

export default function MergeSplitTool() {
  // Merge state
  const [mergeFiles, setMergeFiles] = useState<PdfFile[]>([])
  const [isMerging, setIsMerging] = useState(false)
  const [mergeResult, setMergeResult] = useState<string | null>(null)

  // Split state
  const [splitFile, setSplitFile] = useState<File | null>(null)
  const [splitPages, setSplitPages] = useState("")
  const [isSplitting, setIsSplitting] = useState(false)
  const [splitResult, setSplitResult] = useState<{ name: string; url: string }[]>([])

  const handleMergeFileChange = (file: File | null) => {
    if (file) {
      const newFile: PdfFile = {
        file,
        name: file.name,
        size: file.size,
      }
      setMergeFiles((prev) => [...prev, newFile])
    }
  }

  const handleSplitFileChange = (file: File | null) => {
    setSplitFile(file)
    setSplitResult([])
  }

  const removeFile = (index: number) => {
    setMergeFiles((prev) => prev.filter((_, i) => i !== index))
  }

  const moveFileUp = (index: number) => {
    if (index === 0) return
    const newFiles = [...mergeFiles]
    ;[newFiles[index - 1], newFiles[index]] = [newFiles[index], newFiles[index - 1]]
    setMergeFiles(newFiles)
  }

  const moveFileDown = (index: number) => {
    if (index === mergeFiles.length - 1) return
    const newFiles = [...mergeFiles]
    ;[newFiles[index], newFiles[index + 1]] = [newFiles[index + 1], newFiles[index]]
    setMergeFiles(newFiles)
  }

  const handleMerge = async () => {
    if (mergeFiles.length < 2) return

    setIsMerging(true)

    try {
      const mergedPdf = await PDFDocument.create()

      for (const pdfFile of mergeFiles) {
        const arrayBuffer = await pdfFile.file.arrayBuffer()
        const pdf = await PDFDocument.load(arrayBuffer)
        const copiedPages = await mergedPdf.copyPages(pdf, pdf.getPageIndices())
        copiedPages.forEach((page) => mergedPdf.addPage(page))
      }

      const pdfBytes = await mergedPdf.save()
      const blob = new Blob([pdfBytes], { type: "application/pdf" })
      const url = URL.createObjectURL(blob)

      setMergeResult(url)
    } catch (error) {
      console.error("PDF merge error:", error)
    } finally {
      setIsMerging(false)
    }
  }

  const handleSplit = async () => {
    if (!splitFile) return

    setIsSplitting(true)

    try {
      const arrayBuffer = await splitFile.arrayBuffer()
      const pdf = await PDFDocument.load(arrayBuffer)
      const pageCount = pdf.getPageCount()

      let pageRanges: number[][] = []

      if (splitPages.trim() === "") {
        // Split each page into separate PDF
        pageRanges = Array.from({ length: pageCount }, (_, i) => [i])
      } else {
        // Parse page ranges (e.g., "1-3,5,7-9")
        const ranges = splitPages.split(",").map((range) => range.trim())

        for (const range of ranges) {
          if (range.includes("-")) {
            const [start, end] = range.split("-").map((num) => Number.parseInt(num.trim()) - 1)
            const pages = Array.from({ length: end - start + 1 }, (_, i) => start + i)
            pageRanges.push(pages)
          } else {
            pageRanges.push([Number.parseInt(range.trim()) - 1])
          }
        }
      }

      const results: { name: string; url: string }[] = []

      for (let i = 0; i < pageRanges.length; i++) {
        const newPdf = await PDFDocument.create()
        const pages = await newPdf.copyPages(pdf, pageRanges[i])
        pages.forEach((page) => newPdf.addPage(page))

        const pdfBytes = await newPdf.save()
        const blob = new Blob([pdfBytes], { type: "application/pdf" })
        const url = URL.createObjectURL(blob)

        const fileName = `${splitFile.name.replace(".pdf", "")}_part_${i + 1}.pdf`
        results.push({ name: fileName, url })
      }

      setSplitResult(results)
    } catch (error) {
      console.error("PDF split error:", error)
    } finally {
      setIsSplitting(false)
    }
  }

  const downloadMergedPdf = () => {
    if (!mergeResult) return

    const a = document.createElement("a")
    a.href = mergeResult
    a.download = "merged-document.pdf"
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
  }

  const downloadSplitPdf = (url: string, filename: string) => {
    const a = document.createElement("a")
    a.href = url
    a.download = filename
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
  }

  return (
    <Card className="p-6">
      <Tabs defaultValue="merge">
        <TabsList className="grid w-full grid-cols-2 mb-6">
          <TabsTrigger value="merge">Merge PDFs</TabsTrigger>
          <TabsTrigger value="split">Split PDF</TabsTrigger>
        </TabsList>

        <TabsContent value="merge" className="space-y-6">
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <h3 className="text-lg font-medium">Upload PDF Files</h3>
              <p className="text-sm text-muted-foreground">{mergeFiles.length} file(s) selected</p>
            </div>

            {mergeFiles.length > 0 && (
              <div className="border rounded-lg overflow-hidden">
                <div className="max-h-[300px] overflow-y-auto">
                  <table className="w-full">
                    <thead className="bg-muted/50 sticky top-0">
                      <tr>
                        <th className="text-left p-3 text-sm font-medium">File Name</th>
                        <th className="text-right p-3 text-sm font-medium">Size</th>
                        <th className="text-right p-3 text-sm font-medium">Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {mergeFiles.map((file, index) => (
                        <tr key={index} className="border-t">
                          <td className="p-3 text-sm">{file.name}</td>
                          <td className="p-3 text-sm text-right">{(file.size / (1024 * 1024)).toFixed(2)} MB</td>
                          <td className="p-3 text-right">
                            <div className="flex justify-end space-x-1">
                              <Button
                                variant="ghost"
                                size="icon"
                                onClick={() => moveFileUp(index)}
                                disabled={index === 0}
                              >
                                <ArrowUp className="h-4 w-4" />
                              </Button>
                              <Button
                                variant="ghost"
                                size="icon"
                                onClick={() => moveFileDown(index)}
                                disabled={index === mergeFiles.length - 1}
                              >
                                <ArrowDown className="h-4 w-4" />
                              </Button>
                              <Button variant="ghost" size="icon" onClick={() => removeFile(index)}>
                                <Trash2 className="h-4 w-4" />
                              </Button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            <FileUploader onFileChange={handleMergeFileChange} accept=".pdf" maxSize={200} />

            <Button className="w-full" onClick={handleMerge} disabled={mergeFiles.length < 2 || isMerging}>
              {isMerging ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Merging PDFs...
                </>
              ) : (
                <>
                  <Plus className="mr-2 h-4 w-4" />
                  Merge {mergeFiles.length} PDFs
                </>
              )}
            </Button>

            {mergeResult && (
              <div className="p-4 border rounded-lg bg-muted/20">
                <div className="flex justify-between items-center">
                  <p className="font-medium">Merge Complete!</p>
                  <Button onClick={downloadMergedPdf}>
                    <Download className="mr-2 h-4 w-4" />
                    Download
                  </Button>
                </div>
              </div>
            )}
          </div>
        </TabsContent>

        <TabsContent value="split" className="space-y-6">
          <div className="space-y-4">
            <h3 className="text-lg font-medium">Upload PDF to Split</h3>

            <FileUploader onFileChange={handleSplitFileChange} accept=".pdf" maxSize={200} />

            {splitFile && (
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium">{splitFile.name}</p>
                    <p className="text-sm text-muted-foreground">{(splitFile.size / (1024 * 1024)).toFixed(2)} MB</p>
                  </div>
                  <Button variant="ghost" size="sm" onClick={() => setSplitFile(null)}>
                    Remove
                  </Button>
                </div>

                <div className="space-y-2">
                  <label htmlFor="split-pages" className="text-sm font-medium">
                    Split Pages (e.g., 1-3,5,7-9)
                  </label>
                  <Input
                    id="split-pages"
                    placeholder="e.g., 1-3,5,7-9"
                    value={splitPages}
                    onChange={(e) => setSplitPages(e.target.value)}
                  />
                  <p className="text-xs text-muted-foreground">Leave empty to split each page into a separate PDF</p>
                </div>

                <Button className="w-full" onClick={handleSplit} disabled={isSplitting}>
                  {isSplitting ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Splitting PDF...
                    </>
                  ) : (
                    "Split PDF"
                  )}
                </Button>

                {splitResult.length > 0 && (
                  <div className="p-4 border rounded-lg bg-muted/20">
                    <h4 className="font-medium mb-2">Split Complete!</h4>
                    <div className="space-y-2">
                      {splitResult.map((file, index) => (
                        <div key={index} className="flex justify-between items-center">
                          <p className="text-sm">{file.name}</p>
                          <Button size="sm" variant="outline" onClick={() => downloadSplitPdf(file.url, file.name)}>
                            <Download className="mr-2 h-3 w-3" />
                            Download
                          </Button>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>
        </TabsContent>
      </Tabs>
    </Card>
  )
}
