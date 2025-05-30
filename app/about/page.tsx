import type { Metadata } from "next"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Shield, Zap, Users, Globe, Award, Heart } from "lucide-react"
import Link from "next/link"

export const metadata: Metadata = {
  title: "About Us | PDF Master",
  description: "Learn about PDF Master - the all-in-one PDF solution for businesses and individuals",
}

export default function AboutPage() {
  const features = [
    {
      icon: <Shield className="h-8 w-8 text-primary" />,
      title: "Security First",
      description:
        "Your documents are processed securely with enterprise-grade encryption and are never stored on our servers.",
    },
    {
      icon: <Zap className="h-8 w-8 text-primary" />,
      title: "Lightning Fast",
      description:
        "Advanced algorithms and optimized processing ensure your documents are handled quickly and efficiently.",
    },
    {
      icon: <Globe className="h-8 w-8 text-primary" />,
      title: "100+ Languages",
      description: "Our OCR technology supports over 100 languages with industry-leading accuracy rates.",
    },
    {
      icon: <Users className="h-8 w-8 text-primary" />,
      title: "Team Collaboration",
      description: "Built for teams with sharing, collaboration features, and usage management tools.",
    },
    {
      icon: <Award className="h-8 w-8 text-primary" />,
      title: "Professional Grade",
      description: "Enterprise-quality tools trusted by businesses worldwide for their document processing needs.",
    },
    {
      icon: <Heart className="h-8 w-8 text-primary" />,
      title: "Customer Focused",
      description: "Dedicated support team and continuous improvements based on user feedback and needs.",
    },
  ]

  const stats = [
    { number: "1M+", label: "Documents Processed" },
    { number: "50K+", label: "Happy Users" },
    { number: "100+", label: "Languages Supported" },
    { number: "99.9%", label: "Uptime" },
  ]

  const team = [
    {
      name: "Sarah Johnson",
      role: "CEO & Founder",
      description: "Former Google engineer with 10+ years in document processing and AI.",
    },
    {
      name: "Michael Chen",
      role: "CTO",
      description: "Expert in machine learning and OCR technology with multiple patents.",
    },
    {
      name: "Emily Rodriguez",
      role: "Head of Product",
      description: "Product strategist focused on user experience and accessibility.",
    },
    {
      name: "David Kim",
      role: "Lead Engineer",
      description: "Full-stack developer specializing in high-performance web applications.",
    },
  ]

  return (
    <div className="container py-12">
      {/* Hero Section */}
      <div className="text-center space-y-6 mb-16">
        <h1 className="text-4xl md:text-5xl font-bold">About PDF Master</h1>
        <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
          We're on a mission to make PDF processing simple, fast, and accessible to everyone. From individuals to
          enterprise teams, our tools help you work smarter with your documents.
        </p>
      </div>

      {/* Stats Section */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mb-16">
        {stats.map((stat, index) => (
          <div key={index} className="text-center">
            <div className="text-3xl md:text-4xl font-bold text-primary mb-2">{stat.number}</div>
            <div className="text-muted-foreground">{stat.label}</div>
          </div>
        ))}
      </div>

      {/* Story Section */}
      <div className="max-w-4xl mx-auto mb-16">
        <Card>
          <CardHeader>
            <CardTitle className="text-2xl text-center">Our Story</CardTitle>
          </CardHeader>
          <CardContent className="prose prose-lg max-w-none">
            <p className="text-muted-foreground leading-relaxed">
              PDF Master was born out of frustration with existing PDF tools that were either too expensive, too
              complicated, or simply didn't work well. Our founders, having worked at major tech companies, saw an
              opportunity to build something better.
            </p>
            <p className="text-muted-foreground leading-relaxed">
              We started with a simple goal: create the most accurate OCR tool available online. But as we talked to
              users, we realized they needed more than just text extraction. They needed a complete PDF toolkit that was
              fast, reliable, and affordable.
            </p>
            <p className="text-muted-foreground leading-relaxed">
              Today, PDF Master serves over 50,000 users worldwide, from students and freelancers to Fortune 500
              companies. We're proud to be the go-to solution for anyone who works with PDF documents.
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Features Section */}
      <div className="mb-16">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold mb-4">Why Choose PDF Master?</h2>
          <p className="text-xl text-muted-foreground">
            We've built our platform with the features that matter most to our users.
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <Card key={index} className="text-center">
              <CardHeader>
                <div className="mx-auto mb-4">{feature.icon}</div>
                <CardTitle className="text-xl">{feature.title}</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription>{feature.description}</CardDescription>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      {/* Team Section */}
      <div className="mb-16">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold mb-4">Meet Our Team</h2>
          <p className="text-xl text-muted-foreground">The passionate people behind PDF Master's success.</p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
          {team.map((member, index) => (
            <Card key={index} className="text-center">
              <CardHeader>
                <div className="w-20 h-20 bg-primary/10 rounded-full mx-auto mb-4 flex items-center justify-center">
                  <Users className="h-10 w-10 text-primary" />
                </div>
                <CardTitle className="text-lg">{member.name}</CardTitle>
                <CardDescription className="font-medium text-primary">{member.role}</CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground">{member.description}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      {/* Values Section */}
      <div className="mb-16">
        <Card className="bg-primary/5">
          <CardHeader className="text-center">
            <CardTitle className="text-2xl">Our Values</CardTitle>
            <CardDescription>The principles that guide everything we do</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid md:grid-cols-3 gap-8">
              <div className="text-center">
                <h3 className="font-semibold mb-2">Privacy First</h3>
                <p className="text-sm text-muted-foreground">
                  Your documents are your business. We process them securely and never store them permanently.
                </p>
              </div>
              <div className="text-center">
                <h3 className="font-semibold mb-2">Continuous Innovation</h3>
                <p className="text-sm text-muted-foreground">
                  We're constantly improving our algorithms and adding new features based on user feedback.
                </p>
              </div>
              <div className="text-center">
                <h3 className="font-semibold mb-2">Accessibility</h3>
                <p className="text-sm text-muted-foreground">
                  Professional-grade tools should be available to everyone, not just large corporations.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* CTA Section */}
      <div className="text-center">
        <Card className="bg-gradient-to-r from-primary/10 to-secondary/10">
          <CardContent className="py-12">
            <h2 className="text-2xl font-bold mb-4">Ready to Get Started?</h2>
            <p className="text-muted-foreground mb-6 max-w-2xl mx-auto">
              Join thousands of users who trust PDF Master for their document processing needs. Start with our free plan
              and upgrade as you grow.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button asChild size="lg">
                <Link href="/tools">Try Our Tools</Link>
              </Button>
              <Button asChild variant="outline" size="lg">
                <Link href="/pricing">View Pricing</Link>
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
