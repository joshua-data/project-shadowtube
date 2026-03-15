# ShadowTube

A web application for learning English through YouTube video shadowing. Extract subtitles from any YouTube video, practice segment-by-segment, and learn key expressions with AI-powered translations.

## Features

- **Automatic Subtitle Extraction**: Extract English subtitles from any YouTube video
- **Segment-by-Segment Practice**: Videos are split into 5-15 second learning segments
- **Multi-Language Translation**: Translate to 12 languages including Korean, Spanish, German, French, Chinese (Simplified/Traditional/Cantonese), Japanese, Arabic, Portuguese, Russian, and Hindi
- **Key Expression Analysis**: AI identifies idioms, useful patterns, and vocabulary with explanations and examples
- **Playback Controls**: Segment repeat, full video loop, speed adjustment (0.5x - 2.0x)
- **Subtitle Toggle**: Show/hide English and translated subtitles independently
- **Local Storage**: Save videos for offline practice
- **Keyboard Shortcuts**: Navigate with ← → (segments), Space (play/pause), R (repeat), +/- (speed)

## Tech Stack

| Area | Technology |
|------|------------|
| Frontend | Next.js 14, TypeScript, Tailwind CSS |
| State Management | Zustand |
| AI Translation | Google Gemini API |
| Video Playback | YouTube IFrame Player API |
| Transcript Extraction | youtube-transcript-api (Python) |
| Deployment | Docker |

## Prerequisites

- [Docker](https://www.docker.com/products/docker-desktop/) installed
- [Gemini API Key](https://aistudio.google.com/app/apikey) (free tier available)

## Quick Start

### 1. Clone the repository

```bash
git clone https://github.com/yourusername/shadowtube.git
cd shadowtube
```

### 2. Set up environment variables

```bash
cp .env.example .env.local
```

Edit `.env.local` and add your Gemini API key:

```
GEMINI_API_KEY=your_gemini_api_key_here
```

### 3. Build and run with Docker

```bash
# Build the Docker image
docker build -t shadowtube .

# Run the container
docker run -d -p 3000:3000 --env-file .env.local --name shadowtube shadowtube
```

### 4. Open in browser

Navigate to [http://localhost:3000](http://localhost:3000)

## Usage

1. Paste a YouTube URL into the input field
2. Select your target language for translation
3. Click "Extract Script" and wait for processing
4. Use the controls to navigate segments and practice shadowing
5. Click "Save" to store the video for later practice

## Development Setup

### Prerequisites for Development

- Node.js 20+
- pnpm
- Python 3.11+

### Local Development

```bash
# Install Node.js dependencies
pnpm install

# Set up Python virtual environment
python3 -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate
pip install -r requirements.txt

# Set up environment variables
cp .env.example .env.local
# Edit .env.local with your API key

# Start development server
pnpm dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

### Available Scripts

| Command | Description |
|---------|-------------|
| `pnpm dev` | Start development server |
| `pnpm build` | Build for production |
| `pnpm start` | Start production server |
| `pnpm lint` | Run ESLint |
| `pnpm type-check` | Run TypeScript type checking |

## Project Structure

```
shadowtube/
├── src/
│   ├── app/                    # Next.js App Router
│   │   ├── page.tsx            # Main page
│   │   ├── layout.tsx          # Root layout
│   │   └── api/                # API routes
│   │       ├── transcript/     # YouTube transcript extraction
│   │       └── translate/      # AI translation & analysis
│   ├── components/             # React components
│   │   ├── VideoPlayer.tsx     # YouTube player wrapper
│   │   ├── SubtitleDisplay.tsx # Subtitle display
│   │   ├── SegmentList.tsx     # Segment navigation
│   │   ├── ControlBar.tsx      # Playback controls
│   │   ├── ExpressionPanel.tsx # Key expressions
│   │   ├── UrlInput.tsx        # URL input form
│   │   └── SavedVideoList.tsx  # Saved videos
│   ├── lib/                    # Utilities
│   │   ├── gemini.ts           # Gemini API client
│   │   ├── youtube.ts          # YouTube URL parsing & metadata
│   │   ├── transcript.ts       # Transcript parsing
│   │   ├── storage.ts          # LocalStorage helpers
│   │   └── types.ts            # TypeScript types
│   └── stores/                 # State management
│       └── playerStore.ts      # Zustand store
├── scripts/
│   └── extract_transcript.py   # Python transcript extractor
├── Dockerfile                  # Docker configuration
├── requirements.txt            # Python dependencies
└── package.json                # Node.js dependencies
```

## Keyboard Shortcuts

| Key | Action |
|-----|--------|
| `Space` | Play / Pause |
| `←` | Previous segment |
| `→` | Next segment |
| `R` | Toggle segment repeat |
| `+` / `=` | Increase playback speed |
| `-` | Decrease playback speed |

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

## Docker Commands Reference

```bash
# Build image
docker build -t shadowtube .

# Run container
docker run -d -p 3000:3000 --env-file .env.local --name shadowtube shadowtube

# Stop container
docker stop shadowtube

# Remove container
docker rm shadowtube

# View logs
docker logs shadowtube

# Rebuild and restart
docker rm -f shadowtube && docker build -t shadowtube . && docker run -d -p 3000:3000 --env-file .env.local --name shadowtube shadowtube
```

## API Costs

This app uses the Google Gemini API for translations. The `gemini-2.0-flash` model is used, which has a generous free tier:

- **Free tier**: 15 requests per minute, 1 million tokens per month
- Typical 5-minute video: ~10-20 API calls (depending on segment count)

For most personal use cases, the free tier should be sufficient.

## Limitations

- Only works with YouTube videos that have English subtitles/captions
- Requires an active internet connection
- Translation quality depends on the Gemini API

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## Acknowledgments

- [youtube-transcript-api](https://github.com/jdepoix/youtube-transcript-api) for transcript extraction
- [Google Gemini](https://ai.google.dev/) for AI-powered translations
- [Next.js](https://nextjs.org/) for the React framework
- [Tailwind CSS](https://tailwindcss.com/) for styling
