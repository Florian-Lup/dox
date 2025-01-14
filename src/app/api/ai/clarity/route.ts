import { NextResponse } from 'next/server'
import { PromptTemplate } from '@langchain/core/prompts'
import { StringOutputParser } from '@langchain/core/output_parsers'
import { RunnableSequence } from '@langchain/core/runnables'
import { initializeAIModel, createStreamingResponse } from '../utils'

const clarityImprovePrompt = PromptTemplate.fromTemplate(`
Improve the clarity and readability of the TARGET TEXT while preserving its core meaning.
Focus on:
- Simplifying complex sentences
- Improving sentence flow and transitions
- Using clearer word choices
- Organizing ideas more logically
- Removing redundancy and wordiness
- Maintaining the original tone and style

Use the full document context to better understand the meaning and flow.

IMPORTANT: Return ONLY the improved text without any explanations, comments, or analysis.

Full document:
{fullContent}

TARGET TEXT TO IMPROVE (located within the document):
{text}

Improved text (return ONLY the improved text, no explanations):`)

export async function POST(req: Request) {
  try {
    const { text, modelName, fullContent = '' } = await req.json()

    const model = initializeAIModel(modelName)

    const chain = RunnableSequence.from([
      {
        text: (input: { text: string; fullContent: string }) => input.text,
        fullContent: (input: { text: string; fullContent: string }) => input.fullContent,
      },
      clarityImprovePrompt,
      model,
      new StringOutputParser(),
    ])

    const stream = await chain.stream({ text, fullContent })
    return createStreamingResponse(stream)
  } catch (error) {
    console.error('Clarity improvement error:', error)
    return NextResponse.json({ error: 'Failed to process text' }, { status: 500 })
  }
}
