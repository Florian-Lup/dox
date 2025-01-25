import { Editor } from '@tiptap/react'
import { Scope } from '@/hooks/useScope'
import { createStreamingHandler, getTextFromScope } from '../../../core/editor/editorUtils'

export const handleLocalize = async (
  editor: Editor,
  scope: Scope,
  modelName: string,
  targetRegion: { code: string; name: string },
  onProgress?: (text: string) => void,
) => {
  const inputText = getTextFromScope(editor, scope)
  const fullContent = editor.state.doc.textContent

  return createStreamingHandler(
    '/api/ai/localization',
    editor,
    scope,
    {
      text: inputText,
      modelName,
      fullContent,
      targetRegion,
    },
    {
      visualFeedback: {
        mark: 'strike',
      },
      onProgress,
    },
  )
}
