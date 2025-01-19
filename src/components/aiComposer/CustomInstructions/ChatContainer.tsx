import { useCallback, useState } from 'react'
import { v4 as uuidv4 } from 'uuid'
import { LLMModel } from '../core/ModelSelector'
import { MessageWindow } from './MessageWindow'
import { InputArea } from './InputArea'

interface Message {
  id: string
  content: string
  isUser: boolean
  timestamp: Date
}

interface ChatContainerProps {
  selectedModel: LLMModel
}

export const ChatContainer = ({ selectedModel }: ChatContainerProps) => {
  const [message, setMessage] = useState('')
  const [messages, setMessages] = useState<Message[]>([])
  const [isProcessing, setIsProcessing] = useState(false)

  const handleSend = useCallback(async () => {
    if (!message.trim() || isProcessing) return

    // Add user message
    const userMessage: Message = {
      id: uuidv4(),
      content: message.trim(),
      isUser: true,
      timestamp: new Date(),
    }
    setMessages(prev => [...prev, userMessage])
    setMessage('')
    setIsProcessing(true)

    try {
      const response = await fetch('/api/ai/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          message,
          modelName: selectedModel.id,
        }),
      })

      if (!response.ok) {
        throw new Error('Failed to send message')
      }

      const data = await response.json()

      // Add AI response
      const aiMessage: Message = {
        id: uuidv4(),
        content: data.message,
        isUser: false,
        timestamp: new Date(),
      }
      setMessages(prev => [...prev, aiMessage])
    } catch (error) {
      console.error('Error processing message:', error)
    } finally {
      setIsProcessing(false)
    }
  }, [message, isProcessing, selectedModel.id])

  return (
    <div className="flex flex-col h-full gap-4">
      <MessageWindow messages={messages} />
      <div className="flex-shrink-0 px-2">
        <InputArea message={message} isProcessing={isProcessing} onMessageChange={setMessage} onSend={handleSend} />
      </div>
    </div>
  )
}
