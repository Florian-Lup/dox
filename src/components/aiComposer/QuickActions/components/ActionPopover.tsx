import { useCallback, useRef, useState, useEffect, forwardRef, useImperativeHandle } from 'react'
import { cn } from '@/lib/utils'

export interface ActionPopoverRef {
  close: () => void
}

interface ActionPopoverProps {
  id: string
  trigger: React.ReactNode
  children: React.ReactNode
  onOpen?: () => void
  onClose?: () => void
  width?: string
  maxHeight?: string
}

export const ActionPopover = forwardRef<ActionPopoverRef, ActionPopoverProps>(
  ({ id, trigger, children, onOpen, onClose, width = '350px', maxHeight }, ref) => {
    const [isOpen, setIsOpen] = useState(false)
    const popoverRef = useRef<HTMLDivElement>(null)
    const triggerRef = useRef<HTMLDivElement>(null)

    useImperativeHandle(ref, () => ({
      close: () => {
        setIsOpen(false)
        onClose?.()
      },
    }))

    const handleTriggerClick = useCallback(
      (e: React.MouseEvent) => {
        e.stopPropagation()
        if (!isOpen) {
          onOpen?.()
        } else {
          onClose?.()
        }
        setIsOpen(!isOpen)
      },
      [isOpen, onOpen, onClose],
    )

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

    return (
      <div className="relative inline-block">
        <div ref={triggerRef} onClick={handleTriggerClick}>
          {trigger}
        </div>
        {isOpen && (
          <div
            ref={popoverRef}
            className={cn(
              'absolute z-50 mt-2 transform -translate-x-1/2 left-1/2',
              'bg-white dark:bg-neutral-900 rounded-lg shadow-lg border border-neutral-200 dark:border-neutral-800',
            )}
          >
            <div
              className={cn('p-4', maxHeight && 'overflow-y-auto')}
              style={{ width, ...(maxHeight ? { maxHeight } : {}) }}
            >
              {children}
            </div>
          </div>
        )}
      </div>
    )
  },
)

ActionPopover.displayName = 'ActionPopover'

// Helper components for consistent layouts
export const PopoverHeader = ({ title, children }: { title: string; children?: React.ReactNode }) => (
  <div className="w-[95%] flex justify-between items-center">
    <span className="text-sm font-medium text-neutral-900 dark:text-white pl-[10px]">{title}</span>
    <div className="flex items-center gap-2">{children}</div>
  </div>
)

export const PopoverContent = ({ children }: { children: React.ReactNode }) => (
  <div className="space-y-4 flex flex-col items-center">{children}</div>
)
