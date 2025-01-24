import { Surface } from '../../ui/Surface'

interface Message {
  id: string
  content: string
  isUser: boolean
  timestamp: Date
}

interface MessageWindowProps {
  messages: Message[]
}

export const MessageWindow = ({ messages }: MessageWindowProps) => {
  return (
    <div className="flex-1 min-h-0">
      <div className="h-full overflow-y-auto px-2">
        <div className="space-y-4 py-4">
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
      </div>
    </div>
  )
}
