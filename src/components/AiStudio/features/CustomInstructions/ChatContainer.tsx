import { LLMModel } from '../../core/ai/components/ModelSelector'
import { useChat } from './hooks/useChat'
import { MessageList } from './components/MessageList'
import { ChatInput } from './components/ChatInput'
import { cn } from '@/lib/utils'

interface ChatContainerProps {
  selectedModel: LLMModel
  temperature?: number
  className?: string
}

export const ChatContainer = ({ selectedModel, temperature = 0.5, className }: ChatContainerProps) => {
  const { messages, isLoading, sendMessage, clearMessages } = useChat({ selectedModel, temperature })

  return (
    <div
      className={cn(
        'flex flex-col h-full border border-neutral-200 dark:border-neutral-800',
        'bg-white dark:bg-neutral-900 overflow-hidden',
        className,
      )}
    >
      <MessageList messages={messages} />
      <ChatInput onSend={sendMessage} isLoading={isLoading} onClear={clearMessages} />
    </div>
  )
}
