"use client"

import { useState, useEffect, useCallback } from "react"
import type { Video } from "@/types"

interface UseVideoDataProps {
  country: string
  language: string
}

interface UseVideoDataReturn {
  videos: Video[]
  loading: boolean
  error: string | null
  refetch: () => void
}

export function useVideoData({ country, language }: UseVideoDataProps): UseVideoDataReturn {
  const [videos, setVideos] = useState<Video[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const fetchVideos = useCallback(async () => {
    try {
      setLoading(true)
      setError(null)

      const response = await fetch(
        "/api/videos?" +
          new URLSearchParams({
            country,
            language,
          }),
      )

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }

      const data = await response.json()
      setVideos(data.items || [])
    } catch (err) {
      console.error("Error fetching videos:", err)
      setError(err instanceof Error ? err.message : "Failed to fetch videos")
    } finally {
      setLoading(false)
    }
  }, [country, language])

  useEffect(() => {
    fetchVideos()
  }, [fetchVideos])

  return {
    videos,
    loading,
    error,
    refetch: fetchVideos,
  }
}
