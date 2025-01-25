import { Editor } from '@tiptap/react'
import { LLMModel } from '../ai/components/ModelSelector'
import { Scope } from '@/hooks/useScope'
import { TabType } from './hooks/useTabState'
import { QuickAction, ActionData } from '../../features/QuickActions/types'

export interface AiStudioStateProps {
  editor: Editor
}

export interface AiStudioState {
  selectedModel: LLMModel
  setSelectedModel: (model: LLMModel) => void
  scope: {
    scope: Scope
    resetScope: () => void
  }
  activeTab: TabType
  handleTabChange: (isAdvanced: boolean) => void
  processingAction: string | null
  handleActionSelect: (action: QuickAction, data?: ActionData) => void
  showErrorToast: boolean
  errorMessage: string
  setShowErrorToast: (show: boolean) => void
}
