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
    <div className="flex gap-2 items-end">
      <Textarea
        value={message}
        onChange={handleChange}
        onKeyDown={handleKeyDown}
        placeholder="Type a message..."
        className="resize-none h-[40px] min-h-[40px] max-h-[40px] py-2"
        disabled={isProcessing}
      />
      <Button onClick={onSend} disabled={!message.trim() || isProcessing} variant="primary" className="flex-shrink-0">
        <Send className="w-4 h-4" />
      </Button>
    </div>
  )
}
