import { DropdownButton } from '@/components/ui/Dropdown'
import { Icon } from '@/components/ui/Icon'
import { Surface } from '@/components/ui/Surface'
import { Toolbar } from '@/components/ui/Toolbar'
import { languages, tones } from '@/lib/constants'
import * as Dropdown from '@radix-ui/react-dropdown-menu'

export type AIDropdownProps = {
  disabled?: boolean
}

export const AIDropdown = ({ disabled = true }: AIDropdownProps) => {
  return (
    <Dropdown.Root>
      <Dropdown.Trigger asChild>
        <Toolbar.Button
          disabled={disabled}
          className="text-purple-500 hover:text-purple-600 active:text-purple-600 dark:text-purple-400 dark:hover:text-purple-300 dark:active:text-purple-400 opacity-50"
          activeClassname="text-purple-600 hover:text-purple-600 dark:text-purple-400 dark:hover:text-purple-200"
        >
          <Icon name="Sparkles" className="mr-1" />
          AI Tools
          <Icon name="ChevronDown" className="w-2 h-2 ml-1" />
        </Toolbar.Button>
      </Dropdown.Trigger>
      <Dropdown.Content asChild>
        <Surface className="p-2 min-w-[10rem]">
          <Dropdown.Item>
            <DropdownButton disabled={disabled}>
              <Icon name="CircleSlash" />
              Simplify
            </DropdownButton>
          </Dropdown.Item>
          <Dropdown.Item>
            <DropdownButton disabled={disabled}>
              <Icon name="Eraser" />
              Fix spelling & grammar
            </DropdownButton>
          </Dropdown.Item>
          <Dropdown.Item>
            <DropdownButton disabled={disabled}>
              <Icon name="ArrowLeftToLine" />
              Make shorter
            </DropdownButton>
          </Dropdown.Item>
          <Dropdown.Item>
            <DropdownButton disabled={disabled}>
              <Icon name="ArrowRightToLine" />
              Make longer
            </DropdownButton>
          </Dropdown.Item>
          <Dropdown.Sub>
            <Dropdown.SubTrigger>
              <DropdownButton disabled={disabled}>
                <Icon name="Mic" />
                Change tone
                <Icon name="ChevronRight" className="w-4 h-4 ml-auto" />
              </DropdownButton>
            </Dropdown.SubTrigger>
            <Dropdown.SubContent>
              <Surface className="flex flex-col min-w-[15rem] p-2 max-h-[20rem] overflow-auto">
                {tones.map(tone => (
                  <Dropdown.Item key={tone.value}>
                    <DropdownButton disabled={disabled}>{tone.label}</DropdownButton>
                  </Dropdown.Item>
                ))}
              </Surface>
            </Dropdown.SubContent>
          </Dropdown.Sub>
          <Dropdown.Item>
            <DropdownButton disabled={disabled}>
              <Icon name="Ellipsis" />
              Tl;dr:
            </DropdownButton>
          </Dropdown.Item>
          <Dropdown.Sub>
            <Dropdown.SubTrigger>
              <DropdownButton disabled={disabled}>
                <Icon name="Languages" />
                Translate
                <Icon name="ChevronRight" className="w-4 h-4 ml-auto" />
              </DropdownButton>
            </Dropdown.SubTrigger>
            <Dropdown.SubContent>
              <Surface className="flex flex-col min-w-[15rem] p-2 max-h-[20rem] overflow-auto">
                {languages.map(lang => (
                  <Dropdown.Item key={lang.value}>
                    <DropdownButton disabled={disabled}>{lang.label}</DropdownButton>
                  </Dropdown.Item>
                ))}
              </Surface>
            </Dropdown.SubContent>
          </Dropdown.Sub>
          <Dropdown.Item>
            <DropdownButton disabled={disabled}>
              <Icon name="PenLine" />
              Complete sentence
            </DropdownButton>
          </Dropdown.Item>
        </Surface>
      </Dropdown.Content>
    </Dropdown.Root>
  )
}
