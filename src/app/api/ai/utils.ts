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
  chunkSize = 3, // Number of characters to send in each chunk
  bufferThreshold = 20, // Minimum characters to accumulate before starting to stream
  streamInterval = 30, // Milliseconds between each chunk sent
): Promise<Response> => {
  const encoder = new TextEncoder()
  const stream = new TransformStream()
  const writer = stream.writable.getWriter()

  ;(async () => {
    try {
      let buffer = ''
      let isStreaming = false

      // Accumulate initial content
      for await (const chunk of streamGenerator) {
        if (chunk) {
          buffer += chunk

          // Start streaming once we have enough content
          if (!isStreaming && buffer.length >= bufferThreshold) {
            isStreaming = true

            // Start the streaming process in a separate async function
            ;(async () => {
              while (buffer.length > 0) {
                const sendSize = Math.min(chunkSize, buffer.length)
                const sendChunk = buffer.slice(0, sendSize)
                buffer = buffer.slice(sendSize)

                await writer.write(encoder.encode(`data: ${JSON.stringify({ chunk: sendChunk })}\n\n`))
                await new Promise(resolve => setTimeout(resolve, streamInterval))
              }

              if (!buffer.length && !streamGenerator[Symbol.asyncIterator]) {
                await writer.close()
              }
            })()
          }
        }
      }

      // Handle any remaining buffer content
      if (buffer.length > 0) {
        while (buffer.length > 0) {
          const sendSize = Math.min(chunkSize, buffer.length)
          const sendChunk = buffer.slice(0, sendSize)
          buffer = buffer.slice(sendSize)

          await writer.write(encoder.encode(`data: ${JSON.stringify({ chunk: sendChunk })}\n\n`))
          await new Promise(resolve => setTimeout(resolve, streamInterval))
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
