import { NextResponse } from 'next/server'
import { PromptTemplate } from '@langchain/core/prompts'
import { StringOutputParser } from '@langchain/core/output_parsers'
import { RunnableSequence } from '@langchain/core/runnables'
import { initializeAIModel, createStreamingResponse } from '../utils'

const DomainPrompt = PromptTemplate.fromTemplate(`
Rewrite the text to match the {domain} style.
Writing domains and their characteristics:
- Journalistic Writing: Clear, concise, factual reporting style with inverted pyramid structure
- Creative Writing: Expressive, descriptive, engaging with literary devices and narrative flow
- Business Writing: Professional, precise, action-oriented with clear value propositions
- General Writing: Balanced, accessible, straightforward communication
- Academic Writing: Formal, analytical, evidence-based with proper citations and terminology
- Technical Writing: Clear, structured, detailed with precise technical terminology
- Legal Writing: Precise, formal, unambiguous with proper legal terminology and formatting

Maintain the core message and key information while adapting the style, tone, and structure to match {domain}.
The text should authentically represent the conventions and best practices of {domain}.

IMPORTANT: 
- Return ONLY the rewritten text without any explanations, comments, or analysis
- Use the SAME LANGUAGE as the input text
- If the input is in Spanish, respond in Spanish
- If the input is in French, respond in French
- And so on for any other language

TEXT TO ADAPT:
{text}

{domain}-adapted text (return ONLY the adapted text, no explanations):`)

export async function POST(req: Request) {
  try {
    const { text, modelName, domain } = await req.json()

    if (!text || !modelName || domain === undefined) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 })
    }

    // Map domain numbers to domain names
    const domainTypes = {
      1: 'Journalistic Writing',
      2: 'Creative Writing',
      3: 'Business Writing',
      4: 'General Writing',
      5: 'Academic Writing',
      6: 'Technical Writing',
      7: 'Legal Writing',
    }

    const domainType = domainTypes[domain as keyof typeof domainTypes]
    if (!domainType) {
      return NextResponse.json({ error: 'Invalid domain type' }, { status: 400 })
    }

    const model = initializeAIModel(modelName)
    const chain = RunnableSequence.from([
      {
        text: (input: any) => input.text,
        domain: (input: any) => input.domain,
      },
      DomainPrompt,
      model,
      new StringOutputParser(),
    ])

    const stream = await chain.stream({
      text,
      domain: domainType,
    })
    return createStreamingResponse(stream)
  } catch (error) {
    console.error('Domain adaptation error:', error)
    return NextResponse.json({ error: 'Failed to process text' }, { status: 500 })
  }
}
