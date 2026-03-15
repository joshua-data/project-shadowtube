'use client'

import { useState, FormEvent } from 'react'
import { usePlayerStore } from '@/stores/playerStore'
import { segmentTranscript } from '@/lib/transcript'
import { TARGET_LANGUAGES, type TargetLanguage } from '@/lib/types'
import type { ApiResponse, TranscriptData, TranslateResult } from '@/lib/types'

export function UrlInput() {
  const [url, setUrl] = useState('')
  const [targetLanguage, setTargetLanguage] = useState<TargetLanguage>('ko')
  const [error, setError] = useState('')

  const { loading, loadingStep, setLoading, setVideoInfo, reset } = usePlayerStore()

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault()
    setError('')

    if (!url.trim()) {
      setError('Please enter a YouTube URL.')
      return
    }

    try {
      reset()
      setLoading(true, 'Extracting transcript...', 5)

      // 1. Extract transcript
      const transcriptRes = await fetch('/api/transcript', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ url })
      })

      const transcriptData: ApiResponse<TranscriptData> = await transcriptRes.json()

      if (!transcriptData.success || !transcriptData.data) {
        setError(transcriptData.message || 'Failed to extract transcript.')
        setLoading(false)
        return
      }

      setLoading(true, 'Splitting into segments...', 10)

      // 2. Split into segments
      const segments = segmentTranscript(transcriptData.data.rawTranscript)

      if (segments.length === 0) {
        setError('No segments could be created.')
        setLoading(false)
        return
      }

      // 3. Request translation in batches with progress tracking
      const BATCH_SIZE = 10
      const totalBatches = Math.ceil(segments.length / BATCH_SIZE)
      const allResults: TranslateResult[] = []

      for (let i = 0; i < segments.length; i += BATCH_SIZE) {
        const batchIndex = Math.floor(i / BATCH_SIZE)
        const batch = segments.slice(i, i + BATCH_SIZE)

        // Calculate progress: 15% for transcript, 85% for translation
        const translationProgress = 15 + Math.round((batchIndex / totalBatches) * 85)
        setLoading(
          true,
          `Translating to ${TARGET_LANGUAGES[targetLanguage]}... (${batchIndex + 1}/${totalBatches})`,
          translationProgress
        )

        const translateRes = await fetch('/api/translate', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            targetLanguage,
            segments: batch.map((s) => ({
              id: s.id,
              textEn: s.textEn
            }))
          })
        })

        const translateData: ApiResponse<TranslateResult[]> = await translateRes.json()

        if (translateData.success && translateData.data) {
          allResults.push(...translateData.data)
        }
      }

      setLoading(true, 'Finalizing...', 100)

      // 4. Merge translation results into segments
      for (const result of allResults) {
        const segment = segments.find((s) => s.id === result.id)
        if (segment) {
          segment.textTranslated = result.textTranslated
          segment.expressions = result.expressions
        }
      }

      // 5. Set video info after all processing complete
      setVideoInfo({
        videoId: transcriptData.data.videoId,
        title: transcriptData.data.title,
        targetLanguage,
        segments
      })

      setLoading(false)

    } catch (err) {
      console.error('Error:', err)
      setError('An error occurred during processing.')
      setLoading(false)
    }
  }

  return (
    <div className="w-full max-w-2xl mx-auto">
      <form onSubmit={handleSubmit} className="space-y-3">
        <div className="flex gap-3">
          <input
            type="text"
            value={url}
            onChange={(e) => setUrl(e.target.value)}
            placeholder="Paste YouTube URL here"
            className="flex-1 px-4 py-3 bg-bg-card border border-gray-700 rounded-lg
                       text-text-primary placeholder-text-secondary
                       focus:outline-none focus:border-accent focus:ring-1 focus:ring-accent
                       transition-colors"
            disabled={loading}
          />
          <button
            type="submit"
            disabled={loading}
            className="px-6 py-3 bg-accent text-white font-medium rounded-lg
                       hover:bg-accent/90 disabled:opacity-50 disabled:cursor-not-allowed
                       transition-colors whitespace-nowrap"
          >
            {loading ? 'Processing...' : 'Extract Script'}
          </button>
        </div>

        <div className="flex items-center gap-3">
          <label className="text-sm text-text-secondary">Translate to:</label>
          <select
            value={targetLanguage}
            onChange={(e) => setTargetLanguage(e.target.value as TargetLanguage)}
            disabled={loading}
            className="px-3 py-2 bg-bg-card border border-gray-700 rounded-lg
                       text-text-primary text-sm
                       focus:outline-none focus:border-accent focus:ring-1 focus:ring-accent
                       transition-colors disabled:opacity-50"
          >
            {Object.entries(TARGET_LANGUAGES).map(([code, name]) => (
              <option key={code} value={code}>
                {name}
              </option>
            ))}
          </select>
        </div>
      </form>

      {loading && loadingStep && (
        <p className="mt-3 text-center text-text-secondary animate-pulse">
          {loadingStep}
        </p>
      )}

      {error && (
        <p className="mt-3 text-center text-red-400">
          {error}
        </p>
      )}
    </div>
  )
}
