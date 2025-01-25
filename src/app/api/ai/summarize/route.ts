import { NextResponse } from 'next/server'
import { PromptTemplate } from '@langchain/core/prompts'
import { StringOutputParser } from '@langchain/core/output_parsers'
import { RunnableSequence } from '@langchain/core/runnables'
import { initializeAIModel, createStreamingResponse } from '../utils'

const summarizePrompt = PromptTemplate.fromTemplate(`
Create a concise summary of the given text that captures its main points and key ideas.

Guidelines for Summarization:
- Capture all essential information and main ideas
- Maintain factual accuracy
- Use clear and concise language
- Keep the logical flow of ideas
- Preserve key technical terms and proper nouns
- Maintain the same language as the input
- Keep the professional tone

Summary Structure:
- Focus on main points and key arguments
- Remove redundant information
- Maintain proper context
- Keep cause-and-effect relationships clear
- Present ideas in a logical sequence

IMPORTANT:
- Return ONLY the summarized text without any explanations or comments
- Use the SAME LANGUAGE as the input text
- If the input is in Spanish, respond in Spanish
- If the input is in French, respond in French
- And so on for any other language
- Aim for approximately 1/3 of the original length unless otherwise specified

TEXT TO SUMMARIZE:
{text}

Summarized text (return ONLY the summary, no explanations):`)

export async function POST(req: Request) {
  try {
    const { text, modelName, language = 'en' } = await req.json()

    if (!text || !modelName) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 })
    }

    const model = initializeAIModel(modelName)

    const chain = RunnableSequence.from([
      {
        text: (input: { text: string }) => input.text,
      },
      summarizePrompt,
      model,
      new StringOutputParser(),
    ])

    const stream = await chain.stream({ text })
    return createStreamingResponse(stream)
  } catch (error) {
    console.error('Summarize error:', error)
    return NextResponse.json({ error: 'Failed to process text' }, { status: 500 })
  }
}
