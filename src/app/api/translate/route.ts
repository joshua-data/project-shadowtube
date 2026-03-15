import { NextRequest, NextResponse } from 'next/server'
import { translateSegments } from '@/lib/gemini'
import type { ApiResponse, TranslateResult, TranslateRequest } from '@/lib/types'

const BATCH_SIZE = 10 // Max segments per batch

export async function POST(
  request: NextRequest
): Promise<NextResponse<ApiResponse<TranslateResult[]>>> {
  try {
    const body: TranslateRequest = await request.json()
    const { segments, targetLanguage } = body

    if (!segments || !Array.isArray(segments) || segments.length === 0) {
      return NextResponse.json({
        success: false,
        error: 'INVALID_REQUEST',
        message: 'No segment data provided.'
      }, { status: 400 })
    }

    if (!targetLanguage) {
      return NextResponse.json({
        success: false,
        error: 'INVALID_REQUEST',
        message: 'Target language not specified.'
      }, { status: 400 })
    }

    const results: TranslateResult[] = []

    // Batch processing (10 at a time)
    for (let i = 0; i < segments.length; i += BATCH_SIZE) {
      const batch = segments.slice(i, i + BATCH_SIZE)

      try {
        const batchResults = await translateSegments(batch, targetLanguage)

        // Convert to TranslateResult format
        for (const result of batchResults) {
          results.push({
            id: result.id,
            textTranslated: result.translation,
            expressions: result.expressions
          })
        }
      } catch (error) {
        console.error(`Batch ${i / BATCH_SIZE + 1} translation failed:`, error)

        // Mark failed segments with error message
        for (const segment of batch) {
          const existing = results.find((r) => r.id === segment.id)
          if (!existing) {
            results.push({
              id: segment.id,
              textTranslated: '(Translation failed)',
              expressions: []
            })
          }
        }
      }
    }

    // Sort by ID
    results.sort((a, b) => a.id - b.id)

    return NextResponse.json({
      success: true,
      data: results
    })

  } catch (error) {
    console.error('Translate API error:', error)

    return NextResponse.json({
      success: false,
      error: 'TRANSLATION_FAILED',
      message: 'An error occurred during translation.'
    }, { status: 500 })
  }
}
