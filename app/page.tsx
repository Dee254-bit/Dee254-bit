import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { ArrowRight, FileText, Layers, ScanText, FileOutput, Edit, FileDown } from "lucide-react"
import Link from "next/link"
import FeatureCard from "@/components/feature-card"
import HeroSection from "@/components/hero-section"

export default function LandingPage() {
  const features = [
    {
      icon: <ScanText className="h-10 w-10 text-primary" />,
      title: "OCR for All Languages",
      description: "Extract text from scanned documents in over 100 languages with high accuracy.",
      link: "/tools/ocr",
    },
    {
      icon: <Layers className="h-10 w-10 text-primary" />,
      title: "Merge & Split PDFs",
      description: "Combine multiple PDFs into one or split a single PDF into multiple documents.",
      link: "/tools/merge-split",
    },
    {
      icon: <FileDown className="h-10 w-10 text-primary" />,
      title: "Compress PDFs",
      description: "Reduce file size while maintaining quality for easier sharing and storage.",
      link: "/tools/compress",
    },
    {
      icon: <Edit className="h-10 w-10 text-primary" />,
      title: "Edit PDFs",
      description: "Modify text, images, and pages in your PDF documents without Adobe Acrobat.",
      link: "/tools/edit",
    },
    {
      icon: <FileOutput className="h-10 w-10 text-primary" />,
      title: "Convert PDFs",
      description: "Transform PDFs to Word, Excel, PowerPoint, images, and many other formats.",
      link: "/tools/convert",
    },
    {
      icon: <FileText className="h-10 w-10 text-primary" />,
      title: "PDF Creation",
      description: "Create PDFs from scratch or convert other document formats to PDF.",
      link: "/tools/create",
    },
  ]

  return (
    <main className="flex min-h-screen flex-col">
      <HeroSection />

      {/* Features Section */}
      <section className="py-20 bg-white">
        <div className="container px-4 md:px-6">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold tracking-tight sm:text-4xl md:text-5xl">
              All the PDF tools you need in one place
            </h2>
            <p className="mt-4 text-xl text-muted-foreground max-w-3xl mx-auto">
              Professional-grade PDF solutions for individuals and businesses
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <FeatureCard
                key={index}
                icon={feature.icon}
                title={feature.title}
                description={feature.description}
                link={feature.link}
              />
            ))}
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section className="py-20 bg-gray-50">
        <div className="container px-4 md:px-6">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">How It Works</h2>
            <p className="mt-4 text-xl text-muted-foreground max-w-2xl mx-auto">
              Three simple steps to process your PDF documents
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto">
            <Card className="border-0 shadow-md">
              <CardHeader className="text-center pb-2">
                <div className="mx-auto bg-primary/10 w-12 h-12 flex items-center justify-center rounded-full mb-4">
                  <span className="text-xl font-bold text-primary">1</span>
                </div>
                <CardTitle>Upload</CardTitle>
              </CardHeader>
              <CardContent className="text-center">
                <CardDescription>Upload your PDF files from your device, cloud storage, or via URL</CardDescription>
              </CardContent>
            </Card>

            <Card className="border-0 shadow-md">
              <CardHeader className="text-center pb-2">
                <div className="mx-auto bg-primary/10 w-12 h-12 flex items-center justify-center rounded-full mb-4">
                  <span className="text-xl font-bold text-primary">2</span>
                </div>
                <CardTitle>Process</CardTitle>
              </CardHeader>
              <CardContent className="text-center">
                <CardDescription>
                  Select the operation you want to perform and adjust settings if needed
                </CardDescription>
              </CardContent>
            </Card>

            <Card className="border-0 shadow-md">
              <CardHeader className="text-center pb-2">
                <div className="mx-auto bg-primary/10 w-12 h-12 flex items-center justify-center rounded-full mb-4">
                  <span className="text-xl font-bold text-primary">3</span>
                </div>
                <CardTitle>Download</CardTitle>
              </CardHeader>
              <CardContent className="text-center">
                <CardDescription>Download your processed files or save them directly to cloud storage</CardDescription>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-primary text-white">
        <div className="container px-4 md:px-6">
          <div className="text-center max-w-3xl mx-auto">
            <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">Ready to transform your PDF workflow?</h2>
            <p className="mt-4 text-xl text-primary-foreground/90 mb-8">
              Start using our powerful PDF tools today — no installation required.
            </p>
            <Button asChild size="lg" variant="secondary" className="text-primary">
              <Link href="/tools">
                Get Started <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
          </div>
        </div>
      </section>
    </main>
  )
}
