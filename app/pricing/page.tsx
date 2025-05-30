import type { Metadata } from "next"
import PricingSection from "@/components/pricing-section"
import PricingCalculator from "@/components/pricing-calculator"
import UsageTracker from "@/components/usage-tracker"

export const metadata: Metadata = {
  title: "Pricing - PDF Master",
  description: "Choose the perfect plan for your PDF processing needs",
}

export default function PricingPage() {
  return (
    <div className="container py-12">
      <div className="text-center space-y-4 mb-12">
        <h1 className="text-4xl font-bold">Usage-Based Pricing</h1>
        <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
          Pay only for what you use. Start with 200MB free every month, then scale as you grow.
        </p>
      </div>

      {/* Usage Calculator */}
      <div className="max-w-2xl mx-auto mb-12">
        <PricingCalculator />
      </div>

      {/* Main Pricing Section */}
      <PricingSection />

      {/* Usage Tracker Demo */}
      <div className="max-w-4xl mx-auto mt-16">
        <div className="text-center mb-8">
          <h2 className="text-2xl font-bold">Track Your Usage</h2>
          <p className="text-muted-foreground">Monitor your monthly processing usage and optimize your plan</p>
        </div>
        <UsageTracker />
      </div>
    </div>
  )
}
