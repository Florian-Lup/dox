export interface QuickAction {
  id: string
  icon: JSX.Element
  color: string
  label: string
  description: string
}

export interface QuickActionsProps {
  onActionSelect?: (action: QuickAction, data?: ActionData) => void
  processingAction?: string | null
}

export type LanguageOption = { code: string; name: string }
export type RegionOption = { code: string; name: string }
export type ToneOption = { code: string; name: string }
export type IntentOption = { code: string; name: string }
export type DomainOption = { code: string; name: string }

export interface ActionData {
  targetLanguage?: LanguageOption
  targetRegion?: RegionOption
  percentage?: number
  readingLevel?: number
  targetAudience?: string
  tone?: ToneOption
  intent?: IntentOption
  domain?: DomainOption
}
