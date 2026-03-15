import { GoogleGenerativeAI } from '@google/generative-ai'
import type { Expression, TargetLanguage, TARGET_LANGUAGES } from './types'

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || '')

interface SegmentInput {
  id: number
  textEn: string
}

interface TranslationResult {
  id: number
  translation: string
  expressions: Expression[]
}

const getTranslatePrompt = (targetLanguage: string) => `You are an expert English tutor for ${targetLanguage} speakers.
Analyze the following English sentences and provide:

For each sentence:
1. A natural ${targetLanguage} translation
2. Key expressions worth learning (idioms, useful patterns, vocabulary) - maximum 3 expressions per sentence

Input sentences:
{segments}

Respond in this exact JSON format (no markdown, no explanation, just raw JSON array):
[
  {
    "id": <segment_id>,
    "translation": "<${targetLanguage} translation>",
    "expressions": [
      {
        "word": "<the expression in English>",
        "meaning": "<${targetLanguage} meaning>",
        "description": "<usage context in ${targetLanguage}>",
        "example": "<one ENGLISH example sentence using the expression>"
      }
    ]
  }
]`

export async function translateSegments(
  segments: SegmentInput[],
  targetLanguage: TargetLanguage
): Promise<TranslationResult[]> {
  const { TARGET_LANGUAGES } = await import('./types')
  const languageName = TARGET_LANGUAGES[targetLanguage]

  const segmentsText = segments
    .map((s) => `[ID: ${s.id}] ${s.textEn}`)
    .join('\n')

  const prompt = getTranslatePrompt(languageName).replace('{segments}', segmentsText)

  const model = genAI.getGenerativeModel({ model: 'gemini-2.0-flash' })

  const result = await model.generateContent(prompt)
  const response = result.response
  const text = response.text()

  // Parse JSON (remove markdown code blocks)
  let jsonText = text.trim()

  // Remove ```json ... ``` or ``` ... ``` format
  if (jsonText.startsWith('```')) {
    jsonText = jsonText.replace(/^```(?:json)?\n?/, '').replace(/\n?```$/, '')
  }

  const results: TranslationResult[] = JSON.parse(jsonText)
  return results
}
