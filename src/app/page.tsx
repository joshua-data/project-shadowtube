'use client'

import { usePlayerStore } from '@/stores/playerStore'
import { UrlInput } from '@/components/UrlInput'
import { VideoPlayer } from '@/components/VideoPlayer'
import { ControlBar } from '@/components/ControlBar'
import { SubtitleDisplay } from '@/components/SubtitleDisplay'
import { SegmentList } from '@/components/SegmentList'
import { ExpressionPanel } from '@/components/ExpressionPanel'
import { SavedVideoList } from '@/components/SavedVideoList'

export default function Home() {
  const { videoInfo, loading, loadingStep, loadingProgress, isSaved, saveCurrentVideo, deleteCurrentVideo } = usePlayerStore()

  return (
    <main className="min-h-screen bg-bg-primary text-text-primary">
      {/* Header */}
      <header className="sticky top-0 z-50 bg-bg-primary/80 backdrop-blur-lg border-b border-white/10">
        <div className="max-w-7xl mx-auto px-4 py-4 flex items-center justify-between">
          <h1 className="text-xl font-bold text-accent">ShadowTube</h1>
          <span className="text-sm text-text-secondary">English Shadowing Practice</span>
        </div>
      </header>

      {/* URL input area */}
      <section className={`transition-all duration-500 ${
        videoInfo ? 'py-4' : 'py-16'
      }`}>
        <div className="max-w-7xl mx-auto px-4">
          {!videoInfo && (
            <div className="text-center mb-8">
              <h2 className="text-3xl font-bold mb-2">Learn English with YouTube</h2>
              <p className="text-text-secondary">
                Extract subtitles from YouTube videos and practice segment by segment
              </p>
            </div>
          )}
          <UrlInput />
          {!videoInfo && <SavedVideoList />}
        </div>
      </section>

      {/* Loading overlay */}
      {loading && (
        <div className="fixed inset-0 z-40 bg-bg-primary/90 flex items-center justify-center">
          <div className="text-center w-80">
            <div className="w-16 h-16 border-4 border-accent/30 border-t-accent rounded-full animate-spin mx-auto mb-4" />
            <p className="text-lg text-text-primary mb-4">{loadingStep}</p>

            {/* Progress bar */}
            <div className="w-full bg-white/10 rounded-full h-2 mb-2">
              <div
                className="bg-accent h-2 rounded-full transition-all duration-300"
                style={{ width: `${loadingProgress}%` }}
              />
            </div>
            <p className="text-2xl font-bold text-accent">{loadingProgress}%</p>
          </div>
        </div>
      )}

      {/* Main content */}
      {videoInfo && (
        <section className="max-w-7xl mx-auto px-4 pb-8">
          {/* Video title + Save button */}
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-semibold text-text-primary">
              {videoInfo.title}
            </h2>
            <button
              onClick={isSaved ? deleteCurrentVideo : saveCurrentVideo}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-colors
                         ${isSaved
                           ? 'bg-accent text-white hover:bg-accent/90'
                           : 'bg-white/10 text-text-secondary hover:bg-white/20'
                         }`}
            >
              {isSaved ? (
                <>
                  <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M17 3H7c-1.1 0-2 .9-2 2v16l7-3 7 3V5c0-1.1-.9-2-2-2z" />
                  </svg>
                  Saved
                </>
              ) : (
                <>
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                    <path d="M17 3H7c-1.1 0-2 .9-2 2v16l7-3 7 3V5c0-1.1-.9-2-2-2z" />
                  </svg>
                  Save
                </>
              )}
            </button>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Left: Video + Controls + Subtitles */}
            <div className="lg:col-span-2 space-y-4">
              <VideoPlayer />
              <ControlBar />
              <SubtitleDisplay />
            </div>

            {/* Right: Side panel */}
            <div className="space-y-4 lg:sticky lg:top-20 lg:self-start">
              <SegmentList />
              <ExpressionPanel />
            </div>
          </div>
        </section>
      )}

      {/* Footer */}
      <footer className="border-t border-white/10 py-6">
        <div className="max-w-7xl mx-auto px-4 text-center text-sm text-text-secondary">
          <p>Keyboard shortcuts: ← → (navigate segments) | Space (play/pause) | R (repeat segment) | +/- (adjust speed)</p>
        </div>
      </footer>
    </main>
  )
}
