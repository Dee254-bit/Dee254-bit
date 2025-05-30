"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { X, CreditCard, Smartphone } from "lucide-react"

interface PaymentModalProps {
  plan: {
    name: string
    price: number
    description: string
  }
  onClose: () => void
}

export default function PaymentModal({ plan, onClose }: PaymentModalProps) {
  const [isProcessing, setIsProcessing] = useState(false)
  const [mpesaPhone, setMpesaPhone] = useState("")

  const handlePayPalPayment = async () => {
    setIsProcessing(true)

    try {
      // In a real implementation, you would integrate with PayPal SDK
      // For now, we'll simulate the payment process

      // PayPal integration would look something like this:
      // const paypal = await loadPayPalScript()
      // const order = await paypal.createOrder({
      //   amount: plan.price,
      //   currency: 'USD'
      // })

      console.log(`Processing PayPal payment for ${plan.name} - $${plan.price}`)

      // Simulate payment processing
      await new Promise((resolve) => setTimeout(resolve, 2000))

      alert("Payment successful! Welcome to " + plan.name)
      onClose()
    } catch (error) {
      console.error("PayPal payment error:", error)
      alert("Payment failed. Please try again.")
    } finally {
      setIsProcessing(false)
    }
  }

  const handleMpesaPayment = async () => {
    if (!mpesaPhone) {
      alert("Please enter your M-Pesa phone number")
      return
    }

    setIsProcessing(true)

    try {
      // In a real implementation, you would integrate with M-Pesa API
      // This requires backend integration with Safaricom's Daraja API

      console.log(`Processing M-Pesa payment for ${plan.name} - $${plan.price} to ${mpesaPhone}`)

      // Simulate payment processing
      await new Promise((resolve) => setTimeout(resolve, 2000))

      alert(`M-Pesa payment request sent to ${mpesaPhone}. Please complete the payment on your phone.`)
      onClose()
    } catch (error) {
      console.error("M-Pesa payment error:", error)
      alert("Payment failed. Please try again.")
    } finally {
      setIsProcessing(false)
    }
  }

  const handleCreditCardPayment = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsProcessing(true)

    try {
      // In a real implementation, you would integrate with Stripe or similar
      console.log(`Processing credit card payment for ${plan.name} - $${plan.price}`)

      // Simulate payment processing
      await new Promise((resolve) => setTimeout(resolve, 2000))

      alert("Payment successful! Welcome to " + plan.name)
      onClose()
    } catch (error) {
      console.error("Credit card payment error:", error)
      alert("Payment failed. Please try again.")
    } finally {
      setIsProcessing(false)
    }
  }

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <div>
            <CardTitle>Complete Payment</CardTitle>
            <CardDescription>
              {plan.name} Plan - ${plan.price}/month
            </CardDescription>
          </div>
          <Button variant="ghost" size="icon" onClick={onClose}>
            <X className="h-4 w-4" />
          </Button>
        </CardHeader>

        <CardContent>
          <Tabs defaultValue="paypal" className="w-full">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="paypal">PayPal</TabsTrigger>
              <TabsTrigger value="mpesa">M-Pesa</TabsTrigger>
              <TabsTrigger value="card">Card</TabsTrigger>
            </TabsList>

            <TabsContent value="paypal" className="space-y-4">
              <div className="text-center space-y-4">
                <CreditCard className="h-12 w-12 mx-auto text-primary" />
                <p className="text-sm text-muted-foreground">
                  You will be redirected to PayPal to complete your payment securely.
                </p>
                <Button className="w-full" onClick={handlePayPalPayment} disabled={isProcessing}>
                  {isProcessing ? "Processing..." : `Pay $${plan.price} with PayPal`}
                </Button>
              </div>
            </TabsContent>

            <TabsContent value="mpesa" className="space-y-4">
              <div className="space-y-4">
                <div className="text-center">
                  <Smartphone className="h-12 w-12 mx-auto text-primary mb-2" />
                  <p className="text-sm text-muted-foreground">
                    Enter your M-Pesa phone number to receive a payment prompt.
                  </p>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="mpesa-phone">M-Pesa Phone Number</Label>
                  <Input
                    id="mpesa-phone"
                    placeholder="+254 7XX XXX XXX"
                    value={mpesaPhone}
                    onChange={(e) => setMpesaPhone(e.target.value)}
                  />
                </div>

                <Button className="w-full" onClick={handleMpesaPayment} disabled={isProcessing}>
                  {isProcessing ? "Processing..." : `Pay $${plan.price} with M-Pesa`}
                </Button>
              </div>
            </TabsContent>

            <TabsContent value="card" className="space-y-4">
              <form onSubmit={handleCreditCardPayment} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="card-number">Card Number</Label>
                  <Input id="card-number" placeholder="1234 5678 9012 3456" required />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="expiry">Expiry Date</Label>
                    <Input id="expiry" placeholder="MM/YY" required />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="cvc">CVC</Label>
                    <Input id="cvc" placeholder="123" required />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="name">Cardholder Name</Label>
                  <Input id="name" placeholder="John Doe" required />
                </div>

                <Button type="submit" className="w-full" disabled={isProcessing}>
                  {isProcessing ? "Processing..." : `Pay $${plan.price}`}
                </Button>
              </form>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  )
}
