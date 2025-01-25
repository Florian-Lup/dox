import { Editor } from '@tiptap/react'
import { Scope } from '@/hooks/useScope'
import { createStreamingHandler, getTextFromScope } from '../../../core/editor/editorUtils'

export const handleTargetAudience = async (
  editor: Editor,
  scope: Scope,
  modelName: string,
  targetAudience: string,
  onProgress?: (text: string) => void,
) => {
  const inputText = getTextFromScope(editor, scope)
  const fullContent = editor.state.doc.textContent

  return createStreamingHandler(
    '/api/ai/TargetAudience',
    editor,
    scope,
    {
      text: inputText,
      modelName,
      fullContent,
      targetAudience,
    },
    {
      visualFeedback: {
        mark: 'strike',
      },
      onProgress,
    },
  )
}
