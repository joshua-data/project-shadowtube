'use client'

import { useState, useEffect } from 'react'
import { usePlayerStore } from '@/stores/playerStore'
import { getSavedVideos, deleteVideo, type SavedVideo } from '@/lib/storage'

export function SavedVideoList() {
  const [videos, setVideos] = useState<SavedVideo[]>([])
  const { loadSavedVideo, videoInfo } = usePlayerStore()

  // Load saved videos on mount
  useEffect(() => {
    setVideos(getSavedVideos())
  }, [])

  // Refresh list when videoInfo changes (after saving new video)
  useEffect(() => {
    setVideos(getSavedVideos())
  }, [videoInfo])

  const handleLoad = (videoId: string) => {
    loadSavedVideo(videoId)
  }

  const handleDelete = (videoId: string, e: React.MouseEvent) => {
    e.stopPropagation()
    if (confirm('Delete this video?')) {
      deleteVideo(videoId)
      setVideos(getSavedVideos())
    }
  }

  const formatDate = (isoString: string) => {
    const date = new Date(isoString)
    return date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    })
  }

  if (videos.length === 0) {
    return null
  }

  return (
    <div className="w-full max-w-2xl mx-auto mt-8">
      <h3 className="text-lg font-semibold text-text-primary mb-3">
        Saved Videos
      </h3>
      <div className="grid gap-3">
        {videos.map((video) => (
          <button
            key={video.videoId}
            onClick={() => handleLoad(video.videoId)}
            className={`w-full text-left p-4 bg-bg-card rounded-lg border transition-all
                       hover:border-accent/50 hover:bg-bg-card/80 group
                       ${videoInfo?.videoId === video.videoId
                         ? 'border-accent'
                         : 'border-white/10'
                       }`}
          >
            <div className="flex items-start justify-between gap-3">
              <div className="flex-1 min-w-0">
                <p className="font-medium text-text-primary truncate">
                  {video.title}
                </p>
                <div className="flex items-center gap-3 mt-1 text-sm text-text-secondary">
                  <span>{video.segmentCount} segments</span>
                  <span>·</span>
                  <span>{formatDate(video.savedAt)}</span>
                </div>
              </div>
              <button
                onClick={(e) => handleDelete(video.videoId, e)}
                className="p-2 rounded-lg text-text-secondary hover:text-red-400
                           hover:bg-red-400/10 opacity-0 group-hover:opacity-100 transition-all"
                title="Delete"
              >
                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M6 19c0 1.1.9 2 2 2h8c1.1 0 2-.9 2-2V7H6v12zM19 4h-3.5l-1-1h-5l-1 1H5v2h14V4z" />
                </svg>
              </button>
            </div>
          </button>
        ))}
      </div>
    </div>
  )
}
