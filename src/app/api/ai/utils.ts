import { ChatOpenAI } from '@langchain/openai'
import { ChatGoogleGenerativeAI } from '@langchain/google-genai'
import { ChatAnthropic } from '@langchain/anthropic'
import { ChatFireworks } from '@langchain/community/chat_models/fireworks'
import { BaseChatModel } from '@langchain/core/language_models/chat_models'

export interface StreamResponse {
  chunk?: string
  error?: string
}

export const initializeAIModel = (modelName: string, temperature: number = 0.5): BaseChatModel => {
  const isGemini = modelName.startsWith('gemini')
  const isClaude = modelName.startsWith('claude')
  const isFireworks = modelName.startsWith('accounts/fireworks')

  if (isGemini) {
    if (!process.env.GOOGLE_API_KEY) {
      throw new Error('Google API key not found')
    }
    return new ChatGoogleGenerativeAI({
      modelName: modelName,
      temperature: temperature,
      apiKey: process.env.GOOGLE_API_KEY,
      streaming: true,
    })
  } else if (isClaude) {
    if (!process.env.ANTHROPIC_API_KEY) {
      throw new Error('Anthropic API key not found')
    }
    return new ChatAnthropic({
      modelName: modelName,
      temperature: temperature,
      anthropicApiKey: process.env.ANTHROPIC_API_KEY,
      streaming: true,
    })
  } else if (isFireworks) {
    if (!process.env.FIREWORKS_API_KEY) {
      throw new Error('Fireworks API key not found')
    }
    return new ChatFireworks({
      modelName: modelName,
      temperature: temperature,
      fireworksApiKey: process.env.FIREWORKS_API_KEY,
      streaming: true,
    })
  } else {
    if (!process.env.OPENAI_API_KEY) {
      throw new Error('OpenAI API key not found')
    }
    return new ChatOpenAI({
      modelName,
      temperature: temperature,
      openAIApiKey: process.env.OPENAI_API_KEY,
      streaming: true,
    })
  }
}

export const createStreamingResponse = async (
  streamGenerator: AsyncGenerator<string>,
  chunkSize = 3,
  bufferThreshold = 20,
  streamInterval = 30,
): Promise<Response> => {
  const encoder = new TextEncoder()
  const stream = new TransformStream()
  const writer = stream.writable.getWriter()

  ;(async () => {
    try {
      let buffer = ''
      let isStreaming = false

      for await (const chunk of streamGenerator) {
        if (chunk) {
          buffer += chunk

          if (!isStreaming && buffer.length >= bufferThreshold) {
            isStreaming = true
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
