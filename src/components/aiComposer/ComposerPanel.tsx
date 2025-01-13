import { motion, AnimatePresence } from 'framer-motion'
import { X } from 'lucide-react'
import { Button } from '../ui/Button'
import { useState, useCallback } from 'react'
import { ModelSelector, LLM_MODELS } from './ModelSelector'
import { ScopeSelector } from './ScopeSelector'
import { useScope } from '@/hooks/useScope'
import { Editor } from '@tiptap/react'
import { QuickActions } from './QuickActions'
import { handleGrammarFix } from './QuickActions/grammar'
import { handleTranslate } from './QuickActions/translate'

interface ComposerPanelProps {
  isOpen: boolean
  onClose: () => void
  editor: Editor
}

export const ComposerPanel = ({ isOpen, onClose, editor }: ComposerPanelProps) => {
  const [selectedModel, setSelectedModel] = useState(LLM_MODELS[0])
  const [inputValue, setInputValue] = useState('')
  const { scope, resetScope } = useScope(editor)
  const [processingAction, setProcessingAction] = useState<string | null>(null)

  const handleSubmit = useCallback(() => {
    if (!inputValue.trim()) return
    // TODO: Handle submission
    console.log('Submitting:', inputValue)
    setInputValue('')
  }, [inputValue])

  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
      if (e.key === 'Enter') {
        if (e.shiftKey) {
          return // Allow new line with Shift+Enter
        }
        e.preventDefault()
        handleSubmit()
      }
    },
    [handleSubmit],
  )

  const handleInputChange = useCallback((e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setInputValue(e.target.value)
  }, [])

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
      }
    },
    [editor, scope, selectedModel.id, resetScope],
  )

  const HeaderContent = () => (
    <div className="flex items-center justify-between p-4 border-b border-neutral-200 dark:border-neutral-800">
      <div className="flex items-center gap-4">
        <ScopeSelector scope={scope} onReset={resetScope} />
        <ModelSelector selectedModel={selectedModel} onModelSelect={setSelectedModel} />
      </div>
      <Button variant="ghost" buttonSize="iconSmall" onClick={onClose}>
        <X className="w-4 h-4" />
      </Button>
    </div>
  )

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 10 }}
          transition={{ duration: 0.2 }}
          className="fixed sm:right-6 sm:top-[61px] sm:bottom-6 sm:w-[400px] 
            max-sm:inset-x-2 max-sm:bottom-2 max-sm:top-[61px]
            bg-white dark:bg-neutral-900 shadow-xl z-[9999] 
            border border-neutral-200 dark:border-neutral-800 rounded-lg 
            flex flex-col"
        >
          <HeaderContent />

          <div className="flex-1 overflow-auto p-2 sm:p-4">
            <QuickActions onActionSelect={handleActionSelect} processingAction={processingAction} />
          </div>
          <div className="p-2 sm:p-4 border-t border-neutral-200 dark:border-neutral-800">
            <div className="relative">
              <textarea
                value={inputValue}
                onChange={handleInputChange}
                onKeyDown={handleKeyDown}
                spellCheck={false}
                autoComplete="off"
                className="w-full h-12 sm:h-16 p-2 sm:p-3 text-sm rounded-lg 
                  border border-neutral-200 dark:border-neutral-700 
                  bg-white dark:bg-neutral-800 text-neutral-900 dark:text-white 
                  placeholder-neutral-500 dark:placeholder-neutral-400 resize-none 
                  focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Ask anything..."
              />
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
