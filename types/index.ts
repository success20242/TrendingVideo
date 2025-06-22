export interface Video {
  id: string
  snippet: {
    title: string
    description: string
    channelTitle: string
    publishedAt: string
    thumbnails: {
      default?: { url: string; width: number; height: number }
      medium?: { url: string; width: number; height: number }
      high?: { url: string; width: number; height: number }
      standard?: { url: string; width: number; height: number }
      maxres?: { url: string; width: number; height: number }
    }
  }
  statistics?: {
    viewCount: string
    likeCount: string
    commentCount: string
  }
  contentDetails?: {
    duration: string
  }
}

export interface Country {
  code: string
  name: string
  flag: string
}

export interface Language {
  code: string
  name: string
}

export interface VideoCardProps {
  video: Video
  isLocked?: boolean
  index?: number
}
