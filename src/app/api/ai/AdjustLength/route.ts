import { NextResponse } from 'next/server'
import { PromptTemplate } from '@langchain/core/prompts'
import { StringOutputParser } from '@langchain/core/output_parsers'
import { RunnableSequence } from '@langchain/core/runnables'
import { initializeAIModel, createStreamingResponse } from '../utils'

const AdjustLengthPrompt = PromptTemplate.fromTemplate(`
You are a precise text length adjuster. Your task is to modify the text length by exactly {percentage}%.

Current text length: {currentLength} characters
Target length: {targetLength} characters
Difference: {difference} characters ({percentage}% {direction})

Guidelines for Length Adjustment:

When Shortening Text ({percentage} < 0):
1. Preserve the core message and main arguments
2. Remove redundant phrases and unnecessary details
3. Use more concise wording while maintaining clarity
4. Combine sentences where appropriate
5. Keep essential context and key examples
6. Maintain logical flow and coherence

When Extending Text ({percentage} > 0):
1. Elaborate on existing points with relevant details
2. Add supporting examples or evidence
3. Expand explanations where beneficial
4. Include relevant context or background
5. Add transition sentences for better flow
6. Maintain consistent tone and style

Critical Requirements:
- The output MUST be within 2% of the target length ({targetLength} characters)
- Maintain the original tone and writing style
- Preserve technical accuracy and key terminology
- Keep the same level of formality
- Return ONLY the adjusted text, no explanations
- Use the SAME LANGUAGE as the input text
- If the input is in Spanish, respond in Spanish
- If the input is in French, respond in French
- And so on for any other language

TEXT TO ADJUST:
{text}

Length-adjusted text (return ONLY the adjusted text, no explanations):
`)

export async function POST(req: Request) {
  try {
    const { text, modelName, percentage, temperature = 0.5 } = await req.json()

    if (!text || !modelName || percentage === undefined) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 })
    }

    const model = initializeAIModel(modelName, temperature)
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
