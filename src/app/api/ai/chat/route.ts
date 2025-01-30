import { NextResponse } from 'next/server'
import { StringOutputParser } from '@langchain/core/output_parsers'
import { RunnableSequence } from '@langchain/core/runnables'
import { initializeAIModel, createStreamingResponse } from '../utils'
import { EnhancedBufferMemory } from './memory/EnhancedBufferMemory'
import { chatPrompt } from './prompts'
import type { ChatRequest, ChatResponse } from './types'

// Memory storage to persist conversations between requests
const memoryStorage = new Map<string, EnhancedBufferMemory>()

// Create a generator for streaming responses
const createResponseGenerator = (response: string) => {
  return async function* () {
    yield response
  }
}

export async function POST(req: Request) {
  try {
    const { message, modelName, temperature = 0.5, sessionId } = (await req.json()) as ChatRequest

    if (!message || !modelName || !sessionId) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 })
    }

    const model = initializeAIModel(modelName, temperature)

    // Get or create memory for this session
    let memory = memoryStorage.get(sessionId)
    if (!memory) {
      memory = new EnhancedBufferMemory(
        model,
        {
          returnMessages: true,
          memoryKey: 'chat_history',
          inputKey: 'input',
          outputKey: 'output',
        },
        sessionId,
      )
      memoryStorage.set(sessionId, memory)
    }

    const chain = RunnableSequence.from([
      {
        input: (input: { message: string }) => input.message,
        chat_history: async () => {
          const memoryVariables = await memory!.loadMemoryVariables({})
          return memoryVariables.chat_history || []
        },
      },
      chatPrompt,
      model,
      new StringOutputParser(),
    ])

    // Add retry logic
    let attempts = 0
    const maxAttempts = 3
    let response: string | undefined

    while (attempts < maxAttempts) {
      try {
        response = await chain.invoke({ message })
        break
      } catch (error) {
        attempts++
        console.error(`Attempt ${attempts} failed:`, error)
        if (attempts === maxAttempts) throw error
        // Wait before retrying (exponential backoff)
        await new Promise(resolve => setTimeout(resolve, Math.pow(2, attempts) * 1000))
      }
    }

    if (!response) {
      throw new Error('Failed to generate response')
    }

    // Save the interaction to memory with the actual response
    await memory.saveContext({ input: message }, { output: response })

    return createStreamingResponse(createResponseGenerator(response)())
  } catch (error) {
    console.error('Chat error:', error)
    return NextResponse.json({ error: 'Failed to process message' } as ChatResponse, { status: 500 })
  }
}
