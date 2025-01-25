import { NextResponse } from 'next/server'
import { PromptTemplate } from '@langchain/core/prompts'
import { StringOutputParser } from '@langchain/core/output_parsers'
import { RunnableSequence } from '@langchain/core/runnables'
import { initializeAIModel, createStreamingResponse } from '../utils'

const localizationPrompt = PromptTemplate.fromTemplate(`
Localize the text for {regionName} ({regionCode}) while ensuring culturally appropriate and natural adaptation.

Region-Specific Considerations for {regionName}:

Cultural Context:
- Adapt cultural references to local equivalents
- Use region-appropriate idioms and expressions
- Consider local customs and traditions
- Adjust humor and tone for local sensibilities
- Handle sensitive topics appropriately

Language Variations:
- Use region-specific vocabulary and terminology
- Apply local spelling conventions
- Follow regional grammar preferences
- Use appropriate date/time formats
- Handle numbers and currencies correctly

Content Adaptation:
- Modify examples to be locally relevant
- Adjust measurements to local standards
- Use appropriate honorifics and titles
- Consider local business practices
- Adapt imagery descriptions if mentioned

Regional Compliance:
- Follow local content guidelines
- Consider regional legal requirements
- Adapt to local marketing standards
- Use appropriate disclaimers
- Handle personal data mentions appropriately

Formatting and Style:
- Use local punctuation conventions
- Follow regional style guides
- Apply appropriate capitalization rules
- Use local address formats
- Handle name formats correctly

IMPORTANT: Return ONLY the localized text without any explanations, comments, or analysis.

TEXT TO LOCALIZE:
{text}

Localization for {regionName} (return ONLY the localized text, no explanations):`)

export async function POST(req: Request) {
  try {
    const { text, modelName, targetRegion, temperature = 0.5 } = await req.json()

    if (!text || !modelName || !targetRegion?.code || !targetRegion?.name) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 })
    }

    const model = initializeAIModel(modelName, temperature)
    const chain = RunnableSequence.from([
      {
        text: (input: any) => input.text,
        regionName: (input: any) => input.targetRegion.name,
        regionCode: (input: any) => input.targetRegion.code,
      },
      localizationPrompt,
      model,
      new StringOutputParser(),
    ])

    const stream = await chain.stream({
      text,
      targetRegion,
    })
    return createStreamingResponse(stream)
  } catch (error) {
    console.error('Localization error:', error)
    return NextResponse.json({ error: 'Failed to process text' }, { status: 500 })
  }
}
