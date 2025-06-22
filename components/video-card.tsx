"use client"

import type React from "react"
import { useState, useCallback } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Play, Clock, ShoppingCart, Lock } from "lucide-react"
import { trackEvent } from "@/lib/analytics"
import { formatViewCount, formatDuration } from "@/lib/utils"
import type { Video } from "@/types"

interface VideoCardProps {
  video: Video
  isLocked?: boolean
  index?: number
}

export function VideoCard({ video, isLocked = false, index = 0 }: VideoCardProps) {
  const [imageLoaded, setImageLoaded] = useState(false)
  const [imageError, setImageError] = useState(false)

  const handleVideoClick = useCallback(() => {
    if (isLocked) {
      trackEvent("locked_video_clicked", {
        videoId: video.id,
        title: video.snippet.title,
        index,
      })
      return
    }

    trackEvent("video_clicked", {
      videoId: video.id,
      title: video.snippet.title,
      channel: video.snippet.channelTitle,
      index,
    })
    window.open(`https://www.youtube.com/watch?v=${video.id}`, "_blank", "noopener,noreferrer")
  }, [video, isLocked, index])

  const handleAffiliateClick = useCallback(
    (e: React.MouseEvent) => {
      e.stopPropagation()
      trackEvent("affiliate_clicked", {
        videoId: video.id,
        title: video.snippet.title,
        index,
        isLocked,
      })
    },
    [video, index, isLocked],
  )

  // Generate Amazon search URL based on video title
  const amazonSearchUrl = `https://www.amazon.com/s?k=${encodeURIComponent(video.snippet.title)}&tag=qualitygood0d-21`

  return (
    <Card className="group overflow-hidden hover:shadow-xl transition-all duration-300 cursor-pointer bg-white dark:bg-gray-700 relative">
      <div className="relative aspect-video bg-gray-100 dark:bg-gray-800" onClick={handleVideoClick}>
        {isLocked ? (
          <div className="w-full h-full flex flex-col items-center justify-center bg-gray-300 dark:bg-gray-900 text-gray-800 dark:text-gray-200">
            <Lock className="w-12 h-12 mb-2 text-gray-600 dark:text-gray-400" />
            <span className="font-bold text-lg">🔒 Subscribe to unlock</span>
            <span className="text-sm text-gray-600 dark:text-gray-400 mt-1">Premium content</span>
          </div>
        ) : !imageError ? (
          <>
            <img
              src={video.snippet.thumbnails?.maxres?.url || video.snippet.thumbnails?.high?.url}
              alt={video.snippet.title}
              className={`w-full h-full object-cover transition-opacity duration-300 ${
                imageLoaded ? "opacity-100" : "opacity-0"
              }`}
              onLoad={() => setImageLoaded(true)}
              onError={() => setImageError(true)}
              loading="lazy"
            />
            {!imageLoaded && (
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
              </div>
            )}
            <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors duration-300 flex items-center justify-center">
              <Play className="w-12 h-12 text-white opacity-0 group-hover:opacity-100 transition-opacity duration-300 drop-shadow-lg" />
            </div>
          </>
        ) : (
          <div className="w-full h-full flex items-center justify-center bg-gray-200 dark:bg-gray-800">
            <Play className="w-12 h-12 text-gray-400" />
          </div>
        )}

        {!isLocked && video.contentDetails?.duration && (
          <Badge className="absolute bottom-2 right-2 bg-black/80 text-white text-xs">
            <Clock className="w-3 h-3 mr-1" />
            {formatDuration(video.contentDetails.duration)}
          </Badge>
        )}

        {index < 3 && <Badge className="absolute top-2 left-2 bg-green-500 text-white text-xs">Free</Badge>}

        {isLocked && (
          <Badge className="absolute top-2 left-2 bg-yellow-500 text-white text-xs">
            <Lock className="w-3 h-3 mr-1" />
            Premium
          </Badge>
        )}
      </div>

      <CardContent className="p-4">
        <h3 className="font-semibold text-sm line-clamp-2 mb-2 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors text-gray-700 dark:text-gray-200">
          {video.snippet.title}
        </h3>

        {!isLocked && (
          <p className="text-xs text-gray-500 dark:text-gray-400 mb-2 line-clamp-1">{video.snippet.channelTitle}</p>
        )}

        {!isLocked && video.statistics?.viewCount && (
          <p className="text-xs text-gray-500 dark:text-gray-400 mb-3">
            {formatViewCount(Number.parseInt(video.statistics.viewCount))} views
          </p>
        )}

        <Button
          variant="outline"
          size="sm"
          className="w-full text-xs hover:bg-blue-50 hover:text-blue-700 hover:border-blue-300 dark:hover:bg-blue-900/20 dark:hover:text-blue-400 transition-colors"
          onClick={handleAffiliateClick}
          asChild
        >
          <a
            href={amazonSearchUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center justify-center gap-1"
          >
            <ShoppingCart className="w-3 h-3" />
            Shop related products on Amazon
          </a>
        </Button>
      </CardContent>
    </Card>
  )
}
