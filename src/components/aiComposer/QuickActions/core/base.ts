import { Editor } from '@tiptap/react'
import { Scope } from '@/hooks/useScope'
import { getTextFromScope, updateEditorContent } from './utils'

export interface BaseActionParams {
  text: string
  modelName: string
  fullContent?: string
  [key: string]: any
}

export const createQuickActionHandler = async (
  endpoint: string,
  editor: Editor,
  scope: Scope,
  modelName: string,
  onProgress?: (text: string) => void,
  additionalData?: Record<string, any>,
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

    const response = await fetch(endpoint, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        text: inputText,
        modelName,
        fullContent,
        ...additionalData,
      }),
    })

    if (!response.ok) {
      // Remove strike-through on error
      if (scope.type === 'selection' && scope.position) {
        editor.commands.setTextSelection(scope.position)
        editor.commands.unsetMark('strike')
      } else {
        editor.commands.selectAll()
        editor.commands.unsetMark('strike')
      }

      const errorData = await response.json().catch(() => ({}))
      console.error('Request failed:', {
        status: response.status,
        statusText: response.statusText,
        errorData,
      })
      throw new Error(`Failed to process with ${endpoint}`)
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
                onProgress?.(accumulatedText)
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
    // Remove strike-through on any error
    if (scope.type === 'selection' && scope.position) {
      editor.commands.setTextSelection(scope.position)
      editor.commands.unsetMark('strike')
    } else {
      editor.commands.selectAll()
      editor.commands.unsetMark('strike')
    }
    console.error('Error during quick action:', error)
    throw error
  }
}
