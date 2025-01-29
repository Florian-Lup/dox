import { useState, useCallback } from 'react'
import { LLMModel } from '../../../core/ai/components/ModelSelector'

export interface Message {
  id: string
  role: 'user' | 'assistant'
  content: string
  timestamp: number
}

interface UseChatProps {
  selectedModel: LLMModel
  temperature?: number
}

export const useChat = ({ selectedModel, temperature = 0.5 }: UseChatProps) => {
  const [messages, setMessages] = useState<Message[]>([])
  const [isLoading, setIsLoading] = useState(false)

  const sendMessage = useCallback(
    async (content: string) => {
      if (!content.trim()) return

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
            history: messages.map(msg => ({
              role: msg.role,
              content: msg.content,
            })),
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
                  setMessages(prev => {
                    const lastMessage = prev[prev.length - 1]
                    if (lastMessage.role === 'assistant') {
                      return [...prev.slice(0, -1), { ...lastMessage, content: lastMessage.content + data.chunk }]
                    }
                    return prev
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
    [selectedModel.id, temperature, messages],
  )

  const clearMessages = useCallback(() => {
    setMessages([])
  }, [])

  return {
    messages,
    isLoading,
    sendMessage,
    clearMessages,
  }
}
