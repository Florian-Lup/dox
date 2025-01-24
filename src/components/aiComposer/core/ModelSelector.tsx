import { ChevronDown } from 'lucide-react'
import { useCallback, useState } from 'react'
import { Tooltip } from '@/components/ui/Tooltip'
import * as Popover from '@radix-ui/react-popover'
import { cn } from '@/lib/utils'

export const LLM_MODELS = [
  { id: 'gpt-4o', name: 'gpt-4o', description: 'Most capable for complex tasks' },
  { id: 'gpt-4o-mini', name: 'gpt-4o-mini', description: 'Fast and cost-effective model' },
  { id: 'gemini-1.5-pro', name: 'gemini-1.5-pro', description: 'Advanced reasoning and long context' },
  { id: 'gemini-1.5-flash', name: 'gemini-1.5-flash', description: 'Quick responses with high efficiency' },
] as const

export type LLMModel = (typeof LLM_MODELS)[number]

interface ModelSelectorProps {
  selectedModel: LLMModel
  onModelSelect: (model: LLMModel) => void
}

export const ModelSelector = ({ selectedModel, onModelSelect }: ModelSelectorProps) => {
  const [isOpen, setIsOpen] = useState(false)

  const handleModelSelect = useCallback(
    (model: LLMModel) => () => {
      onModelSelect(model)
      setIsOpen(false)
    },
    [onModelSelect],
  )

  return (
    <Popover.Root open={isOpen} onOpenChange={setIsOpen}>
      <Popover.Trigger asChild>
        <button type="button" className="flex items-center gap-1 text-xs font-medium leading-none group">
          <Tooltip title="Select the AI model to use for text operations">
            <span className="text-neutral-500">LLM : </span>
          </Tooltip>
          <span className="text-neutral-900 dark:text-white group-hover:text-neutral-700 dark:group-hover:text-neutral-300">
            {selectedModel.name}
          </span>
          <ChevronDown
            className="w-3 h-3 text-neutral-900 dark:text-white group-hover:text-neutral-700 dark:group-hover:text-neutral-300 transition-transform duration-200"
            style={{ transform: isOpen ? 'rotate(180deg)' : 'rotate(0deg)' }}
          />
        </button>
      </Popover.Trigger>

      <Popover.Portal>
        <Popover.Content
          align="start"
          side="bottom"
          sideOffset={4}
          className={cn(
            'min-w-[15rem] p-2 flex flex-col gap-0.5 max-h-80 overflow-auto z-[9999]',
            'bg-white dark:bg-neutral-900 rounded-lg',
            'shadow-lg border border-neutral-200 dark:border-neutral-800',
          )}
        >
          {LLM_MODELS.map(model => (
            <button
              key={model.id}
              onClick={handleModelSelect(model)}
              className={cn(
                'flex items-center gap-2 p-1.5 text-sm font-medium text-left bg-transparent w-full rounded',
                'text-neutral-500 dark:text-neutral-400',
                selectedModel.id === model.id
                  ? 'bg-neutral-100 text-neutral-900 dark:bg-neutral-800 dark:text-white'
                  : 'hover:bg-neutral-100 hover:text-neutral-900 dark:hover:bg-neutral-800 dark:hover:text-white',
              )}
            >
              <div className="flex flex-col gap-0.5">
                <span className="text-sm font-medium">{model.name}</span>
                <span className="text-xs text-neutral-500 dark:text-neutral-400">{model.description}</span>
              </div>
            </button>
          ))}
        </Popover.Content>
      </Popover.Portal>
    </Popover.Root>
  )
}
