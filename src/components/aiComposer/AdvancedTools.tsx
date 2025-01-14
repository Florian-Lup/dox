import { Globe2, CheckCircle2, Search } from 'lucide-react'
import { useCallback } from 'react'
import { Spinner } from '../ui/Spinner'

const ADVANCED_TOOLS = [
  {
    id: 'localization',
    icon: <Globe2 className="w-4 h-4 text-violet-500" />,
    color: 'text-violet-500',
    label: 'Localization',
    description: 'Adapt content for specific regions and cultures',
  },
  {
    id: 'factCheck',
    icon: <CheckCircle2 className="w-4 h-4 text-emerald-500" />,
    color: 'text-emerald-500',
    label: 'Fact-checking',
    description: 'Verify accuracy of statements and claims',
  },
  {
    id: 'plagiarism',
    icon: <Search className="w-4 h-4 text-sky-500" />,
    color: 'text-sky-500',
    label: 'Plagiarism Check',
    description: 'Check for content originality and citations',
  },
] as const

type AdvancedToolType = (typeof ADVANCED_TOOLS)[number]

interface AdvancedToolsProps {
  onToolSelect?: (tool: AdvancedToolType, data?: any) => void
  processingTool?: string | null
}

export const AdvancedTools = ({ onToolSelect, processingTool }: AdvancedToolsProps) => {
  const handleToolClick = useCallback(
    (tool: AdvancedToolType) => () => {
      onToolSelect?.(tool)
    },
    [onToolSelect],
  )

  const renderToolButton = useCallback(
    (tool: AdvancedToolType) => {
      const isProcessing = processingTool === tool.id
      return (
        <button
          key={tool.label}
          onClick={handleToolClick(tool)}
          className="flex items-center gap-2 sm:gap-3 w-full text-left px-3 sm:px-4 py-2 sm:py-3 
            rounded-lg border border-neutral-200 dark:border-neutral-700 
            hover:bg-neutral-50 dark:hover:bg-neutral-800 transition-colors"
        >
          <span className={`flex-shrink-0 ${isProcessing ? tool.color : ''}`}>
            {isProcessing ? <Spinner className="w-4 h-4" /> : tool.icon}
          </span>
          <div className="min-w-0">
            <div className="text-sm font-medium text-neutral-900 dark:text-white truncate">{tool.label}</div>
            <div className="text-xs text-neutral-500 dark:text-neutral-400 truncate">{tool.description}</div>
          </div>
        </button>
      )
    },
    [handleToolClick, processingTool],
  )

  return (
    <div className="space-y-3 sm:space-y-4">
      <div className="text-sm text-neutral-500 dark:text-neutral-400">Coming Soon</div>
      <div className="flex flex-col gap-2">{ADVANCED_TOOLS.map(renderToolButton)}</div>
    </div>
  )
}
