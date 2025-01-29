import { useState, useCallback, useRef, useEffect } from 'react'
import { ArrowUp, Loader2 } from 'lucide-react'
import { cn } from '@/lib/utils'

interface ChatInputProps {
  onSend: (message: string) => void
  onClear: () => void
  isLoading: boolean
}

export const ChatInput = ({ onSend, onClear, isLoading }: ChatInputProps) => {
  const [message, setMessage] = useState('')
  const textareaRef = useRef<HTMLTextAreaElement>(null)

  const adjustHeight = () => {
    const textarea = textareaRef.current
    if (textarea) {
      textarea.style.height = 'auto'
      const newHeight = Math.min(textarea.scrollHeight, 200) // Max height of 200px
      textarea.style.height = `${Math.max(50, newHeight)}px` // Min height of 50px
    }
  }

  useEffect(() => {
    adjustHeight()
  }, [message])

  const handleSend = useCallback(() => {
    if (!message.trim() || isLoading) return
    onSend(message)
    setMessage('')
    // Reset height after sending
    if (textareaRef.current) {
      textareaRef.current.style.height = '50px'
    }
  }, [message, isLoading, onSend])

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
    <div className="p-2 border-t border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900">
      <div className="bg-neutral-100 dark:bg-neutral-800 rounded-[4px] overflow-hidden">
        <textarea
          ref={textareaRef}
          value={message}
          onChange={handleChange}
          onKeyDown={handleKeyDown}
          placeholder="Type your message..."
          className={cn(
            'w-full p-3 text-sm',
            'bg-transparent',
            'border-none',
            'placeholder:text-neutral-500 dark:placeholder:text-neutral-400',
            'focus:outline-none',
            'disabled:opacity-50 disabled:cursor-not-allowed',
            'resize-none break-all overflow-x-hidden transition-[height]',
          )}
          disabled={isLoading}
        />
        <div className="flex items-center justify-between px-3 py-2">
          <div className="flex items-center gap-2">{/* Space for future buttons */}</div>
          <button
            onClick={handleSend}
            disabled={!message.trim() || isLoading}
            className={cn(
              'flex items-center justify-center',
              'rounded-full',
              'w-8 h-8',
              'bg-blue-500',
              'enabled:hover:bg-blue-600',
              'enabled:active:bg-blue-700',
              'disabled:bg-neutral-200 dark:disabled:bg-neutral-700',
              'disabled:cursor-not-allowed',
              'transition-all duration-200',
              'transform enabled:hover:scale-105 enabled:active:scale-95',
              'text-white disabled:text-neutral-400',
              'shadow-sm enabled:hover:shadow-md',
            )}
            aria-label="Send message"
          >
            {isLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : <ArrowUp className="w-4 h-4" />}
          </button>
        </div>
      </div>
    </div>
  )
}
