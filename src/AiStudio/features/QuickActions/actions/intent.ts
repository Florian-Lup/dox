import { Editor } from '@tiptap/react'
import { Scope } from '@/hooks/useScope'
import { createStreamingHandler, getTextFromScope } from '../../../core/editor/editorUtils'

export const handleIntent = async (
  editor: Editor,
  scope: Scope,
  modelName: string,
  intent: { code: string; name: string },
  onProgress?: (text: string) => void,
) => {
  const inputText = getTextFromScope(editor, scope)
  const fullContent = editor.state.doc.textContent

  return createStreamingHandler(
    '/api/ai/intent',
    editor,
    scope,
    {
      text: inputText,
      modelName,
      fullContent,
      intent,
    },
    {
      visualFeedback: {
        mark: 'strike',
      },
      onProgress,
    },
  )
}
