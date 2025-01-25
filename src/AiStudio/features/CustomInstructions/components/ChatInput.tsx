import { useState, useCallback } from 'react'
import { Button } from '@/components/ui/Button'
import { Send, Loader2, Trash2 } from 'lucide-react'

interface ChatInputProps {
  onSend: (message: string) => void
  onClear: () => void
  isLoading: boolean
}

export const ChatInput = ({ onSend, onClear, isLoading }: ChatInputProps) => {
  const [message, setMessage] = useState('')

  const handleSend = useCallback(() => {
    if (!message.trim() || isLoading) return
    onSend(message)
    setMessage('')
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
    <div className="flex flex-col gap-2 p-4 border-t border-neutral-200 dark:border-neutral-800">
      <div className="flex gap-2">
        <textarea
          value={message}
          onChange={handleChange}
          onKeyDown={handleKeyDown}
          placeholder="Type your message..."
          className="flex-1 min-h-[80px] p-2 text-sm bg-transparent border border-neutral-200 dark:border-neutral-800 rounded-md focus:outline-none focus:ring-2 focus:ring-emerald-500 dark:focus:ring-emerald-400 resize-none"
          disabled={isLoading}
        />
        <div className="flex flex-col gap-2">
          <Button
            onClick={handleSend}
            disabled={!message.trim() || isLoading}
            className="bg-emerald-500 hover:bg-emerald-600 text-white"
          >
            {isLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Send className="w-4 h-4" />}
          </Button>
          <Button onClick={onClear} variant="ghost" className="text-neutral-500">
            <Trash2 className="w-4 h-4" />
          </Button>
        </div>
      </div>
      <div className="flex justify-between text-xs text-neutral-500 dark:text-neutral-400 px-2">
        <span>Press Enter to send</span>
        <span>Shift + Enter for new line</span>
      </div>
    </div>
  )
}
