import {
  Type,
  Languages,
  BookOpen,
  Users,
  Palette,
  MessageCircle,
  Target,
  Maximize2,
  RefreshCw,
  GraduationCap,
  Globe2,
  FileText,
  ListTree,
  List,
  Quote,
} from 'lucide-react'
import { useCallback, useRef, useState } from 'react'
import { Spinner } from '@/components/ui/Spinner'
import { Button } from '@/components/ui/Button'
import { LanguagePicker } from './components/LanguagePicker'
import { RegionPicker } from './components/RegionPicker'
import { LengthSlider } from './components/LengthSlider'
import { ReadingLevelSlider } from './components/ReadingLevelSlider'
import { TargetAudienceInput } from './components/TargetAudienceInput'
import { IntentPicker } from './components/IntentPicker'
import { TonePicker } from './components/TonePicker'
import { cn } from '@/lib/utils'

const QUICK_ACTIONS = [
  {
    id: 'grammar',
    icon: <Type className="w-4 h-4 text-blue-500" />,
    color: 'text-blue-500',
    label: 'Fix Grammar',
    description: 'Correct grammar, punctuation and spelling',
  },
  {
    id: 'translate',
    icon: <Languages className="w-4 h-4 text-green-500" />,
    color: 'text-green-500',
    label: 'Translate',
    description: 'Translate text to another language',
  },
  {
    id: 'localization',
    icon: <Globe2 className="w-4 h-4 text-rose-500" />,
    color: 'text-rose-500',
    label: 'Localization',
    description: 'Adapt content for specific regions and cultures',
  },
  {
    id: 'readability',
    icon: <BookOpen className="w-4 h-4 text-purple-500" />,
    color: 'text-purple-500',
    label: 'Improve Clarity',
    description: 'Enhance sentence flow and refine word choice',
  },
  {
    id: 'length',
    icon: <Maximize2 className="w-4 h-4 text-cyan-500" />,
    color: 'text-amber-500',
    label: 'Adjust Length',
    description: 'Expand and condense text while preserving key information',
  },
  {
    id: 'readingLevel',
    icon: <GraduationCap className="w-4 h-4 text-emerald-500" />,
    color: 'text-emerald-500',
    label: 'Reading Level',
    description: 'Analyze and adjust text complexity',
  },
  {
    id: 'audience',
    icon: <Users className="w-4 h-4 text-indigo-500" />,
    color: 'text-indigo-500',
    label: 'Target Audience',
    description: 'Adapt text for a specific audience or expertise level',
  },
  {
    id: 'tone',
    icon: <MessageCircle className="w-4 h-4 text-yellow-500" />,
    color: 'text-yellow-500',
    label: 'Tone',
    description: 'Adjust emotional tone (friendly, formal, enthusiastic)',
  },
  {
    id: 'intent',
    icon: <Target className="w-4 h-4 text-red-500" />,
    color: 'text-red-500',
    label: 'Intent',
    description: 'Optimize text for specific purpose (persuade, inform, engage)',
  },
  {
    id: 'style',
    icon: <Palette className="w-4 h-4 text-pink-500" />,
    color: 'text-pink-500',
    label: 'Style',
    description: 'Modify writing style (academic, casual, professional)',
  },
  {
    id: 'paraphrase',
    icon: <RefreshCw className="w-4 h-4 text-lime-500" />,
    color: 'text-lime-500',
    label: 'Paraphrase',
    description: 'Rewrite text while maintaining original meaning',
  },
  {
    id: 'summarize',
    icon: <FileText className="w-4 h-4 text-orange-500" />,
    color: 'text-orange-500',
    label: 'Summarize',
    description: 'Generate key points and condensed versions of text',
  },
  {
    id: 'structure',
    icon: <ListTree className="w-4 h-4 text-teal-500" />,
    color: 'text-teal-500',
    label: 'Structure',
    description: 'Organize content hierarchically with headings, paragraphs, and list layouts.',
  },
  {
    id: 'bullets',
    icon: <List className="w-4 h-4 text-amber-500" />,
    color: 'text-amber-500',
    label: 'Bullet Points',
    description: 'Convert text into organized bullet points or lists',
  },
  {
    id: 'plagiarism',
    icon: <Quote className="w-4 h-4 text-sky-500" />,
    color: 'text-sky-500',
    label: 'Plagiarism Check',
    description: 'Check for content originality and citations',
  },
] as const

