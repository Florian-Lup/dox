import { Button } from '@/components/ui/Button'
import { Tooltip } from '@/components/ui/Tooltip'
import { Scope } from '@/hooks/useScope'
import { X } from 'lucide-react'

interface ScopeSelectorProps {
  className?: string
  scope: Scope
  onReset: () => void
}

export const ScopeSelector = ({ className, scope, onReset }: ScopeSelectorProps) => {
  const displayText = scope.position.text ? `(${scope.position.from} → ${scope.position.to})` : 'Select Text'

  return (
    <Tooltip title="The text range that will be affected by AI actions">
      <div className="inline-flex items-center gap-1 text-xs font-medium leading-none">
        <span className="text-neutral-500">Scope @ </span>
        <span className="text-neutral-900 dark:text-white">{displayText}</span>
        {scope.position.text && (
          <Button
            onClick={onReset}
            variant="ghost"
            buttonSize="iconSmall"
            className="text-neutral-400 hover:text-neutral-500 dark:text-neutral-500 dark:hover:text-neutral-400 -my-1"
          >
            <X className="w-3 h-3" />
          </Button>
        )}
      </div>
    </Tooltip>
  )
}
