import { NextResponse } from 'next/server'
import { PromptTemplate } from '@langchain/core/prompts'
import { StringOutputParser } from '@langchain/core/output_parsers'
import { RunnableSequence } from '@langchain/core/runnables'
import { initializeAIModel, createStreamingResponse } from '../utils'

const translatePrompt = PromptTemplate.fromTemplate(`
Translate the text into {languageName} ({languageCode}) while ensuring high-quality, natural translation.

Language-Specific Considerations for {languageName}:

For East Asian Languages (Chinese, Japanese, Korean):
- Use appropriate characters (Hanzi/Kanji/Hanja)
- Apply correct measure words and counters
- Handle honorific levels and keigo (Japanese)
- Consider character choice (simplified/traditional Chinese)
- Maintain proper vertical text formatting if needed

For European Languages (French, German, Spanish, etc.):
- Apply correct gender and number agreement
- Use appropriate verb conjugations and tenses
- Handle formal/informal pronouns (tu/vous, du/Sie, tú/usted)
- Consider regional variations (European/Latin American Spanish)
- Maintain proper quotation marks and punctuation styles

For Arabic and RTL Languages:
- Ensure correct right-to-left formatting
- Apply proper Arabic diacritics when needed
- Handle formal/informal pronouns
- Consider regional dialects and Modern Standard Arabic
- Maintain proper numerical formats

For South Asian Languages (Hindi, Bengali, etc.):
- Use appropriate honorifics and respect levels
- Handle gender agreements
- Apply correct verb conjugations
- Consider formal/informal pronouns
- Maintain proper script rendering

Universal Translation Guidelines:
Cultural Adaptation:
- Adapt idioms and expressions to target culture
- Adjust cultural references appropriately
- Use proper level of formality
- Consider regional preferences
- Maintain cultural sensitivity

Content Accuracy:
- Preserve original meaning precisely
- Keep technical terms accurate
- Maintain proper nouns as needed
- Preserve formatting and emphasis
- Retain tone and style

Special Elements:
- Handle abbreviations appropriately
- Adapt units of measurement if needed
- Preserve or adapt humor when present
- Maintain document structure
- Keep special characters as appropriate

IMPORTANT: Return ONLY the translated text without any explanations, comments, or analysis.

TEXT TO TRANSLATE:
{text}

Translation in {languageName} (return ONLY the translated text, no explanations):`)

export async function POST(req: Request) {
  try {
    const { text, modelName, targetLanguage } = await req.json()

    if (!text || !modelName || !targetLanguage?.code || !targetLanguage?.name) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 })
    }

    const model = initializeAIModel(modelName)
    const chain = RunnableSequence.from([
      {
        text: (input: any) => input.text,
        languageName: (input: any) => input.targetLanguage.name,
        languageCode: (input: any) => input.targetLanguage.code,
      },
      translatePrompt,
      model,
      new StringOutputParser(),
    ])

    const stream = await chain.stream({
      text,
      targetLanguage,
    })
    return createStreamingResponse(stream)
  } catch (error) {
    console.error('Translation error:', error)
    return NextResponse.json({ error: 'Failed to process text' }, { status: 500 })
  }
}
