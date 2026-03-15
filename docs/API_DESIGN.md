# API Design

## POST /api/transcript

Extracts subtitles from a YouTube video.

### Request
```json
{ "url": "https://www.youtube.com/watch?v=VIDEO_ID" }
```

### Response (Success)
```json
{
  "success": true,
  "data": {
    "videoId": "VIDEO_ID",
    "title": "Video Title",
    "rawTranscript": [
      { "text": "Hello everyone", "start": 0.0, "duration": 2.5 },
      { "text": "welcome to my channel", "start": 2.5, "duration": 3.1 }
    ]
  }
}
```

### Response (Failure)
```json
{
  "success": false,
  "error": "TRANSCRIPT_NOT_AVAILABLE",
  "message": "This video does not have subtitles."
}
```

### Error Codes
- `INVALID_URL`: Not a valid YouTube URL format
- `TRANSCRIPT_NOT_AVAILABLE`: No subtitles available
- `VIDEO_NOT_FOUND`: Video not found
- `EXTRACTION_FAILED`: Extraction failed (server error)

---

## POST /api/translate

Performs segment translation + key expression analysis.

### Request
```json
{
  "targetLanguage": "ko",
  "segments": [
    {
      "id": 1,
      "textEn": "I think the most important thing is to stay curious about everything."
    },
    {
      "id": 2,
      "textEn": "When you're genuinely interested in learning, it doesn't feel like work."
    }
  ]
}
```

### Response
```json
{
  "success": true,
  "data": [
    {
      "id": 1,
      "textTranslated": "가장 중요한 것은 모든 것에 대해 호기심을 유지하는 것이라고 생각합니다.",
      "expressions": [
        {
          "word": "stay curious",
          "meaning": "호기심을 유지하다",
          "description": "계속해서 새로운 것에 관심을 갖는 태도를 표현할 때 사용",
          "example": "Stay curious and never stop learning."
        }
      ]
    }
  ]
}
```

### Notes
- Maximum 10 segments per batch (to manage API tokens)
- If total segments exceed 10, split into multiple calls
- Retry once on response parsing failure

---

## Gemini API Prompt Template

Used in `src/lib/gemini.ts`:

```
You are an expert English tutor for {targetLanguage} speakers.
Analyze the following English sentences and provide:

For each sentence:
1. A natural {targetLanguage} translation
2. Key expressions worth learning (idioms, useful patterns, vocabulary) - maximum 3 expressions per sentence

Input sentences:
{segments}

Respond in this exact JSON format (no markdown, no explanation, just raw JSON array):
[
  {
    "id": <segment_id>,
    "translation": "<{targetLanguage} translation>",
    "expressions": [
      {
        "word": "<the expression in English>",
        "meaning": "<{targetLanguage} meaning>",
        "description": "<usage context in {targetLanguage}>",
        "example": "<one ENGLISH example sentence using the expression>"
      }
    ]
  }
]
```
