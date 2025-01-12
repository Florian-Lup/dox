import { Editor } from '@tiptap/react'
import { Scope } from '@/hooks/useScope'
import { getTextFromScope, updateEditorContent } from './utils'

export interface GrammarFixParams {
  text: string
  modelName: string
  fullContent: string
}

export const handleGrammarFix = async (
  editor: Editor,
  scope: Scope,
  modelName: string,
  onProgress?: (text: string) => void,
) => {
  try {
    const inputText = getTextFromScope(editor, scope)
    const fullContent = editor.state.doc.textContent

    // Apply strike-through to the target text
    if (scope.type === 'selection' && scope.position) {
      editor.commands.setTextSelection(scope.position)
      editor.commands.setMark('strike')
    } else {
      editor.commands.selectAll()
      editor.commands.setMark('strike')
    }

    const response = await fetch('/api/ai/grammar', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ text: inputText, modelName, fullContent }),
    })

    if (!response.ok) {
      throw new Error('Failed to fix grammar')
    }

    if (!response.body) {
      throw new Error('No response body')
    }

    const reader = response.body.getReader()
    let accumulatedText = ''

    try {
      const initialPosition = scope.type === 'selection' && scope.position ? scope.position : null
      let currentFrom = initialPosition?.from

      if (scope.type === 'selection' && initialPosition) {
        editor.commands.deleteRange(initialPosition)
        currentFrom = initialPosition.from
      }

      while (true) {
        const { done, value } = await reader.read()
        if (done) break

        const chunk = new TextDecoder().decode(value)
        const lines = chunk.split('\n')

        for (const line of lines) {
          if (line.trim().startsWith('data: ')) {
            try {
              const jsonStr = line.trim().slice(5)
              const data = JSON.parse(jsonStr)

              if (data.chunk) {
                accumulatedText += data.chunk
                if (scope.type === 'selection' && currentFrom !== undefined) {
                  editor.commands.insertContentAt(currentFrom, data.chunk)
                  currentFrom += data.chunk.length
                } else {
                  editor.commands.setContent(accumulatedText)
                }
              }
            } catch (e) {
              console.warn('Failed to parse chunk:', e)
            }
          }
        }
      }
    } finally {
      reader.releaseLock()
    }
  } catch (error) {
    console.error('Error during grammar fix:', error)
    throw error
  }
}
