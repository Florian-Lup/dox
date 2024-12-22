import { motion, AnimatePresence } from 'framer-motion'
import {
  X,
  Wand2,
  MessageSquare,
  Code2,
  FileSearch,
  BrainCircuit,
  Bug,
  GitBranch,
  Sparkles,
  Scale,
  Wrench,
  ChevronDown,
} from 'lucide-react'
import { Button } from '../ui/Button'
import { useState, useCallback, KeyboardEvent, ChangeEvent, useRef, useEffect, useMemo } from 'react'

interface ComposerPanelProps {
  isOpen: boolean
  onClose: () => void
}

const LLM_MODELS = [
  { id: 'gpt-4', name: 'GPT-4', description: 'Most capable model, best for complex tasks' },
  { id: 'gpt-3.5-turbo', name: 'GPT-3.5 Turbo', description: 'Faster, good for most tasks' },
  { id: 'claude-2', name: 'Claude 2', description: 'Strong reasoning and analysis' },
  { id: 'code-llama', name: 'Code Llama', description: 'Specialized for code generation' },
]

const QUICK_ACTIONS = [
  {
    icon: <Code2 className="w-4 h-4" />,
    label: 'Explain selected code',
    description: 'Get a detailed explanation of the code',
  },
  {
    icon: <Wand2 className="w-4 h-4" />,
    label: 'Improve code quality',
    description: 'Enhance readability and performance',
  },
  {
    icon: <Bug className="w-4 h-4" />,
    label: 'Find and fix bugs',
    description: 'Identify and resolve issues',
  },
  {
    icon: <MessageSquare className="w-4 h-4" />,
    label: 'Add documentation',
    description: 'Generate helpful comments and docs',
  },
  {
    icon: <Scale className="w-4 h-4" />,
    label: 'Optimize performance',
    description: 'Improve code efficiency and speed',
  },
  {
    icon: <GitBranch className="w-4 h-4" />,
    label: 'Suggest git message',
    description: 'Generate a commit message',
  },
  {
    icon: <Sparkles className="w-4 h-4" />,
    label: 'Add types',
    description: 'Generate TypeScript types and interfaces',
  },
  {
    icon: <Wrench className="w-4 h-4" />,
    label: 'Add tests',
    description: 'Generate unit tests for the code',
  },
  {
    icon: <FileSearch className="w-4 h-4" />,
    label: 'Find references',
    description: 'Search through the codebase',
  },
  {
    icon: <BrainCircuit className="w-4 h-4" />,
    label: 'Custom instruction',
    description: 'Give specific instructions',
  },
]

export const ComposerPanel = ({ isOpen, onClose }: ComposerPanelProps) => {
  const [inputValue, setInputValue] = useState('')
  const [selectedModel, setSelectedModel] = useState(LLM_MODELS[0])
  const [isModelDropdownOpen, setIsModelDropdownOpen] = useState(false)
  const textareaRef = useRef<HTMLTextAreaElement>(null)
  const dropdownRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsModelDropdownOpen(false)
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

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

  const handleModelButtonClick = useCallback(() => {
    setIsModelDropdownOpen(!isModelDropdownOpen)
  }, [isModelDropdownOpen])

  const handleModelSelect = useCallback((model: (typeof LLM_MODELS)[0]) => {
    setSelectedModel(model)
    setIsModelDropdownOpen(false)
  }, [])

  const QuickActions = () => (
    <div className="space-y-4">
      <div className="text-sm text-neutral-500 dark:text-neutral-400">Quick Actions</div>
      <div className="grid grid-cols-1 gap-2">
        {QUICK_ACTIONS.map(({ icon, label, description }) => (
          <button
            key={label}
            className="flex items-center gap-3 w-full text-left px-4 py-3 rounded-lg border border-neutral-200 dark:border-neutral-700 hover:bg-neutral-50 dark:hover:bg-neutral-800 transition-colors"
          >
            <span className="text-neutral-500">{icon}</span>
            <div>
              <div className="text-sm font-medium text-neutral-900 dark:text-white">{label}</div>
              <div className="text-xs text-neutral-500 dark:text-neutral-400">{description}</div>
            </div>
          </button>
        ))}
      </div>
    </div>
  )

  const ModelSelector = () => {
    const modelButtons = useMemo(
      () =>
        LLM_MODELS.map(model => ({
          ...model,
          onClick: () => handleModelSelect(model),
        })),
      [],
    )

    return (
      <div className="relative" ref={dropdownRef}>
        <button
          type="button"
          onClick={handleModelButtonClick}
          className="flex items-center gap-1 text-xs font-medium text-neutral-500 hover:text-neutral-900 dark:hover:text-white transition-colors group"
        >
          {selectedModel.name}
          <motion.div animate={{ rotate: isModelDropdownOpen ? 180 : 0 }} transition={{ duration: 0.2 }}>
            <ChevronDown className="w-3 h-3 text-neutral-400 group-hover:text-neutral-500 dark:group-hover:text-neutral-300" />
          </motion.div>
        </button>

        {isModelDropdownOpen && (
          <div className="absolute bottom-full mb-2 left-0 w-64 bg-white dark:bg-neutral-800 rounded-lg shadow-lg border border-neutral-200 dark:border-neutral-700 overflow-hidden">
            {modelButtons.map(model => (
              <button
                key={model.id}
                onClick={model.onClick}
                className="flex flex-col w-full px-4 py-3 text-left hover:bg-neutral-50 dark:hover:bg-neutral-700/50 transition-colors"
              >
                <span className="text-sm font-medium text-neutral-900 dark:text-white">{model.name}</span>
                <span className="text-xs text-neutral-500 dark:text-neutral-400">{model.description}</span>
              </button>
            ))}
          </div>
        )}
      </div>
    )
  }

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

              <div className="flex items-center justify-between px-4 py-3 border-b border-neutral-200 dark:border-neutral-800">
                <div className="text-xs font-medium text-neutral-900 dark:text-white">Scope @ Full Document</div>
                <Button variant="ghost" buttonSize="iconSmall" onClick={onClose}>
                  <X className="w-4 h-4" />
                </Button>
              </div>

              <div className="flex-1 overflow-auto p-4">
                <QuickActions />
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
                  <div className="flex items-center justify-between">
                    <ModelSelector />
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
            <div className="flex items-center justify-between px-4 py-3 border-b border-neutral-200 dark:border-neutral-800">
              <div className="text-xs font-medium text-neutral-900 dark:text-white">Scope @ Full Document</div>
              <Button variant="ghost" buttonSize="iconSmall" onClick={onClose}>
                <X className="w-4 h-4" />
              </Button>
            </div>

            <div className="flex-1 overflow-auto p-4">
              <QuickActions />
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
                <div className="flex items-center justify-between">
                  <ModelSelector />
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
