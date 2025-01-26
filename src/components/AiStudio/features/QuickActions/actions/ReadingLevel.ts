import { Editor } from '@tiptap/react'
import { Scope } from '@/hooks/useScope'
import { createStreamingHandler, getTextFromScope } from '../../../core/editor/editorUtils'

export const handleReadingLevel = async (
  editor: Editor,
  scope: Scope,
  modelName: string,
  temperature: number,
  readingLevel: number,
  onProgress?: (text: string) => void,
) => {
  const inputText = getTextFromScope(editor, scope)

  return createStreamingHandler(
    '/api/ai/ReadingLevel',
    editor,
    scope,
    {
      text: inputText,
      modelName,
      temperature,
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
