import { Icon } from '@/components/ui/Icon'
import { useCallback, useRef } from 'react'
import { cn } from '@/lib/utils'
import { ActionPopover, PopoverHeader, PopoverContent, ActionPopoverRef } from './ActionPopover'

const REGIONS = [
  {
    group: 'English Regions',
    regions: [
      { code: 'en-US', name: 'US English' },
      { code: 'en-GB', name: 'British English' },
      { code: 'en-AU', name: 'Australian English' },
      { code: 'en-CA', name: 'Canadian English' },
      { code: 'en-NZ', name: 'New Zealand English' },
      { code: 'en-IE', name: 'Irish English' },
      { code: 'en-ZA', name: 'South African English' },
    ],
  },
  {
    group: 'Spanish Regions',
    regions: [
      { code: 'es-ES', name: 'European Spanish' },
      { code: 'es-MX', name: 'Mexican Spanish' },
      { code: 'es-AR', name: 'Argentine Spanish' },
      { code: 'es-CO', name: 'Colombian Spanish' },
      { code: 'es-CL', name: 'Chilean Spanish' },
      { code: 'es-PE', name: 'Peruvian Spanish' },
    ],
  },
  {
    group: 'French Regions',
    regions: [
      { code: 'fr-FR', name: 'European French' },
      { code: 'fr-CA', name: 'Canadian French' },
      { code: 'fr-BE', name: 'Belgian French' },
      { code: 'fr-CH', name: 'Swiss French' },
    ],
  },
  {
    group: 'Portuguese Regions',
    regions: [
      { code: 'pt-PT', name: 'European Portuguese' },
      { code: 'pt-BR', name: 'Brazilian Portuguese' },
    ],
  },
  {
    group: 'German Regions',
    regions: [
      { code: 'de-DE', name: 'German German' },
      { code: 'de-AT', name: 'Austrian German' },
      { code: 'de-CH', name: 'Swiss German' },
    ],
  },
  {
    group: 'Chinese Regions',
    regions: [
      { code: 'zh-CN', name: 'Mainland Chinese' },
      { code: 'zh-TW', name: 'Taiwanese Chinese' },
      { code: 'zh-HK', name: 'Hong Kong Chinese' },
      { code: 'zh-SG', name: 'Singaporean Chinese' },
    ],
  },
] as const

type Region = (typeof REGIONS)[number]['regions'][number]

interface RegionPickerProps {
  trigger: React.ReactNode
  onRegionSelect?: (region: Region) => void
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

export const RegionPicker = ({ onRegionSelect, trigger, onOpen, onClose }: RegionPickerProps) => {
  const popoverRef = useRef<ActionPopoverRef>(null)

  const handleRegionSelect = useCallback(
    (region: Region) => () => {
      onRegionSelect?.(region)
      popoverRef.current?.close()
    },
    [onRegionSelect],
  )

  return (
    <ActionPopover ref={popoverRef} id="localize" trigger={trigger} onOpen={onOpen} onClose={onClose} maxHeight="260px">
      <PopoverContent>
        <PopoverHeader title="Select Region" />
        {REGIONS.map(category => (
          <div key={category.group} className="w-full">
            <CategoryTitle>{category.group}</CategoryTitle>
            {category.regions.map(region => (
              <MenuItem
                key={region.code}
                label={region.name}
                iconComponent={<Icon name="Globe" className="w-4 h-4" />}
                onClick={handleRegionSelect(region)}
              />
            ))}
            {category !== REGIONS[REGIONS.length - 1] && <Divider />}
          </div>
        ))}
      </PopoverContent>
    </ActionPopover>
  )
}
