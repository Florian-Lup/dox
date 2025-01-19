import { Send } from 'lucide-react'
import { useCallback, useState } from 'react'
import { Button } from '../ui/Button'
import { Textarea } from '../ui/Textarea'
import { Surface } from '../ui/Surface'
import { v4 as uuidv4 } from 'uuid'
import { LLMModel } from './ModelSelector'

interface Message {
  id: string
  content: string
  isUser: boolean
  timestamp: Date
}

interface CustomInstructionsProps {
  selectedModel: LLMModel
}

export const CustomInstructions = ({ selectedModel }: CustomInstructionsProps) => {
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

  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
      if (e.key === 'Enter' && !e.shiftKey) {
        e.preventDefault()
        handleSend()
      }
    },
    [handleSend],
  )

  const handleChange = useCallback((e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setMessage(e.target.value)
  }, [])

  return (
    <div className="flex flex-col h-full">
      <div className="flex-1 overflow-auto space-y-4 mb-4">
        {messages.map(msg => (
          <div key={msg.id} className={`flex ${msg.isUser ? 'justify-end' : 'justify-start'}`}>
            <Surface
              className={`max-w-[85%] p-3 rounded-lg ${
                msg.isUser ? 'bg-blue-500 text-white' : 'bg-neutral-100 dark:bg-neutral-800'
              }`}
            >
              <div className="text-sm whitespace-pre-wrap break-words">{msg.content}</div>
              <div className="text-xs mt-1 opacity-70">
                {msg.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
              </div>
            </Surface>
          </div>
        ))}
      </div>

      <div className="flex gap-2 items-end">
        <Textarea
          value={message}
          onChange={handleChange}
          onKeyDown={handleKeyDown}
          placeholder="Type a message..."
          className="resize-none"
          disabled={isProcessing}
        />
        <Button
          onClick={handleSend}
          disabled={!message.trim() || isProcessing}
          variant="primary"
          className="flex-shrink-0"
        >
          <Send className="w-4 h-4" />
        </Button>
      </div>
    </div>
  )
}
