import { motion, AnimatePresence } from 'framer-motion'
import { X } from 'lucide-react'
import { Button } from './Button'

interface AIAssistantPanelProps {
  isOpen: boolean
  onClose: () => void
}

export const AIAssistantPanel = ({ isOpen, onClose }: AIAssistantPanelProps) => {
  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Mobile popup */}
          <div className="fixed inset-x-0 bottom-0 z-40 sm:hidden h-[80vh]">
            <motion.div
              initial={{ y: '100%' }}
              animate={{ y: 0 }}
              exit={{ y: '100%' }}
              transition={{
                type: 'tween',
                duration: 0.2,
                ease: 'easeInOut',
              }}
              className="w-full h-full bg-white dark:bg-neutral-900 shadow-xl rounded-t-2xl flex flex-col"
            >
              {/* Mobile handle for drag indication */}
              <div className="flex justify-center p-2">
                <div className="w-10 h-1 rounded-full bg-neutral-200 dark:bg-neutral-700" />
              </div>

              <div className="flex items-center justify-between px-4 py-2 border-b border-neutral-200 dark:border-neutral-800">
                <h2 className="text-base font-semibold">AI Assistant</h2>
                <Button variant="ghost" buttonSize="icon" onClick={onClose}>
                  <X className="w-4 h-4" />
                </Button>
              </div>
              <div className="flex-1 overflow-auto p-4">
                <div className="text-sm text-neutral-600 dark:text-neutral-400">AI Assistant panel content...</div>
              </div>
            </motion.div>
          </div>

          {/* Desktop floating panel */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 10 }}
            transition={{
              type: 'tween',
              duration: 0.2,
              ease: 'easeInOut',
            }}
            className="fixed right-6 top-[61px] bottom-6 w-[400px] bg-white dark:bg-neutral-900 shadow-xl z-40 border border-neutral-200 dark:border-neutral-800 rounded-lg hidden sm:flex flex-col"
          >
            <div className="flex items-center justify-between p-4 border-b border-neutral-200 dark:border-neutral-800">
              <h2 className="text-lg font-semibold">AI Assistant</h2>
              <Button variant="ghost" buttonSize="icon" onClick={onClose}>
                <X className="w-5 h-5" />
              </Button>
            </div>
            <div className="flex-1 overflow-auto p-4">
              <div className="text-sm text-neutral-600 dark:text-neutral-400">AI Assistant panel content...</div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  )
}
