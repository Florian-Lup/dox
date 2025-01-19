import { Editor } from '@tiptap/react'
import { Scope } from '@/hooks/useScope'
import { createStreamingHandler, getTextFromScope } from '../../core/editorUtils'

export const handleGrammarFix = async (
  editor: Editor,
  scope: Scope,
  modelName: string,
  onProgress?: (text: string) => void,
) => {
  const inputText = getTextFromScope(editor, scope)
  const fullContent = editor.state.doc.textContent

  return createStreamingHandler(
    '/api/ai/grammar',
    editor,
    scope,
    {
      text: inputText,
      modelName,
      fullContent,
    },
    {
      visualFeedback: {
        mark: 'strike',
      },
      onProgress,
    },
  )
}
