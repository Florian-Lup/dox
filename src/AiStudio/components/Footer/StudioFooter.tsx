import { ModelSelector, type LLMModel } from '../../core/ai/components/ModelSelector'
import { ScopeSelector } from '../../core/editor/components/ScopeSelector'
import { TemperatureSelector } from '../../core/ai/components/TemperatureSelector'
import { Scope } from '@/hooks/useScope'
import * as Popover from '@radix-ui/react-popover'
import { Thermometer, X } from 'lucide-react'
import { cn } from '@/lib/utils'

interface StudioFooterProps {
  scope: Scope
  onResetScope: () => void
  selectedModel: LLMModel
  onModelSelect: (model: LLMModel) => void
  temperature?: number
  onTemperatureChange?: (value: number) => void
}

export const StudioFooter = ({
  scope,
  onResetScope,
  selectedModel,
  onModelSelect,
  temperature = 0.5,
  onTemperatureChange = () => {},
}: StudioFooterProps) => {
  return (
    <div className="flex-shrink-0 h-[44px] px-4 border-t border-neutral-200 dark:border-neutral-800">
      <div className="grid grid-cols-3 h-full">
        <div className="flex items-center justify-start">
          <ModelSelector selectedModel={selectedModel} onModelSelect={onModelSelect} />
        </div>
        <div className="flex items-center justify-center">
          <Popover.Root>
            <Popover.Trigger asChild>
              <button type="button" className="flex items-center gap-1 text-xs font-medium leading-none group">
                <Thermometer className="w-3.5 h-3.5 text-neutral-500 group-hover:text-neutral-700 dark:group-hover:text-neutral-300" />
                <span className="text-neutral-900 dark:text-white group-hover:text-neutral-700 dark:group-hover:text-neutral-300">
                  {temperature.toFixed(1)}
                </span>
              </button>
            </Popover.Trigger>
            <Popover.Portal>
              <Popover.Content
                align="center"
                side="top"
                sideOffset={8}
                className={cn(
                  'w-[280px] p-4',
                  'bg-white dark:bg-neutral-900 rounded-lg',
                  'shadow-lg border border-neutral-200 dark:border-neutral-800',
                  'focus:outline-none select-none z-[9999]',
                )}
              >
                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <h3 className="text-sm font-medium text-neutral-900 dark:text-white">Temperature</h3>
                    <Popover.Close className="w-6 h-6 rounded-md hover:bg-neutral-100 dark:hover:bg-neutral-800 focus:outline-none flex items-center justify-center">
                      <X className="w-4 h-4 text-neutral-500" />
                    </Popover.Close>
                  </div>
                  <p className="text-xs text-neutral-500 dark:text-neutral-400">
                    Adjust how deterministic the model&apos;s responses are. Lower values make the output more focused
                    and deterministic.
                  </p>
                  <TemperatureSelector temperature={temperature} onTemperatureChange={onTemperatureChange} />
                </div>
              </Popover.Content>
            </Popover.Portal>
          </Popover.Root>
        </div>
        <div className="flex items-center justify-end">
          <ScopeSelector scope={scope} onReset={onResetScope} />
        </div>
      </div>
    </div>
  )
}
