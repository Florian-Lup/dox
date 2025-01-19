import { Editor } from '@tiptap/react'
import { Scope } from '@/hooks/useScope'
import { createStreamingHandler, getTextFromScope } from '../../core/editorUtils'

export const handleTranslate = async (
  editor: Editor,
  scope: Scope,
  modelName: string,
  targetLanguage: { code: string; name: string },
  onProgress?: (text: string) => void,
) => {
  const inputText = getTextFromScope(editor, scope)
  const fullContent = editor.state.doc.textContent

  return createStreamingHandler(
    '/api/ai/translate',
    editor,
    scope,
    {
      text: inputText,
      modelName,
      fullContent,
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
