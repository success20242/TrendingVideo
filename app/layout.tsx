import type React from "react"
import type { Metadata } from "next"
import { Inter } from "next/font/google"
import "./globals.css"
import { ThemeProvider } from "@/components/theme-provider"
import { Toaster } from "@/components/ui/toaster"
import { ErrorBoundary } from "@/components/error-boundary"
import { AnalyticsProvider } from "@/components/analytics-provider"
import { Suspense } from "react"
import Script from "next/script"

const inter = Inter({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: "🔥 TrendifyTube - Viral Videos + Smart Shopping",
  description:
    "Watch trending YouTube videos by country and unlock exclusive Amazon deals. Subscribe for premium access!",
  keywords: "trending videos, youtube, viral, amazon deals, shopping, entertainment",
  authors: [{ name: "TrendifyTube Team" }],
  openGraph: {
    title: "🔥 TrendifyTube - Viral Videos + Smart Shopping",
    description:
      "Watch trending YouTube videos by country and unlock exclusive Amazon deals. Subscribe for premium access!",
    type: "website",
    locale: "en_US",
    url: "https://trendify12.vercel.app",
    images: [
      {
        url: "https://i.ibb.co/wZzWzBpJ/Colorful-Minimalist-Social-Community-Logo-removebg-preview.png",
        width: 1200,
        height: 630,
        alt: "TrendifyTube Logo",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "🔥 TrendifyTube - Viral Videos + Smart Shopping",
    description:
      "Watch trending YouTube videos by country and unlock exclusive Amazon deals. Subscribe for premium access!",
    images: ["https://i.ibb.co/wZzWzBpJ/Colorful-Minimalist-Social-Community-Logo-removebg-preview.png"],
  },
  robots: {
    index: true,
    follow: true,
  },
    generator: 'v0.dev'
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        {/* Google Analytics */}
        <Script src="https://www.googletagmanager.com/gtag/js?id=G-N68WW63XZ4" strategy="afterInteractive" />
        <Script id="google-analytics" strategy="afterInteractive">
          {`
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());
            gtag('config', 'G-N68WW63XZ4');
          `}
        </Script>
      </head>
      <body className={inter.className}>
        <ErrorBoundary>
          <Suspense fallback={null}>
            <ThemeProvider attribute="class" defaultTheme="light" enableSystem={false} disableTransitionOnChange>
              <AnalyticsProvider>
                {children}
                <Toaster />
              </AnalyticsProvider>
            </ThemeProvider>
          </Suspense>
        </ErrorBoundary>
      </body>
    </html>
  )
}
