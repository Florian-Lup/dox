import { Editor } from '@tiptap/react'
import { Scope } from '@/hooks/useScope'

export const getTextFromScope = (editor: Editor, scope: Scope) => {
  return scope.type === 'full'
    ? editor.getText()
    : editor.state.doc.textBetween(scope.position?.from || 0, scope.position?.to || 0)
}

export const updateEditorContent = (editor: Editor, scope: Scope, text: string) => {
  if (scope.type === 'full') {
    editor.chain().focus().clearContent().insertContent(text).run()
  } else if (scope.position) {
    const { from, to } = scope.position
    editor.chain().focus().deleteRange({ from, to }).insertContent(text).run()
  }
}

// New function for streaming updates
export const handleStreamingUpdate = (editor: Editor, scope: Scope, text: string) => {
  // Store current selection state
  const { from, to } = editor.state.selection

  // Update content
  updateEditorContent(editor, scope, text)

  // Restore selection if needed
  if (from !== to) {
    editor.commands.setTextSelection({ from, to })
  }
}
