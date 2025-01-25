import { Editor } from '@tiptap/react'
import { Scope } from '@/hooks/useScope'
import { createStreamingHandler, getTextFromScope } from '../../../core/editor/editorUtils'

export const handleDomain = async (
  editor: Editor,
  scope: Scope,
  modelName: string,
  domain: number,
  onProgress?: (text: string) => void,
) => {
  const inputText = getTextFromScope(editor, scope)
  const fullContent = editor.state.doc.textContent

  return createStreamingHandler(
    '/api/ai/domain',
    editor,
    scope,
    {
      text: inputText,
      modelName,
      domain,
    },
    {
      visualFeedback: {
        mark: 'strike',
      },
      onProgress,
    },
  )
}
