import { ReactNode } from 'react'
import { Icon } from '@/components/ui/Icon'
import { Toolbar } from '@/components/ui/Toolbar'
import { icons } from 'lucide-react'
import { cn } from '@/lib/utils'
import * as Menu from '@/components/ui/PopoverMenu'

export interface SidebarButtonProps {
  tooltip: string
  icon: keyof typeof icons
  title: string
  description: string
  children?: ReactNode
  isOpen?: boolean
  isLoading?: boolean
  onOpenChange?: (open: boolean) => void
}

export const SidebarButton = ({
  tooltip,
  icon,
  title,
  description,
  children,
  isOpen,
  isLoading,
  onOpenChange,
}: SidebarButtonProps) => {
  return (
    <Menu.Menu
      trigger={
        <Toolbar.Button tooltip={tooltip} variant="secondary">
          <Icon name={icon} className={cn('w-5 h-5', isLoading && 'animate-spin')} />
        </Toolbar.Button>
      }
      align="center"
      isOpen={isOpen}
      onOpenChange={onOpenChange}
    >
      <div className="space-y-3">
        <div>
          <h3 className="text-base font-medium text-neutral-900 dark:text-neutral-100">{title}</h3>
          <p className="text-sm text-neutral-500 dark:text-neutral-400">{description}</p>
        </div>
        {children}
      </div>
    </Menu.Menu>
  )
}
