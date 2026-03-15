'use client'

import { useEffect, useCallback } from 'react'
import { usePlayerStore } from '@/stores/playerStore'

export function ControlBar() {
  const {
    videoInfo,
    currentSegmentIndex,
    isPlaying,
    isRepeating,
    isFullRepeat,
    playbackSpeed,
    showEnSubtitle,
    showTranslatedSubtitle,
    player,
    setIsPlaying,
    toggleRepeat,
    toggleFullRepeat,
    increaseSpeed,
    decreaseSpeed,
    toggleEnSubtitle,
    toggleTranslatedSubtitle,
    goToPrevSegment,
    goToNextSegment
  } = usePlayerStore()

  const handlePlayPause = useCallback(() => {
    if (!player) return
    if (isPlaying) {
      player.pauseVideo()
    } else {
      player.playVideo()
    }
    setIsPlaying(!isPlaying)
  }, [player, isPlaying, setIsPlaying])

  // Keyboard shortcuts
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Ignore when typing in input fields
      if (e.target instanceof HTMLInputElement || e.target instanceof HTMLTextAreaElement) {
        return
      }

      switch (e.key.toLowerCase()) {
        case ' ':
          e.preventDefault()
          handlePlayPause()
          break
        case 'arrowleft':
          e.preventDefault()
          goToPrevSegment()
          break
        case 'arrowright':
          e.preventDefault()
          goToNextSegment()
          break
        case 'r':
          e.preventDefault()
          toggleRepeat()
          break
        case '+':
        case '=':
          e.preventDefault()
          increaseSpeed()
          break
        case '-':
          e.preventDefault()
          decreaseSpeed()
          break
      }
    }

    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [handlePlayPause, goToPrevSegment, goToNextSegment, toggleRepeat, increaseSpeed, decreaseSpeed])

  if (!videoInfo) {
    return null
  }

  const totalSegments = videoInfo.segments.length

  return (
    <div className="flex flex-wrap items-center justify-between gap-4 p-4 bg-bg-card rounded-xl">
      {/* Segment navigation */}
      <div className="flex items-center gap-2">
        <button
          onClick={goToPrevSegment}
          disabled={currentSegmentIndex === 0}
          className="p-2 rounded-lg hover:bg-white/10 disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
          title="Previous segment (←)"
        >
          <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
            <path d="M6 6h2v12H6zm3.5 6l8.5 6V6z" />
          </svg>
        </button>

        <button
          onClick={handlePlayPause}
          className="p-3 bg-accent rounded-full hover:bg-accent/90 transition-colors"
          title="Play/Pause (Space)"
        >
          {isPlaying ? (
            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
              <path d="M6 19h4V5H6v14zm8-14v14h4V5h-4z" />
            </svg>
          ) : (
            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
              <path d="M8 5v14l11-7z" />
            </svg>
          )}
        </button>

        <button
          onClick={goToNextSegment}
          disabled={currentSegmentIndex === totalSegments - 1 && !isFullRepeat}
          className="p-2 rounded-lg hover:bg-white/10 disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
          title="Next segment (→)"
        >
          <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
            <path d="M6 18l8.5-6L6 6v12zM16 6v12h2V6h-2z" />
          </svg>
        </button>

        <span className="ml-2 text-sm text-text-secondary font-mono">
          {currentSegmentIndex + 1} / {totalSegments}
        </span>
      </div>

      {/* Repeat & Speed */}
      <div className="flex items-center gap-3">
        <button
          onClick={toggleRepeat}
          className={`p-2 rounded-lg transition-colors ${
            isRepeating ? 'bg-accent text-white' : 'hover:bg-white/10'
          }`}
          title="Segment repeat (R)"
        >
          <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
            <path d="M7 7h10v3l4-4-4-4v3H5v6h2V7zm10 10H7v-3l-4 4 4 4v-3h12v-6h-2v4z" />
          </svg>
        </button>

        <button
          onClick={toggleFullRepeat}
          className={`p-2 rounded-lg transition-colors ${
            isFullRepeat ? 'bg-accent text-white' : 'hover:bg-white/10'
          }`}
          title="Full repeat"
        >
          <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
            <path d="M12 4V1L8 5l4 4V6c3.31 0 6 2.69 6 6 0 1.01-.25 1.97-.7 2.8l1.46 1.46C19.54 15.03 20 13.57 20 12c0-4.42-3.58-8-8-8zm0 14c-3.31 0-6-2.69-6-6 0-1.01.25-1.97.7-2.8L5.24 7.74C4.46 8.97 4 10.43 4 12c0 4.42 3.58 8 8 8v3l4-4-4-4v3z" />
          </svg>
        </button>

        <div className="flex items-center gap-1 px-2">
          <button
            onClick={decreaseSpeed}
            disabled={playbackSpeed <= 0.5}
            className="p-1 rounded hover:bg-white/10 disabled:opacity-30 transition-colors"
            title="Decrease speed (-)"
          >
            <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
              <path d="M19 13H5v-2h14v2z" />
            </svg>
          </button>
          <span className="w-12 text-center text-sm font-mono">
            {playbackSpeed.toFixed(1)}x
          </span>
          <button
            onClick={increaseSpeed}
            disabled={playbackSpeed >= 2.0}
            className="p-1 rounded hover:bg-white/10 disabled:opacity-30 transition-colors"
            title="Increase speed (+)"
          >
            <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
              <path d="M19 13h-6v6h-2v-6H5v-2h6V5h2v6h6v2z" />
            </svg>
          </button>
        </div>
      </div>

      {/* Subtitle toggle */}
      <div className="flex items-center gap-2">
        <button
          onClick={toggleEnSubtitle}
          className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${
            showEnSubtitle
              ? 'bg-accent text-white'
              : 'bg-white/10 text-text-secondary hover:bg-white/20'
          }`}
        >
          EN
        </button>
        <button
          onClick={toggleTranslatedSubtitle}
          className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${
            showTranslatedSubtitle
              ? 'bg-kr-accent text-white'
              : 'bg-white/10 text-text-secondary hover:bg-white/20'
          }`}
        >
          TR
        </button>
      </div>
    </div>
  )
}
