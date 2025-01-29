import { useCallback, useState } from 'react'
import { Editor } from '@tiptap/react'
import { Scope } from '@/hooks/useScope'
import { handleGrammarFix } from '../actions/FixGrammar'
import { handleTranslate } from '../actions/translate'
import { handleLocalize } from '../actions/localize'
import { handleClarityImprovement } from '../actions/ImproveClarity'
import { handleAdjustLength } from '../actions/AdjustLength'
import { handleReadingLevel } from '../actions/ReadingLevel'
import { handleTargetAudience } from '../actions/TargetAudience'
import { handleTone } from '../actions/tone'
import { handleIntent } from '../actions/intent'
import { handleDomain } from '../actions/domain'
import { handleSummarize } from '../actions/summarize'
import { useErrorHandler } from '../../../core/error/hooks/useErrorHandler'
import { QuickAction, ActionData, ToneOption, IntentOption, DomainOption } from '../types'

interface UseActionHandlerProps {
  editor: Editor
  scope: Scope
  resetScope: () => void
  modelName: string
  temperature: number
  errorHandler?: ReturnType<typeof useErrorHandler>
}

type BaseActionHandler = (
  editor: Editor,
  scope: Scope,
  modelName: string,
  temperature: number,
  onProgress?: (text: string) => void,
) => Promise<void>

type ActionHandlerWithData<T> = (
  editor: Editor,
  scope: Scope,
  modelName: string,
  temperature: number,
  data: T,
  onProgress?: (text: string) => void,
) => Promise<void>

interface ActionConfig<T = void> {
  handler: T extends void ? BaseActionHandler : ActionHandlerWithData<T>
  getData?: (data: ActionData) => T
  requiresData: boolean
}

const actionConfigs: Record<string, ActionConfig<any>> = {
  grammar: { handler: handleGrammarFix, requiresData: false },
  summarize: { handler: handleSummarize, requiresData: false },
  translate: {
    handler: handleTranslate,
    getData: data => data.targetLanguage,
    requiresData: true,
  },
  localization: {
    handler: handleLocalize,
    getData: data => data.targetRegion,
    requiresData: true,
  },
  readability: { handler: handleClarityImprovement, requiresData: false },
  length: {
    handler: handleAdjustLength,
    getData: data => data.percentage,
    requiresData: true,
  },
  readingLevel: {
    handler: handleReadingLevel,
    getData: data => data.readingLevel,
    requiresData: true,
  },
  audience: {
    handler: handleTargetAudience,
    getData: data => data.targetAudience,
    requiresData: true,
  },
  tone: {
    handler: handleTone,
    getData: (data: ActionData): ToneOption => data.tone!,
    requiresData: true,
  },
  intent: {
    handler: handleIntent,
    getData: (data: ActionData): IntentOption => data.intent!,
    requiresData: true,
  },
  domain: {
    handler: handleDomain,
    getData: (data: ActionData): DomainOption => data.domain!,
    requiresData: true,
  },
}

export const useActionHandler = ({
  editor,
  scope,
  resetScope,
  modelName,
  temperature,
  errorHandler,
}: UseActionHandlerProps) => {
  const [processingAction, setProcessingAction] = useState<string | null>(null)
  const defaultErrorHandler = useErrorHandler()
  const { handleError } = errorHandler || defaultErrorHandler

  const handleActionSelect = useCallback(
    async (action: QuickAction, data?: ActionData) => {
      const config = actionConfigs[action.id]
      if (!config) {
        handleError(new Error('Unknown action type'))
        return
      }

      // If action requires data but doesn't have it yet, just return (this is normal for popover actions)
      if (config.requiresData && !data) {
        return
      }

      // Only check for text selection if we're actually executing the action
      if (!scope.position.text) {
        handleError(new Error('Select text and define scope with [ ]'))
        return
      }

      setProcessingAction(action.id)
      try {
        if (config.requiresData && config.getData) {
          const actionData = config.getData(data!)
          await (config.handler as ActionHandlerWithData<any>)(editor, scope, modelName, temperature, actionData)
        } else {
          await (config.handler as BaseActionHandler)(editor, scope, modelName, temperature)
        }
        resetScope()
      } catch (error) {
        handleError(error as Error)
      } finally {
        setProcessingAction(null)
      }
    },
    [editor, scope, modelName, temperature, resetScope, handleError],
  )

  return {
    processingAction,
    handleActionSelect,
  }
}
