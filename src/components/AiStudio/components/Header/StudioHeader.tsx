import { X } from 'lucide-react'
import { Button } from '@/components/ui/Button'
import { Toggle } from '@/components/ui/Toggle'

interface StudioHeaderProps {
  onClose: () => void
  activeTab: 'quick' | 'advanced'
  onTabChange: (isAdvanced: boolean) => void
}

export const StudioHeader = ({ onClose, activeTab, onTabChange }: StudioHeaderProps) => {
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
          Custom Instructions
        </div>
      </div>
      <Button variant="ghost" buttonSize="iconSmall" onClick={onClose}>
        <X className="w-4 h-4" />
      </Button>
    </div>
  )
}
