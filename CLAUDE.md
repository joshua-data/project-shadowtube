# ShadowTube — YouTube English Shadowing Learning App

A web app that automatically extracts YouTube video subtitles and provides segment-by-segment repeat listening, shadowing practice, and key expression learning.

## Tech Stack

- **Frontend**: Next.js 14 (App Router) + TypeScript + Tailwind CSS
- **Backend API**: Next.js Route Handlers (`/app/api/`)
- **Transcript Extraction**: `youtube-transcript-api` (Python CLI)
- **Translation + Expression Analysis**: Gemini API (@google/generative-ai, model: `gemini-2.0-flash`)
- **Video Playback**: YouTube IFrame Player API
- **State Management**: Zustand
- **Package Manager**: pnpm
- **Deployment**: Docker (local only)

## Python Environment

- Virtual environment: `source venv/bin/activate`
- Always use venv Python for scripts: `venv/bin/python`
- child_process Python path: `venv/bin/python scripts/extract_transcript.py <video_id>`
- Install dependencies: `venv/bin/pip install -r requirements.txt`
- `venv/` directory is in .gitignore, never commit

## Commands

- `pnpm dev`: Development server (port 3000)
- `pnpm build`: Production build
- `pnpm lint`: ESLint check
- `pnpm type-check`: TypeScript type check
- `venv/bin/python scripts/extract_transcript.py <video_id>`: Test transcript extraction

## Docker Commands

- `docker build -t shadowtube .`: Build Docker image
- `docker run -d -p 3000:3000 --env-file .env.local --name shadowtube shadowtube`: Run container

## Architecture

```
src/
├── app/
│   ├── page.tsx              # Main page (URL input + learning UI)
│   ├── layout.tsx            # Root layout
│   └── api/
│       ├── transcript/       # Transcript extraction API
│       └── translate/        # Translation + expression analysis API
├── components/
│   ├── VideoPlayer.tsx       # YouTube IFrame wrapper
│   ├── SubtitleDisplay.tsx   # Subtitle display (EN/TR toggle)
│   ├── SegmentList.tsx       # Segment list panel
│   ├── ControlBar.tsx        # Playback controls
│   ├── ExpressionPanel.tsx   # Key expressions panel
│   ├── UrlInput.tsx          # URL input component
│   └── SavedVideoList.tsx    # Saved videos list
├── lib/
│   ├── gemini.ts             # Gemini API wrapper
│   ├── transcript.ts         # Subtitle parsing/segment splitting
│   ├── storage.ts            # LocalStorage utilities
│   └── types.ts              # Common type definitions
├── stores/
│   └── playerStore.ts        # Zustand store (playback state, segments, etc.)
└── styles/
    └── globals.css           # Tailwind + custom styles
```

## Code Style

- TypeScript strict mode, no `any` usage
- Components use named exports (`export function`, not `export default`)
- Tailwind utility classes, minimize custom CSS
- Clear server/client component separation (`"use client"` only when needed)
- API responses always in `{ success: boolean, data?, error? }` format

## Key Patterns

- YouTube IFrame API loads client-side only (`"use client"` + dynamic import)
- Transcript extraction runs server-side via Python child_process
- **Always use `venv/bin/python` path for Python calls** (never system python)
- Gemini API calls only in server-side Route Handlers (protect API keys)
- Segment transitions: `player.seekTo(startTime)` → sync subtitles/expressions

## Important Notes

- Store `GEMINI_API_KEY` in `.env.local`, never commit
- YouTube IFrame API loads via `<Script>` tag, check window.YT
- Handle videos without subtitles (show user message)
- Translations are batch processed per segment (minimize API calls)
- Supported languages: Korean, Spanish, German, French, Chinese (Simplified/Traditional/Cantonese), Japanese, Arabic, Portuguese, Russian, Hindi
