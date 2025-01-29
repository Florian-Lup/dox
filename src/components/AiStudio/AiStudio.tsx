import { motion, AnimatePresence } from 'framer-motion'
import { Editor } from '@tiptap/react'
import { QuickActions } from './features/QuickActions/QuickActions'
import { StudioFooter } from './components/Footer/StudioFooter'
import { StudioHeader } from './components/Header/StudioHeader'
import * as Toast from '@radix-ui/react-toast'
import { X } from 'lucide-react'
import { cn } from '@/lib/utils'
import { useAiStudioState } from './core/state/hooks/useAiStudioState'
import { ChatContainer } from './features/CustomInstructions/ChatContainer'

interface AiStudioProps {
  isOpen: boolean
  onClose: () => void
  editor: Editor
}

export const AiStudio = ({ isOpen, onClose, editor }: AiStudioProps) => {
  const {
    selectedModel,
    setSelectedModel,
    temperature,
    setTemperature,
    scope,
    activeTab,
    handleTabChange,
    processingAction,
    handleActionSelect,
    showErrorToast,
    errorMessage,
    setShowErrorToast,
  } = useAiStudioState({ editor })

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
              <StudioHeader onClose={onClose} activeTab={activeTab} onTabChange={handleTabChange} />

              <div className="flex-1 min-h-0">
                {activeTab === 'quick' ? (
                  <QuickActions onActionSelect={handleActionSelect} processingAction={processingAction} />
                ) : (
                  <ChatContainer selectedModel={selectedModel} temperature={temperature} />
                )}
              </div>

              <StudioFooter
                scope={scope.scope}
                onResetScope={scope.resetScope}
                selectedModel={selectedModel}
                onModelSelect={setSelectedModel}
                temperature={temperature}
                onTemperatureChange={setTemperature}
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
