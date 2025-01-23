import { Editor } from '@tiptap/react'
import { Scope } from '@/hooks/useScope'
import { createStreamingHandler, getTextFromScope } from '../../core/editorUtils'

export const handleAdjustLength = async (
  editor: Editor,
  scope: Scope,
  modelName: string,
  percentage: number,
  onProgress?: (text: string) => void,
) => {
  const inputText = getTextFromScope(editor, scope)
  const fullContent = editor.state.doc.textContent

  return createStreamingHandler(
    '/api/ai/AdjustLength',
    editor,
    scope,
    {
      text: inputText,
      modelName,
      fullContent,
      percentage,
    },
    {
      visualFeedback: {
        mark: 'strike',
      },
      onProgress,
    },
  )
}
