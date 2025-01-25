import { Editor } from '@tiptap/react'
import { Scope } from '@/hooks/useScope'
import { createStreamingHandler, getTextFromScope } from '../../../core/editor/editorUtils'
import { DomainOption } from '../types'

export const handleDomain = async (
  editor: Editor,
  scope: Scope,
  modelName: string,
  temperature: number,
  domain: DomainOption,
  onProgress?: (text: string) => void,
) => {
  const inputText = getTextFromScope(editor, scope)

  return createStreamingHandler(
    '/api/ai/domain',
    editor,
    scope,
    {
      text: inputText,
      modelName,
      temperature,
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
