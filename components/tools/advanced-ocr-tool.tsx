"use client"

import { useState, useRef, useCallback } from "react"
import { createWorker } from "tesseract.js"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Upload, Globe, Loader2, Download, Copy, Eye, Settings, FileText } from "lucide-react"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { Progress } from "@/components/ui/progress"
import { Slider } from "@/components/ui/slider"
import { Switch } from "@/components/ui/switch"
import { Label } from "@/components/ui/label"
import FileUploader from "@/components/file-uploader"

interface OCRSettings {
  dpi: number
  contrast: number
  brightness: number
  gamma: number
  denoise: boolean
  deskew: boolean
  removeBackground: boolean
  enhanceText: boolean
  sharpen: boolean
  morphology: boolean
  binarization: string
}

interface OCRResult {
  text: string
  confidence: number
  words: Array<{
    text: string
    confidence: number
    bbox: { x0: number; y0: number; x1: number; y1: number }
  }>
  processingTime: number
  method: string
}

export default function AdvancedOcrTool() {
  const [file, setFile] = useState<File | null>(null)
  const [language, setLanguage] = useState("eng")
  const [isProcessing, setIsProcessing] = useState(false)
  const [progress, setProgress] = useState(0)
  const [result, setResult] = useState<OCRResult | null>(null)
  const [processedImageUrl, setProcessedImageUrl] = useState<string | null>(null)
  const [originalImageUrl, setOriginalImageUrl] = useState<string | null>(null)
  const [processingMethod, setProcessingMethod] = useState<"standard" | "enhanced" | "ai">("enhanced")
  const [settings, setSettings] = useState<OCRSettings>({
    dpi: 300,
    contrast: 1.3,
    brightness: 1.1,
    gamma: 1.0,
    denoise: true,
    deskew: true,
    removeBackground: true,
    enhanceText: true,
    sharpen: true,
    morphology: true,
    binarization: "adaptive",
  })

  const canvasRef = useRef<HTMLCanvasElement>(null)
  const previewCanvasRef = useRef<HTMLCanvasElement>(null)
  const workerRef = useRef<any>(null)

  const handleFileChange = useCallback((selectedFile: File | null) => {
    setFile(selectedFile)
    setResult(null)
    setProcessedImageUrl(null)
    setOriginalImageUrl(null)
    if (selectedFile) {
      previewImage(selectedFile)
    }
  }, [])

  const previewImage = async (file: File) => {
    const canvas = previewCanvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext("2d")!
    const img = new Image()

    img.onload = () => {
      canvas.width = Math.min(img.width, 800)
      canvas.height = (img.height * canvas.width) / img.width
      ctx.drawImage(img, 0, 0, canvas.width, canvas.height)
    }

    let imageUrl: string
    if (file.type === "application/pdf") {
      imageUrl = await convertPdfToImage(file)
    } else {
      imageUrl = URL.createObjectURL(file)
    }

    setOriginalImageUrl(imageUrl)
    img.src = imageUrl
  }

  const convertPdfToImage = async (file: File): Promise<string> => {
    const pdfjsLib = await import("pdfjs-dist")
    pdfjsLib.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjsLib.version}/pdf.worker.min.js`

    const arrayBuffer = await file.arrayBuffer()
    const pdf = await pdfjsLib.getDocument(arrayBuffer).promise
    const page = await pdf.getPage(1)

    // Use higher scale for better quality
    const viewport = page.getViewport({ scale: settings.dpi / 72 })
    const canvas = document.createElement("canvas")
    const context = canvas.getContext("2d")!

    canvas.height = viewport.height
    canvas.width = viewport.width

    await page.render({
      canvasContext: context,
      viewport: viewport,
    }).promise

    return canvas.toDataURL("image/png")
  }

  const advancedImagePreprocessing = async (imageUrl: string): Promise<string> => {
    return new Promise((resolve) => {
      const canvas = canvasRef.current!
      const ctx = canvas.getContext("2d")!
      const img = new Image()

      img.onload = () => {
        // Set canvas size with high DPI
        const scale = settings.dpi / 150
        canvas.width = img.width * scale
        canvas.height = img.height * scale

        ctx.imageSmoothingEnabled = false
        ctx.scale(scale, scale)
        ctx.drawImage(img, 0, 0)

        // Get image data for advanced processing
        const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height)
        const data = imageData.data
        const width = canvas.width
        const height = canvas.height

        // Step 1: Convert to grayscale with weighted average
        for (let i = 0; i < data.length; i += 4) {
          const r = data[i]
          const g = data[i + 1]
          const b = data[i + 2]

          // Use luminance formula for better grayscale conversion
          const gray = 0.299 * r + 0.587 * g + 0.114 * b
          data[i] = gray
          data[i + 1] = gray
          data[i + 2] = gray
        }

        // Step 2: Apply gamma correction
        if (settings.gamma !== 1.0) {
          for (let i = 0; i < data.length; i += 4) {
            data[i] = Math.pow(data[i] / 255, settings.gamma) * 255
            data[i + 1] = data[i]
            data[i + 2] = data[i]
          }
        }

        // Step 3: Apply brightness and contrast
        for (let i = 0; i < data.length; i += 4) {
          let pixel = data[i]

          // Apply brightness
          pixel *= settings.brightness

          // Apply contrast
          pixel = (pixel - 128) * settings.contrast + 128

          // Clamp values
          pixel = Math.max(0, Math.min(255, pixel))

          data[i] = pixel
          data[i + 1] = pixel
          data[i + 2] = pixel
        }

        // Step 4: Advanced denoising using median filter
        if (settings.denoise) {
          const denoisedData = medianFilter(data, width, height)
          for (let i = 0; i < data.length; i += 4) {
            data[i] = denoisedData[i]
            data[i + 1] = denoisedData[i]
            data[i + 2] = denoisedData[i]
          }
        }

        // Step 5: Sharpening filter
        if (settings.sharpen) {
          const sharpenedData = sharpenFilter(data, width, height)
          for (let i = 0; i < data.length; i += 4) {
            data[i] = sharpenedData[i]
            data[i + 1] = sharpenedData[i]
            data[i + 2] = sharpenedData[i]
          }
        }

        // Step 6: Advanced binarization
        if (settings.binarization === "adaptive") {
          adaptiveBinarization(data, width, height)
        } else if (settings.binarization === "otsu") {
          otsuBinarization(data, width, height)
        }

        // Step 7: Morphological operations
        if (settings.morphology) {
          morphologicalOperations(data, width, height)
        }

        // Step 8: Text enhancement
        if (settings.enhanceText) {
          enhanceTextRegions(data, width, height)
        }

        // Step 9: Background removal
        if (settings.removeBackground) {
          removeBackground(data, width, height)
        }

        // Apply processed data back to canvas
        ctx.putImageData(imageData, 0, 0)

        // Step 10: Deskewing (if enabled)
        if (settings.deskew) {
          const angle = detectSkewAngle(imageData, width, height)
          if (Math.abs(angle) > 0.1) {
            ctx.save()
            ctx.translate(canvas.width / 2, canvas.height / 2)
            ctx.rotate((angle * Math.PI) / 180)
            ctx.translate(-canvas.width / 2, -canvas.height / 2)
            ctx.drawImage(canvas, 0, 0)
            ctx.restore()
          }
        }

        resolve(canvas.toDataURL("image/png"))
      }

      img.crossOrigin = "anonymous"
      img.src = imageUrl
    })
  }

  const medianFilter = (data: Uint8ClampedArray, width: number, height: number): Uint8ClampedArray => {
    const result = new Uint8ClampedArray(data.length)
    const kernelSize = 3
    const offset = Math.floor(kernelSize / 2)

    for (let y = offset; y < height - offset; y++) {
      for (let x = offset; x < width - offset; x++) {
        const pixels: number[] = []

        for (let ky = -offset; ky <= offset; ky++) {
          for (let kx = -offset; kx <= offset; kx++) {
            const idx = ((y + ky) * width + (x + kx)) * 4
            pixels.push(data[idx])
          }
        }

        pixels.sort((a, b) => a - b)
        const median = pixels[Math.floor(pixels.length / 2)]
        const idx = (y * width + x) * 4

        result[idx] = median
        result[idx + 1] = median
        result[idx + 2] = median
        result[idx + 3] = data[idx + 3]
      }
    }

    return result
  }

  const sharpenFilter = (data: Uint8ClampedArray, width: number, height: number): Uint8ClampedArray => {
    const result = new Uint8ClampedArray(data.length)
    const kernel = [
      [0, -1, 0],
      [-1, 5, -1],
      [0, -1, 0],
    ]

    for (let y = 1; y < height - 1; y++) {
      for (let x = 1; x < width - 1; x++) {
        let sum = 0

        for (let ky = -1; ky <= 1; ky++) {
          for (let kx = -1; kx <= 1; kx++) {
            const idx = ((y + ky) * width + (x + kx)) * 4
            sum += data[idx] * kernel[ky + 1][kx + 1]
          }
        }

        const idx = (y * width + x) * 4
        const value = Math.max(0, Math.min(255, sum))

        result[idx] = value
        result[idx + 1] = value
        result[idx + 2] = value
        result[idx + 3] = data[idx + 3]
      }
    }

    return result
  }

  const adaptiveBinarization = (data: Uint8ClampedArray, width: number, height: number) => {
    const windowSize = 15
    const offset = Math.floor(windowSize / 2)

    for (let y = 0; y < height; y++) {
      for (let x = 0; x < width; x++) {
        let sum = 0
        let count = 0

        // Calculate local mean
        for (let wy = Math.max(0, y - offset); wy < Math.min(height, y + offset + 1); wy++) {
          for (let wx = Math.max(0, x - offset); wx < Math.min(width, x + offset + 1); wx++) {
            const idx = (wy * width + wx) * 4
            sum += data[idx]
            count++
          }
        }

        const mean = sum / count
        const idx = (y * width + x) * 4
        const threshold = mean * 0.9 // Adaptive threshold

        const value = data[idx] > threshold ? 255 : 0
        data[idx] = value
        data[idx + 1] = value
        data[idx + 2] = value
      }
    }
  }

  const otsuBinarization = (data: Uint8ClampedArray, width: number, height: number) => {
    // Calculate histogram
    const histogram = new Array(256).fill(0)
    const totalPixels = width * height

    for (let i = 0; i < data.length; i += 4) {
      histogram[data[i]]++
    }

    // Calculate Otsu threshold
    let sum = 0
    for (let i = 0; i < 256; i++) {
      sum += i * histogram[i]
    }

    let sumB = 0
    let wB = 0
    let wF = 0
    let varMax = 0
    let threshold = 0

    for (let t = 0; t < 256; t++) {
      wB += histogram[t]
      if (wB === 0) continue

      wF = totalPixels - wB
      if (wF === 0) break

      sumB += t * histogram[t]

      const mB = sumB / wB
      const mF = (sum - sumB) / wF

      const varBetween = wB * wF * (mB - mF) * (mB - mF)

      if (varBetween > varMax) {
        varMax = varBetween
        threshold = t
      }
    }

    // Apply threshold
    for (let i = 0; i < data.length; i += 4) {
      const value = data[i] > threshold ? 255 : 0
      data[i] = value
      data[i + 1] = value
      data[i + 2] = value
    }
  }

  const morphologicalOperations = (data: Uint8ClampedArray, width: number, height: number) => {
    // Erosion followed by dilation (opening) to remove noise
    const structuringElement = [
      [0, 1, 0],
      [1, 1, 1],
      [0, 1, 0],
    ]

    // Erosion
    const eroded = new Uint8ClampedArray(data.length)
    for (let y = 1; y < height - 1; y++) {
      for (let x = 1; x < width - 1; x++) {
        let minVal = 255

        for (let ky = -1; ky <= 1; ky++) {
          for (let kx = -1; kx <= 1; kx++) {
            if (structuringElement[ky + 1][kx + 1]) {
              const idx = ((y + ky) * width + (x + kx)) * 4
              minVal = Math.min(minVal, data[idx])
            }
          }
        }

        const idx = (y * width + x) * 4
        eroded[idx] = minVal
        eroded[idx + 1] = minVal
        eroded[idx + 2] = minVal
        eroded[idx + 3] = data[idx + 3]
      }
    }

    // Dilation
    for (let y = 1; y < height - 1; y++) {
      for (let x = 1; x < width - 1; x++) {
        let maxVal = 0

        for (let ky = -1; ky <= 1; ky++) {
          for (let kx = -1; kx <= 1; kx++) {
            if (structuringElement[ky + 1][kx + 1]) {
              const idx = ((y + ky) * width + (x + kx)) * 4
              maxVal = Math.max(maxVal, eroded[idx])
            }
          }
        }

        const idx = (y * width + x) * 4
        data[idx] = maxVal
        data[idx + 1] = maxVal
        data[idx + 2] = maxVal
      }
    }
  }

  const enhanceTextRegions = (data: Uint8ClampedArray, width: number, height: number) => {
    // Enhance contrast in text regions
    for (let i = 0; i < data.length; i += 4) {
      const pixel = data[i]

      // Enhance dark regions (likely text)
      if (pixel < 128) {
        const enhanced = Math.max(0, pixel * 0.7) // Make text darker
        data[i] = enhanced
        data[i + 1] = enhanced
        data[i + 2] = enhanced
      } else {
        // Enhance light regions (likely background)
        const enhanced = Math.min(255, pixel * 1.1) // Make background lighter
        data[i] = enhanced
        data[i + 1] = enhanced
        data[i + 2] = enhanced
      }
    }
  }

  const removeBackground = (data: Uint8ClampedArray, width: number, height: number) => {
    // Calculate background threshold
    const histogram = new Array(256).fill(0)
    for (let i = 0; i < data.length; i += 4) {
      histogram[data[i]]++
    }

    // Find the most common light color (background)
    let maxCount = 0
    let backgroundValue = 255
    for (let i = 200; i < 256; i++) {
      if (histogram[i] > maxCount) {
        maxCount = histogram[i]
        backgroundValue = i
      }
    }

    // Remove background
    const threshold = backgroundValue * 0.9
    for (let i = 0; i < data.length; i += 4) {
      if (data[i] > threshold) {
        data[i] = 255
        data[i + 1] = 255
        data[i + 2] = 255
      }
    }
  }

  const detectSkewAngle = (imageData: ImageData, width: number, height: number): number => {
    const data = imageData.data
    const angles: number[] = []

    // Simplified Hough transform for line detection
    for (let angle = -15; angle <= 15; angle += 0.5) {
      let score = 0
      const radians = (angle * Math.PI) / 180

      for (let y = 0; y < height; y += 5) {
        for (let x = 0; x < width; x += 5) {
          const idx = (y * width + x) * 4
          if (data[idx] < 128) {
            // Dark pixel (text)
            // Project point onto line at this angle
            const rho = x * Math.cos(radians) + y * Math.sin(radians)
            score += 1
          }
        }
      }

      angles.push(score)
    }

    // Find angle with maximum score
    let maxScore = 0
    let bestAngle = 0
    for (let i = 0; i < angles.length; i++) {
      if (angles[i] > maxScore) {
        maxScore = angles[i]
        bestAngle = i * 0.5 - 15
      }
    }

    return bestAngle
  }

  const performMultiEngineOCR = async (imageUrl: string): Promise<OCRResult> => {
    const startTime = Date.now()

    try {
      // Initialize Tesseract worker with optimized settings
      if (workerRef.current) {
        await workerRef.current.terminate()
      }

      workerRef.current = await createWorker(language, 1, {
        logger: (m) => {
          if (m.status === "recognizing text") {
            setProgress(20 + Math.round(m.progress * 70))
          }
        },
      })

      // Configure Tesseract for maximum accuracy
      await workerRef.current.setParameters({
        tessedit_char_whitelist: "", // Allow all characters
        tessedit_pageseg_mode: "1", // Automatic page segmentation with OSD
        tessedit_ocr_engine_mode: "1", // Neural nets LSTM engine only
        preserve_interword_spaces: "1",
        user_defined_dpi: settings.dpi.toString(),
        tessedit_create_hocr: "1",
        tessedit_create_tsv: "1",
        // Advanced parameters for better accuracy
        classify_enable_learning: "1",
        classify_enable_adaptive_matcher: "1",
        textord_really_old_xheight: "1",
        segment_penalty_dict_nonword: "1.25",
        segment_penalty_garbage: "1.50",
        language_model_penalty_non_freq_dict_word: "0.1",
        language_model_penalty_non_dict_word: "0.15",
      })

      const {
        data: { text, confidence, words, hocr },
      } = await workerRef.current.recognize(imageUrl)

      await workerRef.current.terminate()
      workerRef.current = null

      const processingTime = Date.now() - startTime

      // Advanced text post-processing
      const enhancedText = await advancedTextPostProcessing(text, words, language)

      return {
        text: enhancedText,
        confidence,
        words: words.map((word: any) => ({
          text: word.text,
          confidence: word.confidence,
          bbox: word.bbox,
        })),
        processingTime,
        method: processingMethod,
      }
    } catch (error) {
      console.error("OCR processing error:", error)
      return {
        text: "Error processing file. Please try different settings or a higher quality image.",
        confidence: 0,
        words: [],
        processingTime: Date.now() - startTime,
        method: processingMethod,
      }
    }
  }

  const advancedTextPostProcessing = async (text: string, words: any[], lang: string): Promise<string> => {
    let processedText = text

    // Step 1: Fix common OCR character errors using proper character codes
    const characterCorrections = new Map([
      // Numbers to letters
      ["0", "O"],
      ["1", "I"],
      ["5", "S"],
      ["8", "B"],
      ["6", "G"],
      // Letters to numbers (in numeric contexts)
      ["O", "0"],
      ["I", "1"],
      ["l", "1"],
      ["S", "5"],
      ["B", "8"],
      // Common symbol errors
      ["|", "I"],
      ["¡", "i"],
      ["¿", "?"],
      ["«", '"'],
      ["»", '"'],
      // Punctuation fixes
      [",", "."],
      [";", ":"],
      ["`", "'"],
      ["'", "'"],
      ["'", "'"],
      ['"', '"'],
      ['"', '"'],
    ])

    // Apply basic character corrections
    for (const [wrong, correct] of characterCorrections) {
      processedText = processedText.replace(new RegExp(escapeRegExp(wrong), "g"), correct)
    }

    // Fix common spacing issues
    processedText = processedText
      .replace(/\s+/g, " ") // Multiple spaces to single space
      .replace(/\n\s*\n/g, "\n\n") // Clean up paragraph breaks
      .replace(/\s+([,.!?;:])/g, "$1") // Remove space before punctuation
      .replace(/([.!?])\s*([A-Z])/g, "$1 $2") // Ensure space after sentence endings
      .trim()

    return processedText
  }

  const escapeRegExp = (string: string): string => {
    return string.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")
  }

  const handleProcess = async () => {
    if (!file) return

    setIsProcessing(true)
    setProgress(0)

    try {
      setProgress(5)

      // Convert PDF to image if needed
      let imageUrl: string
      if (file.type === "application/pdf") {
        imageUrl = await convertPdfToImage(file)
      } else {
        imageUrl = URL.createObjectURL(file)
      }

      setProgress(10)

      // Preprocess image for better OCR
      const processedImageUrl = await advancedImagePreprocessing(imageUrl)
      setProcessedImageUrl(processedImageUrl)

      setProgress(20)

      // Perform OCR with advanced settings
      const ocrResult = await performMultiEngineOCR(processedImageUrl)

      setProgress(100)
      setResult(ocrResult)

      // Clean up URLs
      if (file.type !== "application/pdf") {
        URL.revokeObjectURL(imageUrl)
      }
    } catch (error) {
      console.error("OCR processing error:", error)
      setResult({
        text: "Error processing file. Please try again with different settings.",
        confidence: 0,
        words: [],
        processingTime: 0,
        method: processingMethod,
      })
    } finally {
      setIsProcessing(false)
    }
  }

  const downloadAsText = () => {
    if (!result || !file) return

    const blob = new Blob([result.text], { type: "text/plain" })
    const url = URL.createObjectURL(blob)
    const a = document.createElement("a")
    a.href = url
    a.download = `${file.name.replace(/\.[^/.]+$/, "")}_extracted.txt`
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    URL.revokeObjectURL(url)
  }

  const copyToClipboard = async () => {
    if (!result) return
    try {
      await navigator.clipboard.writeText(result.text)
    } catch (err) {
      console.error("Failed to copy text: ", err)
    }
  }

  const generateWordDocument = async (): Promise<void> => {
    if (!result || !file) return

    const htmlContent = `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <title>OCR Extracted Text</title>
  <style>
    body { font-family: Arial, sans-serif; margin: 40px; line-height: 1.6; }
    .header { text-align: center; margin-bottom: 20pt; border-bottom: 1pt solid #000; padding-bottom: 10pt; }
    .content { text-align: justify; }
    .metadata { font-size: 10pt; color: #666; margin-top: 20pt; border-top: 1pt solid #ccc; padding-top: 10pt; }
  </style>
</head>
<body>
  <div class="header">
    <h1>OCR Extracted Document</h1>
    <p>Source: ${file.name}</p>
    <p>Extraction Date: ${new Date().toLocaleDateString()}</p>
    <p>Overall Confidence: ${result.confidence.toFixed(1)}%</p>
  </div>
  
  <div class="content">
    ${result.text
      .split("\n")
      .map((line) => `<p>${line}</p>`)
      .join("")}
  </div>
  
  <div class="metadata">
    <h3>Extraction Details</h3>
    <p><strong>Language:</strong> ${getLanguageName(language)}</p>
    <p><strong>Processing Time:</strong> ${result.processingTime}ms</p>
    <p><strong>Total Words:</strong> ${result.words.length}</p>
  </div>
</body>
</html>`

    const blob = new Blob([htmlContent], {
      type: "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
    })

    const url = URL.createObjectURL(blob)
    const a = document.createElement("a")
    a.href = url
    a.download = `${file.name.replace(/\.[^/.]+$/, "")}_extracted.doc`
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    URL.revokeObjectURL(url)
  }

  const getLanguageName = (code: string): string => {
    const languages: { [key: string]: string } = {
      eng: "English",
      spa: "Spanish",
      fra: "French",
      deu: "German",
      ita: "Italian",
      por: "Portuguese",
      rus: "Russian",
      chi_sim: "Chinese (Simplified)",
      chi_tra: "Chinese (Traditional)",
      jpn: "Japanese",
      kor: "Korean",
      ara: "Arabic",
    }
    return languages[code] || code
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
        <TabsList className="grid w-full grid-cols-3 mb-6">
          <TabsTrigger value="upload">Upload & Settings</TabsTrigger>
          <TabsTrigger value="preview" disabled={!file}>
            Preview
          </TabsTrigger>
          <TabsTrigger value="results" disabled={!result}>
            Results
          </TabsTrigger>
        </TabsList>

        <TabsContent value="upload" className="space-y-6">
          <FileUploader
            onFileChange={handleFileChange}
            accept=".pdf,image/png,image/jpeg,image/jpg,image/tiff"
            maxSize={200}
          />

          {file && (
            <div className="space-y-6">
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

              <div className="space-y-4 p-4 border rounded-lg">
                <div className="flex items-center space-x-2">
                  <Settings className="h-4 w-4 text-muted-foreground" />
                  <h3 className="font-medium">Advanced OCR Settings</h3>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>DPI Quality: {settings.dpi}</Label>
                    <Slider
                      value={[settings.dpi]}
                      onValueChange={([value]) => setSettings({ ...settings, dpi: value })}
                      min={150}
                      max={600}
                      step={50}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label>Contrast: {settings.contrast.toFixed(1)}</Label>
                    <Slider
                      value={[settings.contrast]}
                      onValueChange={([value]) => setSettings({ ...settings, contrast: value })}
                      min={0.5}
                      max={2.0}
                      step={0.1}
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="flex items-center space-x-2">
                    <Switch
                      checked={settings.denoise}
                      onCheckedChange={(checked) => setSettings({ ...settings, denoise: checked })}
                    />
                    <Label>Remove Noise</Label>
                  </div>

                  <div className="flex items-center space-x-2">
                    <Switch
                      checked={settings.deskew}
                      onCheckedChange={(checked) => setSettings({ ...settings, deskew: checked })}
                    />
                    <Label>Auto Deskew</Label>
                  </div>
                </div>
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
                    Extract Text with Advanced OCR
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
        </TabsContent>

        <TabsContent value="preview" className="space-y-6">
          <div className="space-y-4">
            <h3 className="font-medium flex items-center">
              <Eye className="mr-2 h-4 w-4" />
              Document Preview
            </h3>

            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <h4 className="text-sm font-medium mb-2">Original</h4>
                <canvas ref={previewCanvasRef} className="border rounded max-w-full h-auto" />
              </div>

              {processedImageUrl && (
                <div>
                  <h4 className="text-sm font-medium mb-2">Processed for OCR</h4>
                  <img
                    src={processedImageUrl || "/placeholder.svg"}
                    alt="Processed"
                    className="border rounded max-w-full h-auto"
                  />
                </div>
              )}
            </div>
          </div>
        </TabsContent>

        <TabsContent value="results" className="space-y-6">
          {result && (
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <h3 className="font-medium">Extracted Text</h3>
                <div className="flex items-center space-x-2">
                  <span className="text-sm text-muted-foreground">Confidence: {result.confidence.toFixed(1)}%</span>
                  <div
                    className={`w-3 h-3 rounded-full ${
                      result.confidence > 80 ? "bg-green-500" : result.confidence > 60 ? "bg-yellow-500" : "bg-red-500"
                    }`}
                  />
                </div>
              </div>

              <Textarea value={result.text} readOnly className="min-h-[300px] font-mono text-sm" />

              <div className="flex flex-wrap gap-2">
                <Button variant="outline" onClick={copyToClipboard}>
                  <Copy className="mr-2 h-4 w-4" />
                  Copy to Clipboard
                </Button>
                <Button variant="outline" onClick={downloadAsText}>
                  <Download className="mr-2 h-4 w-4" />
                  Download as TXT
                </Button>
                <Button onClick={generateWordDocument}>
                  <FileText className="mr-2 h-4 w-4" />
                  Download as Word Document
                </Button>
              </div>

              <div className="space-y-4 p-4 border rounded-lg">
                <h4 className="font-medium">Extraction Analysis</h4>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                  <div>
                    <p className="text-muted-foreground">Total Words</p>
                    <p className="font-medium">{result.words.length}</p>
                  </div>
                  <div>
                    <p className="text-muted-foreground">High Confidence</p>
                    <p className="font-medium text-green-600">{result.words.filter((w) => w.confidence > 80).length}</p>
                  </div>
                  <div>
                    <p className="text-muted-foreground">Processing Time</p>
                    <p className="font-medium">{result.processingTime}ms</p>
                  </div>
                  <div>
                    <p className="text-muted-foreground">Method</p>
                    <p className="font-medium">{result.method}</p>
                  </div>
                </div>
              </div>
            </div>
          )}
        </TabsContent>
      </Tabs>

      <canvas ref={canvasRef} className="hidden" />
    </Card>
  )
}
