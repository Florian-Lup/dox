import { Editor } from '@tiptap/react'
import { Scope } from '@/hooks/useScope'
import { createQuickActionHandler } from './core/base'

export const handleTranslate = async (
  editor: Editor,
  scope: Scope,
  modelName: string,
  targetLanguage: { code: string; name: string },
  onProgress?: (text: string) => void,
) => {
  return createQuickActionHandler('/api/ai/translate', editor, scope, modelName, onProgress, { targetLanguage })
}
