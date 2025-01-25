import { Button } from '@/components/ui/Button'
import { cn } from '@/lib/utils'
import { Scope } from '@/hooks/useScope'
import { Brackets, X } from 'lucide-react'
import * as Popover from '@radix-ui/react-popover'

interface ScopeSelectorProps {
  className?: string
  scope: Scope
  onReset: () => void
}

export const ScopeSelector = ({ className, scope, onReset }: ScopeSelectorProps) => {
  const displayText = scope.position.text ? `${scope.position.from} → ${scope.position.to}` : '0 → 0'

  return (
    <Popover.Root>
      <Popover.Trigger asChild>
        <button type="button" className="flex items-center gap-1 text-xs font-medium leading-none group">
          <Brackets className="w-3.5 h-3.5 text-neutral-500 group-hover:text-neutral-700 dark:group-hover:text-neutral-300" />
          <span className="text-neutral-900 dark:text-white group-hover:text-neutral-700 dark:group-hover:text-neutral-300">
            {displayText}
          </span>
        </button>
      </Popover.Trigger>
      <Popover.Portal>
        <Popover.Content
          align="end"
          side="top"
          sideOffset={8}
          className={cn(
            'w-[280px] p-4',
            'bg-white dark:bg-neutral-900 rounded-lg',
            'shadow-lg border border-neutral-200 dark:border-neutral-800',
            'focus:outline-none select-none z-[9999]',
          )}
        >
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <h3 className="text-sm font-medium text-neutral-900 dark:text-white">Scope</h3>
              <Popover.Close className="w-6 h-6 rounded-md hover:bg-neutral-100 dark:hover:bg-neutral-800 focus:outline-none flex items-center justify-center">
                <X className="w-4 h-4 text-neutral-500" />
              </Popover.Close>
            </div>
            <p className="text-xs text-neutral-500 dark:text-neutral-400">
              Select text in the editor with (@) button to define the scope of AI actions. The scope determines which
              part of your text will be affected.
            </p>
            <div className="flex flex-col gap-2">
              <div className="flex items-center justify-between gap-3">
                <span className="text-sm text-neutral-900 dark:text-white">Current Selection</span>
                {scope.position.text && (
                  <button
                    onClick={onReset}
                    className="px-1.5 py-0.5 text-[12px] font-medium rounded bg-neutral-500 hover:bg-neutral-600 text-white shrink-0 transition-colors"
                  >
                    Clear
                  </button>
                )}
              </div>
              <div className="flex items-center justify-between px-2 py-1.5 bg-neutral-100 dark:bg-neutral-800 rounded">
                <span className="text-xs text-neutral-500 dark:text-neutral-400">Position</span>
                <span className="text-xs font-medium text-neutral-900 dark:text-white">{displayText}</span>
              </div>
              <div className="flex items-center justify-between px-2 py-1.5 bg-neutral-100 dark:bg-neutral-800 rounded">
                <span className="text-xs text-neutral-500 dark:text-neutral-400">Characters</span>
                <span className="text-xs font-medium text-neutral-900 dark:text-white">
                  {scope.position.text ? scope.position.text.length : 0} / 1000
                </span>
              </div>
            </div>
          </div>
        </Popover.Content>
      </Popover.Portal>
    </Popover.Root>
  )
}
