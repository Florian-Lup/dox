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
} from 'lucide-react'
import { useCallback, useState } from 'react'
import { Spinner } from '../ui/Spinner'

const QUICK_ACTIONS = [
  {
    id: 'grammar',
    icon: <Type className="w-4 h-4 text-blue-500" />,
    color: 'text-blue-500',
    label: 'Fix Grammar',
    description: 'Correct grammar and improve writing',
  },
  {
    id: 'translate',
    icon: <Languages className="w-4 h-4 text-green-500" />,
    color: 'text-green-500',
    label: 'Translate',
    description: 'Translate text to another language',
  },
  {
    id: 'explain',
    icon: <Code2 className="w-4 h-4 text-purple-500" />,
    color: 'text-purple-500',
    label: 'Explain selected code',
    description: 'Get a detailed explanation of the code',
  },
  {
    id: 'improve',
    icon: <Wand2 className="w-4 h-4 text-indigo-500" />,
    color: 'text-indigo-500',
    label: 'Improve code quality',
    description: 'Enhance readability and performance',
  },
  {
    id: 'bugs',
    icon: <Bug className="w-4 h-4 text-red-500" />,
    color: 'text-red-500',
    label: 'Find and fix bugs',
    description: 'Identify and resolve issues',
  },
  {
    id: 'docs',
    icon: <MessageSquare className="w-4 h-4 text-teal-500" />,
    color: 'text-teal-500',
    label: 'Add documentation',
    description: 'Generate helpful comments and docs',
  },
  {
    id: 'optimize',
    icon: <Scale className="w-4 h-4 text-amber-500" />,
    color: 'text-amber-500',
    label: 'Optimize performance',
    description: 'Improve code efficiency and speed',
  },
  {
    id: 'git',
    icon: <GitBranch className="w-4 h-4 text-orange-500" />,
    color: 'text-orange-500',
    label: 'Suggest git message',
    description: 'Generate a commit message',
  },
  {
    id: 'types',
    icon: <Sparkles className="w-4 h-4 text-pink-500" />,
    color: 'text-pink-500',
    label: 'Add types',
    description: 'Generate TypeScript types and interfaces',
  },
  {
    id: 'tests',
    icon: <Wrench className="w-4 h-4 text-cyan-500" />,
    color: 'text-cyan-500',
    label: 'Add tests',
    description: 'Generate unit tests for the code',
  },
  {
    id: 'references',
    icon: <FileSearch className="w-4 h-4 text-violet-500" />,
    color: 'text-violet-500',
    label: 'Find references',
    description: 'Search through the codebase',
  },
  {
    id: 'custom',
    icon: <BrainCircuit className="w-4 h-4 text-rose-500" />,
    color: 'text-rose-500',
    label: 'Custom instruction',
    description: 'Give specific instructions',
  },
] as const

interface QuickActionsProps {
  onActionSelect?: (action: (typeof QUICK_ACTIONS)[number]) => void
  processingAction?: string | null
}

export const QuickActions = ({ onActionSelect, processingAction }: QuickActionsProps) => {
  const handleActionClick = useCallback(
    (action: (typeof QUICK_ACTIONS)[number]) => () => {
      onActionSelect?.(action)
    },
    [onActionSelect],
  )

  return (
    <div className="space-y-3 sm:space-y-4">
      <div className="text-sm text-neutral-500 dark:text-neutral-400">Quick Actions</div>
      <div className="flex flex-col gap-2">
        {QUICK_ACTIONS.map(action => {
          const isProcessing = processingAction === action.id
          return (
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
        })}
      </div>
    </div>
  )
}
