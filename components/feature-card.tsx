import type React from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { ArrowRight } from "lucide-react"

interface FeatureCardProps {
  icon: React.ReactNode
  title: string
  description: string
  link: string
}

export default function FeatureCard({ icon, title, description, link }: FeatureCardProps) {
  return (
    <Card className="border-0 shadow-md hover:shadow-lg transition-shadow">
      <CardHeader>
        <div className="mb-4">{icon}</div>
        <CardTitle>{title}</CardTitle>
        <CardDescription>{description}</CardDescription>
      </CardHeader>
      <CardContent>
        <Button asChild variant="ghost" className="p-0 h-auto">
          <Link href={link} className="flex items-center text-primary">
            Try Now <ArrowRight className="ml-2 h-4 w-4" />
          </Link>
        </Button>
      </CardContent>
    </Card>
  )
}
