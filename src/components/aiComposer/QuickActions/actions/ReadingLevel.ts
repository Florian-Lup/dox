import { Editor } from '@tiptap/react'
import { Scope } from '@/hooks/useScope'
import { createStreamingHandler, getTextFromScope } from '../../core/editorUtils'

export const handleReadingLevel = async (
  editor: Editor,
  scope: Scope,
  modelName: string,
  readingLevel: number,
  onProgress?: (text: string) => void,
) => {
  const inputText = getTextFromScope(editor, scope)
  const fullContent = editor.state.doc.textContent

  return createStreamingHandler(
    '/api/ai/ReadingLevel',
    editor,
    scope,
    {
      text: inputText,
      modelName,
      readingLevel,
    },
    {
      visualFeedback: {
        mark: 'strike',
      },
      onProgress,
    },
  )
}
