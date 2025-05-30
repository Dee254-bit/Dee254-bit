"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { HardDrive, TrendingUp, Calendar, Zap } from "lucide-react"

interface UsageData {
  currentUsage: number // in MB
  monthlyLimit: number // in MB
  plan: string
  resetDate: string
  dailyUsage: { date: string; usage: number }[]
}

export default function UsageTracker() {
  const [usage, setUsage] = useState<UsageData>({
    currentUsage: 45.7,
    monthlyLimit: 200,
    plan: "Free",
    resetDate: "2024-02-01",
    dailyUsage: [
      { date: "2024-01-15", usage: 12.3 },
      { date: "2024-01-16", usage: 8.9 },
      { date: "2024-01-17", usage: 15.2 },
      { date: "2024-01-18", usage: 9.3 },
    ],
  })

  const usagePercentage = (usage.currentUsage / usage.monthlyLimit) * 100
  const remainingMB = usage.monthlyLimit - usage.currentUsage
  const daysUntilReset = Math.ceil((new Date(usage.resetDate).getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24))

  const getUsageColor = () => {
    if (usagePercentage >= 90) return "text-red-600"
    if (usagePercentage >= 75) return "text-yellow-600"
    return "text-green-600"
  }

  const getUsageBadgeVariant = () => {
    if (usagePercentage >= 90) return "destructive"
    if (usagePercentage >= 75) return "secondary"
    return "default"
  }

  return (
    <div className="space-y-6">
      {/* Main Usage Card */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="flex items-center gap-2">
                <HardDrive className="h-5 w-5" />
                Monthly Usage
              </CardTitle>
              <CardDescription>
                {usage.plan} Plan • Resets in {daysUntilReset} days
              </CardDescription>
            </div>
            <Badge variant={getUsageBadgeVariant()}>{usagePercentage.toFixed(1)}% used</Badge>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span>Used: {usage.currentUsage.toFixed(1)} MB</span>
              <span>Limit: {usage.monthlyLimit} MB</span>
            </div>
            <Progress value={usagePercentage} className="h-3" />
            <div className="flex justify-between text-xs text-muted-foreground">
              <span className={getUsageColor()}>{remainingMB.toFixed(1)} MB remaining</span>
              <span>Resets on {new Date(usage.resetDate).toLocaleDateString()}</span>
            </div>
          </div>

          {usagePercentage >= 80 && (
            <div className="p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
              <div className="flex items-center gap-2">
                <Zap className="h-4 w-4 text-yellow-600" />
                <span className="text-sm font-medium text-yellow-800">
                  {usagePercentage >= 90 ? "Almost at limit!" : "Approaching limit"}
                </span>
              </div>
              <p className="text-xs text-yellow-700 mt-1">Consider upgrading to avoid service interruption.</p>
              <Button size="sm" className="mt-2">
                Upgrade Plan
              </Button>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Usage Statistics */}
      <div className="grid md:grid-cols-3 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <TrendingUp className="h-4 w-4 text-muted-foreground" />
              <span className="text-sm font-medium">Daily Average</span>
            </div>
            <p className="text-2xl font-bold mt-1">{(usage.currentUsage / new Date().getDate()).toFixed(1)} MB</p>
            <p className="text-xs text-muted-foreground">This month</p>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <Calendar className="h-4 w-4 text-muted-foreground" />
              <span className="text-sm font-medium">Peak Day</span>
            </div>
            <p className="text-2xl font-bold mt-1">{Math.max(...usage.dailyUsage.map((d) => d.usage)).toFixed(1)} MB</p>
            <p className="text-xs text-muted-foreground">Highest single day</p>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <HardDrive className="h-4 w-4 text-muted-foreground" />
              <span className="text-sm font-medium">Files Processed</span>
            </div>
            <p className="text-2xl font-bold mt-1">23</p>
            <p className="text-xs text-muted-foreground">This month</p>
          </CardContent>
        </Card>
      </div>

      {/* Plan Comparison */}
      <Card>
        <CardHeader>
          <CardTitle>Plan Comparison</CardTitle>
          <CardDescription>See how much you could process with different plans</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            <div className="flex justify-between items-center p-3 bg-muted/20 rounded-lg">
              <div>
                <span className="font-medium">Free Plan</span>
                <p className="text-sm text-muted-foreground">200 MB/month</p>
              </div>
              <Badge variant="outline">Current</Badge>
            </div>

            <div className="flex justify-between items-center p-3 border rounded-lg">
              <div>
                <span className="font-medium">Starter Plan</span>
                <p className="text-sm text-muted-foreground">2 GB/month • $9.99</p>
              </div>
              <Button variant="outline" size="sm">
                Upgrade
              </Button>
            </div>

            <div className="flex justify-between items-center p-3 border rounded-lg">
              <div>
                <span className="font-medium">Pro Plan</span>
                <p className="text-sm text-muted-foreground">10 GB/month • $24.99</p>
              </div>
              <Button variant="outline" size="sm">
                Upgrade
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
