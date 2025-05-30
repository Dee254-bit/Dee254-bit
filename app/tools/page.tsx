import type { Metadata } from "next"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { ScanText, Layers, FileDown, Edit, FileOutput, FileText, ArrowRight } from "lucide-react"
import Link from "next/link"

export const metadata: Metadata = {
  title: "PDF Tools | PDF Master",
  description: "All-in-one PDF tools for OCR, editing, converting, and more",
}

export default function ToolsPage() {
  const tools = [
    {
      icon: <ScanText className="h-12 w-12 text-primary" />,
      title: "Advanced OCR",
      description: "Extract text from scanned documents and images with industry-leading accuracy in 100+ languages.",
      features: ["Multi-language support", "High accuracy", "Batch processing", "Export to Word"],
      link: "/tools/ocr",
      popular: true,
    },
    {
      icon: <Layers className="h-12 w-12 text-primary" />,
      title: "Merge & Split PDFs",
      description: "Combine multiple PDFs into one or split a single PDF into multiple documents with ease.",
      features: ["Drag & drop ordering", "Page range selection", "Batch operations", "Preview mode"],
      link: "/tools/merge-split",
    },
    {
      icon: <FileDown className="h-12 w-12 text-primary" />,
      title: "Compress PDFs",
      description: "Reduce file size while maintaining quality for easier sharing and storage.",
      features: ["Quality control", "Size optimization", "Batch compression", "Preview comparison"],
      link: "/tools/compress",
    },
    {
      icon: <Edit className="h-12 w-12 text-primary" />,
      title: "Edit PDFs",
      description: "Add text, images, annotations, and modify your PDF documents without Adobe Acrobat.",
      features: ["Text editing", "Image insertion", "Annotations", "Page manipulation"],
      link: "/tools/edit",
    },
    {
      icon: <FileOutput className="h-12 w-12 text-primary" />,
      title: "Convert PDFs",
      description: "Transform PDFs to Word, Excel, PowerPoint, images, and many other formats.",
      features: ["Multiple formats", "Layout preservation", "Batch conversion", "High fidelity"],
      link: "/tools/convert",
    },
    {
      icon: <FileText className="h-12 w-12 text-primary" />,
      title: "Create PDFs",
      description: "Create PDFs from scratch or convert other document formats to PDF.",
      features: ["Multiple sources", "Template library", "Custom formatting", "Watermarks"],
      link: "/tools/create",
      comingSoon: true,
    },
  ]

  return (
    <div className="container py-12">
      <div className="text-center space-y-4 mb-12">
        <h1 className="text-4xl font-bold">PDF Tools</h1>
        <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
          Professional-grade PDF solutions for all your document processing needs
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {tools.map((tool, index) => (
          <Card
            key={index}
            className={`relative transition-all hover:shadow-lg ${
              tool.popular ? "border-primary shadow-md" : ""
            } ${tool.comingSoon ? "opacity-75" : ""}`}
          >
            {tool.popular && (
              <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
                <span className="bg-primary text-primary-foreground text-xs px-3 py-1 rounded-full">Most Popular</span>
              </div>
            )}

            {tool.comingSoon && (
              <div className="absolute -top-3 right-4">
                <span className="bg-secondary text-secondary-foreground text-xs px-3 py-1 rounded-full">
                  Coming Soon
                </span>
              </div>
            )}

            <CardHeader className="text-center pb-4">
              <div className="mx-auto mb-4">{tool.icon}</div>
              <CardTitle className="text-xl">{tool.title}</CardTitle>
              <CardDescription className="text-sm">{tool.description}</CardDescription>
            </CardHeader>

            <CardContent className="space-y-4">
              <ul className="space-y-2">
                {tool.features.map((feature, featureIndex) => (
                  <li key={featureIndex} className="flex items-center text-sm">
                    <div className="w-2 h-2 bg-primary rounded-full mr-3 flex-shrink-0" />
                    {feature}
                  </li>
                ))}
              </ul>

              <Button
                asChild
                className="w-full"
                variant={tool.popular ? "default" : "outline"}
                disabled={tool.comingSoon}
              >
                {tool.comingSoon ? (
                  <span>Coming Soon</span>
                ) : (
                  <Link href={tool.link}>
                    Try Now <ArrowRight className="ml-2 h-4 w-4" />
                  </Link>
                )}
              </Button>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="mt-16 text-center">
        <div className="max-w-2xl mx-auto space-y-4">
          <h2 className="text-2xl font-bold">Need Help Choosing?</h2>
          <p className="text-muted-foreground">
            Not sure which tool is right for you? Check out our pricing plans or contact our support team.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button asChild variant="outline">
              <Link href="/pricing">View Pricing</Link>
            </Button>
            <Button asChild variant="outline">
              <Link href="/contact">Contact Support</Link>
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}
