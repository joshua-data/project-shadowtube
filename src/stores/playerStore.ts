import { create } from 'zustand'
import type { VideoInfo, Segment, YouTubePlayer } from '@/lib/types'
import { saveVideo as saveToStorage, loadVideo as loadFromStorage, deleteVideo as deleteFromStorage, isVideoSaved } from '@/lib/storage'

interface PlayerStore {
  // State
  videoInfo: VideoInfo | null
  currentSegmentIndex: number
  isPlaying: boolean
  isRepeating: boolean       // Segment repeat
  isFullRepeat: boolean      // Full video repeat
  playbackSpeed: number      // 0.5 ~ 2.0
  showEnSubtitle: boolean
  showTranslatedSubtitle: boolean
  loading: boolean
  loadingStep: string
  loadingProgress: number    // 0 ~ 100
  isSaved: boolean           // Is current video saved

  // YouTube Player reference
  player: YouTubePlayer | null

  // Actions
  setVideoInfo: (info: VideoInfo) => void
  setCurrentSegmentIndex: (index: number) => void
  setIsPlaying: (playing: boolean) => void
  toggleRepeat: () => void
  toggleFullRepeat: () => void
  setPlaybackSpeed: (speed: number) => void
  increaseSpeed: () => void
  decreaseSpeed: () => void
  toggleEnSubtitle: () => void
  toggleTranslatedSubtitle: () => void
  setLoading: (loading: boolean, step?: string, progress?: number) => void
  setPlayer: (player: YouTubePlayer | null) => void

  // Helper methods
  getCurrentSegment: () => Segment | null
  goToNextSegment: () => void
  goToPrevSegment: () => void
  reset: () => void

  // Save methods
  saveCurrentVideo: () => void
  loadSavedVideo: (videoId: string) => void
  deleteCurrentVideo: () => void
}

const initialState = {
  videoInfo: null,
  currentSegmentIndex: 0,
  isPlaying: false,
  isRepeating: false,
  isFullRepeat: false,
  playbackSpeed: 1.0,
  showEnSubtitle: true,
  showTranslatedSubtitle: true,
  loading: false,
  loadingStep: '',
  loadingProgress: 0,
  player: null,
  isSaved: false,
}

export const usePlayerStore = create<PlayerStore>((set, get) => ({
  ...initialState,

  setVideoInfo: (info) => set({
    videoInfo: info,
    currentSegmentIndex: 0,
    isSaved: isVideoSaved(info.videoId)
  }),

  setCurrentSegmentIndex: (index) => {
    const { videoInfo, player } = get()
    if (!videoInfo || index < 0 || index >= videoInfo.segments.length) return

    const segment = videoInfo.segments[index]
    set({ currentSegmentIndex: index })

    // Seek to segment start time
    if (player) {
      player.seekTo(segment.startTime, true)
    }
  },

  setIsPlaying: (playing) => set({ isPlaying: playing }),

  toggleRepeat: () => set((state) => ({ isRepeating: !state.isRepeating })),

  toggleFullRepeat: () => set((state) => ({ isFullRepeat: !state.isFullRepeat })),

  setPlaybackSpeed: (speed) => {
    const { player } = get()
    const clampedSpeed = Math.max(0.5, Math.min(2.0, speed))
    set({ playbackSpeed: clampedSpeed })
    if (player) {
      player.setPlaybackRate(clampedSpeed)
    }
  },

  increaseSpeed: () => {
    const { playbackSpeed, setPlaybackSpeed } = get()
    setPlaybackSpeed(Math.round((playbackSpeed + 0.1) * 10) / 10)
  },

  decreaseSpeed: () => {
    const { playbackSpeed, setPlaybackSpeed } = get()
    setPlaybackSpeed(Math.round((playbackSpeed - 0.1) * 10) / 10)
  },

  toggleEnSubtitle: () => set((state) => ({ showEnSubtitle: !state.showEnSubtitle })),

  toggleTranslatedSubtitle: () => set((state) => ({ showTranslatedSubtitle: !state.showTranslatedSubtitle })),

  setLoading: (loading, step = '', progress = 0) => set({ loading, loadingStep: step, loadingProgress: progress }),

  setPlayer: (player) => set({ player }),

  getCurrentSegment: () => {
    const { videoInfo, currentSegmentIndex } = get()
    if (!videoInfo || currentSegmentIndex < 0 || currentSegmentIndex >= videoInfo.segments.length) {
      return null
    }
    return videoInfo.segments[currentSegmentIndex]
  },

  goToNextSegment: () => {
    const { videoInfo, currentSegmentIndex, setCurrentSegmentIndex, isFullRepeat } = get()
    if (!videoInfo) return

    const nextIndex = currentSegmentIndex + 1
    if (nextIndex < videoInfo.segments.length) {
      setCurrentSegmentIndex(nextIndex)
    } else if (isFullRepeat) {
      // Loop to beginning in full repeat mode
      setCurrentSegmentIndex(0)
    }
  },

  goToPrevSegment: () => {
    const { currentSegmentIndex, setCurrentSegmentIndex } = get()
    if (currentSegmentIndex > 0) {
      setCurrentSegmentIndex(currentSegmentIndex - 1)
    }
  },

  reset: () => set(initialState),

  saveCurrentVideo: () => {
    const { videoInfo } = get()
    if (!videoInfo) return
    saveToStorage(videoInfo)
    set({ isSaved: true })
  },

  loadSavedVideo: (videoId: string) => {
    const videoInfo = loadFromStorage(videoId)
    if (videoInfo) {
      set({
        videoInfo,
        currentSegmentIndex: 0,
        isSaved: true
      })
    }
  },

  deleteCurrentVideo: () => {
    const { videoInfo } = get()
    if (!videoInfo) return
    deleteFromStorage(videoInfo.videoId)
    set({ isSaved: false })
  },
}))
