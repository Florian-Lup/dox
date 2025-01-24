import { useState, useCallback, useRef, useEffect } from 'react'
import { Check } from 'lucide-react'
import { Button } from '../../../ui/Button'
import { cn } from '@/lib/utils'

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
  const [isOpen, setIsOpen] = useState(false)
  const popoverRef = useRef<HTMLDivElement>(null)
  const triggerRef = useRef<HTMLDivElement>(null)
  const inputRef = useRef<HTMLTextAreaElement>(null)

  const handleValueChange = useCallback(
    (newValue: string) => {
      setAudience(newValue)
      onValueChange?.(newValue)
    },
    [onValueChange],
  )

  const handleConfirm = useCallback(
    (e?: React.MouseEvent | React.KeyboardEvent) => {
      e?.preventDefault()
      e?.stopPropagation()
      const trimmedAudience = audience.trim()
      if (!trimmedAudience) return
      onTargetAudienceSelect?.(trimmedAudience)
      setIsOpen(false)
      onClose?.()
    },
    [audience, onTargetAudienceSelect, onClose],
  )

  const handleTriggerClick = useCallback(
    (e: React.MouseEvent) => {
      e.preventDefault()
      e.stopPropagation()
      if (!isOpen) {
        setAudience('')
        onValueChange?.('')
        onOpen?.()
      } else {
        onClose?.()
      }
      setIsOpen(!isOpen)
    },
    [isOpen, onValueChange, onOpen, onClose],
  )

  const handleTextareaChange = useCallback(
    (e: React.ChangeEvent<HTMLTextAreaElement>) => {
      e.stopPropagation()
      handleValueChange(e.target.value)
    },
    [handleValueChange],
  )

  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent) => {
      e.stopPropagation()
      if (e.key === 'Enter' && !e.shiftKey) {
        handleConfirm(e)
      }
    },
    [handleConfirm],
  )

  const handleContainerClick = useCallback((e: React.MouseEvent) => {
    e.stopPropagation()
  }, [])

  const handlePopoverClick = useCallback((e: React.MouseEvent) => {
    e.stopPropagation()
  }, [])

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as Node
      if (
        popoverRef.current &&
        !popoverRef.current.contains(target) &&
        triggerRef.current &&
        !triggerRef.current.contains(target)
      ) {
        setIsOpen(false)
        onClose?.()
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [onClose])

  useEffect(() => {
    if (isOpen && inputRef.current) {
      // Delay focus to prevent scroll issues
      setTimeout(() => {
        inputRef.current?.focus()
      }, 100)
    }
  }, [isOpen])

  return (
    <div className="relative inline-block" onClick={handleContainerClick}>
      <div ref={triggerRef} onClick={handleTriggerClick}>
        {trigger}
      </div>
      {isOpen && (
        <div
          ref={popoverRef}
          className="absolute z-50 mt-2 transform -translate-x-1/2 left-1/2 bg-white dark:bg-neutral-900 rounded-lg shadow-lg border border-neutral-200 dark:border-neutral-800"
          onClick={handlePopoverClick}
        >
          <div className="w-[350px] p-4">
            <div className="space-y-4 flex flex-col items-center">
              <div className="w-[95%] flex justify-between items-center">
                <span className="text-sm font-medium text-neutral-900 dark:text-white pl-[10px]">Target Audience</span>
                <div className="flex items-center gap-2">
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
                </div>
              </div>
              <div className="w-[95%]">
                <textarea
                  ref={inputRef}
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
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
