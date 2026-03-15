#!/usr/bin/env python3
"""
YouTube 자막 추출 스크립트
사용법: python scripts/extract_transcript.py <video_id> [language_code]

Next.js API Route에서 child_process.exec()로 호출됨.
stdout으로 JSON 출력.
"""

import sys
import json

try:
    from youtube_transcript_api import YouTubeTranscriptApi
except ImportError:
    print(json.dumps({
        "success": False,
        "error": "DEPENDENCY_MISSING",
        "message": "youtube-transcript-api가 설치되지 않았습니다. pip install youtube-transcript-api"
    }))
    sys.exit(1)


def extract_transcript(video_id: str, language: str = "en") -> dict:
    try:
        ytt_api = YouTubeTranscriptApi()
        transcript = ytt_api.fetch(video_id, languages=[language])

        lines = []
        for entry in transcript:
            lines.append({
                "text": entry.text,
                "start": round(entry.start, 2),
                "duration": round(entry.duration, 2)
            })

        return {
            "success": True,
            "data": {
                "videoId": video_id,
                "transcript": lines
            }
        }

    except Exception as e:
        error_type = type(e).__name__
        if "TranscriptsDisabled" in error_type:
            return {
                "success": False,
                "error": "TRANSCRIPT_NOT_AVAILABLE",
                "message": "이 영상에는 자막이 없습니다."
            }
        elif "NoTranscriptFound" in error_type:
            return {
                "success": False,
                "error": "TRANSCRIPT_NOT_AVAILABLE",
                "message": f"'{language}' 언어의 자막을 찾을 수 없습니다."
            }
        else:
            return {
                "success": False,
                "error": "EXTRACTION_FAILED",
                "message": str(e)
            }


if __name__ == "__main__":
    if len(sys.argv) < 2:
        print(json.dumps({
            "success": False,
            "error": "INVALID_ARGS",
            "message": "사용법: python extract_transcript.py <video_id> [language]"
        }))
        sys.exit(1)

    video_id = sys.argv[1]
    language = sys.argv[2] if len(sys.argv) > 2 else "en"

    result = extract_transcript(video_id, language)
    print(json.dumps(result, ensure_ascii=False))
