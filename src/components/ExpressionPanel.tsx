'use client'

import { useMemo } from 'react'
import { usePlayerStore } from '@/stores/playerStore'

export function ExpressionPanel() {
  const { videoInfo, currentSegmentIndex } = usePlayerStore()

  const currentSegment = useMemo(() => {
    if (!videoInfo || currentSegmentIndex < 0 || currentSegmentIndex >= videoInfo.segments.length) {
      return null
    }
    return videoInfo.segments[currentSegmentIndex]
  }, [videoInfo, currentSegmentIndex])

  if (!videoInfo) {
    return null
  }

  const expressions = currentSegment?.expressions || []

  return (
    <div className="bg-bg-card rounded-xl overflow-hidden">
      <div className="p-4 border-b border-white/10">
        <h3 className="font-semibold text-text-primary">Key Expressions</h3>
        <p className="text-sm text-text-secondary">
          Learning points for current segment
        </p>
      </div>

      <div className="p-4">
        {expressions.length === 0 ? (
          <p className="text-text-secondary text-sm text-center py-4">
            No key expressions in this segment
          </p>
        ) : (
          <div className="space-y-4">
            {expressions.map((expr, index) => (
              <div
                key={index}
                className="p-4 bg-white/5 rounded-lg border border-white/10"
              >
                <div className="flex items-start justify-between gap-2 mb-2">
                  <span className="text-accent font-semibold text-lg">
                    {expr.word}
                  </span>
                  <span className="text-kr-accent text-sm shrink-0">
                    {expr.meaning}
                  </span>
                </div>

                {expr.description && (
                  <p className="text-text-secondary text-sm mb-3 leading-relaxed">
                    {expr.description}
                  </p>
                )}

                {expr.example && (
                  <div className="pt-3 border-t border-white/10">
                    <p className="text-xs text-text-secondary mb-1">Example</p>
                    <p className="text-sm text-text-primary italic">
                      &ldquo;{expr.example}&rdquo;
                    </p>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
