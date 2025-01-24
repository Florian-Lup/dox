import { NextResponse } from 'next/server'
import { PromptTemplate } from '@langchain/core/prompts'
import { StringOutputParser } from '@langchain/core/output_parsers'
import { RunnableSequence } from '@langchain/core/runnables'
import { initializeAIModel, createStreamingResponse } from '../utils'

const AdjustLengthPrompt = PromptTemplate.fromTemplate(`
You are a precise text length adjuster. Your task is to modify the text length by exactly {percentage}%.

Current text length: {currentLength} characters
Target length: {targetLength} characters

Rules for length adjustment:

If percentage is positive ({percentage} > 0):
- The output MUST be {percentage}% longer than the input
- Add relevant details while maintaining context
- Expand by elaborating on existing points
- Target exactly {targetLength} characters

If percentage is negative ({percentage} < 0):
- The output MUST be {percentage}% shorter than the input
- Preserve core message while removing less crucial details
- Maintain essential arguments and flow
- Target exactly {targetLength} characters

Critical Requirements:
- You MUST hit the target length within 5% margin
- Keep the same language as input (Spanish→Spanish, French→French, etc.)
- Maintain the original tone and style
- Stay within the existing context
- Return ONLY the adjusted text, no explanations

TEXT TO ADJUST:
{text}

Length-adjusted text:`)

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
        currentLength: (input: any) => input.text.length,
        targetLength: (input: any) => Math.round(input.text.length * (1 + input.percentage / 100)),
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
