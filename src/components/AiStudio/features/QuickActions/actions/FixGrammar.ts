import { Editor } from '@tiptap/react'
import { Scope } from '@/hooks/useScope'
import { createStreamingHandler, getTextFromScope } from '../../../core/editor/editorUtils'

export const handleGrammarFix = async (
  editor: Editor,
  scope: Scope,
  modelName: string,
  temperature: number,
  onProgress?: (text: string) => void,
) => {
  const inputText = getTextFromScope(editor, scope)

  return createStreamingHandler(
    '/api/ai/FixGrammar',
    editor,
    scope,
    {
      text: inputText,
      modelName,
      temperature,
    },
    {
      visualFeedback: {
        mark: 'strike',
      },
      onProgress,
    },
  )
}
