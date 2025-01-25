import { NextResponse } from 'next/server'
import { PromptTemplate } from '@langchain/core/prompts'
import { StringOutputParser } from '@langchain/core/output_parsers'
import { RunnableSequence } from '@langchain/core/runnables'
import { initializeAIModel, createStreamingResponse } from '../utils'

const grammarFixPrompt = PromptTemplate.fromTemplate(`
Fix any grammatical issues in the text while preserving its original meaning, style, and intent.

Language-Specific Grammar Rules:

For English:
Grammar:
- Subject-verb agreement
- Verb tense consistency
- Proper use of articles (a, an, the)
- Correct pronoun usage
- Parallel structure in lists and comparisons
- Proper use of modals and auxiliaries
- Correct preposition usage

For Romance Languages (Spanish, French, Italian, etc.):
Grammar:
- Gender and number agreement (articles, nouns, adjectives)
- Subjunctive mood usage
- Verb conjugations and tenses
- Pronoun placement and usage
- Proper use of reflexive verbs
- Adjective placement
- Preposition choice

For Germanic Languages (German, Dutch, etc.):
Grammar:
- Word order (V2 rule, verb placement)
- Case system usage (nominative, accusative, dative, genitive)
- Gender agreement
- Compound word formation
- Verb conjugations and tenses
- Modal particle usage
- Adjective declension

For East Asian Languages:
Grammar:
- Particle usage
- Counter word usage
- Honorific forms
- Word order
- Aspect marking
- Topic and subject marking
- Verb conjugation patterns

Universal Corrections:
Punctuation:
- Proper use of commas, periods, and semicolons
- Correct placement of quotation marks
- Proper spacing rules
- Language-specific punctuation marks
- List formatting

Spelling:
- Common misspellings
- Commonly confused words
- Technical and specialized terms
- Proper nouns and brand names
- Regional spelling variations

Syntax:
- Clear sentence structure
- Proper word order
- Elimination of run-on sentences
- Fix sentence fragments
- Proper modifier placement

Maintain the original:
- Writing style and voice
- Technical terminology
- Formatting and emphasis
- Cultural references
- Author's intent

If there are no issues to fix, return the text unchanged.

IMPORTANT: 
- Return ONLY the adjusted text without any explanations, comments, or analysis
- Use the SAME LANGUAGE as the input text
- If the input is in Spanish, respond in Spanish
- If the input is in French, respond in French
- And so on for any other language

TEXT TO FIX:
{text}

Corrected text (return ONLY the fixed text, no explanations):`)

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
      grammarFixPrompt,
      model,
      new StringOutputParser(),
    ])

    const stream = await chain.stream({ text })
    return createStreamingResponse(stream)
  } catch (error) {
    console.error('Grammar fix error:', error)
    return NextResponse.json({ error: 'Failed to process text' }, { status: 500 })
  }
}
