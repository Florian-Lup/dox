import { LLMModel } from './ModelSelector'
import { ModelSelector } from './ModelSelector'
import { ScopeSelector } from './ScopeSelector'
import { Scope } from '@/hooks/useScope'

interface ComposerFooterProps {
  scope: Scope
  onResetScope: () => void
  selectedModel: LLMModel
  onModelSelect: (model: LLMModel) => void
}

export const ComposerFooter = ({ scope, onResetScope, selectedModel, onModelSelect }: ComposerFooterProps) => {
  return (
    <div className="flex-shrink-0 h-[44px] px-4 border-t border-neutral-200 dark:border-neutral-800">
      <div className="grid grid-cols-2 h-full">
        <div className="flex items-center">
          <ModelSelector selectedModel={selectedModel} onModelSelect={onModelSelect} />
        </div>
        <div className="flex items-center">
          <ScopeSelector scope={scope} onReset={onResetScope} />
        </div>
      </div>
    </div>
  )
}
