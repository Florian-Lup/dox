import { Editor } from '@tiptap/react'
import { Scope } from '@/hooks/useScope'
import { createStreamingHandler, getTextFromScope } from '../../../core/editor/editorUtils'
import { IntentOption } from '../types'

export const handleIntent = async (
  editor: Editor,
  scope: Scope,
  modelName: string,
  temperature: number,
  intent: IntentOption,
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
      temperature,
      intent,
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
