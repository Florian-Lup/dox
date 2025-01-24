import { motion, AnimatePresence } from 'framer-motion'
import { useState, useCallback } from 'react'
import { LLM_MODELS, type LLMModel } from './core/ModelSelector'
import { useScope } from '@/hooks/useScope'
import { Editor } from '@tiptap/react'
import { QuickActionList } from './QuickActions/QuickActionList'
import { ChatContainer } from './CustomInstructions/ChatContainer'
import { handleGrammarFix } from './QuickActions/actions/FixGrammar'
import { handleTranslate } from './QuickActions/actions/translate'
import { handleClarityImprovement } from './QuickActions/actions/ImproveClarity'
import { handleAdjustLength } from './QuickActions/actions/AdjustLength'
import { handleReadingLevel } from './QuickActions/actions/ReadingLevel'
import { handleTargetAudience } from './QuickActions/actions/TargetAudience'
import { ComposerFooter } from './ComposerFooter'
import { ComposerHeader } from './ComposerHeader'
import * as Toast from '@radix-ui/react-toast'
import { X } from 'lucide-react'
import { cn } from '@/lib/utils'

type TabType = 'quick' | 'advanced'

interface ComposerPanelProps {
  isOpen: boolean
  onClose: () => void
  editor: Editor
}

export const ComposerPanel = ({ isOpen, onClose, editor }: ComposerPanelProps) => {
  const [selectedModel, setSelectedModel] = useState<LLMModel>(LLM_MODELS[0])
  const { scope, resetScope } = useScope(editor)
  const [processingAction, setProcessingAction] = useState<string | null>(null)
  const [activeTab, setActiveTab] = useState<TabType>('quick')
  const [showErrorToast, setShowErrorToast] = useState(false)
  const [errorMessage, setErrorMessage] = useState('')

  const handleError = (error: Error) => {
    setErrorMessage(error.message)
    setShowErrorToast(true)
  }

  const handleActionSelect = useCallback(
    async (action: any, data?: any) => {
      if (action.id === 'grammar') {
        setProcessingAction('grammar')
        try {
          await handleGrammarFix(editor, scope, selectedModel.id)
          resetScope()
        } catch (error) {
          handleError(error as Error)
        } finally {
          setProcessingAction(null)
        }
      } else if (action.id === 'translate' && data?.targetLanguage) {
        setProcessingAction('translate')
        try {
          await handleTranslate(editor, scope, selectedModel.id, data.targetLanguage)
          resetScope()
        } catch (error) {
          handleError(error as Error)
        } finally {
          setProcessingAction(null)
        }
      } else if (action.id === 'readability') {
        setProcessingAction('readability')
        try {
          await handleClarityImprovement(editor, scope, selectedModel.id)
          resetScope()
        } catch (error) {
          handleError(error as Error)
        } finally {
          setProcessingAction(null)
        }
      } else if (action.id === 'length' && data?.percentage !== undefined) {
        setProcessingAction('length')
        try {
          await handleAdjustLength(editor, scope, selectedModel.id, data.percentage)
          resetScope()
        } catch (error) {
          handleError(error as Error)
        } finally {
          setProcessingAction(null)
        }
      } else if (action.id === 'readingLevel' && data?.readingLevel !== undefined) {
        setProcessingAction('readingLevel')
        try {
          await handleReadingLevel(editor, scope, selectedModel.id, data.readingLevel)
          resetScope()
        } catch (error) {
          handleError(error as Error)
        } finally {
          setProcessingAction(null)
        }
      } else if (action.id === 'audience' && data?.targetAudience) {
        setProcessingAction('audience')
        try {
          await handleTargetAudience(editor, scope, selectedModel.id, data.targetAudience)
          resetScope()
        } catch (error) {
          handleError(error as Error)
        } finally {
          setProcessingAction(null)
        }
      }
    },
    [editor, scope, selectedModel.id, resetScope],
  )

  const handleTabChange = useCallback((isAdvanced: boolean) => {
    setActiveTab(isAdvanced ? 'advanced' : 'quick')
  }, [])

  return (
    <Toast.Provider>
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 10 }}
            transition={{ duration: 0.2 }}
            className="fixed sm:right-6 sm:top-[80px] sm:bottom-6 sm:w-[400px] 
              max-sm:inset-x-2 max-sm:bottom-2 max-sm:top-[80px]"
          >
            <div
              className={cn(
                'h-full flex flex-col',
                'bg-white dark:bg-black rounded-lg',
                'shadow-sm border border-neutral-200 dark:border-neutral-800',
              )}
            >
              <ComposerHeader onClose={onClose} activeTab={activeTab} onTabChange={handleTabChange} />

              <div className="flex-1 min-h-0">
                {activeTab === 'quick' ? (
                  <QuickActionList onActionSelect={handleActionSelect} processingAction={processingAction} />
                ) : (
                  <ChatContainer selectedModel={selectedModel} />
                )}
              </div>

              <ComposerFooter
                scope={scope}
                onResetScope={resetScope}
                selectedModel={selectedModel}
                onModelSelect={setSelectedModel}
              />
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <Toast.Root
        className="bg-red-100 dark:bg-red-900 border border-red-200 dark:border-red-800 rounded-lg shadow-lg p-4 items-center fixed bottom-4 left-4 z-[9999] data-[state=open]:animate-in data-[state=closed]:animate-out data-[swipe=end]:animate-out data-[state=closed]:fade-out-80 data-[state=open]:slide-in-from-bottom-full data-[state=closed]:slide-out-to-left-full"
        open={showErrorToast}
        onOpenChange={setShowErrorToast}
        duration={3000}
      >
        <Toast.Title className="text-sm font-medium text-red-900 dark:text-red-100 flex items-center gap-2">
          <X className="w-4 h-4" />
          {errorMessage}
        </Toast.Title>
      </Toast.Root>
      <Toast.Viewport className="fixed bottom-0 left-0 z-[9999] m-4" />
    </Toast.Provider>
  )
}
