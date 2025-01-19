import * as Popover from '@radix-ui/react-popover'
import { cn } from '@/lib/utils'
import { icons } from 'lucide-react'
import { forwardRef } from 'react'
import { Surface } from './Surface'
import { Toolbar } from './Toolbar'

export const Trigger = Popover.Trigger
export const Portal = Popover.Portal

/**
 * Props for the Menu component
 * @property {React.ReactNode} children - Content to render inside the menu
 * @property {React.ReactNode} trigger - Element that triggers the menu
 * @property {string} triggerClassName - Additional classes for the trigger
 * @property {boolean} customTrigger - Whether to use a custom trigger element
 * @property {boolean} isOpen - Control the menu's open state
 * @property {(state: boolean) => void} onOpenChange - Callback when menu open state changes
 * @property {boolean} withPortal - Whether to render in a portal
 * @property {string} tooltip - Tooltip text for the trigger
 * @property {boolean} isActive - Whether the menu is in an active state
 */
export type MenuProps = {
  children: React.ReactNode
  trigger: React.ReactNode
  triggerClassName?: string
  customTrigger?: boolean
  isOpen?: boolean
  onOpenChange?: (state: boolean) => void
  withPortal?: boolean
  tooltip?: string
  isActive?: boolean
  side?: 'top' | 'right' | 'bottom' | 'left'
  align?: 'start' | 'center' | 'end'
  sideOffset?: number
}

/**
 * A flexible menu component built on top of Radix UI's Popover.
 * Supports custom triggers, portals, and tooltips.
 *
 * @example
 * ```tsx
 * <Menu
 *   trigger={<Button>Open Menu</Button>}
 *   tooltip="Click to open menu"
 * >
 *   <Item label="Option 1" onClick={() => {}} />
 *   <Item label="Option 2" onClick={() => {}} />
 * </Menu>
 * ```
 */
export const Menu = ({
  customTrigger,
  trigger,
  triggerClassName,
  children,
  isOpen,
  withPortal,
  tooltip,
  onOpenChange,
  side = 'bottom',
  align = 'start',
  sideOffset = 8,
}: MenuProps) => {
  return (
    <Popover.Root onOpenChange={onOpenChange}>
      {customTrigger ? (
        <Trigger asChild>{trigger}</Trigger>
      ) : (
        <Trigger asChild>
          <Toolbar.Button className={triggerClassName} tooltip={!isOpen ? tooltip : ''}>
            {trigger}
          </Toolbar.Button>
        </Trigger>
      )}
      {withPortal ? (
        <Portal>
          <Popover.Content asChild side={side} align={align} sideOffset={sideOffset}>
            <Surface className="min-w-[15rem] p-2 flex flex-col gap-0.5 max-h-80 overflow-auto z-[9999]">
              {children}
            </Surface>
          </Popover.Content>
        </Portal>
      ) : (
        <Popover.Content asChild side={side} align={align} sideOffset={sideOffset}>
          <Surface className="min-w-[15rem] p-2 flex flex-col gap-0.5 max-h-80 overflow-auto z-[9999]">
            {children}
          </Surface>
        </Popover.Content>
      )}
    </Popover.Root>
  )
}

Menu.displayName = 'Menu'

/**
 * Props for menu items
 */
export type ItemProps = {
  label: string | React.ReactNode
  icon?: keyof typeof icons
  iconComponent?: React.ReactNode
  close?: boolean
  disabled?: boolean
  onClick: () => void
  isActive?: boolean
  description?: string
  shortcut?: string[]
}

/**
 * Individual menu item component
 */
export const Item = ({
  label,
  close = true,
  icon,
  iconComponent,
  disabled,
  onClick,
  isActive,
  description,
  shortcut,
}: ItemProps) => {
  const className = cn(
    'flex items-center gap-2 p-1.5 text-sm font-medium text-neutral-500 text-left bg-transparent w-full rounded',
    !isActive &&
      !disabled &&
      'hover:bg-neutral-100 hover:text-neutral-800 dark:hover:bg-neutral-900 dark:hover:text-neutral-200',
    isActive && !disabled && 'bg-neutral-100 text-neutral-800 dark:bg-neutral-900 dark:text-neutral-200',
    disabled && 'text-neutral-400 cursor-not-allowed dark:text-neutral-600',
  )

  const IconComponent = icon ? icons[icon] : null
  const IconCustomComponent = iconComponent || null

  const ItemComponent = close ? Popover.Close : 'button'

  return (
    <ItemComponent className={className} onClick={onClick} disabled={disabled} role="menuitem" aria-disabled={disabled}>
      <div className="flex items-center gap-2 flex-1 min-w-0">
        {IconComponent && <IconComponent className="w-4 h-4 flex-shrink-0" />}
        {IconCustomComponent}
        <div className="flex-1 min-w-0">
          <div className="truncate">{label}</div>
          {description && <div className="text-xs text-neutral-400 dark:text-neutral-500 truncate">{description}</div>}
        </div>
      </div>
      {shortcut && (
        <div className="flex gap-1">
          {shortcut.map((key, i) => (
            <kbd key={i} className="px-1.5 py-0.5 text-xs bg-neutral-100 dark:bg-neutral-800 rounded">
              {key}
            </kbd>
          ))}
        </div>
      )}
    </ItemComponent>
  )
}

/**
 * Props for category titles in menus
 */
export type CategoryTitleProps = {
  children: React.ReactNode
}

/**
 * Category title component for grouping menu items
 */
export const CategoryTitle = ({ children }: CategoryTitleProps) => {
  return (
    <div
      className="mt-4 first:mt-1.5 mb-1.5 text-[0.625rem] font-medium text-neutral-400 dark:text-neutral-600 uppercase select-none px-1"
      role="presentation"
    >
      {children}
    </div>
  )
}

/**
 * Divider component for separating menu items
 */
export const Divider = forwardRef<HTMLHRElement>((props, ref) => {
  return <hr {...props} ref={ref} className="my-1 border-neutral-200 dark:border-neutral-800" role="separator" />
})

Divider.displayName = 'Divider'
