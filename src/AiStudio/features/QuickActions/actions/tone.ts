import { Editor } from '@tiptap/react'
import { Scope } from '@/hooks/useScope'
import { createStreamingHandler, getTextFromScope } from '../../../core/editor/editorUtils'

export const handleTone = async (
  editor: Editor,
  scope: Scope,
  modelName: string,
  tone: { code: string; name: string },
  onProgress?: (text: string) => void,
) => {
  const inputText = getTextFromScope(editor, scope)
  const fullContent = editor.state.doc.textContent

  return createStreamingHandler(
    '/api/ai/tone',
    editor,
    scope,
    {
      text: inputText,
      modelName,
      fullContent,
      tone,
    },
    {
      visualFeedback: {
        mark: 'strike',
      },
      onProgress,
    },
  )
}
