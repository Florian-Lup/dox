import { Surface } from '../ui/Surface'
import { ModelSelector, type LLMModel } from './core/ModelSelector'
import { ScopeSelector } from './core/ScopeSelector'
import { Scope } from '@/hooks/useScope'

interface ComposerFooterProps {
  scope: Scope
  onResetScope: () => void
  selectedModel: LLMModel
  onModelSelect: (model: LLMModel) => void
}

export const ComposerFooter = ({ scope, onResetScope, selectedModel, onModelSelect }: ComposerFooterProps) => {
  return (
    <Surface className="flex items-center justify-between gap-4 p-4 border-t border-neutral-100 dark:border-neutral-800">
      <ModelSelector selectedModel={selectedModel} onModelSelect={onModelSelect} />
      <ScopeSelector scope={scope} onReset={onResetScope} />
    </Surface>
  )
}
