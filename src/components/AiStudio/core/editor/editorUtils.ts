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

const hasValidSelection = (scope: Scope) => {
  return scope.position.text.length > 0 && scope.position.from !== scope.position.to
}

export const getTextFromScope = (editor: Editor, scope: Scope) => {
  if (!hasValidSelection(scope)) {
    throw new Error('Please select some text before performing this action')
  }
  return editor.state.doc.textBetween(scope.position.from, scope.position.to)
}

export const updateEditorContent = (editor: Editor, scope: Scope, text: string) => {
  if (!hasValidSelection(scope)) return
  const { from, to } = scope.position
  editor.chain().focus().deleteRange({ from, to }).insertContent(text).run()
}

export const applyVisualFeedback = (editor: Editor, scope: Scope, options?: StreamingOptions['visualFeedback']) => {
  if (!options?.mark || !hasValidSelection(scope)) return

  editor.commands.setTextSelection(scope.position)
  if (options.mark) {
    editor.commands.setMark(options.mark)
  }
}

export const removeVisualFeedback = (editor: Editor, scope: Scope, options?: StreamingOptions['visualFeedback']) => {
  if (!options?.mark || !hasValidSelection(scope)) return

  editor.commands.setTextSelection(scope.position)
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
  if (!hasValidSelection(scope)) {
    throw new Error('Please select some text before performing this action')
  }

  try {
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
      return
    }

    if (!response.body) {
      return
    }

    const reader = response.body.getReader()
    let accumulatedText = ''

    try {
      editor.commands.deleteRange(scope.position)
      let currentFrom = scope.position.from

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
                editor.commands.insertContentAt(currentFrom, data.chunk)
                currentFrom += data.chunk.length
                options?.onProgress?.(accumulatedText)
              }
            } catch (e) {
              // Silently handle JSON parsing errors
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
    // Only rethrow text selection errors
    if (error instanceof Error && error.message.includes('Please select some text')) {
      throw error
    }
  }
}
