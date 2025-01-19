import { Editor } from '@tiptap/react'
import { Scope } from '@/hooks/useScope'

export interface StreamingOptions {
  visualFeedback?: {
    mark?: string // e.g., 'strike', 'highlight'
  }
  onProgress?: (text: string) => void
}

export interface AIRequestParams {
  text: string
  modelName: string
  fullContent?: string
  [key: string]: any
}

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

export const applyVisualFeedback = (editor: Editor, scope: Scope, options?: StreamingOptions['visualFeedback']) => {
  if (!options?.mark) return

  if (scope.type === 'selection' && scope.position) {
    editor.commands.setTextSelection(scope.position)
  } else {
    editor.commands.selectAll()
  }

  if (options.mark) {
    editor.commands.setMark(options.mark)
  }
}

export const removeVisualFeedback = (editor: Editor, scope: Scope, options?: StreamingOptions['visualFeedback']) => {
  if (!options?.mark) return

  if (scope.type === 'selection' && scope.position) {
    editor.commands.setTextSelection(scope.position)
  } else {
    editor.commands.selectAll()
  }

  if (options.mark) {
    editor.commands.unsetMark(options.mark)
  }
}

export const createStreamingHandler = async (
  endpoint: string,
  editor: Editor,
  scope: Scope,
  params: AIRequestParams,
  options?: StreamingOptions,
) => {
  try {
    // Apply visual feedback if configured
    if (options?.visualFeedback) {
      applyVisualFeedback(editor, scope, options.visualFeedback)
    }

    const response = await fetch(endpoint, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(params),
    })

    if (!response.ok) {
      if (options?.visualFeedback) {
        removeVisualFeedback(editor, scope, options.visualFeedback)
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
                options?.onProgress?.(accumulatedText)
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
    if (options?.visualFeedback) {
      removeVisualFeedback(editor, scope, options.visualFeedback)
    }
    console.error('Error during streaming:', error)
    throw error
  }
}
