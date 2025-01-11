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
import { useCallback } from 'react'

const QUICK_ACTIONS = [
  {
    icon: <Type className="w-4 h-4" />,
    label: 'Fix Grammar',
    description: 'Correct grammar and improve writing',
  },
  {
    icon: <Languages className="w-4 h-4" />,
    label: 'Translate',
    description: 'Translate text to another language',
  },
  {
    icon: <Code2 className="w-4 h-4" />,
    label: 'Explain selected code',
    description: 'Get a detailed explanation of the code',
  },
  {
    icon: <Wand2 className="w-4 h-4" />,
    label: 'Improve code quality',
    description: 'Enhance readability and performance',
  },
  {
    icon: <Bug className="w-4 h-4" />,
    label: 'Find and fix bugs',
    description: 'Identify and resolve issues',
  },
  {
    icon: <MessageSquare className="w-4 h-4" />,
    label: 'Add documentation',
    description: 'Generate helpful comments and docs',
  },
  {
    icon: <Scale className="w-4 h-4" />,
    label: 'Optimize performance',
    description: 'Improve code efficiency and speed',
  },
  {
    icon: <GitBranch className="w-4 h-4" />,
    label: 'Suggest git message',
    description: 'Generate a commit message',
  },
  {
    icon: <Sparkles className="w-4 h-4" />,
    label: 'Add types',
    description: 'Generate TypeScript types and interfaces',
  },
  {
    icon: <Wrench className="w-4 h-4" />,
    label: 'Add tests',
    description: 'Generate unit tests for the code',
  },
  {
    icon: <FileSearch className="w-4 h-4" />,
    label: 'Find references',
    description: 'Search through the codebase',
  },
  {
    icon: <BrainCircuit className="w-4 h-4" />,
    label: 'Custom instruction',
    description: 'Give specific instructions',
  },
] as const

interface QuickActionsProps {
  onActionSelect?: (action: (typeof QUICK_ACTIONS)[number]) => void
}

export const QuickActions = ({ onActionSelect }: QuickActionsProps) => {
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
        {QUICK_ACTIONS.map(action => (
          <button
            key={action.label}
            onClick={handleActionClick(action)}
            className="flex items-center gap-2 sm:gap-3 w-full text-left px-3 sm:px-4 py-2 sm:py-3 
              rounded-lg border border-neutral-200 dark:border-neutral-700 
              hover:bg-neutral-50 dark:hover:bg-neutral-800 transition-colors"
          >
            <span className="text-neutral-500 flex-shrink-0">{action.icon}</span>
            <div className="min-w-0">
              <div className="text-sm font-medium text-neutral-900 dark:text-white truncate">{action.label}</div>
              <div className="text-xs text-neutral-500 dark:text-neutral-400 truncate">{action.description}</div>
            </div>
          </button>
        ))}
      </div>
    </div>
  )
}
