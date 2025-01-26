import { ChevronDown, Cpu, X } from 'lucide-react'
import { useCallback, useState } from 'react'
import * as Popover from '@radix-ui/react-popover'
import { cn } from '@/lib/utils'

export const LLM_MODELS = [
  { id: 'gpt-4o', name: 'GPT-4o', description: 'Exceptional at complex reasoning and creative tasks' },
  { id: 'gpt-4o-mini', name: 'GPT-4o-mini', description: 'Balanced performance with faster response times' },
  { id: 'gemini-1.5-pro', name: 'Gemini-1.5-pro', description: 'Excels at long-form content and analysis' },
  { id: 'gemini-1.5-flash', name: 'Gemini-1.5-flash', description: 'Optimized for rapid responses and chat' },
  {
    id: 'claude-3-5-haiku-20241022',
    name: 'Claude-3.5-haiku',
    description: 'Sharp and concise responses with low latency',
  },
  {
    id: 'claude-3-5-sonnet-20241022',
    name: 'Claude-3.5-sonnet',
    description: 'Strong at research and detailed explanations',
  },
  {
    id: 'accounts/fireworks/models/llama-v3p3-70b-instruct',
    name: 'Llama 3.3-70b',
    description: 'Powerful open model with broad capabilities',
  },
  {
    id: 'accounts/fireworks/models/llama-v3p2-3b-instruct',
    name: 'Llama 3.2-1b',
    description: 'Fast responses with efficient resource usage',
  },
  {
    id: 'mistral-large-latest',
    name: 'Mistral Large',
    description: 'Excellent at coding and technical writing',
  },
  {
    id: 'mistral-small-latest',
    name: 'Mistral Small',
    description: 'Quick responses for everyday tasks',
  },
  {
    id: 'grok-2-latest',
    name: 'Grok-2',
    description: 'Strong at current events and witty responses',
  },
  {
    id: 'accounts/fireworks/models/deepseek-v3',
    name: 'Deepseek-v3',
    description: 'Expert at code, math, and scientific tasks',
  },
  {
    id: 'accounts/fireworks/models/qwen2p5-72b-instruct',
    name: 'Qwen-2.5-72b',
    description: 'Superior multilingual and cross-cultural understanding',
  },
] as const

export type LLMModel = (typeof LLM_MODELS)[number]

interface ModelButtonProps {
  model: LLMModel
  isActive: boolean
  onClick: (model: LLMModel) => void
}

const ModelButton = ({ model, isActive, onClick }: ModelButtonProps) => {
  const handleClick = useCallback(() => {
    onClick(model)
  }, [model, onClick])

  return (
    <button
      onClick={handleClick}
      className={cn(
        'flex flex-col gap-0.5 py-1.5 px-2 text-left rounded transition-colors',
        'hover:bg-neutral-100 dark:hover:bg-neutral-800',
        isActive && 'bg-neutral-100 dark:bg-neutral-800',
      )}
    >
      <div className="flex items-center justify-between gap-3">
        <span className="text-sm font-medium text-neutral-900 dark:text-white">{model.name}</span>
        {isActive && (
          <div className="px-1.5 py-0.5 text-[10px] font-medium rounded bg-blue-500 text-white shrink-0">Active</div>
        )}
      </div>
      <span className="text-xs text-neutral-500 dark:text-neutral-400">{model.description}</span>
    </button>
  )
}

interface ModelSelectorProps {
  selectedModel: LLMModel
  onModelSelect: (model: LLMModel) => void
}

export const ModelSelector = ({ selectedModel, onModelSelect }: ModelSelectorProps) => {
  return (
    <Popover.Root>
      <Popover.Trigger asChild>
        <button type="button" className="flex items-center gap-1 text-xs font-medium leading-none group">
          <Cpu className="w-3.5 h-3.5 text-neutral-500 group-hover:text-neutral-700 dark:group-hover:text-neutral-300" />
          <span className="text-neutral-900 dark:text-white group-hover:text-neutral-700 dark:group-hover:text-neutral-300">
            {selectedModel.name}
          </span>
        </button>
      </Popover.Trigger>

      <Popover.Portal>
        <Popover.Content
          align="start"
          side="top"
          sideOffset={8}
          className={cn(
            'w-[280px] p-4',
            'bg-white dark:bg-neutral-900 rounded-lg',
            'shadow-lg border border-neutral-200 dark:border-neutral-800',
            'focus:outline-none select-none z-[9999]',
            'max-h-[400px] overflow-hidden',
          )}
        >
          <div className="space-y-3">
            <div className="flex justify-between items-center">
              <h3 className="text-sm font-medium text-neutral-900 dark:text-white">Model</h3>
              <Popover.Close className="w-6 h-6 rounded-md hover:bg-neutral-100 dark:hover:bg-neutral-800 focus:outline-none flex items-center justify-center">
                <X className="w-4 h-4 text-neutral-500" />
              </Popover.Close>
            </div>
            <p className="text-xs text-neutral-500 dark:text-neutral-400">
              Choose the AI model that best fits your needs. More capable models can handle complex tasks but may be
              slower.
            </p>
            <div className="flex flex-col gap-1.5 overflow-y-auto max-h-[280px] pr-2 -mr-2">
              {LLM_MODELS.map(model => (
                <ModelButton
                  key={model.id}
                  model={model}
                  isActive={selectedModel.id === model.id}
                  onClick={onModelSelect}
                />
              ))}
            </div>
          </div>
        </Popover.Content>
      </Popover.Portal>
    </Popover.Root>
  )
}
