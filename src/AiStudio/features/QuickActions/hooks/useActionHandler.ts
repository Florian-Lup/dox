import { useCallback, useState } from 'react'
import { Editor } from '@tiptap/react'
import { Scope } from '@/hooks/useScope'
import { handleGrammarFix } from '../actions/FixGrammar'
import { handleTranslate } from '../actions/translate'
import { handleClarityImprovement } from '../actions/ImproveClarity'
import { handleAdjustLength } from '../actions/AdjustLength'
import { handleReadingLevel } from '../actions/ReadingLevel'
import { handleTargetAudience } from '../actions/TargetAudience'
import { useErrorHandler } from '../../../core/error/hooks/useErrorHandler'

interface UseActionHandlerProps {
  editor: Editor
  scope: Scope
  resetScope: () => void
  modelName: string
}

export const useActionHandler = ({ editor, scope, resetScope, modelName }: UseActionHandlerProps) => {
  const [processingAction, setProcessingAction] = useState<string | null>(null)
  const { handleError } = useErrorHandler()

  const handleActionSelect = useCallback(
    async (action: any, data?: any) => {
      if (action.id === 'grammar') {
        setProcessingAction('grammar')
        try {
          await handleGrammarFix(editor, scope, modelName)
          resetScope()
        } catch (error) {
          handleError(error as Error)
        } finally {
          setProcessingAction(null)
        }
      } else if (action.id === 'translate' && data?.targetLanguage) {
        setProcessingAction('translate')
        try {
          await handleTranslate(editor, scope, modelName, data.targetLanguage)
          resetScope()
        } catch (error) {
          handleError(error as Error)
        } finally {
          setProcessingAction(null)
        }
      } else if (action.id === 'readability') {
        setProcessingAction('readability')
        try {
          await handleClarityImprovement(editor, scope, modelName)
          resetScope()
        } catch (error) {
          handleError(error as Error)
        } finally {
          setProcessingAction(null)
        }
      } else if (action.id === 'length' && data?.percentage !== undefined) {
        setProcessingAction('length')
        try {
          await handleAdjustLength(editor, scope, modelName, data.percentage)
          resetScope()
        } catch (error) {
          handleError(error as Error)
        } finally {
          setProcessingAction(null)
        }
      } else if (action.id === 'readingLevel' && data?.readingLevel !== undefined) {
        setProcessingAction('readingLevel')
        try {
          await handleReadingLevel(editor, scope, modelName, data.readingLevel)
          resetScope()
        } catch (error) {
          handleError(error as Error)
        } finally {
          setProcessingAction(null)
        }
      } else if (action.id === 'audience' && data?.targetAudience) {
        setProcessingAction('audience')
        try {
          await handleTargetAudience(editor, scope, modelName, data.targetAudience)
          resetScope()
        } catch (error) {
          handleError(error as Error)
        } finally {
          setProcessingAction(null)
        }
      }
    },
    [editor, scope, modelName, resetScope, handleError],
  )

  return {
    processingAction,
    handleActionSelect,
  }
}
