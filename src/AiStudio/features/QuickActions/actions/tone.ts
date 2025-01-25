import { Editor } from '@tiptap/react'
import { Scope } from '@/hooks/useScope'
import { createStreamingHandler, getTextFromScope } from '../../../core/editor/editorUtils'
import { ToneOption } from '../types'

export const handleTone = async (
  editor: Editor,
  scope: Scope,
  modelName: string,
  temperature: number,
  tone: ToneOption,
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
      temperature,
      tone,
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
