# ShadowTube — Feature Specification

## Project Overview

A web service for English shadowing/listening practice using YouTube videos.
When a user inputs a YouTube URL, the system automatically: extracts subtitles → segments them → translates to target language → analyzes key expressions, providing a UI optimized for segment-by-segment repeat listening and shadowing practice.

---

## Phase 1: MVP (Core Features)

### 1.1 URL Input & Subtitle Extraction

**Flow:**
1. User pastes YouTube URL
2. Parse video_id (supports youtube.com/watch?v=, youtu.be/, shorts/, etc.)
3. Extract English subtitles with timestamps using `youtube-transcript-api`
4. If no subtitles available → display error message

**API: `POST /api/transcript`**
```typescript
// Request
{ url: string }

// Response
{
  success: boolean,
  data: {
    videoId: string,
    title: string,
    transcript: Array<{
      text: string,
      start: number,    // seconds
      duration: number
    }>
  }
}
```

### 1.2 Segmentation

Group extracted subtitles into meaningful learning segments.

**Logic:**
- Primary strategy: Group subtitle lines by sentence endings (`.`, `?`, `!`)
- Target segment length: 5-15 seconds
- Merge segments that are too short, split long segments at commas

**Type:**
```typescript
interface Segment {
  id: number
  startTime: number
  endTime: number
  textEn: string
  textTranslated: string
  expressions: Expression[]
}
```

### 1.3 Translation & Key Expression Analysis

**API: `POST /api/translate`**

Uses Gemini API to process each segment:
- Translation to target language
- Key expression extraction (idioms, common patterns, useful vocabulary)
- For each expression: meaning, context, example sentence

### 1.4 Video Playback & Segment Controls

**YouTube IFrame Player API Usage:**
- `player.seekTo(startTime)`: Jump to segment start
- `player.getCurrentTime()`: Track playback position (polling 200ms)
- On segment end → auto-pause or segment repeat

**Control Features:**
- ⏮ Previous segment / ⏭ Next segment
- 🔁 Current segment repeat (toggle)
- 🔄 Full repeat (toggle)
- Speed adjustment: 0.5x ~ 2.0x (0.1 increments)
- Keyboard shortcuts: ←→(segments), R(repeat), Space(play/pause), ±(speed)

### 1.5 Subtitle Display

- English subtitle (default ON)
- Translated subtitle (default ON)
- Independent toggle for each
- OFF mode: hide both (listening focus)
- Highlight key expressions in English subtitle

### 1.6 Segment List Panel

- Display all segments in scrollable list
- Each segment: timestamp, English text, translated text
- Highlight current segment + auto-scroll
- Click segment → jump to and play
- Display repeat count

### 1.7 Key Expression Panel

- List key expressions for current segment
- For each: original, meaning, description, example
- Auto-update on segment change

---

## Phase 2: Extended Features (Future)

- Learning progress save (localStorage → later DB)
- Bookmark feature (favorite segments)
- Dictation mode
- Shadowing recording & comparison
- Learning history (past videos)
- Expression collection (review learned expressions)

---

## UI/UX Principles

- Dark theme default (reduce eye strain, improve focus)
- Left: video + controls + subtitles / Right: segment list + expression panel
- Mobile support: vertical stack layout
- Show loading status by step (extracting → translating → analyzing)

---

## Supported Languages

| Code | Language |
|------|----------|
| ko | Korean |
| es | Spanish |
| de | German |
| fr | French |
| zh-CN | Mandarin Chinese (Simplified) |
| zh-TW | Mandarin Chinese (Traditional) |
| zh-HK | Cantonese Chinese |
| ja | Japanese |
| ar | Arabic |
| pt | Portuguese |
| ru | Russian |
| hi | Hindi |
