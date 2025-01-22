import { Editor } from '@tiptap/react'
import { useCallback } from 'react'
import { create } from 'zustand'

export type Scope = {
  type: 'selection'
  position: {
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
  scope: {
    type: 'selection',
    position: {
      from: 0,
      to: 0,
      text: '',
    },
  },
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
    setScope({
      type: 'selection',
      position: {
        from: 0,
        to: 0,
        text: '',
      },
    })
  }, [setScope])

  return {
    scope,
    captureSelection,
    resetScope,
    isFullDocument: false,
  }
}
