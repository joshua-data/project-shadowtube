'use client'

import { useEffect, useRef } from 'react'
import Script from 'next/script'
import { usePlayerStore } from '@/stores/playerStore'

export function VideoPlayer() {
  const playerContainerRef = useRef<HTMLDivElement>(null)
  const timeUpdateRef = useRef<NodeJS.Timeout | null>(null)

  const {
    videoInfo,
    playbackSpeed,
    player,
    setPlayer,
    setIsPlaying
  } = usePlayerStore()

  // Time-based segment tracking (get latest state directly from store)
  const checkCurrentSegment = () => {
    const state = usePlayerStore.getState()
    const { player, videoInfo, currentSegmentIndex, isRepeating } = state

    if (!player || !videoInfo) return

    const currentTime = player.getCurrentTime()
    const currentSegment = videoInfo.segments[currentSegmentIndex]

    if (!currentSegment) return

    // Check if reached segment end (0.3s buffer)
    if (currentTime >= currentSegment.endTime - 0.3) {
      console.log('[VideoPlayer] End of segment', {
        currentTime,
        segmentEnd: currentSegment.endTime,
        isRepeating,
        currentSegmentIndex
      })

      if (isRepeating) {
        // Repeat mode: seek back to segment start
        console.log('[VideoPlayer] Repeating - seeking to', currentSegment.startTime)
        player.seekTo(currentSegment.startTime, true)
        player.playVideo()
        return // Prevent other logic from running
      } else {
        // Move to next segment
        state.goToNextSegment()
        return
      }
    }

    // Find matching segment for current playback position (handle manual seek) - only when not repeating
    if (!isRepeating) {
      const matchingIndex = videoInfo.segments.findIndex(
        (seg) => currentTime >= seg.startTime && currentTime < seg.endTime
      )

      if (matchingIndex !== -1 && matchingIndex !== currentSegmentIndex) {
        state.setCurrentSegmentIndex(matchingIndex)
      }
    }
  }

  // Initialize YouTube Player
  const initializePlayer = () => {
    if (!videoInfo || !window.YT || !window.YT.Player) return

    // Remove existing player
    const currentPlayer = usePlayerStore.getState().player
    if (currentPlayer) {
      currentPlayer.destroy()
    }

    // Clear existing interval
    if (timeUpdateRef.current) {
      clearInterval(timeUpdateRef.current)
      timeUpdateRef.current = null
    }

    const newPlayer = new window.YT.Player('youtube-player', {
      videoId: videoInfo.videoId,
      playerVars: {
        autoplay: 0,
        controls: 1,
        modestbranding: 1,
        rel: 0,
        playsinline: 1
      },
      events: {
        onReady: (event) => {
          setPlayer(event.target)
          event.target.setPlaybackRate(playbackSpeed)

          // Seek to first segment start
          if (videoInfo.segments.length > 0) {
            event.target.seekTo(videoInfo.segments[0].startTime, true)
          }
        },
        onStateChange: (event) => {
          const isPlaying = event.data === window.YT.PlayerState.PLAYING
          setIsPlaying(isPlaying)

          if (isPlaying) {
            // Clear existing interval and set new one
            if (timeUpdateRef.current) {
              clearInterval(timeUpdateRef.current)
            }
            // Check time every 200ms
            timeUpdateRef.current = setInterval(checkCurrentSegment, 200)
          } else {
            if (timeUpdateRef.current) {
              clearInterval(timeUpdateRef.current)
              timeUpdateRef.current = null
            }
          }
        }
      }
    })
  }

  // Initialize player when videoInfo changes
  useEffect(() => {
    if (videoInfo && window.YT && window.YT.Player) {
      initializePlayer()
    }
  }, [videoInfo?.videoId]) // eslint-disable-line react-hooks/exhaustive-deps

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (timeUpdateRef.current) {
        clearInterval(timeUpdateRef.current)
      }
      if (player) {
        player.destroy()
      }
    }
  }, []) // eslint-disable-line react-hooks/exhaustive-deps

  // API ready callback
  const handleYTReady = () => {
    if (videoInfo) {
      initializePlayer()
    }
  }

  if (!videoInfo) {
    return null
  }

  return (
    <>
      <Script
        src="https://www.youtube.com/iframe_api"
        strategy="afterInteractive"
        onLoad={() => {
          // Set callback when YT API is ready
          window.onYouTubeIframeAPIReady = handleYTReady
          // Run immediately if already ready
          if (window.YT && window.YT.Player) {
            handleYTReady()
          }
        }}
      />
      <div
        ref={playerContainerRef}
        className="aspect-video w-full bg-black rounded-xl overflow-hidden"
      >
        <div id="youtube-player" className="w-full h-full" />
      </div>
    </>
  )
}
