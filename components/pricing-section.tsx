"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { CheckCircle, CreditCard, Smartphone } from "lucide-react"
import PaymentModal from "@/components/payment-modal"

interface PricingPlan {
  name: string
  price: number
  description: string
  features: string[]
  popular?: boolean
  buttonText: string
}

export default function PricingSection() {
  const [selectedPlan, setSelectedPlan] = useState<PricingPlan | null>(null)
  const [showPaymentModal, setShowPaymentModal] = useState(false)

  const plans: PricingPlan[] = [
    {
      name: "Free",
      price: 0,
      description: "Perfect for occasional use",
      features: [
        "200MB processing per month",
        "Basic OCR (English only)",
        "Standard processing speed",
        "Email support",
        "Basic PDF tools",
        "Watermarked outputs",
      ],
      buttonText: "Get Started Free",
    },
    {
      name: "Starter",
      price: 9.99,
      description: "Best for regular users",
      features: [
        "2GB processing per month",
        "OCR in 100+ languages",
        "Priority processing",
        "Advanced editing tools",
        "No watermarks",
        "Email support",
        "Download history",
      ],
      popular: false,
      buttonText: "Start Starter Plan",
    },
    {
      name: "Pro",
      price: 24.99,
      description: "For power users and small teams",
      features: [
        "10GB processing per month",
        "OCR in 100+ languages",
        "Fastest processing speed",
        "Advanced editing tools",
        "Batch processing",
        "API access (1000 calls/month)",
        "Priority support",
        "Team collaboration (up to 5 users)",
      ],
      popular: true,
      buttonText: "Start Pro Trial",
    },
    {
      name: "Business",
      price: 79.99,
      description: "For teams and businesses",
      features: [
        "50GB processing per month",
        "Everything in Pro",
        "Team collaboration (unlimited users)",
        "Advanced API access (10,000 calls/month)",
        "Custom integrations",
        "Advanced security",
        "24/7 phone support",
        "Custom branding",
        "SLA guarantee",
      ],
      buttonText: "Contact Sales",
    },
    {
      name: "Enterprise",
      price: 199.99,
      description: "For large organizations",
      features: [
        "Unlimited processing",
        "Everything in Business",
        "Dedicated infrastructure",
        "Custom deployment options",
        "Advanced analytics",
        "Dedicated account manager",
        "Custom training",
        "White-label solution",
        "Enterprise SLA",
      ],
      buttonText: "Contact Sales",
    },
  ]

  const handleSelectPlan = (plan: PricingPlan) => {
    if (plan.price === 0) {
      // Handle free plan signup
      window.location.href = "/signup"
      return
    }

    setSelectedPlan(plan)
    setShowPaymentModal(true)
  }

  return (
    <>
      <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
        {plans.map((plan, index) => (
          <Card
            key={index}
            className={`relative ${plan.popular ? "border-primary shadow-lg scale-105" : "border-border"}`}
          >
            {plan.popular && (
              <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                <Badge className="bg-primary text-primary-foreground">Most Popular</Badge>
              </div>
            )}

            <CardHeader className="text-center pb-8">
              <CardTitle className="text-2xl">{plan.name}</CardTitle>
              <div className="mt-4">
                <span className="text-4xl font-bold">${plan.price}</span>
                {plan.price > 0 && <span className="text-muted-foreground">/month</span>}
              </div>
              <CardDescription>{plan.description}</CardDescription>
            </CardHeader>

            <CardContent className="space-y-4">
              {plan.features.map((feature, featureIndex) => (
                <div key={featureIndex} className="flex items-center space-x-3">
                  <CheckCircle className="w-5 h-5 text-green-500 flex-shrink-0" />
                  <span className="text-sm">{feature}</span>
                </div>
              ))}
            </CardContent>

            <CardFooter>
              <Button
                className={`w-full ${plan.popular ? "" : "variant-outline"}`}
                variant={plan.popular ? "default" : "outline"}
                onClick={() => handleSelectPlan(plan)}
              >
                {plan.buttonText}
              </Button>
            </CardFooter>
          </Card>
        ))}
      </div>

      <div className="mt-16 text-center">
        <h3 className="text-2xl font-bold mb-8">Accepted Payment Methods</h3>
        <div className="flex justify-center items-center space-x-8">
          <div className="flex items-center space-x-2">
            <CreditCard className="h-6 w-6 text-primary" />
            <span className="font-medium">PayPal</span>
          </div>
          <div className="flex items-center space-x-2">
            <Smartphone className="h-6 w-6 text-primary" />
            <span className="font-medium">M-Pesa</span>
          </div>
          <div className="flex items-center space-x-2">
            <CreditCard className="h-6 w-6 text-primary" />
            <span className="font-medium">Credit Cards</span>
          </div>
        </div>
      </div>

      {showPaymentModal && selectedPlan && (
        <PaymentModal plan={selectedPlan} onClose={() => setShowPaymentModal(false)} />
      )}
    </>
  )
}
