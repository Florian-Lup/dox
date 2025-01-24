import { NextResponse } from 'next/server'
import { PromptTemplate } from '@langchain/core/prompts'
import { StringOutputParser } from '@langchain/core/output_parsers'
import { RunnableSequence } from '@langchain/core/runnables'
import { initializeAIModel, createStreamingResponse } from '../utils'

const AdjustLengthPrompt = PromptTemplate.fromTemplate(`
Your task is to adjust the length of the text by {percentage}%, focusing only on information that is relevant to the text's current context.

If percentage is positive:
- Expand ONLY using information that can be inferred from the current text
- Add more details about concepts already mentioned
- Elaborate on existing points and examples
- Explain relationships between ideas already present
- Provide more context for existing terms or references
- The final text should be approximately {percentage}% longer than the original

If percentage is negative:
- Remove less essential details while keeping the main message
- Focus on the most relevant points from the current context
- Preserve key arguments and evidence
- Keep critical examples and explanations
- Maintain the logical flow of ideas
- The final text should be approximately {percentage}% shorter than the original

Always:
- Stay within the text's existing scope and subject matter
- Don't introduce unrelated topics or external information
- Keep the same tone and writing style
- Maintain the original perspective and voice

IMPORTANT: 
- Return ONLY the adjusted text without any explanations, comments, or analysis
- Use the SAME LANGUAGE as the input text
- If the input is in Spanish, respond in Spanish
- If the input is in French, respond in French
- And so on for any other language

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
