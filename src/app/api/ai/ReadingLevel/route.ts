import { NextResponse } from 'next/server'
import { PromptTemplate } from '@langchain/core/prompts'
import { StringOutputParser } from '@langchain/core/output_parsers'
import { RunnableSequence } from '@langchain/core/runnables'
import { initializeAIModel, createStreamingResponse } from '../utils'

const ReadingLevelPrompt = PromptTemplate.fromTemplate(`
Rewrite the text to match a Flesch-Kincaid reading level score of {score}.
Current reading level ranges and their descriptions:
- 90-100: Very Easy - Simple and direct language
- 80-90: Easy - Conversational language
- 70-80: Fairly Easy - Plain language
- 60-70: Standard - Clear communication
- 50-60: Fairly Hard - More complex sentences
- 30-50: Hard - Academic style
- 0-30: Very Hard - Technical and specialized

Maintain the original meaning and key information while adjusting the complexity of vocabulary and sentence structure.
The text should feel natural and appropriate for the target reading level.

IMPORTANT: 
- Return ONLY the adjusted text without any explanations, comments, or analysis
- Use the SAME LANGUAGE as the input text
- If the input is in Spanish, respond in Spanish
- If the input is in French, respond in French
- And so on for any other language

TEXT TO ADJUST:
{text}

Reading level-adjusted text (return ONLY the adjusted text, no explanations):`)

export async function POST(req: Request) {
  try {
    const { text, modelName, readingLevel, temperature = 0.5 } = await req.json()

    if (!text || !modelName || readingLevel === undefined) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 })
    }

    // Convert reading level (1-7) to score range
    const scoreRanges = {
      1: '90-100',
      2: '80-90',
      3: '70-80',
      4: '60-70',
      5: '50-60',
      6: '30-50',
      7: '0-30',
    }

    const score = scoreRanges[readingLevel as keyof typeof scoreRanges]
    if (!score) {
      return NextResponse.json({ error: 'Invalid reading level' }, { status: 400 })
    }

    const model = initializeAIModel(modelName, temperature)
    const chain = RunnableSequence.from([
      {
        text: (input: any) => input.text,
        score: (input: any) => input.score,
      },
      ReadingLevelPrompt,
      model,
      new StringOutputParser(),
    ])

    const stream = await chain.stream({
      text,
      score,
    })
    return createStreamingResponse(stream)
  } catch (error) {
    console.error('Reading level adjustment error:', error)
    return NextResponse.json({ error: 'Failed to process text' }, { status: 500 })
  }
}
