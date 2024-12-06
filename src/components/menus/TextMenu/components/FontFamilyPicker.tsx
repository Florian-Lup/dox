import { DropdownButton, DropdownCategoryTitle } from '@/components/ui/Dropdown'
import { Icon } from '@/components/ui/Icon'
import { Surface } from '@/components/ui/Surface'
import { Toolbar } from '@/components/ui/Toolbar'
import * as Dropdown from '@radix-ui/react-dropdown-menu'
import { useCallback } from 'react'

const FONT_FAMILY_GROUPS = [
  {
    label: 'Sans Serif',
    options: [
      { label: 'Inter', value: 'Inter' },
      { label: 'Arial', value: 'Arial, sans-serif' },
      { label: 'Segoe UI', value: '"Segoe UI", sans-serif' },
    ],
  },
  {
    label: 'Serif',
    options: [
      { label: 'Times New Roman', value: '"Times New Roman", serif' },
      { label: 'Georgia', value: 'Georgia, serif' },
      { label: 'Cambria', value: 'Cambria, serif' },
    ],
  },
  {
    label: 'Monospace',
    options: [
      { label: 'Consolas', value: 'Consolas, monospace' },
      { label: 'Courier New', value: '"Courier New", monospace' },
      { label: 'Monaco', value: 'Monaco, monospace' },
    ],
  },
]

const FONT_FAMILIES = FONT_FAMILY_GROUPS.flatMap(group => [group.options]).flat()

export type FontFamilyPickerProps = {
  onChange: (value: string) => void // eslint-disable-line no-unused-vars
  value: string
}

export const FontFamilyPicker = ({ onChange, value }: FontFamilyPickerProps) => {
  const currentValue = FONT_FAMILIES.find(size => size.value === value)
  const currentFontLabel = currentValue?.label.split(' ')[0] || 'Inter'

  const selectFont = useCallback((font: string) => () => onChange(font), [onChange])

  return (
    <Dropdown.Root>
      <Dropdown.Trigger asChild>
        <Toolbar.Button active={!!currentValue?.value}>
          {currentFontLabel}
          <Icon name="ChevronDown" className="w-2 h-2" />
        </Toolbar.Button>
      </Dropdown.Trigger>
      <Dropdown.Content asChild>
        <Surface className="flex flex-col gap-1 px-2 py-4">
          {FONT_FAMILY_GROUPS.flatMap(group =>
            group.options.map(font => (
              <DropdownButton
                isActive={value === font.value}
                onClick={selectFont(font.value)}
                key={`${font.label}_${font.value}`}
              >
                <span style={{ fontFamily: font.value }}>{font.label}</span>
              </DropdownButton>
            )),
          )}
        </Surface>
      </Dropdown.Content>
    </Dropdown.Root>
  )
}
