import { useState, useCallback, useRef, useEffect } from 'react'
import { ArrowUp, Loader2, XCircle } from 'lucide-react'
import { cn } from '@/lib/utils'
import * as Popover from '@radix-ui/react-popover'
import { Button } from '@/components/ui/Button'

interface ChatInputProps {
  onSend: (message: string) => void
  onClear: () => void
  isLoading: boolean
  onStopGenerating?: () => void
}

export const ChatInput = ({ onSend, onClear, isLoading, onStopGenerating }: ChatInputProps) => {
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
    <div className="flex flex-col">
      {/* Stop Generation Popover */}
      {isLoading && onStopGenerating && (
        <Popover.Root defaultOpen={true}>
          <Popover.Trigger asChild>
            <div className="h-0 flex justify-center">
              <div className="w-1 h-1 -translate-y-2" />
            </div>
          </Popover.Trigger>
          <Popover.Portal>
            <Popover.Content
              side="top"
              align="center"
              sideOffset={8}
              className={cn(
                'z-50 rounded-lg shadow-lg',
                'bg-white dark:bg-neutral-900',
                'border border-neutral-200 dark:border-neutral-800',
                'animate-in fade-in-0 zoom-in-95',
                'data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=closed]:zoom-out-95',
                'data-[side=top]:slide-in-from-bottom-2',
              )}
            >
              <div className="p-2">
                <Button
                  variant="ghost"
                  buttonSize="small"
                  onClick={onStopGenerating}
                  className={cn(
                    'flex items-center gap-1.5 px-3 py-1.5',
                    'text-red-500 hover:text-red-600 dark:text-red-400 dark:hover:text-red-300',
                    'hover:bg-neutral-100 dark:hover:bg-neutral-800',
                    'rounded-md transition-colors',
                  )}
                >
                  <XCircle className="w-4 h-4" />
                  <span className="text-sm font-medium">Stop generating</span>
                </Button>
              </div>
              <Popover.Arrow className="fill-white dark:fill-neutral-900" />
            </Popover.Content>
          </Popover.Portal>
        </Popover.Root>
      )}

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
    </div>
  )
}
