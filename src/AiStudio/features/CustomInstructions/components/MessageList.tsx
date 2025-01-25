import { Message } from '../hooks/useChat'
import { cn } from '@/lib/utils'

interface MessageListProps {
  messages: Message[]
}

export const MessageList = ({ messages }: MessageListProps) => {
  return (
    <div className="flex-1 overflow-y-auto p-4 space-y-4">
      {messages.map(message => (
        <div
          key={message.id}
          className={cn(
            'flex flex-col max-w-[85%] space-y-1',
            message.role === 'user' ? 'ml-auto items-end' : 'mr-auto items-start',
          )}
        >
          <div
            className={cn(
              'px-4 py-2 rounded-lg',
              message.role === 'user'
                ? 'bg-emerald-500 text-white'
                : 'bg-neutral-100 dark:bg-neutral-800 text-neutral-900 dark:text-white',
            )}
          >
            <p className="text-sm whitespace-pre-wrap">{message.content}</p>
          </div>
          <span className="text-xs text-neutral-500 dark:text-neutral-400">
            {new Date(message.timestamp).toLocaleTimeString()}
          </span>
        </div>
      ))}
    </div>
  )
}
