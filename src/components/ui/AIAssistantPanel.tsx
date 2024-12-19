import { motion, AnimatePresence } from 'framer-motion'
import { X, Plus, Eraser, AtSign } from 'lucide-react'
import { Button } from './Button'
import { useState, useCallback, ChangeEvent } from 'react'

interface TooltipProps {
  text: string
  children: React.ReactNode
}

const Tooltip = ({ text, children }: TooltipProps) => (
  <div className="group relative">
    {children}
    <div className="pointer-events-none absolute bottom-full left-1/2 -translate-x-1/2 mb-2 opacity-0 group-hover:opacity-100 transition-opacity">
      <div className="bg-neutral-900 dark:bg-white text-white dark:text-neutral-900 px-2 py-1 rounded text-xs whitespace-nowrap">
        {text}
      </div>
    </div>
  </div>
)

interface AIAssistantPanelProps {
  isOpen: boolean
  onClose: () => void
}

export const AIAssistantPanel = ({ isOpen, onClose }: AIAssistantPanelProps) => {
  const [inputValue, setInputValue] = useState('')

  const handleSubmit = useCallback((e: React.FormEvent) => {
    e.preventDefault()
    // Handle the submission here
    setInputValue('')
  }, [])

  const handleInputChange = useCallback((e: ChangeEvent<HTMLTextAreaElement>) => {
    setInputValue(e.target.value)
  }, [])

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

              <div className="flex items-center justify-end px-3 py-1.5 border-b border-neutral-200 dark:border-neutral-800">
                <div className="flex gap-1">
                  <Button variant="ghost" buttonSize="iconSmall" onClick={onClose}>
                    <Plus className="w-4 h-4" />
                  </Button>
                  <Button variant="ghost" buttonSize="iconSmall" onClick={onClose}>
                    <X className="w-4 h-4" />
                  </Button>
                </div>
              </div>
              <div className="flex-1 overflow-auto p-4">
                <div className="text-sm text-neutral-600 dark:text-neutral-400">AI Assistant panel content...</div>
              </div>
              <form onSubmit={handleSubmit} className="p-4 border-t border-neutral-200 dark:border-neutral-800">
                <div className="flex flex-col gap-2">
                  <textarea
                    value={inputValue}
                    onChange={handleInputChange}
                    placeholder="Type your message..."
                    className="w-full p-3 text-sm rounded-lg border border-neutral-200 dark:border-neutral-700 bg-white dark:bg-neutral-800 focus:outline-none focus:ring-2 focus:ring-blue-500 dark:text-white resize-none"
                    rows={3}
                  />
                  <div className="flex items-center justify-end gap-2">
                    <Tooltip text="Coming Soon">
                      <Button type="button" variant="ghost" buttonSize="small" className="h-7 w-7 p-0">
                        <Eraser className="w-4 h-4" />
                        <span className="sr-only">Tools</span>
                      </Button>
                    </Tooltip>
                    <Tooltip text="Coming Soon">
                      <Button type="button" variant="ghost" buttonSize="small" className="h-7 w-7 p-0">
                        <AtSign className="w-4 h-4" />
                        <span className="sr-only">Context</span>
                      </Button>
                    </Tooltip>
                    <Button type="submit" variant="ghost" buttonSize="small">
                      Send
                    </Button>
                  </div>
                </div>
              </form>
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
            <div className="flex items-center justify-end px-3 py-1.5 border-b border-neutral-200 dark:border-neutral-800">
              <div className="flex gap-1">
                <Button variant="ghost" buttonSize="iconSmall" onClick={onClose}>
                  <Plus className="w-4 h-4" />
                </Button>
                <Button variant="ghost" buttonSize="iconSmall" onClick={onClose}>
                  <X className="w-4 h-4" />
                </Button>
              </div>
            </div>
            <div className="flex-1 overflow-auto p-4">
              <div className="text-sm text-neutral-600 dark:text-neutral-400">AI Assistant panel content...</div>
            </div>
            <form onSubmit={handleSubmit} className="p-4 border-t border-neutral-200 dark:border-neutral-800">
              <div className="flex flex-col gap-2">
                <textarea
                  value={inputValue}
                  onChange={handleInputChange}
                  placeholder="Type your message..."
                  className="w-full p-3 text-sm rounded-lg border border-neutral-200 dark:border-neutral-700 bg-white dark:bg-neutral-800 focus:outline-none focus:ring-2 focus:ring-blue-500 dark:text-white resize-none"
                  rows={3}
                />
                <div className="flex items-center justify-end gap-2">
                  <Tooltip text="Coming Soon">
                    <Button type="button" variant="ghost" buttonSize="small" className="h-7 w-7 p-0">
                      <Eraser className="w-4 h-4" />
                      <span className="sr-only">Tools</span>
                    </Button>
                  </Tooltip>
                  <Tooltip text="Coming Soon">
                    <Button type="button" variant="ghost" buttonSize="small" className="h-7 w-7 p-0">
                      <AtSign className="w-4 h-4" />
                      <span className="sr-only">Context</span>
                    </Button>
                  </Tooltip>
                  <Button type="submit" variant="ghost" buttonSize="small">
                    Send
                  </Button>
                </div>
              </div>
            </form>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  )
}
