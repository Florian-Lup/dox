import { Editor } from '@tiptap/react'
import { Scope } from '@/hooks/useScope'
import { createStreamingHandler, getTextFromScope } from '../../../core/editor/editorUtils'
import { LanguageOption } from '../types'

export const handleTranslate = async (
  editor: Editor,
  scope: Scope,
  modelName: string,
  temperature: number,
  targetLanguage: LanguageOption,
  onProgress?: (text: string) => void,
) => {
  const inputText = getTextFromScope(editor, scope)

  return createStreamingHandler(
    '/api/ai/translate',
    editor,
    scope,
    {
      text: inputText,
      modelName,
      temperature,
      targetLanguage,
    },
    {
      visualFeedback: {
        mark: 'strike',
      },
      onProgress,
    },
  )
}
