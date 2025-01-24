import { Send } from 'lucide-react'
import { useCallback } from 'react'
import { Button } from '../../ui/Button'
import { Textarea } from '../../ui/Textarea'

interface InputAreaProps {
  message: string
  isProcessing: boolean
  onMessageChange: (message: string) => void
  onSend: () => void
}

export const InputArea = ({ message, isProcessing, onMessageChange, onSend }: InputAreaProps) => {
  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
      if (e.key === 'Enter' && !e.shiftKey) {
        e.preventDefault()
        onSend()
      }
    },
    [onSend],
  )

  const handleChange = useCallback(
    (e: React.ChangeEvent<HTMLTextAreaElement>) => {
      onMessageChange(e.target.value)
    },
    [onMessageChange],
  )

  return (
    <div className="border-t border-neutral-200 dark:border-neutral-800 px-0 py-2">
      <div className="flex gap-2 items-end">
        <Textarea
          value={message}
          onChange={handleChange}
          onKeyDown={handleKeyDown}
          placeholder="Type a message..."
          className="resize-none min-h-[44px] max-h-[44px] py-2 px-2 text-sm flex-1"
          disabled={isProcessing}
        />
        <Button
          onClick={onSend}
          disabled={!message.trim() || isProcessing}
          variant="primary"
          buttonSize="iconSmall"
          className="flex-shrink-0 h-[44px] w-[44px]"
        >
          <Send className="w-5 h-5" />
        </Button>
      </div>
    </div>
  )
}
