import { Editor } from '@tiptap/react'
import { Scope } from '@/hooks/useScope'
import { createStreamingHandler, getTextFromScope } from '../../../core/editor/editorUtils'
import { RegionOption } from '../types'

export const handleLocalize = async (
  editor: Editor,
  scope: Scope,
  modelName: string,
  temperature: number,
  targetRegion: RegionOption,
  onProgress?: (text: string) => void,
) => {
  const inputText = getTextFromScope(editor, scope)
  const fullContent = editor.state.doc.textContent

  return createStreamingHandler(
    '/api/ai/localize',
    editor,
    scope,
    {
      text: inputText,
      modelName,
      temperature,
      targetRegion,
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
