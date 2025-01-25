export interface QuickAction {
  id: string
  icon: JSX.Element
  color: string
  label: string
  description: string
}

export interface QuickActionsProps {
  onActionSelect?: (action: QuickAction, data?: any) => void
  processingAction?: string | null
}

export interface ActionData {
  targetLanguage?: { code: string; name: string }
  percentage?: number
  readingLevel?: number
  targetAudience?: string
}
