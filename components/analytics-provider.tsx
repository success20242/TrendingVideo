"use client"

import { createContext, useContext, type ReactNode } from "react"

const AnalyticsContext = createContext<{
  trackEvent: (event: string, properties?: Record<string, any>) => void
}>({
  trackEvent: () => {},
})

export function AnalyticsProvider({ children }: { children: ReactNode }) {
  const trackEvent = (event: string, properties?: Record<string, any>) => {
    // Google Analytics 4
    if (typeof window !== "undefined" && window.gtag) {
      window.gtag("event", event, properties)
    }

    // Development logging
    if (process.env.NODE_ENV === "development") {
      console.log("Analytics Event:", event, properties)
    }
  }

  return <AnalyticsContext.Provider value={{ trackEvent }}>{children}</AnalyticsContext.Provider>
}

export const useAnalytics = () => useContext(AnalyticsContext)
