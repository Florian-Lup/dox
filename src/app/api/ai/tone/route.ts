import { NextResponse } from 'next/server'
import { PromptTemplate } from '@langchain/core/prompts'
import { StringOutputParser } from '@langchain/core/output_parsers'
import { RunnableSequence } from '@langchain/core/runnables'
import { initializeAIModel, createStreamingResponse } from '../utils'

const tonePrompt = PromptTemplate.fromTemplate(`
Rewrite the text to match the specified tone while preserving its core message and intent.

Tone Guidelines:

Professional Tones:
- Formal: Use sophisticated language, proper etiquette, and structured phrasing
- Business: Employ clear, professional vocabulary and direct communication
- Academic: Utilize scholarly language, citations, and objective analysis
- Technical: Focus on precise terminology and detailed explanations
- Diplomatic: Balance different viewpoints with tactful, respectful language

Casual Tones:
- Informal: Use relaxed language and conversational expressions
- Conversational: Write as if speaking naturally to a friend
- Friendly: Incorporate warm, approachable language and personal touches
- Relaxed: Keep things light and easy-going with simple phrasing
- Humorous: Include appropriate wit and playful elements

Emotional Tones:
- Enthusiastic: Express excitement and energy through dynamic language
- Empathetic: Show understanding and compassion in your words
- Inspirational: Use uplifting and motivational language
- Passionate: Convey strong feelings and deep commitment
- Optimistic: Focus on positive aspects and hopeful outcomes

Descriptive Tones:
- Confident: Use assertive language that shows expertise
- Authoritative: Project knowledge and command of the subject
- Direct: Be straightforward and to the point
- Neutral: Maintain an unbiased, balanced perspective
- Objective: Present information without emotional coloring

Maintain the original:
- Core message and key points
- Facts and information accuracy
- Structure and organization
- Technical terminology
- Intent and purpose

IMPORTANT:
- Return ONLY the rewritten text without explanations
- Preserve the original language (if Spanish, respond in Spanish, etc.)

Text to rewrite:
{text}

Desired tone: {tone}

Rewritten text (return ONLY the adjusted text, no explanations):`)

export async function POST(req: Request) {
  try {
    const { text, modelName, tone, temperature = 0.5 } = await req.json()

    if (!text || !modelName || !tone) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 })
    }

    const model = initializeAIModel(modelName, temperature)

    const chain = RunnableSequence.from([
      {
        text: (input: { text: string; tone: { code: string; name: string } }) => input.text,
        tone: (input: { text: string; tone: { code: string; name: string } }) => input.tone.name,
      },
      tonePrompt,
      model,
      new StringOutputParser(),
    ])

    const stream = await chain.stream({ text, tone })
    return createStreamingResponse(stream)
  } catch (error) {
    console.error('Tone adjustment error:', error)
    return NextResponse.json({ error: 'Failed to process text' }, { status: 500 })
  }
}
