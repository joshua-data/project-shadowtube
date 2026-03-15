// Supported target languages
export type TargetLanguage =
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

export const TARGET_LANGUAGES: Record<TargetLanguage, string> = {
  ko: 'Korean',
  es: 'Spanish',
  de: 'German',
  fr: 'French',
  'zh-CN': 'Mandarin Chinese (Simplified)',
  'zh-TW': 'Mandarin Chinese (Traditional)',
  'zh-HK': 'Cantonese Chinese',
  ja: 'Japanese',
  ar: 'Arabic',
  pt: 'Portuguese',
  ru: 'Russian',
  hi: 'Hindi',
}

// YouTube transcript line
export interface TranscriptLine {
  text: string
  start: number    // start time (seconds)
  duration: number // duration (seconds)
}

// Key expression
export interface Expression {
  word: string           // original expression
  meaning: string        // meaning in target language
  description: string    // usage context in target language
  example: string        // example sentence
}

// Learning segment
export interface Segment {
  id: number
  startTime: number
  endTime: number
  textEn: string
  textTranslated: string
  expressions: Expression[]
}

// Video info
export interface VideoInfo {
  videoId: string
  title: string
  targetLanguage: TargetLanguage
  segments: Segment[]
}

// Playback state (Zustand store)
export interface PlayerState {
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
}

// API response common type
export interface ApiResponse<T> {
  success: boolean
  data?: T
  error?: string
  message?: string
}

// Transcript API response data
export interface TranscriptData {
  videoId: string
  title: string
  rawTranscript: TranscriptLine[]
}

// Translate API request
export interface TranslateRequest {
  targetLanguage: TargetLanguage
  segments: Array<{
    id: number
    textEn: string
  }>
}

// Translate API response data
export interface TranslateResult {
  id: number
  textTranslated: string
  expressions: Expression[]
}

// YouTube Player type (IFrame API)
export interface YouTubePlayer {
  playVideo: () => void
  pauseVideo: () => void
  seekTo: (seconds: number, allowSeekAhead?: boolean) => void
  getCurrentTime: () => number
  getDuration: () => number
  setPlaybackRate: (rate: number) => void
  getPlayerState: () => number
  destroy: () => void
}

// YouTube IFrame API global types
declare global {
  interface Window {
    YT: {
      Player: new (
        elementId: string,
        config: {
          videoId: string
          playerVars?: {
            autoplay?: 0 | 1
            controls?: 0 | 1
            modestbranding?: 0 | 1
            rel?: 0 | 1
            playsinline?: 0 | 1
          }
          events?: {
            onReady?: (event: { target: YouTubePlayer }) => void
            onStateChange?: (event: { data: number }) => void
            onError?: (event: { data: number }) => void
          }
        }
      ) => YouTubePlayer
      PlayerState: {
        UNSTARTED: -1
        ENDED: 0
        PLAYING: 1
        PAUSED: 2
        BUFFERING: 3
        CUED: 5
      }
    }
    onYouTubeIframeAPIReady?: () => void
  }
}
