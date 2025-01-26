import { Editor } from '@tiptap/react'
import { Scope } from '@/hooks/useScope'
import { createStreamingHandler, getTextFromScope } from '../../../core/editor/editorUtils'

export const handleAdjustLength = async (
  editor: Editor,
  scope: Scope,
  modelName: string,
  temperature: number,
  percentage: number,
  onProgress?: (text: string) => void,
) => {
  const inputText = getTextFromScope(editor, scope)

  return createStreamingHandler(
    '/api/ai/AdjustLength',
    editor,
    scope,
    {
      text: inputText,
      modelName,
      temperature,
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
