import { Editor } from '@tiptap/react'
import { Scope } from '@/hooks/useScope'
import { createQuickActionHandler } from './core/base'

export const handleClarityImprovement = async (
  editor: Editor,
  scope: Scope,
  modelName: string,
  onProgress?: (text: string) => void,
) => {
  return createQuickActionHandler('/api/ai/clarity', editor, scope, modelName, onProgress)
}
