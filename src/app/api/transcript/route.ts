import { NextRequest, NextResponse } from 'next/server'
import { exec } from 'child_process'
import { promisify } from 'util'
import path from 'path'
import { extractVideoId, getVideoTitle } from '@/lib/youtube'
import type { ApiResponse, TranscriptData, TranscriptLine } from '@/lib/types'

const execAsync = promisify(exec)

interface PythonResponse {
  success: boolean
  data?: {
    videoId: string
    transcript: TranscriptLine[]
  }
  error?: string
  message?: string
}

export async function POST(request: NextRequest): Promise<NextResponse<ApiResponse<TranscriptData>>> {
  try {
    const body = await request.json()
    const { url } = body as { url: string }

    if (!url) {
      return NextResponse.json({
        success: false,
        error: 'INVALID_URL',
        message: 'URL is required.'
      }, { status: 400 })
    }

    const videoId = extractVideoId(url)
    if (!videoId) {
      return NextResponse.json({
        success: false,
        error: 'INVALID_URL',
        message: 'Invalid YouTube URL.'
      }, { status: 400 })
    }

    // Python script path (using venv)
    const projectRoot = process.cwd()
    const pythonPath = path.join(projectRoot, 'venv', 'bin', 'python')
    const scriptPath = path.join(projectRoot, 'scripts', 'extract_transcript.py')

    // Execute Python script
    const { stdout, stderr } = await execAsync(
      `"${pythonPath}" "${scriptPath}" "${videoId}" en`,
      { timeout: 30000 }
    )

    if (stderr && !stdout) {
      console.error('Python stderr:', stderr)
      return NextResponse.json({
        success: false,
        error: 'EXTRACTION_FAILED',
        message: 'Error occurred while extracting subtitles.'
      }, { status: 500 })
    }

    const result: PythonResponse = JSON.parse(stdout)

    if (!result.success) {
      return NextResponse.json({
        success: false,
        error: result.error,
        message: result.message
      }, { status: 400 })
    }

    // Get video title
    const title = await getVideoTitle(videoId)

    return NextResponse.json({
      success: true,
      data: {
        videoId,
        title,
        rawTranscript: result.data?.transcript || []
      }
    })

  } catch (error) {
    console.error('Transcript API error:', error)

    if (error instanceof SyntaxError) {
      return NextResponse.json({
        success: false,
        error: 'EXTRACTION_FAILED',
        message: 'Failed to parse Python script response.'
      }, { status: 500 })
    }

    return NextResponse.json({
      success: false,
      error: 'EXTRACTION_FAILED',
      message: 'Internal server error.'
    }, { status: 500 })
  }
}
