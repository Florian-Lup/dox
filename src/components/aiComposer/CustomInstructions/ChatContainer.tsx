import { useCallback, useState } from 'react'
import { v4 as uuidv4 } from 'uuid'
import { LLMModel } from '../ModelSelector'
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
      // TODO: Implement actual AI response logic here using selectedModel
      // For now, just simulate a response after a delay
      await new Promise(resolve => setTimeout(resolve, 1000))

      // Add AI response
      const aiMessage: Message = {
        id: uuidv4(),
        content: 'This is a placeholder response. AI integration coming soon!',
        isUser: false,
        timestamp: new Date(),
      }
      setMessages(prev => [...prev, aiMessage])
    } catch (error) {
      console.error('Error processing message:', error)
    } finally {
      setIsProcessing(false)
    }
  }, [message, isProcessing])

  return (
    <div className="flex flex-col h-full gap-4">
      <MessageWindow messages={messages} />
      <div className="flex-shrink-0 px-2">
        <InputArea message={message} isProcessing={isProcessing} onMessageChange={setMessage} onSend={handleSend} />
      </div>
    </div>
  )
}
