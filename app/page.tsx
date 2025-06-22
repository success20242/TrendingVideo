import { TrendingVideoApp } from "@/components/trending-video-app"
import { Suspense } from "react"
import { LoadingSpinner } from "@/components/ui/loading-spinner"

export default function HomePage() {
  return (
    <main className="min-h-screen">
      <Suspense fallback={<LoadingSpinner />}>
        <TrendingVideoApp />
      </Suspense>
    </main>
  )
}
