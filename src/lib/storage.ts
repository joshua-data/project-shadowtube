import type { VideoInfo } from './types'

const STORAGE_KEY = 'shadowtube_videos'

export interface SavedVideo {
  videoId: string
  title: string
  segmentCount: number
  savedAt: string // ISO date string
  videoInfo: VideoInfo
}

/**
 * Get all saved videos
 */
export function getSavedVideos(): SavedVideo[] {
  if (typeof window === 'undefined') return []

  try {
    const data = localStorage.getItem(STORAGE_KEY)
    if (!data) return []
    return JSON.parse(data)
  } catch {
    return []
  }
}

/**
 * Save video
 */
export function saveVideo(videoInfo: VideoInfo): void {
  if (typeof window === 'undefined') return

  const videos = getSavedVideos()

  // Update if already saved
  const existingIndex = videos.findIndex((v) => v.videoId === videoInfo.videoId)

  const savedVideo: SavedVideo = {
    videoId: videoInfo.videoId,
    title: videoInfo.title,
    segmentCount: videoInfo.segments.length,
    savedAt: new Date().toISOString(),
    videoInfo
  }

  if (existingIndex >= 0) {
    videos[existingIndex] = savedVideo
  } else {
    videos.unshift(savedVideo) // Add newest item at front
  }

  localStorage.setItem(STORAGE_KEY, JSON.stringify(videos))
}

/**
 * Delete saved video
 */
export function deleteVideo(videoId: string): void {
  if (typeof window === 'undefined') return

  const videos = getSavedVideos()
  const filtered = videos.filter((v) => v.videoId !== videoId)
  localStorage.setItem(STORAGE_KEY, JSON.stringify(filtered))
}

/**
 * Load saved video
 */
export function loadVideo(videoId: string): VideoInfo | null {
  const videos = getSavedVideos()
  const video = videos.find((v) => v.videoId === videoId)
  return video?.videoInfo || null
}

/**
 * Check if video is saved
 */
export function isVideoSaved(videoId: string): boolean {
  const videos = getSavedVideos()
  return videos.some((v) => v.videoId === videoId)
}
