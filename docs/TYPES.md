# Type Definitions Reference (implemented in src/lib/types.ts)

## Core Types

```typescript
// YouTube transcript raw line
interface TranscriptLine {
  text: string
  start: number    // Start time (seconds)
  duration: number // Duration (seconds)
}

// Learning segment
interface Segment {
  id: number
  startTime: number
  endTime: number
  textEn: string
  textTranslated: string
  expressions: Expression[]
}

// Key expression
interface Expression {
  word: string           // Original expression
  meaning: string        // Meaning in target language
  description: string    // Usage context/nuance (in target language)
  example: string        // Example sentence (in English)
}

// Video information
interface VideoInfo {
  videoId: string
  title: string
  targetLanguage: TargetLanguage
  segments: Segment[]
}

// Playback state (Zustand store)
interface PlayerState {
  videoInfo: VideoInfo | null
  currentSegmentIndex: number
  isPlaying: boolean
  isRepeating: boolean       // Current segment repeat
  isFullRepeat: boolean      // Full sequential repeat
  playbackSpeed: number      // 0.5 ~ 2.0
  showEnSubtitle: boolean
  showTranslatedSubtitle: boolean
  loading: boolean
  loadingStep: string
  loadingProgress: number    // 0 ~ 100
}

// API response common type
interface ApiResponse<T> {
  success: boolean
  data?: T
  error?: string
  message?: string
}

// Supported target languages
type TargetLanguage =
  | 'ko'     // Korean
  | 'es'     // Spanish
  | 'de'     // German
  | 'fr'     // French
  | 'zh-CN'  // Mandarin Chinese (Simplified)
  | 'zh-TW'  // Mandarin Chinese (Traditional/Taiwan)
  | 'zh-HK'  // Cantonese Chinese
  | 'ja'     // Japanese
  | 'ar'     // Arabic
  | 'pt'     // Portuguese
  | 'ru'     // Russian
  | 'hi'     // Hindi
```
