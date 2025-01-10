import { Icon } from '@/components/ui/Icon'
import { Scope } from '@/hooks/useScope'
import { X } from 'lucide-react'

interface ScopeSelectorProps {
  className?: string
  scope: Scope
  onReset: () => void
}

export const ScopeSelector = ({ className, scope, onReset }: ScopeSelectorProps) => {
  const displayText =
    scope.type === 'full'
      ? 'Full Document'
      : scope.position
        ? `(${scope.position.from} → ${scope.position.to})`
        : 'Selection'

  return (
    <div className="inline-flex items-center gap-1 text-xs font-medium">
      <span className="text-neutral-500">Scope @ </span>
      <span className="text-neutral-900 dark:text-white">{displayText}</span>
      {scope.type === 'selection' && (
        <button
          onClick={onReset}
          className="inline-flex items-center justify-center text-neutral-400 hover:text-neutral-500 dark:text-neutral-500 dark:hover:text-neutral-400"
        >
          <X className="w-3 h-3" />
        </button>
      )}
    </div>
  )
}
