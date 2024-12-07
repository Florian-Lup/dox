import { DropdownButton } from '@/components/ui/Dropdown'
import { Icon } from '@/components/ui/Icon'
import { Surface } from '@/components/ui/Surface'
import { Toolbar } from '@/components/ui/Toolbar'
import { languages, tones } from '@/lib/constants'
import * as Dropdown from '@radix-ui/react-dropdown-menu'
import { useCallback } from 'react'

export type AIDropdownProps = {
  disabled?: boolean
  onCompleteSentence: () => any
  onFixSpelling: () => any
  onMakeLonger: () => any
  onMakeShorter: () => any
  onSimplify: () => any
  onTldr: () => any
  onTone: (tone: string) => any
  onTranslate: (language: string) => any
}

export const AIDropdown = ({
  disabled = true,
  onCompleteSentence,
  onFixSpelling,
  onMakeLonger,
  onMakeShorter,
  onSimplify,
  onTldr,
  onTone,
  onTranslate,
}: AIDropdownProps) => {
  const createToneClickHandler = useCallback(
    (tone: string) => () => {
      onTone(tone)
    },
    [onTone],
  )

  const createTranslateClickHandler = useCallback(
    (language: string) => () => {
      onTranslate(language)
    },
    [onTranslate],
  )

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
          <Dropdown.Item onClick={onSimplify}>
            <DropdownButton disabled={disabled}>
              <Icon name="CircleSlash" />
              Simplify
            </DropdownButton>
          </Dropdown.Item>
          <Dropdown.Item onClick={onFixSpelling}>
            <DropdownButton disabled={disabled}>
              <Icon name="Eraser" />
              Fix spelling & grammar
            </DropdownButton>
          </Dropdown.Item>
          <Dropdown.Item onClick={onMakeShorter}>
            <DropdownButton disabled={disabled}>
              <Icon name="ArrowLeftToLine" />
              Make shorter
            </DropdownButton>
          </Dropdown.Item>
          <Dropdown.Item onClick={onMakeLonger}>
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
                  <Dropdown.Item onClick={createToneClickHandler(tone.value)} key={tone.value}>
                    <DropdownButton disabled={disabled}>{tone.label}</DropdownButton>
                  </Dropdown.Item>
                ))}
              </Surface>
            </Dropdown.SubContent>
          </Dropdown.Sub>
          <Dropdown.Item onClick={onTldr}>
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
                  <Dropdown.Item onClick={createTranslateClickHandler(lang.value)} key={lang.value}>
                    <DropdownButton disabled={disabled}>{lang.label}</DropdownButton>
                  </Dropdown.Item>
                ))}
              </Surface>
            </Dropdown.SubContent>
          </Dropdown.Sub>
          <Dropdown.Item onClick={onCompleteSentence}>
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
