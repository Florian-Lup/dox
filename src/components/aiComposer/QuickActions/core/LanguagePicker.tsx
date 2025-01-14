import * as Popover from '@radix-ui/react-popover'
import { Icon } from '@/components/ui/Icon'
import { useCallback, useState } from 'react'

const LANGUAGES = [
  {
    region: 'Europe',
    languages: [
      { code: 'sq', name: 'Albanian' },
      { code: 'hy', name: 'Armenian' },
      { code: 'az', name: 'Azerbaijani' },
      { code: 'be', name: 'Belarusian' },
      { code: 'bs', name: 'Bosnian' },
      { code: 'bg', name: 'Bulgarian' },
      { code: 'hr', name: 'Croatian' },
      { code: 'cs', name: 'Czech' },
      { code: 'da', name: 'Danish' },
      { code: 'nl', name: 'Dutch' },
      { code: 'en', name: 'English' },
      { code: 'et', name: 'Estonian' },
      { code: 'fi', name: 'Finnish' },
      { code: 'fr', name: 'French' },
      { code: 'ka', name: 'Georgian' },
      { code: 'de', name: 'German' },
      { code: 'el', name: 'Greek' },
      { code: 'hu', name: 'Hungarian' },
      { code: 'is', name: 'Icelandic' },
      { code: 'ga', name: 'Irish' },
      { code: 'it', name: 'Italian' },
      { code: 'kk', name: 'Kazakh' },
      { code: 'lv', name: 'Latvian' },
      { code: 'lt', name: 'Lithuanian' },
      { code: 'lb', name: 'Luxembourgish' },
      { code: 'mk', name: 'Macedonian' },
      { code: 'mt', name: 'Maltese' },
      { code: 'no', name: 'Norwegian' },
      { code: 'pl', name: 'Polish' },
      { code: 'pt', name: 'Portuguese' },
      { code: 'ro', name: 'Romanian' },
      { code: 'ru', name: 'Russian' },
      { code: 'sr', name: 'Serbian' },
      { code: 'sk', name: 'Slovak' },
      { code: 'sl', name: 'Slovenian' },
      { code: 'es', name: 'Spanish' },
      { code: 'sv', name: 'Swedish' },
      { code: 'tr', name: 'Turkish' },
      { code: 'uk', name: 'Ukrainian' },
      { code: 'uz', name: 'Uzbek' },
    ],
  },
  {
    region: 'Asia',
    languages: [
      { code: 'ar', name: 'Arabic' },
      { code: 'bn', name: 'Bengali' },
      { code: 'my', name: 'Burmese' },
      { code: 'zh', name: 'Chinese (Mandarin)' },
      { code: 'he', name: 'Hebrew' },
      { code: 'hi', name: 'Hindi' },
      { code: 'id', name: 'Indonesian' },
      { code: 'ja', name: 'Japanese' },
      { code: 'ko', name: 'Korean' },
      { code: 'ku', name: 'Kurdish' },
      { code: 'lo', name: 'Lao' },
      { code: 'ms', name: 'Malay' },
      { code: 'mn', name: 'Mongolian' },
      { code: 'ne', name: 'Nepali' },
      { code: 'tl', name: 'Tagalog (Filipino)' },
      { code: 'th', name: 'Thai' },
      { code: 'ur', name: 'Urdu' },
      { code: 'vi', name: 'Vietnamese' },
    ],
  },
  {
    region: 'Africa',
    languages: [
      { code: 'ha', name: 'Hausa' },
      { code: 'ig', name: 'Igbo' },
      { code: 'sw', name: 'Swahili' },
      { code: 'yo', name: 'Yoruba' },
      { code: 'zu', name: 'Zulu' },
    ],
  },
] as const

type Language = (typeof LANGUAGES)[number]['languages'][number]

interface LanguagePickerProps {
  onLanguageSelect?: (language: Language) => void
  trigger: React.ReactNode
}

export const LanguagePicker = ({ onLanguageSelect, trigger }: LanguagePickerProps) => {
  const [open, setOpen] = useState(false)

  const handleLanguageSelect = useCallback(
    (language: Language) => () => {
      onLanguageSelect?.(language)
      setOpen(false)
    },
    [onLanguageSelect],
  )

  return (
    <Popover.Root open={open} onOpenChange={setOpen}>
      <Popover.Trigger asChild>{trigger}</Popover.Trigger>
      <Popover.Portal>
        <Popover.Content
          side="bottom"
          align="start"
          sideOffset={4}
          className="z-[9999] w-full min-w-[240px]"
          avoidCollisions
        >
          <div className="bg-neutral-100 dark:bg-neutral-800 rounded-lg border border-neutral-200 dark:border-neutral-700 shadow-lg overflow-hidden">
            <div className="max-h-[300px] overflow-auto p-1">
              {LANGUAGES.map(region => (
                <div key={region.region}>
                  <div className="px-3 py-1.5 text-xs font-medium text-neutral-600 dark:text-neutral-300">
                    {region.region}
                  </div>
                  {region.languages.map(language => (
                    <button
                      key={language.code}
                      onClick={handleLanguageSelect(language)}
                      className="flex items-center w-full text-left px-3 py-1.5 text-sm text-neutral-900 dark:text-white
                        rounded-md transition-colors hover:bg-white dark:hover:bg-neutral-700"
                    >
                      <Icon name="Languages" className="w-4 h-4 mr-2 text-neutral-500 dark:text-neutral-400" />
                      {language.name}
                    </button>
                  ))}
                </div>
              ))}
            </div>
          </div>
        </Popover.Content>
      </Popover.Portal>
    </Popover.Root>
  )
}
