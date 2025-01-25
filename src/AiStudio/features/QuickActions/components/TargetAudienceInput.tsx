import { useState, useCallback, useRef } from 'react'
import { Check } from 'lucide-react'
import { Button } from '@/components/ui/Button'
import { cn } from '@/lib/utils'
import { ActionPopover, PopoverHeader, PopoverContent, ActionPopoverRef } from './ActionPopover'

interface TargetAudienceInputProps {
  trigger: React.ReactNode
  onValueChange?: (value: string) => void
  onTargetAudienceSelect?: (audience: string) => void
  onOpen?: () => void
  onClose?: () => void
}

export const TargetAudienceInput = ({
  trigger,
  onValueChange,
  onTargetAudienceSelect,
  onOpen,
  onClose,
}: TargetAudienceInputProps) => {
  const [audience, setAudience] = useState('')
  const popoverRef = useRef<ActionPopoverRef>(null)

  const handleValueChange = useCallback(
    (newValue: string) => {
      setAudience(newValue)
      onValueChange?.(newValue)
    },
    [onValueChange],
  )

  const handleConfirm = useCallback(() => {
    const trimmedAudience = audience.trim()
    if (!trimmedAudience) return
    onTargetAudienceSelect?.(trimmedAudience)
    popoverRef.current?.close()
  }, [audience, onTargetAudienceSelect])

  const handleTextareaChange = useCallback(
    (e: React.ChangeEvent<HTMLTextAreaElement>) => {
      handleValueChange(e.target.value)
    },
    [handleValueChange],
  )

  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent) => {
      if (e.key === 'Enter' && !e.shiftKey) {
        e.preventDefault()
        handleConfirm()
      }
    },
    [handleConfirm],
  )

  return (
    <ActionPopover ref={popoverRef} id="audience" trigger={trigger} onOpen={onOpen} onClose={onClose}>
      <PopoverContent>
        <PopoverHeader title="Target Audience">
          <Button
            variant="ghost"
            buttonSize="icon"
            disabled={!audience.trim()}
            className={cn(
              'relative h-7 w-7 transition-colors rounded-full',
              !audience.trim()
                ? 'text-neutral-300 dark:text-neutral-600 hover:text-neutral-300 dark:hover:text-neutral-600 cursor-not-allowed'
                : 'text-emerald-500 hover:text-emerald-600 hover:bg-emerald-50 dark:text-emerald-400 dark:hover:text-emerald-300 dark:hover:bg-emerald-950 before:absolute before:inset-0 before:rounded-full before:border-2 before:border-t-emerald-500 before:border-r-emerald-500 before:border-b-transparent before:border-l-transparent dark:before:border-t-emerald-400 dark:before:border-r-emerald-400 before:animate-[spin_1s_linear_infinite]',
            )}
            onClick={handleConfirm}
          >
            <Check className="h-4 w-4 relative" />
          </Button>
        </PopoverHeader>
        <div className="w-[95%]">
          <textarea
            value={audience}
            onChange={handleTextareaChange}
            onKeyDown={handleKeyDown}
            placeholder="Describe your target audience (e.g., 'technical professionals', 'high school students', 'marketing executives')"
            className="w-full h-24 px-3 py-2 text-sm bg-transparent border border-neutral-200 dark:border-neutral-800 rounded-md focus:outline-none focus:ring-2 focus:ring-emerald-500 dark:focus:ring-emerald-400 resize-none"
          />
          <div className="flex justify-between text-xs text-neutral-500 dark:text-neutral-400 mt-4 px-[10px]">
            <span>Press Enter to confirm</span>
            <span>Shift + Enter for new line</span>
          </div>
        </div>
      </PopoverContent>
    </ActionPopover>
  )
}
