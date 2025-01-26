import { Icon } from '@/components/ui/Icon'
import { useCallback, useRef } from 'react'
import { cn } from '@/lib/utils'
import { ActionPopover, PopoverHeader, PopoverContent, ActionPopoverRef } from './ActionPopover'

const TONES = [
  {
    group: 'Professional',
    tones: [
      { code: 'formal', name: 'Formal' },
      { code: 'diplomatic', name: 'Diplomatic' },
    ],
  },
  {
    group: 'Casual',
    tones: [
      { code: 'informal', name: 'Informal' },
      { code: 'conversational', name: 'Conversational' },
      { code: 'friendly', name: 'Friendly' },
      { code: 'relaxed', name: 'Relaxed' },
      { code: 'humorous', name: 'Humorous' },
    ],
  },
  {
    group: 'Emotional',
    tones: [
      { code: 'enthusiastic', name: 'Enthusiastic' },
      { code: 'empathetic', name: 'Empathetic' },
      { code: 'inspirational', name: 'Inspirational' },
      { code: 'passionate', name: 'Passionate' },
      { code: 'optimistic', name: 'Optimistic' },
    ],
  },
  {
    group: 'Descriptive',
    tones: [
      { code: 'confident', name: 'Confident' },
      { code: 'authoritative', name: 'Authoritative' },
      { code: 'direct', name: 'Direct' },
      { code: 'neutral', name: 'Neutral' },
      { code: 'objective', name: 'Objective' },
    ],
  },
] as const

type Tone = (typeof TONES)[number]['tones'][number]

interface TonePickerProps {
  trigger: React.ReactNode
  onToneSelect?: (tone: Tone) => void
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

export const TonePicker = ({ onToneSelect, trigger, onOpen, onClose }: TonePickerProps) => {
  const popoverRef = useRef<ActionPopoverRef>(null)

  const handleToneSelect = useCallback(
    (tone: Tone) => () => {
      onToneSelect?.(tone)
      popoverRef.current?.close()
    },
    [onToneSelect],
  )

  return (
    <ActionPopover ref={popoverRef} id="tone" trigger={trigger} onOpen={onOpen} onClose={onClose} maxHeight="260px">
      <PopoverContent>
        <PopoverHeader title="Select Tone" />
        {TONES.map(category => (
          <div key={category.group} className="w-full">
            <CategoryTitle>{category.group}</CategoryTitle>
            {category.tones.map(tone => (
              <MenuItem
                key={tone.code}
                label={tone.name}
                iconComponent={<Icon name="MessageCircle" className="w-4 h-4" />}
                onClick={handleToneSelect(tone)}
              />
            ))}
            {category !== TONES[TONES.length - 1] && <Divider />}
          </div>
        ))}
      </PopoverContent>
    </ActionPopover>
  )
}
