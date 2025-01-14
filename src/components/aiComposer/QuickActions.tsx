import {
  Code2,
  Wand2,
  MessageSquare,
  FileSearch,
  BrainCircuit,
  Bug,
  GitBranch,
  Sparkles,
  Scale,
  Wrench,
  Type,
  Languages,
  BookOpen,
  Users,
  Palette,
  MessageCircle,
  Target,
  Maximize2,
  Minimize2,
  RefreshCw,
  GraduationCap,
} from 'lucide-react'
import { useCallback, useState } from 'react'
import { Spinner } from '../ui/Spinner'
import { LanguagePicker } from './QuickActions/core/LanguagePicker'

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
    id: 'readability',
    icon: <BookOpen className="w-4 h-4 text-purple-500" />,
    color: 'text-purple-500',
    label: 'Improve Clarity',
    description: 'Enhance sentence flow and refine word choice',
  },
  {
    id: 'audience',
    icon: <Users className="w-4 h-4 text-indigo-500" />,
    color: 'text-indigo-500',
    label: 'Target Audience',
    description: 'Adapt text for a specific audience or expertise level',
  },
  {
    id: 'style',
    icon: <Palette className="w-4 h-4 text-pink-500" />,
    color: 'text-pink-500',
    label: 'Change Style',
    description: 'Modify writing style (academic, casual, professional)',
  },
  {
    id: 'tone',
    icon: <MessageCircle className="w-4 h-4 text-yellow-500" />,
    color: 'text-yellow-500',
    label: 'Change Tone',
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
    id: 'paraphrase',
    icon: <RefreshCw className="w-4 h-4 text-lime-500" />,
    color: 'text-lime-500',
    label: 'Paraphrase',
    description: 'Rewrite text while maintaining original meaning',
  },
  {
    id: 'docs',
    icon: <MessageSquare className="w-4 h-4 text-teal-500" />,
    color: 'text-teal-500',
    label: 'Add documentation',
    description: 'Generate helpful comments and docs',
  },
  {
    id: 'git',
    icon: <GitBranch className="w-4 h-4 text-orange-500" />,
    color: 'text-orange-500',
    label: 'Suggest git message',
    description: 'Generate a commit message',
  },
  {
    id: 'custom',
    icon: <BrainCircuit className="w-4 h-4 text-rose-500" />,
    color: 'text-rose-500',
    label: 'Custom instruction',
    description: 'Give specific instructions',
  },
] as const

type QuickActionType = (typeof QUICK_ACTIONS)[number]

interface QuickActionsProps {
  onActionSelect?: (action: QuickActionType, data?: any) => void
  processingAction?: string | null
}

export const QuickActions = ({ onActionSelect, processingAction }: QuickActionsProps) => {
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

  const renderActionButton = useCallback(
    (action: QuickActionType) => {
      const isProcessing = processingAction === action.id
      const button = (
        <button
          key={action.label}
          onClick={handleActionClick(action)}
          className="flex items-center gap-2 sm:gap-3 w-full text-left px-3 sm:px-4 py-2 sm:py-3 
            rounded-lg border border-neutral-200 dark:border-neutral-700 
            hover:bg-neutral-50 dark:hover:bg-neutral-800 transition-colors"
        >
          <span className={`flex-shrink-0 ${isProcessing ? action.color : ''}`}>
            {isProcessing ? <Spinner className="w-4 h-4" /> : action.icon}
          </span>
          <div className="min-w-0">
            <div className="text-sm font-medium text-neutral-900 dark:text-white truncate">{action.label}</div>
            <div className="text-xs text-neutral-500 dark:text-neutral-400 truncate">{action.description}</div>
          </div>
        </button>
      )

      if (action.id === 'translate') {
        return <LanguagePicker key={action.label} trigger={button} onLanguageSelect={handleLanguageSelect(action)} />
      }

      return button
    },
    [handleActionClick, handleLanguageSelect, processingAction],
  )

  return (
    <div className="space-y-3 sm:space-y-4">
      <div className="text-sm text-neutral-500 dark:text-neutral-400">Quick Actions</div>
      <div className="flex flex-col gap-2">{QUICK_ACTIONS.map(renderActionButton)}</div>
    </div>
  )
}
