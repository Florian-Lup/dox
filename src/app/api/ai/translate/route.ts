import { NextResponse } from 'next/server'
import { PromptTemplate } from '@langchain/core/prompts'
import { StringOutputParser } from '@langchain/core/output_parsers'
import { RunnableSequence } from '@langchain/core/runnables'
import { initializeAIModel, createStreamingResponse } from '../utils'

const translatePrompt = PromptTemplate.fromTemplate(`
Translate the text into {languageName} ({languageCode}).
Maintain the original meaning, tone, and style as much as possible while ensuring the translation is natural and fluent.
Pay special attention to idioms and expressions - translate them into culturally appropriate equivalents in the target language rather than doing a literal translation.

IMPORTANT: Return ONLY the translated text without any explanations, comments, or analysis.

TEXT TO TRANSLATE:
{text}

Translation in {languageName} (return ONLY the translated text, no explanations):`)

export async function POST(req: Request) {
  try {
    const { text, modelName, targetLanguage } = await req.json()

    if (!text || !modelName || !targetLanguage?.code || !targetLanguage?.name) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 })
    }

    const model = initializeAIModel(modelName)
    const chain = RunnableSequence.from([
      {
        text: (input: any) => input.text,
        languageName: (input: any) => input.targetLanguage.name,
        languageCode: (input: any) => input.targetLanguage.code,
      },
      translatePrompt,
      model,
      new StringOutputParser(),
    ])

    const stream = await chain.stream({
      text,
      targetLanguage,
    })
    return createStreamingResponse(stream)
  } catch (error) {
    console.error('Translation error:', error)
    return NextResponse.json({ error: 'Failed to process text' }, { status: 500 })
  }
}
