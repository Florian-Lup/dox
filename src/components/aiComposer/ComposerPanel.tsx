import { motion, AnimatePresence } from 'framer-motion'
import { Surface } from '../ui/Surface'
import { useState, useCallback } from 'react'
import { LLM_MODELS, type LLMModel } from './ModelSelector'
import { useScope } from '@/hooks/useScope'
import { Editor } from '@tiptap/react'
import { QuickActions } from './QuickActions'
import { AdvancedTools } from './AdvancedTools'
import { handleGrammarFix } from './QuickActions/grammar'
import { handleTranslate } from './QuickActions/translate'
import { handleClarityImprovement } from './QuickActions/ImproveClarity'
import { ComposerFooter } from './ComposerFooter'
import { ComposerHeader } from './ComposerHeader'

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

  const handleActionSelect = useCallback(
    async (action: any, data?: any) => {
      if (action.id === 'grammar') {
        setProcessingAction('grammar')
        try {
          await handleGrammarFix(editor, scope, selectedModel.id)
          resetScope()
        } catch (error) {
          console.error('Error fixing grammar:', error)
        } finally {
          setProcessingAction(null)
        }
      } else if (action.id === 'translate' && data?.targetLanguage) {
        setProcessingAction('translate')
        try {
          await handleTranslate(editor, scope, selectedModel.id, data.targetLanguage)
          resetScope()
        } catch (error) {
          console.error('Error translating:', error)
        } finally {
          setProcessingAction(null)
        }
      } else if (action.id === 'readability') {
        setProcessingAction('readability')
        try {
          await handleClarityImprovement(editor, scope, selectedModel.id)
          resetScope()
        } catch (error) {
          console.error('Error improving clarity:', error)
        } finally {
          setProcessingAction(null)
        }
      }
    },
    [editor, scope, selectedModel.id, resetScope],
  )

  const handleToolSelect = useCallback(async (tool: any) => {
    setProcessingAction(tool.id)
    try {
      // TODO: Implement tool handlers
      console.log('Tool selected:', tool.id)
    } catch (error) {
      console.error(`Error processing ${tool.id}:`, error)
    } finally {
      setProcessingAction(null)
    }
  }, [])

  const handleTabChange = useCallback((isAdvanced: boolean) => {
    setActiveTab(isAdvanced ? 'advanced' : 'quick')
  }, [])

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 10 }}
          transition={{ duration: 0.2 }}
          className="fixed sm:right-6 sm:top-[61px] sm:bottom-6 sm:w-[400px] 
            max-sm:inset-x-2 max-sm:bottom-2 max-sm:top-[61px]"
        >
          <Surface className="h-full flex flex-col">
            <ComposerHeader onClose={onClose} activeTab={activeTab} onTabChange={handleTabChange} />

            <div className="flex-1 overflow-auto">
              <div className="p-4">
                {activeTab === 'quick' ? (
                  <QuickActions onActionSelect={handleActionSelect} processingAction={processingAction} />
                ) : (
                  <AdvancedTools onToolSelect={handleToolSelect} processingTool={processingAction} />
                )}
              </div>
            </div>

            <ComposerFooter
              scope={scope}
              onResetScope={resetScope}
              selectedModel={selectedModel}
              onModelSelect={setSelectedModel}
            />
          </Surface>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
