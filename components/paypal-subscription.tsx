"use client"

import { PayPalScriptProvider, PayPalButtons } from "@paypal/react-paypal-js"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { AlertCircle } from "lucide-react"

interface PayPalSubscriptionProps {
  onSuccess: (subscriptionId: string) => void
}

export function PayPalSubscription({ onSuccess }: PayPalSubscriptionProps) {
  const clientId = process.env.NEXT_PUBLIC_PAYPAL_CLIENT_ID
  const planId = process.env.NEXT_PUBLIC_PAYPAL_PLAN_ID

  if (!clientId || !planId) {
    return (
      <Alert>
        <AlertCircle className="h-4 w-4" />
        <AlertDescription>PayPal configuration is missing. Please set environment variables.</AlertDescription>
      </Alert>
    )
  }

  return (
    <PayPalScriptProvider options={{ clientId, vault: true, intent: "subscription" }}>
      <PayPalButtons
        style={{
          shape: "rect",
          color: "gold",
          layout: "vertical",
          label: "subscribe",
          height: 45,
          tagline: false,
        }}
        createSubscription={(data, actions) =>
          actions.subscription.create({
            plan_id: planId,
          })
        }
        onApprove={(data) => {
          // @ts-expect-error – subscriptionID is injected by PayPal
          onSuccess(data.subscriptionID)
        }}
        onError={(err) => {
          console.error("PayPal error:", err)
        }}
      />
    </PayPalScriptProvider>
  )
}
