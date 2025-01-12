import { NextResponse } from 'next/server'
import { PromptTemplate } from '@langchain/core/prompts'
import { StringOutputParser } from '@langchain/core/output_parsers'
import { RunnableSequence } from '@langchain/core/runnables'
import { initializeAIModel, createStreamingResponse } from '../utils'

const grammarFixPrompt = PromptTemplate.fromTemplate(`
Fix any grammar issues in the TARGET TEXT while preserving its meaning and style.
If there are no grammar issues, return the target text unchanged.
Use the full document context to better understand the meaning and flow.

IMPORTANT: Return ONLY the corrected text without any explanations, comments, or analysis.

Full document:
{fullContent}

TARGET TEXT TO FIX (located within the document):
{text}

Corrected text (return ONLY the fixed text, no explanations):`)

export async function POST(req: Request) {
  try {
    const { text, modelName, fullContent = '' } = await req.json()

    const model = initializeAIModel(modelName)

    const chain = RunnableSequence.from([
      {
        text: (input: { text: string; fullContent: string }) => input.text,
        fullContent: (input: { text: string; fullContent: string }) => input.fullContent,
      },
      grammarFixPrompt,
      model,
      new StringOutputParser(),
    ])

    const stream = await chain.stream({ text, fullContent })
    return createStreamingResponse(stream)
  } catch (error) {
    console.error('Grammar fix error:', error)
    return NextResponse.json({ error: 'Failed to process text' }, { status: 500 })
  }
}
