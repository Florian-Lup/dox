import { useState, useCallback, useEffect } from 'react'
import { LLMModel } from '../../../core/ai/components/ModelSelector'

export interface Message {
  id: string
  role: 'user' | 'assistant' | 'system'
  content: string
  timestamp: number
  tags?: string[]
  isSystemSummary?: boolean
}

interface UseChatProps {
  selectedModel: LLMModel
  temperature?: number
}

export const useChat = ({ selectedModel, temperature = 0.5 }: UseChatProps) => {
  const [messages, setMessages] = useState<Message[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [sessionId, setSessionId] = useState<string>('')

  // Initialize session ID
  useEffect(() => {
    setSessionId(crypto.randomUUID())
  }, [])

  const sendMessage = useCallback(
    async (content: string) => {
      if (!content.trim() || !sessionId) return

      const userMessage: Message = {
        id: crypto.randomUUID(),
        role: 'user',
        content,
        timestamp: Date.now(),
      }

      setMessages(prev => [...prev, userMessage])
      setIsLoading(true)

      try {
        const response = await fetch('/api/ai/chat', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            message: content,
            modelName: selectedModel.id,
            temperature,
            sessionId,
          }),
        })

        if (!response.ok) throw new Error('Failed to send message')

        const reader = response.body?.getReader()
        if (!reader) throw new Error('No response body')

        const assistantMessage: Message = {
          id: crypto.randomUUID(),
          role: 'assistant',
          content: '',
          timestamp: Date.now(),
        }

        setMessages(prev => [...prev, assistantMessage])

        let accumulatedChunks = ''

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
                  accumulatedChunks += data.chunk
                  setMessages(prev => {
                    const lastMessage = prev[prev.length - 1]
                    if (lastMessage.role === 'assistant') {
                      return [...prev.slice(0, -1), { ...lastMessage, content: accumulatedChunks }]
                    }
                    return prev
                  })
                }

                // Handle system summaries
                if (data.type === 'system' && data.summary) {
                  const summaryMessage: Message = {
                    id: crypto.randomUUID(),
                    role: 'system',
                    content: data.summary,
                    timestamp: Date.now(),
                    isSystemSummary: true,
                  }
                  setMessages(prev => [...prev, summaryMessage])
                }

                // Handle tags
                if (data.tags) {
                  setMessages(prev => {
                    const lastMessage = prev[prev.length - 1]
                    return [...prev.slice(0, -1), { ...lastMessage, tags: data.tags }]
                  })
                }
              } catch (e) {
                // Silently handle JSON parsing errors
              }
            }
          }
        }
      } catch (error) {
        console.error('Chat error:', error)
      } finally {
        setIsLoading(false)
      }
    },
    [selectedModel.id, temperature, sessionId],
  )

  const clearMessages = useCallback(() => {
    setMessages([])
    // Generate new session ID when clearing messages
    setSessionId(crypto.randomUUID())
  }, [])

  return {
    messages,
    isLoading,
    sendMessage,
    clearMessages,
    sessionId,
  }
}
