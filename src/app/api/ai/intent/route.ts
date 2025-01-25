import { NextResponse } from 'next/server'
import { PromptTemplate } from '@langchain/core/prompts'
import { StringOutputParser } from '@langchain/core/output_parsers'
import { RunnableSequence } from '@langchain/core/runnables'
import { initializeAIModel, createStreamingResponse } from '../utils'

const intentPrompt = PromptTemplate.fromTemplate(`
Rewrite the text to match the specified intent while preserving its core message and facts.

Intent Guidelines:

Informative Intents:
- Explain: Break down complex topics into clear, step-by-step explanations
- Inform: Present facts and information in a straightforward, objective manner
- Describe: Paint a detailed picture using vivid, descriptive language
- Analyze: Examine topics critically, identifying patterns and relationships
- Instruct: Provide clear, actionable guidance and directions

Persuasive Intents:
- Persuade: Use logical arguments and evidence to change opinions
- Convince: Present compelling reasons and benefits to influence decisions
- Motivate: Inspire action through encouragement and positive framing
- Inspire: Share uplifting messages that spark enthusiasm and hope
- Sell: Highlight value propositions and benefits to drive conversions

Engaging Intents:
- Entertain: Use humor, wit, or storytelling to amuse and delight
- Engage: Create interactive and thought-provoking content
- Storytell: Craft narratives with clear plot and character development
- Captivate: Draw readers in with compelling hooks and pacing
- Amuse: Incorporate light-hearted elements and playful language

Professional Intents:
- Report: Present findings and data in a structured, formal manner
- Summarize: Condense information into clear, concise key points
- Document: Record information systematically and thoroughly
- Present: Organize information for effective communication
- Review: Evaluate and assess with balanced critique

Maintain the original:
- Core message and key facts
- Technical accuracy
- Cultural context and references
- Language and terminology level
- Overall tone (unless it conflicts with intent)

IMPORTANT:
- Return ONLY the rewritten text without explanations
- Preserve the original language (if Spanish, respond in Spanish, etc.)

Text to rewrite:
{text}

Desired intent: {intent}

Rewritten text (return ONLY the adjusted text, no explanations):`)

export async function POST(req: Request) {
  try {
    const { text, modelName, intent } = await req.json()

    if (!text || !modelName || !intent) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 })
    }

    const model = initializeAIModel(modelName)

    const chain = RunnableSequence.from([
      {
        text: (input: { text: string; intent: { code: string; name: string } }) => input.text,
        intent: (input: { text: string; intent: { code: string; name: string } }) => input.intent.name,
      },
      intentPrompt,
      model,
      new StringOutputParser(),
    ])

    const stream = await chain.stream({ text, intent })
    return createStreamingResponse(stream)
  } catch (error) {
    console.error('Intent adjustment error:', error)
    return NextResponse.json({ error: 'Failed to process text' }, { status: 500 })
  }
}
