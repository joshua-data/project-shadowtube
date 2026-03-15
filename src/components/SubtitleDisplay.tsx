'use client'

import { useMemo } from 'react'
import { usePlayerStore } from '@/stores/playerStore'

export function SubtitleDisplay() {
  const {
    videoInfo,
    currentSegmentIndex,
    showEnSubtitle,
    showTranslatedSubtitle
  } = usePlayerStore()

  const currentSegment = useMemo(() => {
    if (!videoInfo || currentSegmentIndex < 0 || currentSegmentIndex >= videoInfo.segments.length) {
      return null
    }
    return videoInfo.segments[currentSegmentIndex]
  }, [videoInfo, currentSegmentIndex])

  // Highlight key expressions
  const highlightedEnText = useMemo(() => {
    if (!currentSegment || currentSegment.expressions.length === 0) {
      return currentSegment?.textEn || ''
    }

    let text = currentSegment.textEn
    const expressionWords = currentSegment.expressions.map((e) => e.word)

    // Highlight each expression (case insensitive)
    expressionWords.forEach((word) => {
      const regex = new RegExp(`(${escapeRegex(word)})`, 'gi')
      text = text.replace(regex, '<mark>$1</mark>')
    })

    return text
  }, [currentSegment])

  if (!videoInfo || !currentSegment) {
    return null
  }

  if (!showEnSubtitle && !showTranslatedSubtitle) {
    return (
      <div className="p-6 bg-bg-card rounded-xl min-h-[120px] flex items-center justify-center">
        <span className="text-text-secondary text-sm">Subtitles are hidden</span>
      </div>
    )
  }

  return (
    <div className="p-6 bg-bg-card rounded-xl space-y-4">
      {showEnSubtitle && (
        <p
          className="text-xl text-text-primary leading-relaxed subtitle-en"
          dangerouslySetInnerHTML={{ __html: highlightedEnText }}
        />
      )}
      {showTranslatedSubtitle && currentSegment.textTranslated && (
        <p className="text-lg text-kr-accent leading-relaxed">
          {currentSegment.textTranslated}
        </p>
      )}
    </div>
  )
}

// Escape regex special characters
function escapeRegex(string: string): string {
  return string.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')
}