type QuickActionType = (typeof QUICK_ACTIONS)[number]

interface QuickActionsProps {
  onActionSelect?: (action: QuickActionType, data?: any) => void
  processingAction?: string | null
}

export const QuickActions = ({ onActionSelect, processingAction }: QuickActionsProps) => {
  const buttonRefs = useRef<{ [key: string]: HTMLButtonElement | null }>({})
  const [activePopover, setActivePopover] = useState<string | null>(null)

  const scrollToButton = useCallback((id: string) => {
    if (buttonRefs.current[id]) {
      buttonRefs.current[id]?.scrollIntoView({ behavior: 'smooth', block: 'center' })
    }
  }, [])

  const handleButtonRef = useCallback(
    (id: string) => (el: HTMLButtonElement | null) => {
      buttonRefs.current[id] = el
    },
    [],
  )

  const handleTranslateOpen = useCallback(() => {
    setActivePopover('translate')
    scrollToButton('translate')
  }, [scrollToButton])

  const handleLocalizeOpen = useCallback(() => {
    setActivePopover('localization')
    scrollToButton('localization')
  }, [scrollToButton])

  const handleLengthOpen = useCallback(() => {
    setActivePopover('length')
    scrollToButton('length')
  }, [scrollToButton])

  const handleReadingLevelOpen = useCallback(() => {
    setActivePopover('readingLevel')
    scrollToButton('readingLevel')
  }, [scrollToButton])

  const handleAudienceOpen = useCallback(() => {
    setActivePopover('audience')
    scrollToButton('audience')
  }, [scrollToButton])

  const handleToneOpen = useCallback(() => {
    setActivePopover('tone')
    scrollToButton('tone')
  }, [scrollToButton])

  const handleIntentOpen = useCallback(() => {
    setActivePopover('intent')
    scrollToButton('intent')
  }, [scrollToButton])

  const handlePopoverClose = useCallback(() => {
    setActivePopover(null)
  }, [])

  const handleActionClick = useCallback(
    (action: QuickActionType, data?: any) => () => {
      onActionSelect?.(action, data)
    },
    [onActionSelect],
  )

  const handleLanguageSelect = useCallback(
    (action: QuickActionType) => (language: any) => {
      onActionSelect?.(action, { targetLanguage: language })
    },
    [onActionSelect],
  )

  const handleRegionSelect = useCallback(
    (action: QuickActionType) => (region: any) => {
      onActionSelect?.(action, { targetRegion: region })
    },
    [onActionSelect],
  )

  const handleLengthChange = useCallback(
    (action: QuickActionType) => (value: number) => {
      // This is just for live preview/feedback, not the actual API call
      // onActionSelect?.(action, { lengthAdjustment: value })
    },
    [],
  )

  const handleLengthSelect = useCallback(
    (action: QuickActionType) => (percentage: number) => {
      onActionSelect?.(action, { percentage })
    },
    [onActionSelect],
  )

  const handleReadingLevelSelect = useCallback(
    (action: QuickActionType) => (level: number) => {
      onActionSelect?.(action, { readingLevel: level })
    },
    [onActionSelect],
  )

  const handleReadingLevelChange = useCallback(
    (action: QuickActionType) => (value: number) => {
      // This is just for live preview/feedback, not the actual API call
    },
    [],
  )

  const handleTargetAudienceSelect = useCallback(
    (action: QuickActionType) => (audience: string) => {
      onActionSelect?.(action, { targetAudience: audience })
    },
    [onActionSelect],
  )

  const handleToneSelect = useCallback(
    (action: QuickActionType) => (tone: any) => {
      onActionSelect?.(action, { tone })
    },
    [onActionSelect],
  )

  const handleIntentSelect = useCallback(
    (action: QuickActionType) => (intent: any) => {
      onActionSelect?.(action, { intent })
    },
    [onActionSelect],
  )

  const renderActionButton = useCallback(
    (action: QuickActionType) => {
      const isProcessing = processingAction === action.id
      const isAnyProcessing = !!processingAction
      const isActive = activePopover === action.id

      const button = (
        <Button
          ref={handleButtonRef(action.id)}
          key={action.label}
          onClick={
            action.id !== 'length' && action.id !== 'readingLevel' && action.id !== 'audience'
              ? handleActionClick(action)
              : undefined
          }
          variant="ghost"
          disabled={isAnyProcessing}
          className={cn(
            'flex items-center gap-3 w-full text-left px-4 py-3',
            'hover:bg-neutral-50 dark:hover:bg-neutral-800',
            isActive && 'bg-neutral-100 dark:bg-neutral-800',
            isAnyProcessing && !isProcessing && 'opacity-50 cursor-not-allowed',
          )}
        >
          <span className={`flex-shrink-0 ${isProcessing ? action.color : ''}`}>
            {isProcessing ? <Spinner className="w-4 h-4" /> : action.icon}
          </span>
          <div className="min-w-0 flex-1">
            <div className="text-sm font-medium text-neutral-900 dark:text-white truncate">{action.label}</div>
            <div className="text-xs text-neutral-500 dark:text-neutral-400 truncate leading-4">
              {action.description}
            </div>
          </div>
        </Button>
      )

      if (action.id === 'translate') {
        return (
          <LanguagePicker
            key={action.label}
            trigger={button}
            onLanguageSelect={handleLanguageSelect(action)}
            onOpen={handleTranslateOpen}
            onClose={handlePopoverClose}
          />
        )
      }

      if (action.id === 'localization') {
        return (
          <RegionPicker
            key={action.label}
            trigger={button}
            onRegionSelect={handleRegionSelect(action)}
            onOpen={handleLocalizeOpen}
            onClose={handlePopoverClose}
          />
        )
      }

      if (action.id === 'length') {
        return (
          <LengthSlider
            key={action.label}
            trigger={button}
            onValueChange={handleLengthChange(action)}
            onLengthSelect={handleLengthSelect(action)}
            onOpen={handleLengthOpen}
            onClose={handlePopoverClose}
          />
        )
      }

      if (action.id === 'readingLevel') {
        return (
          <ReadingLevelSlider
            key={action.label}
            trigger={button}
            onValueChange={handleReadingLevelChange(action)}
            onReadingLevelSelect={handleReadingLevelSelect(action)}
            onOpen={handleReadingLevelOpen}
            onClose={handlePopoverClose}
          />
        )
      }

      if (action.id === 'audience') {
        return (
          <TargetAudienceInput
            key={action.label}
            trigger={button}
            onTargetAudienceSelect={handleTargetAudienceSelect(action)}
            onOpen={handleAudienceOpen}
            onClose={handlePopoverClose}
          />
        )
      }

      if (action.id === 'tone') {
        return (
          <TonePicker
            key={action.label}
            trigger={button}
            onToneSelect={handleToneSelect(action)}
            onOpen={handleToneOpen}
            onClose={handlePopoverClose}
          />
        )
      }

      if (action.id === 'intent') {
        return (
          <IntentPicker
            key={action.label}
            trigger={button}
            onIntentSelect={handleIntentSelect(action)}
            onOpen={handleIntentOpen}
            onClose={handlePopoverClose}
          />
        )
      }

      return button
    },
    [
      handleActionClick,
      handleLanguageSelect,
      handleRegionSelect,
      handleLengthChange,
      handleLengthSelect,
      handleReadingLevelChange,
      handleReadingLevelSelect,
      handleTargetAudienceSelect,
      handleToneSelect,
      handleIntentSelect,
      handleTranslateOpen,
      handleLocalizeOpen,
      handleLengthOpen,
      handleReadingLevelOpen,
      handleAudienceOpen,
      handleToneOpen,
      handleIntentOpen,
      handlePopoverClose,
      processingAction,
      handleButtonRef,
      activePopover,
    ],
  )

  return (
    <div className="h-full overflow-auto p-4">
      <div className="flex flex-col gap-2">{QUICK_ACTIONS.map(renderActionButton)}</div>
    </div>
  )
}
