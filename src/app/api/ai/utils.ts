import { ChatOpenAI } from '@langchain/openai'
import { ChatGoogleGenerativeAI } from '@langchain/google-genai'
import { BaseChatModel } from '@langchain/core/language_models/chat_models'

export interface StreamResponse {
  chunk?: string
  error?: string
}

export const initializeAIModel = (modelName: string): BaseChatModel => {
  const isGemini = modelName.startsWith('gemini')

  if (isGemini) {
    if (!process.env.GOOGLE_API_KEY) {
      throw new Error('Google API key not found')
    }
    return new ChatGoogleGenerativeAI({
      modelName: modelName,
      temperature: 0,
      apiKey: process.env.GOOGLE_API_KEY,
      streaming: true,
    })
  } else {
    if (!process.env.OPENAI_API_KEY) {
      throw new Error('OpenAI API key not found')
    }
    return new ChatOpenAI({
      modelName,
      temperature: 0,
      openAIApiKey: process.env.OPENAI_API_KEY,
      streaming: true,
    })
  }
}

export const createStreamingResponse = async (
  streamGenerator: AsyncGenerator<string>,
  wordDelay = 10,
): Promise<Response> => {
  const encoder = new TextEncoder()
  const stream = new TransformStream()
  const writer = stream.writable.getWriter()

  // Process the complete output and then stream it
  ;(async () => {
    try {
      // Collect the streamed output
      let completeOutput = ''
      for await (const chunk of streamGenerator) {
        completeOutput += chunk
      }

      // Stream the complete output to frontend
      const words = completeOutput.split(/(\s+)/)
      for (const word of words) {
        if (word) {
          await writer.write(encoder.encode(`data: ${JSON.stringify({ chunk: word })}\n\n`))
          await new Promise(resolve => setTimeout(resolve, wordDelay))
        }
      }
    } catch (error) {
      console.error('Stream error:', error)
      await writer.write(encoder.encode(`data: ${JSON.stringify({ error: 'Streaming failed' })}\n\n`))
    } finally {
      await writer.close()
    }
  })()

  return new Response(stream.readable, {
    headers: {
      'Content-Type': 'text/event-stream',
      'Cache-Control': 'no-cache',
      Connection: 'keep-alive',
    },
  })
}
