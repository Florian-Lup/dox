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
  chunkDelay = 20, // Consistent delay between chunks in milliseconds
  bufferSize = 2, // Number of characters to buffer before sending
): Promise<Response> => {
  const encoder = new TextEncoder()
  const stream = new TransformStream()
  const writer = stream.writable.getWriter()

  ;(async () => {
    try {
      let buffer = ''
      for await (const chunk of streamGenerator) {
        if (chunk) {
          buffer += chunk
          // Send chunks when buffer reaches the threshold
          while (buffer.length >= bufferSize) {
            const sendChunk = buffer.slice(0, bufferSize)
            buffer = buffer.slice(bufferSize)
            await writer.write(encoder.encode(`data: ${JSON.stringify({ chunk: sendChunk })}\n\n`))
            await new Promise(resolve => setTimeout(resolve, chunkDelay))
          }
        }
      }
      // Send any remaining buffer content
      if (buffer.length > 0) {
        await writer.write(encoder.encode(`data: ${JSON.stringify({ chunk: buffer })}\n\n`))
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
