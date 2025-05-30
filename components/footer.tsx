import Link from "next/link"
import { FileText, Twitter, Facebook, Instagram, Linkedin, Github } from "lucide-react"

export default function Footer() {
  return (
    <footer className="bg-gray-50 border-t py-12 md:py-16">
      <div className="container px-4 md:px-6">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <FileText className="h-6 w-6 text-primary" />
              <span className="text-xl font-bold">PDF Master</span>
            </div>
            <p className="text-sm text-muted-foreground">
              All-in-one PDF solution for businesses and individuals. Process your PDFs with ease.
            </p>
            <div className="flex space-x-4">
              <Link href="#" className="text-muted-foreground hover:text-primary">
                <Twitter className="h-5 w-5" />
                <span className="sr-only">Twitter</span>
              </Link>
              <Link href="#" className="text-muted-foreground hover:text-primary">
                <Facebook className="h-5 w-5" />
                <span className="sr-only">Facebook</span>
              </Link>
              <Link href="#" className="text-muted-foreground hover:text-primary">
                <Instagram className="h-5 w-5" />
                <span className="sr-only">Instagram</span>
              </Link>
              <Link href="#" className="text-muted-foreground hover:text-primary">
                <Linkedin className="h-5 w-5" />
                <span className="sr-only">LinkedIn</span>
              </Link>
              <Link href="#" className="text-muted-foreground hover:text-primary">
                <Github className="h-5 w-5" />
                <span className="sr-only">GitHub</span>
              </Link>
            </div>
          </div>

          <div>
            <h3 className="font-medium mb-4">Tools</h3>
            <ul className="space-y-2 text-sm">
              <li>
                <Link href="/tools/ocr" className="text-muted-foreground hover:text-primary">
                  OCR
                </Link>
              </li>
              <li>
                <Link href="/tools/merge-split" className="text-muted-foreground hover:text-primary">
                  Merge & Split
                </Link>
              </li>
              <li>
                <Link href="/tools/compress" className="text-muted-foreground hover:text-primary">
                  Compress
                </Link>
              </li>
              <li>
                <Link href="/tools/edit" className="text-muted-foreground hover:text-primary">
                  Edit
                </Link>
              </li>
              <li>
                <Link href="/tools/convert" className="text-muted-foreground hover:text-primary">
                  Convert
                </Link>
              </li>
              <li>
                <Link href="/tools/create" className="text-muted-foreground hover:text-primary">
                  Create PDF
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="font-medium mb-4">Company</h3>
            <ul className="space-y-2 text-sm">
              <li>
                <Link href="/about" className="text-muted-foreground hover:text-primary">
                  About
                </Link>
              </li>
              <li>
                <Link href="/pricing" className="text-muted-foreground hover:text-primary">
                  Pricing
                </Link>
              </li>
              <li>
                <Link href="/blog" className="text-muted-foreground hover:text-primary">
                  Blog
                </Link>
              </li>
              <li>
                <Link href="/careers" className="text-muted-foreground hover:text-primary">
                  Careers
                </Link>
              </li>
              <li>
                <Link href="/contact" className="text-muted-foreground hover:text-primary">
                  Contact
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="font-medium mb-4">Legal</h3>
            <ul className="space-y-2 text-sm">
              <li>
                <Link href="/privacy" className="text-muted-foreground hover:text-primary">
                  Privacy Policy
                </Link>
              </li>
              <li>
                <Link href="/terms" className="text-muted-foreground hover:text-primary">
                  Terms of Service
                </Link>
              </li>
              <li>
                <Link href="/cookies" className="text-muted-foreground hover:text-primary">
                  Cookie Policy
                </Link>
              </li>
              <li>
                <Link href="/security" className="text-muted-foreground hover:text-primary">
                  Security
                </Link>
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-12 pt-8 border-t text-center text-sm text-muted-foreground">
          <p>&copy; {new Date().getFullYear()} PDF Master. All rights reserved.</p>
        </div>
      </div>
    </footer>
  )
}
