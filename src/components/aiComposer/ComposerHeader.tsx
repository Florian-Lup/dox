import { X } from 'lucide-react'
import { Button } from '../ui/Button'
import { Toggle } from '../ui/Toggle'

interface ComposerHeaderProps {
  onClose: () => void
  activeTab: 'quick' | 'advanced'
  onTabChange: (isAdvanced: boolean) => void
}

export const ComposerHeader = ({ onClose, activeTab, onTabChange }: ComposerHeaderProps) => {
  return (
    <div className="flex items-center justify-between p-4 border-b border-neutral-200 dark:border-neutral-800">
      <div className="flex items-center justify-center gap-3">
        <div
          className={`text-sm font-medium transition-colors ${
            activeTab === 'quick' ? 'text-neutral-900 dark:text-white' : 'text-neutral-500 dark:text-neutral-400'
          }`}
        >
          Quick Actions
        </div>
        <Toggle active={activeTab === 'advanced'} onChange={onTabChange} size="small" />
        <div
          className={`text-sm font-medium transition-colors ${
            activeTab === 'advanced' ? 'text-neutral-900 dark:text-white' : 'text-neutral-500 dark:text-neutral-400'
          }`}
        >
          Advanced Tools
        </div>
      </div>
      <Button variant="ghost" buttonSize="iconSmall" onClick={onClose}>
        <X className="w-4 h-4" />
      </Button>
    </div>
  )
}
