import { NextResponse } from 'next/server'
import { PromptTemplate } from '@langchain/core/prompts'
import { StringOutputParser } from '@langchain/core/output_parsers'
import { RunnableSequence } from '@langchain/core/runnables'
import { initializeAIModel, createStreamingResponse } from '../utils'

const clarityImprovePrompt = PromptTemplate.fromTemplate(`
Improve the clarity and readability of the text while preserving its core meaning.

Structural Improvements:
- Break down complex sentences into simpler ones
- Create logical paragraph breaks
- Use appropriate transition words and phrases
- Ensure proper information hierarchy
- Maintain consistent formatting

Readability Enhancements:
- Use active voice when appropriate
- Replace jargon with plain language
- Clarify ambiguous pronouns
- Remove unnecessary nominalization
- Strengthen topic sentences
- Add context where needed
- Use concrete examples

Flow and Coherence:
- Ensure smooth transitions between ideas
- Maintain consistent tense and perspective
- Group related information together
- Create clear cause-and-effect relationships
- Use parallel structure for similar ideas
- Establish clear connections between sentences

Language-Specific Considerations:
For English:
- Use strong verbs instead of weak verb-noun combinations
- Reduce prepositional phrases
- Avoid double negatives
- Use consistent terminology
- Place modifiers close to what they modify

For Romance Languages:
- Maintain natural word order
- Use appropriate pronouns for clarity
- Keep consistent agreement in long sentences
- Use subjunctive mood appropriately
- Balance formal and informal elements

For Germanic Languages:
- Maintain clear sentence structure despite flexible word order
- Use appropriate connectors
- Break down compound words when simpler alternatives exist
- Keep verb position consistent
- Use modal particles effectively

For East Asian Languages:
- Use appropriate particles for clarity
- Maintain proper topic-comment structure
- Use clear counter words
- Apply appropriate honorifics consistently
- Structure information from general to specific

While Maintaining:
- Original meaning and intent
- Technical accuracy
- Author's voice and style
- Cultural nuances
- Key terminology
- Essential details

IMPORTANT: 
- Return ONLY the adjusted text without any explanations, comments, or analysis
- Use the SAME LANGUAGE as the input text
- If the input is in Spanish, respond in Spanish
- If the input is in French, respond in French
- And so on for any other language

TEXT TO IMPROVE:
{text}

Improved text (return ONLY the improved text, no explanations):`)

export async function POST(req: Request) {
  try {
    const { text, modelName, temperature = 0.5 } = await req.json()

    if (!text || !modelName) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 })
    }

    const model = initializeAIModel(modelName, temperature)

    const chain = RunnableSequence.from([
      {
        text: (input: { text: string }) => input.text,
      },
      clarityImprovePrompt,
      model,
      new StringOutputParser(),
    ])

    const stream = await chain.stream({ text })
    return createStreamingResponse(stream)
  } catch (error) {
    console.error('Clarity improvement error:', error)
    return NextResponse.json({ error: 'Failed to process text' }, { status: 500 })
  }
}
