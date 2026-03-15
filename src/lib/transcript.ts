import type { TranscriptLine, Segment } from './types'

const MIN_SEGMENT_DURATION = 5  // Minimum 5 seconds
const MAX_SEGMENT_DURATION = 15 // Maximum 15 seconds
const SENTENCE_ENDINGS = /[.!?]$/

/**
 * Split subtitle lines into learning segments
 * - Group by sentence endings (. ? !)
 * - Maintain 5-15 second range
 */
export function segmentTranscript(lines: TranscriptLine[]): Segment[] {
  if (lines.length === 0) return []

  const segments: Segment[] = []
  let currentTexts: string[] = []
  let segmentStartTime = lines[0].start
  let currentEndTime = lines[0].start

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i]
    currentTexts.push(line.text)
    currentEndTime = line.start + line.duration

    const currentDuration = currentEndTime - segmentStartTime
    const isLastLine = i === lines.length - 1
    const endsWithSentence = SENTENCE_ENDINGS.test(line.text.trim())

    // Segment completion conditions:
    // 1. Sentence ends and minimum duration met
    // 2. Maximum duration exceeded
    // 3. Last line
    const shouldFinishSegment =
      (endsWithSentence && currentDuration >= MIN_SEGMENT_DURATION) ||
      currentDuration >= MAX_SEGMENT_DURATION ||
      isLastLine

    if (shouldFinishSegment) {
      segments.push({
        id: segments.length + 1,
        startTime: segmentStartTime,
        endTime: currentEndTime,
        textEn: currentTexts.join(' ').trim(),
        textTranslated: '', // Filled after translation
        expressions: [] // Filled after analysis
      })

      // Prepare next segment
      currentTexts = []
      if (i < lines.length - 1) {
        segmentStartTime = lines[i + 1].start
      }
    }
  }

  return segments
}

/**
 * Convert seconds to MM:SS format
 */
export function formatTime(seconds: number): string {
  const mins = Math.floor(seconds / 60)
  const secs = Math.floor(seconds % 60)
  return `${mins}:${secs.toString().padStart(2, '0')}`
}
