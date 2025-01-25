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
import { useErrorHandler } from '../../../core/error/hooks/useErrorHandler'

interface UseActionHandlerProps {
  editor: Editor
  scope: Scope
  resetScope: () => void
  modelName: string
  errorHandler?: ReturnType<typeof useErrorHandler>
}

export const useActionHandler = ({ editor, scope, resetScope, modelName, errorHandler }: UseActionHandlerProps) => {
  const [processingAction, setProcessingAction] = useState<string | null>(null)
  const defaultErrorHandler = useErrorHandler()
  const { handleError } = errorHandler || defaultErrorHandler

  const handleActionSelect = useCallback(
    async (action: any, data?: any) => {
      if (action.id === 'grammar') {
        if (!scope.position.text) {
          handleError(new Error('Please select some text before using AI actions.'))
          return
        }
        setProcessingAction('grammar')
        try {
          await handleGrammarFix(editor, scope, modelName)
          resetScope()
        } catch (error) {
          handleError(error as Error)
        } finally {
          setProcessingAction(null)
        }
      } else if (action.id === 'translate') {
        if (data?.targetLanguage) {
          if (!scope.position.text) {
            handleError(new Error('Please select some text before using AI actions.'))
            return
          }
          setProcessingAction('translate')
          try {
            await handleTranslate(editor, scope, modelName, data.targetLanguage)
            resetScope()
          } catch (error) {
            handleError(error as Error)
          } finally {
            setProcessingAction(null)
          }
        }
      } else if (action.id === 'localization') {
        if (data?.targetRegion) {
          if (!scope.position.text) {
            handleError(new Error('Please select some text before using AI actions.'))
            return
          }
          setProcessingAction('localization')
          try {
            await handleLocalize(editor, scope, modelName, data.targetRegion)
            resetScope()
          } catch (error) {
            handleError(error as Error)
          } finally {
            setProcessingAction(null)
          }
        }
      } else if (action.id === 'readability') {
        if (!scope.position.text) {
          handleError(new Error('Please select some text before using AI actions.'))
          return
        }
        setProcessingAction('readability')
        try {
          await handleClarityImprovement(editor, scope, modelName)
          resetScope()
        } catch (error) {
          handleError(error as Error)
        } finally {
          setProcessingAction(null)
        }
      } else if (action.id === 'length') {
        if (data?.percentage !== undefined) {
          if (!scope.position.text) {
            handleError(new Error('Please select some text before using AI actions.'))
            return
          }
          setProcessingAction('length')
          try {
            await handleAdjustLength(editor, scope, modelName, data.percentage)
            resetScope()
          } catch (error) {
            handleError(error as Error)
          } finally {
            setProcessingAction(null)
          }
        }
      } else if (action.id === 'readingLevel') {
        if (data?.readingLevel !== undefined) {
          if (!scope.position.text) {
            handleError(new Error('Please select some text before using AI actions.'))
            return
          }
          setProcessingAction('readingLevel')
          try {
            await handleReadingLevel(editor, scope, modelName, data.readingLevel)
            resetScope()
          } catch (error) {
            handleError(error as Error)
          } finally {
            setProcessingAction(null)
          }
        }
      } else if (action.id === 'audience') {
        if (data?.targetAudience) {
          if (!scope.position.text) {
            handleError(new Error('Please select some text before using AI actions.'))
            return
          }
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
      } else if (action.id === 'tone') {
        if (data?.tone) {
          if (!scope.position.text) {
            handleError(new Error('Please select some text before using AI actions.'))
            return
          }
          setProcessingAction('tone')
          try {
            await handleTone(editor, scope, modelName, data.tone)
            resetScope()
          } catch (error) {
            handleError(error as Error)
          } finally {
            setProcessingAction(null)
          }
        }
      } else if (action.id === 'intent') {
        if (data?.intent) {
          if (!scope.position.text) {
            handleError(new Error('Please select some text before using AI actions.'))
            return
          }
          setProcessingAction('intent')
          try {
            await handleIntent(editor, scope, modelName, data.intent)
            resetScope()
          } catch (error) {
            handleError(error as Error)
          } finally {
            setProcessingAction(null)
          }
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
