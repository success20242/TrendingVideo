export function trackEvent(event: string, properties?: Record<string, any>) {
  if (typeof window !== "undefined") {
    // Google Analytics 4
    if (window.gtag) {
      window.gtag("event", event, properties)
    }

    // Development logging
    if (process.env.NODE_ENV === "development") {
      console.log("Event tracked:", event, properties)
    }
  }
}

declare global {
  interface Window {
    gtag: (...args: any[]) => void
    paypal: any
  }
}
