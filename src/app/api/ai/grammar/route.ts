import { NextResponse } from 'next/server'
import { PromptTemplate } from '@langchain/core/prompts'
import { StringOutputParser } from '@langchain/core/output_parsers'
import { RunnableSequence } from '@langchain/core/runnables'
import { initializeAIModel, createStreamingResponse } from '../utils'

const grammarFixPrompt = PromptTemplate.fromTemplate(`
Fix any grammar, punctuation, spelling, and syntax issues in the text while preserving its meaning and style.
If there are no grammar issues, return the text unchanged.

IMPORTANT: Return ONLY the corrected text without any explanations, comments, or analysis.

TEXT TO FIX:
{text}

Corrected text (return ONLY the fixed text, no explanations):`)

export async function POST(req: Request) {
  try {
    const { text, modelName } = await req.json()

    const model = initializeAIModel(modelName)

    const chain = RunnableSequence.from([
      {
        text: (input: { text: string }) => input.text,
      },
      grammarFixPrompt,
      model,
      new StringOutputParser(),
    ])

    const stream = await chain.stream({ text })
    return createStreamingResponse(stream)
  } catch (error) {
    console.error('Grammar fix error:', error)
    return NextResponse.json({ error: 'Failed to process text' }, { status: 500 })
  }
}
