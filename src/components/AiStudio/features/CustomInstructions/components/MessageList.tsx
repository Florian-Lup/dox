import { Message } from '../hooks/useChat'
import { cn } from '@/lib/utils'
import { Bot, Copy, Check, XCircle } from 'lucide-react'
import { Button } from '@/components/ui/Button'
import { useState, useCallback, useRef, useEffect } from 'react'
import ReactMarkdown from 'react-markdown'
import { markdownComponents, markdownConfig, markdownStyles } from '../../../utils/markdown'

interface MessageListProps {
  messages: Message[]
  isProcessing?: boolean
  onStopProcessing?: () => void
}

export const MessageList = ({ messages, isProcessing = false, onStopProcessing }: MessageListProps) => {
  const [copiedId, setCopiedId] = useState<string | null>(null)
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const containerRef = useRef<HTMLDivElement>(null)
  const [shouldAutoScroll, setShouldAutoScroll] = useState(true)
  const lastMessageRef = useRef<string>('')

  const scrollToBottom = useCallback((behavior: ScrollBehavior = 'smooth') => {
    messagesEndRef.current?.scrollIntoView({ behavior, block: 'end' })
  }, [])

  // Handle automatic scrolling
  useEffect(() => {
    const lastMessage = messages[messages.length - 1]
    const isNewMessage = lastMessage?.content !== lastMessageRef.current

    if (isNewMessage) {
      lastMessageRef.current = lastMessage?.content || ''
    }

    if (shouldAutoScroll && isNewMessage) {
      scrollToBottom()
    }
  }, [messages, shouldAutoScroll, scrollToBottom])

  // Handle scroll events
  const handleScroll = useCallback(() => {
    if (!containerRef.current) return

    const { scrollTop, scrollHeight, clientHeight } = containerRef.current
    const isAtBottom = Math.abs(scrollHeight - clientHeight - scrollTop) < 50
    setShouldAutoScroll(isAtBottom)
  }, [])

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
    <div className="flex-1 flex flex-col min-h-0 relative">
      <div ref={containerRef} onScroll={handleScroll} className="flex-1 overflow-y-auto p-4 space-y-2 scroll-smooth">
        {messages
          .filter(message => !message.isSystemSummary)
          .map(message => (
            <div key={message.id} className="group min-w-0">
              <div
                className={cn(
                  'px-4 py-3 text-sm w-full rounded-lg',
                  message.role === 'user'
                    ? 'bg-neutral-100/80 dark:bg-neutral-800/50 text-neutral-800 dark:text-neutral-200'
                    : 'bg-neutral-50 dark:bg-neutral-900/50 text-neutral-800 dark:text-neutral-200',
                  message.role === 'assistant' && markdownStyles,
                )}
              >
                {message.role === 'user' ? (
                  <p className="whitespace-pre-wrap break-words leading-relaxed">{message.content}</p>
                ) : (
                  <ReactMarkdown {...markdownConfig} components={markdownComponents}>
                    {message.content}
                  </ReactMarkdown>
                )}
              </div>
              <div className="flex gap-1 mt-1 px-1">
                {(!isProcessing || message.role === 'user') && (
                  <div className="opacity-0 group-hover:opacity-100 transition-opacity">
                    <Button
                      variant="ghost"
                      buttonSize="small"
                      className={cn(
                        'h-6 px-2',
                        copiedId === message.id
                          ? 'text-blue-600 dark:text-blue-400'
                          : 'text-neutral-400 hover:text-neutral-600 dark:text-neutral-500 dark:hover:text-neutral-300',
                      )}
                      onClick={createHandleCopyClick(message)}
                    >
                      {copiedId === message.id ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                      <span className="ml-1 text-xs">{copiedId === message.id ? 'Copied!' : 'Copy'}</span>
                    </Button>
                  </div>
                )}
              </div>
            </div>
          ))}
        <div ref={messagesEndRef} className="pt-2" />
      </div>
      {isProcessing && onStopProcessing && (
        <div className="sticky bottom-0 p-2">
          <div className="flex justify-center">
            <Button
              variant="ghost"
              buttonSize="small"
              onClick={onStopProcessing}
              className={cn(
                'flex items-center gap-1.5 px-3 py-1.5',
                'text-red-500 hover:text-red-600 dark:text-red-400 dark:hover:text-red-300',
                'hover:bg-neutral-100 dark:hover:bg-neutral-800',
                'rounded-md transition-colors',
                'bg-white dark:bg-neutral-900',
                'shadow-sm border border-neutral-200 dark:border-neutral-800',
              )}
            >
              <XCircle className="w-4 h-4" />
              <span className="text-sm font-medium">Stop generating</span>
            </Button>
          </div>
        </div>
      )}
    </div>
  )
}
