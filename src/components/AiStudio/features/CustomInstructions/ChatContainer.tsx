import { LLMModel } from '../../core/ai/components/ModelSelector'
import { useChat } from './hooks/useChat'
import { MessageList } from './components/MessageList'
import { ChatInput } from './components/ChatInput'

interface ChatContainerProps {
  selectedModel: LLMModel
}

export const ChatContainer = ({ selectedModel }: ChatContainerProps) => {
  const { messages, isLoading, sendMessage, clearMessages } = useChat({ selectedModel })

  return (
    <div className="flex flex-col h-full">
      <MessageList messages={messages} />
      <ChatInput onSend={sendMessage} isLoading={isLoading} onClear={clearMessages} />
    </div>
  )
}
