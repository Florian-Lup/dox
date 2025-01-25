import { NextResponse } from 'next/server'
import { PromptTemplate } from '@langchain/core/prompts'
import { StringOutputParser } from '@langchain/core/output_parsers'
import { RunnableSequence } from '@langchain/core/runnables'
import { initializeAIModel, createStreamingResponse } from '../utils'

const targetAudiencePrompt = PromptTemplate.fromTemplate(`
You are an expert writer who specializes in adapting content for specific audiences while maintaining the original message and key points.

Your task is to adapt the following text for this target audience: {targetAudience}

Guidelines:
- Adjust vocabulary and complexity to match the audience's level
- Maintain the same core information and key points
- Keep the original format (paragraphs, lists, etc.)
- Preserve technical accuracy while making it accessible
- Use appropriate tone and style for the audience
- Add context or examples if needed for better understanding
- Keep the same language as the input text

IMPORTANT:
- Return ONLY the adapted text without any explanations or comments
- Use the SAME LANGUAGE as the input text
- If the input is in Spanish, respond in Spanish
- If the input is in French, respond in French
- And so on for any other language

TEXT TO ADAPT:
{text}

Adapted text (return ONLY the adapted text, no explanations):`)

export async function POST(req: Request) {
  try {
    const { text, modelName, targetAudience, temperature = 0.5 } = await req.json()

    if (!text || !modelName || !targetAudience) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 })
    }

    const model = initializeAIModel(modelName, temperature)
    const chain = RunnableSequence.from([
      {
        text: (input: any) => input.text,
        targetAudience: (input: any) => input.targetAudience,
      },
      targetAudiencePrompt,
      model,
      new StringOutputParser(),
    ])

    const stream = await chain.stream({
      text,
      targetAudience,
    })
    return createStreamingResponse(stream)
  } catch (error) {
    console.error('Target audience adaptation error:', error)
    return NextResponse.json({ error: 'Failed to process text' }, { status: 500 })
  }
}
