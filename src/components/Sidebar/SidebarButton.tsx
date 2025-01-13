import { ReactNode } from 'react'
import * as Popover from '@radix-ui/react-popover'
import { Icon } from '@/components/ui/Icon'
import { Toolbar } from '@/components/ui/Toolbar'
import { icons } from 'lucide-react'
import { cn } from '@/lib/utils'

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
    <Popover.Root open={isOpen} onOpenChange={onOpenChange}>
      <Popover.Trigger asChild>
        <Toolbar.Button tooltip={tooltip} variant="secondary">
          <Icon name={icon} className={cn('w-5 h-5', isLoading && 'animate-spin')} />
        </Toolbar.Button>
      </Popover.Trigger>
      <Popover.Portal>
        <Popover.Content
          className="z-[150] w-80 p-4 ml-2 bg-white rounded-lg shadow-lg dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 animate-in fade-in-0 zoom-in-95"
          sideOffset={15}
          alignOffset={-20}
          align="end"
        >
          <div className="space-y-3">
            <div>
              <h3 className="text-base font-medium text-neutral-900 dark:text-neutral-100">{title}</h3>
              <p className="text-sm text-neutral-500 dark:text-neutral-400">{description}</p>
            </div>
            {children}
          </div>
        </Popover.Content>
      </Popover.Portal>
    </Popover.Root>
  )
}
