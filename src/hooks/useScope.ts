import { Editor } from '@tiptap/react'
import { useCallback } from 'react'
import { create } from 'zustand'

export type Scope = {
  type: 'selection' | 'full'
  position?: {
    from: number
    to: number
    text: string
  }
}

type ScopeStore = {
  scope: Scope
  setScope: (scope: Scope) => void
}

const useScopeStore = create<ScopeStore>(set => ({
  scope: { type: 'full' },
  setScope: (newScope: Scope) => set({ scope: newScope }),
}))

export const useScope = (editor: Editor) => {
  const { scope, setScope } = useScopeStore()

  const captureSelection = useCallback(() => {
    const { from, to } = editor.state.selection
    const text = editor.state.doc.textBetween(from, to)

    if (text) {
      setScope({
        type: 'selection',
        position: {
          from,
          to,
          text,
        },
      })
    }
  }, [editor, setScope])

  const resetScope = useCallback(() => {
    const fullText = editor.state.doc.textBetween(0, editor.state.doc.content.size)
    setScope({
      type: 'full',
      position: {
        from: 0,
        to: editor.state.doc.content.size,
        text: fullText,
      },
    })
  }, [editor, setScope])

  return {
    scope,
    captureSelection,
    resetScope,
    isFullDocument: scope.type === 'full',
  }
}
