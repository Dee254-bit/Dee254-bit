"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Slider } from "@/components/ui/slider"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Calculator, TrendingUp, CheckCircle } from "lucide-react"

export default function PricingCalculator() {
  const [monthlyUsage, setMonthlyUsage] = useState([500]) // MB

  const plans = [
    { name: "Free", limit: 200, price: 0, color: "bg-gray-100" },
    { name: "Starter", limit: 2048, price: 9.99, color: "bg-blue-100" },
    { name: "Pro", limit: 10240, price: 24.99, color: "bg-purple-100" },
    { name: "Business", limit: 51200, price: 79.99, color: "bg-green-100" },
    { name: "Enterprise", limit: Number.POSITIVE_INFINITY, price: 199.99, color: "bg-red-100" },
  ]

  const getRecommendedPlan = () => {
    return plans.find((plan) => monthlyUsage[0] <= plan.limit) || plans[plans.length - 1]
  }

  const formatSize = (mb: number) => {
    if (mb >= 1024) {
      return `${(mb / 1024).toFixed(1)} GB`
    }
    return `${mb} MB`
  }

  const calculateSavings = () => {
    const recommended = getRecommendedPlan()
    const nextPlan = plans[plans.indexOf(recommended) + 1]

    if (nextPlan) {
      const savings = nextPlan.price - recommended.price
      return savings > 0 ? savings : 0
    }
    return 0
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Calculator className="h-5 w-5" />
          Usage Calculator
        </CardTitle>
        <CardDescription>Find the perfect plan based on your monthly processing needs</CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="space-y-4">
          <div className="flex justify-between items-center">
            <label className="text-sm font-medium">Monthly Usage</label>
            <Badge variant="outline">{formatSize(monthlyUsage[0])}</Badge>
          </div>

          <Slider
            value={monthlyUsage}
            onValueChange={setMonthlyUsage}
            max={20480} // 20 GB
            min={50}
            step={50}
            className="w-full"
          />

          <div className="flex justify-between text-xs text-muted-foreground">
            <span>50 MB</span>
            <span>20 GB</span>
          </div>
        </div>

        <div className="space-y-3">
          <h4 className="font-medium">Plan Recommendations</h4>

          {plans.map((plan, index) => {
            const isRecommended = plan === getRecommendedPlan()
            const canHandle = monthlyUsage[0] <= plan.limit

            return (
              <div
                key={plan.name}
                className={`p-3 rounded-lg border-2 transition-all ${
                  isRecommended
                    ? "border-primary bg-primary/5"
                    : canHandle
                      ? "border-green-200 bg-green-50"
                      : "border-gray-200 bg-gray-50 opacity-60"
                }`}
              >
                <div className="flex justify-between items-center">
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-medium">{plan.name}</span>
                      {isRecommended && <Badge className="text-xs">Recommended</Badge>}
                      {canHandle && !isRecommended && <CheckCircle className="h-4 w-4 text-green-500" />}
                    </div>
                    <p className="text-sm text-muted-foreground">
                      {plan.limit === Number.POSITIVE_INFINITY ? "Unlimited" : formatSize(plan.limit)} per month
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="font-bold">{plan.price === 0 ? "Free" : `$${plan.price}`}</p>
                    {plan.price > 0 && <p className="text-xs text-muted-foreground">/month</p>}
                  </div>
                </div>

                {isRecommended && (
                  <div className="mt-2 pt-2 border-t">
                    <div className="flex justify-between items-center">
                      <span className="text-sm">Cost per MB: ${((plan.price / plan.limit) * 1000).toFixed(3)}</span>
                      <Button size="sm">Choose Plan</Button>
                    </div>
                  </div>
                )}
              </div>
            )
          })}
        </div>

        {calculateSavings() > 0 && (
          <div className="p-3 bg-green-50 border border-green-200 rounded-lg">
            <div className="flex items-center gap-2">
              <TrendingUp className="h-4 w-4 text-green-600" />
              <span className="text-sm font-medium text-green-800">
                You could save ${calculateSavings().toFixed(2)}/month
              </span>
            </div>
            <p className="text-xs text-green-700 mt-1">By choosing the recommended plan instead of the next tier up.</p>
          </div>
        )}

        <div className="text-center pt-4 border-t">
          <p className="text-sm text-muted-foreground mb-2">Need more than 20GB? Contact us for enterprise pricing.</p>
          <Button variant="outline" size="sm">
            Contact Sales
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}
