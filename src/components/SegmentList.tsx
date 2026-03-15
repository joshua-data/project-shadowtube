'use client'

import { useEffect, useRef } from 'react'
import { usePlayerStore } from '@/stores/playerStore'
import { formatTime } from '@/lib/transcript'

export function SegmentList() {
  const listRef = useRef<HTMLDivElement>(null)
  const activeItemRef = useRef<HTMLButtonElement>(null)

  const {
    videoInfo,
    currentSegmentIndex,
    setCurrentSegmentIndex
  } = usePlayerStore()

  // Auto-scroll to current segment
  useEffect(() => {
    if (activeItemRef.current && listRef.current) {
      activeItemRef.current.scrollIntoView({
        behavior: 'smooth',
        block: 'nearest'
      })
    }
  }, [currentSegmentIndex])

  if (!videoInfo) {
    return null
  }

  return (
    <div className="bg-bg-card rounded-xl overflow-hidden">
      <div className="p-4 border-b border-white/10">
        <h3 className="font-semibold text-text-primary">Segments</h3>
        <p className="text-sm text-text-secondary">
          {videoInfo.segments.length} segments
        </p>
      </div>

      <div
        ref={listRef}
        className="max-h-[400px] overflow-y-auto divide-y divide-white/5"
      >
        {videoInfo.segments.map((segment, index) => {
          const isActive = index === currentSegmentIndex
          const progress = ((index + 1) / videoInfo.segments.length) * 100

          return (
            <button
              key={segment.id}
              ref={isActive ? activeItemRef : null}
              onClick={() => setCurrentSegmentIndex(index)}
              className={`w-full text-left p-4 transition-colors relative ${
                isActive
                  ? 'bg-accent/20'
                  : 'hover:bg-white/5'
              }`}
            >
              {/* Progress bar */}
              <div
                className="absolute left-0 top-0 bottom-0 bg-accent/10"
                style={{ width: `${progress}%` }}
              />

              <div className="relative z-10">
                <div className="flex items-center gap-2 mb-2">
                  <span className={`text-xs font-mono px-2 py-0.5 rounded ${
                    isActive ? 'bg-accent text-white' : 'bg-white/10 text-text-secondary'
                  }`}>
                    {formatTime(segment.startTime)}
                  </span>
                  <span className="text-xs text-text-secondary">
                    #{segment.id}
                  </span>
                </div>

                <p className={`text-sm leading-relaxed mb-1 ${
                  isActive ? 'text-text-primary' : 'text-text-secondary'
                }`}>
                  {truncateText(segment.textEn, 80)}
                </p>

                {segment.textTranslated && (
                  <p className="text-xs text-kr-accent/80 leading-relaxed">
                    {truncateText(segment.textTranslated, 60)}
                  </p>
                )}
              </div>
            </button>
          )
        })}
      </div>
    </div>
  )
}

function truncateText(text: string, maxLength: number): string {
  if (text.length <= maxLength) return text
  return text.substring(0, maxLength) + '...'
}
