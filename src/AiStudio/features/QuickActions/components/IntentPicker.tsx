import { Icon } from '@/components/ui/Icon'
import { useCallback, useRef } from 'react'
import { cn } from '@/lib/utils'
import { ActionPopover, PopoverHeader, PopoverContent, ActionPopoverRef } from './ActionPopover'

const INTENTS = [
  {
    group: 'Informative',
    intents: [
      { code: 'explain', name: 'Explain' },
      { code: 'inform', name: 'Inform' },
      { code: 'describe', name: 'Describe' },
      { code: 'instruct', name: 'Instruct' },
    ],
  },
  {
    group: 'Persuasive',
    intents: [
      { code: 'persuade', name: 'Persuade' },
      { code: 'convince', name: 'Convince' },
      { code: 'motivate', name: 'Motivate' },
      { code: 'inspire', name: 'Inspire' },
      { code: 'sell', name: 'Sell' },
    ],
  },
  {
    group: 'Engaging',
    intents: [
      { code: 'entertain', name: 'Entertain' },
      { code: 'engage', name: 'Engage' },
      { code: 'storytell', name: 'Tell a Story' },
      { code: 'captivate', name: 'Captivate' },
      { code: 'amuse', name: 'Amuse' },
    ],
  },
  {
    group: 'Professional',
    intents: [
      { code: 'report', name: 'Report' },
      { code: 'document', name: 'Document' },
      { code: 'present', name: 'Present' },
      { code: 'review', name: 'Review' },
    ],
  },
] as const

type Intent = (typeof INTENTS)[number]['intents'][number]

interface IntentPickerProps {
  trigger: React.ReactNode
  onIntentSelect?: (intent: Intent) => void
  onOpen?: () => void
  onClose?: () => void
}

const CategoryTitle = ({ children }: { children: React.ReactNode }) => (
  <div className="px-2 py-1.5 text-xs font-medium text-neutral-500 dark:text-neutral-400">{children}</div>
)

const MenuItem = ({
  label,
  iconComponent,
  onClick,
}: {
  label: string
  iconComponent: React.ReactNode
  onClick: () => void
}) => (
  <button
    className={cn(
      'flex w-full items-center gap-2 px-2 py-1.5 text-sm text-neutral-900 dark:text-white hover:bg-neutral-100 dark:hover:bg-neutral-800 transition-colors',
      'focus:outline-none focus:bg-neutral-100 dark:focus:bg-neutral-800',
    )}
    onClick={onClick}
  >
    {iconComponent}
    {label}
  </button>
)

const Divider = () => <div className="my-1 border-t border-neutral-200 dark:border-neutral-800" />

export const IntentPicker = ({ onIntentSelect, trigger, onOpen, onClose }: IntentPickerProps) => {
  const popoverRef = useRef<ActionPopoverRef>(null)

  const handleIntentSelect = useCallback(
    (intent: Intent) => () => {
      onIntentSelect?.(intent)
      popoverRef.current?.close()
    },
    [onIntentSelect],
  )

  return (
    <ActionPopover ref={popoverRef} id="intent" trigger={trigger} onOpen={onOpen} onClose={onClose} maxHeight="260px">
      <PopoverContent>
        <PopoverHeader title="Select Intent" />
        {INTENTS.map(category => (
          <div key={category.group} className="w-full">
            <CategoryTitle>{category.group}</CategoryTitle>
            {category.intents.map(intent => (
              <MenuItem
                key={intent.code}
                label={intent.name}
                iconComponent={<Icon name="Target" className="w-4 h-4" />}
                onClick={handleIntentSelect(intent)}
              />
            ))}
            {category !== INTENTS[INTENTS.length - 1] && <Divider />}
          </div>
        ))}
      </PopoverContent>
    </ActionPopover>
  )
}
