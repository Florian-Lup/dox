import { NextResponse } from 'next/server'
import { StringOutputParser } from '@langchain/core/output_parsers'
import { RunnableSequence } from '@langchain/core/runnables'
import { ChatPromptTemplate, MessagesPlaceholder } from '@langchain/core/prompts'
import { initializeAIModel, createStreamingResponse } from '../utils'

const chatPrompt = ChatPromptTemplate.fromMessages([new MessagesPlaceholder('history'), ['human', '{input}']])

export async function POST(req: Request) {
  try {
    const { message, modelName, temperature = 0.5, history = [] } = await req.json()

    if (!message || !modelName) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 })
    }

    const model = initializeAIModel(modelName, temperature)

    const chain = RunnableSequence.from([
      {
        input: (input: { message: string; history: any[] }) => input.message,
        history: (input: { message: string; history: any[] }) => input.history,
      },
      chatPrompt,
      model,
      new StringOutputParser(),
    ])

    const stream = await chain.stream({ message, history })
    return createStreamingResponse(stream)
  } catch (error) {
    console.error('Chat error:', error)
    return NextResponse.json({ error: 'Failed to process message' }, { status: 500 })
  }
}
