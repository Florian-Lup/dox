import { ChevronDown } from 'lucide-react'
import { useCallback, useState } from 'react'
import * as Menu from '@/components/ui/PopoverMenu'
import { Tooltip } from '@/components/ui/Tooltip'

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
    },
    [onModelSelect],
  )

  const trigger = (
    <button type="button" className="flex items-center gap-1 text-xs font-medium group">
      <Tooltip title="Select the AI model to use for text operations">
        <span className="text-neutral-500">LLM : </span>
      </Tooltip>
      <span className="text-neutral-900 dark:text-white">{selectedModel.name}</span>
      <ChevronDown
        className="w-3 h-3 text-neutral-400 group-hover:text-neutral-500 dark:group-hover:text-neutral-300 transition-transform duration-200"
        style={{ transform: isOpen ? 'rotate(180deg)' : 'rotate(0deg)' }}
      />
    </button>
  )

  return (
    <Menu.Menu
      trigger={trigger}
      customTrigger
      align="center"
      side="bottom"
      sideOffset={4}
      isOpen={isOpen}
      onOpenChange={setIsOpen}
    >
      {LLM_MODELS.map(model => (
        <Menu.Item
          key={model.id}
          label={
            <div className="flex flex-col gap-0.5">
              <span className="text-sm font-medium">{model.name}</span>
              <span className="text-xs text-neutral-500 dark:text-neutral-400">{model.description}</span>
            </div>
          }
          onClick={handleModelSelect(model)}
          isActive={selectedModel.id === model.id}
        />
      ))}
    </Menu.Menu>
  )
}
