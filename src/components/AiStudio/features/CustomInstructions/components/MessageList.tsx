import { Message } from '../hooks/useChat'
import { cn } from '@/lib/utils'
import { Bot, Copy, Check } from 'lucide-react'
import { Button } from '@/components/ui/Button'
import { useEffect, useRef, useState, useCallback } from 'react'

interface MessageListProps {
  messages: Message[]
}

export const MessageList = ({ messages }: MessageListProps) => {
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const [copiedId, setCopiedId] = useState<string | null>(null)

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }

  useEffect(() => {
    scrollToBottom()
  }, [messages])

  const handleCopy = useCallback(async (text: string, messageId: string) => {
    try {
      await navigator.clipboard.writeText(text)
      setCopiedId(messageId)
      setTimeout(() => setCopiedId(null), 3000)
    } catch (err) {
      console.error('Failed to copy text:', err)
    }
  }, [])

  const createHandleCopyClick = useCallback(
    (message: Message) => () => {
      handleCopy(message.content, message.id)
    },
    [handleCopy],
  )

  if (messages.length === 0) {
    return (
      <div className="flex-1 flex items-center justify-center p-6">
        <div className="flex flex-col items-center gap-3 text-center">
          <Bot className="w-8 h-8 text-neutral-400 dark:text-neutral-600" />
          <p className="text-neutral-500 dark:text-neutral-400 text-sm">
            Start a conversation to get AI-powered assistance
          </p>
        </div>
      </div>
    )
  }

  return (
    <div className="flex-1 overflow-y-auto p-4 space-y-2">
      {messages
        .filter(message => !message.isSystemSummary)
        .map(message => (
          <div key={message.id} className="group min-w-0">
            <div
              className={cn(
                'px-4 py-3 text-sm w-full rounded-[4px]',
                message.role === 'user'
                  ? 'bg-blue-50 dark:bg-blue-900/30 text-blue-900 dark:text-blue-100'
                  : 'bg-emerald-50 dark:bg-emerald-900/20 text-emerald-900 dark:text-emerald-100',
              )}
            >
              <p className="whitespace-pre-wrap break-all leading-relaxed">{message.content}</p>
            </div>
            <div className="flex gap-1 mt-1 px-1 opacity-0 group-hover:opacity-100 transition-opacity">
              <Button
                variant="ghost"
                className={cn(
                  'h-6 px-2',
                  copiedId === message.id
                    ? 'text-green-600 dark:text-green-500 hover:text-green-600 dark:hover:text-green-500'
                    : 'text-neutral-500 hover:text-neutral-700 dark:text-neutral-400 dark:hover:text-neutral-200',
                )}
                onClick={createHandleCopyClick(message)}
              >
                {copiedId === message.id ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                <span className="ml-1 text-xs">{copiedId === message.id ? 'Copied!' : 'Copy'}</span>
              </Button>
            </div>
          </div>
        ))}
      <div ref={messagesEndRef} />
    </div>
  )
}
