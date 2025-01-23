import { NextResponse } from 'next/server'
import { PromptTemplate } from '@langchain/core/prompts'
import { StringOutputParser } from '@langchain/core/output_parsers'
import { RunnableSequence } from '@langchain/core/runnables'
import { initializeAIModel, createStreamingResponse } from '../utils'

const AdjustLengthPrompt = PromptTemplate.fromTemplate(`
Adjust the length of the text by {percentage}%.
If the percentage is positive, make the text longer while adding more details and elaboration.
If the percentage is negative, make the text shorter while preserving the key message and important information.

Maintain the original tone, style, and meaning while adjusting the length.
The length adjustment should be roughly proportional to the given percentage.

IMPORTANT: Return ONLY the adjusted text without any explanations, comments, or analysis.

TEXT TO ADJUST:
{text}

Length-adjusted text (return ONLY the adjusted text, no explanations):`)

export async function POST(req: Request) {
  try {
    const { text, modelName, percentage } = await req.json()

    if (!text || !modelName || percentage === undefined) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 })
    }

    const model = initializeAIModel(modelName)
    const chain = RunnableSequence.from([
      {
        text: (input: any) => input.text,
        percentage: (input: any) => input.percentage,
      },
      AdjustLengthPrompt,
      model,
      new StringOutputParser(),
    ])

    const stream = await chain.stream({
      text,
      percentage,
    })
    return createStreamingResponse(stream)
  } catch (error) {
    console.error('Length adjustment error:', error)
    return NextResponse.json({ error: 'Failed to process text' }, { status: 500 })
  }
}
