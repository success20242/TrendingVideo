"use client"

import { useEffect, useCallback, useMemo } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { Skeleton } from "@/components/ui/skeleton"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { AlertCircle, Crown, Flame } from "lucide-react"
import { VideoCard } from "@/components/video-card"
import { PayPalSubscription } from "@/components/paypal-subscription"
import { useLocalStorage } from "@/hooks/use-local-storage"
import { useVideoData } from "@/hooks/use-video-data"
import { COUNTRIES, LANGUAGES } from "@/lib/constants"
import { trackEvent } from "@/lib/analytics"
import type { Video, Country, Language } from "@/types"
import Image from "next/image"

export function TrendingVideoApp() {
  const [isPremium, setIsPremium] = useLocalStorage("isPremium", false)
  const [selectedCountry, setSelectedCountry] = useLocalStorage<string>("selectedCountry", "US")
  const [selectedLanguage, setSelectedLanguage] = useLocalStorage<string>("selectedLanguage", "en")
  const [darkMode, setDarkMode] = useLocalStorage("darkMode", false)

  // Load dark mode preference on mount
  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add("dark")
    } else {
      document.documentElement.classList.remove("dark")
    }
  }, [darkMode])

  // Toggle dark mode function
  const toggleDarkMode = useCallback(() => {
    setDarkMode((prev: boolean) => {
      const newMode = !prev
      if (newMode) {
        document.documentElement.classList.add("dark")
      } else {
        document.documentElement.classList.remove("dark")
      }
      trackEvent("theme_changed", { theme: newMode ? "dark" : "light" })
      return newMode
    })
  }, [setDarkMode])

  const { videos, loading, error, refetch } = useVideoData({
    country: selectedCountry,
    language: selectedLanguage,
  })

  const availableCountries = useMemo(() => COUNTRIES, [])
  const availableLanguages = useMemo(() => LANGUAGES, [])

  const handleCountryChange = useCallback(
    (value: string) => {
      setSelectedCountry(value)
      trackEvent("country_changed", { country: value, isPremium })
    },
    [setSelectedCountry, isPremium],
  )

  const handleLanguageChange = useCallback(
    (value: string) => {
      setSelectedLanguage(value)
      trackEvent("language_changed", { language: value, isPremium })
    },
    [setSelectedLanguage, isPremium],
  )

  const handleSubscriptionSuccess = useCallback(
    (subscriptionId: string) => {
      setIsPremium(true)
      trackEvent("subscription_completed", { subscriptionId })
    },
    [setIsPremium],
  )

  useEffect(() => {
    trackEvent("page_view", { isPremium, country: selectedCountry, language: selectedLanguage })
  }, [isPremium, selectedCountry, selectedLanguage])

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center p-6">
        <Alert className="max-w-md">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>
            Failed to load videos. Please check your internet connection and try again.
            <button
              onClick={refetch}
              className="mt-2 w-full px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors"
            >
              Retry
            </button>
          </AlertDescription>
        </Alert>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-800 transition-colors duration-300">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <header className="text-center mb-8">
          <div className="flex items-center justify-center gap-2 mb-4">
            <Image
              src="https://i.ibb.co/wZzWzBpJ/Colorful-Minimalist-Social-Community-Logo-removebg-preview.png"
              alt="TrendifyTube Logo"
              width={96}
              height={96}
              className="w-24 h-24"
              priority
            />
          </div>

          <div className="flex items-center justify-center gap-2 mb-4">
            <h1 className="text-4xl font-bold text-gray-800 dark:text-gray-200">Trending Video</h1>
            {isPremium && (
              <Badge className="bg-yellow-100 text-yellow-800 border-yellow-300 dark:bg-yellow-900 dark:text-yellow-200">
                <Crown className="w-3 h-3 mr-1" />
                Premium
              </Badge>
            )}
          </div>

          <p className="text-gray-500 dark:text-gray-400 text-lg mb-6 flex items-center justify-center gap-2">
            <Flame className="w-5 h-5 text-orange-500" />
            Watch What's Hot. Shop What's Smarter.
          </p>

          {/* Controls */}
          <div className="flex flex-wrap items-center justify-center gap-4 mb-6">
            <Select value={selectedCountry} onValueChange={handleCountryChange}>
              <SelectTrigger className="w-[200px] dark:bg-gray-700 dark:text-gray-200 dark:border-gray-600">
                <SelectValue placeholder="Select country" />
              </SelectTrigger>
              <SelectContent className="dark:bg-gray-700 dark:text-gray-200">
                {availableCountries.map((country: Country) => (
                  <SelectItem key={country.code} value={country.code} className="dark:hover:bg-gray-600">
                    {country.flag} {country.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            <Select value={selectedLanguage} onValueChange={handleLanguageChange}>
              <SelectTrigger className="w-[200px] dark:bg-gray-700 dark:text-gray-200 dark:border-gray-600">
                <SelectValue placeholder="Select language" />
              </SelectTrigger>
              <SelectContent className="dark:bg-gray-700 dark:text-gray-200">
                {availableLanguages.map((language: Language) => (
                  <SelectItem key={language.code} value={language.code} className="dark:hover:bg-gray-600">
                    {language.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            <button
              onClick={toggleDarkMode}
              className="px-4 py-2 rounded bg-yellow-400 dark:bg-yellow-600 text-gray-900 dark:text-gray-100 font-semibold hover:bg-yellow-500 dark:hover:bg-yellow-700 transition-colors duration-300 flex items-center gap-2"
              aria-label="Toggle dark mode"
            >
              {darkMode ? "🌙 Dark Mode" : "☀️ Light Mode"}
            </button>
          </div>

          {/* Premium Upgrade */}
          {!isPremium && (
            <Card className="max-w-md mx-auto mb-8 border-2 border-yellow-200 bg-gradient-to-br from-yellow-50 to-orange-50 dark:from-yellow-900/20 dark:to-orange-900/20 dark:border-yellow-700">
              <CardContent className="p-6">
                <div className="text-center mb-4">
                  <Crown className="w-8 h-8 mx-auto mb-2 text-yellow-500" />
                  <h3 className="font-semibold mb-2 text-gray-800 dark:text-gray-200">Unlock Premium Features</h3>
                  <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
                    Get unlimited access to all trending videos from every country and exclusive Amazon deals!
                  </p>
                  <div className="text-xs text-gray-500 dark:text-gray-400 mb-4">
                    ✨ First 3 videos are free • Premium unlocks all videos
                  </div>
                </div>
                <PayPalSubscription onSuccess={handleSubscriptionSuccess} />
              </CardContent>
            </Card>
          )}
        </header>

        {/* Video Grid */}
        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {Array.from({ length: 12 }).map((_, index) => (
              <Card key={index} className="overflow-hidden dark:bg-gray-700">
                <Skeleton className="w-full h-48" />
                <CardContent className="p-4">
                  <Skeleton className="h-4 w-full mb-2" />
                  <Skeleton className="h-3 w-2/3 mb-2" />
                  <Skeleton className="h-8 w-full" />
                </CardContent>
              </Card>
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {videos.map((video: Video, index: number) => {
              const isLocked = !isPremium && index >= 3

              return <VideoCard key={video.id} video={video} isLocked={isLocked} index={index} />
            })}
          </div>
        )}

        {/* Premium Status (Development Only) */}
        {isPremium && process.env.NODE_ENV === "development" && (
          <Card className="mt-12 border-dashed border-2 border-green-300 bg-green-50 dark:bg-green-900/20 dark:border-green-700">
            <CardContent className="p-6">
              <div className="flex items-center gap-2 mb-2">
                <Badge variant="outline" className="bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200">
                  Development Only
                </Badge>
                <h3 className="font-semibold text-green-800 dark:text-green-200">Premium Status Active</h3>
              </div>
              <p className="text-sm text-green-700 dark:text-green-300">
                Premium Status: <span className="font-mono font-bold">{isPremium.toString()}</span>
              </p>
              <p className="text-xs text-green-600 dark:text-green-400 mt-2">
                This panel is only visible in development mode. In production, subscription status should be verified
                server-side.
              </p>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  )
}
