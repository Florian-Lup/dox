import { NextResponse } from 'next/server'
import { ChatOpenAI } from '@langchain/openai'
import { ChatGoogleGenerativeAI } from '@langchain/google-genai'
import { PromptTemplate } from '@langchain/core/prompts'
import { StringOutputParser } from '@langchain/core/output_parsers'
import { RunnableSequence } from '@langchain/core/runnables'
import { BaseChatModel } from '@langchain/core/language_models/chat_models'

const grammarFixPrompt = PromptTemplate.fromTemplate(`
Fix any grammar issues in the TARGET TEXT while preserving its meaning and style.
If there are no grammar issues, return the target text unchanged.
Use the full document context to better understand the meaning and flow.

IMPORTANT: Return ONLY the corrected text without any explanations, comments, or analysis.

Full document:
{fullContent}

TARGET TEXT TO FIX (located within the document):
{text}

Corrected text (return ONLY the fixed text, no explanations):`)

export async function POST(req: Request) {
  try {
    const { text, modelName, fullContent = '' } = await req.json()

    let model: BaseChatModel
    const isGemini = modelName.startsWith('gemini')

    if (isGemini) {
      if (!process.env.GOOGLE_API_KEY) {
        console.error('❌ Google API key not found')
        return NextResponse.json({ error: 'Google API key not found' }, { status: 500 })
      }
      model = new ChatGoogleGenerativeAI({
        modelName: modelName,
        temperature: 0,
        apiKey: process.env.GOOGLE_API_KEY,
        streaming: true,
      })
    } else {
      if (!process.env.OPENAI_API_KEY) {
        console.error('❌ OpenAI API key not found')
        return NextResponse.json({ error: 'OpenAI API key not found' }, { status: 500 })
      }
      model = new ChatOpenAI({
        modelName,
        temperature: 0,
        openAIApiKey: process.env.OPENAI_API_KEY,
        streaming: true,
      })
    }

    const chain = RunnableSequence.from([
      {
        text: (input: { text: string; fullContent: string }) => input.text,
        fullContent: (input: { text: string; fullContent: string }) => input.fullContent,
      },
      grammarFixPrompt,
      model,
      new StringOutputParser(),
    ])

    const encoder = new TextEncoder()
    const stream = new TransformStream()
    const writer = stream.writable.getWriter()

    // Process the stream
    ;(async () => {
      try {
        let buffer = ''

        const sleep = (ms: number) => new Promise(resolve => setTimeout(resolve, ms))

        for await (const chunk of await chain.stream({ text, fullContent })) {
          if (isGemini) {
            // For Gemini, process word by word with small delays
            buffer += chunk
            const words = buffer.split(/(\s+)/) // Split by whitespace but keep the separators

            while (words.length > 1) {
              // Keep last word in buffer in case it's incomplete
              const word = words.shift()! // Get and remove first word
              if (word) {
                await writer.write(encoder.encode(`data: ${JSON.stringify({ chunk: word })}\n\n`))
                await sleep(10) // Small delay between words for more natural flow
              }
            }

            buffer = words.join('') // Keep any remaining partial word
          } else {
            // For OpenAI, stream as is
            await writer.write(encoder.encode(`data: ${JSON.stringify({ chunk })}\n\n`))
          }
        }

        // Send any remaining buffered text
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
  } catch (error) {
    console.error('Grammar fix error:', error)
    return NextResponse.json({ error: 'Failed to process text' }, { status: 500 })
  }
}
