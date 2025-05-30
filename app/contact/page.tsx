import type { Metadata } from "next"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Mail, Phone, MapPin, Clock, MessageSquare, HelpCircle } from "lucide-react"

export const metadata: Metadata = {
  title: "Contact Us | PDF Master",
  description: "Get in touch with our support team for help with PDF Master",
}

export default function ContactPage() {
  const contactMethods = [
    {
      icon: <Mail className="h-6 w-6 text-primary" />,
      title: "Email Support",
      description: "Get help via email within 24 hours",
      contact: "support@pdfmaster.com",
      available: "24/7",
    },
    {
      icon: <MessageSquare className="h-6 w-6 text-primary" />,
      title: "Live Chat",
      description: "Chat with our support team in real-time",
      contact: "Available in app",
      available: "Mon-Fri 9AM-6PM EST",
    },
    {
      icon: <Phone className="h-6 w-6 text-primary" />,
      title: "Phone Support",
      description: "Call us for urgent issues (Pro+ plans)",
      contact: "+1 (555) 123-4567",
      available: "Mon-Fri 9AM-6PM EST",
    },
  ]

  const faqs = [
    {
      question: "How secure is my data?",
      answer:
        "All documents are processed with enterprise-grade encryption and are automatically deleted after processing.",
    },
    {
      question: "What file formats do you support?",
      answer: "We support PDF, PNG, JPEG, TIFF for OCR, and can convert PDFs to Word, Excel, PowerPoint, and more.",
    },
    {
      question: "Can I cancel my subscription anytime?",
      answer:
        "Yes, you can cancel your subscription at any time. You'll continue to have access until the end of your billing period.",
    },
    {
      question: "Do you offer enterprise plans?",
      answer:
        "Yes, we offer custom enterprise plans with dedicated support, custom integrations, and volume discounts.",
    },
  ]

  return (
    <div className="container py-12">
      <div className="text-center space-y-4 mb-12">
        <h1 className="text-4xl font-bold">Contact Us</h1>
        <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
          Have questions or need help? We're here to assist you with anything related to PDF Master.
        </p>
      </div>

      <div className="grid lg:grid-cols-3 gap-8 mb-16">
        {/* Contact Form */}
        <div className="lg:col-span-2">
          <Card>
            <CardHeader>
              <CardTitle>Send us a Message</CardTitle>
              <CardDescription>Fill out the form below and we'll get back to you as soon as possible.</CardDescription>
            </CardHeader>
            <CardContent>
              <form className="space-y-6">
                <div className="grid md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="firstName">First Name</Label>
                    <Input id="firstName" placeholder="John" required />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="lastName">Last Name</Label>
                    <Input id="lastName" placeholder="Doe" required />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <Input id="email" type="email" placeholder="john@example.com" required />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="subject">Subject</Label>
                  <Select>
                    <SelectTrigger>
                      <SelectValue placeholder="Select a topic" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="general">General Question</SelectItem>
                      <SelectItem value="technical">Technical Support</SelectItem>
                      <SelectItem value="billing">Billing & Pricing</SelectItem>
                      <SelectItem value="feature">Feature Request</SelectItem>
                      <SelectItem value="enterprise">Enterprise Inquiry</SelectItem>
                      <SelectItem value="bug">Bug Report</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="message">Message</Label>
                  <Textarea
                    id="message"
                    placeholder="Please describe your question or issue in detail..."
                    className="min-h-[120px]"
                    required
                  />
                </div>

                <Button type="submit" className="w-full">
                  Send Message
                </Button>
              </form>
            </CardContent>
          </Card>
        </div>

        {/* Contact Information */}
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Get in Touch</CardTitle>
              <CardDescription>Choose the best way to reach us</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              {contactMethods.map((method, index) => (
                <div key={index} className="flex items-start space-x-3">
                  <div className="flex-shrink-0">{method.icon}</div>
                  <div>
                    <h3 className="font-medium">{method.title}</h3>
                    <p className="text-sm text-muted-foreground mb-1">{method.description}</p>
                    <p className="text-sm font-medium">{method.contact}</p>
                    <p className="text-xs text-muted-foreground">{method.available}</p>
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <MapPin className="h-5 w-5 mr-2" />
                Office Location
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">
                PDF Master Inc.
                <br />
                123 Tech Street, Suite 100
                <br />
                San Francisco, CA 94105
                <br />
                United States
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Clock className="h-5 w-5 mr-2" />
                Business Hours
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span>Monday - Friday</span>
                  <span>9:00 AM - 6:00 PM EST</span>
                </div>
                <div className="flex justify-between">
                  <span>Saturday</span>
                  <span>10:00 AM - 4:00 PM EST</span>
                </div>
                <div className="flex justify-between">
                  <span>Sunday</span>
                  <span>Closed</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* FAQ Section */}
      <div>
        <div className="text-center mb-8">
          <h2 className="text-2xl font-bold mb-4">Frequently Asked Questions</h2>
          <p className="text-muted-foreground">
            Quick answers to common questions. Can't find what you're looking for? Contact us directly.
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-6">
          {faqs.map((faq, index) => (
            <Card key={index}>
              <CardHeader>
                <CardTitle className="text-lg flex items-start">
                  <HelpCircle className="h-5 w-5 mr-2 mt-0.5 flex-shrink-0 text-primary" />
                  {faq.question}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">{faq.answer}</p>
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="text-center mt-8">
          <p className="text-muted-foreground mb-4">Still have questions?</p>
          <Button variant="outline">View Full FAQ</Button>
        </div>
      </div>
    </div>
  )
}
