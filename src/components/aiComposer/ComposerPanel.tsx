import { motion, AnimatePresence } from 'framer-motion'
import { X } from 'lucide-react'
import { Button } from '../ui/Button'
import { useState, useCallback, KeyboardEvent, ChangeEvent, useRef, useEffect } from 'react'

interface ComposerPanelProps {
  isOpen: boolean
  onClose: () => void
}

export const ComposerPanel = ({ isOpen, onClose }: ComposerPanelProps) => {
  const [inputValue, setInputValue] = useState('')
  const textareaRef = useRef<HTMLTextAreaElement>(null)

  const adjustTextareaHeight = useCallback(() => {
    const textarea = textareaRef.current
    if (!textarea) return

    textarea.style.height = '40px' // Reset to minimum height
    const scrollHeight = textarea.scrollHeight
    textarea.style.height = scrollHeight > 150 ? '150px' : `${scrollHeight}px`

    // Toggle overflow based on content height
    if (scrollHeight > 150) {
      textarea.style.overflowY = 'auto'
    } else {
      textarea.style.overflowY = 'hidden'
    }
  }, [])

  useEffect(() => {
    adjustTextareaHeight()
  }, [inputValue, adjustTextareaHeight])

  const handleSubmit = useCallback(
    (e?: React.FormEvent) => {
      e?.preventDefault()
      if (!inputValue.trim()) return
      // Handle the submission here
      setInputValue('')
    },
    [inputValue],
  )

  const handleKeyDown = useCallback(
    (e: KeyboardEvent<HTMLTextAreaElement>) => {
      if (e.key === 'Enter' && !e.shiftKey) {
        e.preventDefault()
        handleSubmit()
      }
    },
    [handleSubmit],
  )

  const handleChange = useCallback((e: ChangeEvent<HTMLTextAreaElement>) => {
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
              transition={{ duration: 0.2 }}
              className="flex flex-col h-full bg-white dark:bg-neutral-900 shadow-xl rounded-t-2xl"
            >
              <div className="flex justify-center p-2">
                <div className="w-10 h-1 rounded-full bg-neutral-200 dark:bg-neutral-700" />
              </div>

              <div className="flex justify-end p-1.5 border-b border-neutral-200 dark:border-neutral-800">
                <Button variant="ghost" buttonSize="iconSmall" onClick={onClose}>
                  <X className="w-4 h-4" />
                </Button>
              </div>

              <div className="flex-1 overflow-auto p-4">
                <div className="text-sm text-neutral-600 dark:text-neutral-400">AI Assistant panel content...</div>
              </div>

              <form onSubmit={handleSubmit} className="p-4 border-t border-neutral-200 dark:border-neutral-800">
                <div className="flex flex-col gap-2">
                  <textarea
                    ref={textareaRef}
                    value={inputValue}
                    onChange={handleChange}
                    onKeyDown={handleKeyDown}
                    placeholder="Type your message..."
                    spellCheck={false}
                    autoComplete="off"
                    className="h-[40px] max-h-[150px] w-full py-2.5 px-3 text-sm rounded-lg border border-neutral-200 dark:border-neutral-700 bg-white dark:bg-neutral-800 focus:outline-none focus:ring-2 focus:ring-blue-500 dark:text-white resize-none [&::-webkit-scrollbar]:w-2 [&::-webkit-scrollbar-thumb]:rounded-lg [&::-webkit-scrollbar-thumb]:bg-neutral-300 hover:[&::-webkit-scrollbar-thumb]:bg-neutral-400 dark:[&::-webkit-scrollbar-thumb]:bg-neutral-700 dark:hover:[&::-webkit-scrollbar-thumb]:bg-neutral-600"
                    rows={1}
                  />
                  <div className="flex justify-end">
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
            transition={{ duration: 0.2 }}
            className="fixed right-6 top-[61px] bottom-6 w-[400px] bg-white dark:bg-neutral-900 shadow-xl z-40 border border-neutral-200 dark:border-neutral-800 rounded-lg hidden sm:flex flex-col"
          >
            <div className="flex justify-end p-1.5 border-b border-neutral-200 dark:border-neutral-800">
              <Button variant="ghost" buttonSize="iconSmall" onClick={onClose}>
                <X className="w-4 h-4" />
              </Button>
            </div>

            <div className="flex-1 overflow-auto p-4">
              <div className="text-sm text-neutral-600 dark:text-neutral-400">AI Assistant panel content...</div>
            </div>

            <form onSubmit={handleSubmit} className="p-4 border-t border-neutral-200 dark:border-neutral-800">
              <div className="flex flex-col gap-2">
                <textarea
                  ref={textareaRef}
                  value={inputValue}
                  onChange={handleChange}
                  onKeyDown={handleKeyDown}
                  placeholder="Type your message..."
                  spellCheck={false}
                  autoComplete="off"
                  className="h-[40px] max-h-[150px] w-full py-2.5 px-3 text-sm rounded-lg border border-neutral-200 dark:border-neutral-700 bg-white dark:bg-neutral-800 focus:outline-none focus:ring-2 focus:ring-blue-500 dark:text-white resize-none [&::-webkit-scrollbar]:w-2 [&::-webkit-scrollbar-thumb]:rounded-lg [&::-webkit-scrollbar-thumb]:bg-neutral-300 hover:[&::-webkit-scrollbar-thumb]:bg-neutral-400 dark:[&::-webkit-scrollbar-thumb]:bg-neutral-700 dark:hover:[&::-webkit-scrollbar-thumb]:bg-neutral-600"
                  rows={1}
                />
                <div className="flex justify-end">
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
