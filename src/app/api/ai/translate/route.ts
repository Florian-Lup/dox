import { NextResponse } from 'next/server'
import { PromptTemplate } from '@langchain/core/prompts'
import { StringOutputParser } from '@langchain/core/output_parsers'
import { RunnableSequence } from '@langchain/core/runnables'
import { initializeAIModel, createStreamingResponse } from '../utils'

const translatePrompt = PromptTemplate.fromTemplate(`
Translate the TARGET TEXT into {languageName} ({languageCode}).
Maintain the original meaning, tone, and style as much as possible while ensuring the translation is natural and fluent.
Pay special attention to idioms and expressions - translate them into culturally appropriate equivalents in the target language rather than doing a literal translation.
Use the full document context to better understand the meaning and context.

IMPORTANT: Return ONLY the translated text without any explanations, comments, or analysis.

Full document:
{fullContent}

TARGET TEXT TO TRANSLATE (located within the document):
{text}

Translation in {languageName} (return ONLY the translated text, no explanations):`)

export async function POST(req: Request) {
  try {
    const { text, modelName, fullContent = '', targetLanguage } = await req.json()

    if (!text || !modelName || !targetLanguage?.code || !targetLanguage?.name) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 })
    }

    const model = initializeAIModel(modelName)
    const chain = RunnableSequence.from([
      {
        text: (input: any) => input.text,
        fullContent: (input: any) => input.fullContent,
        languageName: (input: any) => input.targetLanguage.name,
        languageCode: (input: any) => input.targetLanguage.code,
      },
      translatePrompt,
      model,
      new StringOutputParser(),
    ])

    const stream = await chain.stream({
      text,
      fullContent,
      targetLanguage,
    })
    return createStreamingResponse(stream)
  } catch (error) {
    console.error('Translation error:', error)
    return NextResponse.json({ error: 'Failed to process text' }, { status: 500 })
  }
}
